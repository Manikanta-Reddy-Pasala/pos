import axios from 'axios';
import * as apiHelper from 'src/components/Helpers/ApiHelper';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const getDeviceId = async () => {
  const fp = await FingerprintJS.load();
  const deviceId = await fp.get();

  console.log('deviceId is ', deviceId.visitorId);

  return deviceId.visitorId;
};

export const submitPlayerIdToServer = async () => {
  let businessCity = localStorage.getItem('businessCity')
    ? localStorage.getItem('businessCity')
    : '';
  let businessId = localStorage.getItem('businessId')
    ? localStorage.getItem('businessId')
    : '';

  let deviceId = localStorage.getItem('deviceId');
  let playerId = localStorage.getItem('firebasePlayerId')
    ? localStorage.getItem('firebasePlayerId')
    : '';

  const API_SERVER = window.REACT_APP_API_SERVER;
  await axios
    .post(`${API_SERVER}/pos/v1/printer/updatePlayerId`, {
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

export const submitPrintCommandToServer = async (invoiceId, invoiceType) => {
  const printData = await getPrintObject(invoiceId, invoiceType);

  const apiResponse = await apiHelper.postApiRequest(
    '/pos/v1/printer/sendPrintCommand',
    printData,
    null
  );

  return apiResponse;
};

const getPrintObject = async (invoiceId, invoiceType) => {
  let businessCity = localStorage.getItem('businessCity')
    ? localStorage.getItem('businessCity')
    : '';
  let businessId = localStorage.getItem('businessId')
    ? localStorage.getItem('businessId')
    : '';

  let id = localStorage.getItem('deviceId');
  let type = 'pos';

  let cloudPrintData = {
    businessCity: businessCity,
    businessId: businessId,
    invoiceId: invoiceId,
    invoiceType: invoiceType,
    id: id,
    type: type
  };

  return cloudPrintData;
};

export const getCloudPrinterSettingsData = async () => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();
  let cloudPrinterSettings = {};

  let id = localStorage.getItem('deviceId');
  await db.cloudprintsettings
    .findOne({
      selector: {
        $and: [{ id: id }, { businessId: { $eq: businessData.businessId } }]
      }
    })
    .exec()
    .then((data) => {
      // console.log(data)

      if (data) {
        cloudPrinterSettings.deviceName = data.deviceName;
        cloudPrinterSettings.id = data.id;
        cloudPrinterSettings.cloudPrinterSelected = data.cloudPrinterSelected;
        cloudPrinterSettings.enableMessageReceive = data.enableMessageReceive;
        cloudPrinterSettings.enableMessageSend = data.enableMessageSend;
        cloudPrinterSettings.updatedAt = data.updatedAt;
        cloudPrinterSettings.businessId = data.businessId;
        cloudPrinterSettings.businessCity = data.businessCity;
        cloudPrinterSettings.posId = data.posId;
        cloudPrinterSettings.playerId = data.playerId;
      }
    })
    .catch((err) => {
      console.log('Internal Server Error', err);
    });

  return cloudPrinterSettings;
};
