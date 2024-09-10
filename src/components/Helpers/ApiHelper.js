import axios from 'axios';

export const postApiEwayEinvoiceRequest = async (url, requestBody, params) => {
  const API_SERVER = window.REACT_APP_API_SERVER;
  let responseData = { success: false, errorMessage: '', ewayBillNo: '' };

  await axios
    .post(`${API_SERVER}${url}`, requestBody, {
      // headers: {
      //   Authorization: `Bearer ${response.data.token}`,
      //   user_type: 'partner',
      //   'content-type': 'application/json'
      // }
    })
    .then((response) => {
      if (response.data) {
        responseData.success = response.data.success;
        responseData.errorMessage = response.data.errorMessage;
        responseData.einvoiceBillGeneratedDate =
          response.data.einvoiceBillGeneratedDate;
        responseData.einvoiceBillStatus = response.data.einvoiceBillStatus;
        responseData.einvoiceDetails = response.data.einvoiceDetails;
        responseData.irn = response.data.irn;

        responseData.ewayBillNo = response.data.ewayBillNo;
        responseData.ewayBillStatus = response.data.ewayBillStatus;
        responseData.ewayBillValidDate = response.data.ewayBillValidDate;
        responseData.ewayBillGeneratedDate =
          response.data.ewayBillGeneratedDate;
        responseData.ewayBillDetails = response.data.ewayBillDetails;
      }
    })
    .catch((err) => {
      console.error('There was an error!', err.message);
      responseData.errorMessage = err.message;
    });

  return responseData;
};

export const getApiRequest = async (url, params) => {
  const API_SERVER = window.REACT_APP_API_SERVER;

  let responseData  = { success: true, errorMessage: '' }

  await axios
    .get(`${API_SERVER}/${url}`, params, {
      // headers: {
      //   Authorization: `Bearer ${response.data.token}`,
      //   user_type: 'partner',
      //   'content-type': 'application/json'
      // }
    })
    .then(async (response) => {
      responseData = response;
    })
    .catch((err) => {
      console.log(err);
      responseData.errorMessage = err.message;
    });

  return responseData;
};

export const postApiRequest = async (url, requestBody) => {
  const API_SERVER = window.REACT_APP_API_SERVER;
  let responseData = { success: true, errorMessage: '' };

  await axios
    .post(`${API_SERVER}${url}`, requestBody, {
      // headers: {
      //   Authorization: `Bearer ${response.data.token}`,
      //   user_type: 'partner',
      //   'content-type': 'application/json'
      // }
    })
    .then((response) => {
      console.log('successfully completed:', response);

      responseData = response;
    })
    .catch((err) => {
      if (err.response && err.response.data) {
        responseData.errorMessage = err.response.data.message;
      } else {
        responseData.errorMessage = err.message;
      }

    });

  return responseData;
};
