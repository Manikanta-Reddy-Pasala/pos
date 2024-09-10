export const getCancelEWayReasonCodes = () => {
  let cancelEWayReasonCodesList = [
    { val: 1, name: 'Duplicate' },
    { val: 2, name: 'Order Cancelled' },
    { val: 3, name: 'Data Entry mistake' },
    { val: 4, name: 'Others' }
  ];

  return cancelEWayReasonCodesList;
};

export const getUpdatePartBEWayReasonCodes = () => {
  let updatePartBEWayReasonCodesList = [
    { val: 1, name: 'Due to Break Down' },
    { val: 2, name: 'Due to Transshipment' },
    { val: 3, name: 'Others (Pls. Specify)' },
    { val: 4, name: 'First Time' }
  ];

  return updatePartBEWayReasonCodesList;
};

export const getTransportationModes = () => {
  let transportationModesList = [
    { val: 1, name: 'Road' },
    { val: 2, name: 'Rail' },
    { val: 3, name: 'Air' },
    { val: 4, name: 'Ship' },
    { val: 5, name: 'inTransit' }
  ];

  return transportationModesList;
};

export const getVehicleTypes = () => {
  let vehicleTypesList = [
    { val: 'R', name: 'Regular' },
    { val: 'O', name: 'ODC(Over Dimentional Cargo)' }
  ];

  return vehicleTypesList;
};

export const getConsignmentStatus = () => {
  let consignmentStatusList = [
    { val: 'M', name: 'inMovement' },
    { val: 'T', name: 'inTransit' }
  ];

  return consignmentStatusList;
};

export const getExtendEWayReasonCodes = () => {
  let transportationModesList = [
    { val: 1, name: 'Natural Calamity' },
    { val: 2, name: 'Law and Order Situation' },
    { val: 3, name: 'Transshipment' },
    { val: 4, name: 'Accident' },
    { val: 99, name: 'Others' }
  ];

  return transportationModesList;
};

export const getEWayTransactionTypes = () => {
  let transactionTypesList = [
    { val: 1, name: 'Regular' },
    { val: 2, name: 'Bill To - Ship To' },
    { val: 3, name: 'Bill From - Dispatch From' },
    { val: 4, name: 'Combination of 2 and 3' }
  ];

  return transactionTypesList;
};

export const getEWaySupplyTypes = () => {
  let supplyTypesList = [
    { val: 'O', name: 'Outward' },
    { val: 'I', name: 'Inward' }
  ];

  return supplyTypesList;
};

export const getEWaySubSupplyTypes = () => {
  let subSupplyTypesList = [
    { val: '1', name: 'Supply' },
    { val: '2', name: 'Import' },
    { val: '3', name: 'Export' },
    { val: '4', name: 'Job Work' },
    { val: '5', name: 'For Own Use' },
    { val: '6', name: 'Job work Returns' },
    { val: '7', name: 'Sales Return' },
    { val: '8', name: 'Others' },
    { val: '9', name: 'SKD/CKD/Lots' },
    { val: '10', name: 'Line Sales' },
    { val: '11', name: 'Recipient Not Known' },
    { val: '12', name: 'Exhibition or Fairs' }
  ];

  return subSupplyTypesList;
};
