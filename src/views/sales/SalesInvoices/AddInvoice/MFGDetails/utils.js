import * as countryHelper from 'src/components/Utility/CountriesUtility';
import * as currencyHelper from 'src/components/Utility/CurrencyUtility';

const exportTypes = [
  'Export under bond/LUT',
  'Export with IGST',
  'SEZ with IGST payment',
  'SEZ without IGST payment',
  'A deemed export'
];

const orderDetails = [
  {
    name: 'otherReference',
    label: 'Other References',
    type: 'text'
  },
  {
    name: 'exportShippingBillNo',
    label: 'Shipping Bill No',
    type: 'text'
  },
  {
    name: 'billOfLadingNo',
    label: 'Bill of Lading No',
    type: 'text'
  },
  {
    name: 'exportCountryOrigin',
    label: 'Country of origin of goods',
    type: 'select',
    options: countryHelper.getCountriesList(),
    placeholderText: 'Select'
  },
  {
    name: 'exportCountry',
    label: 'Country of Final Destination',
    type: 'select',
    options: countryHelper.getCountriesList(),
    placeholderText: 'Select'
  }
];

export const inputFields = [
  {
    name: 'exportType',
    label: 'Export Type',
    type: 'select',
    options: exportTypes
  },
  {
    name: 'exportCurrency',
    label: 'Currency',
    type: 'select',
    options: currencyHelper.getCurrenciesList()
  },
  {
    name: 'exportConversionRate',
    label: 'Conversion Rate',
    type: 'number'
  }
];

export const groups = [
  {
    name: 'Order Details',
    data: orderDetails
  },
  {
    name: 'Other Details',
    data: inputFields
  }
];
