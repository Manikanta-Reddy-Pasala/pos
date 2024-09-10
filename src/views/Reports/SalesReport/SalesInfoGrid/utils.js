import React from 'react';
import * as moment from 'moment';

export const defaultColumnConfig = {
  defaultColDef: {
    // flex: 1,
    minWidth: 150,
    width: 150,
    resizable: false,
    sortable: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    rowHeight: 10,
    headerHeight: 30
  }
};

const filterParams = {
  buttons: ['reset', 'apply'],
  closeOnApply: true
};

const commonColConfig = {
  width: 100,
  minWidth: 120,
  filterParams
};

const invoiceNumberCellStyle = (params) => {
  return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
};

function dateFormatter(params) {
  var dateAsString = params.data.invoice_date;
  var dateParts = dateAsString.split('-');
  return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
}

const customHeader = (text1, text2) => (
  <div>
    <p>{text1}</p>
    <p>{text2}</p>
  </div>
);

const getColTotals = (params, key) => {
  let data = params['data'];
  let items = data.item_list;

  let result = 0;

  for (let item of items) {
    result += parseFloat(item[key]);
  }

  return parseFloat(result).toFixed(2);
};

export const salesColumnDef = (salesReportFilters = []) => {
  let columnDefs = [];

  const gstin = {
    headerName: 'GSTIN/UIN',
    field: 'customerGSTNo',
    ...commonColConfig
  };

  const customerName = {
    headerName: 'Customer Name',
    field: 'customer_name',
    ...commonColConfig,
    headerComponentFramework: (props) => customHeader('CUSTOMER', 'NAME')
  };

  const placeOfSupply = {
    headerName: 'Place of Supply',
    field: 'place_of_supply',
    ...commonColConfig,
    headerComponentFramework: (props) => customHeader('PLACE OF', 'SUPPLY')
  };

  const invoiceNo = {
    headerName: 'INVOICE NO',
    field: 'sequenceNumber',
    filterParams,
    cellStyle: invoiceNumberCellStyle
  };

  const date = {
    headerName: 'DATE',
    field: 'invoice_date',
    valueFormatter: dateFormatter,
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true,
      comparator: (filterLocalDateAtMidnight, cellValue) => {
        const cellDate = moment(cellValue).startOf('day').toDate();

        if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
          return 0;
        }

        if (cellDate < filterLocalDateAtMidnight) {
          return -1;
        }

        if (cellDate > filterLocalDateAtMidnight) {
          return 1;
        }
      }
    },
    filter: 'agDateColumnFilter'
  };

  const invoiceValue = {
    headerName: 'INVOICE VALUE',
    field: 'total_amount',
    filterParams,
    headerComponentFramework: (props) => customHeader('INVOICE', 'VALUE'),
    valueFormatter: (params) => {
      let data = params['data'];
      let result = parseFloat(data['total_amount']).toFixed(2);
      return result;
    }
  };

  const taxableValue = {
    field: 'total_amount',
    filterParams,
    headerComponentFramework: (props) => customHeader('TAXABLE', 'VALUE'),
    valueFormatter: (params) => {
      let data = params['data'];
      let items = data.item_list;

      let totalTax = 0;
      let result = 0;

      for (let item of items) {
        totalTax +=
          parseFloat(item.cgst_amount) +
          parseFloat(item.sgst_amount) +
          parseFloat(item.igst_amount) +
          parseFloat(item.cess);
      }

      result = data.total_amount - totalTax;

      return parseFloat(result).toFixed(2);
    }
  };

  const cgst = {
    headerName: 'CGST',
    field: 'total_amount',
    filterParams,
    valueFormatter: (params) => getColTotals(params, 'cgst_amount')
  };

  const sgst = {
    headerName: 'SGST',
    field: 'total_amount',
    filterParams,
    valueFormatter: (params) => getColTotals(params, 'sgst_amount')
  };

  const igst = {
    headerName: 'IGST',
    field: 'total_amount',
    filterParams,
    valueFormatter: (params) => getColTotals(params, 'igst_amount')
  };

  const roundOff = {
    field: 'round_amount',
    filterParams,
    headerComponentFramework: (props) => customHeader('ROUND', 'OFF')
  };

  const totalTax = {
    field: 'total_amount',
    filterParams,
    headerComponentFramework: (props) => customHeader('TOTAL', 'TAX'),

    valueFormatter: (params) => {
      let data = params['data'];
      let items = data.item_list;

      let totalTax = 0;
      let result = 0;

      for (let item of items) {
        totalTax +=
          parseFloat(item.cgst_amount) +
          parseFloat(item.sgst_amount) +
          parseFloat(item.igst_amount) +
          parseFloat(item.cess);
      }

      result = totalTax;

      return parseFloat(result).toFixed(2);
    }
  };

  const balanceDue = {
    headerName: 'BALANCE DUE',
    field: 'balance_amount',
    width: 90,
    minWidth: 100,
    headerComponentFramework: (props) => customHeader('BALANCE', 'DUE'),
    filterParams
  };

  const irnNo = {
    headerName: 'IRN',
    field: 'irnNo',
    filter: false
  };

  const ewayNo = {
    headerName: 'E-WAY',
    field: 'ewayBillNo',
    filter: false
  };

  const wastage = {
    headerName: 'WASTAGE',
    field: 'total_wastage',
    ...commonColConfig,
    valueFormatter: (params) => {
      let data = params['data'];
      let result = 0;
      let itemsList = data['item_list'];

      for (let item of itemsList) {
        result += parseFloat(item.wastageGrams || 0);
      }

      return parseFloat(result).toFixed(2);
    }
  };

  const netWeight = {
    headerName: 'Net Weight',
    field: 'total_net_weight',
    ...commonColConfig,
    valueFormatter: (params) => {
      let data = params['data'];
      let result = 0;
      let itemsList = data['item_list'];

      for (let item of itemsList) {
        result += parseFloat(item.netWeight || 0);
      }

      return parseFloat(result).toFixed(2);
    },
    headerComponentFramework: (props) => customHeader('NET', 'WEIGHT')
  };

  const makingCharge = {
    headerName: 'Making Charge',
    field: 'total_making_charge',
    ...commonColConfig,
    valueFormatter: (params) => {
      let data = params['data'];
      let result = 0;
      let itemsList = data['item_list'];

      for (let item of itemsList) {
        result += parseFloat(item.makingChargeAmount || 0);
      }

      return parseFloat(result).toFixed(2);
    },
    headerComponentFramework: (props) => customHeader('MAKING', 'CHARGE')
  };

  const makingChargePerGram = {
    headerName: 'Making Charge/g',
    field: 'total_making_charge_per_gram',
    ...commonColConfig,
    valueFormatter: (params) => {
      let data = params['data'];
      let result = 0;
      let itemsList = data['item_list'];

      for (let item of itemsList) {
        result += parseFloat(item.makingChargePerGramAmount || 0);
      }

      return parseFloat(result).toFixed(2);
    },
    headerComponentFramework: (props) => customHeader('MAKING', 'CHARGE/g')
  };

  const totalDiscount = {
    headerName: 'Total Discount',
    field: 'total_discount',
    ...commonColConfig,
    valueFormatter: (params) => {
      let data = params['data'];
      let result = 0;
      let itemsList = data['item_list'];

      for (let item of itemsList) {
        result += parseFloat(item.discount_amount || 0);
      }

      return parseFloat(result).toFixed(2);
    },
    headerComponentFramework: (props) => customHeader('TOTAL', 'DISCOUNT')
  };
  const grossWeight = {
    headerName: 'Gross Weight',
    field: 'total_gross_weight',
    ...commonColConfig,
    valueFormatter: (params) => {
      let data = params['data'];
      let result = 0;
      let itemsList = data['item_list'];

      for (let item of itemsList) {
        result += parseFloat(item.grossWeight || 0);
      }

      return parseFloat(result).toFixed(2);
    },
    headerComponentFramework: (props) => customHeader('GROSS', 'WEIGHT')
  };

  columnDefs.push(invoiceNo);
  columnDefs.push(gstin);
  columnDefs.push(customerName);
  columnDefs.push(placeOfSupply);
  columnDefs.push(date);
  columnDefs.push(invoiceValue);
  columnDefs.push(taxableValue);
  columnDefs.push(sgst);
  columnDefs.push(cgst);
  columnDefs.push(igst);
  columnDefs.push(totalTax);
  columnDefs.push(roundOff);
  columnDefs.push(balanceDue);
  columnDefs.push(irnNo);
  columnDefs.push(ewayNo);

  salesReportFilters.forEach((filter) => {
    if (filter.name === 'Gross Weight' && filter.val === true) {
      columnDefs.push(grossWeight);
    }

    if (filter.name === 'Wastage' && filter.val === true) {
      columnDefs.push(wastage);
    }

    if (filter.name === 'Net Weight' && filter.val === true) {
      columnDefs.push(netWeight);
    }

    if (filter.name === 'Making Charge' && filter.val === true) {
      columnDefs.push(makingCharge);
    }

    if (filter.name === 'Making Charge/g' && filter.val === true) {
      columnDefs.push(makingChargePerGram);
    }

    if (filter.name === 'Discount' && filter.val === true) {
      columnDefs.push(totalDiscount);
    }
  });

  return columnDefs;
};

export const getTotals = (data, key) => {
  let result = 0;

  for (let item of data.item_list) {
    result += parseFloat(item[key] || 0);
  }

  return result;
};
