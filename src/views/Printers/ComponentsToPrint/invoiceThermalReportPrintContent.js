require('number-to-text/converters/en-us'); // load converter

let contentBuilder = [];
let itemsTableContent = [];

function dateFormatter(date) {
  var dateParts = date.split('-');
  if (dateParts.length >= 3) {
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }
}

const appendRow = (type, value, style, css = {}) => {
  contentBuilder.push({
    type: type, // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
    value: value,
    style: style,
    css: css
  });
};

const appendTable = (tableHeader, tableBody, tableFooter, style) => {
  contentBuilder.push({
    type: 'table',
    style: style,
    custom: true,
    tableHeader: tableHeader,
    tableBody: tableBody,
    tableFooter: tableFooter,
    tableHeaderStyle:
      'margin-top:2px;margin-right:10px;font-size: 12px; font-family:Roboto condensed;',
    // custom style for the table body
    tableBodyStyle:
      'margin-top: 2px;font-size: 10px; font-family:Roboto condensed;',
    // custom style for the table footer
    tableFooterStyle:
      'margin-top:2px; font-size: 10px; font-family:Roboto condensed;'
  });
};

const getFloatWithTwoDecimal = (val) => {
  return parseFloat(val).toFixed(2);
};

const getInvoiceRows = (_data) => {
  itemsTableContent = [];

  let item_list = _data;
  return item_list.forEach((item, index) => {
    let innerArray = [];

    innerArray.push(item.productName);

    innerArray.push('<center>' + item.saleQty + '</center>');

    innerArray.push(getFloatWithTwoDecimal(item.saleAmount));
    itemsTableContent.push(innerArray);
  });
};

export const InvoiceThermalReportPrintContent = (
  settings,
  content,
  fromDate,
  toDate,
  total,
  totalQty
) => {
  contentBuilder = [];
  let _data = {};
  itemsTableContent = [];

  if (settings && content) {
    _data = content;
  }

  const printContent = () => {
    if (settings.boolCompanyName) {
      appendRow('text', settings.strCompanyName, 'text-align:center;', {
        'font-kerning': 'normal',
        'font-weight': '400',
        'font-style': 'normal',
        'font-size': '14px',
        'font-family': 'sans-serif'
      });
    }

    if (settings.boolAddress) {
      appendRow('text', settings.strAddress, 'text-align:center;', {
        'font-kerning': 'normal',
        'font-weight': 'lighter',
        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'sans-serif'
      });
    }

    if (settings.boolEmail) {
      appendRow('text', settings.strEmail, 'text-align:center;', {
        'font-kerning': 'normal',
        'font-weight': 'lighter',
        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'sans-serif'
      });
    }

    if (settings.boolPhone) {
      appendRow('text', settings.strPhone, 'text-align:center;', {
        'font-kerning': 'normal',
        'font-weight': 'lighter',
        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'sans-serif'
      });
    }

    if (settings.boolWebsite) {
      appendRow('text', settings.strWebsite, 'text-align:center;', {
        'font-kerning': 'normal',

        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'Roboto condensed'
      });
    }

    if (settings.boolGSTIN) {
      appendRow('text', 'GSTIN:' + settings.strGSTIN, 'text-align:center;');
    }

    if (settings.boolPAN) {
      appendRow('text', 'PAN:' + settings.strPAN, 'text-align:center;');
    }

    appendRow(
      'text',
      'Sales-Product Report',
      'text-align:center; margin-top:10px;',
      {
        'font-kerning': 'normal',
        'font-weight': '400',
        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'sans-serif'
      }
    );

    appendRow(
      'text',
      'From: ' + dateFormatter(fromDate) + '   To: ' + dateFormatter(toDate),
      'text-align:left; margin-top:10px;margin-left:5px;',
      {
        'font-kerning': 'normal',
        'font-weight': '400',
        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'sans-serif'
      }
    );

    let tableHeader = ['Name', 'Qty', 'Amount'];
    getInvoiceRows(_data); // printing items

    appendTable(
      tableHeader,
      itemsTableContent,
      '',
      'margin-top:2px;margin-right: 10px;margin-left: 0px;'
    );

    appendRow(
      'text',
      'Total Qty: ' + getFloatWithTwoDecimal(totalQty),
      'text-align:right;margin-right: 15px;margin-top: 10px;',
      {
        'font-kerning': 'normal',
        'font-weight': '400',
        'font-style': 'normal',
        'font-size': '14px',
        'font-family': 'Roboto condensed'
      }
    );

    appendRow(
      'text',
      'Total Amount: ₹' + getFloatWithTwoDecimal(total),
      'text-align:right;margin-right: 15px;',
      {
        'font-kerning': 'normal',
        'font-weight': '400',
        'font-style': 'normal',
        'font-size': '14px',
        'font-family': 'Roboto condensed'
      }
    );

    appendRow('text', '', 'margin-bottom:40px;', {});
  };

  printContent();

  return contentBuilder;
};