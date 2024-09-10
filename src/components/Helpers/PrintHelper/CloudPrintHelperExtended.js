const { get, post } = require('axios');

const submitPlayerIdToServer = async (token) => {
  let businessCity = localStorage.getItem('businessCity')
    ? localStorage.getItem('businessCity')
    : '';
  let businessId = localStorage.getItem('businessId')
    ? localStorage.getItem('businessId')
    : '';

  const res = await get('https://geolocation-db.com/json/');
  let deviceId = res.data.IPv4;
  let playerId = token;

  console.log('print token from server api call: ', playerId);

  const API_SERVER = await window.REACT_APP_API_SERVER;

  console.log('print API_SERVER: ', API_SERVER);

  await post(`${API_SERVER}/pos/v1/printer/updatePlayerId`, {
    businessCity,
    businessId,
    deviceId,
    playerId
  })
    .then((response) => {
      // do nothing
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

module.exports = {
  submitPlayerIdToServer
};
