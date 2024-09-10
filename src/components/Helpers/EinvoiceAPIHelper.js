import * as apiHelper from './ApiHelper';

export const createEinvoice = async (data) => {
  const eInvoiceData = await getEinvoiceObject(data);

  const apiResponse = await apiHelper.postApiEwayEinvoiceRequest(
    '/pos/v1/business/invoice/einvoice/create',
    eInvoiceData,
    null
  );

  return apiResponse;
};

export const createEinvoicewithEway = async (data) => {
  const eInvoiceData = await getEinvoiceObject(data);

  const apiResponse = await apiHelper.postApiEwayEinvoiceRequest(
    '/pos/v1/business/invoice/einvoice/eway/create',
    eInvoiceData,
    null
  );

  return apiResponse;
};

export const cancelEinvoice = async (data) => {
  const eInvoiceData = await getEinvoiceObject(data);

  const apiResponse = await apiHelper.postApiEwayEinvoiceRequest(
    '/pos/v1/business/invoice/einvoice/cancel',
    eInvoiceData,
    null
  );

  return apiResponse;
};

export const cancelEway = async (data) => {
  const eInvoiceData = await getEinvoiceObject(data);

  const apiResponse = await apiHelper.postApiEwayEinvoiceRequest(
    '/pos/v1/business/invoice/einvoice/eway/cancel',
    eInvoiceData,
    null
  );

  return apiResponse;
};

const getEinvoiceObject = async (data) => {
  let eInvoiceData = {
    businessCity: data.businessCity,
    businessId: data.businessId,
    invoiceId: data.invoice_number,
    invoiceType: 'INV'
  };

  return eInvoiceData;
};
