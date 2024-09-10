import axios from 'axios';

const API_SERVER = window.SWIGGY_API_SERVER;

export const isLoggedIntoSwiggy = async () => {
  let status = true;

  try {
    await axios.post(API_SERVER + '/api/v1/swiggy/login').then((response) => {
      if (response.status === 200) {
        status = true;
      }
    });
  } catch (error) {
    status = false;
  }

  return status;
};

export const getSwiggyOrders = async () => {
  let response = null;

  try {
    await axios.get(API_SERVER + '/api/v1/swiggy/orders').then((res) => {
      response = res.data;
    });
  } catch (error) {
    console.log(error);
  }

  return response;
};

export const getItems = async () => {
  let response = null;

  try {
    await axios.get(API_SERVER + '/api/v1/swiggy/items').then((res) => {
      response = res.data;
    });
  } catch (error) {
    console.log(error);
  }

  return response;
};

export const acceptOrder = async (order_id, prep_time) => {
  let status = true;

  try {
    await axios
      .post(API_SERVER + '/api/v1/swiggy/orders/accept', {
        order_id,
        prep_time
      })
      .then((response) => {
        if (response.status === 200) {
          status = true;
        }
      });
  } catch (error) {
    status = false;
  }

  return status;
};

export const orderReady = async (order_id, prep_time) => {
  let status = true;

  try {
    await axios
      .post(API_SERVER + '/api/v1/swiggy/orders/ready', {
        order_id,
        prep_time
      })
      .then((response) => {
        if (response.status === 200) {
          status = true;
        }
      });
  } catch (error) {
    status = false;
  }

  return status;
};

export const itemsInstock = async (item_id) => {
  let status = true;

  try {
    await axios
      .post(API_SERVER + '/api/v1/swiggy/items/instock', {
        item_id
      })
      .then((response) => {
        if (response.status === 200) {
          status = true;
        }
      });
  } catch (error) {
    status = false;
  }

  return status;
};

export const itemsOutOfstock = async (item_id) => {
  let status = true;

  try {
    await axios
      .post(API_SERVER + '/api/v1/swiggy/items/outofstock', {
        item_id
      })
      .then((response) => {
        if (response.status === 200) {
          status = true;
        }
      });
  } catch (error) {
    status = false;
  }

  return status;
};
