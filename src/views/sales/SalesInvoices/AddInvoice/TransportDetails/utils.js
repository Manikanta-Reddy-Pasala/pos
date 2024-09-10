import * as ewayHelper from 'src/components/Helpers/EWayHelper';

const localTransportDetails = [
  {
    name: 'approxDistance',
    label: 'Approx Distance in KM *',
    type: 'number'
  },
  {
    name: 'transportMode',
    label: 'Mode',
    type: 'select',
    options: ewayHelper.getTransportationModes().map((item) => item.name)
  },
  {
    name: 'vehicleNo',
    label: 'Vehicle No. *',
    type: 'text'
  },
  {
    name: 'vehicleType',
    label: 'Vehicle Type',
    type: 'select',
    options: ewayHelper.getVehicleTypes().map((item) => item.name)
  }
];

const transporterDetails = [
  {
    name: 'transporterName',
    label: 'Transporter Name',
    type: 'text'
  },
  {
    name: 'transporterId',
    label: 'Transporter ID',
    type: 'text'
  }
];

const shippingDetails = [
  {
    name: 'exportShippingBillDate',
    label: 'Shipping Bill Date',
    type: 'date'
  },
  {
    name: 'exportShippingPortCode',
    label: 'Shipping Port Code',
    type: 'text'
  },
  {
    name: 'placeOfReceiptByPreCarrier',
    label: 'Place of Receipt by Pre Carrier',
    type: 'text'
  },
  {
    name: 'vesselFlightNo',
    label: 'Vessel Flight No.',
    type: 'text'
  },
  {
    name: 'portOfLoading',
    label: 'Port of Loading',
    type: 'text'
  },
  {
    name: 'portOfDischarge',
    label: 'Port of Discharge',
    type: 'text'
  }
];

export const groups = [
  {
    name: 'Transporter Details',
    data: transporterDetails
  },
  {
    name: 'Local Transport Details',
    data: localTransportDetails
  },
  {
    name: 'Export Details',
    data: shippingDetails
  }
];
