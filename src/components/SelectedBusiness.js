import * as Db from '../RxDb/Database/Database';

export const getBusinessData = async () => {
  let businessId = '';
  let businessCity = '';
  let posDeviceId = '';
  let posFeatures = [];
  let level1Categories = [];
  let onlinePOSPermission = false;
  let createBillPermission = false;

  if (
    (localStorage.getItem('businessId') === null ||
      localStorage.getItem('businessId') === undefined ||
      localStorage.getItem('businessId') === 'undefined' ||
      localStorage.getItem('businessId') !== '') &&
    (localStorage.getItem('businessCity') === null ||
      localStorage.getItem('businessCity') === undefined ||
      localStorage.getItem('businessCity') === 'undefined' ||
      localStorage.getItem('businessCity') !== '') &&
    (localStorage.getItem('posId') == null ||
      localStorage.getItem('posId') === undefined ||
      localStorage.getItem('posId') === 'undefined' ||
      localStorage.getItem('posId') !== '') &&
    (localStorage.getItem('posFeatures') == null ||
      localStorage.getItem('posFeatures') === undefined ||
      localStorage.getItem('posFeatures') === 'undefined' ||
      localStorage.getItem('posFeatures') !== '') &&
    (localStorage.getItem('level1Categories') == null ||
      localStorage.getItem('level1Categories') === undefined ||
      localStorage.getItem('level1Categories') === 'undefined' ||
      localStorage.getItem('level1Categories') !== '')
  ) {
    /**
     * select from db
     */
    const db = await Db.get();
    await db.businesslist
      .findOne({
        selector: {
          selectedBusinness: true
        }
      })
      .exec()
      .then((data) => {
        if (data) {
          businessId = data.businessId;
          businessCity = data.businessCity;
          localStorage.setItem('businessId', data.businessId);
          localStorage.setItem('businessCity', data.businessCity);
          localStorage.setItem('posFeatures', (data.posFeature));
          localStorage.setItem('deviceNames', (data.deviceNames));
          localStorage.setItem('posFeatures', data.posFeature);
          localStorage.setItem(
            'level1Categories',
            JSON.stringify(data.level1Categories)
          );
          localStorage.setItem('onlinePOSPermission', data.onlinePOSPermission);
          localStorage.setItem(
            'createBillPermission',
            data.createBillPermission
          );

          posFeatures = data.posFeature;
          level1Categories = JSON.stringify(data.level1Categories);
          onlinePOSPermission = data.onlinePOSPermission;
          createBillPermission = data.createBillPermission;
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    /**
     * get from device id table
     */
    await db.deviceid
      .findOne()
      .exec()
      .then((data) => {
        if (data) {
          posDeviceId = data.deviceId;
          localStorage.setItem('podId', data.deviceId);
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  } else {
    businessId = localStorage.getItem('businessId');
    businessCity = localStorage.getItem('businessCity');
    posDeviceId = localStorage.getItem('posId') || 1;

    if (
      localStorage.getItem('posFeatures') &&
      localStorage.getItem('posFeatures') !== 'undefined'
    ) {
      try {
        posFeatures = localStorage.getItem('posFeatures');
      } catch (err) {
        console.log(err);
      }
    }
    if (
      localStorage.getItem('level1Categories') &&
      localStorage.getItem('level1Categories') !== 'undefined'
    ) {
      try {
        level1Categories = JSON.parse(localStorage.getItem('level1Categories'));
      } catch (err) {
        console.log(err);
      }
    }
    onlinePOSPermission = localStorage.getItem('onlinePOSPermission');
    createBillPermission = localStorage.getItem('createBillPermission');
  }

  var data = {
    businessId: businessId,
    businessCity: businessCity,
    posDeviceId: posDeviceId,
    posFeatures: posFeatures,
    level1Categories: level1Categories,
    onlinePOSPermission: onlinePOSPermission,
    createBillPermission: createBillPermission
  };
  return data;
};

export const isQtyChangesAllowed = async (enableQuantity) => {
  let result = false;

  //if enable qty value is not set means by default qty changes are allowed
  if (typeof enableQuantity === 'undefined') {
    result = true;
  } else {
    if (enableQuantity === true || enableQuantity === 'true') {
      result = true;
    } else {
      if (localStorage.getItem('isHotelOrRestaurant')) {
        let isHotelOrRestaurant = localStorage.getItem('isHotelOrRestaurant');
        if (String(isHotelOrRestaurant).toLowerCase() !== 'true') {
          result = true;
        }
      }
    }
  }

  return result;
};
