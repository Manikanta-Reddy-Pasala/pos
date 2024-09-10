import * as Bd from '../../SelectedBusiness';
import axios from 'axios';

const API_SERVER = window.REACT_APP_API_SERVER;

export const getAuditData = async (id, auditType) => {
  const businessData = await Bd.getBusinessData();

  const businessId = businessData.businessId;
  const businessCity = businessData.businessCity;

  let auditData = [];

  const response = await axios.get(`${API_SERVER}/pos/v1/audit/getDetails`, {
    params: {
      businessId: businessId,
      businessCity: businessCity,
      id: id,
      auditType: auditType && auditType === 'Kot' ? 'Kot-Audit' : auditType
    }
  });

  if (response && response.data) {
    for (let res of response.data) {
      let parsedData = JSON.parse(res.data);
      if (auditType && auditType === 'Kot') {
        auditData.push(prepareKotAuditObject(parsedData));
      } else {
        auditData.push(prepareAuditObject(parsedData));
      }
    }
  }

  return response ? auditData : [];
};

const prepareAuditObject = (parsedData) => {
  let itemList = [];
  for (let item of parsedData.item_list) {
    itemList.push({
      product_id: item.product_id,
      description: item.description,
      unit: item.unit,
      hsn: item.hsn,
      item_name: item.item_name,
      mrp: item.mrp,
      purchased_price: item.purchased_price,
      offer_price: item.offer_price,
      mrp_before_tax: item.mrp_before_tax,
      qty: item.qty,
      cgst: item.cgst,
      sgst: item.sgst,
      igst: item.igst,
      cess: item.cess,
      cgst_amount: item.cgst_amount,
      sgst_amount: item.sgst_amount,
      igst_amount: item.igst_amount,
      discount_percent: item.discount_percent,
      discount_amount: item.discount_amount,
      discount_amount_per_item: item.discount_amount_per_item,
      amount: item.amount,
      taxIncluded: item.taxIncluded,
      roundOff: item.roundOff,
      returnedQty: item.returnedQty,
      brandName: item.brandName,
      categoryLevel3DisplayName: item.categoryLevel3DisplayName,
      vendorName: item.vendorName,
      netWeight: item.netWeight,
      purity: item.purity,
      serialOrImeiNo: item.serialOrImeiNo,
      freeQty: item.freeQty,
      returnedFreeQty: item.returnedFreeQty,
      qtyUnit: item.qtyUnit,
      modelNo: item.modelNo,
      pricePerGram: item.pricePerGram,
      warrantyDays: item.warrantyDays,
      warrantyEndDate: item.warrantyEndDate
    });
  }

  return {
    customerGSTNo: parsedData.customerGSTNo,
    customerGstType: parsedData.customerGstType,
    customer_name: parsedData.customer_name,
    customer_address: parsedData.customer_address,
    customer_phoneNo: parsedData.customer_phoneNo,
    customer_city: parsedData.customer_city,
    customer_emailId: parsedData.customer_emailId,
    customer_pincode: parsedData.customer_pincode,
    sequenceNumber: parsedData.sequenceNumber,
    invoice_date: parsedData.invoice_date, // current date in YYYY-MM-DD format
    order_type: parsedData.order_type,
    round_amount: parsedData.round_amount,
    total_amount: parsedData.total_amount,
    balance_amount: parsedData.balance_amount,
    is_credit: parsedData.is_credit,
    payment_type: parsedData.payment_type,
    isFullyReturned: parsedData.isFullyReturned,
    isPartiallyReturned: parsedData.isPartiallyReturned,
    linkPayment: parsedData.linkPayment,
    linked_amount: parsedData.linked_amount,
    linkedTxnList: parsedData.linkedTxnList,
    discount_percent: parsedData.discount_percent,
    discount_amount: parsedData.discount_amount,
    discount_type: parsedData.discount_type,
    item_list: itemList,
    packing_charge: parsedData.packing_charge,
    shipping_charge: parsedData.shipping_charge,
    place_of_supply: parsedData.place_of_supply,
    placeOfSupplyName: parsedData.placeOfSupplyName,
    ewayBillNo: parsedData.ewayBillNo,
    waiter_name: parsedData.waiter_name,
    tableNumber: parsedData.tableNumber,
    onlineOrderStatus: parsedData.onlineOrderStatus,
    sub_total: parsedData.sub_total,
    reverseCharge: parsedData.reverseCharge,
    bankAccount: parsedData.bankAccount,
    bankAccountId: parsedData.bankAccountId,
    bankPaymentType: parsedData.bankPaymentType,
    paymentReferenceNumber: parsedData.paymentReferenceNumber,
    poDate: parsedData.poDate,
    poInvoiceNo: parsedData.poInvoiceNo,
    vehicleNo: parsedData.vehicleNo,
    transportMode: parsedData.transportMode,
    shipToCustomerName: parsedData.shipToCustomerName,
    shipToCustomerGSTNo: parsedData.shipToCustomerGSTNo,
    shipToCustomerGstType: parsedData.shipToCustomerGstType,
    customerState: parsedData.customerState,
    customerCountry: parsedData.customerCountry,
    shipToCustomerState: parsedData.shipToCustomerState,
    shipToCustomerCountry: parsedData.shipToCustomerCountry,
    notes: parsedData.notes,
    prefix: parsedData.prefix,
    subPrefix: parsedData.subPrefix,
    ewayBillStatus: parsedData.ewayBillStatus,
    ewayBillDetails: parsedData.ewayBillDetails,
    einvoiceBillStatus: parsedData.einvoiceBillStatus,
    einvoiceDetails: parsedData.einvoiceDetails,
    vehicleType: parsedData.vehicleType,
    transporterName: parsedData.transporterName,
    transporterId: parsedData.transporterId,
    ewayBillGeneratedDate: parsedData.ewayBillGeneratedDate,
    einvoiceBillGeneratedDate: parsedData.einvoiceBillGeneratedDate,
    ewayBillValidDate: parsedData.ewayBillValidDate,
    irnNo: parsedData.irnNo,
    tcsAmount: parsedData.tcsAmount,
    tcsName: parsedData.tcsName,
    tcsRate: parsedData.tcsRate,
    tcsCode: parsedData.tcsCode,
    dueDate: parsedData.dueDate,
    tdsAmount: parsedData.tdsAmount,
    tdsName: parsedData.tdsName,
    tdsRate: parsedData.tdsRate,
    tdsCode: parsedData.tdsCode,
    isCancelled: parsedData.isCancelled,
    eWayErrorMessage: parsedData.eWayErrorMessage,
    eInvoiceErrorMessage: parsedData.eInvoiceErrorMessage,
    salesEmployeeName: parsedData.salesEmployeeName,
    amendmentDate: parsedData.amendmentDate,
    amended: parsedData.amended,
    amendmentReason: parsedData.amendmentReason,
    exportType: parsedData.exportType,
    exportCountry: parsedData.exportCountry,
    exportCurrency: parsedData.exportCurrency,
    exportConversionRate: parsedData.exportConversionRate,
    exportShippingBillNo: parsedData.exportShippingBillNo,
    exportShippingBillDate: parsedData.exportShippingBillDate,
    exportShippingPortCode: parsedData.exportShippingPortCode,
    discountPercentForAllItems: parsedData.discountPercentForAllItems,
    insurance: parsedData.insurance,
    oldSequenceNumber: parsedData.oldSequenceNumber,
    placeOfReceiptByPreCarrier: parsedData.placeOfReceiptByPreCarrier,
    vesselFlightNo: parsedData.vesselFlightNo,
    portOfLoading: parsedData.portOfLoading,
    portOfDischarge: parsedData.portOfDischarge,
    otherReference: parsedData.otherReference,
    billOfLadingNo: parsedData.billOfLadingNo,
    buyerOtherBillTo: {
      id: parsedData.buyerOtherBillTo ? parsedData.buyerOtherBillTo.id : '',
      phoneNo: parsedData.buyerOtherBillTo
        ? parsedData.buyerOtherBillTo.phoneNo
        : '',
      name: parsedData.buyerOtherBillTo ? parsedData.buyerOtherBillTo.name : ''
    },
    totalOtherCurrency: parsedData.totalOtherCurrency,
    exportCountryOrigin: parsedData.exportCountryOrigin,
    shippingChargeOtherCurrency: parsedData.shippingChargeOtherCurrency,
    packingChargeOtherCurrency: parsedData.packingChargeOtherCurrency
  };
};

