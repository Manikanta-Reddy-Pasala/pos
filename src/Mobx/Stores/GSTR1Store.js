import * as Db from 'src/RxDb/Database/Database';
import { makeObservable, observable, runInAction } from 'mobx';
import * as Bd from 'src/components/SelectedBusiness';
import getStateList from 'src/components/StateList';
import * as taxSettings from 'src/components/Helpers/TaxSettingsHelper';
import Gstr1ErrorObj from 'src/components/Helpers/Classes/Gstr1ErrorObj';
import {
  getCurrentFinancialYear,
  getSelectedDateMonthAndYearMMYYYY
} from 'src/components/Helpers/DateHelper';
import * as unitHelper from 'src/components/Helpers/ProductUnitHelper';
import * as audit from 'src/components/Helpers/AuditHelper';

class GSTR1Store {
  taxdata = {};
  taxDataList = [];
  GSTRDateRange = {};

  prefixData = { sales: '' };

  //sales
  salesData = [];
  //sales return
  salesReturnData = [];
  b2bSalesList = [];
  b2bSalesListJSON = [];
  b2bEInvoiceSalesListJSON = [];
  docErrorsListJSON = [];
  b2clSalesList = [];
  b2csSalesList = [];
  hsnSalesList = [];
  cdnurSalesReturnList = [];
  cdnurSalesReturnListJSON = [];
  cdnrSalesReturnList = [];
  hsnWiseSalesData = [];
  cdnrList = [];
  cdnurList = [];
  cdnrListJSON = [];
  cdnurListJSON = [];
  docIssueSales = [];
  docIssueSalesReturn = [];
  expData = [];
  step = 1;
  reviewStep = 1;
  loginStep = 1;
  GSTR1Data = {};
  gstAuth = false;
  onlineGSTRDialogOpen = false;
  prepareOnlineData = false;
  proceedToOnlineFiling = false;
  b2csaSalesListJSON = [];
  b2baSalesListJSON = [];
  b2claSalesListJSON = [];
  financialYear = getCurrentFinancialYear();
  financialMonth = '01';
  months = [
    { name: 'January', value: '01' },
    { name: 'February', value: '02' },
    { name: 'March', value: '03' },
    { name: 'April', value: '04' },
    { name: 'May', value: '05' },
    { name: 'June', value: '06' },
    { name: 'July', value: '07' },
    { name: 'August', value: '08' },
    { name: 'September', value: '09' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' }
  ];
  GSTRPeriod = '';

  gstr1UploadData = {};

  retSaveReviewStep = 1;
  retSaveSummary = {};
  isSummaryGenerated = false;
  isFiled = false;
  cdnraListJSON = [];
  cdnuraSalesReturnList = [];
  cdnraSalesReturnList = [];
  errorMessage = '';
  openErrorMesssageDialog = false;
  isSaved = false;
  cdnuraSalesReturnListJSON = [];
  nilSalesListData = [];
  nilSalesReturnListData = [];
  expSalesListJSON = [];
  expASalesListJSON = [];
  taxData = {};

  formatDate = (inputDate) => {
    // Split the input date string by the '-' character
    const parts = inputDate.split('-');

    // Ensure there are three parts (year, month, day)
    if (parts.length === 3) {
      // Rearrange the parts and join them with '-' to form the new date string
      return parts[2] + '-' + parts[1] + '-' + parts[0];
    } else {
      // Handle invalid input date string
      return 'Invalid Date';
    }
  };

  setDateRageOfGSTR1 = async (fromDate, toDate) => {
    runInAction(() => {
      this.GSTRDateRange.fromDate = fromDate;
      this.GSTRDateRange.toDate = toDate;
    });
  };

  setFinancialYear = async (value) => {
    runInAction(() => {
      this.financialYear = value;
    });
  };
  setTaxData = async (value) => {
    runInAction(() => {
      this.taxData = value;
    });
  };

  setFinancialMonth = async (value) => {
    runInAction(() => {
      this.financialMonth = value;
    });
  };

  handleErrorAlertClose = () => {
    this.errorMessage = '';
    this.openErrorMesssageDialog = false;
  };

  setIsSaved = (type) => {
    this.isSaved = type;
  };

  handleErrorAlertOpen = (message) => {
    this.errorMessage = message;
    this.openErrorMesssageDialog = true;
  };

  setLoginStep = (step) => {
    this.loginStep = step;
  };

  setGSTRPeriod = async (yearData, monthData) => {
    if (monthData > '03') {
      this.GSTRPeriod = monthData + yearData;
    } else {
      this.GSTRPeriod = monthData + (parseInt(yearData) + 1);
    }
    const year = this.GSTRPeriod.substring(2, 6);
    const month = this.GSTRPeriod.substring(0, 2);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    this.GSTRDateRange.fromDate = `${start.getFullYear()}-${(
      start.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}`;
    this.GSTRDateRange.toDate = `${end.getFullYear()}-${(end.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${end.getDate().toString().padStart(2, '0')}`;
    console.log('this.GSTRDateRange', this.GSTRDateRange);
    console.log('this.GSTRDateRange', end);
  };

  setDateRageOfGSTR1FromDate = async (fromDate) => {
    runInAction(() => {
      this.GSTRDateRange.fromDate = fromDate;
    });
  };

  setDateRageOfGSTR1ToDate = async (toDate) => {
    runInAction(() => {
      this.GSTRDateRange.toDate = toDate;
    });
  };

  pushGSTR1Data = async (data) => {
    runInAction(() => {
      this.GSTR1Data = data;
    });
  };

  getSalesRowData = async () => {
    return this.salesData;
  };

  getSalesReturnRowData = async () => {
    return this.salesReturnData;
  };

  getSalesData = async () => {
    const db = await Db.get();

    let result = [];

    const businessData = await Bd.getBusinessData();

    let filterArray = [
      { businessId: { $eq: businessData.businessId } },
      {
        invoice_date: {
          $gte: this.GSTRDateRange.fromDate
        }
      },
      {
        invoice_date: {
          $lte: this.GSTRDateRange.toDate
        }
      }
    ];

    if (this.prefixData.sales && this.prefixData.sales !== '') {
      let prefixFilter = {};

      if (
        this.prefixData.sales === 'NoPrefix' ||
        this.prefixData.sales === 'AllPrefix'
      ) {
        if (this.prefixData.sales === 'NoPrefix') {
          prefixFilter = {
            prefix: { $exists: false }
          };
        } else if (this.prefixData.sales === 'AllPrefix') {
          prefixFilter = {
            prefix: { $exists: true }
          };
        }
      } else {
        var regexp = new RegExp('^.*' + this.prefixData.sales + '.*$', 'i');
        prefixFilter = {
          prefix: { $regex: regexp }
        };
      }
      filterArray.push(prefixFilter);
    }

    await db.sales
      .find({
        selector: {
          $and: filterArray
        },
        sort: [{ invoice_date: 'asc' }]
      })
      .exec()
      .then((data) => {
        // console.log(data);

        data = data.filter(
          (item) =>
            (item.isCancelled === undefined ||
              item.isCancelled === null ||
              item.isCancelled === false) &&
            item.einvoiceBillStatus !== 'Cancelled'
        );

        // eslint-disable-next-line array-callback-return
        data.map((item) => {
          let row = item.toJSON();
          let items = row.item_list;
          let taxSlabs = new Map();

          for (let item of items) {
            let cess = 0;
            let igst_amount = 0;
            let cgst_amount = 0;
            let sgst_amount = 0;
            let total_tax = 0;
            let amount = 0;
            //add all items tax and amount details in map then finally that many rows in
            if (taxSlabs.has(item.cgst) || taxSlabs.has(item.igst)) {
              let existingRow = {};

              if (taxSlabs.has(item.cgst)) {
                existingRow = taxSlabs.get(item.cgst);
              } else {
                existingRow = taxSlabs.get(item.igst);
              }
              cess = parseFloat(existingRow.cess);
              igst_amount = parseFloat(existingRow.igst_amount);
              cgst_amount = parseFloat(existingRow.cgst_amount);
              sgst_amount = parseFloat(existingRow.sgst_amount);
              total_tax = parseFloat(existingRow.total_tax);
              amount = parseFloat(existingRow.amount);
            }

            cess = cess + parseFloat(item.cess);
            igst_amount =
              parseFloat(igst_amount) + parseFloat(item.igst_amount);
            cgst_amount =
              parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
            sgst_amount =
              parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
            amount = parseFloat(amount) + parseFloat(item.amount);

            total_tax =
              parseFloat(cess) +
              parseFloat(cgst_amount) +
              parseFloat(sgst_amount) +
              parseFloat(igst_amount);

            let tempRow = {};
            tempRow.total_tax = parseFloat(total_tax).toFixed(2);
            tempRow.cess = cess;
            tempRow.igst_amount = parseFloat(igst_amount).toFixed(2);
            tempRow.cgst_amount = parseFloat(cgst_amount).toFixed(2);
            tempRow.sgst_amount = parseFloat(sgst_amount).toFixed(2);
            tempRow.amount = parseFloat(amount).toFixed(2);

            if (item.cgst > 0) {
              taxSlabs.set(item.cgst, tempRow);
            } else {
              taxSlabs.set(item.igst, tempRow);
            }
          }

          taxSlabs.forEach((value, key) => {
            // console.log(value, key);
            let individualTaxSlotRow = item.toJSON();

            let taxRecord = value;
            individualTaxSlotRow.total_tax = parseFloat(
              taxRecord.total_tax
            ).toFixed(2);
            individualTaxSlotRow.cess = taxRecord.cess;
            individualTaxSlotRow.igst_amount = parseFloat(
              taxRecord.igst_amount
            ).toFixed(2);
            individualTaxSlotRow.cgst_amount = parseFloat(
              taxRecord.cgst_amount
            ).toFixed(2);
            individualTaxSlotRow.sgst_amount = parseFloat(
              taxRecord.sgst_amount
            ).toFixed(2);
            individualTaxSlotRow.amount = parseFloat(taxRecord.amount).toFixed(
              2
            );
            if (individualTaxSlotRow.igst_amount > 0) {
              individualTaxSlotRow.tax_percentage = parseFloat(key);
            } else {
              individualTaxSlotRow.tax_percentage = parseFloat(key) * 2;
            }

            result.push(individualTaxSlotRow);
            individualTaxSlotRow = {};
          });
        });

        runInAction(() => {
          this.salesData = result;
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getSalesReturnData = async (fromDate, toDate) => {
    const db = await Db.get();

    var query;
    let result = [];

    const businessData = await Bd.getBusinessData();

    query = db.salesreturn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            date: {
              $gte: fromDate
            }
          },
          {
            date: {
              $lte: toDate
            }
          }
        ]
      }
    });

    await query.exec().then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      data = data.filter(
        (item) =>
          (item.isCancelled === undefined ||
            item.isCancelled === null ||
            item.isCancelled === false) &&
          item.einvoiceBillStatus !== 'Cancelled'
      );

      await this.createDocIssuedSalesReturnList(data);

      data.map((item) => {
        let row = item.toJSON();
        let items = row.item_list;
        let taxSlabs = new Map();

        for (let item of items) {
          let cess = 0;
          let igst_amount = 0;
          let cgst_amount = 0;
          let sgst_amount = 0;
          let total_tax = 0;
          let amount = 0;
          //add all items tax and amount details in map then finally that many rows in
          if (taxSlabs.has(item.cgst) || taxSlabs.has(item.igst)) {
            let existingRow = {};

            if (taxSlabs.has(item.cgst)) {
              existingRow = taxSlabs.get(item.cgst);
            } else {
              existingRow = taxSlabs.get(item.igst);
            }
            cess = parseFloat(existingRow.cess);
            igst_amount = parseFloat(existingRow.igst_amount);
            cgst_amount = parseFloat(existingRow.cgst_amount);
            sgst_amount = parseFloat(existingRow.sgst_amount);
            total_tax = parseFloat(existingRow.total_tax);
            amount = parseFloat(existingRow.amount);
          }

          cess = cess + parseFloat(item.cess);
          igst_amount = parseFloat(igst_amount) + parseFloat(item.igst_amount);
          cgst_amount = parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
          sgst_amount = parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
          amount = parseFloat(amount) + parseFloat(item.amount);

          total_tax =
            parseFloat(cess) +
            parseFloat(cgst_amount) +
            parseFloat(sgst_amount) +
            parseFloat(igst_amount);

          let tempRow = {};
          tempRow.total_tax = parseFloat(total_tax).toFixed(2);
          tempRow.cess = cess;
          tempRow.igst_amount = parseFloat(igst_amount).toFixed(2);
          tempRow.cgst_amount = parseFloat(cgst_amount).toFixed(2);
          tempRow.sgst_amount = parseFloat(sgst_amount).toFixed(2);
          tempRow.amount = parseFloat(amount).toFixed(2);

          if (item.cgst > 0) {
            taxSlabs.set(item.cgst, tempRow);
          } else {
            taxSlabs.set(item.igst, tempRow);
          }
        }

        taxSlabs.forEach((value, key) => {
          // console.log(value, key);
          let individualTaxSlotRow = item.toJSON();

          let taxRecord = value;
          individualTaxSlotRow.total_tax = parseFloat(
            taxRecord.total_tax
          ).toFixed(2);
          individualTaxSlotRow.cess = taxRecord.cess;
          individualTaxSlotRow.igst_amount = parseFloat(
            taxRecord.igst_amount
          ).toFixed(2);
          individualTaxSlotRow.cgst_amount = parseFloat(
            taxRecord.cgst_amount
          ).toFixed(2);
          individualTaxSlotRow.sgst_amount = parseFloat(
            taxRecord.sgst_amount
          ).toFixed(2);
          individualTaxSlotRow.amount = parseFloat(taxRecord.amount).toFixed(2);
          if (individualTaxSlotRow.igst_amount > 0) {
            individualTaxSlotRow.tax_percentage = parseFloat(key);
          } else {
            individualTaxSlotRow.tax_percentage = parseFloat(key) * 2;
          }

          result.push(individualTaxSlotRow);
          individualTaxSlotRow = {};
        });
      });

      runInAction(() => {
        this.salesReturnData = result;
      });
    });
  };

  resetDocErrorsListJSON = async () => {
    runInAction(() => {
      this.docErrorsListJSON = [];
    });
  };

  getB2bSalesDataForGSTR = async (fromDate, toDate) => {
    return new Promise(async (resolve) => {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      await db.sales
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              },
              {
                customerGSTNo: { $ne: '' }
              }
            ]
          }
        })
        .exec()
        .then((data) => {
          data = data.filter(
            (item) =>
              (item.isCancelled === undefined ||
                item.isCancelled === null ||
                item.isCancelled === false) &&
              item.einvoiceBillStatus !== 'Cancelled'
          );

          const selectedData = data.map((item) => ({
            invoice_date: item.invoice_date,
            irnNo: item.irnNo,
            customerGSTNo: item.customerGSTNo,
            placeOfSupplyName: item.placeOfSupplyName,
            sequenceNumber: item.sequenceNumber,
            date: item.date,
            total_amount: item.total_amount,
            balance_amount: item.balance_amount,
            customer_name: item.customer_name,
            sales_return_number: item.sales_return_number,
            payment_type: item.payment_type,
            item_list: item.item_list,
            packingTax: item.packingTax,
            shippingTax: item.shippingTax,
            packing_charge: item.packing_charge,
            shipping_charge: item.shipping_charge,
            insurance: item.insurance,
            invoice_number: item.invoice_number,
            place_of_supply: item.place_of_supply,
            customerState: item.customerState
          }));

          //to prepare JSON data
          this.prepareForB2BJsonFile(selectedData);
          resolve(`got data`);
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    });
  };

  prepareForB2BJsonFile = async (data) => {
    // Transformed B2B format
    const b2b_data = [];
    const groupedData = {};
    const errorList = [];

    let taxData = await taxSettings.getTaxSettingsDetails();

    let defaultState = getStateList().find((e) => e.name === taxData.state);

    for (const row of data) {
      let stateCode;
      if (row.irnNo === null || row.irnNo === '' || row.irnNo === undefined) {
        if (
          row.customerGSTNo === null ||
          row.customerGSTNo === '' ||
          row.customerGSTNo === undefined
        ) {
          continue;
        }

        const ctin = row.customerGSTNo;

        if (!groupedData[ctin]) {
          groupedData[ctin] = [];
        }

        const stateCodeData = getStateList().find(
          (e) => e.name === row.placeOfSupplyName
        );

        if (stateCodeData && stateCodeData !== null) {
          stateCode = stateCodeData.code;
        }

        const invoice = {
          inum: row.sequenceNumber,
          idt: this.dateFormatter(row.invoice_date),
          val: parseFloat(row.total_amount.toFixed(2)),
          pos: stateCode ? stateCode : defaultState ? defaultState.code : '',
          rchrg: 'N', // Reverse charge
          itms: [],
          inv_typ: 'R' // This field represents the invoice type of the original invoice for which the credit or debit note is issued.
          //sply_ty: '', // This field represents the type of supply made, whether it is an interstate supply, intrastate supply, or a supply made to a SEZ (Special Economic Zone) unit or developer.
          //expt_amt: 0, // Value of exported goods or services
          //nil_amt: 0, // Value of nil-rated, exempted, and non-GST supplies
          //ngsup_amt: 0 // Value of supplies made to unregistered persons
        };

        //get all documents having issues
        let totalTxVal = 0;
        let isErrorObj = false;
        let errorMessages = [];
        let itemMessage =
          '<br /> B2B Error Summary: ' +
          '<br /><br /><b>Invoice No: </b>' +
          row.sequenceNumber +
          '<br />';

        if (ctin === '' || ctin === undefined) {
          isErrorObj = true;
          errorMessages.push('No Valid GST number found for Customer');

          itemMessage += 'No Valid GST number found for Customer<br />';
        }

        if (
          row.placeOfSupplyName === '' ||
          row.placeOfSupplyName === undefined
        ) {
          itemMessage += 'Place of Supply not defined<br />';
        }

        let isCGSTSGST = true;
        if (taxData && taxData.gstin && taxData.gstin !== '') {
          let businessStateCode = taxData.gstin.slice(0, 2);
          if (row.customerGSTNo && row.customerGSTNo !== '') {
            let customerExtractedStateCode = row.customerGSTNo.slice(0, 2);
            if (
              businessStateCode !== '' &&
              customerExtractedStateCode !== '' &&
              businessStateCode === customerExtractedStateCode
            ) {
              isCGSTSGST = true;
            } else {
              isCGSTSGST = false;
            }
          } else if (row.customerState && row.customerState !== '') {
            let result = getStateList().find(
              (e) => e.code === businessStateCode
            );
            if (result) {
              let businessState = result.name;
              if (
                row.customerState !== '' &&
                row.customerState !== null &&
                businessState !== '' &&
                businessState !== null &&
                row.customerState.toLowerCase() === businessState.toLowerCase()
              ) {
                isCGSTSGST = true;
              } else {
                isCGSTSGST = false;
              }
            }
          }
        }

        let product_id = 0;
        const itemDetailsDictionary = {}; // To store item details with the same "rt"

        for (const item of row.item_list) {
          if (item.taxType === 'Nil-Rated' || item.taxType === 'Exempted') {
            continue;
          }

          product_id = product_id + 1;
          let taxableValue = 0;

          let cgstAmt = parseFloat(item.cgst_amount);
          let sgstAmt = parseFloat(item.sgst_amount);
          let igstAmt = parseFloat(item.igst_amount);
          let cess = parseFloat(item.cess);

          taxableValue =
            parseFloat(item.amount) -
            (parseFloat(cgstAmt) +
              parseFloat(sgstAmt) +
              parseFloat(igstAmt) +
              parseFloat(cess));

          let itemDetails;
          if (item.igst_amount > 0) {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  item.sgst && item.cgst
                    ? parseFloat((item.sgst + item.cgst).toFixed(2))
                    : item.igst > 0
                    ? parseFloat(item.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
              }
            };
          } else {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  item.sgst && item.cgst
                    ? parseFloat((item.sgst + item.cgst).toFixed(2))
                    : item.igst > 0
                    ? parseFloat(item.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
                samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
                csamt: parseFloat(cess.toFixed(2)) || 0 // Cess amount
              }
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];
            existingItemDetails.itm_det.txval =
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval);

            existingItemDetails.itm_det.txval = parseFloat(
              parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.itm_det.camt =
                parseFloat(existingItemDetails.itm_det.camt) +
                parseFloat(itemDetails.itm_det.camt);
              existingItemDetails.itm_det.samt =
                parseFloat(existingItemDetails.itm_det.samt) +
                parseFloat(itemDetails.itm_det.samt);

              existingItemDetails.itm_det.camt = parseFloat(
                existingItemDetails.itm_det.camt.toFixed(2)
              );
              existingItemDetails.itm_det.samt = parseFloat(
                existingItemDetails.itm_det.samt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
              (parseFloat(itemDetails.itm_det.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }

          let prodMessage = '';
          let product = item;
          totalTxVal += taxableValue;

          if (
            product.cgst_amount === 0 &&
            product.sgst_amount === 0 &&
            product.igst_amount === 0 &&
            (product.discount_percent === 0 ||
              product.discount_percent == null ||
              product.discount_percent === undefined)
          ) {
            isErrorObj = true;
            errorMessages.push(
              'No Valid GST found for product id:' + product.num
            );
            prodMessage += 'Tax rate is not defined<br />';
          } else if (isCGSTSGST === true && product.igst_amount > 0) {
            isErrorObj = true;
            prodMessage +=
              'IGST Tax rate is defined. It should be CGST-SGST \n';
          } else if (isCGSTSGST === false && product.cgst_amount > 0) {
            isErrorObj = true;
            prodMessage +=
              'CGST-SGST Tax rate is defined. It should be IGST \n';
          }

          if (
            product.hsn === '' ||
            product.hsn === null ||
            product.hsn === undefined
          ) {
            isErrorObj = true;
            prodMessage += 'HSN is not defined<br />';
          } else if (product.hsn !== '') {
            if (
              product.hsn.length === 4 ||
              product.hsn.length === 6 ||
              product.hsn.length === 8
            ) {
              // do nothing
            } else {
              isErrorObj = true;
              prodMessage += 'HSN code length is not valid<br />';
            }
          }

          if (prodMessage !== '') {
            let slNo = product_id + 1;
            itemMessage +=
              '<br /><b>Sl No: </b>' +
              slNo +
              '<br /><b>Product Name: </b>' +
              product.item_name +
              '<br />';
            itemMessage += prodMessage;
          }
        }

        // Preparing Packing Charge
        if (row.packingTax) {
          let taxableValue = 0;

          let cgstAmt = parseFloat(row.packingTax.cgstAmount);
          let sgstAmt = parseFloat(row.packingTax.sgstAmount);
          let igstAmt = parseFloat(row.packingTax.igstAmount);

          taxableValue = parseFloat(row.packing_charge);

          let itemDetails;
          if (igstAmt > 0) {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.packingTax.sgst && row.packingTax.cgst
                    ? parseFloat(
                        (row.packingTax.sgst + row.packingTax.cgst).toFixed(2)
                      )
                    : row.packingTax.igst > 0
                    ? parseFloat(row.packingTax.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
              }
            };
          } else {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.packingTax.sgst && row.packingTax.cgst
                    ? parseFloat(
                        (row.packingTax.sgst + row.packingTax.cgst).toFixed(2)
                      )
                    : row.packingTax.igst > 0
                    ? parseFloat(row.packingTax.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
                samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
                csamt: 0 // Cess amount
              }
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];
            existingItemDetails.itm_det.txval =
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval);

            existingItemDetails.itm_det.txval = parseFloat(
              parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.itm_det.camt =
                parseFloat(existingItemDetails.itm_det.camt) +
                parseFloat(itemDetails.itm_det.camt);
              existingItemDetails.itm_det.samt =
                parseFloat(existingItemDetails.itm_det.samt) +
                parseFloat(itemDetails.itm_det.samt);

              existingItemDetails.itm_det.camt = parseFloat(
                existingItemDetails.itm_det.camt.toFixed(2)
              );
              existingItemDetails.itm_det.samt = parseFloat(
                existingItemDetails.itm_det.samt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
              (parseFloat(itemDetails.itm_det.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }
        }

        // Preparing Shipping Charge
        if (row.shippingTax) {
          let taxableValue = 0;

          let cgstAmt = parseFloat(row.shippingTax.cgstAmount);
          let sgstAmt = parseFloat(row.shippingTax.sgstAmount);
          let igstAmt = parseFloat(row.shippingTax.igstAmount);

          taxableValue = parseFloat(row.shipping_charge);

          let itemDetails;
          if (igstAmt > 0) {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.shippingTax.sgst && row.shippingTax.cgst
                    ? parseFloat(
                        (row.shippingTax.sgst + row.shippingTax.cgst).toFixed(2)
                      )
                    : row.shippingTax.igst > 0
                    ? parseFloat(row.shippingTax.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
              }
            };
          } else {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.shippingTax.sgst && row.shippingTax.cgst
                    ? parseFloat(
                        (row.shippingTax.sgst + row.shippingTax.cgst).toFixed(2)
                      )
                    : row.shippingTax.igst > 0
                    ? parseFloat(row.shippingTax.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
                samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
                csamt: 0 // Cess amount
              }
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];
            existingItemDetails.itm_det.txval =
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval);

            existingItemDetails.itm_det.txval = parseFloat(
              parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.itm_det.camt =
                parseFloat(existingItemDetails.itm_det.camt) +
                parseFloat(itemDetails.itm_det.camt);
              existingItemDetails.itm_det.samt =
                parseFloat(existingItemDetails.itm_det.samt) +
                parseFloat(itemDetails.itm_det.samt);

              existingItemDetails.itm_det.camt = parseFloat(
                existingItemDetails.itm_det.camt.toFixed(2)
              );
              existingItemDetails.itm_det.samt = parseFloat(
                existingItemDetails.itm_det.samt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
              (parseFloat(itemDetails.itm_det.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }
        }

        // Preparing Insurance
        if (row.insurance) {
          let taxableValue = 0;

          let cgstAmt = parseFloat(row.insurance.cgstAmount);
          let sgstAmt = parseFloat(row.insurance.sgstAmount);
          let igstAmt = parseFloat(row.insurance.igstAmount);

          taxableValue = parseFloat(row.insurance.amount);

          let itemDetails;
          if (igstAmt > 0) {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.insurance.sgst && row.insurance.cgst
                    ? parseFloat(
                        (row.insurance.sgst + row.insurance.cgst).toFixed(2)
                      )
                    : row.insurance.igst > 0
                    ? parseFloat(row.insurance.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
              }
            };
          } else {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.insurance.sgst && row.insurance.cgst
                    ? parseFloat(
                        (row.insurance.sgst + row.insurance.cgst).toFixed(2)
                      )
                    : row.insurance.igst > 0
                    ? parseFloat(row.insurance.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
                samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
                csamt: 0 // Cess amount
              }
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];
            existingItemDetails.itm_det.txval =
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval);

            existingItemDetails.itm_det.txval = parseFloat(
              parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.itm_det.camt =
                parseFloat(existingItemDetails.itm_det.camt) +
                parseFloat(itemDetails.itm_det.camt);
              existingItemDetails.itm_det.samt =
                parseFloat(existingItemDetails.itm_det.samt) +
                parseFloat(itemDetails.itm_det.samt);

              existingItemDetails.itm_det.camt = parseFloat(
                existingItemDetails.itm_det.camt.toFixed(2)
              );
              existingItemDetails.itm_det.samt = parseFloat(
                existingItemDetails.itm_det.samt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
              (parseFloat(itemDetails.itm_det.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }
        }

        if (isErrorObj) {
          const errorObj = Gstr1ErrorObj.createGstr1ErrorObject(
            row.sequenceNumber, // Sequence no
            row.invoice_number, // Invoice number
            row.invoice_date, // Date
            parseFloat(row.total_amount).toFixed(2), // Total
            row.balance_amount, // Balance
            row.customer_name, // Customer name
            row.customerGSTNo, // GST No
            row.payment_type, // Payment type
            row.place_of_supply, // Place Of Supply
            itemMessage, // Error Reason
            parseFloat(totalTxVal).toFixed(2), // Taxable Value
            'Sales'
          );

          runInAction(() => {
            let result =
              this.docErrorsListJSON &&
              this.docErrorsListJSON.find(
                (e) => e.invoiceNumber === row.invoice_number
              );

            if (!result) {
              this.docErrorsListJSON.push(errorObj);
            }
          });
        }

        // Push consolidated itemDetails into invoice.itms
        invoice.itms.push(...Object.values(itemDetailsDictionary));

        if (invoice.itms && invoice.itms.length > 0) {
          groupedData[ctin].push(invoice);
        }
      }
    }

    for (const ctin in groupedData) {
      if (groupedData[ctin].length > 0) {
        const transformedData = {
          ctin,
          inv: groupedData[ctin]
        };

        b2b_data.push(transformedData);
      }
    }

    try {
      // console.log(JSON.stringify(b2b_data, null, 2));

      b2b_data.forEach((obj) => {
        const inv = obj.inv;

        // Separate into groups of strings and integers
        const groupedStrings = inv.filter((item) =>
          isNaN(item.inum.split('/')[0])
        );
        const integers = inv.filter((item) => !isNaN(item.inum.split('/')[0]));

        // Sort each group
        groupedStrings.sort((a, b) => {
          const getLastElement = (str) => {
            const parts = str.inum.split('/');
            return parts[parts.length - 1];
          };
          return getLastElement(a).localeCompare(getLastElement(b), undefined, {
            numeric: true
          });
        });

        integers.sort((a, b) => parseInt(a.inum) - parseInt(b.inum));

        // Update the 'inv' array within the current object
        obj.inv = integers.concat(groupedStrings);
      });

      // console.log(JSON.stringify(b2b_data, null, 2));
    } catch (error) {
      console.error('An exception occurred:', error);
    }

    runInAction(() => {
      this.b2bSalesListJSON = b2b_data;
    });
  };

  getB2bEInvoiceSalesDataForGSTR = async (fromDate, toDate) => {
    return new Promise(async (resolve) => {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      await db.sales
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              },
              {
                irnNo: { $ne: '' }
              },
              {
                irnNo: { $ne: null }
              }
            ]
          }
        })
        .exec()
        .then((data) => {
          data = data.filter(
            (item) =>
              (item.isCancelled === undefined ||
                item.isCancelled === null ||
                item.isCancelled === false) &&
              item.einvoiceBillStatus !== 'Cancelled'
          );

          const selectedData = data.map((item) => ({
            invoice_date: item.invoice_date,
            irnNo: item.irnNo,
            customerGSTNo: item.customerGSTNo,
            placeOfSupplyName: item.placeOfSupplyName,
            sequenceNumber: item.sequenceNumber,
            date: item.date,
            total_amount: item.total_amount,
            balance_amount: item.balance_amount,
            customer_name: item.customer_name,
            sales_return_number: item.sales_return_number,
            payment_type: item.payment_type,
            item_list: item.item_list,
            packingTax: item.packingTax,
            shippingTax: item.shippingTax,
            packing_charge: item.packing_charge,
            shipping_charge: item.shipping_charge,
            insurance: item.insurance,
            invoice_number: item.invoice_number,
            place_of_supply: item.place_of_supply,
            customerState: item.customerState
          }));

          //to prepare JSON data
          this.prepareForB2BEInvoiceJsonFile(selectedData);
          resolve(`got data`);
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    });
  };

  prepareForB2BEInvoiceJsonFile = async (data) => {
    // Transformed B2B format
    const b2b_data = [];
    const groupedData = {};
    const errorList = [];

    let taxData = await taxSettings.getTaxSettingsDetails();

    let defaultState = getStateList().find((e) => e.name === taxData.state);

    for (const row of data) {
      let stateCode;
      if (row.irnNo !== null || row.irnNo !== '' || row.irnNo !== undefined) {
        if (
          row.customerGSTNo === null ||
          row.customerGSTNo === '' ||
          row.customerGSTNo === undefined
        ) {
          continue;
        }

        const ctin = row.customerGSTNo;

        if (!groupedData[ctin]) {
          groupedData[ctin] = [];
        }

        const stateCodeData = getStateList().find(
          (e) => e.name === row.placeOfSupplyName
        );

        if (stateCodeData && stateCodeData !== null) {
          stateCode = stateCodeData.code;
        }

        const invoice = {
          inum: row.sequenceNumber,
          idt: this.dateFormatter(row.invoice_date),
          val: parseFloat(row.total_amount.toFixed(2)),
          pos: stateCode ? stateCode : defaultState ? defaultState.code : '',
          rchrg: 'N', // Reverse charge
          itms: [],
          inv_typ: 'R' // This field represents the invoice type of the original invoice for which the credit or debit note is issued.
          //sply_ty: '', // This field represents the type of supply made, whether it is an interstate supply, intrastate supply, or a supply made to a SEZ (Special Economic Zone) unit or developer.
          //expt_amt: 0, // Value of exported goods or services
          //nil_amt: 0, // Value of nil-rated, exempted, and non-GST supplies
          //ngsup_amt: 0 // Value of supplies made to unregistered persons
        };

        //get all documents having issues
        let totalTxVal = 0;
        let isErrorObj = false;
        let errorMessages = [];
        let itemMessage =
          '<br /> B2B Error Summary: ' +
          '<br /><br /><b>Invoice No: </b>' +
          row.sequenceNumber +
          '<br />';

        if (ctin === '' || ctin === undefined) {
          isErrorObj = true;
          errorMessages.push('No Valid GST number found for Customer');

          itemMessage += 'No Valid GST number found for Customer<br />';
        }

        if (
          row.placeOfSupplyName === '' ||
          row.placeOfSupplyName === undefined
        ) {
          itemMessage += 'Place of Supply not defined<br />';
        }

        let isCGSTSGST = true;
        if (taxData && taxData.gstin && taxData.gstin !== '') {
          let businessStateCode = taxData.gstin.slice(0, 2);
          if (row.customerGSTNo && row.customerGSTNo !== '') {
            let customerExtractedStateCode = row.customerGSTNo.slice(0, 2);
            if (
              businessStateCode !== '' &&
              customerExtractedStateCode !== '' &&
              businessStateCode === customerExtractedStateCode
            ) {
              isCGSTSGST = true;
            } else {
              isCGSTSGST = false;
            }
          } else if (row.customerState && row.customerState !== '') {
            let result = getStateList().find(
              (e) => e.code === businessStateCode
            );
            if (result) {
              let businessState = result.name;
              if (
                row.customerState !== '' &&
                row.customerState !== null &&
                businessState !== '' &&
                businessState !== null &&
                row.customerState.toLowerCase() === businessState.toLowerCase()
              ) {
                isCGSTSGST = true;
              } else {
                isCGSTSGST = false;
              }
            }
          }
        }

        let product_id = 0;
        const itemDetailsDictionary = {}; // To store item details with the same "rt"

        for (const item of row.item_list) {
          if (item.taxType === 'Nil-Rated' || item.taxType === 'Exempted') {
            continue;
          }

          product_id = product_id + 1;
          let taxableValue = 0;

          let cgstAmt = parseFloat(item.cgst_amount);
          let sgstAmt = parseFloat(item.sgst_amount);
          let igstAmt = parseFloat(item.igst_amount);
          let cess = parseFloat(item.cess);

          taxableValue =
            parseFloat(item.amount) -
            (parseFloat(cgstAmt) +
              parseFloat(sgstAmt) +
              parseFloat(igstAmt) +
              parseFloat(cess));

          let itemDetails;
          if (item.igst_amount > 0) {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  item.sgst && item.cgst
                    ? parseFloat((item.sgst + item.cgst).toFixed(2))
                    : item.igst > 0
                    ? parseFloat(item.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
              }
            };
          } else {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  item.sgst && item.cgst
                    ? parseFloat((item.sgst + item.cgst).toFixed(2))
                    : item.igst > 0
                    ? parseFloat(item.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
                samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
                csamt: parseFloat(cess.toFixed(2)) || 0 // Cess amount
              }
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];
            existingItemDetails.itm_det.txval =
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval);

            existingItemDetails.itm_det.txval = parseFloat(
              parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.itm_det.camt =
                parseFloat(existingItemDetails.itm_det.camt) +
                parseFloat(itemDetails.itm_det.camt);
              existingItemDetails.itm_det.samt =
                parseFloat(existingItemDetails.itm_det.samt) +
                parseFloat(itemDetails.itm_det.samt);

              existingItemDetails.itm_det.camt = parseFloat(
                existingItemDetails.itm_det.camt.toFixed(2)
              );
              existingItemDetails.itm_det.samt = parseFloat(
                existingItemDetails.itm_det.samt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
              (parseFloat(itemDetails.itm_det.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }

          let prodMessage = '';
          let product = item;
          totalTxVal += taxableValue;

          if (
            product.cgst_amount === 0 &&
            product.sgst_amount === 0 &&
            product.igst_amount === 0 &&
            (product.discount_percent === 0 ||
              product.discount_percent == null ||
              product.discount_percent === undefined)
          ) {
            isErrorObj = true;
            errorMessages.push(
              'No Valid GST found for product id:' + product.num
            );
            prodMessage += 'Tax rate is not defined<br />';
          } else if (isCGSTSGST === true && product.igst_amount > 0) {
            isErrorObj = true;
            prodMessage +=
              'IGST Tax rate is defined. It should be CGST-SGST \n';
          } else if (isCGSTSGST === false && product.cgst_amount > 0) {
            isErrorObj = true;
            prodMessage +=
              'CGST-SGST Tax rate is defined. It should be IGST \n';
          }

          if (
            product.hsn === '' ||
            product.hsn === null ||
            product.hsn === undefined
          ) {
            isErrorObj = true;
            prodMessage += 'HSN is not defined<br />';
          } else if (product.hsn !== '') {
            if (
              product.hsn.length === 4 ||
              product.hsn.length === 6 ||
              product.hsn.length === 8
            ) {
              // do nothing
            } else {
              isErrorObj = true;
              prodMessage += 'HSN code length is not valid<br />';
            }
          }

          if (prodMessage !== '') {
            let slNo = product_id + 1;
            itemMessage +=
              '<br /><b>Sl No: </b>' +
              slNo +
              '<br /><b>Product Name: </b>' +
              product.item_name +
              '<br />';
            itemMessage += prodMessage;
          }
        }

        // Preparing Packing Charge
        if (row.packingTax) {
          let taxableValue = 0;

          let cgstAmt = parseFloat(row.packingTax.cgstAmount);
          let sgstAmt = parseFloat(row.packingTax.sgstAmount);
          let igstAmt = parseFloat(row.packingTax.igstAmount);

          taxableValue = parseFloat(row.packing_charge);

          let itemDetails;
          if (igstAmt > 0) {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.packingTax.sgst && row.packingTax.cgst
                    ? parseFloat(
                        (row.packingTax.sgst + row.packingTax.cgst).toFixed(2)
                      )
                    : row.packingTax.igst > 0
                    ? parseFloat(row.packingTax.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
              }
            };
          } else {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.packingTax.sgst && row.packingTax.cgst
                    ? parseFloat(
                        (row.packingTax.sgst + row.packingTax.cgst).toFixed(2)
                      )
                    : row.packingTax.igst > 0
                    ? parseFloat(row.packingTax.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
                samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
                csamt: 0 // Cess amount
              }
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];
            existingItemDetails.itm_det.txval =
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval);

            existingItemDetails.itm_det.txval = parseFloat(
              parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.itm_det.camt =
                parseFloat(existingItemDetails.itm_det.camt) +
                parseFloat(itemDetails.itm_det.camt);
              existingItemDetails.itm_det.samt =
                parseFloat(existingItemDetails.itm_det.samt) +
                parseFloat(itemDetails.itm_det.samt);

              existingItemDetails.itm_det.camt = parseFloat(
                existingItemDetails.itm_det.camt.toFixed(2)
              );
              existingItemDetails.itm_det.samt = parseFloat(
                existingItemDetails.itm_det.samt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
              (parseFloat(itemDetails.itm_det.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }
        }

        // Preparing Shipping Charge
        if (row.shippingTax) {
          let taxableValue = 0;

          let cgstAmt = parseFloat(row.shippingTax.cgstAmount);
          let sgstAmt = parseFloat(row.shippingTax.sgstAmount);
          let igstAmt = parseFloat(row.shippingTax.igstAmount);

          taxableValue = parseFloat(row.shipping_charge);

          let itemDetails;
          if (igstAmt > 0) {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.shippingTax.sgst && row.shippingTax.cgst
                    ? parseFloat(
                        (row.shippingTax.sgst + row.shippingTax.cgst).toFixed(2)
                      )
                    : row.shippingTax.igst > 0
                    ? parseFloat(row.shippingTax.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
              }
            };
          } else {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.shippingTax.sgst && row.shippingTax.cgst
                    ? parseFloat(
                        (row.shippingTax.sgst + row.shippingTax.cgst).toFixed(2)
                      )
                    : row.shippingTax.igst > 0
                    ? parseFloat(row.shippingTax.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
                samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
                csamt: 0 // Cess amount
              }
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];
            existingItemDetails.itm_det.txval =
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval);

            existingItemDetails.itm_det.txval = parseFloat(
              parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.itm_det.camt =
                parseFloat(existingItemDetails.itm_det.camt) +
                parseFloat(itemDetails.itm_det.camt);
              existingItemDetails.itm_det.samt =
                parseFloat(existingItemDetails.itm_det.samt) +
                parseFloat(itemDetails.itm_det.samt);

              existingItemDetails.itm_det.camt = parseFloat(
                existingItemDetails.itm_det.camt.toFixed(2)
              );
              existingItemDetails.itm_det.samt = parseFloat(
                existingItemDetails.itm_det.samt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
              (parseFloat(itemDetails.itm_det.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }
        }

        // Preparing Insurance
        if (row.insurance) {
          let taxableValue = 0;

          let cgstAmt = parseFloat(row.insurance.cgstAmount);
          let sgstAmt = parseFloat(row.insurance.sgstAmount);
          let igstAmt = parseFloat(row.insurance.igstAmount);

          taxableValue = parseFloat(row.insurance.amount);

          let itemDetails;
          if (igstAmt > 0) {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.insurance.sgst && row.insurance.cgst
                    ? parseFloat(
                        (row.insurance.sgst + row.insurance.cgst).toFixed(2)
                      )
                    : row.insurance.igst > 0
                    ? parseFloat(row.insurance.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
              }
            };
          } else {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.insurance.sgst && row.insurance.cgst
                    ? parseFloat(
                        (row.insurance.sgst + row.insurance.cgst).toFixed(2)
                      )
                    : row.insurance.igst > 0
                    ? parseFloat(row.insurance.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
                samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
                csamt: 0 // Cess amount
              }
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];
            existingItemDetails.itm_det.txval =
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval);

            existingItemDetails.itm_det.txval = parseFloat(
              parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.itm_det.camt =
                parseFloat(existingItemDetails.itm_det.camt) +
                parseFloat(itemDetails.itm_det.camt);
              existingItemDetails.itm_det.samt =
                parseFloat(existingItemDetails.itm_det.samt) +
                parseFloat(itemDetails.itm_det.samt);

              existingItemDetails.itm_det.camt = parseFloat(
                existingItemDetails.itm_det.camt.toFixed(2)
              );
              existingItemDetails.itm_det.samt = parseFloat(
                existingItemDetails.itm_det.samt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
              (parseFloat(itemDetails.itm_det.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }
        }

        if (isErrorObj) {
          const errorObj = Gstr1ErrorObj.createGstr1ErrorObject(
            row.sequenceNumber, // Sequence no
            row.invoice_number, // Invoice number
            row.invoice_date, // Date
            parseFloat(row.total_amount).toFixed(2), // Total
            row.balance_amount, // Balance
            row.customer_name, // Customer name
            row.customerGSTNo, // GST No
            row.payment_type, // Payment type
            row.place_of_supply, // Place Of Supply
            itemMessage, // Error Reason
            parseFloat(totalTxVal).toFixed(2), // Taxable Value
            'Sales'
          );

          runInAction(() => {
            let result =
              this.docErrorsListJSON &&
              this.docErrorsListJSON.find(
                (e) => e.invoiceNumber === row.invoice_number
              );

            if (!result) {
              this.docErrorsListJSON.push(errorObj);
            }
          });
        }

        // Push consolidated itemDetails into invoice.itms
        invoice.itms.push(...Object.values(itemDetailsDictionary));

        if (invoice.itms && invoice.itms.length > 0) {
          groupedData[ctin].push(invoice);
        }
      }
    }

    for (const ctin in groupedData) {
      if (groupedData[ctin].length > 0) {
        const transformedData = {
          ctin,
          inv: groupedData[ctin]
        };

        b2b_data.push(transformedData);
      }
    }

    try {
      // console.log(JSON.stringify(b2b_data, null, 2));

      b2b_data.forEach((obj) => {
        const inv = obj.inv;

        // Separate into groups of strings and integers
        const groupedStrings = inv.filter((item) =>
          isNaN(item.inum.split('/')[0])
        );
        const integers = inv.filter((item) => !isNaN(item.inum.split('/')[0]));

        // Sort each group
        groupedStrings.sort((a, b) => {
          const getLastElement = (str) => {
            const parts = str.inum.split('/');
            return parts[parts.length - 1];
          };
          return getLastElement(a).localeCompare(getLastElement(b), undefined, {
            numeric: true
          });
        });

        integers.sort((a, b) => parseInt(a.inum) - parseInt(b.inum));

        // Update the 'inv' array within the current object
        obj.inv = integers.concat(groupedStrings);
      });

      // console.log(JSON.stringify(b2b_data, null, 2));
    } catch (error) {
      console.error('An exception occurred:', error);
    }

    runInAction(() => {
      this.b2bEInvoiceSalesListJSON = b2b_data;
    });
  };

  getB2bASalesDataForGSTR = async (fromDate, toDate) => {
    return new Promise(async (resolve) => {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      await db.sales
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                amendmentDate: {
                  $gte: fromDate
                }
              },
              {
                amendmentDate: {
                  $lte: toDate
                }
              },
              {
                customerGSTNo: { $ne: '' }
              },
              {
                amended: { $eq: true }
              }
            ]
          }
        })
        .exec()
        .then((data) => {
          data = data.filter(
            (item) =>
              (item.isCancelled === undefined ||
                item.isCancelled === null ||
                item.isCancelled === false) &&
              item.einvoiceBillStatus !== 'Cancelled'
          );

          const selectedData = data.map((item) => ({
            invoice_date: item.invoice_date,
            irnNo: item.irnNo,
            customerGSTNo: item.customerGSTNo,
            placeOfSupplyName: item.placeOfSupplyName,
            sequenceNumber: item.sequenceNumber,
            date: item.date,
            total_amount: item.total_amount,
            balance_amount: item.balance_amount,
            customer_name: item.customer_name,
            sales_return_number: item.sales_return_number,
            payment_type: item.payment_type,
            item_list: item.item_list,
            amendmentDate: item.amendmentDate,
            packingTax: item.packingTax,
            shippingTax: item.shippingTax,
            packing_charge: item.packing_charge,
            shipping_charge: item.shipping_charge,
            insurance: item.insurance,
            invoice_number: item.invoice_number,
            place_of_supply: item.place_of_supply,
            customerState: item.customerState
          }));
          //to prepare JSON data
          this.prepareForB2BAJsonFile(selectedData);

          resolve(`got data`);
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    });
  };

  prepareForB2BAJsonFile = async (data) => {
    // Transformed B2B format
    const b2b_data = [];
    const groupedData = {};
    const errorList = [];

    let taxData = await taxSettings.getTaxSettingsDetails();

    let defaultState = getStateList().find((e) => e.name === taxData.state);

    for (const row of data) {
      let stateCode;

      if (row.irnNo === null || row.irnNo === '' || row.irnNo === undefined) {
        if (
          row.customerGSTNo === null ||
          row.customerGSTNo === '' ||
          row.customerGSTNo === undefined
        ) {
          continue;
        }

        const ctin = row.customerGSTNo;

        if (!groupedData[ctin]) {
          groupedData[ctin] = [];
        }

        const stateCodeData = getStateList().find(
          (e) => e.name === row.placeOfSupplyName
        );

        if (stateCodeData) {
          stateCode = stateCodeData.code;
        }

        const invoice = {
          oinum: row.sequenceNumber,
          oidt: this.dateFormatter(row.invoice_date),
          inum: row.sequenceNumber,
          idt: this.dateFormatter(row.amendmentDate),
          val: parseFloat(row.total_amount.toFixed(2)),
          pos: stateCode ? stateCode : defaultState.code,
          rchrg: 'N', // Reverse charge
          itms: [],
          inv_typ: 'R' // This field represents the invoice type of the original invoice for which the credit or debit note is issued.
        };

        //get all documents having issues
        let totalTxVal = 0;
        let isErrorObj = false;
        let errorMessages = [];
        let itemMessage =
          '<br /> B2BA Error Summary: ' +
          '<br /><br /><b>Invoice No: </b>' +
          row.sequenceNumber +
          '<br />';

        if (ctin === '' || ctin === undefined) {
          isErrorObj = true;
          errorMessages.push('No Valid GST number found for Customer');

          itemMessage += 'No Valid GST number found for Customer<br />';
        }

        if (
          row.placeOfSupplyName === '' ||
          row.placeOfSupplyName === undefined
        ) {
          itemMessage += 'Place of Supply not defined<br />';
        }

        let isCGSTSGST = true;
        if (taxData && taxData.gstin && taxData.gstin !== '') {
          let businessStateCode = taxData.gstin.slice(0, 2);
          if (row.customerGSTNo && row.customerGSTNo !== '') {
            let customerExtractedStateCode = row.customerGSTNo.slice(0, 2);
            if (
              businessStateCode !== '' &&
              customerExtractedStateCode !== '' &&
              businessStateCode === customerExtractedStateCode
            ) {
              isCGSTSGST = true;
            } else {
              isCGSTSGST = false;
            }
          } else if (row.customerState && row.customerState !== '') {
            let result = getStateList().find(
              (e) => e.code === businessStateCode
            );
            if (result) {
              let businessState = result.name;
              if (
                row.customerState !== '' &&
                row.customerState !== null &&
                businessState !== '' &&
                businessState !== null &&
                row.customerState.toLowerCase() === businessState.toLowerCase()
              ) {
                isCGSTSGST = true;
              } else {
                isCGSTSGST = false;
              }
            }
          }
        }

        let product_id = 0;
        const itemDetailsDictionary = {}; // To store item details with the same "rt"

        for (const item of row.item_list) {
          if (item.taxType === 'Nil-Rated' || item.taxType === 'Exempted') {
            continue;
          }

          product_id = product_id + 1;
          let taxableValue = 0;

          let cgstAmt = parseFloat(item.cgst_amount);
          let sgstAmt = parseFloat(item.sgst_amount);
          let igstAmt = parseFloat(item.igst_amount);
          let cess = parseFloat(item.cess);

          taxableValue =
            parseFloat(item.amount) -
            (parseFloat(cgstAmt) +
              parseFloat(sgstAmt) +
              parseFloat(igstAmt) +
              parseFloat(cess));

          let itemDetails;
          if (item.igst_amount > 0) {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  item.sgst && item.cgst
                    ? parseFloat((item.sgst + item.cgst).toFixed(2))
                    : item.igst > 0
                    ? parseFloat(item.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
              }
            };
          } else {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  item.sgst && item.cgst
                    ? parseFloat((item.sgst + item.cgst).toFixed(2))
                    : item.igst > 0
                    ? parseFloat(item.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
                samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
                csamt: parseFloat(cess.toFixed(2)) || 0 // Cess amount
              }
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];
            existingItemDetails.itm_det.txval =
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval);

            existingItemDetails.itm_det.txval = parseFloat(
              parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.itm_det.camt =
                parseFloat(existingItemDetails.itm_det.camt) +
                parseFloat(itemDetails.itm_det.camt);
              existingItemDetails.itm_det.samt =
                parseFloat(existingItemDetails.itm_det.samt) +
                parseFloat(itemDetails.itm_det.samt);

              existingItemDetails.itm_det.camt = parseFloat(
                existingItemDetails.itm_det.camt.toFixed(2)
              );
              existingItemDetails.itm_det.samt = parseFloat(
                existingItemDetails.itm_det.samt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
              (parseFloat(itemDetails.itm_det.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }

          let prodMessage = '';
          let product = item;
          totalTxVal += taxableValue;

          if (
            product.cgst_amount === 0 &&
            product.sgst_amount === 0 &&
            product.igst_amount === 0 &&
            (product.discount_percent === 0 || product.discount_percent == null)
          ) {
            isErrorObj = true;
            errorMessages.push(
              'No Valid GST found for product id:' + product.num
            );
            prodMessage += 'Tax rate is not defined<br />';
          } else if (isCGSTSGST === true && product.igst_amount > 0) {
            isErrorObj = true;
            prodMessage +=
              'IGST Tax rate is defined. It should be CGST-SGST \n';
          } else if (isCGSTSGST === false && product.cgst_amount > 0) {
            isErrorObj = true;
            prodMessage +=
              'CGST-SGST Tax rate is defined. It should be IGST \n';
          }

          if (
            product.hsn === '' ||
            product.hsn === null ||
            product.hsn === undefined
          ) {
            isErrorObj = true;
            prodMessage += 'HSN is not defined<br />';
          } else if (product.hsn !== '') {
            if (
              product.hsn.length === 4 ||
              product.hsn.length === 6 ||
              product.hsn.length === 8
            ) {
              // do nothing
            } else {
              isErrorObj = true;
              prodMessage += 'HSN code length is not valid<br />';
            }
          }

          if (prodMessage !== '') {
            let slNo = product_id + 1;
            itemMessage +=
              '<br /><b>Sl No: </b>' +
              slNo +
              '<br /><b>Product Name: </b>' +
              product.item_name +
              '<br />';
            itemMessage += prodMessage;
          }
        }

        // Preparing Packing Charge
        if (row.packingTax) {
          let taxableValue = 0;

          let cgstAmt = parseFloat(row.packingTax.cgstAmount);
          let sgstAmt = parseFloat(row.packingTax.sgstAmount);
          let igstAmt = parseFloat(row.packingTax.igstAmount);

          taxableValue = parseFloat(row.packing_charge);

          let itemDetails;
          if (igstAmt > 0) {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.packingTax.sgst && row.packingTax.cgst
                    ? parseFloat(
                        (row.packingTax.sgst + row.packingTax.cgst).toFixed(2)
                      )
                    : row.packingTax.igst > 0
                    ? parseFloat(row.packingTax.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
              }
            };
          } else {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.packingTax.sgst && row.packingTax.cgst
                    ? parseFloat(
                        (row.packingTax.sgst + row.packingTax.cgst).toFixed(2)
                      )
                    : row.packingTax.igst > 0
                    ? parseFloat(row.packingTax.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
                samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
                csamt: 0 // Cess amount
              }
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];
            existingItemDetails.itm_det.txval =
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval);

            existingItemDetails.itm_det.txval = parseFloat(
              parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.itm_det.camt =
                parseFloat(existingItemDetails.itm_det.camt) +
                parseFloat(itemDetails.itm_det.camt);
              existingItemDetails.itm_det.samt =
                parseFloat(existingItemDetails.itm_det.samt) +
                parseFloat(itemDetails.itm_det.samt);

              existingItemDetails.itm_det.camt = parseFloat(
                existingItemDetails.itm_det.camt.toFixed(2)
              );
              existingItemDetails.itm_det.samt = parseFloat(
                existingItemDetails.itm_det.samt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
              (parseFloat(itemDetails.itm_det.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }
        }

        // Preparing Shipping Charge
        if (row.shippingTax) {
          let taxableValue = 0;

          let cgstAmt = parseFloat(row.shippingTax.cgstAmount);
          let sgstAmt = parseFloat(row.shippingTax.sgstAmount);
          let igstAmt = parseFloat(row.shippingTax.igstAmount);

          taxableValue = parseFloat(row.shipping_charge);

          let itemDetails;
          if (igstAmt > 0) {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.shippingTax.sgst && row.shippingTax.cgst
                    ? parseFloat(
                        (row.shippingTax.sgst + row.shippingTax.cgst).toFixed(2)
                      )
                    : row.shippingTax.igst > 0
                    ? parseFloat(row.shippingTax.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
              }
            };
          } else {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.shippingTax.sgst && row.shippingTax.cgst
                    ? parseFloat(
                        (row.shippingTax.sgst + row.shippingTax.cgst).toFixed(2)
                      )
                    : row.shippingTax.igst > 0
                    ? parseFloat(row.shippingTax.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
                samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
                csamt: 0 // Cess amount
              }
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];
            existingItemDetails.itm_det.txval =
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval);

            existingItemDetails.itm_det.txval = parseFloat(
              parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.itm_det.camt =
                parseFloat(existingItemDetails.itm_det.camt) +
                parseFloat(itemDetails.itm_det.camt);
              existingItemDetails.itm_det.samt =
                parseFloat(existingItemDetails.itm_det.samt) +
                parseFloat(itemDetails.itm_det.samt);

              existingItemDetails.itm_det.camt = parseFloat(
                existingItemDetails.itm_det.camt.toFixed(2)
              );
              existingItemDetails.itm_det.samt = parseFloat(
                existingItemDetails.itm_det.samt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
              (parseFloat(itemDetails.itm_det.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }
        }

        // Preparing Shipping Charge
        if (row.insurance) {
          let taxableValue = 0;

          let cgstAmt = parseFloat(row.insurance.cgstAmount);
          let sgstAmt = parseFloat(row.insurance.sgstAmount);
          let igstAmt = parseFloat(row.insurance.igstAmount);

          taxableValue = parseFloat(row.insurance.amount);

          let itemDetails;
          if (igstAmt > 0) {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.insurance.sgst && row.insurance.cgst
                    ? parseFloat(
                        (row.insurance.sgst + row.insurance.cgst).toFixed(2)
                      )
                    : row.insurance.igst > 0
                    ? parseFloat(row.insurance.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
              }
            };
          } else {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.insurance.sgst && row.insurance.cgst
                    ? parseFloat(
                        (row.insurance.sgst + row.insurance.cgst).toFixed(2)
                      )
                    : row.insurance.igst > 0
                    ? parseFloat(row.insurance.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
                samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
                csamt: 0 // Cess amount
              }
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];
            existingItemDetails.itm_det.txval =
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval);

            existingItemDetails.itm_det.txval = parseFloat(
              parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.itm_det.camt =
                parseFloat(existingItemDetails.itm_det.camt) +
                parseFloat(itemDetails.itm_det.camt);
              existingItemDetails.itm_det.samt =
                parseFloat(existingItemDetails.itm_det.samt) +
                parseFloat(itemDetails.itm_det.samt);

              existingItemDetails.itm_det.camt = parseFloat(
                existingItemDetails.itm_det.camt.toFixed(2)
              );
              existingItemDetails.itm_det.samt = parseFloat(
                existingItemDetails.itm_det.samt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
              (parseFloat(itemDetails.itm_det.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }
        }

        if (isErrorObj) {
          const errorObj = Gstr1ErrorObj.createGstr1ErrorObject(
            row.sequenceNumber, // Sequence no
            row.invoice_number, // Invoice number
            row.invoice_date, // Date
            parseFloat(row.total_amount).toFixed(2), // Total
            row.balance_amount, // Balance
            row.customer_name, // Customer name
            row.customerGSTNo, // GST No
            row.payment_type, // Payment type
            row.place_of_supply, // Place Of Supply
            itemMessage, // Error Reason
            parseFloat(totalTxVal).toFixed(2), // Taxable Value
            'Sales'
          );

          runInAction(() => {
            let result =
              this.docErrorsListJSON &&
              this.docErrorsListJSON.find(
                (e) => e.invoiceNumber === row.invoice_number
              );

            if (!result) {
              this.docErrorsListJSON.push(errorObj);
            }
          });
        }

        // Push consolidated itemDetails into invoice.itms
        invoice.itms.push(...Object.values(itemDetailsDictionary));

        if (invoice.itms && invoice.itms.length > 0) {
          groupedData[ctin].push(invoice);
        }
      }
    }

    for (const ctin in groupedData) {
      if (groupedData[ctin].length > 0) {
        const transformedData = {
          ctin,
          inv: groupedData[ctin]
        };

        b2b_data.push(transformedData);
      }
    }

    try {
      // console.log(JSON.stringify(b2b_data, null, 2));

      b2b_data.forEach((obj) => {
        const inv = obj.inv;

        // Separate into groups of strings and integers
        const groupedStrings = inv.filter((item) =>
          isNaN(item.inum.split('/')[0])
        );
        const integers = inv.filter((item) => !isNaN(item.inum.split('/')[0]));

        // Sort each group
        groupedStrings.sort((a, b) => {
          const getLastElement = (str) => {
            const parts = str.inum.split('/');
            return parts[parts.length - 1];
          };
          return getLastElement(a).localeCompare(getLastElement(b), undefined, {
            numeric: true
          });
        });

        integers.sort((a, b) => parseInt(a.inum) - parseInt(b.inum));

        // Update the 'inv' array within the current object
        obj.inv = integers.concat(groupedStrings);
      });

      // console.log(JSON.stringify(b2b_data, null, 2));
    } catch (error) {
      console.error('An exception occurred:', error);
    }

    runInAction(() => {
      this.b2baSalesListJSON = b2b_data;
    });
  };

  prepareForB2clJsonFile = async (data) => {
    // Transformed B2cl format
    const b2cl_data = [];
    const groupedData = {};

    let taxData = await taxSettings.getTaxSettingsDetails();

    let defaultState = getStateList().find((e) => e.name === taxData.state);

    for (const row of data) {
      let stateCode;
      const stateCodeData = getStateList().find(
        (e) => e.name === row.placeOfSupplyName
      );

      if (stateCodeData) {
        stateCode = stateCodeData.code;
      }

      const pos = stateCode ? stateCode : defaultState.code;

      let isCGSTSGST = true;
      if (taxData && taxData.gstin && taxData.gstin !== '') {
        let businessStateCode = taxData.gstin.slice(0, 2);
        if (row.customerGSTNo && row.customerGSTNo !== '') {
          let customerExtractedStateCode = row.customerGSTNo.slice(0, 2);
          if (
            businessStateCode !== '' &&
            customerExtractedStateCode !== '' &&
            businessStateCode === customerExtractedStateCode
          ) {
            isCGSTSGST = true;
          } else {
            isCGSTSGST = false;
          }
        } else if (row.customerState && row.customerState !== '') {
          let result = getStateList().find((e) => e.code === businessStateCode);
          if (result) {
            let businessState = result.name;
            if (
              row.customerState !== '' &&
              row.customerState !== null &&
              businessState !== '' &&
              businessState !== null &&
              row.customerState.toLowerCase() === businessState.toLowerCase()
            ) {
              isCGSTSGST = true;
            } else {
              isCGSTSGST = false;
            }
          }
        }
      }

      if (!groupedData[pos]) {
        groupedData[pos] = [];
      }

      const invoice = {
        inum: row.sequenceNumber,
        idt: this.dateFormatter(row.invoice_date),
        val: parseFloat(row.total_amount.toFixed(2)),
        itms: []
      };

      //get all documents having issues
      let totalTxVal = 0;
      let isErrorObj = false;
      let errorMessages = [];
      let itemMessage =
        '<br /> B2CL Error Summary: ' +
        '<br /><br /><b>Invoice No: </b>' +
        row.sequenceNumber +
        '<br />';

      if (row.placeOfSupplyName === '' || row.placeOfSupplyName === undefined) {
        itemMessage += 'Place of Supply not defined<br />';
      }

      let product_id = 0;
      const itemDetailsDictionary = {}; // To store item details with the same "rt"

      for (const item of row.item_list) {
        if (item.taxType === 'Nil-Rated' || item.taxType === 'Exempted') {
          continue;
        }

        product_id = product_id + 1;
        let taxableValue = 0;

        let igstAmt = parseFloat(item.igst_amount);
        let cess = parseFloat(item.cess);

        taxableValue =
          parseFloat(item.amount) - (parseFloat(igstAmt) + parseFloat(cess));

        let itemDetails;
        if (item.igst_amount > 0) {
          itemDetails = {
            num: product_id,
            itm_det: {
              txval: parseFloat(taxableValue.toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                parseFloat(item.sgst) > 0
                  ? parseFloat((item.sgst + item.cgst).toFixed(2))
                  : parseFloat(item.igst > 0)
                  ? parseFloat(item.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              iamt: parseFloat(igstAmt.toFixed(2)), // Integrated GST amount
              csamt: 0
            }
          };
        }

        // Check if itemDetails with the same "rt" exists in the dictionary
        if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
          // Combine values for existing "rt"
          const existingItemDetails =
            itemDetailsDictionary[itemDetails.itm_det.rt];

          existingItemDetails.itm_det.txval = (
            parseFloat(existingItemDetails.itm_det.txval) +
            parseFloat(itemDetails.itm_det.txval)
          ).toFixed(2);

          if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
            existingItemDetails.itm_det.iamt =
              parseFloat(existingItemDetails.itm_det.iamt) +
              parseFloat(itemDetails.itm_det.iamt);

            existingItemDetails.itm_det.iamt = parseFloat(
              existingItemDetails.itm_det.iamt.toFixed(2)
            );
          }

          existingItemDetails.itm_det.csamt =
            parseFloat(existingItemDetails.itm_det.csamt) +
            parseFloat(itemDetails.itm_det.csamt);
        } else {
          // Add itemDetails to the dictionary
          itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
        }

        let prodMessage = '';
        let product = item;
        totalTxVal += taxableValue;

        if (
          product.cgst_amount === 0 &&
          product.sgst_amount === 0 &&
          product.igst_amount === 0 &&
          (product.discount_percent === 0 || product.discount_percent == null)
        ) {
          isErrorObj = true;
          errorMessages.push(
            'No Valid GST found for product id:' + product.num
          );
          prodMessage += 'Tax rate is not defined<br />';
        } else if (isCGSTSGST === true && product.igst_amount > 0) {
          isErrorObj = true;
          prodMessage += 'IGST Tax rate is defined. It should be CGST-SGST \n';
        } else if (isCGSTSGST === false && product.cgst_amount > 0) {
          isErrorObj = true;
          prodMessage += 'CGST-SGST Tax rate is defined. It should be IGST \n';
        }

        if (
          product.hsn === '' ||
          product.hsn === null ||
          product.hsn === undefined
        ) {
          isErrorObj = true;
          prodMessage += 'HSN is not defined<br />';
        } else if (product.hsn !== '') {
          if (
            product.hsn.length === 4 ||
            product.hsn.length === 6 ||
            product.hsn.length === 8
          ) {
            // do nothing
          } else {
            isErrorObj = true;
            prodMessage += 'HSN code length is not valid<br />';
          }
        }

        if (prodMessage !== '') {
          let slNo = product_id + 1;
          itemMessage +=
            '<br /><b>Sl No: </b>' +
            slNo +
            '<br /><b>Product Name: </b>' +
            product.item_name +
            '<br />';
          itemMessage += prodMessage;
        }
      }

      if (row.packingTax) {
        let taxableValue = 0;

        let igstAmt = parseFloat(row.packingTax.igstAmount);

        taxableValue = parseFloat(row.packing_charge);

        let itemDetails;
        if (igstAmt > 0) {
          itemDetails = {
            num: product_id,
            itm_det: {
              txval: parseFloat(taxableValue.toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                row.packingTax.sgst && row.packingTax.cgst
                  ? parseFloat(
                      (row.packingTax.sgst + row.packingTax.cgst).toFixed(2)
                    )
                  : row.packingTax.igst > 0
                  ? parseFloat(row.packingTax.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              iamt: parseFloat(igstAmt.toFixed(2)), // Integrated GST amount
              csamt: 0
            }
          };
        }

        if (itemDetails) {
          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];

            existingItemDetails.itm_det.txval = parseFloat(
              (
                parseFloat(existingItemDetails.itm_det.txval) +
                parseFloat(itemDetails.itm_det.txval)
              ).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              parseFloat(existingItemDetails.itm_det.csamt) +
              parseFloat(itemDetails.itm_det.csamt);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }
        }
      }

      if (row.shippingTax) {
        let taxableValue = 0;

        let igstAmt = parseFloat(row.shippingTax.igstAmount);
        taxableValue = parseFloat(row.packing_charge);

        let itemDetails;
        if (igstAmt > 0) {
          itemDetails = {
            num: product_id,
            itm_det: {
              txval: parseFloat(taxableValue.toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                row.shippingTax.sgst && row.shippingTax.cgst
                  ? parseFloat(
                      (row.shippingTax.sgst + row.shippingTax.cgst).toFixed(2)
                    )
                  : row.shippingTax.igst > 0
                  ? parseFloat(row.shippingTax.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              iamt: parseFloat(igstAmt.toFixed(2)), // Integrated GST amount
              csamt: 0
            }
          };
        }

        if (itemDetails) {
          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];
            existingItemDetails.itm_det.txval = parseFloat(
              (
                parseFloat(existingItemDetails.itm_det.txval) +
                parseFloat(itemDetails.itm_det.txval)
              ).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              parseFloat(existingItemDetails.itm_det.csamt) +
              parseFloat(itemDetails.itm_det.csamt);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }
        }
      }

      if (row.insurance) {
        let taxableValue = 0;
        let igstAmt = parseFloat(row.insurance.igstAmount);

        taxableValue = parseFloat(row.insurance.amount);

        let itemDetails;
        if (igstAmt > 0) {
          itemDetails = {
            num: product_id,
            itm_det: {
              txval: parseFloat(taxableValue.toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                row.insurance.sgst && row.insurance.cgst
                  ? parseFloat(
                      (row.insurance.sgst + row.insurance.cgst).toFixed(2)
                    )
                  : row.insurance.igst > 0
                  ? parseFloat(row.insurance.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              iamt: parseFloat(igstAmt.toFixed(2)), // Integrated GST amount
              csamt: 0
            }
          };
        }

        if (itemDetails) {
          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];

            existingItemDetails.itm_det.txval = parseFloat(
              (
                parseFloat(existingItemDetails.itm_det.txval) +
                parseFloat(itemDetails.itm_det.txval)
              ).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              parseFloat(existingItemDetails.itm_det.csamt) +
              parseFloat(itemDetails.itm_det.csamt);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }
        }
      }

      if (isErrorObj) {
        const errorObj = Gstr1ErrorObj.createGstr1ErrorObject(
          row.sequenceNumber, // Sequence no
          row.invoice_number, // Invoice number
          row.invoice_date, // Date
          parseFloat(row.total_amount).toFixed(2), // Total
          row.balance_amount, // Balance
          row.customer_name, // Customer name
          row.customerGSTNo, // GST No
          row.payment_type, // Payment type
          row.place_of_supply, // Place Of Supply
          itemMessage, // Error Reason
          parseFloat(totalTxVal).toFixed(2), // Taxable Value
          'Sales'
        );

        runInAction(() => {
          let result =
            this.docErrorsListJSON &&
            this.docErrorsListJSON.find(
              (e) => e.invoiceNumber === row.invoice_number
            );

          if (!result) {
            this.docErrorsListJSON.push(errorObj);
          }
        });
      }

      // Push consolidated itemDetails into invoice.itms
      invoice.itms.push(...Object.values(itemDetailsDictionary));

      if (invoice.itms && invoice.itms.length > 0) {
        groupedData[pos].push(invoice);
      }
    }

    for (const pos in groupedData) {
      if (groupedData[pos].length > 0) {
        const transformedData = {
          pos,
          inv: groupedData[pos]
        };

        b2cl_data.push(transformedData);
      }
    }

    try {
      b2cl_data.forEach((obj) => {
        const groupedStrings = [];
        const integers = [];

        obj.inv.forEach((item) => {
          item.itms.forEach((itm) => {
            itm.itm_det.txval = parseFloat(itm.itm_det.txval);
          });
          const parts = item.inum.split('/');
          if (isNaN(parts[0])) {
            groupedStrings.push(item);
          } else {
            integers.push(item);
          }
        });

        groupedStrings.sort((a, b) => {
          const getLastElement = (str) => {
            const parts = str.split('/');
            return parts[parts.length - 1];
          };
          return getLastElement(a.inum).localeCompare(
            getLastElement(b.inum),
            undefined,
            { numeric: true }
          );
        });

        obj.inv = integers.concat(groupedStrings);
      });
    } catch (error) {
      console.error('An exception occurred:', error);
    }

    runInAction(() => {
      this.b2clSalesList = b2cl_data;
    });
  };

  prepareForB2claJsonFile = async (data) => {
    // Transformed B2cl format
    const b2cl_data = [];
    const groupedData = {};

    let taxData = await taxSettings.getTaxSettingsDetails();

    let defaultState = getStateList().find((e) => e.name === taxData.state);

    for (const row of data) {
      let stateCode;

      const stateCodeData = getStateList().find(
        (e) => e.name === row.placeOfSupplyName
      );

      if (stateCodeData && stateCodeData !== null) {
        stateCode = stateCodeData.code;
      }

      const pos = stateCode ? stateCode : defaultState.code;

      let isCGSTSGST = true;
      if (taxData && taxData.gstin && taxData.gstin !== '') {
        let businessStateCode = taxData.gstin.slice(0, 2);
        if (row.customerGSTNo && row.customerGSTNo !== '') {
          let customerExtractedStateCode = row.customerGSTNo.slice(0, 2);
          if (
            businessStateCode !== '' &&
            customerExtractedStateCode !== '' &&
            businessStateCode === customerExtractedStateCode
          ) {
            isCGSTSGST = true;
          } else {
            isCGSTSGST = false;
          }
        } else if (row.customerState && row.customerState !== '') {
          let result = getStateList().find((e) => e.code === businessStateCode);
          if (result) {
            let businessState = result.name;
            if (
              row.customerState !== '' &&
              row.customerState !== null &&
              businessState !== '' &&
              businessState !== null &&
              row.customerState.toLowerCase() === businessState.toLowerCase()
            ) {
              isCGSTSGST = true;
            } else {
              isCGSTSGST = false;
            }
          }
        }
      }

      if (!groupedData[pos]) {
        groupedData[pos] = [];
      }

      const invoice = {
        oidt: this.dateFormatter(row.invoice_date),
        oinum: row.sequenceNumber,
        inum: row.sequenceNumber,
        idt: this.dateFormatter(row.amendmentDate),
        val: parseFloat(row.total_amount.toFixed(2)),
        itms: []
      };

      //get all documents having issues
      let totalTxVal = 0;
      let isErrorObj = false;
      let errorMessages = [];
      let itemMessage =
        '<br /> B2CLA Error Summary: ' +
        '<br /><br /><b>Invoice No: </b>' +
        row.sequenceNumber +
        '<br />';

      if (row.placeOfSupplyName === '' || row.placeOfSupplyName === undefined) {
        itemMessage += 'Place of Supply not defined<br />';
      }

      let product_id = 0;
      const itemDetailsDictionary = {}; // To store item details with the same "rt"

      for (const item of row.item_list) {
        if (item.taxType === 'Nil-Rated' || item.taxType === 'Exempted') {
          continue;
        }

        product_id = product_id + 1;
        let taxableValue = 0;
        let igstAmt = parseFloat(item.igst_amount);
        let cess = parseFloat(item.cess);

        taxableValue =
          parseFloat(item.amount) - (parseFloat(igstAmt) + parseFloat(cess));

        let itemDetails;
        if (item.igst_amount > 0) {
          itemDetails = {
            num: product_id,
            itm_det: {
              txval: parseFloat(taxableValue.toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                item.sgst && item.cgst
                  ? parseFloat((item.sgst + item.cgst).toFixed(2))
                  : item.igst > 0
                  ? parseFloat(item.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              iamt: parseFloat(igstAmt.toFixed(2)),
              csamt: 0 // Integrated GST amount
            }
          };
        }

        // Check if itemDetails with the same "rt" exists in the dictionary
        if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
          // Combine values for existing "rt"
          const existingItemDetails =
            itemDetailsDictionary[itemDetails.itm_det.rt];

          existingItemDetails.itm_det.txval = parseFloat(
            (
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval)
            ).toFixed(2)
          );

          if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
            existingItemDetails.itm_det.iamt =
              parseFloat(existingItemDetails.itm_det.iamt) +
              parseFloat(itemDetails.itm_det.iamt);

            existingItemDetails.itm_det.iamt = parseFloat(
              existingItemDetails.itm_det.iamt.toFixed(2)
            );
          }

          existingItemDetails.itm_det.csamt =
            parseFloat(existingItemDetails.itm_det.csamt) +
            parseFloat(itemDetails.itm_det.csamt);
        } else {
          // Add itemDetails to the dictionary
          itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
        }

        let prodMessage = '';
        let product = item;
        totalTxVal += taxableValue;

        if (
          product.cgst_amount === 0 &&
          product.sgst_amount === 0 &&
          product.igst_amount === 0 &&
          (product.discount_percent === 0 ||
            product.discount_percent == null ||
            product.discount_percent === undefined)
        ) {
          isErrorObj = true;
          errorMessages.push(
            'No Valid GST found for product id:' + product.num
          );
          prodMessage += 'Tax rate is not defined<br />';
        } else if (isCGSTSGST === true && product.igst_amount > 0) {
          isErrorObj = true;
          prodMessage += 'IGST Tax rate is defined. It should be CGST-SGST \n';
        } else if (isCGSTSGST === false && product.cgst_amount > 0) {
          isErrorObj = true;
          prodMessage += 'CGST-SGST Tax rate is defined. It should be IGST \n';
        }

        if (
          product.hsn === '' ||
          product.hsn === null ||
          product.hsn === undefined
        ) {
          isErrorObj = true;
          prodMessage += 'HSN is not defined<br />';
        } else if (product.hsn !== '') {
          if (
            product.hsn.length === 4 ||
            product.hsn.length === 6 ||
            product.hsn.length === 8
          ) {
            // do nothing
          } else {
            isErrorObj = true;
            prodMessage += 'HSN code length is not valid<br />';
          }
        }

        if (prodMessage !== '') {
          let slNo = product_id + 1;
          itemMessage +=
            '<br /><b>Sl No: </b>' +
            slNo +
            '<br /><b>Product Name: </b>' +
            product.item_name +
            '<br />';
          itemMessage += prodMessage;
        }
      }

      if (row.packingTax) {
        let taxableValue = 0;
        let igstAmt = parseFloat(row.packingTax.igstAmount);

        taxableValue = parseFloat(row.packing_charge);

        let itemDetails;
        if (igstAmt > 0) {
          itemDetails = {
            num: product_id,
            itm_det: {
              txval: parseFloat(taxableValue.toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                row.packingTax.sgst && row.packingTax.cgst
                  ? parseFloat(
                      (row.packingTax.sgst + row.packingTax.cgst).toFixed(2)
                    )
                  : row.packingTax.igst > 0
                  ? parseFloat(row.packingTax.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              iamt: parseFloat(igstAmt.toFixed(2)), // Integrated GST amount
              csamt: 0 // Cess amount
            }
          };
        }

        // Check if itemDetails with the same "rt" exists in the dictionary
        if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
          // Combine values for existing "rt"
          const existingItemDetails =
            itemDetailsDictionary[itemDetails.itm_det.rt];

          existingItemDetails.itm_det.txval = parseFloat(
            (
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval)
            ).toFixed(2)
          );

          if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
            existingItemDetails.itm_det.iamt =
              parseFloat(existingItemDetails.itm_det.iamt) +
              parseFloat(itemDetails.itm_det.iamt);

            existingItemDetails.itm_det.iamt = parseFloat(
              existingItemDetails.itm_det.iamt.toFixed(2)
            );
          }

          existingItemDetails.itm_det.csamt =
            parseFloat(existingItemDetails.itm_det.csamt) +
            parseFloat(itemDetails.itm_det.csamt);
        } else {
          // Add itemDetails to the dictionary
          itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
        }
      }

      if (row.shippingTax) {
        let taxableValue = 0;
        let igstAmt = parseFloat(row.shippingTax.igstAmount);

        taxableValue = parseFloat(row.packing_charge);

        let itemDetails;
        if (igstAmt > 0) {
          itemDetails = {
            num: product_id,
            itm_det: {
              txval: parseFloat(taxableValue.toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                row.shippingTax.sgst && row.shippingTax.cgst
                  ? parseFloat(
                      (row.shippingTax.sgst + row.shippingTax.cgst).toFixed(2)
                    )
                  : row.shippingTax.igst > 0
                  ? parseFloat(row.shippingTax.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              iamt: parseFloat(igstAmt.toFixed(2)), // Integrated GST amount
              csamt: 0 // Cess amount
            }
          };
        }

        // Check if itemDetails with the same "rt" exists in the dictionary
        if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
          // Combine values for existing "rt"
          const existingItemDetails =
            itemDetailsDictionary[itemDetails.itm_det.rt];

          existingItemDetails.itm_det.txval = parseFloat(
            (
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval)
            ).toFixed(2)
          );

          if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
            existingItemDetails.itm_det.iamt =
              parseFloat(existingItemDetails.itm_det.iamt) +
              parseFloat(itemDetails.itm_det.iamt);

            existingItemDetails.itm_det.iamt = parseFloat(
              existingItemDetails.itm_det.iamt.toFixed(2)
            );
          }

          existingItemDetails.itm_det.csamt =
            parseFloat(existingItemDetails.itm_det.csamt) +
            parseFloat(itemDetails.itm_det.csamt);
        } else {
          // Add itemDetails to the dictionary
          itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
        }
      }

      if (row.insurance) {
        let taxableValue = 0;
        let igstAmt = parseFloat(row.insurance.igstAmount);

        taxableValue = parseFloat(row.insurance.amount);

        let itemDetails;
        if (igstAmt > 0) {
          itemDetails = {
            num: product_id,
            itm_det: {
              txval: parseFloat(taxableValue.toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                row.insurance.sgst && row.insurance.cgst
                  ? parseFloat(
                      (row.insurance.sgst + row.insurance.cgst).toFixed(2)
                    )
                  : row.insurance.igst > 0
                  ? parseFloat(row.insurance.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              iamt: parseFloat(igstAmt.toFixed(2)), // Integrated GST amount
              csamt: 0 // Cess amount
            }
          };
        }

        // Check if itemDetails with the same "rt" exists in the dictionary
        if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
          // Combine values for existing "rt"
          const existingItemDetails =
            itemDetailsDictionary[itemDetails.itm_det.rt];

          existingItemDetails.itm_det.txval = parseFloat(
            (
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval)
            ).toFixed(2)
          );

          if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
            existingItemDetails.itm_det.iamt =
              parseFloat(existingItemDetails.itm_det.iamt) +
              parseFloat(itemDetails.itm_det.iamt);

            existingItemDetails.itm_det.iamt = parseFloat(
              existingItemDetails.itm_det.iamt.toFixed(2)
            );
          }

          existingItemDetails.itm_det.csamt =
            parseFloat(existingItemDetails.itm_det.csamt) +
            parseFloat(itemDetails.itm_det.csamt);
        } else {
          // Add itemDetails to the dictionary
          itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
        }
      }

      if (isErrorObj) {
        const errorObj = Gstr1ErrorObj.createGstr1ErrorObject(
          row.sequenceNumber, // Sequence no
          row.invoice_number, // Invoice number
          row.invoice_date, // Date
          parseFloat(row.total_amount).toFixed(2), // Total
          row.balance_amount, // Balance
          row.customer_name, // Customer name
          row.customerGSTNo, // GST No
          row.payment_type, // Payment type
          row.place_of_supply, // Place Of Supply
          itemMessage, // Error Reason
          parseFloat(totalTxVal).toFixed(2), // Taxable Value
          'Sales'
        );

        runInAction(() => {
          let result =
            this.docErrorsListJSON &&
            this.docErrorsListJSON.find(
              (e) => e.invoiceNumber === row.invoice_number
            );

          if (!result) {
            this.docErrorsListJSON.push(errorObj);
          }
        });
      }

      // Push consolidated itemDetails into invoice.itms
      invoice.itms.push(...Object.values(itemDetailsDictionary));

      if (invoice.itms && invoice.itms.length > 0) {
        groupedData[pos].push(invoice);
      }
    }

    for (const pos in groupedData) {
      if (groupedData[pos].length > 0) {
        const transformedData = {
          pos,
          inv: groupedData[pos]
        };

        b2cl_data.push(transformedData);
      }
    }

    try {
      b2cl_data.forEach((obj) => {
        const groupedStrings = [];
        const integers = [];

        obj.inv.forEach((item) => {
          const parts = item.inum.split('/');
          if (isNaN(parts[0])) {
            groupedStrings.push(item);
          } else {
            integers.push(item);
          }
        });

        groupedStrings.sort((a, b) => {
          const getLastElement = (str) => {
            const parts = str.split('/');
            return parts[parts.length - 1];
          };
          return getLastElement(a.inum).localeCompare(
            getLastElement(b.inum),
            undefined,
            { numeric: true }
          );
        });

        obj.inv = integers.concat(groupedStrings);
      });
    } catch (error) {
      console.error('An exception occurred:', error);
    }

    runInAction(() => {
      this.b2claSalesListJSON = b2cl_data;
    });
  };

  getJSONErrorList = async () => {
    return this.docErrorsListJSON;
  };

  prepareForCdnurJsonFile = async (data) => {
    // Transformed CDNUR format
    const cdnur_data = [];

    let taxData = await taxSettings.getTaxSettingsDetails();

    let defaultState = getStateList().find((e) => e.name === taxData.state);

    // Forming "transformedData" from data without grouping
    for (const row of data) {
      let stateCode;

      const stateCodeData = getStateList().find(
        (e) => e.name === row.placeOfSupplyName
      );

      if (stateCodeData && stateCodeData !== null) {
        stateCode = stateCodeData.code;
      }

      let isCGSTSGST = true;
      if (taxData && taxData.gstin && taxData.gstin !== '') {
        let businessStateCode = taxData.gstin.slice(0, 2);
        if (row.customerGSTNo && row.customerGSTNo !== '') {
          let customerExtractedStateCode = row.customerGSTNo.slice(0, 2);
          if (
            businessStateCode !== '' &&
            customerExtractedStateCode !== '' &&
            businessStateCode === customerExtractedStateCode
          ) {
            isCGSTSGST = true;
          } else {
            isCGSTSGST = false;
          }
        } else if (row.customerState && row.customerState !== '') {
          let result = getStateList().find((e) => e.code === businessStateCode);
          if (result) {
            let businessState = result.name;
            if (
              row.customerState !== '' &&
              row.customerState !== null &&
              businessState !== '' &&
              businessState !== null &&
              row.customerState.toLowerCase() === businessState.toLowerCase()
            ) {
              isCGSTSGST = true;
            } else {
              isCGSTSGST = false;
            }
          }
        }
      }

      const note = {
        typ: 'B2CL',
        ntty: 'C',
        nt_num: row.sequenceNumber,
        nt_dt: this.formatDate(row.date),
        pos: stateCode ? stateCode : defaultState ? defaultState.code : '',
        val: parseFloat(row.total_amount),
        itms: []
      };

      //get all documents having issues
      let totalTxVal = 0;
      let isErrorObj = false;
      let errorMessages = [];
      let itemMessage =
        '<br /> CDNUR Error Summary: ' +
        '<br /><br /><b>Invoice No: </b>' +
        row.sequenceNumber +
        '<br />';

      let i = 0;

      // Create a map to group itemDetails by "rt" and accumulate values
      const itemDetailsMap = new Map();

      for (const item of row.item_list) {
        if (item.taxType === 'Nil-Rated' || item.taxType === 'Exempted') {
          continue;
        }

        let taxableValue = 0;

        taxableValue =
          parseFloat(item.amount) -
          (parseFloat(item.cgst_amount) +
            parseFloat(item.sgst_amount) +
            parseFloat(item.igst_amount) +
            parseFloat(item.cess));

        i++;
        let itemDetails;

        if (item.igst_amount > 0) {
          itemDetails = {
            num: i,
            itm_det: {
              txval: parseFloat(taxableValue.toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                item.sgst && item.cgst
                  ? parseFloat((item.sgst + item.cgst).toFixed(2))
                  : item.igst > 0
                  ? parseFloat(item.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              iamt: parseFloat(item.igst_amount), // Integrated GST amount
              csamt: parseFloat(item.cess) // Cess amount
            }
          };
        } else {
          itemDetails = {
            num: i,
            itm_det: {
              txval: parseFloat(taxableValue.toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                item.sgst && item.cgst
                  ? parseFloat((item.sgst + item.cgst).toFixed(2))
                  : item.igst > 0
                  ? parseFloat(item.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              camt: parseFloat(item.cgst_amount), // Central GST amount
              samt: parseFloat(item.sgst_amount), // State GST amount
              csamt: parseFloat(item.cess) // Cess amount
            }
          };
        }

        let prodMessage = '';
        // let product = row.item_list[i];

        totalTxVal += taxableValue;

        if (
          item.cgst_amount === 0 &&
          item.sgst_amount === 0 &&
          item.igst_amount === 0 &&
          (item.discount_percent === 0 ||
            item.discount_percent == null ||
            item.discount_percent === undefined)
        ) {
          isErrorObj = true;
          errorMessages.push('No Valid GST found for product id:' + item.num);
          prodMessage += 'Tax rate is not defined<br />';
        } else if (isCGSTSGST === true && item.igst_amount > 0) {
          isErrorObj = true;
          prodMessage += 'IGST Tax rate is defined. It should be CGST-SGST \n';
        } else if (isCGSTSGST === false && item.cgst_amount > 0) {
          isErrorObj = true;
          prodMessage += 'CGST-SGST Tax rate is defined. It should be IGST \n';
        }

        if (item.hsn === '' || item.hsn === null || item.hsn === undefined) {
          isErrorObj = true;
          prodMessage += 'HSN is not defined<br />';
        } else if (item.hsn !== '') {
          if (
            item.hsn.length === 4 ||
            item.hsn.length === 6 ||
            item.hsn.length === 8
          ) {
            // do nothing
          } else {
            isErrorObj = true;
            prodMessage += 'HSN code length is not valid<br />';
          }
        }

        if (prodMessage !== '') {
          let slNo = i + 1;
          itemMessage +=
            '<br /><b>Sl No: </b>' +
            slNo +
            '<br /><b>Product Name: </b>' +
            item.item_name +
            '<br />';
          itemMessage += prodMessage;
        }

        // Group itemDetails by "rt" and accumulate values
        const rt = itemDetails.itm_det.rt;
        if (itemDetailsMap.has(rt)) {
          const existingItemDetails = itemDetailsMap.get(rt);
          existingItemDetails.itm_det.txval += parseFloat(
            itemDetails.itm_det.txval.toFixed(2)
          );
          if (itemDetails.itm_det.camt)
            existingItemDetails.itm_det.camt += itemDetails.itm_det.camt;
          if (itemDetails.itm_det.samt)
            existingItemDetails.itm_det.samt += itemDetails.itm_det.samt;
          if (itemDetails.itm_det.csamt)
            existingItemDetails.itm_det.csamt += itemDetails.itm_det.csamt;
        } else {
          itemDetailsMap.set(rt, itemDetails);
        }
      }

      // Push the accumulated itemDetails to note.itms
      for (const [, itemDetails] of itemDetailsMap) {
        note.itms.push(itemDetails);
      }

      if (isErrorObj) {
        const errorObj = Gstr1ErrorObj.createGstr1ErrorObject(
          row.sequenceNumber, // Sequence no
          row.sales_return_number, // Invoice number
          row.date, // Date
          parseFloat(row.total_amount).toFixed(2), // Total
          row.balance_amount, // Balance
          row.customer_name, // Customer name
          row.customerGSTNo, // GST No
          row.payment_type, // Payment type
          '', // Place Of Supply
          itemMessage, // Error Reason
          parseFloat(totalTxVal).toFixed(2), // Taxable Value
          'Sales Return'
        );

        runInAction(() => {
          let result =
            this.docErrorsListJSON &&
            this.docErrorsListJSON.find(
              (e) => e.invoiceNumber === row.sales_return_number
            );

          if (!result) {
            this.docErrorsListJSON.push(errorObj);
          }
        });
      }

      if (note.itms && note.itms.length > 0) {
        cdnur_data.push(note);
      }
    }

    return cdnur_data;
  };

  prepareForCdnuraJsonFile = async (data) => {
    // Transformed CDNUR format
    const cdnura_data = [];

    let taxData = await taxSettings.getTaxSettingsDetails();

    let defaultState = getStateList().find((e) => e.name === taxData.state);

    // Forming "transformedData" from data without grouping
    for (const row of data) {
      let stateCode;
      const stateCodeData = getStateList().find(
        (e) => e.name === row.placeOfSupplyName
      );

      if (stateCodeData && stateCodeData !== null) {
        stateCode = stateCodeData.code;
      }

      let isCGSTSGST = true;
      if (taxData && taxData.gstin && taxData.gstin !== '') {
        let businessStateCode = taxData.gstin.slice(0, 2);
        if (row.customerGSTNo && row.customerGSTNo !== '') {
          let customerExtractedStateCode = row.customerGSTNo.slice(0, 2);
          if (
            businessStateCode !== '' &&
            customerExtractedStateCode !== '' &&
            businessStateCode === customerExtractedStateCode
          ) {
            isCGSTSGST = true;
          } else {
            isCGSTSGST = false;
          }
        } else if (row.customerState && row.customerState !== '') {
          let result = getStateList().find((e) => e.code === businessStateCode);
          if (result) {
            let businessState = result.name;
            if (
              row.customerState !== '' &&
              row.customerState !== null &&
              businessState !== '' &&
              businessState !== null &&
              row.customerState.toLowerCase() === businessState.toLowerCase()
            ) {
              isCGSTSGST = true;
            } else {
              isCGSTSGST = false;
            }
          }
        }
      }

      const note = {
        typ: 'B2CL',
        ntty: 'C',
        ont_num: row.sequenceNumber,
        ont_dt: this.formatDate(row.amendmentDate),
        nt_num: row.sequenceNumber,
        nt_dt: this.formatDate(row.date),
        pos: stateCode ? stateCode : defaultState ? defaultState.code : '',
        val: parseFloat(row.total_amount),
        itms: []
      };

      //get all documents having issues
      let totalTxVal = 0;
      let isErrorObj = false;
      let errorMessages = [];
      let itemMessage =
        '<br /> CDNURA Error Summary: ' +
        '<br /><br /><b>Invoice No: </b>' +
        row.sequenceNumber +
        '<br />';

      let i = 0;

      // Create a map to group itemDetails by "rt" and accumulate values
      const itemDetailsMap = new Map();

      for (const item of row.item_list) {
        if (item.taxType === 'Nil-Rated' || item.taxType === 'Exempted') {
          continue;
        }

        let taxableValue = 0;

        taxableValue =
          parseFloat(item.amount) -
          (parseFloat(item.cgst_amount) +
            parseFloat(item.sgst_amount) +
            parseFloat(item.igst_amount) +
            parseFloat(item.cess));

        i++;
        let itemDetails;

        if (item.igst_amount > 0) {
          itemDetails = {
            num: i,
            itm_det: {
              txval: parseFloat(taxableValue.toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                item.sgst && item.cgst
                  ? parseFloat((item.sgst + item.cgst).toFixed(2))
                  : item.igst > 0
                  ? parseFloat(item.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              iamt: parseFloat(item.igst_amount), // Integrated GST amount
              csamt: parseFloat(item.cess) // Cess amount
            }
          };
        } else {
          itemDetails = {
            num: i,
            itm_det: {
              txval: parseFloat(taxableValue.toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                item.sgst && item.cgst
                  ? parseFloat((item.sgst + item.cgst).toFixed(2))
                  : item.igst > 0
                  ? parseFloat(item.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              camt: parseFloat(item.cgst_amount), // Central GST amount
              samt: parseFloat(item.sgst_amount), // State GST amount
              csamt: parseFloat(item.cess) // Cess amount
            }
          };
        }

        let prodMessage = '';
        // let product = row.item_list[i];

        totalTxVal += taxableValue;

        if (
          item.cgst_amount === 0 &&
          item.sgst_amount === 0 &&
          item.igst_amount === 0 &&
          (item.discount_percent === 0 ||
            item.discount_percent == null ||
            item.discount_percent === undefined)
        ) {
          isErrorObj = true;
          errorMessages.push('No Valid GST found for product id:' + item.num);
          prodMessage += 'Tax rate is not defined<br />';
        } else if (isCGSTSGST === true && item.igst_amount > 0) {
          isErrorObj = true;
          prodMessage += 'IGST Tax rate is defined. It should be CGST-SGST \n';
        } else if (isCGSTSGST === false && item.cgst_amount > 0) {
          isErrorObj = true;
          prodMessage += 'CGST-SGST Tax rate is defined. It should be IGST \n';
        }

        if (item.hsn === '' || item.hsn === null || item.hsn === undefined) {
          isErrorObj = true;
          prodMessage += 'HSN is not defined<br />';
        } else if (item.hsn !== '') {
          if (
            item.hsn.length === 4 ||
            item.hsn.length === 6 ||
            item.hsn.length === 8
          ) {
            // do nothing
          } else {
            isErrorObj = true;
            prodMessage += 'HSN code length is not valid<br />';
          }
        }

        if (prodMessage !== '') {
          let slNo = i + 1;
          itemMessage +=
            '<br /><b>Sl No: </b>' +
            slNo +
            '<br /><b>Product Name: </b>' +
            item.item_name +
            '<br />';
          itemMessage += prodMessage;
        }

        // Group itemDetails by "rt" and accumulate values
        const rt = itemDetails.itm_det.rt;
        if (itemDetailsMap.has(rt)) {
          const existingItemDetails = itemDetailsMap.get(rt);
          existingItemDetails.itm_det.txval += parseFloat(
            itemDetails.itm_det.txval.toFixed(2)
          );
          if (itemDetails.itm_det.camt)
            existingItemDetails.itm_det.camt += itemDetails.itm_det.camt;
          if (itemDetails.itm_det.samt)
            existingItemDetails.itm_det.samt += itemDetails.itm_det.samt;
          if (itemDetails.itm_det.csamt)
            existingItemDetails.itm_det.csamt += itemDetails.itm_det.csamt;
        } else {
          itemDetailsMap.set(rt, itemDetails);
        }
      }

      // Push the accumulated itemDetails to note.itms
      for (const [, itemDetails] of itemDetailsMap) {
        note.itms.push(itemDetails);
      }

      if (isErrorObj) {
        const errorObj = Gstr1ErrorObj.createGstr1ErrorObject(
          row.sequenceNumber, // Sequence no
          row.sales_return_number, // Invoice number
          row.date, // Date
          parseFloat(row.total_amount).toFixed(2), // Total
          row.balance_amount, // Balance
          row.customer_name, // Customer name
          row.customerGSTNo, // GST No
          row.payment_type, // Payment type
          '', // Place Of Supply
          itemMessage, // Error Reason
          parseFloat(totalTxVal).toFixed(2), // Taxable Value
          'Sales Return'
        );

        runInAction(() => {
          let result =
            this.docErrorsListJSON &&
            this.docErrorsListJSON.find(
              (e) => e.invoiceNumber === row.sales_return_number
            );

          if (!result) {
            this.docErrorsListJSON.push(errorObj);
          }
        });
      }

      if (note.itms && note.itms.length > 0) {
        cdnura_data.push(note);
      }
    }

    return cdnura_data;
  };

  prepareForCdnrJsonFile = async (data) => {
    // Transformed CDNR format
    const cdnr_data = [];

    let taxData = await taxSettings.getTaxSettingsDetails();

    let defaultState = getStateList().find((e) => e.name === taxData.state);

    // Grouping data by "ctin"
    const groupedData = {};

    // Forming "transformedData" from grouped data

    for (const row of data) {
      let stateCode;

      const ctin = row.customerGSTNo;

      if (!groupedData[ctin]) {
        groupedData[ctin] = [];
      }

      const stateCodeData = getStateList().find(
        (e) => e.name === row.placeOfSupplyName
      );

      if (stateCodeData) {
        stateCode = stateCodeData.code;
      }

      let isCGSTSGST = true;
      if (taxData && taxData.gstin && taxData.gstin !== '') {
        let businessStateCode = taxData.gstin.slice(0, 2);
        if (row.customerGSTNo && row.customerGSTNo !== '') {
          let customerExtractedStateCode = row.customerGSTNo.slice(0, 2);
          if (
            businessStateCode !== '' &&
            customerExtractedStateCode !== '' &&
            businessStateCode === customerExtractedStateCode
          ) {
            isCGSTSGST = true;
          } else {
            isCGSTSGST = false;
          }
        } else if (row.customerState && row.customerState !== '') {
          let result = getStateList().find((e) => e.code === businessStateCode);
          if (result) {
            let businessState = result.name;
            if (
              row.customerState !== '' &&
              row.customerState !== null &&
              businessState !== '' &&
              businessState !== null &&
              row.customerState.toLowerCase() === businessState.toLowerCase()
            ) {
              isCGSTSGST = true;
            } else {
              isCGSTSGST = false;
            }
          }
        }
      }

      const note = {
        ntty: 'C',
        nt_num: row.sequenceNumber,
        nt_dt: this.formatDate(row.date),
        val: parseFloat(row.total_amount),
        pos: stateCode ? stateCode : defaultState ? defaultState.code : '',
        rchrg: 'N',
        inv_typ: 'R',
        itms: []
      };

      //get all documents having issues
      let totalTxVal = 0;
      let isErrorObj = false;
      let errorMessages = [];
      let itemMessage =
        '<br /> CDNR Error Summary: ' +
        '<br /><br /><b>Invoice No: </b>' +
        row.sequenceNumber +
        '<br />';

      let i = 0;
      const itemDetailsDictionary = {}; // To store item details with the same "rt"
      for (const item of row.item_list) {
        let taxableValue = 0;

        taxableValue =
          parseFloat(item.amount) -
          (parseFloat(item.cgst_amount) +
            parseFloat(item.sgst_amount) +
            parseFloat(item.igst_amount) +
            parseFloat(item.cess));

        i++;
        let itemDetails;

        if (item.igst_amount > 0) {
          itemDetails = {
            num: i,
            itm_det: {
              txval: Number(parseFloat(taxableValue).toFixed(2)),
              rt: parseFloat(
                item.sgst && item.cgst
                  ? parseFloat((item.sgst + item.cgst).toFixed(2))
                  : item.igst > 0
                  ? parseFloat(item.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              iamt: parseFloat(item.igst_amount), // Integrated GST amount
              csamt: parseFloat(item.cess) // Cess amount
            }
          };
        } else {
          itemDetails = {
            num: i,
            itm_det: {
              txval: Number(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                item.sgst && item.cgst
                  ? parseFloat((item.sgst + item.cgst).toFixed(2))
                  : item.igst > 0
                  ? parseFloat(item.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              camt: parseFloat(item.cgst_amount), // Central GST amount
              samt: parseFloat(item.sgst_amount), // State GST amount
              csamt: parseFloat(item.cess) // Cess amount
            }
          };
        }

        // Check if itemDetails with the same "rt" exists in the dictionary
        if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
          // Combine values for existing "rt"
          const existingItemDetails =
            itemDetailsDictionary[itemDetails.itm_det.rt];

          existingItemDetails.itm_det.txval =
            parseFloat(existingItemDetails.itm_det.txval) +
            parseFloat(itemDetails.itm_det.txval);

          existingItemDetails.itm_det.txval = parseFloat(
            existingItemDetails.itm_det.txval.toFixed(2)
          );

          if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
            existingItemDetails.itm_det.iamt =
              parseFloat(existingItemDetails.itm_det.iamt) +
              parseFloat(itemDetails.itm_det.iamt);

            existingItemDetails.itm_det.iamt = parseFloat(
              existingItemDetails.itm_det.iamt.toFixed(2)
            );
          } else {
            existingItemDetails.itm_det.camt =
              parseFloat(existingItemDetails.itm_det.camt) +
              parseFloat(itemDetails.itm_det.camt);
            existingItemDetails.itm_det.samt =
              parseFloat(existingItemDetails.itm_det.samt) +
              parseFloat(itemDetails.itm_det.samt);

            existingItemDetails.itm_det.camt = parseFloat(
              existingItemDetails.itm_det.camt.toFixed(2)
            );
            existingItemDetails.itm_det.samt = parseFloat(
              existingItemDetails.itm_det.samt.toFixed(2)
            );
          }

          existingItemDetails.itm_det.csamt =
            parseFloat(existingItemDetails.itm_det.csamt) +
            parseFloat(itemDetails.itm_det.csamt);
        } else {
          // Add itemDetails to the dictionary
          itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
        }

        let prodMessage = '';
        // let product = row.item_list[i];

        totalTxVal += taxableValue;

        if (
          item.cgst_amount === 0 &&
          item.sgst_amount === 0 &&
          item.igst_amount === 0 &&
          (item.discount_percent === 0 || item.discount_percent == null)
        ) {
          isErrorObj = true;
          errorMessages.push('No Valid GST found for product id:' + item.num);
          prodMessage += 'Tax rate is not defined<br />';
        } else if (isCGSTSGST === true && item.igst_amount > 0) {
          isErrorObj = true;
          prodMessage += 'IGST Tax rate is defined. It should be CGST-SGST \n';
        } else if (isCGSTSGST === false && item.cgst_amount > 0) {
          isErrorObj = true;
          prodMessage += 'CGST-SGST Tax rate is defined. It should be IGST \n';
        }

        if (item.hsn === '' || item.hsn === null || item.hsn === undefined) {
          isErrorObj = true;
          prodMessage += 'HSN is not defined<br />';
        } else if (item.hsn !== '') {
          if (
            item.hsn.length === 4 ||
            item.hsn.length === 6 ||
            item.hsn.length === 8
          ) {
            // do nothing
          } else {
            isErrorObj = true;
            prodMessage += 'HSN code length is not valid<br />';
          }
        }

        if (prodMessage !== '') {
          let slNo = i + 1;
          itemMessage +=
            '<br /><b>Sl No: </b>' +
            slNo +
            '<br /><b>Product Name: </b>' +
            item.item_name +
            '<br />';
          itemMessage += prodMessage;
        }

        if (isErrorObj) {
          const errorObj = Gstr1ErrorObj.createGstr1ErrorObject(
            row.sequenceNumber, // Sequence no
            row.sales_return_number, // Invoice number
            row.date, // Date
            parseFloat(row.total_amount).toFixed(2), // Total
            row.balance_amount, // Balance
            row.customer_name, // Customer name
            row.customerGSTNo, // GST No
            row.payment_type, // Payment type
            '', // Place Of Supply
            itemMessage, // Error Reason
            parseFloat(totalTxVal).toFixed(2), // Taxable Value
            'Sales Return'
          );

          runInAction(() => {
            let result =
              this.docErrorsListJSON &&
              this.docErrorsListJSON.find(
                (e) => e.invoiceNumber === row.sales_return_number
              );

            if (!result) {
              this.docErrorsListJSON.push(errorObj);
            }
          });
        }
      }
      // Push consolidated itemDetails into invoice.itms
      note.itms.push(...Object.values(itemDetailsDictionary));

      if (note.itms && note.itms.length > 0) {
        groupedData[ctin].push(note);
      }
    }

    for (const ctin in groupedData) {
      if (groupedData[ctin].length > 0) {
        const transformedData = {
          ctin,
          nt: groupedData[ctin]
        };

        cdnr_data.push(transformedData);
      }
    }

    try {
      // Sort the array of objects by the "inum" field
      cdnr_data.forEach((obj) => {
        // Check if obj.inv is defined before attempting to sort
        if (obj.inv && Array.isArray(obj.inv)) {
          obj.inv.sort((a, b) => {
            return parseInt(a.inum) - parseInt(b.inum);
          });
        }
      });
    } catch (error) {
      console.error('An exception occurred:', error);
    }

    return cdnr_data;
  };

  prepareForCdnraJsonFile = async (data) => {
    // Transformed CDNR format
    const cdnra_data = [];

    let taxData = await taxSettings.getTaxSettingsDetails();

    let defaultState = getStateList().find((e) => e.name === taxData.state);

    // Grouping data by "ctin"
    const groupedData = {};

    // Forming "transformedData" from grouped data

    for (const row of data) {
      let stateCode;
      const ctin = row.customerGSTNo;

      if (!groupedData[ctin]) {
        groupedData[ctin] = [];
      }

      const stateCodeData = getStateList().find(
        (e) => e.name === row.placeOfSupplyName
      );

      if (stateCodeData && stateCodeData !== null) {
        stateCode = stateCodeData.code;
      }

      let isCGSTSGST = true;
      if (taxData && taxData.gstin && taxData.gstin !== '') {
        let businessStateCode = taxData.gstin.slice(0, 2);
        if (row.customerGSTNo && row.customerGSTNo !== '') {
          let customerExtractedStateCode = row.customerGSTNo.slice(0, 2);
          if (
            businessStateCode !== '' &&
            customerExtractedStateCode !== '' &&
            businessStateCode === customerExtractedStateCode
          ) {
            isCGSTSGST = true;
          } else {
            isCGSTSGST = false;
          }
        } else if (row.customerState && row.customerState !== '') {
          let result = getStateList().find((e) => e.code === businessStateCode);
          if (result) {
            let businessState = result.name;
            if (
              row.customerState !== '' &&
              row.customerState !== null &&
              businessState !== '' &&
              businessState !== null &&
              row.customerState.toLowerCase() === businessState.toLowerCase()
            ) {
              isCGSTSGST = true;
            } else {
              isCGSTSGST = false;
            }
          }
        }
      }

      const note = {
        ntty: 'C',
        ont_num: row.sequenceNumber,
        ont_dt: this.dateFormatter(row.amendmentDate),
        nt_num: row.sequenceNumber,
        nt_dt: this.formatDate(row.date),
        val: parseFloat(row.total_amount),
        pos: stateCode ? stateCode : defaultState ? defaultState.code : '',
        rchrg: 'N',
        inv_typ: 'R',
        itms: []
      };

      //get all documents having issues
      let totalTxVal = 0;
      let isErrorObj = false;
      let errorMessages = [];
      let itemMessage =
        '<br /> CDNRA Error Summary: ' +
        '<br /><br /><b>Invoice No: </b>' +
        row.sequenceNumber +
        '<br />';

      let i = 0;
      const itemDetailsDictionary = {}; // To store item details with the same "rt"
      for (const item of row.item_list) {
        if (item.taxType === 'Nil-Rated' || item.taxType === 'Exempted') {
          continue;
        }

        let taxableValue = 0;

        taxableValue =
          parseFloat(item.amount) -
          (parseFloat(item.cgst_amount) +
            parseFloat(item.sgst_amount) +
            parseFloat(item.igst_amount) +
            parseFloat(item.cess));

        i++;
        let itemDetails;

        if (item.igst_amount > 0) {
          itemDetails = {
            num: i,
            itm_det: {
              txval: parseFloat(taxableValue.toFixed(2)),
              rt: parseFloat(
                item.sgst && item.cgst
                  ? parseFloat((item.sgst + item.cgst).toFixed(2))
                  : item.igst > 0
                  ? parseFloat(item.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              iamt: parseFloat(item.igst_amount), // Integrated GST amount
              csamt: parseFloat(item.cess) // Cess amount
            }
          };
        } else {
          itemDetails = {
            num: i,
            itm_det: {
              txval: parseFloat(taxableValue.toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                item.sgst && item.cgst
                  ? parseFloat((item.sgst + item.cgst).toFixed(2))
                  : item.igst > 0
                  ? parseFloat(item.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              camt: parseFloat(item.cgst_amount), // Central GST amount
              samt: parseFloat(item.sgst_amount), // State GST amount
              csamt: parseFloat(item.cess) // Cess amount
            }
          };
        }

        // Check if itemDetails with the same "rt" exists in the dictionary
        if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
          // Combine values for existing "rt"
          const existingItemDetails =
            itemDetailsDictionary[itemDetails.itm_det.rt];

          existingItemDetails.itm_det.txval =
            parseFloat(existingItemDetails.itm_det.txval) +
            parseFloat(itemDetails.itm_det.txval);

          existingItemDetails.itm_det.txval = parseFloat(
            existingItemDetails.itm_det.txval.toFixed(2)
          );

          if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
            existingItemDetails.itm_det.iamt =
              parseFloat(existingItemDetails.itm_det.iamt) +
              parseFloat(itemDetails.itm_det.iamt);

            existingItemDetails.itm_det.iamt = parseFloat(
              existingItemDetails.itm_det.iamt.toFixed(2)
            );
          } else {
            existingItemDetails.itm_det.camt =
              parseFloat(existingItemDetails.itm_det.camt) +
              parseFloat(itemDetails.itm_det.camt);
            existingItemDetails.itm_det.samt =
              parseFloat(existingItemDetails.itm_det.samt) +
              parseFloat(itemDetails.itm_det.samt);

            existingItemDetails.itm_det.camt = parseFloat(
              existingItemDetails.itm_det.camt.toFixed(2)
            );
            existingItemDetails.itm_det.samt = parseFloat(
              existingItemDetails.itm_det.samt.toFixed(2)
            );
          }

          existingItemDetails.itm_det.csamt =
            parseFloat(existingItemDetails.itm_det.csamt) +
            parseFloat(itemDetails.itm_det.csamt);
        } else {
          // Add itemDetails to the dictionary
          itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
        }

        let prodMessage = '';
        // let product = row.item_list[i];

        totalTxVal += taxableValue;

        if (
          item.cgst_amount === 0 &&
          item.sgst_amount === 0 &&
          item.igst_amount === 0 &&
          (item.discount_percent === 0 ||
            item.discount_percent == null ||
            item.discount_percent === undefined)
        ) {
          isErrorObj = true;
          errorMessages.push('No Valid GST found for product id:' + item.num);
          prodMessage += 'Tax rate is not defined<br />';
        } else if (isCGSTSGST === true && item.igst_amount > 0) {
          isErrorObj = true;
          prodMessage += 'IGST Tax rate is defined. It should be CGST-SGST \n';
        } else if (isCGSTSGST === false && item.cgst_amount > 0) {
          isErrorObj = true;
          prodMessage += 'CGST-SGST Tax rate is defined. It should be IGST \n';
        }

        if (item.hsn === '' || item.hsn === null || item.hsn === undefined) {
          isErrorObj = true;
          prodMessage += 'HSN is not defined<br />';
        } else if (item.hsn !== '') {
          if (
            item.hsn.length === 4 ||
            item.hsn.length === 6 ||
            item.hsn.length === 8
          ) {
            // do nothing
          } else {
            isErrorObj = true;
            prodMessage += 'HSN code length is not valid<br />';
          }
        }

        if (prodMessage !== '') {
          let slNo = i + 1;
          itemMessage +=
            '<br /><b>Sl No: </b>' +
            slNo +
            '<br /><b>Product Name: </b>' +
            item.item_name +
            '<br />';
          itemMessage += prodMessage;
        }

        if (isErrorObj) {
          const errorObj = Gstr1ErrorObj.createGstr1ErrorObject(
            row.sequenceNumber, // Sequence no
            row.sales_return_number, // Invoice number
            row.date, // Date
            parseFloat(row.total_amount).toFixed(2), // Total
            row.balance_amount, // Balance
            row.customer_name, // Customer name
            row.customerGSTNo, // GST No
            row.payment_type, // Payment type
            '', // Place Of Supply
            itemMessage, // Error Reason
            parseFloat(totalTxVal).toFixed(2), // Taxable Value
            'Sales Return'
          );

          runInAction(() => {
            let result =
              this.docErrorsListJSON &&
              this.docErrorsListJSON.find(
                (e) => e.invoiceNumber === row.sales_return_number
              );

            if (!result) {
              this.docErrorsListJSON.push(errorObj);
            }
          });
        }
      }
      // Push consolidated itemDetails into invoice.itms
      note.itms.push(...Object.values(itemDetailsDictionary));

      if (note.itms && note.itms.length > 0) {
        groupedData[ctin].push(note);
      }
    }

    for (const ctin in groupedData) {
      if (groupedData[ctin].length > 0) {
        const transformedData = {
          ctin,
          nt: groupedData[ctin]
        };

        cdnra_data.push(transformedData);
      }
    }

    try {
      // Sort the array of objects by the "inum" field
      cdnra_data.forEach((obj) => {
        // Check if obj.inv is defined before attempting to sort
        if (obj.inv && Array.isArray(obj.inv)) {
          obj.inv.sort((a, b) => {
            return parseInt(a.inum) - parseInt(b.inum);
          });
        }
      });
    } catch (error) {
      console.error('An exception occurred:', error);
    }

    return cdnra_data;
  };

  getB2bSalesData = async () => {
    return this.b2bSalesList;
  };

  getB2bSalesDataJSON = async () => {
    return this.b2bSalesListJSON;
  };

  dateFormatter(dateAsString) {
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  getB2CLSalesDataForGSTR = async (state, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      await db.sales
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $gt: 250000 } },
              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              },
              { customerGSTNo: { $eq: '' } },
              {
                customerState: { $ne: '' }
              },
              {
                customerState: { $ne: state }
              }
            ]
          }
        })
        .exec()
        .then((data) => {
          data = data.filter(
            (item) =>
              (item.isCancelled === undefined ||
                item.isCancelled === null ||
                item.isCancelled === false) &&
              item.einvoiceBillStatus !== 'Cancelled'
          );

          const selectedData = data.map((item) => ({
            irnNo: item.irnNo,
            customerGSTNo: item.customerGSTNo,
            placeOfSupplyName: item.placeOfSupplyName,
            sequenceNumber: item.sequenceNumber,
            invoice_date: item.invoice_date,
            total_amount: item.total_amount,
            balance_amount: item.balance_amount,
            customer_name: item.customer_name,
            sales_return_number: item.sales_return_number,
            payment_type: item.payment_type,
            item_list: item.item_list,
            packingTax: item.packingTax,
            shippingTax: item.shippingTax,
            packing_charge: item.packing_charge,
            shipping_charge: item.shipping_charge,
            insurance: item.insurance,
            invoice_number: item.invoice_number,
            place_of_supply: item.place_of_supply,
            customerState: item.customerState
          }));

          //to prepare JSON data
          this.prepareForB2clJsonFile(selectedData);

          resolve(`got data`);
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    });
  };

  getB2CLASalesDataForGSTR = async (state, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      await db.sales
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $gt: 250000 } },
              {
                amendmentDate: {
                  $gte: fromDate
                }
              },
              {
                amendmentDate: {
                  $lte: toDate
                }
              },
              { amended: { $eq: true } },
              { customerGSTNo: { $eq: '' } },
              {
                customerState: { $ne: '' }
              },
              {
                customerState: { $ne: state }
              }
            ]
          }
        })
        .exec()
        .then((data) => {
          data = data.filter(
            (item) =>
              (item.isCancelled === undefined ||
                item.isCancelled === null ||
                item.isCancelled === false) &&
              item.einvoiceBillStatus !== 'Cancelled'
          );

          const selectedData = data.map((item) => ({
            irnNo: item.irnNo,
            customerGSTNo: item.customerGSTNo,
            placeOfSupplyName: item.placeOfSupplyName,
            sequenceNumber: item.sequenceNumber,
            invoice_date: item.invoice_date,
            total_amount: item.total_amount,
            balance_amount: item.balance_amount,
            customer_name: item.customer_name,
            sales_return_number: item.sales_return_number,
            payment_type: item.payment_type,
            item_list: item.item_list,
            amendmentDate: item.amendmentDate,
            packingTax: item.packingTax,
            shippingTax: item.shippingTax,
            packing_charge: item.packing_charge,
            shipping_charge: item.shipping_charge,
            insurance: item.insurance,
            invoice_number: item.invoice_number,
            place_of_supply: item.place_of_supply,
            customerState: item.customerState
          }));

          //to prepare JSON data
          this.prepareForB2claJsonFile(selectedData);

          resolve(`got data`);
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    });
  };

  prepareForB2CSAJsonFile = async (data) => {
    // Transformed B2B format
    const b2csa_data = [];

    let taxData = await taxSettings.getTaxSettingsDetails();
    getStateList().find((e) => e.name === taxData.state);
    for (const row of data) {
      let stateCode;

      if (row.irnNo === null || row.irnNo === '' || row.irnNo === undefined) {
        const stateCodeData = getStateList().find(
          (e) => e.name === row.placeOfSupplyName
        );

        if (stateCodeData) {
          stateCode = stateCodeData.code;
        }

        let sply_ty = 'INTRA';
        let defaultState = getStateList().find((e) => e.name === taxData.state);
        if (
          row.placeOfSupplyName === '' ||
          row.placeOfSupplyName === ' ' ||
          row.placeOfSupplyName === null ||
          taxData.state === row.placeOfSupplyName
        ) {
          sply_ty = 'INTRA';
        } else if (taxData.state === row.placeOfSupplyName) {
          sply_ty = 'INTRA';
        } else {
          sply_ty = 'INTER';
        }

        let isCGSTSGST = true;
        if (taxData && taxData.gstin && taxData.gstin !== '') {
          let businessStateCode = taxData.gstin.slice(0, 2);
          if (row.customerGSTNo && row.customerGSTNo !== '') {
            let customerExtractedStateCode = row.customerGSTNo.slice(0, 2);
            if (
              businessStateCode !== '' &&
              customerExtractedStateCode !== '' &&
              businessStateCode === customerExtractedStateCode
            ) {
              isCGSTSGST = true;
            } else {
              isCGSTSGST = false;
            }
          } else if (row.customerState && row.customerState !== '') {
            let result = getStateList().find(
              (e) => e.code === businessStateCode
            );
            if (result) {
              let businessState = result.name;
              if (
                row.customerState !== '' &&
                row.customerState !== null &&
                businessState !== '' &&
                businessState !== null &&
                row.customerState.toLowerCase() === businessState.toLowerCase()
              ) {
                isCGSTSGST = true;
              } else {
                isCGSTSGST = false;
              }
            }
          }
        }

        const invoice = {
          omon: getSelectedDateMonthAndYearMMYYYY(row.invoice_date),
          typ: 'OE',
          sply_ty: sply_ty,
          pos: stateCode ? stateCode : defaultState.code,
          itms: []
        };

        //get all documents having issues
        let totalTxVal = 0;
        let isErrorObj = false;
        let errorMessages = [];
        let itemMessage =
          '<br /> B2CSA Error Summary: ' +
          '<br /><br /><b>Invoice No: </b>' +
          row.sequenceNumber +
          '<br />';

        if (
          row.placeOfSupplyName === '' ||
          row.placeOfSupplyName === undefined
        ) {
          itemMessage += 'Place of Supply not defined<br />';
        }

        let product_id = 0;
        const itemDetailsDictionary = {}; // To store item details with the same "rt"

        for (const item of row.item_list) {
          if (item.taxType === 'Nil-Rated' || item.taxType === 'Exempted') {
            continue;
          }

          product_id = product_id + 1;
          let taxableValue = 0;

          let cgstAmt = parseFloat(item.cgst_amount);
          let sgstAmt = parseFloat(item.sgst_amount);
          let igstAmt = parseFloat(item.igst_amount);
          let cess = parseFloat(item.cess);

          taxableValue =
            parseFloat(item.amount) -
            (parseFloat(cgstAmt) +
              parseFloat(sgstAmt) +
              parseFloat(igstAmt) +
              parseFloat(cess));

          let itemDetails;
          if (item.igst_amount > 0) {
            itemDetails = {
              txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                item.sgst && item.cgst
                  ? parseFloat((item.sgst + item.cgst).toFixed(2))
                  : item.igst > 0
                  ? parseFloat(item.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
            };
          } else {
            itemDetails = {
              txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                item.sgst && item.cgst
                  ? parseFloat((item.sgst + item.cgst).toFixed(2))
                  : item.igst > 0
                  ? parseFloat(item.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
              samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
              csamt: parseFloat(cess.toFixed(2)) || 0 // Cess amount
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails = itemDetailsDictionary[itemDetails.rt];
            existingItemDetails.txval =
              parseFloat(existingItemDetails.txval) +
              parseFloat(itemDetails.txval);

            existingItemDetails.txval = parseFloat(
              parseFloat(existingItemDetails.txval).toFixed(2)
            );

            if (itemDetails.iamt && itemDetails.iamt > 0) {
              existingItemDetails.iamt =
                parseFloat(existingItemDetails.iamt) +
                parseFloat(itemDetails.iamt);

              existingItemDetails.iamt = parseFloat(
                existingItemDetails.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.camt =
                parseFloat(existingItemDetails.camt) +
                parseFloat(itemDetails.camt);
              existingItemDetails.samt =
                parseFloat(existingItemDetails.samt) +
                parseFloat(itemDetails.samt);

              existingItemDetails.camt = parseFloat(
                existingItemDetails.camt.toFixed(2)
              );
              existingItemDetails.samt = parseFloat(
                existingItemDetails.samt.toFixed(2)
              );
            }

            existingItemDetails.csamt =
              (parseFloat(existingItemDetails.csamt) || 0) +
              (parseFloat(itemDetails.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.rt] = itemDetails;
          }

          let prodMessage = '';
          let product = item;
          totalTxVal += taxableValue;

          if (
            product.cgst_amount === 0 &&
            product.sgst_amount === 0 &&
            product.igst_amount === 0 &&
            (product.discount_percent === 0 ||
              product.discount_percent == null ||
              product.discount_percent === undefined)
          ) {
            isErrorObj = true;
            errorMessages.push(
              'No Valid GST found for product id:' + product.num
            );
            prodMessage += 'Tax rate is not defined<br />';
          } else if (isCGSTSGST === true && product.igst_amount > 0) {
            isErrorObj = true;
            prodMessage +=
              'IGST Tax rate is defined. It should be CGST-SGST \n';
          } else if (isCGSTSGST === false && product.cgst_amount > 0) {
            isErrorObj = true;
            prodMessage +=
              'CGST-SGST Tax rate is defined. It should be IGST \n';
          }

          if (
            product.hsn === '' ||
            product.hsn === null ||
            product.hsn === undefined
          ) {
            isErrorObj = true;
            prodMessage += 'HSN is not defined<br />';
          } else if (product.hsn !== '') {
            if (
              product.hsn.length === 4 ||
              product.hsn.length === 6 ||
              product.hsn.length === 8
            ) {
              // do nothing
            } else {
              isErrorObj = true;
              prodMessage += 'HSN code length is not valid<br />';
            }
          }

          if (prodMessage !== '') {
            let slNo = product_id + 1;
            itemMessage +=
              '<br /><b>Sl No: </b>' +
              slNo +
              '<br /><b>Product Name: </b>' +
              product.item_name +
              '<br />';
            itemMessage += prodMessage;
          }
        }

        if (row.packingTax) {
          let taxableValue = 0;

          let cgstAmt = parseFloat(row.packingTax.cgst_amount);
          let sgstAmt = parseFloat(row.packingTax.sgst_amount);
          let igstAmt = parseFloat(row.packingTax.igst_amount);

          taxableValue = parseFloat(row.packingTax.packing_charge);

          let itemDetails;
          if (igstAmt > 0) {
            itemDetails = {
              txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                row.packingTax.sgst && row.packingTax.cgst
                  ? parseFloat(
                      (row.packingTax.sgst + row.packingTax.cgst).toFixed(2)
                    )
                  : row.packingTax.igst > 0
                  ? parseFloat(row.packingTax.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
            };
          } else {
            itemDetails = {
              txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                row.packingTax.sgst && row.packingTax.cgst
                  ? parseFloat(
                      (row.packingTax.sgst + row.packingTax.cgst).toFixed(2)
                    )
                  : row.packingTax.igst > 0
                  ? parseFloat(row.packingTax.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
              samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
              csamt: 0 // Cess amount
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails = itemDetailsDictionary[itemDetails.rt];
            existingItemDetails.txval =
              parseFloat(existingItemDetails.txval) +
              parseFloat(itemDetails.txval);

            existingItemDetails.txval = parseFloat(
              parseFloat(existingItemDetails.txval).toFixed(2)
            );

            if (itemDetails.iamt && itemDetails.iamt > 0) {
              existingItemDetails.iamt =
                parseFloat(existingItemDetails.iamt) +
                parseFloat(itemDetails.iamt);

              existingItemDetails.iamt = parseFloat(
                existingItemDetails.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.camt =
                parseFloat(existingItemDetails.camt) +
                parseFloat(itemDetails.camt);
              existingItemDetails.samt =
                parseFloat(existingItemDetails.samt) +
                parseFloat(itemDetails.samt);

              existingItemDetails.camt = parseFloat(
                existingItemDetails.camt.toFixed(2)
              );
              existingItemDetails.samt = parseFloat(
                existingItemDetails.samt.toFixed(2)
              );
            }

            existingItemDetails.csamt =
              (parseFloat(existingItemDetails.csamt) || 0) +
              (parseFloat(itemDetails.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.rt] = itemDetails;
          }
        }

        if (row.shippingTax) {
          let taxableValue = 0;

          let cgstAmt = parseFloat(row.shippingTax.cgst_amount);
          let sgstAmt = parseFloat(row.shippingTax.sgst_amount);
          let igstAmt = parseFloat(row.shippingTax.igst_amount);

          taxableValue = parseFloat(row.shippingTax.packing_charge);

          let itemDetails;
          if (igstAmt > 0) {
            itemDetails = {
              txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                row.shippingTax.sgst && row.shippingTax.cgst
                  ? parseFloat(
                      (row.shippingTax.sgst + row.shippingTax.cgst).toFixed(2)
                    )
                  : row.shippingTax.igst > 0
                  ? parseFloat(row.shippingTax.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
            };
          } else {
            itemDetails = {
              txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                row.shippingTax.sgst && row.shippingTax.cgst
                  ? parseFloat(
                      (row.shippingTax.sgst + row.shippingTax.cgst).toFixed(2)
                    )
                  : row.shippingTax.igst > 0
                  ? parseFloat(row.shippingTax.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
              samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
              csamt: 0 // Cess amount
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails = itemDetailsDictionary[itemDetails.rt];
            existingItemDetails.txval =
              parseFloat(existingItemDetails.txval) +
              parseFloat(itemDetails.txval);

            existingItemDetails.txval = parseFloat(
              parseFloat(existingItemDetails.txval).toFixed(2)
            );

            if (itemDetails.iamt && itemDetails.iamt > 0) {
              existingItemDetails.iamt =
                parseFloat(existingItemDetails.iamt) +
                parseFloat(itemDetails.iamt);

              existingItemDetails.iamt = parseFloat(
                existingItemDetails.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.camt =
                parseFloat(existingItemDetails.camt) +
                parseFloat(itemDetails.camt);
              existingItemDetails.samt =
                parseFloat(existingItemDetails.samt) +
                parseFloat(itemDetails.samt);

              existingItemDetails.camt = parseFloat(
                existingItemDetails.camt.toFixed(2)
              );
              existingItemDetails.samt = parseFloat(
                existingItemDetails.samt.toFixed(2)
              );
            }

            existingItemDetails.csamt =
              (parseFloat(existingItemDetails.csamt) || 0) +
              (parseFloat(itemDetails.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.rt] = itemDetails;
          }
        }

        if (row.insurance) {
          let taxableValue = 0;

          let cgstAmt = parseFloat(row.insurance.cgst_amount);
          let sgstAmt = parseFloat(row.insurance.sgst_amount);
          let igstAmt = parseFloat(row.insurance.igst_amount);

          taxableValue = parseFloat(row.insurance.amount);

          let itemDetails;
          if (igstAmt > 0) {
            itemDetails = {
              txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                row.insurance.sgst && row.insurance.cgst
                  ? parseFloat(
                      (row.insurance.sgst + row.insurance.cgst).toFixed(2)
                    )
                  : row.insurance.igst > 0
                  ? parseFloat(row.insurance.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
            };
          } else {
            itemDetails = {
              txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
              rt: parseFloat(
                row.insurance.sgst && row.insurance.cgst
                  ? parseFloat(
                      (row.insurance.sgst + row.insurance.cgst).toFixed(2)
                    )
                  : row.insurance.igst > 0
                  ? parseFloat(row.insurance.igst.toFixed(2))
                  : 0
              ), // Tax rate applicable
              camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
              samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
              csamt: 0 // Cess amount
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails = itemDetailsDictionary[itemDetails.rt];
            existingItemDetails.txval =
              parseFloat(existingItemDetails.txval) +
              parseFloat(itemDetails.txval);

            existingItemDetails.txval = parseFloat(
              parseFloat(existingItemDetails.txval).toFixed(2)
            );

            if (itemDetails.iamt && itemDetails.iamt > 0) {
              existingItemDetails.iamt =
                parseFloat(existingItemDetails.iamt) +
                parseFloat(itemDetails.iamt);

              existingItemDetails.iamt = parseFloat(
                existingItemDetails.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.camt =
                parseFloat(existingItemDetails.camt) +
                parseFloat(itemDetails.camt);
              existingItemDetails.samt =
                parseFloat(existingItemDetails.samt) +
                parseFloat(itemDetails.samt);

              existingItemDetails.camt = parseFloat(
                existingItemDetails.camt.toFixed(2)
              );
              existingItemDetails.samt = parseFloat(
                existingItemDetails.samt.toFixed(2)
              );
            }

            existingItemDetails.csamt =
              (parseFloat(existingItemDetails.csamt) || 0) +
              (parseFloat(itemDetails.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.rt] = itemDetails;
          }
        }

        if (isErrorObj) {
          const errorObj = Gstr1ErrorObj.createGstr1ErrorObject(
            row.sequenceNumber, // Sequence no
            row.invoice_number, // Invoice number
            row.invoice_date, // Date
            parseFloat(row.total_amount).toFixed(2), // Total
            row.balance_amount, // Balance
            row.customer_name, // Customer name
            row.customerGSTNo, // GST No
            row.payment_type, // Payment type
            row.place_of_supply, // Place Of Supply
            itemMessage, // Error Reason
            parseFloat(totalTxVal).toFixed(2), // Taxable Value
            'Sales'
          );

          runInAction(() => {
            let result =
              this.docErrorsListJSON &&
              this.docErrorsListJSON.find(
                (e) => e.invoiceNumber === row.invoice_number
              );

            if (!result) {
              this.docErrorsListJSON.push(errorObj);
            }
          });
        }

        // Push consolidated itemDetails into invoice.itms
        invoice.itms.push(...Object.values(itemDetailsDictionary));

        b2csa_data.push(invoice);
      }
    }

    runInAction(() => {
      this.b2csaSalesListJSON = b2csa_data;
    });
  };

  calculateGSTValues = (totalAmount, gstRate) => {
    // Calculate total tax amount
    // Initialize variables with default values of 0
    let originalAmount = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;

    // Check if gstRate is valid (greater than 0)
    if (gstRate > 0) {
      // Calculate total tax amount
      const totalTaxAmount =
        totalAmount - totalAmount * (100 / (100 + gstRate));

      // Calculate original amount
      originalAmount = totalAmount - totalTaxAmount;

      // Calculate CGST and SGST (assuming they are equal)
      cgstAmount = totalTaxAmount / 2;
      sgstAmount = totalTaxAmount / 2;
    }

    // Return the results
    return {
      originalAmount,
      cgstAmount,
      sgstAmount
    };
  };

  getB2CSSalesDataForGSTR = async (state, fromDate, toDate) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Fetch business data
        const businessData = await Bd.getBusinessData();
        const db = await Db.get();

        // Query the sales database
        const salesData = await db.sales
          .find({
            selector: {
              $or: [
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { invoice_date: { $gte: fromDate } },
                    { invoice_date: { $lte: toDate } },
                    { customerGSTNo: { $eq: '' } },
                    { customerState: { $eq: state } },
                    { total_amount: { $lte: 250000 } }
                  ]
                },
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { invoice_date: { $gte: fromDate } },
                    { invoice_date: { $lte: toDate } },
                    { customerGSTNo: { $eq: '' } },
                    { total_amount: { $lte: 250000 } }
                  ]
                }
              ]
            }
          })
          .exec();

        // Filter out cancelled invoices
        const filteredData = salesData.filter(
          (item) =>
            (!item.isCancelled || item.isCancelled === false) &&
            item.einvoiceBillStatus !== 'Cancelled'
        );

        // Fetch tax settings and default state
        const taxData = await taxSettings.getTaxSettingsDetails();
        const defaultState =
          taxData && getStateList().find((e) => e.name === taxData.state);
        const stateName = defaultState ? defaultState.name : '';

        let intermediateResults = [];

        // Process each row in the filtered data
        filteredData.forEach((row) => {
          let totalTxVal = 0;
          let errorMessages = [];

          let isCGSTSGST = true;
          if (taxData && taxData.gstin) {
            const businessStateCode = taxData.gstin.slice(0, 2);
            if (row.customerGSTNo) {
              const customerStateCode = row.customerGSTNo.slice(0, 2);
              isCGSTSGST = businessStateCode === customerStateCode;
            } else if (row.customerState) {
              const businessState = getStateList().find(
                (e) => e.code === businessStateCode
              )?.name;
              isCGSTSGST =
                row.customerState.toLowerCase() === businessState.toLowerCase();
            }
          }

          const processItem = (item, row, type) => {
            if (['Nil-Rated', 'Exempted'].includes(item.taxType)) return;

            const total_tax =
              parseFloat(item.cess || 0) +
              parseFloat(item.cgst_amount || 0) +
              parseFloat(item.sgst_amount || 0) +
              parseFloat(item.igst_amount || 0);
            const taxableValue = parseFloat(item.amount || 0) - total_tax;

            let tempRow = {
              total_tax: total_tax.toFixed(2),
              cess: parseFloat(item.cess || 0),
              igst: parseFloat(item.igst || 0),
              cgst: parseFloat(item.cgst || 0),
              sgst: parseFloat(item.sgst || 0),
              igst_amount: parseFloat(item.igst_amount || 0).toFixed(2),
              cgst_amount: parseFloat(item.cgst_amount || 0).toFixed(2),
              sgst_amount: parseFloat(item.sgst_amount || 0).toFixed(2),
              amount: parseFloat(item.amount || 0).toFixed(2),
              placeOfSupplyName: row.placeOfSupplyName || stateName,
              taxIncluded: item.taxIncluded || false,
              item_name: item.item_name || '',
              hsn: item.hsn || '',
              sequenceNumber: row.sequenceNumber || '',
              invoice_number: row.invoice_number || '',
              invoice_date: row.invoice_date || '',
              total_amount: row.total_amount || 0,
              balance_amount: row.balance_amount || 0,
              customer_name: row.customer_name || '',
              customerGSTNo: row.customerGSTNo || '',
              payment_type: row.payment_type || '',
              place_of_supply: row.place_of_supply || '',
              txval: taxableValue,
              tax_percentage: item.igst
                ? parseFloat(item.igst)
                : parseFloat(item.cgst) + parseFloat(item.sgst) || 0
            };

            totalTxVal += taxableValue;

            if (type === 'Item') {
              let isError = false;
              let itemMessage = '';

              // Validate tax data and add error messages if needed
              if (
                item.cgst_amount === 0 &&
                item.sgst_amount === 0 &&
                item.igst_amount === 0 &&
                (item.discount_percent === 0 ||
                  item.discount_percent == null ||
                  item.discount_percent === undefined)
              ) {
                isError = true;
                itemMessage +=
                  'No Valid GST found for product id: ' + item.item_name;
              } else if (isCGSTSGST && item.igst_amount > 0) {
                isError = true;
                itemMessage +=
                  'IGST Tax rate is defined. It should be CGST-SGST';
              } else if (!isCGSTSGST && item.cgst_amount > 0) {
                isError = true;
                itemMessage +=
                  'CGST-SGST Tax rate is defined. It should be IGST';
              }

              if (
                item.hsn === '' ||
                item.hsn === null ||
                item.hsn === undefined
              ) {
                isError = true;
                itemMessage += 'HSN is not defined<br />';
              } else if (item.hsn !== '') {
                if (
                  item.hsn.length === 4 ||
                  item.hsn.length === 6 ||
                  item.hsn.length === 8
                ) {
                  // do nothing
                } else {
                  isError = true;
                  itemMessage += 'HSN code length is not valid<br />';
                }
              }

              if (isError) {
                errorMessages.push(itemMessage);
                tempRow.isErrorObj = true;
                tempRow.itemMessage = itemMessage;
              }
            }

            // Log the item if tax percentage is zero
            if (
              tempRow.tax_percentage === 0 &&
              tempRow.txval > 0 &&
              tempRow.amount > 0
            ) {
              console.log('Item with rt as 0:', tempRow);
            }

            return tempRow;
          };

          row.item_list.forEach((item) =>
            intermediateResults.push(processItem(item, row, 'Item'))
          );
          if (row.packingTax)
            intermediateResults.push(
              processItem(row.packingTax, row, 'Packing')
            );
          if (row.shippingTax)
            intermediateResults.push(
              processItem(row.shippingTax, row, 'Shipping')
            );
          if (row.insurance)
            intermediateResults.push(
              processItem(row.insurance, row, 'Insurance')
            );

          if (errorMessages.length > 0) {
            const errorObj = Gstr1ErrorObj.createGstr1ErrorObject(
              row.sequenceNumber,
              row.invoice_number,
              row.invoice_date,
              row.total_amount,
              row.balance_amount,
              row.customer_name,
              row.customerGSTNo,
              row.payment_type,
              row.place_of_supply,
              errorMessages.join('<br />'),
              totalTxVal,
              'Sales'
            );

            if (
              !this.docErrorsListJSON.find(
                (e) => e.invoiceNumber === row.invoice_number
              )
            ) {
              this.docErrorsListJSON.push(errorObj);
            }
          }
        });

        // Group intermediate results by place of supply and tax type
        const groupedData = {};
        intermediateResults.forEach((item) => {
          const place = item.placeOfSupplyName || '<no place>';
          if (!groupedData[place]) {
            groupedData[place] = {};
          }
          const taxType =
            item.igst > 0 ? 'igst' : item.cgst > 0 ? 'cgst' : 'other';
          const taxRate = item[taxType] || 0;

          if (!groupedData[place][taxRate]) {
            groupedData[place][taxRate] = {
              total_tax: 0,
              cess: 0,
              igst: item.igst || 0,
              placeOfSupplyName: place === '<no place>' ? '' : place,
              amount: 0,
              igst_amount: 0,
              cgst: item.cgst || 0,
              sgst: item.sgst || 0,
              cgst_amount: 0,
              sgst_amount: 0,
              tax_percentage: 0,
              txval: 0,
              taxIncluded: false
            };
          }

          groupedData[place][taxRate].total_tax += parseFloat(
            item.total_tax || 0
          );
          groupedData[place][taxRate].cess += parseFloat(item.cess || 0);
          groupedData[place][taxRate].amount += parseFloat(item.amount || 0);
          if (item.igst_amount > 0) {
            groupedData[place][taxRate].igst_amount += parseFloat(
              item.igst_amount || 0
            );
            groupedData[place][taxRate].tax_percentage = parseFloat(
              item.igst || 0
            );
          } else {
            groupedData[place][taxRate].cgst_amount += parseFloat(
              item.cgst_amount || 0
            );
            groupedData[place][taxRate].sgst_amount += parseFloat(
              item.sgst_amount || 0
            );
            groupedData[place][taxRate].tax_percentage = parseFloat(
              item.cgst + item.sgst || 0
            );
          }
          groupedData[place][taxRate].txval += parseFloat(item.txval || 0);
          groupedData[place][taxRate].placeOfSupplyName =
            item.placeOfSupplyName || '';
          groupedData[place][taxRate].taxIncluded = item.taxIncluded || false;

          if (
            groupedData[place][taxRate].tax_percentage === 0 &&
            groupedData[place][taxRate].txval > 0 &&
            groupedData[place][taxRate].amount > 0
          ) {
            console.log(
              'Grouped item with rt as 0:',
              groupedData[place][taxRate]
            );
          }
        });

        const result = Object.keys(groupedData)
          .map((place) => Object.values(groupedData[place]))
          .flat()
          .filter(
            (item) =>
              item.total_tax !== 0 ||
              item.amount !== 0 ||
              item.igst_amount !== 0 ||
              item.cgst_amount !== 0 ||
              item.txval !== 0
          );
        runInAction(() => {
          this.b2csSalesList = result;
        });

        resolve('got data');
      } catch (err) {
        console.error('Internal Server Error', err);
        reject(err);
      }
    });
  };

  getB2CSASalesDataForGSTR = async (state, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      const db = await Db.get();
      await db.sales
        .find({
          selector: {
            $or: [
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },

                  {
                    amendmentDate: {
                      $gte: fromDate
                    }
                  },
                  {
                    amendmentDate: {
                      $lte: toDate
                    }
                  },
                  { amended: { $eq: true } },
                  { customerGSTNo: { $eq: '' } },
                  {
                    customerState: { $eq: state }
                  },
                  { total_amount: { $lte: 250000 } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },

                  {
                    amendmentDate: {
                      $gte: fromDate
                    }
                  },
                  {
                    amendmentDate: {
                      $lte: toDate
                    }
                  },
                  { amended: { $eq: true } },
                  { customerGSTNo: { $eq: '' } },
                  { total_amount: { $lte: 250000 } }
                ]
              }
            ]
          }
        })
        .exec()
        .then(async (data) => {
          data = data.filter(
            (item) =>
              (item.isCancelled === undefined ||
                item.isCancelled === null ||
                item.isCancelled === false) &&
              item.einvoiceBillStatus !== 'Cancelled'
          );

          const selectedData = data.map((item) => ({
            invoice_date: item.invoice_date,
            irnNo: item.irnNo,
            customerGSTNo: item.customerGSTNo,
            placeOfSupplyName: item.placeOfSupplyName,
            sequenceNumber: item.sequenceNumber,
            date: item.date,
            total_amount: item.total_amount,
            balance_amount: item.balance_amount,
            customer_name: item.customer_name,
            sales_return_number: item.sales_return_number,
            payment_type: item.payment_type,
            amendmentDate: item.amendmentDate,
            item_list: item.item_list,
            packingTax: item.packingTax,
            shippingTax: item.shippingTax,
            packing_charge: item.packing_charge,
            shipping_charge: item.shipping_charge,
            insurance: item.insurance,
            invoice_number: item.invoice_number,
            place_of_supply: item.place_of_supply,
            customerState: item.customerState
          }));
          //to prepare JSON data
          await this.prepareForB2CSAJsonFile(selectedData);

          resolve(`got data`);
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    });
  };

  // Function to calculate the number of missing sequence numbers between the lowest and highest
  calculateCancelValue = async (lowest, highest, length) => {
    const expectedRange = parseFloat(highest) - parseFloat(lowest) + 1;
    return parseFloat(expectedRange) - parseFloat(length);
  };

  // Function to group the lowest and highest "sequenceNumber" by "prefix"
  groupByPrefix = async (arr) => {
    const prefixMap = new Map(); // Initialize a new Map

    for (const obj of arr) {
      // Iterate over each object in the array
      const prefix = obj.prefix?.trim() || null; // Trim the prefix and handle null or undefined
      const sequenceParts = obj.sequenceNumber.toString().split('/'); // Split the sequenceNumber into parts

      // Check if sequenceParts has more than one element and if the second last element matches the regex
      // If true, assign the second last element of sequenceParts to datePrefix
      // Otherwise, assign undefined to datePrefix
      let datePrefix =
        sequenceParts.length > 1 &&
        /^\d{2}-\d{2}$/.test(sequenceParts[sequenceParts.length - 2])
          ? sequenceParts[sequenceParts.length - 2]
          : undefined;

      if (datePrefix === prefix) {
        datePrefix = undefined;
      }

      const sequenceNumber = parseFloat(sequenceParts.pop()) || 0; // Parse the last part of sequenceNumber to a float

      const mapKey = prefix || datePrefix; // Use prefix as the key, if it exists, otherwise use datePrefix
      // Get the current object from the map, or create a new one if it doesn't exist
      const current = prefixMap.get(mapKey) || {
        lowest: sequenceNumber,
        highest: sequenceNumber,
        datePrefix: datePrefix,
        sequenceNumbers: [],
        cancelNumber: 0,
        prefix: prefix
      };

      current.sequenceNumbers.push(sequenceNumber); // Add the sequenceNumber to the sequenceNumbers array
      current.lowest = Math.min(current.lowest, sequenceNumber); // Update the lowest sequenceNumber
      current.highest = Math.max(current.highest, sequenceNumber); // Update the highest sequenceNumber
      if (obj.isCancelled || obj.einvoiceBillStatus === 'Cancelled') {
        current.cancelNumber += 1; // Increment the cancelNumber if the object is cancelled
      }

      prefixMap.set(mapKey, current); // Set the current object in the map
    }

    return prefixMap; // Return the map
  };

  generateFinalObject = async (array) => {
    const prefixMap = await this.groupByPrefix(array);

    const result = Array.from(prefixMap.entries(), ([prefix, value], index) => {
      return parseFloat(value.highest) > 0
        ? {
            num: index + 1,
            to: `${value.prefix ? value.prefix + '/' : ''}${
              value.datePrefix ? value.datePrefix + '/' : ''
            }${value.highest}`,
            from: `${value.prefix ? value.prefix + '/' : ''}${
              value.datePrefix ? value.datePrefix + '/' : ''
            }${value.lowest}`,
            totnum: value.sequenceNumbers.length,
            cancel: value.cancelNumber,
            net_issue: value.sequenceNumbers.length - value.cancelNumber
          }
        : null;
    }).filter((item) => item !== null);

    return result;
  };

  createDocIssuedSalesList = async (data) => {
    runInAction(async () => {
      this.docIssueSales = await this.generateFinalObject(data);
    });
  };

  createDocIssuedSalesReturnList = async (data) => {
    runInAction(async () => {
      this.docIssueSalesReturn = await this.generateFinalObject(data);
    });
  };

  getHSNSalesDataForGSTR = async (fromDate, toDate) => {
    let result = [];

    return new Promise(async (resolve) => {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      if (fromDate && toDate) {
        await db.sales
          .find({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { invoice_date: { $gte: fromDate } },
                { invoice_date: { $lte: toDate } }
              ]
            }
          })
          .exec()
          .then(async (data) => {
            await this.createDocIssuedSalesList(data);

            data = data.filter(
              (item) =>
                (item.isCancelled === undefined ||
                  item.isCancelled === null ||
                  item.isCancelled === false) &&
                item.isFullyReturned === false &&
                item.einvoiceBillStatus !== 'Cancelled'
            );

            let intermediate_result = new Map();

            const selectedData = data.map((item) => ({
              item_list: item.item_list
            }));

            selectedData.forEach((dataItem) => {
              let items = dataItem.item_list;

              let cess = 0;
              let igst_amount = 0;
              let cgst_amount = 0;
              let sgst_amount = 0;
              let txval = 0;

              for (let item of items) {
                if (item.hsn) {
                  cess = (parseFloat(cess) + parseFloat(item.cess)).toFixed(2);
                  igst_amount = (
                    parseFloat(igst_amount) + parseFloat(item.igst_amount)
                  ).toFixed(2);
                  cgst_amount = (
                    parseFloat(cgst_amount) + parseFloat(item.cgst_amount)
                  ).toFixed(2);
                  sgst_amount = (
                    parseFloat(sgst_amount) + parseFloat(item.sgst_amount)
                  ).toFixed(2);

                  let taxableValue = (
                    parseFloat(item.amount) -
                    (parseFloat(item.cgst_amount) +
                      parseFloat(item.sgst_amount) +
                      parseFloat(item.igst_amount) +
                      parseFloat(item.cess))
                  ).toFixed(2);

                  txval = (
                    parseFloat(txval) + parseFloat(taxableValue)
                  ).toFixed(2);

                  if (intermediate_result.has(item.hsn)) {
                    let itemData = intermediate_result.get(item.hsn);

                    itemData.amount = (
                      parseFloat(itemData.amount) + parseFloat(item.amount)
                    ).toFixed(2);
                    itemData.qty = (parseFloat(itemData.qty || 1) + 1).toFixed(
                      2
                    );
                    itemData.cess = (
                      parseFloat(itemData.cess) + parseFloat(item.cess)
                    ).toFixed(2);
                    itemData.igst_amount = (
                      parseFloat(itemData.igst_amount) +
                      parseFloat(item.igst_amount)
                    ).toFixed(2);
                    itemData.cgst_amount = (
                      parseFloat(itemData.cgst_amount) +
                      parseFloat(item.cgst_amount)
                    ).toFixed(2);
                    itemData.sgst_amount = (
                      parseFloat(itemData.sgst_amount) +
                      parseFloat(item.sgst_amount)
                    ).toFixed(2);
                    itemData.txval = (
                      parseFloat(itemData.txval) + parseFloat(taxableValue)
                    ).toFixed(2);
                    itemData.total_tax = (
                      parseFloat(itemData.igst_amount) +
                      parseFloat(itemData.cgst_amount) +
                      parseFloat(itemData.sgst_amount)
                    ).toFixed(2);
                    itemData.tax_percentage = (
                      parseFloat(itemData.cgst) +
                      parseFloat(itemData.sgst) +
                      parseFloat(itemData.igst)
                    ).toFixed(2);

                    intermediate_result.set(item.hsn, itemData);
                  } else {
                    item.qty = parseFloat(item.qty || 1).toFixed(2);
                    item.total_tax = (
                      parseFloat(item.igst_amount) +
                      parseFloat(item.cgst_amount) +
                      parseFloat(item.sgst_amount)
                    ).toFixed(2);

                    intermediate_result.set(item.hsn, item);
                  }
                }
              }
            });

            result = Array.from(intermediate_result.values());

            runInAction(() => {
              this.hsnSalesList = result;
            });

            resolve('got data');
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      } else {
        resolve('got data');
      }
    });
  };

  getGstr1SummaryData = async (fromDate, toDate, state) => {
    console.log('getGstr1SummaryData called');

    runInAction(() => {
      this.b2bSalesListJSON = [];
      this.b2clSalesList = [];
      this.b2csSalesList = [];
      this.cdnrList = [];
      this.cdnrListJSON = [];
      this.cdnurListJSON = [];
      this.b2baSalesListJSON = [];
      this.b2claSalesListJSON = [];
      this.b2csaSalesListJSON = [];
      this.cdnraListJSON = [];
      this.cdnuraSalesReturnListJSON = [];
      this.nilSalesListData = [];
      this.nilSalesReturnListData = [];
      this.expSalesListJSON = [];
      this.expASalesListJSON = [];
      this.b2bEInvoiceSalesListJSON = [];
    });

    const results = await Promise.all([
      this.getB2bSalesDataForGSTR(fromDate, toDate),
      this.getB2bEInvoiceSalesDataForGSTR(fromDate, toDate),
      this.getB2CLSalesDataForGSTR(state, fromDate, toDate),
      this.getB2CSSalesDataForGSTR(state, fromDate, toDate),
      this.getCDNRData(fromDate, toDate),
      this.getCDNURData(state, fromDate, toDate),
      this.getB2CSASalesDataForGSTR(state, fromDate, toDate),
      this.getB2bASalesDataForGSTR(fromDate, toDate),
      this.getB2CLASalesDataForGSTR(state, fromDate, toDate),
      this.getCDNRAData(fromDate, toDate),
      this.getCDNURAData(state, fromDate, toDate),
      this.getNilDataFromSale(fromDate, toDate),
      this.getNilDataFromSalesReturn(fromDate, toDate),
      this.getExportSalesDataForGSTR(fromDate, toDate),
      this.getExportASalesDataForGSTR(fromDate, toDate)
    ]);

    const b2bData = this.b2bSalesListJSON;
    const b2bEInvoiceData = this.b2bEInvoiceSalesListJSON;
    const b2clData = this.b2clSalesList;
    const b2csData = this.b2csSalesList;
    const cdnrData = this.cdnrListJSON;
    const cdnurData = this.cdnurListJSON;
    const b2baData = this.b2baSalesListJSON;
    const b2claData = this.b2claSalesListJSON;
    const b2csaData = this.b2csaSalesListJSON;
    const cdnraData = this.cdnraListJSON;
    const cdnuraData = this.cdnuraSalesReturnListJSON;
    const nilSales = this.nilSalesListData;
    const nilSalesReturn = this.nilSalesReturnListData;
    const expData = this.expSalesListJSON;
    const expaData = this.expASalesListJSON;

    const b2bResponseData = await this.processB2bData(b2bData);
    const b2bEInvoiceResponseData = await this.processB2bData(b2bEInvoiceData);
    const b2csResponseData = await this.processB2csData(b2csData);
    const b2clResponseData = await this.processB2clData(b2clData);
    const cdnurResponseData = await this.processCdnurData(cdnurData);
    const cdnrResponseData = await this.processCdnrData(cdnrData);
    const b2baResponseData = await this.processB2bData(b2baData);
    const b2claResponseData = await this.processB2clData(b2claData);
    const b2csaResponseData = await this.processB2csaData(b2csaData);
    const cdnraResponseData = await this.processCdnrData(cdnraData);
    const cdnuraResponseData = await this.processCdnurData(cdnuraData);
    const nilResponseData = await this.processNilData(nilSales, nilSalesReturn);
    const expResponseData = await this.processExportData(expData);
    const expaResponseData = {
      numberOfVoucher: 0,
      txval: 0,
      camt: 0,
      samt: 0,
      iamt: 0,
      total: 0
    };

    let vouchersTotal = 0;
    let taxableTotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;
    let invTotal = 0;

    if (b2bResponseData) {
      vouchersTotal += b2bResponseData.numberOfVoucher;
      taxableTotal += b2bResponseData.txval;
      cgstTotal += b2bResponseData.camt;
      sgstTotal += b2bResponseData.samt;
      igstTotal += b2bResponseData.iamt;
      invTotal += b2bResponseData.total;
    }

    if (b2bEInvoiceResponseData) {
      vouchersTotal += b2bEInvoiceResponseData.numberOfVoucher;
      taxableTotal += b2bEInvoiceResponseData.txval;
      cgstTotal += b2bEInvoiceResponseData.camt;
      sgstTotal += b2bEInvoiceResponseData.samt;
      igstTotal += b2bEInvoiceResponseData.iamt;
      invTotal += b2bEInvoiceResponseData.total;
    }

    if (b2csResponseData) {
      vouchersTotal += b2csResponseData.numberOfVoucher;
      taxableTotal += b2csResponseData.txval;
      cgstTotal += b2csResponseData.camt;
      sgstTotal += b2csResponseData.samt;
      igstTotal += b2csResponseData.iamt;
      invTotal += b2csResponseData.total;
    }

    if (b2clResponseData) {
      vouchersTotal += b2clResponseData.numberOfVoucher;
      taxableTotal += b2clResponseData.txval;
      cgstTotal += b2clResponseData.camt;
      sgstTotal += b2clResponseData.samt;
      igstTotal += b2clResponseData.iamt;
      invTotal += b2clResponseData.total;
    }

    if (cdnurResponseData) {
      vouchersTotal -= cdnurResponseData.numberOfVoucher;
      taxableTotal -= cdnurResponseData.txval;
      cgstTotal -= cdnurResponseData.camt;
      sgstTotal -= cdnurResponseData.samt;
      igstTotal -= cdnurResponseData.iamt;
      invTotal -= cdnurResponseData.total;
    }

    if (cdnrResponseData) {
      vouchersTotal -= cdnrResponseData.numberOfVoucher;
      taxableTotal -= cdnrResponseData.txval;
      cgstTotal -= cdnrResponseData.camt;
      sgstTotal -= cdnrResponseData.samt;
      igstTotal -= cdnrResponseData.iamt;
      invTotal -= cdnrResponseData.total;
    }

    if (b2baResponseData) {
      vouchersTotal += b2baResponseData.numberOfVoucher;
      taxableTotal += b2baResponseData.txval;
      cgstTotal += b2baResponseData.camt;
      sgstTotal += b2baResponseData.samt;
      igstTotal += b2baResponseData.iamt;
      invTotal += b2baResponseData.total;
    }

    if (b2claResponseData) {
      vouchersTotal += b2claResponseData.numberOfVoucher;
      taxableTotal += b2claResponseData.txval;
      cgstTotal += b2claResponseData.camt;
      sgstTotal += b2claResponseData.samt;
      igstTotal += b2claResponseData.iamt;
      invTotal += b2claResponseData.total;
    }

    if (b2csaResponseData) {
      vouchersTotal += b2csaResponseData.numberOfVoucher;
      taxableTotal += b2csaResponseData.txval;
      cgstTotal += b2csaResponseData.camt;
      sgstTotal += b2csaResponseData.samt;
      igstTotal += b2csaResponseData.iamt;
      invTotal += b2csaResponseData.total;
    }

    if (cdnraResponseData) {
      vouchersTotal += cdnraResponseData.numberOfVoucher;
      taxableTotal += cdnraResponseData.txval;
      cgstTotal += cdnraResponseData.camt;
      sgstTotal += cdnraResponseData.samt;
      igstTotal += cdnraResponseData.iamt;
      invTotal += cdnraResponseData.total;
    }

    if (cdnuraResponseData) {
      vouchersTotal += cdnuraResponseData.numberOfVoucher;
      taxableTotal += cdnuraResponseData.txval;
      cgstTotal += cdnuraResponseData.camt;
      sgstTotal += cdnuraResponseData.samt;
      igstTotal += cdnuraResponseData.iamt;
      invTotal += cdnuraResponseData.total;
    }

    if (nilResponseData) {
      vouchersTotal += nilResponseData.numberOfVoucher;
      taxableTotal += nilResponseData.txval;
      cgstTotal += nilResponseData.camt;
      sgstTotal += nilResponseData.samt;
      igstTotal += nilResponseData.iamt;
      invTotal += nilResponseData.total;
    }

    if (expResponseData) {
      vouchersTotal += expResponseData.numberOfVoucher;
      taxableTotal += expResponseData.txval;
      cgstTotal += expResponseData.camt;
      sgstTotal += expResponseData.samt;
      igstTotal += expResponseData.iamt;
      invTotal += expResponseData.total;
    }

    if (expaResponseData) {
      vouchersTotal += expaResponseData.numberOfVoucher;
      taxableTotal += expaResponseData.txval;
      cgstTotal += expaResponseData.camt;
      sgstTotal += expaResponseData.samt;
      igstTotal += expaResponseData.iamt;
      invTotal += expaResponseData.total;
    }

    return {
      b2b: b2bResponseData,
      b2cs: b2csResponseData,
      b2cl: b2clResponseData,
      cdnr: cdnrResponseData,
      cdnur: cdnurResponseData,
      b2ba: b2baResponseData,
      b2cla: b2claResponseData,
      b2csa: b2csaResponseData,
      cdnra: cdnraResponseData,
      cdnura: cdnuraResponseData,
      nil: nilResponseData,
      exp: expResponseData,
      expa: expaResponseData,
      b2beinv: b2bEInvoiceResponseData,
      total: {
        vouchersTotal: vouchersTotal,
        taxableTotal: taxableTotal,
        cgstTotal: cgstTotal,
        sgstTotal: sgstTotal,
        igstTotal: igstTotal,
        invTotal: invTotal
      }
    };
  };

  processExportData = async (exportData) => {
    let numberOfVoucher = 0;
    let txval = 0;
    let camt = 0;
    let samt = 0;
    let iamt = 0;
    let total = 0;

    exportData.forEach((exp) => {
      exp.inv.forEach((inv) => {
        numberOfVoucher += 1;
        inv.itms.forEach((itm) => {
          txval += parseFloat(itm.txval || 0);
          camt = 0;
          samt = 0;
          iamt += parseFloat(itm.iamt || 0);
          total += parseFloat(
            parseFloat(itm.txval || 0) + parseFloat(itm.iamt || 0) || 0
          );
        });
      });
    });

    return {
      numberOfVoucher,
      txval,
      camt,
      samt,
      iamt,
      total
    };
  };

  processB2bData = async (b2bData) => {
    let numberOfVoucher = 0;
    let txval = 0;
    let camt = 0;
    let samt = 0;
    let iamt = 0;
    let total = 0;

    b2bData.forEach((b2b) => {
      b2b.inv.forEach((inv) => {
        numberOfVoucher += 1;
        inv.itms.forEach((itm) => {
          txval += parseFloat(itm.itm_det.txval || 0);
          camt += parseFloat(itm.itm_det.camt || 0);
          samt += parseFloat(itm.itm_det.samt || 0);
          iamt += parseFloat(itm.itm_det.iamt || 0);
          total += parseFloat(
            parseFloat(itm.itm_det.txval || 0) +
              parseFloat(itm.itm_det.camt || 0) +
              parseFloat(itm.itm_det.samt || 0) +
              parseFloat(itm.itm_det.iamt || 0) || 0
          );
        });
      });
    });

    return {
      numberOfVoucher,
      txval,
      camt,
      samt,
      iamt,
      total
    };
  };

  processB2csData = async (b2csData) => {
    let numberOfVoucher = 0;
    let txval = 0;
    let camt = 0;
    let samt = 0;
    let iamt = 0;
    let total = 0;

    b2csData.forEach((b2cs) => {
      numberOfVoucher += 1;
      txval += parseFloat(b2cs.txval || 0);
      camt += parseFloat(b2cs.cgst_amount || 0);
      samt += parseFloat(b2cs.sgst_amount || 0);
      iamt += parseFloat(b2cs.igst_amount || 0);
      total += parseFloat(
        parseFloat(b2cs.txval || 0) +
          parseFloat(b2cs.cgst_amount || 0) +
          parseFloat(b2cs.sgst_amount || 0) +
          parseFloat(b2cs.igst_amount || 0) || 0
      );
    });

    return {
      numberOfVoucher,
      txval,
      camt,
      samt,
      iamt,
      total
    };
  };

  processB2clData = async (b2csData) => {
    let numberOfVoucher = 0;
    let txval = 0;
    let camt = 0;
    let samt = 0;
    let iamt = 0;
    let total = 0;

    b2csData.forEach((b2cl) => {
      b2cl.inv.forEach((inv) => {
        numberOfVoucher += 1;
        inv.itms.forEach((itm) => {
          txval += parseFloat(itm.itm_det.txval || 0);
          camt += parseFloat(itm.itm_det.camt || 0);
          samt += parseFloat(itm.itm_det.samt || 0);
          iamt += parseFloat(itm.itm_det.iamt || 0);
          total += parseFloat(
            parseFloat(itm.itm_det.txval || 0) +
              parseFloat(itm.itm_det.camt || 0) +
              parseFloat(itm.itm_det.samt || 0) +
              parseFloat(itm.itm_det.iamt || 0) || 0
          );
        });
      });
    });

    return {
      numberOfVoucher,
      txval,
      camt,
      samt,
      iamt,
      total
    };
  };

  processB2csaData = async (b2csData) => {
    let numberOfVoucher = 0;
    let txval = 0;
    let camt = 0;
    let samt = 0;
    let iamt = 0;
    let total = 0;

    b2csData.forEach((b2csa) => {
      b2csa.itms.forEach((itm) => {
        numberOfVoucher += 1;
        txval += parseFloat(itm.txval || 0);
        camt += parseFloat(itm.camt || 0);
        samt += parseFloat(itm.samt || 0);
        iamt += parseFloat(itm.iamt || 0);
        total += parseFloat(
          parseFloat(itm.txval || 0) +
            parseFloat(itm.camt || 0) +
            parseFloat(itm.samt || 0) +
            parseFloat(itm.iamt || 0) || 0
        );
      });
    });

    return {
      numberOfVoucher,
      txval,
      camt,
      samt,
      iamt,
      total
    };
  };

  processCdnrData = async (cdnrData) => {
    let numberOfVoucher = 0;
    let txval = 0;
    let camt = 0;
    let samt = 0;
    let iamt = 0;
    let total = 0;

    cdnrData.forEach((cdnr) => {
      cdnr.nt.forEach((nt) => {
        nt.itms.forEach((itm) => {
          numberOfVoucher += 1;
          txval += parseFloat(itm.itm_det.txval || 0);
          camt += parseFloat(itm.itm_det.camt || 0);
          samt += parseFloat(itm.itm_det.samt || 0);
          iamt += parseFloat(itm.itm_det.iamt || 0);
          total += parseFloat(
            parseFloat(itm.itm_det.txval || 0) +
              parseFloat(itm.itm_det.camt || 0) +
              parseFloat(itm.itm_det.samt || 0) +
              parseFloat(itm.itm_det.iamt || 0)
          );
        });
      });
    });

    return {
      numberOfVoucher,
      txval,
      camt,
      samt,
      iamt,
      total
    };
  };

  processCdnurData = async (cdnurData) => {
    let numberOfVoucher = 0;
    let txval = 0;
    let camt = 0;
    let samt = 0;
    let iamt = 0;
    let total = 0;

    cdnurData.forEach((cdnur) => {
      cdnur.itms.forEach((itm) => {
        numberOfVoucher += 1;
        txval += parseFloat(itm.itm_det.txval || 0);
        camt += parseFloat(itm.itm_det.camt || 0);
        samt += parseFloat(itm.itm_det.samt || 0);
        iamt += parseFloat(itm.itm_det.iamt || 0);
        total += parseFloat(
          parseFloat(itm.itm_det.txval || 0) +
            parseFloat(itm.itm_det.camt || 0) +
            parseFloat(itm.itm_det.samt || 0) +
            (itm.itm_det.iamt || 0) || 0
        );
      });
    });

    return {
      numberOfVoucher,
      txval,
      camt,
      samt,
      iamt,
      total
    };
  };

  processNilData = async (nilSalesListData, nilSalesReturnListData) => {
    let numberOfVoucher = 0;
    let txval = 0;
    let camt = 0;
    let samt = 0;
    let iamt = 0;
    let total = 0;

    if (
      nilSalesListData &&
      nilSalesListData.length > 0 &&
      nilSalesReturnListData &&
      nilSalesReturnListData.length === 0
    ) {
      for (let nil of nilSalesListData) {
        total += nil.expt_amt;
        total += nil.nil_amt;
        total += nil.ngsup_amt;
      }
    } else if (
      nilSalesListData &&
      nilSalesListData.length > 0 &&
      nilSalesReturnListData &&
      nilSalesReturnListData.length > 0
    ) {
      for (let nil of nilSalesListData) {
        for (let nilReturn of nilSalesReturnListData) {
          if (nil.sply_ty === nilReturn.sply_ty) {
            total += nil.expt_amt - nilReturn.expt_amt;
            total += nil.nil_amt - nilReturn.nil_amt;
            total += nil.ngsup_amt - nilReturn.ngsup_amt;
          }
        }
      }
    }

    return {
      numberOfVoucher,
      txval,
      camt,
      samt,
      iamt,
      total
    };
  };

  getCDNRData = async (fromDate, toDate) => {
    await Promise.all([this.getCDNRSalesReturnData(fromDate, toDate)]).then(
      async (result) => {
        let finalResult = [];
        if (this.cdnrSalesReturnList.length > 0) {
          finalResult = finalResult.concat(this.cdnrSalesReturnList);
        }

        runInAction(() => {
          this.cdnrList = finalResult;
        });
      }
    );
  };

  getUnitShortName = (qtyUnit) => {
    let unitCodeResult = unitHelper
      .getUnits()
      .find((e) => e.fullName === qtyUnit);

    return unitCodeResult ? unitCodeResult.shortName : 'PCS';
  };

  getHSNWiseSalesData = async (fromDate, toDate) => {
    let result = [];
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const auditSettings = await audit.getAuditSettingsData();

    const isJewellery =
      businessData.level1Categories &&
      Array.isArray(JSON.parse(businessData.level1Categories)) &&
      JSON.parse(businessData.level1Categories).includes('jewellery_level1');

    await db.sales
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { invoice_date: { $gte: fromDate } },
            { invoice_date: { $lte: toDate } }
          ]
        }
      })
      .exec()
      .then((data) => {
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
                ? this.getUnitShortName(product.qtyUnit)
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
          this.processAdditionalCharges(
            groupedData,
            data.packingTax,
            auditSettings.packingChargeHsn,
            'Packing Charge',
            data.packing_charge
          );
        }

        // Process shipping charge
        if (data.shippingTax) {
          this.processAdditionalCharges(
            groupedData,
            data.shippingTax,
            auditSettings.shippingChargeHsn,
            'Shipping Charge',
            data.shipping_charge
          );
        }

        // Process insurance charge
        if (data.insurance) {
          this.processAdditionalCharges(
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
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    result.sort((a, b) => a.num - b.num);

    runInAction(() => {
      this.hsnWiseSalesData = result;
    });

    return this.hsnWiseSalesData;
  };

  processAdditionalCharges = (
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

  getCDNRSalesReturnData = async (fromDate, toDate) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.salesreturn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              customerGSTNo: { $ne: '' }
            },
            { date: { $gte: fromDate } },
            { date: { $lte: toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }
        let result = [];

        data = data.filter(
          (item) =>
            (item.isCancelled === undefined ||
              item.isCancelled === null ||
              item.isCancelled === false) &&
            item.einvoiceBillStatus !== 'Cancelled'
        );

        runInAction(async () => {
          this.cdnrListJSON = await this.prepareForCdnrJsonFile(data);
        });

        data.map((item) => {
          let row = item.toJSON();
          let items = row.item_list;
          let taxSlabs = new Map();

          for (let item of items) {
            if (item.taxType === 'Nil-Rated' || item.taxType === 'Exempted') {
              continue;
            }

            let cess = 0;
            let igst_amount = 0;
            let cgst_amount = 0;
            let sgst_amount = 0;
            let total_tax = 0;
            let amount = 0;
            let txval = 0;
            //add all items tax and amount details in map then finally that many rows in
            if (taxSlabs.has(item.cgst) || taxSlabs.has(item.igst)) {
              let existingRow = {};

              if (taxSlabs.has(item.cgst)) {
                existingRow = taxSlabs.get(item.cgst);
              } else {
                existingRow = taxSlabs.get(item.igst);
              }
              cess = parseFloat(existingRow.cess);
              igst_amount = parseFloat(existingRow.igst_amount);
              cgst_amount = parseFloat(existingRow.cgst_amount);
              sgst_amount = parseFloat(existingRow.sgst_amount);
              total_tax = parseFloat(existingRow.total_tax);
              amount = parseFloat(existingRow.amount);
              txval = parseFloat(existingRow.txval);
            }

            cess = cess + parseFloat(item.cess);
            igst_amount =
              parseFloat(igst_amount) + parseFloat(item.igst_amount);
            cgst_amount =
              parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
            sgst_amount =
              parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
            amount = parseFloat(amount) + parseFloat(item.amount);

            total_tax =
              parseFloat(cess) +
              parseFloat(cgst_amount) +
              parseFloat(sgst_amount) +
              parseFloat(igst_amount);

            let taxableValue = 0;
            taxableValue =
              parseFloat(item.amount) -
              (parseFloat(item.cgst_amount) +
                parseFloat(item.sgst_amount) +
                parseFloat(item.igst_amount) +
                parseFloat(item.cess));

            txval = taxableValue;

            let tempRow = {};
            tempRow.total_tax = parseFloat(parseFloat(total_tax).toFixed(2));
            tempRow.cess = parseFloat(parseFloat(cess).toFixed(2));
            tempRow.igst_amount = parseFloat(
              parseFloat(igst_amount).toFixed(2)
            );
            tempRow.cgst_amount = parseFloat(
              parseFloat(cgst_amount).toFixed(2)
            );
            tempRow.sgst_amount = parseFloat(
              parseFloat(sgst_amount).toFixed(2)
            );
            tempRow.amount = parseFloat(parseFloat(amount).toFixed(2));
            tempRow.txval = parseFloat(parseFloat(txval).toFixed(2));

            if (item.cgst > 0) {
              taxSlabs.set(item.cgst, tempRow);
            } else {
              taxSlabs.set(item.igst, tempRow);
            }
          }

          taxSlabs.forEach((value, key) => {
            // console.log(value, key);
            let individualTaxSlotRow = item.toJSON();

            let taxRecord = value;
            individualTaxSlotRow.total_tax = parseFloat(
              taxRecord.total_tax
            ).toFixed(2);
            individualTaxSlotRow.cess = taxRecord.cess;
            individualTaxSlotRow.igst_amount = parseFloat(
              taxRecord.igst_amount
            ).toFixed(2);
            individualTaxSlotRow.cgst_amount = parseFloat(
              taxRecord.cgst_amount
            ).toFixed(2);
            individualTaxSlotRow.sgst_amount = parseFloat(
              taxRecord.sgst_amount
            ).toFixed(2);
            individualTaxSlotRow.amount = parseFloat(taxRecord.amount).toFixed(
              2
            );

            individualTaxSlotRow.txval = parseFloat(taxRecord.txval).toFixed(2);

            if (individualTaxSlotRow.igst_amount > 0) {
              individualTaxSlotRow.tax_percentage = parseFloat(key);
            } else {
              individualTaxSlotRow.tax_percentage = parseFloat(key) * 2;
            }

            result.push(individualTaxSlotRow);
            individualTaxSlotRow = {};
          });
        });
        runInAction(() => {
          this.cdnrSalesReturnList = result;
        });
      });
  };

  getCDNURData = async (state, fromDate, toDate) => {
    await Promise.all([
      this.getCDNURSalesReturnData(state, fromDate, toDate)
    ]).then(async (result) => {
      let finalResult = [];
      let finalResultJSON = [];
      if (this.cdnurSalesReturnList.length > 0) {
        finalResult = finalResult.concat(this.cdnurSalesReturnList);
      }

      if (this.cdnurSalesReturnListJSON.length > 0) {
        finalResultJSON = finalResultJSON.concat(this.cdnurSalesReturnListJSON);
      }

      runInAction(() => {
        this.cdnurList = finalResult;
        this.cdnurListJSON = finalResultJSON;
      });
    });
  };

  getCDNURSalesReturnData = async (state, fromDate, toDate) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.salesreturn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            // { total_amount: { $gte: 250000 } }, //removed this based on gourav input
            { customerGSTNo: { $eq: '' } },
            { customerState: { $ne: state } },
            { date: { $gte: fromDate } },
            { date: { $lte: toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }
        let result = [];

        data = data.filter(
          (item) =>
            (item.isCancelled === undefined ||
              item.isCancelled === null ||
              item.isCancelled === false) &&
            item.einvoiceBillStatus !== 'Cancelled'
        );

        //process to JSON file
        this.cdnurSalesReturnListJSON = await this.prepareForCdnurJsonFile(
          data
        );

        data.map(async (item) => {
          let row = item.toJSON();
          let items = row.item_list;
          let taxSlabs = new Map();

          for (let item of items) {
            if (item.taxType === 'Nil-Rated' || item.taxType === 'Exempted') {
              continue;
            }

            let cess = 0;
            let igst_amount = 0;
            let cgst_amount = 0;
            let sgst_amount = 0;
            let total_tax = 0;
            let amount = 0;
            let txval = 0;

            //add all items tax and amount details in map then finally that many rows in
            if (taxSlabs.has(item.cgst) || taxSlabs.has(item.igst)) {
              let existingRow = {};

              if (taxSlabs.has(item.cgst)) {
                existingRow = taxSlabs.get(item.cgst);
              } else {
                existingRow = taxSlabs.get(item.igst);
              }
              cess = parseFloat(existingRow.cess);
              igst_amount = parseFloat(existingRow.igst_amount);
              cgst_amount = parseFloat(existingRow.cgst_amount);
              sgst_amount = parseFloat(existingRow.sgst_amount);
              total_tax = parseFloat(existingRow.total_tax);
              amount = parseFloat(existingRow.amount);
              txval = parseFloat(existingRow.txval);
            }

            cess = cess + parseFloat(item.cess);
            igst_amount =
              parseFloat(igst_amount) + parseFloat(item.igst_amount);
            cgst_amount =
              parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
            sgst_amount =
              parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
            amount = parseFloat(amount) + parseFloat(item.amount);

            let taxableValue = 0;

            taxableValue =
              parseFloat(item.amount) -
              (parseFloat(item.cgst_amount) +
                parseFloat(item.sgst_amount) +
                parseFloat(item.igst_amount) +
                parseFloat(item.cess));

            txval = taxableValue;

            total_tax =
              parseFloat(cess) +
              parseFloat(cgst_amount) +
              parseFloat(sgst_amount) +
              parseFloat(igst_amount);

            let tempRow = {};
            tempRow.total_tax = parseFloat(total_tax.toFixed(2));
            tempRow.cess = cess;
            tempRow.igst_amount = parseFloat(igst_amount.toFixed(2));
            tempRow.cgst_amount = parseFloat(cgst_amount.toFixed(2));
            tempRow.sgst_amount = parseFloat(sgst_amount.toFixed(2));
            tempRow.amount = parseFloat(amount.toFixed(2));

            tempRow.txval = parseFloat(txval.toFixed(2));

            if (item.cgst > 0) {
              taxSlabs.set(item.cgst, tempRow);
            } else {
              taxSlabs.set(item.igst, tempRow);
            }
          }

          taxSlabs.forEach((value, key) => {
            // console.log(value, key);
            let individualTaxSlotRow = item.toJSON();

            let taxRecord = value;
            individualTaxSlotRow.total_tax = parseFloat(
              taxRecord.total_tax.toFixed(2)
            );
            individualTaxSlotRow.cess = taxRecord.cess;
            individualTaxSlotRow.igst_amount = parseFloat(
              taxRecord.igst_amount.toFixed(2)
            );
            individualTaxSlotRow.cgst_amount = parseFloat(
              taxRecord.cgst_amount.toFixed(2)
            );
            individualTaxSlotRow.sgst_amount = parseFloat(
              taxRecord.sgst_amount.toFixed(2)
            );
            individualTaxSlotRow.amount = parseFloat(
              taxRecord.amount.toFixed(2)
            );

            individualTaxSlotRow.txval = parseFloat(taxRecord.txval).toFixed(2);

            if (individualTaxSlotRow.igst_amount > 0) {
              individualTaxSlotRow.tax_percentage = parseFloat(key.toFixed(2));
            } else {
              individualTaxSlotRow.tax_percentage = parseFloat(
                parseFloat(key) * (2).toFixed(2)
              );
            }

            result.push(individualTaxSlotRow);
            individualTaxSlotRow = {};
          });
        });
        this.cdnurSalesReturnList = result;
      });
  };

  getCDNRAData = async (fromDate, toDate) => {
    await Promise.all([this.getCDNRASalesReturnData(fromDate, toDate)]).then(
      async (result) => {
        let finalResult = [];
        if (this.cdnraSalesReturnList.length > 0) {
          finalResult = finalResult.concat(this.cdnraSalesReturnList);
        }

        runInAction(() => {
          this.cdnraSalesReturnList = finalResult;
        });
      }
    );
  };

  getCDNRASalesReturnData = async (fromDate, toDate) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.salesreturn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              customerGSTNo: { $ne: '' }
            },
            { date: { $gte: fromDate } },
            { date: { $lte: toDate } },
            {
              amended: { $eq: true }
            }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }
        let result = [];

        data = data.filter(
          (item) =>
            (item.isCancelled === undefined ||
              item.isCancelled === null ||
              item.isCancelled === false) &&
            item.einvoiceBillStatus !== 'Cancelled'
        );

        runInAction(async () => {
          this.cdnraListJSON = await this.prepareForCdnraJsonFile(data);
        });

        data.map((item) => {
          let row = item.toJSON();
          let items = row.item_list;
          let taxSlabs = new Map();

          for (let item of items) {
            if (item.taxType === 'Nil-Rated' || item.taxType === 'Exempted') {
              continue;
            }

            let cess = 0;
            let igst_amount = 0;
            let cgst_amount = 0;
            let sgst_amount = 0;
            let total_tax = 0;
            let amount = 0;
            let txval = 0;
            //add all items tax and amount details in map then finally that many rows in
            if (taxSlabs.has(item.cgst) || taxSlabs.has(item.igst)) {
              let existingRow = {};

              if (taxSlabs.has(item.cgst)) {
                existingRow = taxSlabs.get(item.cgst);
              } else {
                existingRow = taxSlabs.get(item.igst);
              }
              cess = parseFloat(existingRow.cess);
              igst_amount = parseFloat(existingRow.igst_amount);
              cgst_amount = parseFloat(existingRow.cgst_amount);
              sgst_amount = parseFloat(existingRow.sgst_amount);
              total_tax = parseFloat(existingRow.total_tax);
              amount = parseFloat(existingRow.amount);
              txval = parseFloat(existingRow.txval);
            }

            cess = cess + parseFloat(item.cess);
            igst_amount =
              parseFloat(igst_amount) + parseFloat(item.igst_amount);
            cgst_amount =
              parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
            sgst_amount =
              parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
            amount = parseFloat(amount) + parseFloat(item.amount);

            total_tax =
              parseFloat(cess) +
              parseFloat(cgst_amount) +
              parseFloat(sgst_amount) +
              parseFloat(igst_amount);

            let taxableValue = 0;
            taxableValue =
              parseFloat(item.amount) -
              (parseFloat(item.cgst_amount) +
                parseFloat(item.sgst_amount) +
                parseFloat(item.igst_amount) +
                parseFloat(item.cess));

            txval = taxableValue;

            let tempRow = {};
            tempRow.total_tax = parseFloat(parseFloat(total_tax).toFixed(2));
            tempRow.cess = parseFloat(parseFloat(cess).toFixed(2));
            tempRow.igst_amount = parseFloat(
              parseFloat(igst_amount).toFixed(2)
            );
            tempRow.cgst_amount = parseFloat(
              parseFloat(cgst_amount).toFixed(2)
            );
            tempRow.sgst_amount = parseFloat(
              parseFloat(sgst_amount).toFixed(2)
            );
            tempRow.amount = parseFloat(parseFloat(amount).toFixed(2));
            tempRow.txval = parseFloat(parseFloat(txval).toFixed(2));

            if (item.cgst > 0) {
              taxSlabs.set(item.cgst, tempRow);
            } else {
              taxSlabs.set(item.igst, tempRow);
            }
          }

          taxSlabs.forEach((value, key) => {
            // console.log(value, key);
            let individualTaxSlotRow = item.toJSON();

            let taxRecord = value;
            individualTaxSlotRow.total_tax = parseFloat(
              taxRecord.total_tax
            ).toFixed(2);
            individualTaxSlotRow.cess = taxRecord.cess;
            individualTaxSlotRow.igst_amount = parseFloat(
              taxRecord.igst_amount
            ).toFixed(2);
            individualTaxSlotRow.cgst_amount = parseFloat(
              taxRecord.cgst_amount
            ).toFixed(2);
            individualTaxSlotRow.sgst_amount = parseFloat(
              taxRecord.sgst_amount
            ).toFixed(2);
            individualTaxSlotRow.amount = parseFloat(taxRecord.amount).toFixed(
              2
            );

            individualTaxSlotRow.txval = parseFloat(taxRecord.txval).toFixed(2);

            if (individualTaxSlotRow.igst_amount > 0) {
              individualTaxSlotRow.tax_percentage = parseFloat(key);
            } else {
              individualTaxSlotRow.tax_percentage = parseFloat(key) * 2;
            }

            result.push(individualTaxSlotRow);
            individualTaxSlotRow = {};
          });
        });
        runInAction(() => {
          this.cdnraSalesReturnList = result;
        });
      });
  };

  getCDNURAData = async (state, fromDate, toDate) => {
    await Promise.all([
      this.getCDNURASalesReturnData(state, fromDate, toDate)
    ]).then(async (result) => {
      let finalResult = [];
      let finalResultJSON = [];
      if (this.cdnuraSalesReturnList.length > 0) {
        finalResult = finalResult.concat(this.cdnuraSalesReturnList);
      }

      if (this.cdnuraSalesReturnListJSON.length > 0) {
        finalResultJSON = finalResultJSON.concat(
          this.cdnuraSalesReturnListJSON
        );
      }

      runInAction(() => {
        this.cdnuraSalesReturnList = finalResult;
        this.cdnuraSalesReturnListJSON = finalResultJSON;
      });
    });
  };

  getCDNURASalesReturnData = async (state, fromDate, toDate) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.salesreturn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            // { total_amount: { $gte: 250000 } }, //removed this based on gourav input
            { customerGSTNo: { $eq: '' } },
            { customerState: { $ne: state } },
            { date: { $gte: fromDate } },
            { date: { $lte: toDate } },
            {
              amended: { $eq: true }
            }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }
        let result = [];

        data = data.filter(
          (item) =>
            (item.isCancelled === undefined ||
              item.isCancelled === null ||
              item.isCancelled === false) &&
            item.einvoiceBillStatus !== 'Cancelled'
        );

        //process to JSON file
        this.cdnuraSalesReturnListJSON = await this.prepareForCdnuraJsonFile(
          data
        );

        data.map(async (item) => {
          let row = item.toJSON();
          let items = row.item_list;
          let taxSlabs = new Map();

          for (let item of items) {
            if (item.taxType === 'Nil-Rated' || item.taxType === 'Exempted') {
              continue;
            }

            let cess = 0;
            let igst_amount = 0;
            let cgst_amount = 0;
            let sgst_amount = 0;
            let total_tax = 0;
            let amount = 0;
            let txval = 0;

            //add all items tax and amount details in map then finally that many rows in
            if (taxSlabs.has(item.cgst) || taxSlabs.has(item.igst)) {
              let existingRow = {};

              if (taxSlabs.has(item.cgst)) {
                existingRow = taxSlabs.get(item.cgst);
              } else {
                existingRow = taxSlabs.get(item.igst);
              }
              cess = parseFloat(existingRow.cess);
              igst_amount = parseFloat(existingRow.igst_amount);
              cgst_amount = parseFloat(existingRow.cgst_amount);
              sgst_amount = parseFloat(existingRow.sgst_amount);
              total_tax = parseFloat(existingRow.total_tax);
              amount = parseFloat(existingRow.amount);
              txval = parseFloat(existingRow.txval);
            }

            cess = cess + parseFloat(item.cess);
            igst_amount =
              parseFloat(igst_amount) + parseFloat(item.igst_amount);
            cgst_amount =
              parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
            sgst_amount =
              parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
            amount = parseFloat(amount) + parseFloat(item.amount);

            let taxableValue = 0;

            taxableValue =
              parseFloat(item.amount) -
              (parseFloat(item.cgst_amount) +
                parseFloat(item.sgst_amount) +
                parseFloat(item.igst_amount) +
                parseFloat(item.cess));

            txval = taxableValue;

            total_tax =
              parseFloat(cess) +
              parseFloat(cgst_amount) +
              parseFloat(sgst_amount) +
              parseFloat(igst_amount);

            let tempRow = {};
            tempRow.total_tax = parseFloat(total_tax.toFixed(2));
            tempRow.cess = cess;
            tempRow.igst_amount = parseFloat(igst_amount.toFixed(2));
            tempRow.cgst_amount = parseFloat(cgst_amount.toFixed(2));
            tempRow.sgst_amount = parseFloat(sgst_amount.toFixed(2));
            tempRow.amount = parseFloat(amount.toFixed(2));

            tempRow.txval = parseFloat(txval.toFixed(2));

            if (item.cgst > 0) {
              taxSlabs.set(item.cgst, tempRow);
            } else {
              taxSlabs.set(item.igst, tempRow);
            }
          }

          taxSlabs.forEach((value, key) => {
            // console.log(value, key);
            let individualTaxSlotRow = item.toJSON();

            let taxRecord = value;
            individualTaxSlotRow.total_tax = parseFloat(
              taxRecord.total_tax.toFixed(2)
            );
            individualTaxSlotRow.cess = taxRecord.cess;
            individualTaxSlotRow.igst_amount = parseFloat(
              taxRecord.igst_amount.toFixed(2)
            );
            individualTaxSlotRow.cgst_amount = parseFloat(
              taxRecord.cgst_amount.toFixed(2)
            );
            individualTaxSlotRow.sgst_amount = parseFloat(
              taxRecord.sgst_amount.toFixed(2)
            );
            individualTaxSlotRow.amount = parseFloat(
              taxRecord.amount.toFixed(2)
            );

            individualTaxSlotRow.txval = parseFloat(taxRecord.txval).toFixed(2);

            if (individualTaxSlotRow.igst_amount > 0) {
              individualTaxSlotRow.tax_percentage = parseFloat(key.toFixed(2));
            } else {
              individualTaxSlotRow.tax_percentage = parseFloat(
                parseFloat(key) * (2).toFixed(2)
              );
            }

            result.push(individualTaxSlotRow);
            individualTaxSlotRow = {};
          });
        });
        this.cdnuraSalesReturnList = result;
      });
  };

  getExpData = async () => {
    let result = [];
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.sales
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { customerGstType: { $eq: 'Oveseas Customer' } },
            { invoice_date: { $gte: this.GSTRDateRange.fromDate } },
            { invoice_date: { $lte: this.GSTRDateRange.toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }

        data = data.filter(
          (item) =>
            (item.isCancelled === undefined ||
              item.isCancelled === null ||
              item.isCancelled === false) &&
            item.einvoiceBillStatus !== 'Cancelled'
        );

        data.map((item) => {
          let finalData = item.toJSON();

          let items = finalData.item_list;

          let cess = 0;
          let igst_amount = 0;
          let cgst_amount = 0;
          let sgst_amount = 0;

          for (let item of items) {
            cess = cess + parseFloat(item.cess);
            igst_amount =
              parseFloat(igst_amount) + parseFloat(item.igst_amount);
            cgst_amount =
              parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
            sgst_amount =
              parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
          }

          finalData.cess = parseFloat(cess).toFixed(2);
          finalData.igst_amount = parseFloat(igst_amount).toFixed(2);
          finalData.cgst_amount = parseFloat(cgst_amount).toFixed(2);
          finalData.sgst_amount = parseFloat(sgst_amount).toFixed(2);
          finalData.total_tax =
            parseFloat(finalData.igst_amount) +
            parseFloat(finalData.cgst_amount) +
            parseFloat(finalData.sgst_amount);

          let taxableValue = 0;
          //if tax is included then remove tax from the total amount
          // if (finalData.taxIncluded) {
          taxableValue =
            finalData.total_amount -
            (parseFloat(finalData.cgst_amount) +
              parseFloat(finalData.sgst_amount) +
              parseFloat(finalData.igst_amount) +
              parseFloat(finalData.cess));
          // } else {
          //   taxableValue = finalData.amount;
          // }

          finalData.txval = taxableValue;

          result.push(finalData);
        });
        // console.log(data);
        // console.log(result);
        this.expData = result;
      });
  };

  filterWithPrefix = (prefix) => {
    runInAction(() => {
      this.prefixData.sales = prefix;
    });
    this.getSalesData();
  };

  handleOnlineGSTRModalOpen = async () => {
    runInAction(() => {
      this.onlineGSTRDialogOpen = true;
    });
  };

  handleOnlineGSTRModalClose = async () => {
    runInAction(() => {
      this.onlineGSTRDialogOpen = false;
    });
  };

  updateStep = async (stepNo) => {
    runInAction(() => {
      this.step = stepNo;
    });
  };

  updateReviewStep = async (stepNo) => {
    runInAction(() => {
      this.reviewStep = stepNo;
    });
  };

  updateGSTAuth = async (data) => {
    runInAction(() => {
      this.gstAuth = data;
    });
  };

  prepareGSTR1OnlineData = (value) => {
    runInAction(() => {
      this.prepareOnlineData = value;
    });
  };

  proceedToOnlineFilingScreen = (value) => {
    runInAction(() => {
      this.proceedToOnlineFiling = value;
    });
  };

  setGSTR1UploadData = (value) => {
    runInAction(() => {
      this.gstr1UploadData = value;
    });
  };

  updateRetSaveReviewStep = async (stepNo) => {
    runInAction(() => {
      this.retSaveReviewStep = stepNo;
    });
  };

  setGSTR1SummaryUploadData = (value) => {
    runInAction(() => {
      this.retSaveSummary = value;
    });
  };

  setIsSummaryGenerate = (value) => {
    runInAction(() => {
      this.isSummaryGenerated = value;
    });
  };

  setFiled = (value) => {
    this.isFiled = value;
  };

  getNilDataFromSale = async (fromDate, toDate) => {
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      let intermediateResults = [];
      const db = await Db.get();
      await db.sales
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              }
            ]
          }
        })
        .exec()
        .then(async (data) => {
          let row;

          data = data.filter(
            (item) =>
              (item.isCancelled === undefined ||
                item.isCancelled === null ||
                item.isCancelled === false) &&
              item.einvoiceBillStatus !== 'Cancelled'
          );

          const selectedData = data.map((item) => ({
            irnNo: item.irnNo,
            customerGSTNo: item.customerGSTNo,
            placeOfSupplyName: item.placeOfSupplyName,
            sequenceNumber: item.sequenceNumber,
            date: item.date,
            total_amount: item.total_amount,
            balance_amount: item.balance_amount,
            customer_name: item.customer_name,
            sales_return_number: item.sales_return_number,
            payment_type: item.payment_type,
            item_list: item.item_list
          }));

          //get all documents having issues
          let totalTxVal = 0;
          let isErrorObj = false;

          let taxData = await taxSettings.getTaxSettingsDetails();
          let supplyType = '';

          selectedData.map((item) => {
            row = item;

            if (
              row.irnNo === null ||
              row.irnNo === '' ||
              row.irnNo === undefined
            ) {
              if (taxData && taxData.gstin && taxData.gstin !== '') {
                let businessStateCode = taxData.gstin.slice(0, 2);
                if (item.customerGSTNo && item.customerGSTNo !== '') {
                  let customerExtractedStateCode = item.customerGSTNo.slice(
                    0,
                    2
                  );
                  if (
                    businessStateCode !== '' &&
                    customerExtractedStateCode !== '' &&
                    businessStateCode === customerExtractedStateCode
                  ) {
                    supplyType = 'INTRAB2B';
                  } else {
                    supplyType = 'INTRB2B';
                  }
                } else if (
                  item.placeOfSupplyName &&
                  item.placeOfSupplyName !== ''
                ) {
                  let result = getStateList().find(
                    (e) => e.code === businessStateCode
                  );
                  if (result) {
                    let businessState = result.name;
                    if (
                      item.placeOfSupplyName !== '' &&
                      item.placeOfSupplyName !== null &&
                      businessState !== '' &&
                      businessState !== null &&
                      item.placeOfSupplyName.toLowerCase() ===
                        businessState.toLowerCase()
                    ) {
                      supplyType = 'INTRAB2C';
                    } else {
                      supplyType = 'INTRB2C';
                    }
                  }
                } else {
                  supplyType = 'INTRAB2C';
                }
              }
              let items = row.item_list;

              let itemMessage =
                '<br /> <b>Nil Error Summary: </b>' +
                '<br /><br /><b>Invoice No: </b>' +
                row.sequenceNumber +
                '<br />';

              totalTxVal = 0;
              isErrorObj = false;

              let i = 0;
              for (let item of items) {
                let prodMessage = '';
                let tempRow = {};
                if (item.taxType === 'Nil-Rated') {
                  tempRow.nil_amt = parseFloat(item.amount).toFixed(2);
                  tempRow.supplyType = supplyType;
                } else if (item.taxType === 'Exempted') {
                  tempRow.expt_amt = parseFloat(item.amount).toFixed(2);
                  tempRow.supplyType = supplyType;
                } else if (item.taxType === 'Non-GST') {
                  tempRow.ngsup_amt = parseFloat(item.amount).toFixed(2);
                  tempRow.supplyType = supplyType;
                }

                if (
                  item.hsn === '' ||
                  item.hsn === null ||
                  item.hsn === undefined
                ) {
                  isErrorObj = true;
                  prodMessage += 'HSN is not defined<br />';
                } else if (item.hsn !== '') {
                  if (
                    item.hsn.length === 4 ||
                    item.hsn.length === 6 ||
                    item.hsn.length === 8
                  ) {
                    // do nothing
                  } else {
                    isErrorObj = true;
                    prodMessage += 'HSN code length is not valid<br />';
                  }
                }

                if (prodMessage !== '') {
                  let slNo = i + 1;
                  itemMessage +=
                    '<br /><b>Sl No: </b>' +
                    slNo +
                    '  <b>Product Name: </b>' +
                    tempRow.item_name +
                    '<br />';

                  itemMessage += prodMessage;
                }

                tempRow.isErrorObj = isErrorObj;
                tempRow.itemMessage = itemMessage;
                tempRow.totalTxVal = parseFloat(totalTxVal);
                if (tempRow.supplyType && tempRow.supplyType !== '') {
                  intermediateResults.push(tempRow);
                }
                i++;
              }

              if (isErrorObj) {
                const errorObj = Gstr1ErrorObj.createGstr1ErrorObject(
                  row.sequenceNumber, // Sequence no
                  row.invoice_number, // Invoice number
                  row.invoice_date, // Date
                  row.total_amount, // Total
                  row.balance_amount, // Balance
                  row.customer_name, // Customer name
                  row.customerGSTNo, // GST No
                  row.payment_type, // Payment type
                  row.place_of_supply, // Place Of Supply
                  itemMessage, // Error Reason
                  totalTxVal, // Taxable Value
                  'Sales'
                );

                runInAction(() => {
                  let result =
                    this.docErrorsListJSON &&
                    this.docErrorsListJSON.find(
                      (e) => e.invoiceNumber === row.invoice_number
                    );

                  if (!result) {
                    this.docErrorsListJSON.push(errorObj);
                  }
                });
              }
            }
          });

          //grouping logic
          let groupedData = {};
          intermediateResults.forEach((item) => {
            if (!groupedData[item.supplyType]) {
              groupedData[item.supplyType] = {
                sply_ty: item.supplyType,
                expt_amt: 0,
                nil_amt: 0,
                ngsup_amt: 0
              };
            }

            groupedData[item.supplyType].expt_amt += parseFloat(
              item.expt_amt || 0
            );
            groupedData[item.supplyType].nil_amt += parseFloat(
              item.nil_amt || 0
            );
            groupedData[item.supplyType].ngsup_amt += parseFloat(
              item.ngsup_amt || 0
            );
          });

          let nil_data = [];
          for (const type in groupedData) {
            nil_data.push(groupedData[type]);
          }

          runInAction(() => {
            this.nilSalesListData = nil_data;
          });

          resolve(`got data`);
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    });
  };

  getNilDataFromSalesReturn = async (fromDate, toDate) => {
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      let intermediateResults = [];
      const db = await Db.get();
      await db.salesreturn
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          }
        })
        .exec()
        .then(async (data) => {
          let row;

          data = data.filter(
            (item) =>
              (item.isCancelled === undefined ||
                item.isCancelled === null ||
                item.isCancelled === false) &&
              item.einvoiceBillStatus !== 'Cancelled'
          );

          const selectedData = data.map((item) => ({
            irnNo: item.irnNo,
            customerGSTNo: item.customerGSTNo,
            customerState: item.customerState,
            sequenceNumber: item.sequenceNumber,
            date: item.date,
            total_amount: item.total_amount,
            balance_amount: item.balance_amount,
            customer_name: item.customer_name,
            sales_return_number: item.sales_return_number,
            payment_type: item.payment_type,
            item_list: item.item_list
          }));

          //get all documents having issues
          let totalTxVal = 0;
          let isErrorObj = false;

          let taxData = await taxSettings.getTaxSettingsDetails();
          let supplyType = '';

          selectedData.map((item) => {
            row = item;

            if (
              row.irnNo === null ||
              row.irnNo === '' ||
              row.irnNo === undefined
            ) {
              if (taxData && taxData.gstin && taxData.gstin !== '') {
                let businessStateCode = taxData.gstin.slice(0, 2);
                if (item.customerGSTNo && item.customerGSTNo !== '') {
                  let customerExtractedStateCode = item.customerGSTNo.slice(
                    0,
                    2
                  );
                  if (
                    businessStateCode !== '' &&
                    customerExtractedStateCode !== '' &&
                    businessStateCode === customerExtractedStateCode
                  ) {
                    supplyType = 'INTRAB2B';
                  } else {
                    supplyType = 'INTRB2B';
                  }
                } else if (item.customerState && item.customerState !== '') {
                  let result = getStateList().find(
                    (e) => e.code === businessStateCode
                  );
                  if (result) {
                    let businessState = result.name;
                    if (
                      item.customerState !== '' &&
                      item.customerState !== null &&
                      businessState !== '' &&
                      businessState !== null &&
                      item.customerState.toLowerCase() ===
                        businessState.toLowerCase()
                    ) {
                      supplyType = 'INTRAB2C';
                    } else {
                      supplyType = 'INTRB2C';
                    }
                  }
                } else {
                  supplyType = 'INTRAB2C';
                }
              }
              let items = row.item_list;

              let itemMessage =
                '<br /> <b>Nil Error Summary: </b>' +
                '<br /><br /><b>Invoice No: </b>' +
                row.sequenceNumber +
                '<br />';

              totalTxVal = 0;
              isErrorObj = false;

              let i = 0;
              for (let item of items) {
                let prodMessage = '';
                let tempRow = {};
                if (item.taxType === 'Nil-Rated') {
                  tempRow.nil_amt = parseFloat(item.amount).toFixed(2);
                  tempRow.supplyType = supplyType;
                } else if (item.taxType === 'Exempted') {
                  tempRow.expt_amt = parseFloat(item.amount).toFixed(2);
                  tempRow.supplyType = supplyType;
                } else if (item.taxType === 'Non-GST') {
                  tempRow.ngsup_amt = parseFloat(item.amount).toFixed(2);
                  tempRow.supplyType = supplyType;
                }

                if (
                  item.hsn === '' ||
                  item.hsn === null ||
                  item.hsn === undefined
                ) {
                  isErrorObj = true;
                  prodMessage += 'HSN is not defined<br />';
                } else if (item.hsn !== '') {
                  if (
                    item.hsn.length === 4 ||
                    item.hsn.length === 6 ||
                    item.hsn.length === 8
                  ) {
                    // do nothing
                  } else {
                    isErrorObj = true;
                    prodMessage += 'HSN code length is not valid<br />';
                  }
                }

                if (prodMessage !== '') {
                  let slNo = i + 1;
                  itemMessage +=
                    '<br /><b>Sl No: </b>' +
                    slNo +
                    '  <b>Product Name: </b>' +
                    tempRow.item_name +
                    '<br />';

                  itemMessage += prodMessage;
                }

                tempRow.isErrorObj = isErrorObj;
                tempRow.itemMessage = itemMessage;
                tempRow.totalTxVal = parseFloat(totalTxVal);
                if (tempRow.supplyType !== '') {
                  intermediateResults.push(tempRow);
                }
                i++;
              }

              if (isErrorObj) {
                const errorObj = Gstr1ErrorObj.createGstr1ErrorObject(
                  row.sequenceNumber, // Sequence no
                  row.invoice_number, // Invoice number
                  row.invoice_date, // Date
                  row.total_amount, // Total
                  row.balance_amount, // Balance
                  row.customer_name, // Customer name
                  row.customerGSTNo, // GST No
                  row.payment_type, // Payment type
                  row.place_of_supply, // Place Of Supply
                  itemMessage, // Error Reason
                  totalTxVal, // Taxable Value
                  'Sales'
                );

                runInAction(() => {
                  let result =
                    this.docErrorsListJSON &&
                    this.docErrorsListJSON.find(
                      (e) => e.invoiceNumber === row.invoice_number
                    );

                  if (!result) {
                    this.docErrorsListJSON.push(errorObj);
                  }
                });
              }
            }
          });

          //grouping logic
          let groupedData = {};
          intermediateResults.forEach((item) => {
            if (!groupedData[item.supplyType]) {
              groupedData[item.supplyType] = {
                sply_ty: item.supplyType,
                expt_amt: 0,
                nil_amt: 0,
                ngsup_amt: 0
              };
            }

            groupedData[item.supplyType].expt_amt += parseFloat(
              item.expt_amt || 0
            );
            groupedData[item.supplyType].nil_amt += parseFloat(
              item.nil_amt || 0
            );
            groupedData[item.supplyType].ngsup_amt += parseFloat(
              item.ngsup_amt || 0
            );
          });

          let nil_data = [];
          for (const type in groupedData) {
            nil_data.push(groupedData[type]);
          }

          runInAction(() => {
            this.nilSalesReturnListData = nil_data;
          });

          resolve(`got data`);
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    });
  };

  resetData = () => {
    runInAction(() => {
      this.b2bSalesListJSON = [];
      this.b2clSalesList = [];
      this.b2csSalesList = [];
      this.cdnrList = [];
      this.cdnrListJSON = [];
      this.cdnurListJSON = [];
      this.b2baSalesListJSON = [];
      this.b2claSalesListJSON = [];
      this.b2csaSalesListJSON = [];
      this.cdnraListJSON = [];
      this.cdnuraSalesReturnListJSON = [];
      this.nilSalesListData = [];
      this.nilSalesReturnListData = [];
    });
  };

  getExportType = (exportType) => {
    if (
      exportType === 'Export with IGST' ||
      exportType === 'SEZ with IGST payment' ||
      exportType === 'A deemed export'
    ) {
      return 'WPAY';
    }

    return 'WOPAY';
  };

  getExportSalesDataForGSTR = async (fromDate, toDate) => {
    return new Promise(async (resolve) => {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      await db.sales
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              },
              {
                exportType: { $ne: '' }
              },
              {
                exportType: { $ne: null }
              }
            ]
          }
        })
        .exec()
        .then((data) => {
          data = data.filter(
            (item) =>
              (item.isCancelled === undefined ||
                item.isCancelled === null ||
                item.isCancelled === false) &&
              item.einvoiceBillStatus !== 'Cancelled'
          );

          const selectedData = data.map((item) => ({
            invoice_date: item.invoice_date,
            irnNo: item.irnNo,
            customerGSTNo: item.customerGSTNo,
            placeOfSupplyName: item.placeOfSupplyName,
            sequenceNumber: item.sequenceNumber,
            date: item.date,
            total_amount: item.total_amount,
            balance_amount: item.balance_amount,
            customer_name: item.customer_name,
            sales_return_number: item.sales_return_number,
            payment_type: item.payment_type,
            item_list: item.item_list,
            packingTax: item.packingTax,
            shippingTax: item.shippingTax,
            packing_charge: item.packing_charge,
            shipping_charge: item.shipping_charge,
            exportType: item.exportType,
            exportCountry: item.exportCountry,
            exportCurrency: item.exportCurrency,
            exportConversionRate: item.exportConversionRate,
            exportShippingBillNo: item.exportShippingBillNo,
            exportShippingBillDate: item.exportShippingBillDate,
            exportShippingPortCode: item.exportShippingPortCode,
            insurance: item.insurance,
            invoice_number: item.invoice_number,
            place_of_supply: item.place_of_supply
          }));

          //to prepare JSON data
          this.prepareForExportJsonFile(selectedData);
          resolve(`got data`);
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    });
  };

  prepareForExportJsonFile = async (data) => {
    // Transformed Export format
    const export_data = [];
    const groupedData = {};
    const errorList = [];

    let taxData = await taxSettings.getTaxSettingsDetails();

    let defaultState = getStateList().find((e) => e.name === taxData.state);

    for (const row of data) {
      let stateCode;
      if (row.irnNo === null || row.irnNo === '' || row.irnNo === undefined) {
        if (
          row.exportType === null ||
          row.exportType === '' ||
          row.exportType === undefined
        ) {
          continue;
        }

        const exp_typ = this.getExportType(row.exportType);

        if (!groupedData[exp_typ]) {
          groupedData[exp_typ] = [];
        }

        const stateCodeData = getStateList().find(
          (e) => e.name === row.placeOfSupplyName
        );

        if (stateCodeData && stateCodeData !== null) {
          stateCode = stateCodeData.code;
        }

        const invoice = {
          inum: row.sequenceNumber,
          idt: this.dateFormatter(row.invoice_date),
          val: parseFloat(row.total_amount.toFixed(2)),
          sbpcode: row.exportShippingPortCode
            ? row.exportShippingPortCode
            : '000000',
          sbnum: row.exportShippingBillNo
            ? row.exportShippingBillNo
            : row.sequenceNumber,
          sbdt: row.exportShippingBillDate
            ? this.dateFormatter(row.exportShippingBillDate)
            : this.dateFormatter(row.invoice_date),
          itms: []
        };

        //get all documents having issues
        let totalTxVal = 0;
        let isErrorObj = false;
        let errorMessages = [];
        let itemMessage =
          '<br /> Export Error Summary: ' +
          '<br /><br /><b>Invoice No: </b>' +
          row.sequenceNumber +
          '<br />';

        let product_id = 0;
        const itemDetailsDictionary = {}; // To store item details with the same "rt"

        for (const item of row.item_list) {
          if (item.taxType === 'Nil-Rated' || item.taxType === 'Exempted') {
            continue;
          }

          product_id = product_id + 1;
          let taxableValue = 0;

          let cgstAmt = parseFloat(item.cgst_amount);
          let sgstAmt = parseFloat(item.sgst_amount);
          let igstAmt = parseFloat(item.igst_amount);
          let cess = parseFloat(item.cess);

          taxableValue =
            parseFloat(item.amount) -
            (parseFloat(cgstAmt) +
              parseFloat(sgstAmt) +
              parseFloat(igstAmt) +
              parseFloat(cess));

          let itemDetails = {
            txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
            rt: parseFloat(
              item.sgst && item.cgst
                ? parseFloat((item.sgst + item.cgst).toFixed(2))
                : item.igst > 0
                ? parseFloat(item.igst.toFixed(2))
                : 0
            ), // Tax rate applicable
            iamt: parseFloat(igstAmt.toFixed(2)), // Integrated GST amount
            csamt: parseFloat(cess.toFixed(2)) || 0
          };

          if (itemDetails) {
            // Check if itemDetails with the same "rt" exists in the dictionary
            if (itemDetailsDictionary.hasOwnProperty(itemDetails.rt)) {
              // Combine values for existing "rt"
              const existingItemDetails = itemDetailsDictionary[itemDetails.rt];
              existingItemDetails.txval =
                parseFloat(existingItemDetails.txval) +
                parseFloat(itemDetails.txval);

              existingItemDetails.txval = parseFloat(
                parseFloat(existingItemDetails.txval).toFixed(2)
              );

              if (itemDetails.iamt && itemDetails.iamt > 0) {
                existingItemDetails.iamt =
                  parseFloat(existingItemDetails.iamt) +
                  parseFloat(itemDetails.iamt);

                existingItemDetails.iamt = parseFloat(
                  existingItemDetails.iamt.toFixed(2)
                );
              }

              existingItemDetails.csamt =
                (parseFloat(existingItemDetails.csamt) || 0) +
                (parseFloat(itemDetails.csamt) || 0);
            } else {
              // Add itemDetails to the dictionary
              itemDetailsDictionary[itemDetails.rt] = itemDetails;
            }
          }

          let prodMessage = '';
          let product = item;
          totalTxVal += taxableValue;

          if (
            product.cgst_amount === 0 &&
            product.sgst_amount === 0 &&
            product.igst_amount === 0 &&
            (product.discount_percent === 0 ||
              product.discount_percent == null ||
              product.discount_percent === undefined)
          ) {
            isErrorObj = true;
            errorMessages.push(
              'No Valid GST found for product id:' + product.num
            );
            prodMessage += 'Tax rate is not defined<br />';
          }

          if (
            product.hsn === '' ||
            product.hsn === null ||
            product.hsn === undefined
          ) {
            isErrorObj = true;
            prodMessage += 'HSN is not defined<br />';
          } else if (product.hsn !== '') {
            if (
              product.hsn.length === 4 ||
              product.hsn.length === 6 ||
              product.hsn.length === 8
            ) {
              // do nothing
            } else {
              isErrorObj = true;
              prodMessage += 'HSN code length is not valid<br />';
            }
          }

          if (prodMessage !== '') {
            let slNo = product_id + 1;
            itemMessage +=
              '<br /><b>Sl No: </b>' +
              slNo +
              '<br /><b>Product Name: </b>' +
              product.item_name +
              '<br />';
            itemMessage += prodMessage;
          }
        }

        // Preparing Packing Charge
        // if (row.packingTax) {
        //   let taxableValue = 0;

        //   let cgstAmt = parseFloat(row.packingTax.cgstAmount);
        //   let sgstAmt = parseFloat(row.packingTax.sgstAmount);
        //   let igstAmt = parseFloat(row.packingTax.igstAmount);

        //   taxableValue = parseFloat(row.packing_charge);

        //   let itemDetails;
        //   if (igstAmt > 0) {
        //     itemDetails = {
        //       num: product_id,
        //       itm_det: {
        //         txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
        //         rt: parseFloat(
        //           row.packingTax.sgst && row.packingTax.cgst
        //             ? parseFloat(
        //                 (row.packingTax.sgst + row.packingTax.cgst).toFixed(2)
        //               )
        //             : row.packingTax.igst > 0
        //             ? parseFloat(row.packingTax.igst.toFixed(2))
        //             : 0
        //         ), // Tax rate applicable
        //         iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
        //       }
        //     };
        //   } else {
        //     itemDetails = {
        //       num: product_id,
        //       itm_det: {
        //         txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
        //         rt: parseFloat(
        //           row.packingTax.sgst && row.packingTax.cgst
        //             ? parseFloat(
        //                 (row.packingTax.sgst + row.packingTax.cgst).toFixed(2)
        //               )
        //             : row.packingTax.igst > 0
        //             ? parseFloat(row.packingTax.igst.toFixed(2))
        //             : 0
        //         ), // Tax rate applicable
        //         camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
        //         samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
        //         csamt: 0 // Cess amount
        //       }
        //     };
        //   }

        //   // Check if itemDetails with the same "rt" exists in the dictionary
        //   if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
        //     // Combine values for existing "rt"
        //     const existingItemDetails =
        //       itemDetailsDictionary[itemDetails.itm_det.rt];
        //     existingItemDetails.itm_det.txval =
        //       parseFloat(existingItemDetails.itm_det.txval) +
        //       parseFloat(itemDetails.itm_det.txval);

        //     existingItemDetails.itm_det.txval = parseFloat(
        //       parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
        //     );

        //     if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
        //       existingItemDetails.itm_det.iamt =
        //         parseFloat(existingItemDetails.itm_det.iamt) +
        //         parseFloat(itemDetails.itm_det.iamt);

        //       existingItemDetails.itm_det.iamt = parseFloat(
        //         existingItemDetails.itm_det.iamt.toFixed(2)
        //       );
        //     } else {
        //       existingItemDetails.itm_det.camt =
        //         parseFloat(existingItemDetails.itm_det.camt) +
        //         parseFloat(itemDetails.itm_det.camt);
        //       existingItemDetails.itm_det.samt =
        //         parseFloat(existingItemDetails.itm_det.samt) +
        //         parseFloat(itemDetails.itm_det.samt);

        //       existingItemDetails.itm_det.camt = parseFloat(
        //         existingItemDetails.itm_det.camt.toFixed(2)
        //       );
        //       existingItemDetails.itm_det.samt = parseFloat(
        //         existingItemDetails.itm_det.samt.toFixed(2)
        //       );
        //     }

        //     existingItemDetails.itm_det.csamt =
        //       (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
        //       (parseFloat(itemDetails.itm_det.csamt) || 0);
        //   } else {
        //     // Add itemDetails to the dictionary
        //     itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
        //   }
        // }

        // Preparing Shipping Charge
        // if (row.shippingTax) {
        //   let taxableValue = 0;

        //   let cgstAmt = parseFloat(row.shippingTax.cgstAmount);
        //   let sgstAmt = parseFloat(row.shippingTax.sgstAmount);
        //   let igstAmt = parseFloat(row.shippingTax.igstAmount);

        //   taxableValue = parseFloat(row.shipping_charge);

        //   let itemDetails;
        //   if (igstAmt > 0) {
        //     itemDetails = {
        //       num: product_id,
        //       itm_det: {
        //         txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
        //         rt: parseFloat(
        //           row.shippingTax.sgst && row.shippingTax.cgst
        //             ? parseFloat(
        //                 (row.shippingTax.sgst + row.shippingTax.cgst).toFixed(2)
        //               )
        //             : row.shippingTax.igst > 0
        //             ? parseFloat(row.shippingTax.igst.toFixed(2))
        //             : 0
        //         ), // Tax rate applicable
        //         iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
        //       }
        //     };
        //   } else {
        //     itemDetails = {
        //       num: product_id,
        //       itm_det: {
        //         txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
        //         rt: parseFloat(
        //           row.shippingTax.sgst && row.shippingTax.cgst
        //             ? parseFloat(
        //                 (row.shippingTax.sgst + row.shippingTax.cgst).toFixed(2)
        //               )
        //             : row.shippingTax.igst > 0
        //             ? parseFloat(row.shippingTax.igst.toFixed(2))
        //             : 0
        //         ), // Tax rate applicable
        //         camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
        //         samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
        //         csamt: 0 // Cess amount
        //       }
        //     };
        //   }

        //   // Check if itemDetails with the same "rt" exists in the dictionary
        //   if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
        //     // Combine values for existing "rt"
        //     const existingItemDetails =
        //       itemDetailsDictionary[itemDetails.itm_det.rt];
        //     existingItemDetails.itm_det.txval =
        //       parseFloat(existingItemDetails.itm_det.txval) +
        //       parseFloat(itemDetails.itm_det.txval);

        //     existingItemDetails.itm_det.txval = parseFloat(
        //       parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
        //     );

        //     if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
        //       existingItemDetails.itm_det.iamt =
        //         parseFloat(existingItemDetails.itm_det.iamt) +
        //         parseFloat(itemDetails.itm_det.iamt);

        //       existingItemDetails.itm_det.iamt = parseFloat(
        //         existingItemDetails.itm_det.iamt.toFixed(2)
        //       );
        //     } else {
        //       existingItemDetails.itm_det.camt =
        //         parseFloat(existingItemDetails.itm_det.camt) +
        //         parseFloat(itemDetails.itm_det.camt);
        //       existingItemDetails.itm_det.samt =
        //         parseFloat(existingItemDetails.itm_det.samt) +
        //         parseFloat(itemDetails.itm_det.samt);

        //       existingItemDetails.itm_det.camt = parseFloat(
        //         existingItemDetails.itm_det.camt.toFixed(2)
        //       );
        //       existingItemDetails.itm_det.samt = parseFloat(
        //         existingItemDetails.itm_det.samt.toFixed(2)
        //       );
        //     }

        //     existingItemDetails.itm_det.csamt =
        //       (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
        //       (parseFloat(itemDetails.itm_det.csamt) || 0);
        //   } else {
        //     // Add itemDetails to the dictionary
        //     itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
        //   }
        // }

        // Preparing Insurance
        // if (row.insurance) {
        //   let taxableValue = 0;

        //   let cgstAmt = parseFloat(row.insurance.cgstAmount);
        //   let sgstAmt = parseFloat(row.insurance.sgstAmount);
        //   let igstAmt = parseFloat(row.insurance.igstAmount);

        //   taxableValue = parseFloat(row.insurance.amount);

        //   let itemDetails;
        //   if (igstAmt > 0) {
        //     itemDetails = {
        //       num: product_id,
        //       itm_det: {
        //         txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
        //         rt: parseFloat(
        //           row.insurance.sgst && row.insurance.cgst
        //             ? parseFloat(
        //                 (row.insurance.sgst + row.insurance.cgst).toFixed(2)
        //               )
        //             : row.insurance.igst > 0
        //             ? parseFloat(row.insurance.igst.toFixed(2))
        //             : 0
        //         ), // Tax rate applicable
        //         iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
        //       }
        //     };
        //   } else {
        //     itemDetails = {
        //       num: product_id,
        //       itm_det: {
        //         txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
        //         rt: parseFloat(
        //           row.insurance.sgst && row.insurance.cgst
        //             ? parseFloat(
        //                 (row.insurance.sgst + row.insurance.cgst).toFixed(2)
        //               )
        //             : row.insurance.igst > 0
        //             ? parseFloat(row.insurance.igst.toFixed(2))
        //             : 0
        //         ), // Tax rate applicable
        //         camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
        //         samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
        //         csamt: 0 // Cess amount
        //       }
        //     };
        //   }

        //   // Check if itemDetails with the same "rt" exists in the dictionary
        //   if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
        //     // Combine values for existing "rt"
        //     const existingItemDetails =
        //       itemDetailsDictionary[itemDetails.itm_det.rt];
        //     existingItemDetails.itm_det.txval =
        //       parseFloat(existingItemDetails.itm_det.txval) +
        //       parseFloat(itemDetails.itm_det.txval);

        //     existingItemDetails.itm_det.txval = parseFloat(
        //       parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
        //     );

        //     if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
        //       existingItemDetails.itm_det.iamt =
        //         parseFloat(existingItemDetails.itm_det.iamt) +
        //         parseFloat(itemDetails.itm_det.iamt);

        //       existingItemDetails.itm_det.iamt = parseFloat(
        //         existingItemDetails.itm_det.iamt.toFixed(2)
        //       );
        //     } else {
        //       existingItemDetails.itm_det.camt =
        //         parseFloat(existingItemDetails.itm_det.camt) +
        //         parseFloat(itemDetails.itm_det.camt);
        //       existingItemDetails.itm_det.samt =
        //         parseFloat(existingItemDetails.itm_det.samt) +
        //         parseFloat(itemDetails.itm_det.samt);

        //       existingItemDetails.itm_det.camt = parseFloat(
        //         existingItemDetails.itm_det.camt.toFixed(2)
        //       );
        //       existingItemDetails.itm_det.samt = parseFloat(
        //         existingItemDetails.itm_det.samt.toFixed(2)
        //       );
        //     }

        //     existingItemDetails.itm_det.csamt =
        //       (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
        //       (parseFloat(itemDetails.itm_det.csamt) || 0);
        //   } else {
        //     // Add itemDetails to the dictionary
        //     itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
        //   }
        // }

        if (isErrorObj) {
          const errorObj = Gstr1ErrorObj.createGstr1ErrorObject(
            row.sequenceNumber, // Sequence no
            row.invoice_number, // Invoice number
            row.invoice_date, // Date
            parseFloat(row.total_amount).toFixed(2), // Total
            row.balance_amount, // Balance
            row.customer_name, // Customer name
            row.customerGSTNo, // GST No
            row.payment_type, // Payment type
            row.place_of_supply, // Place Of Supply
            itemMessage, // Error Reason
            parseFloat(totalTxVal).toFixed(2), // Taxable Value
            'Sales'
          );

          runInAction(() => {
            let result =
              this.docErrorsListJSON &&
              this.docErrorsListJSON.find(
                (e) => e.invoiceNumber === row.invoice_number
              );

            if (!result) {
              this.docErrorsListJSON.push(errorObj);
            }
          });
        }

        // Push consolidated itemDetails into invoice.itms
        invoice.itms.push(...Object.values(itemDetailsDictionary));

        if (invoice.itms && invoice.itms.length > 0) {
          groupedData[exp_typ].push(invoice);
        }
      }
    }

    for (const exp_typ in groupedData) {
      if (groupedData[exp_typ].length > 0) {
        const transformedData = {
          exp_typ,
          inv: groupedData[exp_typ]
        };

        export_data.push(transformedData);
      }
    }

    try {
      export_data.forEach((obj) => {
        const inv = obj.inv;

        // Separate into groups of strings and integers
        const groupedStrings = inv.filter((item) =>
          isNaN(item.inum.split('/')[0])
        );
        const integers = inv.filter((item) => !isNaN(item.inum.split('/')[0]));

        // Sort each group
        groupedStrings.sort((a, b) => {
          const getLastElement = (str) => {
            const parts = str.inum.split('/');
            return parts[parts.length - 1];
          };
          return getLastElement(a).localeCompare(getLastElement(b), undefined, {
            numeric: true
          });
        });

        integers.sort((a, b) => parseInt(a.inum) - parseInt(b.inum));

        // Update the 'inv' array within the current object
        obj.inv = integers.concat(groupedStrings);
      });

      // console.log(JSON.stringify(b2b_data, null, 2));
    } catch (error) {
      console.error('An exception occurred:', error);
    }

    runInAction(() => {
      this.expSalesListJSON = export_data;
    });
  };

  getExportASalesDataForGSTR = async (fromDate, toDate) => {
    return new Promise(async (resolve) => {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      await db.sales
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                amendmentDate: {
                  $gte: fromDate
                }
              },
              {
                amendmentDate: {
                  $lte: toDate
                }
              },
              {
                exportType: { $ne: '' }
              },
              {
                exportType: { $ne: null }
              },
              {
                amended: { $eq: true }
              }
            ]
          }
        })
        .exec()
        .then((data) => {
          data = data.filter(
            (item) =>
              (item.isCancelled === undefined ||
                item.isCancelled === null ||
                item.isCancelled === false) &&
              item.einvoiceBillStatus !== 'Cancelled'
          );

          const selectedData = data.map((item) => ({
            invoice_date: item.invoice_date,
            irnNo: item.irnNo,
            customerGSTNo: item.customerGSTNo,
            placeOfSupplyName: item.placeOfSupplyName,
            sequenceNumber: item.sequenceNumber,
            date: item.date,
            total_amount: item.total_amount,
            balance_amount: item.balance_amount,
            customer_name: item.customer_name,
            sales_return_number: item.sales_return_number,
            payment_type: item.payment_type,
            item_list: item.item_list,
            amendmentDate: item.amendmentDate,
            packingTax: item.packingTax,
            shippingTax: item.shippingTax,
            packing_charge: item.packing_charge,
            shipping_charge: item.shipping_charge,
            exportType: item.exportType,
            exportCountry: item.exportCountry,
            exportCurrency: item.exportCurrency,
            exportConversionRate: item.exportConversionRate,
            exportShippingBillNo: item.exportShippingBillNo,
            exportShippingBillDate: item.exportShippingBillDate,
            exportShippingPortCode: item.exportShippingPortCode,
            insurance: item.insurance,
            invoice_number: item.invoice_number,
            place_of_supply: item.place_of_supply
          }));
          //to prepare JSON data
          this.prepareForExportAJsonFile(selectedData);

          resolve(`got data`);
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    });
  };

  prepareForExportAJsonFile = async (data) => {
    // Transformed B2B format
    const export_data = [];
    const groupedData = {};
    const errorList = [];

    for (const row of data) {
      if (row.irnNo === null || row.irnNo === '' || row.irnNo === undefined) {
        if (
          row.exportType === null ||
          row.exportType === '' ||
          row.exportType === undefined
        ) {
          continue;
        }

        const exp_type = this.getExportType(row.exportType);

        if (!groupedData[exp_type]) {
          groupedData[exp_type] = [];
        }

        const invoice = {
          inum: row.sequenceNumber,
          idt: this.dateFormatter(row.invoice_date),
          val: parseFloat(row.total_amount.toFixed(2)),
          sbpcode: row.exportShippingPortCode
            ? row.exportShippingPortCode
            : '000000',
          sbnum: row.exportShippingBillNo
            ? row.exportShippingBillNo
            : row.sequenceNumber,
          sbdt: row.exportShippingBillDate
            ? this.dateFormatter(row.exportShippingBillDate)
            : this.dateFormatter(row.invoice_date),
          itms: []
        };

        //get all documents having issues
        let totalTxVal = 0;
        let isErrorObj = false;
        let errorMessages = [];
        let itemMessage =
          '<br /> EXPA Error Summary: ' +
          '<br /><br /><b>Invoice No: </b>' +
          row.sequenceNumber +
          '<br />';

        let product_id = 0;
        const itemDetailsDictionary = {}; // To store item details with the same "rt"

        for (const item of row.item_list) {
          if (item.taxType === 'Nil-Rated' || item.taxType === 'Exempted') {
            continue;
          }

          product_id = product_id + 1;
          let taxableValue = 0;

          let cgstAmt = parseFloat(item.cgst_amount);
          let sgstAmt = parseFloat(item.sgst_amount);
          let igstAmt = parseFloat(item.igst_amount);
          let cess = parseFloat(item.cess);

          taxableValue =
            parseFloat(item.amount) -
            (parseFloat(cgstAmt) +
              parseFloat(sgstAmt) +
              parseFloat(igstAmt) +
              parseFloat(cess));

          let itemDetails;
          if (item.igst_amount > 0) {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  item.sgst && item.cgst
                    ? parseFloat((item.sgst + item.cgst).toFixed(2))
                    : item.igst > 0
                    ? parseFloat(item.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
              }
            };
          } else {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  item.sgst && item.cgst
                    ? parseFloat((item.sgst + item.cgst).toFixed(2))
                    : item.igst > 0
                    ? parseFloat(item.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
                samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
                csamt: parseFloat(cess.toFixed(2)) || 0 // Cess amount
              }
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];
            existingItemDetails.itm_det.txval =
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval);

            existingItemDetails.itm_det.txval = parseFloat(
              parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.itm_det.camt =
                parseFloat(existingItemDetails.itm_det.camt) +
                parseFloat(itemDetails.itm_det.camt);
              existingItemDetails.itm_det.samt =
                parseFloat(existingItemDetails.itm_det.samt) +
                parseFloat(itemDetails.itm_det.samt);

              existingItemDetails.itm_det.camt = parseFloat(
                existingItemDetails.itm_det.camt.toFixed(2)
              );
              existingItemDetails.itm_det.samt = parseFloat(
                existingItemDetails.itm_det.samt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
              (parseFloat(itemDetails.itm_det.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }

          let prodMessage = '';
          let product = item;
          totalTxVal += taxableValue;

          if (
            product.cgst_amount === 0 &&
            product.sgst_amount === 0 &&
            product.igst_amount === 0 &&
            (product.discount_percent === 0 ||
              product.discount_percent == null ||
              product.discount_percent === undefined)
          ) {
            isErrorObj = true;
            errorMessages.push(
              'No Valid GST found for product id:' + product.num
            );
            prodMessage += 'Tax rate is not defined<br />';
          }

          if (
            product.hsn === '' ||
            product.hsn === null ||
            product.hsn === undefined
          ) {
            isErrorObj = true;
            prodMessage += 'HSN is not defined<br />';
          } else if (product.hsn !== '') {
            if (
              product.hsn.length === 4 ||
              product.hsn.length === 6 ||
              product.hsn.length === 8
            ) {
              // do nothing
            } else {
              isErrorObj = true;
              prodMessage += 'HSN code length is not valid<br />';
            }
          }

          if (prodMessage !== '') {
            let slNo = product_id + 1;
            itemMessage +=
              '<br /><b>Sl No: </b>' +
              slNo +
              '<br /><b>Product Name: </b>' +
              product.item_name +
              '<br />';
            itemMessage += prodMessage;
          }
        }

        // Preparing Packing Charge
        if (row.packingTax) {
          let taxableValue = 0;

          let cgstAmt = parseFloat(row.packingTax.cgstAmount);
          let sgstAmt = parseFloat(row.packingTax.sgstAmount);
          let igstAmt = parseFloat(row.packingTax.igstAmount);

          taxableValue = parseFloat(row.packing_charge);

          let itemDetails;
          if (igstAmt > 0) {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.packingTax.sgst && row.packingTax.cgst
                    ? parseFloat(
                        (row.packingTax.sgst + row.packingTax.cgst).toFixed(2)
                      )
                    : row.packingTax.igst > 0
                    ? parseFloat(row.packingTax.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
              }
            };
          } else {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.packingTax.sgst && row.packingTax.cgst
                    ? parseFloat(
                        (row.packingTax.sgst + row.packingTax.cgst).toFixed(2)
                      )
                    : row.packingTax.igst > 0
                    ? parseFloat(row.packingTax.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
                samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
                csamt: 0 // Cess amount
              }
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];
            existingItemDetails.itm_det.txval =
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval);

            existingItemDetails.itm_det.txval = parseFloat(
              parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.itm_det.camt =
                parseFloat(existingItemDetails.itm_det.camt) +
                parseFloat(itemDetails.itm_det.camt);
              existingItemDetails.itm_det.samt =
                parseFloat(existingItemDetails.itm_det.samt) +
                parseFloat(itemDetails.itm_det.samt);

              existingItemDetails.itm_det.camt = parseFloat(
                existingItemDetails.itm_det.camt.toFixed(2)
              );
              existingItemDetails.itm_det.samt = parseFloat(
                existingItemDetails.itm_det.samt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
              (parseFloat(itemDetails.itm_det.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }
        }

        // Preparing Shipping Charge
        if (row.shippingTax) {
          let taxableValue = 0;

          let cgstAmt = parseFloat(row.shippingTax.cgstAmount);
          let sgstAmt = parseFloat(row.shippingTax.sgstAmount);
          let igstAmt = parseFloat(row.shippingTax.igstAmount);

          taxableValue = parseFloat(row.shipping_charge);

          let itemDetails;
          if (igstAmt > 0) {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.shippingTax.sgst && row.shippingTax.cgst
                    ? parseFloat(
                        (row.shippingTax.sgst + row.shippingTax.cgst).toFixed(2)
                      )
                    : row.shippingTax.igst > 0
                    ? parseFloat(row.shippingTax.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
              }
            };
          } else {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.shippingTax.sgst && row.shippingTax.cgst
                    ? parseFloat(
                        (row.shippingTax.sgst + row.shippingTax.cgst).toFixed(2)
                      )
                    : row.shippingTax.igst > 0
                    ? parseFloat(row.shippingTax.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
                samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
                csamt: 0 // Cess amount
              }
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];
            existingItemDetails.itm_det.txval =
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval);

            existingItemDetails.itm_det.txval = parseFloat(
              parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.itm_det.camt =
                parseFloat(existingItemDetails.itm_det.camt) +
                parseFloat(itemDetails.itm_det.camt);
              existingItemDetails.itm_det.samt =
                parseFloat(existingItemDetails.itm_det.samt) +
                parseFloat(itemDetails.itm_det.samt);

              existingItemDetails.itm_det.camt = parseFloat(
                existingItemDetails.itm_det.camt.toFixed(2)
              );
              existingItemDetails.itm_det.samt = parseFloat(
                existingItemDetails.itm_det.samt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
              (parseFloat(itemDetails.itm_det.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }
        }

        // Preparing Insurance
        if (row.insurance) {
          let taxableValue = 0;

          let cgstAmt = parseFloat(row.insurance.cgstAmount);
          let sgstAmt = parseFloat(row.insurance.sgstAmount);
          let igstAmt = parseFloat(row.insurance.igstAmount);

          taxableValue = parseFloat(row.insurance.amount);

          let itemDetails;
          if (igstAmt > 0) {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.insurance.sgst && row.insurance.cgst
                    ? parseFloat(
                        (row.insurance.sgst + row.insurance.cgst).toFixed(2)
                      )
                    : row.insurance.igst > 0
                    ? parseFloat(row.insurance.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                iamt: parseFloat(igstAmt.toFixed(2)) // Integrated GST amount
              }
            };
          } else {
            itemDetails = {
              num: product_id,
              itm_det: {
                txval: parseFloat(parseFloat(taxableValue).toFixed(2)), // Taxable value of the item
                rt: parseFloat(
                  row.insurance.sgst && row.insurance.cgst
                    ? parseFloat(
                        (row.insurance.sgst + row.insurance.cgst).toFixed(2)
                      )
                    : row.insurance.igst > 0
                    ? parseFloat(row.insurance.igst.toFixed(2))
                    : 0
                ), // Tax rate applicable
                camt: parseFloat(cgstAmt.toFixed(2)) || 0, // Central GST amount
                samt: parseFloat(sgstAmt.toFixed(2)) || 0, // State GST amount
                csamt: 0 // Cess amount
              }
            };
          }

          // Check if itemDetails with the same "rt" exists in the dictionary
          if (itemDetailsDictionary.hasOwnProperty(itemDetails.itm_det.rt)) {
            // Combine values for existing "rt"
            const existingItemDetails =
              itemDetailsDictionary[itemDetails.itm_det.rt];
            existingItemDetails.itm_det.txval =
              parseFloat(existingItemDetails.itm_det.txval) +
              parseFloat(itemDetails.itm_det.txval);

            existingItemDetails.itm_det.txval = parseFloat(
              parseFloat(existingItemDetails.itm_det.txval).toFixed(2)
            );

            if (itemDetails.itm_det.iamt && itemDetails.itm_det.iamt > 0) {
              existingItemDetails.itm_det.iamt =
                parseFloat(existingItemDetails.itm_det.iamt) +
                parseFloat(itemDetails.itm_det.iamt);

              existingItemDetails.itm_det.iamt = parseFloat(
                existingItemDetails.itm_det.iamt.toFixed(2)
              );
            } else {
              existingItemDetails.itm_det.camt =
                parseFloat(existingItemDetails.itm_det.camt) +
                parseFloat(itemDetails.itm_det.camt);
              existingItemDetails.itm_det.samt =
                parseFloat(existingItemDetails.itm_det.samt) +
                parseFloat(itemDetails.itm_det.samt);

              existingItemDetails.itm_det.camt = parseFloat(
                existingItemDetails.itm_det.camt.toFixed(2)
              );
              existingItemDetails.itm_det.samt = parseFloat(
                existingItemDetails.itm_det.samt.toFixed(2)
              );
            }

            existingItemDetails.itm_det.csamt =
              (parseFloat(existingItemDetails.itm_det.csamt) || 0) +
              (parseFloat(itemDetails.itm_det.csamt) || 0);
          } else {
            // Add itemDetails to the dictionary
            itemDetailsDictionary[itemDetails.itm_det.rt] = itemDetails;
          }
        }

        if (isErrorObj) {
          const errorObj = Gstr1ErrorObj.createGstr1ErrorObject(
            row.sequenceNumber, // Sequence no
            row.invoice_number, // Invoice number
            row.invoice_date, // Date
            parseFloat(row.total_amount).toFixed(2), // Total
            row.balance_amount, // Balance
            row.customer_name, // Customer name
            row.customerGSTNo, // GST No
            row.payment_type, // Payment type
            row.place_of_supply, // Place Of Supply
            itemMessage, // Error Reason
            parseFloat(totalTxVal).toFixed(2), // Taxable Value
            'Sales'
          );

          runInAction(() => {
            let result =
              this.docErrorsListJSON &&
              this.docErrorsListJSON.find(
                (e) => e.invoiceNumber === row.invoice_number
              );

            if (!result) {
              this.docErrorsListJSON.push(errorObj);
            }
          });
        }

        // Push consolidated itemDetails into invoice.itms
        invoice.itms.push(...Object.values(itemDetailsDictionary));

        if (invoice.itms && invoice.itms.length > 0) {
          groupedData[exp_type].push(invoice);
        }
      }
    }

    for (const exp_type in groupedData) {
      if (groupedData[exp_type].length > 0) {
        const transformedData = {
          exp_type,
          inv: groupedData[exp_type]
        };

        export_data.push(transformedData);
      }
    }

    try {
      // console.log(JSON.stringify(b2b_data, null, 2));

      export_data.forEach((obj) => {
        const inv = obj.inv;

        // Separate into groups of strings and integers
        const groupedStrings = inv.filter((item) =>
          isNaN(item.inum.split('/')[0])
        );
        const integers = inv.filter((item) => !isNaN(item.inum.split('/')[0]));

        // Sort each group
        groupedStrings.sort((a, b) => {
          const getLastElement = (str) => {
            const parts = str.inum.split('/');
            return parts[parts.length - 1];
          };
          return getLastElement(a).localeCompare(getLastElement(b), undefined, {
            numeric: true
          });
        });

        integers.sort((a, b) => parseInt(a.inum) - parseInt(b.inum));

        // Update the 'inv' array within the current object
        obj.inv = integers.concat(groupedStrings);
      });

      // console.log(JSON.stringify(b2b_data, null, 2));
    } catch (error) {
      console.error('An exception occurred:', error);
    }

    runInAction(() => {
      this.expASalesListJSON = export_data;
    });
  };

  constructor() {
    makeObservable(this, {
      salesData: observable,
      salesReturnData: observable,
      prefixData: observable,
      hsnSalesList: observable,
      b2bSalesListJSON: observable,
      docErrorsListJSON: observable,
      cdnurListJSON: observable,
      cdnrListJSON: observable,
      hsnWiseSalesData: observable,
      docIssueSales: observable,
      docIssueSalesReturn: observable,
      GSTRDateRange: observable,
      step: observable,
      reviewStep: observable,
      GSTR1Data: observable,
      onlineGSTRDialogOpen: observable,
      prepareOnlineData: observable,
      proceedToOnlineFiling: observable,
      b2csSalesList: observable,
      gstAuth: observable,
      b2csaSalesListJSON: observable,
      b2baSalesListJSON: observable,
      b2claSalesListJSON: observable,
      financialYear: observable,
      financialMonth: observable,
      GSTRPeriod: observable,
      gstr1UploadData: observable,
      retSaveSummary: observable,
      retSaveReviewStep: observable,
      isSummaryGenerated: observable,
      isFiled: observable,
      isSaved: observable,
      cdnraListJSON: observable,
      cdnuraSalesReturnListJSON: observable,
      errorMessage: observable,
      openErrorMesssageDialog: observable,
      cdnraSalesReturnList: observable,
      loginStep: observable,
      nilSalesListData: observable,
      nilSalesReturnListData: observable,
      expSalesListJSON: observable,
      taxData: observable,
      expASalesListJSON: observable,
      b2bEInvoiceSalesListJSON: observable
    });
  }
}

export default new GSTR1Store();