import * as Bd from 'src/components/SelectedBusiness';
import * as unitHelper from 'src/components/Helpers/ProductUnitHelper';

export const getHSNWiseSalesData = async (auditSettings, data) => {
    let result = [];
    const businessData = await Bd.getBusinessData();
   

    const isJewellery =
      businessData.level1Categories &&
      Array.isArray(JSON.parse(businessData.level1Categories)) &&
      JSON.parse(businessData.level1Categories).includes('jewellery_level1');

      const groupedData = {};
        let i = 0;

        data = data.filter(
          (item) =>
            (item.isCancelled === undefined ||
              item.isCancelled === null ||
              item.isCancelled === false) &&
            item.isFullyReturned === false &&
            item.einvoiceBillStatus !== 'Cancelled'
        );

        data.forEach((dataItem) => {
          const item_list = dataItem.item_list;

          item_list.forEach((product) => {
            if (product.hsn && product.hsn.trim().length > 0) {
              if (!groupedData[product.hsn]) {
                i++;
                groupedData[product.hsn] = {
                  num: i,
                  hsn_sc: product.hsn,
                  desc: product.item_name,
                  uqc: '',
                  qty: 0,
                  txval: 0,
                  camt: 0,
                  samt: 0,
                  iamt: 0,
                  csamt: 0,
                  rt: 0
                };
              }

              groupedData[product.hsn].uqc = isJewellery
                ? 'GMS'
                : product.qtyUnit
                ? getUnitShortName(product.qtyUnit)
                : 'PCS';

              const qtyToAdd = isJewellery
                ? parseFloat(product.netWeight) || 1
                : parseFloat(product.qty) - parseFloat(product.returnedQty);

              groupedData[product.hsn].qty = parseFloat(
                (parseFloat(groupedData[product.hsn].qty) || 0) + qtyToAdd
              ).toFixed(2);

              let amt = parseFloat(product.amount);
              let camt = parseFloat(product.cgst_amount);
              let samt = parseFloat(product.sgst_amount);
              let iamt = parseFloat(product.igst_amount);
              let cess = parseFloat(product.cess);

              if (product.returnedQty && product.returnedQty > 0) {
                const returnedQty = parseFloat(product.returnedQty);
                const qty = parseFloat(product.qty);
                amt -= (amt / qty) * returnedQty;
                camt -= (camt / qty) * returnedQty;
                samt -= (samt / qty) * returnedQty;
                iamt -= (iamt / qty) * returnedQty;
                cess -= (cess / qty) * returnedQty;
              }

              const taxableValue =
                amt - (camt || 0) - (samt || 0) - (iamt || 0) - (cess || 0);

              groupedData[product.hsn].txval = parseFloat(
                (parseFloat(groupedData[product.hsn].txval) || 0) +
                  parseFloat(taxableValue)
              ).toFixed(2);

              if (iamt > 0) {
                groupedData[product.hsn].iamt = parseFloat(
                  (parseFloat(groupedData[product.hsn].iamt) || 0) + iamt
                ).toFixed(2);
              }
              groupedData[product.hsn].camt = parseFloat(
                (parseFloat(groupedData[product.hsn].camt) || 0) + camt
              ).toFixed(2);
              groupedData[product.hsn].samt = parseFloat(
                (parseFloat(groupedData[product.hsn].samt) || 0) + samt
              ).toFixed(2);
              groupedData[product.hsn].csamt = parseFloat(
                (parseFloat(groupedData[product.hsn].csamt) || 0) + cess
              ).toFixed(2);

              groupedData[product.hsn].rt = parseFloat(
                product.sgst && product.cgst
                  ? parseFloat((product.sgst + product.cgst).toFixed(2))
                  : product.igst > 0
                  ? parseFloat(product.igst.toFixed(2))
                  : 0
              ).toFixed(2);
            }
          });
        });

        // Process packing charge
        if (data.packingTax) {
          processAdditionalCharges(
            groupedData,
            data.packingTax,
            auditSettings.packingChargeHsn,
            'Packing Charge',
            data.packing_charge
          );
        }

        // Process shipping charge
        if (data.shippingTax) {
          processAdditionalCharges(
            groupedData,
            data.shippingTax,
            auditSettings.shippingChargeHsn,
            'Shipping Charge',
            data.shipping_charge
          );
        }

        // Process insurance charge
        if (data.insurance) {
          processAdditionalCharges(
            groupedData,
            data.insurance,
            auditSettings.insuranceHsn,
            'Insurance',
            data.insurance.amount
          );
        }

        result = Object.values(groupedData).map((data) => {
          data.camt = parseFloat(parseFloat(data.camt).toFixed(2));
          data.csamt = parseFloat(parseFloat(data.csamt).toFixed(2));
          data.samt = parseFloat(parseFloat(data.samt).toFixed(2));
          data.iamt = parseFloat(parseFloat(data.iamt).toFixed(2));
          data.txval = parseFloat(parseFloat(data.txval).toFixed(2));
          data.qty = parseFloat(parseFloat(data.qty).toFixed(2));
          data.rt = parseFloat(parseFloat(data.rt).toFixed(2));
          return data;
        });

        result.sort((a, b) => a.num - b.num);

        return result;
  };

  const processAdditionalCharges = (
    groupedData,
    taxData,
    hsnCode,
    description,
    chargeAmount
  ) => {
    if (hsnCode && hsnCode.trim().length > 0) {
      if (!groupedData[hsnCode]) {
        groupedData[hsnCode] = {
          num: Object.keys(groupedData).length + 1,
          hsn_sc: hsnCode,
          desc: description,
          uqc: 'PCS',
          qty: parseFloat(parseFloat(1).toFixed(2)),
          txval: parseFloat(parseFloat(chargeAmount).toFixed(2)),
          camt: parseFloat(parseFloat(taxData.cgstAmount).toFixed(2)),
          samt: parseFloat(parseFloat(taxData.sgstAmount).toFixed(2)),
          iamt: parseFloat(parseFloat(taxData.igstAmount).toFixed(2)),
          csamt: parseFloat(parseFloat(taxData.cess).toFixed(2)),
          rt: parseFloat(
            taxData.sgst && taxData.cgst
              ? parseFloat((taxData.sgst + taxData.cgst).toFixed(2))
              : taxData.igst > 0
              ? parseFloat(taxData.igst.toFixed(2))
              : 0
          ).toFixed(2)
        };
      } else {
        groupedData[hsnCode].qty = parseFloat(
          (parseFloat(groupedData[hsnCode].qty) || 0) + 1
        ).toFixed(2);
        groupedData[hsnCode].txval = parseFloat(
          (parseFloat(groupedData[hsnCode].txval) || 0) +
            parseFloat(chargeAmount)
        ).toFixed(2);
        groupedData[hsnCode].camt = parseFloat(
          (parseFloat(groupedData[hsnCode].camt) || 0) +
            parseFloat(taxData.cgstAmount)
        ).toFixed(2);
        groupedData[hsnCode].samt = parseFloat(
          (parseFloat(groupedData[hsnCode].samt) || 0) +
            parseFloat(taxData.sgstAmount)
        ).toFixed(2);
        groupedData[hsnCode].iamt = parseFloat(
          (parseFloat(groupedData[hsnCode].iamt) || 0) +
            parseFloat(taxData.igstAmount)
        ).toFixed(2);
        groupedData[hsnCode].csamt = parseFloat(
          (parseFloat(groupedData[hsnCode].csamt) || 0) +
            parseFloat(taxData.cess)
        ).toFixed(2);
        groupedData[hsnCode].rt = parseFloat(
          taxData.sgst && taxData.cgst
            ? parseFloat((taxData.sgst + taxData.cgst).toFixed(2))
            : taxData.igst > 0
            ? parseFloat(taxData.igst.toFixed(2))
            : 0
        ).toFixed(2);
      }
    }
  };

  const getUnitShortName = (qtyUnit) => {
    let unitCodeResult = unitHelper
      .getUnits()
      .find((e) => e.fullName === qtyUnit);

    return unitCodeResult ? unitCodeResult.shortName : 'PCS';
  };