const prepareKotAuditObject = (parsedData) => {
  let itemList = [];
  let orderData = [];
  for (let order of parsedData.ordersData) {
    for (let item of order.items) {
      itemList.push({
        id: item.id,
        product_id: item.product_id,
        item_name: item.item_name,
        sku: item.sku,
        barcode: item.barcode,
        mrp: item.mrp,
        mrp_before_tax: item.mrp_before_tax,
        purchased_price: item.purchased_price,
        offer_price: item.offer_price,
        qty: item.qty,
        cgst: item.cgst,
        sgst: item.sgst,
        igst: item.igst,
        cess: item.cess,
        igst_amount: item.igst_amount,
        cgst_amount: item.cgst_amount,
        sgst_amount: item.igst_amount,
        amount: item.amount,
        roundOff: item.roundOff,
        brandName: item.brandName,
        categoryLevel3DisplayName: item.categoryLevel3DisplayName,
        served: item.served,
        discount_percent: item.discount_percent,
        discount_amount: item.discount_amount,
        discount_amount_per_item: item.discount_amount_per_item,
        discount_type: item.discount_type,
        taxIncluded: item.taxIncluded,
        hsn: item.hsn
      });
    }
  }

  for (let order of parsedData.ordersData) {
    orderData.push({
      invoice_number: order.invoice_number,
      sequenceNumber: order.sequenceNumber,
      waiter_phoneNo: order.waiter_phoneNo,
      customer_name: order.customer_name,
      invoice_date: order.invoice_date,
      total_amount: order.total_amount,
      items: itemList,
      customerGSTNo: order.customerGSTNo,
      customer_address: order.customer_address,
      customer_city: order.customer_city,
      customer_emailId: order.customer_emailId,
      customer_pincode: order.customer_pincode,
      is_roundoff: order.is_roundoff,
      round_amount: order.round_amount,
      payment_type: order.payment_type,
      balance_amount: order.balance_amount,
      discount_percent: order.discount_percent,
      discount_amount: order.discount_amount,
      discount_type: order.discount_type,
      packing_charge: order.packing_charge,
      shipping_charge: order.shipping_charge,
      categoryId: order.categoryId,
      categoryName: order.categoryName,
      tableNumber: order.tableNumber,
      prefix: order.prefix,
      subPrefix: order.subPrefix,
      bankAccount: order.bankAccount,
      bankAccountId: order.bankAccountId,
      bankPaymentType: order.bankPaymentType,
      paymentReferenceNumber: order.paymentReferenceNumber,
      customerGSTType: order.customerGSTType,
      customerState: order.customerState,
      customerCountry: order.customerCountry,
      menuType: order.menuType,
      subTotal: order.subTotal
    });
  }

  return {
    categoryName: parsedData.categoryName,
    tableId: parsedData.tableId,
    tableNumber: parsedData.tableNumber,
    ordersData: orderData,
    id: parsedData.id
  };
};