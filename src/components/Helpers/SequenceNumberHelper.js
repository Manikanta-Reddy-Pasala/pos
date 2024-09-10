import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../SelectedBusiness';
import * as dateHelper from './DateHelper';
import * as txnSettings from 'src/components/Helpers/TransactionSettingsHelper';

import axios from 'axios';

export const getLastSequenceNumber = async (type, prefix) => {
  let sequenceNumber = 0;
  const db = await Db.get();

  if (!prefix) {
    prefix = '';
  }

  try {
    let query;
    const businessData = await Bd.getBusinessData();

    query = db.sequencenumbers.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: type + prefix } }
        ]
      }
    });

    await query
      .exec()
      .then(async (data) => {
        sequenceNumber = parseInt(data.sequence);
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  } catch (err) {
    console.log(err);
  }

  return sequenceNumber;
};

export const getLocalSequenceNumber = async (type, prefix) => {
  //if no multiple billing get from local table
  let sequenceNumber = 0;
  const db = await Db.get();

  if (!prefix) {
    prefix = '';
  }

  try {
    let query;
    const businessData = await Bd.getBusinessData();

    query = db.sequencenumbers.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: type + prefix } }
        ]
      }
    });

    // console.log(query);
    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          const businessData = await Bd.getBusinessData();

          let sequenceData = {};
          sequenceData.id = type + prefix;
          sequenceData.type = type;
          sequenceData.sequence = 1;
          sequenceData.prefix = prefix;
          sequenceData.businessId = businessData.businessId;
          sequenceData.businessCity = businessData.businessCity;
          sequenceData.updatedAt = Date.now();
          sequenceData.posId = localStorage.getItem('posId') || 1;

          await db.sequencenumbers
            .insert(sequenceData)
            .then((data) => {
              console.log('data Inserted into sequence number', data);
            })
            .catch((err) => {
              console.log('data Insertion Failed for sequence number', err);
            });

          return;
        }

        sequenceNumber = parseInt(data.sequence);

        await query
          .update({
            $set: {
              sequence: sequenceNumber + 1,
              updatedAt: Date.now()
            }
          })
          .then(async (data) => {
            console.log('inside update', data);
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  } catch (err) {
    console.log(err);
  }

  return sequenceNumber;
};
export const getSequenceNumberFromAPI = async (
  type,
  prefix,
  id,
  maxRetries = 1,
  delayMs = 100
) => {
  let sequenceNumber = '0';
  const businessData = await Bd.getBusinessData();
  const businessId = businessData.businessId;
  const businessCity = businessData.businessCity;
  const API_SERVER = window.REACT_APP_API_SERVER;

  const makeRequest = async (retryCount) => {
    try {
      const response = await axios.get(
        API_SERVER + '/pos/v1/user/getBillNumber',
        {
          params: {
            businessId: businessId,
            businessCity: businessCity,
            type: type,
            prefix: prefix,
            id: id
          }
        }
      );

      if (response.status === 200 && response.data.billNumber) {
        sequenceNumber = response.data.billNumber.toString();
        return sequenceNumber;
      } else if (sequenceNumber === '0') {
        throw new Error('Invalid response or missing billNumber.');
      } else {
        throw new Error('Invalid response or missing billNumber.');
      }
    } catch (error) {
      if (retryCount < maxRetries) {
        console.log(
          `Received a non-200 response. Retrying... (Attempt ${retryCount + 1})`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return makeRequest(retryCount + 1);
      } else {
        // throw new Error(
        //   `Failed to get a successful response after ${maxRetries} retries. Last error: ${error.message}`
        // );
      }
    }
  };

  try {
    sequenceNumber = await makeRequest(0);
    return sequenceNumber;
  } catch (error) {
    console.log(error.message);
    // You might want to log the error or handle it further, depending on your use case.
    throw error; // Rethrow the error to indicate failure after retries.
  }
};

export const calculateSequenceNumber = async (data, sequenceNumber) => {
  let sequenceNumberPrefix = '';

  if (data && (data.prefix || data.subPrefix || data.datePrefix)) {
    if (data.prefix !== '##' && data.prefix !== undefined) {
      sequenceNumberPrefix += data.prefix;
    }

    if (data.subPrefix !== '##' && data.subPrefix !== undefined) {
      sequenceNumberPrefix +=
        sequenceNumberPrefix.length > 0 ? `/${data.subPrefix}` : data.subPrefix;
    }

    if (data.datePrefix) {
      sequenceNumberPrefix +=
        sequenceNumberPrefix.length > 0
          ? `/${data.datePrefix}`
          : data.datePrefix;
    }
  }

  const finalSequenceNumber =
    sequenceNumberPrefix.length > 0
      ? `${sequenceNumberPrefix}/${sequenceNumber}`
      : `${sequenceNumberPrefix}${sequenceNumber}`;

  return finalSequenceNumber.replace(/\/\//g, '/');
};

export const getFinalSequenceNumber = async (
  data,
  type,
  date,
  id,
  transactionSettings,
  multiDeviceSettings,
  isOnline
) => {
  if (!data) return null;

  if (data.appendYear && data.appendYear === true) {
    const finantialYear = date
      ? await dateHelper.getFinancialYearStringByGivenDate(date)
      : await dateHelper.getCurrentFinancialYearString();

    data.datePrefix = finantialYear;
  }

  let sequenceNumber = '0';

  if (isOnline === true) {
    sequenceNumber = await getSequenceNumberFromAPI(type, data.prefix, id);
  }

  if (
    (sequenceNumber === '0' ||
      sequenceNumber === null ||
      sequenceNumber === '' ||
      sequenceNumber === undefined) &&
    multiDeviceSettings &&
    multiDeviceSettings.autoInjectLocalDeviceNo === true
  ) {
    const prefixSequence =
      multiDeviceSettings[getTypePrefix(type)].prefixSequence[0].sequenceNumber;
    sequenceNumber = prefixSequence;

    await updateMultiDeviceSettingDetails(type);
  } else if (
    (sequenceNumber === '0' ||
      sequenceNumber === null ||
      sequenceNumber === '' ||
      sequenceNumber === undefined) &&
    (type === 'Stock' || type === 'Tally Receipt')
  ) {
    multiDeviceSettings = await txnSettings.getMultiDeviceTransactionData();
    data.prefix = localStorage.getItem('deviceName');
    data.subPrefix = type === 'Stock' ? 'Stock' : 'Tally';
    const prefixSequence =
      multiDeviceSettings[getTypePrefix(type)].prefixSequence[0].sequenceNumber;
    sequenceNumber = prefixSequence;

    await updateMultiDeviceSettingDetails(type);
  }

  if (
    sequenceNumber === null ||
    sequenceNumber === undefined ||
    sequenceNumber === '' ||
    sequenceNumber === '0'
  ) {
    return '0';
  }

  if (
    sequenceNumber !== '0' ||
    sequenceNumber !== null ||
    sequenceNumber !== '' ||
    sequenceNumber !== undefined
  ) {
    return await calculateSequenceNumber(data, sequenceNumber);
  }

  return sequenceNumber;
};

// Helper function to get the appropriate prefix type based on the 'type' parameter
const getTypePrefix = (type) => {
  const typePrefixMap = {
    Sales: 'sales',
    'Tally Receipt': 'tallyReceipt',
    Approvals: 'approval',
    'Delivery Challan': 'deliveryChallan',
    Expense: 'expense',
    'Job Work In': 'jobWorkOrderIn',
    jobListReceipt: 'workOrderReceipt',
    jobListInvoice: 'jobWorkOrderOut',
    'Payment In': 'paymentIn',
    'Payment Out': 'paymentOut',
    Manufacture: 'manufacture',
    'Purchase Order': 'purchaseOrder',
    'Sales Return': 'salesReturn',
    'Sale Order': 'saleOrder',
    'Sales Quotation': 'salesQuotation',
    Stock: 'stock',
    'Scheme': 'scheme',
    'Tally Payment': 'tallyPayment',
    'Export To TallyPayment': 'payment',
    'Export To TallyReceipt': 'receipt'
  };

  return typePrefixMap[type] || null;
};

export const updateMultiDeviceSettingDetails = async (type) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  const deviceName = localStorage.getItem('deviceName');

  try {
    const data = await db.multidevicesettings
      .findOne({
        selector: {
          $and: [
            { businessId: businessData.businessId },
            { deviceName: deviceName }
          ]
        }
      })
      .exec();

    if (!data) {
      // No data is not found so cannot update any information
      return;
    }

    const sequenceKey = getTypePrefix(type);
    const sequenceNumberKey = 'sequenceNumber';

    if (data[sequenceKey]) {
      let txnPrefixData = data[sequenceKey].prefixSequence[0];
      txnPrefixData[sequenceNumberKey] = txnPrefixData[sequenceNumberKey] + 1;

      // Iterate through the array and remove the first element
      let prefixSequencePartial = data[sequenceKey].prefixSequence.slice(1);

      // Add the modified txnPrefixData at the beginning

      let prefixSequenceFinal = [txnPrefixData, ...prefixSequencePartial];

      let keyData = {};

      switch (sequenceKey) {
        case 'sales':
          keyData = { 'sales.prefixSequence': prefixSequenceFinal };
          break;
        case 'tallyReceipt':
          keyData = { 'tallyReceipt.prefixSequence': prefixSequenceFinal };
          break;
        case 'approval':
          keyData = { 'approval.prefixSequence': prefixSequenceFinal };
          break;
        case 'deliveryChallan':
          keyData = { 'deliveryChallan.prefixSequence': prefixSequenceFinal };
          break;
        case 'expense':
          keyData = { 'expense.prefixSequence': prefixSequenceFinal };
          break;
        case 'jobWorkOrderIn':
          keyData = { 'jobWorkOrderIn.prefixSequence': prefixSequenceFinal };
          break;
        case 'workOrderReceipt':
          keyData = { 'workOrderReceipt.prefixSequence': prefixSequenceFinal };
          break;
        case 'jobWorkOrderOut':
          keyData = { 'jobWorkOrderOut.prefixSequence': prefixSequenceFinal };
          break;
        case 'paymentIn':
          keyData = { 'paymentIn.prefixSequence': prefixSequenceFinal };
          break;
        case 'paymentOut':
          keyData = { 'paymentOut.prefixSequence': prefixSequenceFinal };
          break;
        case 'manufacture':
          keyData = { 'manufacture.prefixSequence': prefixSequenceFinal };
          break;
        case 'purchaseOrder':
          keyData = { 'purchaseOrder.prefixSequence': prefixSequenceFinal };
          break;
        case 'salesReturn':
          keyData = { 'salesReturn.prefixSequence': prefixSequenceFinal };
          break;
        case 'saleOrder':
          keyData = { 'saleOrder.prefixSequence': prefixSequenceFinal };
          break;
        case 'salesQuotation':
          keyData = { 'salesQuotation.prefixSequence': prefixSequenceFinal };
          break;
        case 'stock':
          keyData = { 'stock.prefixSequence': prefixSequenceFinal };
          break;
        case 'scheme':
          keyData = { 'scheme.prefixSequence': prefixSequenceFinal };
          break;
        case 'tallyPayment':
          keyData = { 'tallyPayment.prefixSequence': prefixSequenceFinal };
          break;
        default:
          break;
      }

      let updateData = {
        updatedAt: Date.now(),
        ...keyData
      };

      await data.update({ $set: updateData });
    }
  } catch (err) {
    console.log('Internal Server Error', err);
  }
};
