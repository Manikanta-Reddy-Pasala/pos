import axios from 'axios';

const API_SERVER = window.SWIGGY_API_SERVER;

export const isLoggedIn = async () => {
  let status = true;

  try {
    await axios.post(API_SERVER + '/api/v1/zomato/login').then((response) => {
      if (response.status === 200) {
        status = true;
      }
    });
  } catch (error) {
    status = false;
  }

  return status;
};

export const getOrders = async () => {
  let response = null;

  try {
    await axios
      .get(API_SERVER + '/api/v1/zomato/orders/current')
      .then((res) => {
        response = res.data;
      });
  } catch (error) {
    console.log(error);
  }

  return response;
};

export const getOrderDetails = async (order_id) => {
  let response = null;

  try {
    await axios
      .get(API_SERVER + '/api/v1/zomato/order/details', {
        order_id
      })
      .then((res) => {
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
    await axios.get(API_SERVER + '/api/v1/zomato/items').then((res) => {
      response = res.data;
    });
  } catch (error) {
    console.log(error);
  }

  return response;
};

export const acceptOrder = async (order_id, delivery_time) => {
  let status = true;

  try {
    await axios
      .post(API_SERVER + '/api/v1/zomato/orders/accept_order', {
        order_id,
        delivery_time
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

export const orderMarkReady = async (order_id) => {
  let status = true;

  try {
    await axios
      .post(API_SERVER + '/api/v1/zomato/orders/mark_ready', {
        order_id
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
      .post(API_SERVER + '/api/v1/zomato/items/in_stock', {
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
      .post(API_SERVER + '/api/v1/zomato/items/out_of_stock', {
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
