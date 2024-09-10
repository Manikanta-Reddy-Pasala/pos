export const prepareSalesHeaderRow = (
  filteredColumns,
  auditSettingsExists,
  auditSettings,
  type
) => {
  filteredColumns.push({
    header: 'INVOICE NUMBER',
    key: 'invoiceNumber',
    width: 15
  });
  filteredColumns.push({ header: 'DATE', key: 'date', width: 15 });
  if(type && type === 'B2BA') {
    filteredColumns.push({
      header: 'ORIGINAL INV NUMBER',
      key: 'originalinvoiceNumber',
      width: 20
    });
    filteredColumns.push({ header: 'ORIGINAL DATE', key: 'originaldate', width: 15 });
  }
  filteredColumns.push({
    header: 'CUSTOMER NAME',
    key: 'customerName',
    width: 20
  });
  filteredColumns.push({ header: 'GSTIN/UIN', key: 'gstin', width: 20 });
  filteredColumns.push({
    header: 'POS',
    key: 'placeOfSupply',
    width: 8
  });
  filteredColumns.push({
    header: 'INVOICE VALUE',
    key: 'invoiceValue',
    width: 20
  });
  if (auditSettingsExists) {
    if (auditSettings.taxApplicability.includes(0)) {
      filteredColumns.push({
        header: 'GST % - TAXABLE',
        key: 'zerotaxable',
        width: 20
      });
      filteredColumns.push({
        header: 'GST % - SGST',
        key: 'zerosgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST % - CGST',
        key: 'zerocgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST % - IGST',
        key: 'zeroigst',
        width: 15
      });
    }

    if (auditSettings.taxApplicability.includes(3)) {
      filteredColumns.push({
        header: 'GST 3% - TAXABLE',
        key: 'threetaxable',
        width: 20
      });
      filteredColumns.push({
        header: 'GST 1.5% - SGST',
        key: 'threesgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 1.5% - CGST',
        key: 'threecgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 3% - IGST',
        key: 'threeigst',
        width: 15
      });
    }

    if (auditSettings.taxApplicability.includes(5)) {
      filteredColumns.push({
        header: 'GST 5% - TAXABLE',
        key: 'fivetaxable',
        width: 20
      });
      filteredColumns.push({
        header: 'GST 2.5% - SGST',
        key: 'fivesgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 2.5% - CGST',
        key: 'fivecgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 5% - IGST',
        key: 'fiveigst',
        width: 15
      });
    }

    if (auditSettings.taxApplicability.includes(12)) {
      filteredColumns.push({
        header: 'GST 12% - TAXABLE',
        key: 'twelvetaxable',
        width: 20
      });
      filteredColumns.push({
        header: 'GST 6% - SGST',
        key: 'twelvesgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 6% - CGST',
        key: 'twelvecgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 12% - IGST',
        key: 'twelveigst',
        width: 15
      });
    }

    if (auditSettings.taxApplicability.includes(18)) {
      filteredColumns.push({
        header: 'GST 18% - TAXABLE',
        key: 'eighteentaxable',
        width: 20
      });
      filteredColumns.push({
        header: 'GST 9% - SGST',
        key: 'eighteensgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 9% - CGST',
        key: 'eighteencgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 18% - IGST',
        key: 'eighteenigst',
        width: 15
      });
    }

    if (auditSettings.taxApplicability.includes(28)) {
      filteredColumns.push({
        header: 'GST 28% - TAXABLE',
        key: 'twentyeighttaxable',
        width: 20
      });
      filteredColumns.push({
        header: 'GST 14% - SGST',
        key: 'twentyeightsgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 14% - CGST',
        key: 'twentyeightcgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 28% - IGST',
        key: 'twentyeightigst',
        width: 15
      });
    }
  }

  filteredColumns.push({ header: 'ROUND OFF', key: 'roundOff', width: 15 });
  filteredColumns.push({ header: 'CASH', key: 'cash', width: 15 });
  filteredColumns.push({
    header: 'CREDIT NOTE',
    key: 'creditNote',
    width: 15
  });
  filteredColumns.push({ header: 'UPI', key: 'upi', width: 15 });
  filteredColumns.push({ header: 'CARD', key: 'card', width: 15 });
  filteredColumns.push({ header: 'NEFT/RTGS', key: 'neft', width: 15 });
  filteredColumns.push({ header: 'CHEQUE', key: 'cheque', width: 15 });
  filteredColumns.push({ header: 'GIFT CARD', key: 'giftCard', width: 15 });
  filteredColumns.push({
    header: 'CUSTOM FINANCE',
    key: 'customFinance',
    width: 15
  });
  filteredColumns.push({
    header: 'EXCHANGE',
    key: 'exchange',
    width: 15
  });
  filteredColumns.push({
    header: 'BALANCE DUE',
    key: 'balanceDue',
    width: 20
  });
  filteredColumns.push({ header: 'DUE DATE', key: 'dueDate', width: 10 });
  filteredColumns.push({ header: 'IRN', key: 'irn', width: 30 });
  filteredColumns.push({ header: 'E-WAY', key: 'eway', width: 25 });

  if (String(localStorage.getItem('isJewellery')).toLowerCase() === 'true') {
    filteredColumns.push({
      header: 'GROSS WEIGHT',
      key: 'grossWeight',
      width: 20
    });

    filteredColumns.push({ header: 'WASTAGE', key: 'wastage', width: 20 });

    filteredColumns.push({
      header: 'NET WEIGHT',
      key: 'netWeight',
      width: 20
    });

    filteredColumns.push({
      header: 'MAKING C.',
      key: 'makingCharge',
      width: 20
    });

    filteredColumns.push({
      header: 'MAKING C. PER GRAM',
      key: 'makingChargePerGram',
      width: 20
    });
  }

  filteredColumns.push({
    header: 'TOTAL ITEM DISC',
    key: 'totalDisc',
    width: 20
  });

  filteredColumns.push({
    header: 'TOTAL BILL DISC',
    key: 'totalBillDisc',
    width: 20
  });

  return filteredColumns;
};

export const prepareSalesReturnHeaderRow = (
  filteredColumns,
  auditSettingsExists,
  auditSettings
) => {
  filteredColumns.push({
    header: 'CRN NO',
    key: 'invoiceNumber',
    width: 15
  });
  filteredColumns.push({ header: 'DATE', key: 'date', width: 15 });
  filteredColumns.push({
    header: 'CUSTOMER NAME',
    key: 'customerName',
    width: 20
  });
  filteredColumns.push({ header: 'GSTIN/UIN', key: 'gstin', width: 20 });
  filteredColumns.push({
    header: 'POS',
    key: 'placeOfSupply',
    width: 8
  });
  filteredColumns.push({
    header: 'CREDIT NOTE VALUE',
    key: 'invoiceValue',
    width: 20
  });
  if (auditSettingsExists) {
    if (auditSettings.taxApplicability.includes(0)) {
      filteredColumns.push({
        header: 'GST % - TAXABLE',
        key: 'zerotaxable',
        width: 20
      });
      filteredColumns.push({
        header: 'GST % - SGST',
        key: 'zerosgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST % - CGST',
        key: 'zerocgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST % - IGST',
        key: 'zeroigst',
        width: 15
      });
    }

    if (auditSettings.taxApplicability.includes(3)) {
      filteredColumns.push({
        header: 'GST 3% - TAXABLE',
        key: 'threetaxable',
        width: 20
      });
      filteredColumns.push({
        header: 'GST 1.5% - SGST',
        key: 'threesgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 1.5% - CGST',
        key: 'threecgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 3% - IGST',
        key: 'threeigst',
        width: 15
      });
    }

    if (auditSettings.taxApplicability.includes(5)) {
      filteredColumns.push({
        header: 'GST 5% - TAXABLE',
        key: 'fivetaxable',
        width: 20
      });
      filteredColumns.push({
        header: 'GST 2.5% - SGST',
        key: 'fivesgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 2.5% - CGST',
        key: 'fivecgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 5% - IGST',
        key: 'fiveigst',
        width: 15
      });
    }

    if (auditSettings.taxApplicability.includes(12)) {
      filteredColumns.push({
        header: 'GST 12% - TAXABLE',
        key: 'twelvetaxable',
        width: 20
      });
      filteredColumns.push({
        header: 'GST 6% - SGST',
        key: 'twelvesgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 6% - CGST',
        key: 'twelvecgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 12% - IGST',
        key: 'twelveigst',
        width: 15
      });
    }

    if (auditSettings.taxApplicability.includes(18)) {
      filteredColumns.push({
        header: 'GST 18% - TAXABLE',
        key: 'eighteentaxable',
        width: 20
      });
      filteredColumns.push({
        header: 'GST 9% - SGST',
        key: 'eighteensgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 9% - CGST',
        key: 'eighteencgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 18% - IGST',
        key: 'eighteenigst',
        width: 15
      });
    }

    if (auditSettings.taxApplicability.includes(28)) {
      filteredColumns.push({
        header: 'GST 28% - TAXABLE',
        key: 'twentyeighttaxable',
        width: 20
      });
      filteredColumns.push({
        header: 'GST 14% - SGST',
        key: 'twentyeightsgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 14% - CGST',
        key: 'twentyeightcgst',
        width: 15
      });
      filteredColumns.push({
        header: 'GST 28% - IGST',
        key: 'twentyeightigst',
        width: 15
      });
    }
  }

  filteredColumns.push({ header: 'SALE INV NO', key: 'saleInvNo', width: 15 });
  filteredColumns.push({
    header: 'SALE INV DATE',
    key: 'saleInvDate',
    width: 15
  });
  filteredColumns.push({
    header: 'SALE INV VALUE',
    key: 'saleInvValue',
    width: 20
  });
  filteredColumns.push({ header: 'ROUND OFF', key: 'roundOff', width: 15 });
  filteredColumns.push({ header: 'CASH', key: 'cash', width: 15 });
  filteredColumns.push({
    header: 'SALE ADJUST',
    key: 'saleAdjust',
    width: 15
  });
  filteredColumns.push({ header: 'UPI', key: 'upi', width: 15 });
  filteredColumns.push({ header: 'CARD', key: 'card', width: 15 });
  filteredColumns.push({ header: 'NEFT/RTGS', key: 'neft', width: 15 });
  filteredColumns.push({ header: 'CHEQUE', key: 'cheque', width: 15 });
  filteredColumns.push({ header: 'GIFT CARD', key: 'giftCard', width: 15 });
  filteredColumns.push({
    header: 'CUSTOM FINANCE',
    key: 'customFinance',
    width: 15
  });
  filteredColumns.push({
    header: 'BALANCE DUE',
    key: 'balanceDue',
    width: 20
  });
  filteredColumns.push({ header: 'DUE DATE', key: 'dueDate', width: 10 });
  filteredColumns.push({ header: 'IRN', key: 'irn', width: 30 });
  filteredColumns.push({ header: 'E-WAY', key: 'eway', width: 25 });

  if (String(localStorage.getItem('isJewellery')).toLowerCase() === 'true') {
    filteredColumns.push({
      header: 'GROSS WEIGHT',
      key: 'grossWeight',
      width: 20
    });

    filteredColumns.push({ header: 'WASTAGE', key: 'wastage', width: 20 });

    filteredColumns.push({
      header: 'NET WEIGHT',
      key: 'netWeight',
      width: 20
    });

    filteredColumns.push({
      header: 'MAKING C.',
      key: 'makingCharge',
      width: 20
    });

    filteredColumns.push({
      header: 'MAKING C. PER GRAM',
      key: 'makingChargePerGram',
      width: 20
    });
  }

  filteredColumns.push({
    header: 'TOTAL ITEM DISC',
    key: 'totalDisc',
    width: 20
  });

  filteredColumns.push({
    header: 'TOTAL BILL DISC',
    key: 'totalBillDisc',
    width: 20
  });

  return filteredColumns;
};

export const prepareErrorHeaderRow = (filteredColumns) => {
  filteredColumns.push({
    header: 'INVOICE NO',
    key: 'invoiceNumber',
    width: 15
  });
  filteredColumns.push({ header: 'TYPE', key: 'date', width: 15 });
  filteredColumns.push({
    header: 'CUSTOMER NAME',
    key: 'customerName',
    width: 20
  });
  filteredColumns.push({ header: 'ERROR DETAILS', key: 'gstin', width: 40 });
};

export const prepareInvoiceCheckHeaderRow = (filteredColumns) => {
  filteredColumns.push({
    header: 'SYS SEQ NUM',
    key: 'seqNum',
    width: 15
  });
  filteredColumns.push({
    header: 'SEQ NUM SERIES',
    key: 'seqNumSeries',
    width: 20
  });
  filteredColumns.push({ header: '', key: 'finalDiff', width: 40 });
};

export const prepareHSNHeaderRow = (filteredColumns) => {
  filteredColumns.push({
    header: 'HSN CODE',
    key: 'hsnCode',
    width: 15
  });
  filteredColumns.push({ header: 'QTY', key: 'qty', width: 10 });
  filteredColumns.push({
    header: 'UNIT',
    key: 'unit',
    width: 10
  });
  filteredColumns.push({ header: 'TAX RATE', key: 'taxRate', width: 15 });
  filteredColumns.push({
    header: 'TAXABLE AMT',
    key: 'taxableAmt',
    width: 20
  });
  filteredColumns.push({
    header: 'CAMT',
    key: 'camt',
    width: 15
  });
  filteredColumns.push({
    header: 'SAMT',
    key: 'samt',
    width: 15
  });
  filteredColumns.push({
    header: 'IAMT',
    key: 'iamt',
    width: 15
  });
};

export const prepareDOCSummaryHeaderRow = (filteredColumns) => {
  filteredColumns.push({
    header: 'FIRST SL. NO',
    key: 'firstSlNo',
    width: 20
  });
  filteredColumns.push({ header: 'LAST SL. NO', key: 'lastSlNo', width: 20 });
  filteredColumns.push({
    header: 'TOTAL',
    key: 'total',
    width: 15
  });
  filteredColumns.push({ header: 'CANCELLED', key: 'cancelled', width: 15 });
  filteredColumns.push({
    header: 'NET ISSUE',
    key: 'netIssue',
    width: 15
  });
  filteredColumns.push({
    header: 'MISSING NOS',
    key: 'missingNos',
    width: 40
  });
};


export const prepare2AB2BHeaderRow = (filteredColumns) => {
  filteredColumns.push({
    header: 'GSTIN of supplier',
    key: 'ctin',
    width: 20
  });
  filteredColumns.push({ header: 'Trade/Legal name of the Supplier', key: 'supplierName', width: 20 });
  filteredColumns.push({
    header: 'Invoice number',
    key: 'inum',
    width: 15
  });
  filteredColumns.push({
    header: 'Invoice type',
    key: 'inv_typ',
    width: 15
  });
  filteredColumns.push({
    header: 'Invoice Date',
    key: 'idt',
    width: 15
  });
  filteredColumns.push({
    header: 'Invoice Value (₹)',
    key: 'val',
    width: 15
  });
  filteredColumns.push({ header: 'Place of supply', key: 'pos', width: 15 });
  filteredColumns.push({ header: 'Supply Attract Reverse Charge', key: 'rchrg', width: 15 });
  filteredColumns.push({ header: 'Rate (%)', key: 'rt', width: 15 });
  filteredColumns.push({ header: 'Taxable Value (₹)', key: 'txval', width: 15 });
  filteredColumns.push({ header: 'Integrated Tax  (₹)', key: 'iamt', width: 15 });
  filteredColumns.push({ header: 'Central Tax (₹)', key: 'camt', width: 15 });
  filteredColumns.push({ header: 'State/UT tax (₹)', key: 'samt', width: 15 });
  filteredColumns.push({ header: 'Cess  (₹)', key: 'csamt', width: 15 });
  filteredColumns.push({ header: 'GSTR-1/5 Filing Status', key: 'cfs', width: 15 });
  filteredColumns.push({ header: 'GSTR-1/5 Filing Date', key: 'fldtr1', width: 15 });
  filteredColumns.push({ header: 'GSTR-1/5 Filing Period', key: 'flprdr1', width: 15 });
  filteredColumns.push({ header: 'GSTR-3B Filing Status', key: 'cfs3b', width: 15 });
  filteredColumns.push({ header: 'Amendment made, if any', key: 'amd', width: 15 });
  filteredColumns.push({ header: 'Tax Period in which Amended', key: 'amdTp', width: 15 });
  filteredColumns.push({ header: 'Effective date of cancellation', key: 'effDate', width: 15 });
  filteredColumns.push({ header: 'Source', key: 'source', width: 15 });
  filteredColumns.push({ header: 'IRN', key: 'irn', width: 15 });
  filteredColumns.push({ header: 'IRN date', key: 'irndate', width: 15 });
};


export const prepare2AB2BAHeaderRow = (filteredColumns) => {
  filteredColumns.push({ header: 'Invoice number', key: 'inumUp', width: 20 });
  filteredColumns.push({ header: 'Invoice Date', key: 'idtUp', width: 20 });
  filteredColumns.push({ header: 'GSTIN of supplier', key: 'ctin', width: 20 });
  filteredColumns.push({ header: 'Trade/Legal name of the Supplier', key: 'supplierName', width: 20 });
  filteredColumns.push({ header: 'Invoice type', key: 'inv_typ', width: 15 });
  filteredColumns.push({ header: 'Invoice number', key: 'inum', width: 15 });
  filteredColumns.push({ header: 'Invoice Date', key: 'idt', width: 15 });
  filteredColumns.push({ header: 'Invoice Value (₹)', key: 'val', width: 15 });
  filteredColumns.push({ header: 'Place of supply', key: 'pos', width: 15 });
  filteredColumns.push({ header: 'Supply Attract Reverse Charge', key: 'rchrg', width: 15 });
  filteredColumns.push({ header: 'Rate (%)', key: 'rt', width: 15 });
  filteredColumns.push({ header: 'Taxable Value (₹)', key: 'txval', width: 15 });
  filteredColumns.push({ header: 'Integrated Tax  (₹)', key: 'iamt', width: 15 });
  filteredColumns.push({ header: 'Central Tax (₹)', key: 'camt', width: 15 });
  filteredColumns.push({ header: 'State/UT tax (₹)', key: 'samt', width: 15 });
  filteredColumns.push({ header: 'Cess  (₹)', key: 'csamt', width: 15 });
  filteredColumns.push({ header: 'GSTR-1/5 Filing Status', key: 'cfs', width: 15 });
  filteredColumns.push({ header: 'GSTR-1/5 Filing Date', key: 'fldtr1', width: 15 });
  filteredColumns.push({ header: 'GSTR-1/5 Filing Period', key: 'flprdr1', width: 15 });
  filteredColumns.push({ header: 'GSTR-3B Filing Status', key: 'cfs3b', width: 15 });
  filteredColumns.push({ header: 'Effective date of cancellation', key: 'edc', width: 15 });
  filteredColumns.push({ header: 'Amendment made, if any', key: 'amd', width: 15 });
  filteredColumns.push({ header: 'Original tax period in which reported ', key: 'amdTp', width: 15 });
};
export const prepare2ACDNRHeaderRow = (filteredColumns) => {
  filteredColumns.push({ header: 'GSTIN of supplier', key: 'ctin', width: 20 });
  filteredColumns.push({ header: 'Trade/Legal name of the Supplier', key: 'supplierName', width: 20 });
  filteredColumns.push({ header: 'Note type', key: 'ntty', width: 20 });
  filteredColumns.push({ header: 'Note number', key: 'nt_num', width: 15 });
  filteredColumns.push({ header: 'Note Supply type ', key: 'ntsty', width: 15 });
  filteredColumns.push({ header: 'Note date', key: 'nt_dt', width: 15 });
  filteredColumns.push({ header: 'Note Value (₹)', key: 'val', width: 15 });
  filteredColumns.push({ header: 'Place of supply', key: 'pos', width: 15 });
  filteredColumns.push({ header: 'Supply Attract Reverse Charge', key: 'rchrg', width: 15 });
  filteredColumns.push({ header: 'Rate (%)', key: 'rt', width: 15 });
  filteredColumns.push({ header: 'Taxable Value (₹)', key: 'txval', width: 15 });
  filteredColumns.push({ header: 'Integrated Tax  (₹)', key: 'iamt', width: 15 });
  filteredColumns.push({ header: 'Central Tax (₹)', key: 'camt', width: 15 });
  filteredColumns.push({ header: 'State/UT tax (₹)', key: 'samt', width: 15 });
  filteredColumns.push({ header: 'Cess  (₹)', key: 'csamt', width: 15 });
  filteredColumns.push({ header: 'GSTR-1/5 Filing Status', key: 'cfs', width: 15 });
  filteredColumns.push({ header: 'GSTR-1/5 Filing Date', key: 'fldtr1', width: 15 });
  filteredColumns.push({ header: 'GSTR-1/5 Filing Period', key: 'flprdr1', width: 15 });
  filteredColumns.push({ header: 'GSTR-3B Filing Status', key: 'cfs3b', width: 15 });
  filteredColumns.push({ header: 'Amendment made, if any', key: 'amd', width: 15 });
  filteredColumns.push({ header: 'Tax Period in which Amended', key: 'amdTp', width: 15 });
  filteredColumns.push({ header: 'Effective date of cancellation', key: 'edc', width: 15 });
  filteredColumns.push({ header: 'Source', key: 'source', width: 15 });
  filteredColumns.push({ header: 'IRN', key: 'irn', width: 15 });
  filteredColumns.push({ header: 'IRN date', key: 'irndate', width: 15 });
};
export const prepare2ACDNRAHeaderRow = (filteredColumns) => {
  filteredColumns.push({ header: 'Note type', key: 'nttyUp', width: 20 });
  filteredColumns.push({ header: 'Note Number', key: 'nt_numUp', width: 20 });
  filteredColumns.push({ header: 'Note date', key: 'nt_dtUp', width: 20 });
  filteredColumns.push({ header: 'GSTIN of supplier', key: 'ctin', width: 20 });
  filteredColumns.push({ header: 'Trade/Legal name of the Supplier', key: 'supplierName', width: 20 });
  filteredColumns.push({ header: 'Note type', key: 'ntty', width: 20 });
  filteredColumns.push({ header: 'Note number', key: 'nt_num', width: 15 });
  filteredColumns.push({ header: 'Note Supply type ', key: 'ntsty', width: 15 });
  filteredColumns.push({ header: 'Note date', key: 'nt_dt', width: 15 });
  filteredColumns.push({ header: 'Note Value (₹)', key: 'val', width: 15 });
  filteredColumns.push({ header: 'Place of supply', key: 'pos', width: 15 });
  filteredColumns.push({ header: 'Supply Attract Reverse Charge', key: 'rchrg', width: 15 });
  filteredColumns.push({ header: 'Rate (%)', key: 'rt', width: 15 });
  filteredColumns.push({ header: 'Taxable Value (₹)', key: 'txval', width: 15 });
  filteredColumns.push({ header: 'Integrated Tax  (₹)', key: 'iamt', width: 15 });
  filteredColumns.push({ header: 'Central Tax (₹)', key: 'camt', width: 15 });
  filteredColumns.push({ header: 'State/UT tax (₹)', key: 'samt', width: 15 });
  filteredColumns.push({ header: 'Cess  (₹)', key: 'csamt', width: 15 });
  filteredColumns.push({ header: 'GSTR-1/5 Filing Status', key: 'cfs', width: 15 });
  filteredColumns.push({ header: 'GSTR-1/5 Filing Date', key: 'fldtr1', width: 15 });
  filteredColumns.push({ header: 'GSTR-1/5 Filing Period', key: 'flprdr1', width: 15 });
  filteredColumns.push({ header: 'GSTR-3B Filing Status', key: 'cfs3b', width: 15 });
  filteredColumns.push({ header: 'Amendment made, if any', key: 'amd', width: 15 });
  filteredColumns.push({ header: 'Tax Period in which reported earlier', key: 'amdTp', width: 15 });
  filteredColumns.push({ header: 'Effective date of cancellation', key: 'edc', width: 15 });
};
export const prepare2AISDHeaderRow = (filteredColumns) => {
  filteredColumns.push({ header: 'Eligibility of ITC', key: 'itc_elg', width: 20 });
  filteredColumns.push({ header: 'GSTIN of ISD', key: 'ctin', width: 20 });
  filteredColumns.push({ header: 'Trade/Legal name of the ISD', key: 'trade', width: 20 });
  filteredColumns.push({ header: 'ISD Document type', key: 'isd_docty', width: 20 });
  filteredColumns.push({ header: 'ISD Invoice number', key: 'nttyUp', width: 20 });
  filteredColumns.push({ header: 'ISD Invoice date', key: 'nttyUp', width: 20 });
  filteredColumns.push({ header: 'ISD credit note number', key: 'nttyUp', width: 20 });
  filteredColumns.push({ header: 'ISD credit note date', key: 'nttyUp', width: 20 });
  filteredColumns.push({ header: 'Original Invoice Number', key: 'nttyUp', width: 20 });
  filteredColumns.push({ header: 'Original invoice date', key: 'nttyUp', width: 20 });
  filteredColumns.push({ header: 'Integrated Tax (₹)', key: 'iamt', width: 20 });
  filteredColumns.push({ header: 'Central Tax (₹)', key: 'camt', width: 20 });
  filteredColumns.push({ header: 'State/UT Tax (₹)', key: 'samt', width: 20 });
  filteredColumns.push({ header: 'Cess (₹)', key: 'cess', width: 20 });
  filteredColumns.push({ header: 'ISD GSTR-6 Filing status', key: 'nttyUp', width: 20 });
  filteredColumns.push({ header: 'Amendment made, if any', key: 'nttyUp', width: 20 });
  filteredColumns.push({ header: 'Tax Period in which Amended', key: 'nttyUp', width: 20 });
};
export const prepare2AIMPGHeaderRow = (filteredColumns) => {
  filteredColumns.push({ header: 'Reference date (ICEGATE)', key: 'refdt', width: 20 });
  filteredColumns.push({ header: 'Port code', key: 'portcd', width: 20 });
  filteredColumns.push({ header: 'Number', key: 'benum', width: 20 });
  filteredColumns.push({ header: 'Date', key: 'bedt', width: 20 });
  filteredColumns.push({ header: 'Taxable value (₹)', key: 'txval', width: 20 });
  filteredColumns.push({ header: 'Integrated tax (₹)', key: 'iamt', width: 20 });
  filteredColumns.push({ header: 'Cess  (₹)', key: 'csamt', width: 20 });
  filteredColumns.push({ header: 'Amended (Yes)', key: 'amd', width: 20 });
};
export const prepare2AIMPGSEZHeaderRow = (filteredColumns) => {
  filteredColumns.push({ header: 'GSTIN of supplier', key: 'sgstin', width: 20 });
  filteredColumns.push({ header: 'Trade/Legal name', key: 'tdname', width: 20 });
  filteredColumns.push({ header: 'Reference date (ICEGATE)', key: 'refdt', width: 20 });
  filteredColumns.push({ header: 'Port code', key: 'portcd', width: 20 });
  filteredColumns.push({ header: 'Number', key: 'benum', width: 20 });
  filteredColumns.push({ header: 'Date', key: 'bedt', width: 20 });
  filteredColumns.push({ header: 'Taxable value (₹)', key: 'txval', width: 20 });
  filteredColumns.push({ header: 'Integrated tax (₹)', key: 'iamt', width: 20 });
  filteredColumns.push({ header: 'Cess  (₹)', key: 'csamt', width: 20 });
  filteredColumns.push({ header: 'Amended (Yes)', key: 'amd', width: 20 });
};
export const prepare2BITCAVAILABLEHeaderRow = (filteredColumns) => {
  filteredColumns.push({ header: 'S.no', key: 'slno', width: 20 });
  filteredColumns.push({ header: 'Heading', key: 'heading', width: 20 });
  filteredColumns.push({ header: 'GSTR-3B table', key: 'table', width: 20 });
  filteredColumns.push({ header: 'Integrated tax (₹)', key: 'iamt', width: 20 });
  filteredColumns.push({ header: 'Central Tax (₹)', key: 'camt', width: 20 });
  filteredColumns.push({ header: 'State/UT Tax (₹)', key: 'samt', width: 20 });
  filteredColumns.push({ header: 'Cess  (₹)', key: 'cess', width: 20 });
  filteredColumns.push({ header: 'Advisory', key: 'advisory', width: 20 });
};



export const prepare2BB2BAHeaderRow = (filteredColumns) => {
  filteredColumns.push({ header: 'Invoice number', key: 'inumUp', width: 20 });
  filteredColumns.push({ header: 'Invoice Date', key: 'idtUp', width: 20 });
  filteredColumns.push({ header: 'GSTIN of supplier', key: 'ctin', width: 20 });
  filteredColumns.push({ header: 'Trade/Legal name of the Supplier', key: 'supplierName', width: 20 });
  filteredColumns.push({ header: 'Invoice type', key: 'inv_typ', width: 15 });
  filteredColumns.push({ header: 'Invoice number', key: 'inum', width: 15 });
  filteredColumns.push({ header: 'Invoice Date', key: 'idt', width: 15 });
  filteredColumns.push({ header: 'Invoice Value (₹)', key: 'val', width: 15 });
  filteredColumns.push({ header: 'Place of supply', key: 'pos', width: 15 });
  filteredColumns.push({ header: 'Supply Attract Reverse Charge', key: 'rchrg', width: 15 });
  filteredColumns.push({ header: 'Rate (%)', key: 'rt', width: 15 });
  filteredColumns.push({ header: 'Taxable Value (₹)', key: 'txval', width: 15 });
  filteredColumns.push({ header: 'Integrated Tax  (₹)', key: 'iamt', width: 15 });
  filteredColumns.push({ header: 'Central Tax (₹)', key: 'camt', width: 15 });
  filteredColumns.push({ header: 'State/UT tax (₹)', key: 'samt', width: 15 });
  filteredColumns.push({ header: 'Cess  (₹)', key: 'csamt', width: 15 });
  filteredColumns.push({ header: 'GSTR-1/IFF/GSTR-5 Period', key: 'fldtr1', width: 15 });
  filteredColumns.push({ header: 'GSTR-1/IFF/GSTR-5 Filing Date', key: 'flprdr1', width: 15 });
  filteredColumns.push({ header: 'GSTR-3B Filing Status', key: 'cfs3b', width: 15 });
  filteredColumns.push({ header: 'ITC Availability', key: 'itcavail', width: 15 });
  filteredColumns.push({ header: 'Reason', key: 'reason', width: 15 });
  filteredColumns.push({ header: 'Applicable % of Tax Rate', key: 'applitaxRate', width: 15 });
};

export const prepare2BCDNRHeaderRow = (filteredColumns) => {
  filteredColumns.push({ header: 'GSTIN of supplier', key: 'ctin', width: 20 });
  filteredColumns.push({ header: 'Trade/Legal name of the Supplier', key: 'supplierName', width: 20 });
  filteredColumns.push({ header: 'Note type', key: 'ntty', width: 20 });
  filteredColumns.push({ header: 'Note number', key: 'nt_num', width: 15 });
  filteredColumns.push({ header: 'Note Supply type ', key: 'ntsty', width: 15 });
  filteredColumns.push({ header: 'Note date', key: 'nt_dt', width: 15 });
  filteredColumns.push({ header: 'Note Value (₹)', key: 'val', width: 15 });
  filteredColumns.push({ header: 'Place of supply', key: 'pos', width: 15 });
  filteredColumns.push({ header: 'Supply Attract Reverse Charge', key: 'rchrg', width: 15 });
  filteredColumns.push({ header: 'Rate (%)', key: 'rt', width: 15 });
  filteredColumns.push({ header: 'Taxable Value (₹)', key: 'txval', width: 15 });
  filteredColumns.push({ header: 'Integrated Tax  (₹)', key: 'iamt', width: 15 });
  filteredColumns.push({ header: 'Central Tax (₹)', key: 'camt', width: 15 });
  filteredColumns.push({ header: 'State/UT tax (₹)', key: 'samt', width: 15 });
  filteredColumns.push({ header: 'Cess  (₹)', key: 'csamt', width: 15 });
  filteredColumns.push({ header: 'GSTR-1/5 Filing Date', key: 'fldtr1', width: 15 });
  filteredColumns.push({ header: 'GSTR-1/5 Filing Period', key: 'flprdr1', width: 15 });
  filteredColumns.push({ header: 'ITC Availability', key: 'itcavail', width: 15 });
  filteredColumns.push({ header: 'Reason', key: 'reason', width: 15 });
  filteredColumns.push({ header: 'Applicable % of Tax Rate', key: 'applitaxRate', width: 15 });
  filteredColumns.push({ header: 'Source', key: 'source', width: 15 });
  filteredColumns.push({ header: 'IRN', key: 'irn', width: 15 });
  filteredColumns.push({ header: 'IRN date', key: 'irndate', width: 15 });
};

export const prepare2BCDNRAHeaderRow = (filteredColumns) => {
  filteredColumns.push({ header: 'Note type', key: 'nttyUp', width: 20 });
  filteredColumns.push({ header: 'Note Number', key: 'nt_numUp', width: 20 });
  filteredColumns.push({ header: 'Note date', key: 'nt_dtUp', width: 20 });
  filteredColumns.push({ header: 'GSTIN of supplier', key: 'ctin', width: 20 });
  filteredColumns.push({ header: 'Trade/Legal name of the Supplier', key: 'supplierName', width: 20 });
  filteredColumns.push({ header: 'Note number', key: 'nt_num', width: 15 });
  filteredColumns.push({ header: 'Note type', key: 'ntty', width: 20 });
  filteredColumns.push({ header: 'Note Supply type ', key: 'ntsty', width: 15 });
  filteredColumns.push({ header: 'Note date', key: 'nt_dt', width: 15 });
  filteredColumns.push({ header: 'Note Value (₹)', key: 'val', width: 15 });
  filteredColumns.push({ header: 'Place of supply', key: 'pos', width: 15 });
  filteredColumns.push({ header: 'Supply Attract Reverse Charge', key: 'rchrg', width: 15 });
  filteredColumns.push({ header: 'Rate (%)', key: 'rt', width: 15 });
  filteredColumns.push({ header: 'Taxable Value (₹)', key: 'txval', width: 15 });
  filteredColumns.push({ header: 'Integrated Tax  (₹)', key: 'iamt', width: 15 });
  filteredColumns.push({ header: 'Central Tax (₹)', key: 'camt', width: 15 });
  filteredColumns.push({ header: 'State/UT tax (₹)', key: 'samt', width: 15 });
  filteredColumns.push({ header: 'Cess  (₹)', key: 'csamt', width: 15 });
  filteredColumns.push({ header: 'GSTR-1/5 Filing Date', key: 'fldtr1', width: 15 });
  filteredColumns.push({ header: 'GSTR-1/5 Filing Period', key: 'flprdr1', width: 15 });
  filteredColumns.push({ header: 'ITC Availability', key: 'itcavail', width: 15 });
  filteredColumns.push({ header: 'Reason', key: 'reason', width: 15 });
  filteredColumns.push({ header: 'Applicable % of Tax Rate', key: 'applitaxRate', width: 15 });
};

export const prepare2BISDHeaderRow = (filteredColumns) => {
  filteredColumns.push({ header: 'GSTIN of ISD', key: 'ctin', width: 20 });
  filteredColumns.push({ header: 'Trade/Legal name', key: 'trade', width: 20 });
  filteredColumns.push({ header: 'ISD Document type', key: 'isd_docty', width: 20 });
  filteredColumns.push({ header: 'ISD Document number', key: 'isd_docno', width: 20 });
  filteredColumns.push({ header: 'ISD Document date', key: 'isd_docdate', width: 20 });
  filteredColumns.push({ header: 'Original Invoice Number', key: 'invno', width: 20 });
  filteredColumns.push({ header: 'Original invoice date', key: 'invdt', width: 20 });
  filteredColumns.push({ header: 'Integrated Tax (₹)', key: 'iamt', width: 20 });
  filteredColumns.push({ header: 'Central Tax (₹)', key: 'camt', width: 20 });
  filteredColumns.push({ header: 'State/UT Tax (₹)', key: 'samt', width: 20 });
  filteredColumns.push({ header: 'Cess (₹)', key: 'cess', width: 20 });
  filteredColumns.push({ header: 'ISD GSTR-6 Period', key: 'isd6pd', width: 20 });
  filteredColumns.push({ header: 'ISD GSTR-6 Filing Date', key: 'isd6dt', width: 20 });
  filteredColumns.push({ header: 'Eligibility of ITC', key: 'eligitc', width: 20 });
};
export const prepare2BISDAHeaderRow = (filteredColumns) => {
  filteredColumns.push({ header: 'ISD Document type', key: 'isd_docty1', width: 20 });
  filteredColumns.push({ header: 'Document number', key: 'isd_docno1', width: 20 });
  filteredColumns.push({ header: 'Document date', key: 'isd_docdate1', width: 20 });
  filteredColumns.push({ header: 'GSTIN of ISD', key: 'ctin', width: 20 });
  filteredColumns.push({ header: 'Trade/Legal name', key: 'trade', width: 20 });
  filteredColumns.push({ header: 'ISD Document type', key: 'isd_docty', width: 20 });
  filteredColumns.push({ header: 'ISD Document number', key: 'isd_docno', width: 20 });
  filteredColumns.push({ header: 'ISD Document date', key: 'isd_docdate', width: 20 });
  filteredColumns.push({ header: 'Original Invoice Number', key: 'invno', width: 20 });
  filteredColumns.push({ header: 'Original invoice date', key: 'invdt', width: 20 });
  filteredColumns.push({ header: 'Integrated Tax (₹)', key: 'iamt', width: 20 });
  filteredColumns.push({ header: 'Central Tax (₹)', key: 'camt', width: 20 });
  filteredColumns.push({ header: 'State/UT Tax (₹)', key: 'samt', width: 20 });
  filteredColumns.push({ header: 'Cess (₹)', key: 'cess', width: 20 });
  filteredColumns.push({ header: 'ISD GSTR-6 Period', key: 'isd6pd', width: 20 });
  filteredColumns.push({ header: 'ISD GSTR-6 Filing Date', key: 'isd6dt', width: 20 });
  filteredColumns.push({ header: 'Eligibility of ITC', key: 'eligitc', width: 20 });
};

export const prepare2BIMPGHeaderRow = (filteredColumns) => {
  filteredColumns.push({ header: 'Icegate Reference Date', key: 'refdt', width: 20 });
  filteredColumns.push({ header: 'Port code', key: 'portcd', width: 20 });
  filteredColumns.push({ header: 'Number', key: 'benum', width: 20 });
  filteredColumns.push({ header: 'Date', key: 'bedt', width: 20 });
  filteredColumns.push({ header: 'Taxable value (₹)', key: 'txval', width: 20 });
  filteredColumns.push({ header: 'Integrated tax (₹)', key: 'iamt', width: 20 });
  filteredColumns.push({ header: 'Cess  (₹)', key: 'csamt', width: 20 });
  filteredColumns.push({ header: 'Amended (Yes)', key: 'amd', width: 20 });
};
export const prepare2BIMPGSEZHeaderRow = (filteredColumns) => {
  filteredColumns.push({ header: 'GSTIN of supplier', key: 'sgstin', width: 20 });
  filteredColumns.push({ header: 'Trade/Legal name', key: 'tdname', width: 20 });
  filteredColumns.push({ header: 'Icegate Reference Date', key: 'refdt', width: 20 });
  filteredColumns.push({ header: 'Port code', key: 'portcd', width: 20 });
  filteredColumns.push({ header: 'Number', key: 'benum', width: 20 });
  filteredColumns.push({ header: 'Date', key: 'bedt', width: 20 });
  filteredColumns.push({ header: 'Taxable value (₹)', key: 'txval', width: 20 });
  filteredColumns.push({ header: 'Integrated tax (₹)', key: 'iamt', width: 20 });
  filteredColumns.push({ header: 'Cess  (₹)', key: 'csamt', width: 20 });
  filteredColumns.push({ header: 'Amended (Yes)', key: 'amd', width: 20 });
};

export const prepare2BSheet1 = async (workbook, xlsxData, sheetName, headerRowFunction, mergeRange) => {
  const worksheet = workbook.addWorksheet(sheetName);
  const wrapTextStyle = {
    alignment: { wrapText: true }
  };
  const ROW_HEIGHT = 25;
  const addRow = (row, style = {}) => {
    // const row = worksheet.addRow(values);
    // row.height = ROW_HEIGHT;
    // row.eachCell((cell) => {
    //     cell.style = { ...cell.style, ...style, ...wrapTextStyle };
    // });

    worksheet.addRow(row).eachCell((cell) => {
      cell.style = style;
    });
  };

  const filteredColumns = [];
  await headerRowFunction(filteredColumns);
  worksheet.columns = filteredColumns;

  const headerValues = getITCHeaderValues(sheetName);

  const firstRow = worksheet.getRow(1);
  firstRow.values = new Array(headerValues.length).fill('');
  mergeCells(worksheet, mergeRange[0], 'FORM SUMMARY - ITC Available');
  formatRows(firstRow, 'FF0070C0');

  const secondRow = worksheet.getRow(3);
  secondRow.values = new Array(headerValues.length).fill('');
  mergeCells(worksheet, mergeRange[1], 'Credit which may be availed under FORM GSTR-3B');
  formatRows(secondRow, 'FFC65911');

  const headerRow = worksheet.getRow();
  worksheet.getRow(2).values = headerValues;
  formatRows(headerRow, 'FF002060');

  const fourthRow = worksheet.getRow(4);
  fourthRow.values = ['Part-A', ...new Array(headerValues.length - 1).fill('')];
  mergeCells(worksheet, mergeRange[2], 'ITC Available - Credit may be claimed in relevant headings in GSTR-3B');
  formatRows(fourthRow, 'FFF4B084');

  addRow(['', 'All other ITC - Supplies from registered persons other than reverse charge', '4(A)(5)', xlsxData?.nonrevsup?.igst, xlsxData?.nonrevsup?.cgst, xlsxData?.nonrevsup?.sgst, xlsxData?.nonrevsup?.cess, 'Net input tax credit may be availed under Table 4(A)(5) of FORM GSTR-3B.']);

  addRow(['', 'B2B - Invoices', '', xlsxData?.nonrevsup?.b2b?.igst, xlsxData?.nonrevsup?.b2b?.cgst, xlsxData?.nonrevsup?.b2b?.sgst, xlsxData?.nonrevsup?.b2b?.cess, '']);

  addRow(['', 'B2B - Debit notes', '', xlsxData?.nonrevsup?.b2ba?.igst, xlsxData?.nonrevsup?.b2ba?.cgst, xlsxData?.nonrevsup?.b2ba?.sgst, xlsxData?.nonrevsup?.b2ba?.cess, '']);

  addRow(['', 'ECO - Documents', '', 0, 0, 0, 0, '']);

  addRow(['', 'B2B - Invoices (Amendment)', '', xlsxData?.nonrevsup?.cdnr?.igst, xlsxData?.nonrevsup?.cdnr?.cgst, xlsxData?.nonrevsup?.cdnr?.sgst, xlsxData?.nonrevsup?.cdnr?.cess, '']);

  addRow(['', 'B2B - Debit notes (Amendment)', '', xlsxData?.nonrevsup?.cdnra?.igst, xlsxData?.nonrevsup?.cdnra?.cgst, xlsxData?.nonrevsup?.cdnra?.sgst, xlsxData?.nonrevsup?.cdnra?.cess, '']);

  addRow(['', 'Inward Supplies from ISD', '4(A)(4)', xlsxData?.isdsup?.igst, xlsxData?.isdsup?.cgst, xlsxData?.isdsup?.sgst, xlsxData?.isdsup?.cess, 'Net input tax credit may be availed under Table 4(A)(4) of FORM GSTR-3B.']);

  addRow(['', 'ISD - Invoices', '', xlsxData?.isdsup?.isd?.igst, xlsxData?.isdsup?.isd?.cgst, xlsxData?.isdsup?.isd?.sgst, xlsxData?.isdsup?.isd?.cess, '']);

  addRow(['', 'ISD - Invoices (Amendment)', '', xlsxData?.isdsup?.isda?.igst, xlsxData?.isdsup?.isda?.cgst, xlsxData?.isdsup?.isda?.sgst, xlsxData?.isdsup?.isda?.cess, '']);

  addRow(['', 'Inward Supplies liable for reverse charge', '3.1(d) \n 4(A)(3)', xlsxData?.revsup?.igst, xlsxData?.revsup?.cgst, xlsxData?.revsup?.sgst, xlsxData?.revsup?.cess, 'These supplies shall be declared in Table 3.1(d) of FORM GSTR-3B for payment of tax and credit of the same shall be availed under Table 4(A)(3).']);

  addRow(['', 'B2B - Invoices', '', xlsxData?.revsup?.b2b?.igst, xlsxData?.revsup?.b2b?.cgst, xlsxData?.revsup?.b2b?.sgst, xlsxData?.revsup?.b2b?.cess, '']);

  addRow(['', 'B2B - Debit notes', '', xlsxData?.revsup?.b2ba?.igst, xlsxData?.revsup?.b2ba?.cgst, xlsxData?.revsup?.b2ba?.sgst, xlsxData?.revsup?.b2ba?.cess, '']);

  addRow(['', 'ECO - Documents', '', 0, 0, 0, 0, '']);

  addRow(['', 'B2B - Invoices (Amendment)', '', xlsxData?.revsup?.cdnr?.igst, xlsxData?.revsup?.cdnr?.cgst, xlsxData?.revsup?.cdnr?.sgst, xlsxData?.revsup?.cdnr?.cess, '']);

  addRow(['', 'B2B - Debit notes (Amendment)', '', xlsxData?.revsup?.cdnra?.igst, xlsxData?.revsup?.cdnra?.cgst, xlsxData?.revsup?.cdnra?.sgst, xlsxData?.revsup?.cdnra?.cess, '']);

  addRow(['', 'Import of Goods including supplies from SEZ', '4(A)(1)', xlsxData?.imports?.igst, xlsxData?.imports?.cgst, xlsxData?.imports?.sgst, xlsxData?.imports?.cess, 'Net input tax credit may be availed under Table 4(A)(1) of FORM GSTR-3B.']);

  addRow(['', 'IMPG - Invoices', '', xlsxData?.imports?.impg?.igst, xlsxData?.imports?.impg?.cgst, xlsxData?.imports?.impg?.sgst, xlsxData?.imports?.impg?.cess, '']);

  addRow(['', 'IMPG - Debit notes', '', xlsxData?.imports?.impga?.igst, xlsxData?.imports?.impga?.cgst, xlsxData?.imports?.impga?.sgst, xlsxData?.imports?.impga?.cess, '']);

  addRow(['', 'IMPG - SEZ Documents', '', xlsxData?.imports?.impgsez?.igst, xlsxData?.imports?.impgsez?.cgst, xlsxData?.imports?.impgsez?.sgst, xlsxData?.imports?.impgsez?.cess, '']);

  addRow(['', 'IMPG - SEZ Debit notes', '', xlsxData?.imports?.impgasez?.igst, xlsxData?.imports?.impgasez?.cgst, xlsxData?.imports?.impgasez?.sgst, xlsxData?.imports?.impgasez?.cess, '']);

  addRow(['Part-B', 'ITC Available - Credit notes should be net off against relevant ITC available headings in GSTR-3B'], { colSpan: 8, font: { bold: true } });

  addRow(['', 'Others', '4(A)', xlsxData?.othersup?.igst, xlsxData?.othersup?.cgst, xlsxData?.othersup?.sgst, xlsxData?.othersup?.cess, 'Credit Notes should be net-off against relevant ITC available tables [Table 4A(3,4,5)].']);

  addRow(['', 'B2B - Credit notes', '4(A)(5)', xlsxData?.othersup?.cdnr?.igst, xlsxData?.othersup?.cdnr?.cgst, xlsxData?.othersup?.cdnr?.sgst, xlsxData?.othersup?.cdnr?.cess, '']);

  addRow(['', 'B2B - Credit notes (Amendment)', '4(A)(5)', xlsxData?.othersup?.cdnra?.igst, xlsxData?.othersup?.cdnra?.cgst, xlsxData?.othersup?.cdnra?.sgst, xlsxData?.othersup?.cdnra?.cess, '']);
  addRow(['', 'B2B - Credit notes (Reverse charge)', '4(A)(3)', xlsxData?.othersup?.cdnrrev?.igst, xlsxData?.othersup?.cdnrrev?.cgst, xlsxData?.othersup?.cdnrrev?.sgst, xlsxData?.othersup?.cdnrrev?.cess, '']);
  addRow(['', 'B2B - Credit notes (Reverse charge)(Amendment)', '4(A)(3)', xlsxData?.othersup?.cdnrarev?.igst, xlsxData?.othersup?.cdnrarev?.cgst, xlsxData?.othersup?.cdnrarev?.sgst, xlsxData?.othersup?.cdnrarev?.cess, '']);
  addRow(['', 'ISD - Credit notes', '4(A)(3)', xlsxData?.othersup?.isd?.igst, xlsxData?.othersup?.isd?.cgst, xlsxData?.othersup?.isd?.sgst, xlsxData?.othersup?.isd?.cess, '']);
  addRow(['', 'ISD - Credit notes (Amendment)', '4(A)(4)', xlsxData?.othersup?.isda?.igst, xlsxData?.othersup?.isda?.cgst, xlsxData?.othersup?.isda?.sgst, xlsxData?.othersup?.isda?.cess, '']);
};

export const prepare2BSheet2 = async (workbook, xlsxData, sheetName, headerRowFunction, mergeRange) => {
  const worksheet = workbook.addWorksheet(sheetName);
  const wrapTextStyle = {
    alignment: { wrapText: true }
  };
  const ROW_HEIGHT = 25;
  const addRow = (row, style = {}) => {
    // const row = worksheet.addRow(values);
    // row.height = ROW_HEIGHT;
    // row.eachCell((cell) => {
    //     cell.style = { ...cell.style, ...style, ...wrapTextStyle };
    // });

    worksheet.addRow(row).eachCell((cell) => {
      cell.style = style;
    });
  };

  const filteredColumns = [];
  await headerRowFunction(filteredColumns);
  worksheet.columns = filteredColumns;

  const headerValues = getITCHeaderValues(sheetName);

  const firstRow = worksheet.getRow(1);
  firstRow.values = new Array(headerValues.length).fill('');
  mergeCells(worksheet, mergeRange[0], 'FORM SUMMARY - ITC Not Available');
  formatRows(firstRow, 'FF0070C0');

  const secondRow = worksheet.getRow(3);
  secondRow.values = new Array(headerValues.length).fill('');
  mergeCells(worksheet, mergeRange[1], 'Credit which may not be availed under FORM GSTR-3B');
  formatRows(secondRow, 'FFC65911');

  const headerRow = worksheet.getRow();
  worksheet.getRow(2).values = headerValues;
  formatRows(headerRow, 'FF002060');

  const fourthRow = worksheet.getRow(4);
  fourthRow.values = ['Part-A', ...new Array(headerValues.length - 1).fill('')];
  mergeCells(worksheet, mergeRange[2], 'ITC Not Available');
  formatRows(fourthRow, 'FFF4B084');

  addRow(['', 'All other ITC - Supplies from registered persons other than reverse charge', '4(D)(2)', xlsxData?.nonrevsup?.igst, xlsxData?.nonrevsup?.cgst, xlsxData?.nonrevsup?.sgst, xlsxData?.nonrevsup?.cess, 'Net input tax credit may be availed under Table 4(A)(5) of FORM GSTR-3B.']);

  addRow(['', 'B2B - Invoices', '', xlsxData?.nonrevsup?.b2b?.igst, xlsxData?.nonrevsup?.b2b?.cgst, xlsxData?.nonrevsup?.b2b?.sgst, xlsxData?.nonrevsup?.b2b?.cess, '']);

  addRow(['', 'B2B - Debit notes', '', xlsxData?.nonrevsup?.b2ba?.igst, xlsxData?.nonrevsup?.b2ba?.cgst, xlsxData?.nonrevsup?.b2ba?.sgst, xlsxData?.nonrevsup?.b2ba?.cess, '']);

  addRow(['', 'ECO - Documents', '', 0, 0, 0, 0, '']);

  addRow(['', 'B2B - Invoices (Amendment)', '', xlsxData?.nonrevsup?.cdnr?.igst, xlsxData?.nonrevsup?.cdnr?.cgst, xlsxData?.nonrevsup?.cdnr?.sgst, xlsxData?.nonrevsup?.cdnr?.cess, '']);

  addRow(['', 'B2B - Debit notes (Amendment)', '', xlsxData?.nonrevsup?.cdnra?.igst, xlsxData?.nonrevsup?.cdnra?.cgst, xlsxData?.nonrevsup?.cdnra?.sgst, xlsxData?.nonrevsup?.cdnra?.cess, '']);

  addRow(['', 'Inward Supplies from ISD', '4(D)(2)', xlsxData?.isdsup?.igst, xlsxData?.isdsup?.cgst, xlsxData?.isdsup?.sgst, xlsxData?.isdsup?.cess, 'Such credit shall not be taken and has to be reported in table 4(D)(2) of FORM GSTR-3B.']);

  addRow(['', 'ISD - Invoices', '', xlsxData?.isdsup?.isd?.igst, xlsxData?.isdsup?.isd?.cgst, xlsxData?.isdsup?.isd?.sgst, xlsxData?.isdsup?.isd?.cess, '']);

  addRow(['', 'ISD - Invoices (Amendment)', '', xlsxData?.isdsup?.isda?.igst, xlsxData?.isdsup?.isda?.cgst, xlsxData?.isdsup?.isda?.sgst, xlsxData?.isdsup?.isda?.cess, '']);

  addRow(['', 'Inward Supplies liable for reverse charge', '3.1(d) <br /> 4(D)(2)', xlsxData?.revsup?.igst, xlsxData?.revsup?.cgst, xlsxData?.revsup?.sgst, xlsxData?.revsup?.cess, 'These supplies shall be declared in Table 3.1(d) of FORM GSTR-3B for payment of tax.However, credit will not be available on the same and has to be reported in table 4(D)(2) of FORM GSTR-3B.']);

  addRow(['', 'B2B - Invoices', '', xlsxData?.revsup?.b2b?.igst, xlsxData?.revsup?.b2b?.cgst, xlsxData?.revsup?.b2b?.sgst, xlsxData?.revsup?.b2b?.cess, '']);

  addRow(['', 'B2B - Debit notes', '', xlsxData?.revsup?.b2ba?.igst, xlsxData?.revsup?.b2ba?.cgst, xlsxData?.revsup?.b2ba?.sgst, xlsxData?.revsup?.b2ba?.cess, '']);

  addRow(['', 'ECO - Documents', '', 0, 0, 0, 0, '']);

  addRow(['', 'B2B - Invoices (Amendment)', '', xlsxData?.revsup?.cdnr?.igst, xlsxData?.revsup?.cdnr?.cgst, xlsxData?.revsup?.cdnr?.sgst, xlsxData?.revsup?.cdnr?.cess, '']);

  addRow(['', 'B2B - Debit notes (Amendment)', '', xlsxData?.revsup?.cdnra?.igst, xlsxData?.revsup?.cdnra?.cgst, xlsxData?.revsup?.cdnra?.sgst, xlsxData?.revsup?.cdnra?.cess, '']);

  addRow(['Part-B', 'ITC Not Available - Credit notes should be net off against relevant ITC available headings in GSTR-3B'], { colSpan: 8, font: { bold: true } });

  addRow(['', 'Others', '4(A)', xlsxData?.othersup?.igst, xlsxData?.othersup?.cgst, xlsxData?.othersup?.sgst, xlsxData?.othersup?.cess, 'Credit Notes should be net-off against relevant ITC available tables [Table 4A(3,4,5)].']);

  addRow(['', 'B2B - Credit notes', '4(A)(5)', xlsxData?.othersup?.cdnr?.igst, xlsxData?.othersup?.cdnr?.cgst, xlsxData?.othersup?.cdnr?.sgst, xlsxData?.othersup?.cdnr?.cess, '']);

  addRow(['', 'B2B - Credit notes (Amendment)', '4(A)(5)', xlsxData?.othersup?.cdnra?.igst, xlsxData?.othersup?.cdnra?.cgst, xlsxData?.othersup?.cdnra?.sgst, xlsxData?.othersup?.cdnra?.cess, '']);
  addRow(['', 'B2B - Credit notes (Reverse charge)', '4(A)(3)', xlsxData?.othersup?.cdnrrev?.igst, xlsxData?.othersup?.cdnrrev?.cgst, xlsxData?.othersup?.cdnrrev?.sgst, xlsxData?.othersup?.cdnrrev?.cess, '']);
  addRow(['', 'B2B - Credit notes (Reverse charge)(Amendment)', '4(A)(3)', xlsxData?.othersup?.cdnrarev?.igst, xlsxData?.othersup?.cdnrarev?.cgst, xlsxData?.othersup?.cdnrarev?.sgst, xlsxData?.othersup?.cdnrarev?.cess, '']);
  addRow(['', 'ISD - Credit notes', '4(A)(3)', xlsxData?.othersup?.isd?.igst, xlsxData?.othersup?.isd?.cgst, xlsxData?.othersup?.isd?.sgst, xlsxData?.othersup?.isd?.cess, '']);
  addRow(['', 'ISD - Credit notes (Amendment)', '4(A)(4)', xlsxData?.othersup?.isda?.igst, xlsxData?.othersup?.isda?.cgst, xlsxData?.othersup?.isda?.sgst, xlsxData?.othersup?.isda?.cess, '']);
};

const getITCHeaderValues = (sheetName) => {
  return [
    'S.no',
    'Heading',
    'GSTR-3B table',
    'Integrated tax (₹)',
    'Central Tax (₹)',
    'State/UT Tax (₹)',
    'Cess  (₹)',
    'Advisory'
  ];
};
const getHeaderValues = (sheetName) => {
  if (sheetName === 'B2B') {
    return [
      'GSTIN of supplier',
      'Trade/Legal name of the Supplier',
      'Invoice number.',
      'Invoice type',
      'Invoice Date',
      'Invoice Value (₹)',
      'Place of supply',
      'Supply Attract Reverse Charge',
      'Rate (%)',
      'Taxable Value (₹)',
      'Integrated Tax  (₹)',
      'Central Tax (₹)',
      'State/UT tax (₹)',
      'Cess  (₹)',
      'GSTR-1/5 Filing Status',
      'GSTR-1/5 Filing Date',
      'GSTR-1/5 Filing Period',
      'GSTR-3B Filing Status',
      'Amendment made, if any',
      'Tax Period in which Amended',
      'Effective date of cancellation',
      'Source',
      'IRN',
      'IRN date'
    ];
  } else if(sheetName == 'B2BA') {
    return [
      'Invoice number',
      'Invoice Date',
      'GSTIN of supplier',
      'Trade/Legal name of the Supplier',
      'Invoice number.',
      'Invoice type',
      'Invoice Date',
      'Invoice Value (₹)',
      'Place of supply',
      'Supply Attract Reverse Charge',
      'Rate (%)',
      'Taxable Value (₹)',
      'Integrated Tax  (₹)',
      'Central Tax (₹)',
      'State/UT tax (₹)',
      'Cess  (₹)',
      'GSTR-1/5 Filing Date',
      'GSTR-1/5 Filing Period',
      'ITC Availability',
      'Reason',
      'Applicable % of Tax Rate'
      
    ];
  }else if(sheetName == 'CDNR') {
    return [
      'GSTIN of supplier',
      'Trade/Legal name of the Supplier',
      'Note type',
      'Note number',
      'Note Supply type',
      'Note date',
      'Note Value (₹)',
      'Place of supply',
      'Supply Attract Reverse Charge',
      'Rate (%)',
      'Taxable Value (₹)',
      'Integrated Tax  (₹)',
      'Central Tax (₹)',
      'State/UT tax (₹)',
      'Cess  (₹)',
      'GSTR-1/5 Filing Date',
      'GSTR-1/5 Filing Period',
      'ITC Availability',
      'Reason',
      'Applicable % of Tax Rate',
      'Source',
      'IRN',
      'IRN date'
    ];
  }else if(sheetName == 'CDNRA') {
    return [
      'Note type',
      'Note Number',
      'Note date',
      'GSTIN of supplier',
      'Trade/Legal name of the Supplier',
      'Note number',
      'Note type',
      'Note Supply type',
      'Note date',
      'Note Value (₹)',
      'Place of supply',
      'Supply Attract Reverse Charge',
      'Rate (%)',
      'Taxable Value (₹)',
      'Integrated Tax  (₹)',
      'Central Tax (₹)',
      'State/UT tax (₹)',
      'Cess  (₹)',
      'GSTR-1/5 Filing Date',
      'GSTR-1/5 Filing Period',
      'ITC Availability',
      'Reason',
      'Applicable % of Tax Rate',
    ];
  }else if(sheetName == 'ISD') {
    return [
      'GSTIN of ISD',
      'Trade/Legal name',
      'ISD Document type',
      'ISD Document number',
      'ISD Document date',
      'Original Invoice Number',
      'Original invoice date',
      'Integrated Tax (₹)',
      'Central Tax (₹)',
      'State/UT Tax (₹)',
      'Cess (₹)',
      'ISD GSTR-6 Period',
      'ISD GSTR-6 Filing Date',
      'Eligibility of ITC'
    ];
  }else if(sheetName == 'ISDA') {
    return [
      'ISD Document type',
      'Document number',
      'Document date',
      'GSTIN of ISD',
      'Trade/Legal name',
      'ISD Document type',
      'ISD Document number',
      'ISD Document date',
      'Original Invoice Number',
      'Original invoice date',
      'Integrated Tax (₹)',
      'Central Tax (₹)',
      'State/UT Tax (₹)',
      'Cess (₹)',
      'ISD GSTR-6 Period',
      'ISD GSTR-6 Filing Date',
      'Eligibility of ITC'
    ];
  }else if(sheetName == 'IMPG') {
    return [
      'Icegate Reference Date',
      'Port cod',
      'Number',
      'Date',
      'Taxable value (₹)',
      'Integrated tax (₹)',
      'Cess  (₹)',
      'Amended (Yes)'
    ];
  }else if(sheetName == 'IMPGSEZ') {
    return [
      'GSTIN of supplier',
      'Trade/Legal name',
      'Icegate Reference Date',
      'Port cod',
      'Number',
      'Date',
      'Taxable value (₹)',
      'Integrated tax (₹)',
      'Cess  (₹)',
      'Amended (Yes)'
    ];
  }
};

const mergeCells = (worksheet, range, text) => {
  worksheet.mergeCells(range);
  const startCell = worksheet.getCell(range.split(':')[0]);
  startCell.value = text;
  startCell.font = { bold: true };
  startCell.alignment = { vertical: 'middle', horizontal: 'center' };
  startCell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
};

const formatRows = (headerRow, color) => {
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }
    };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
};

const formatHeaderRow = (headerRow) => {
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8f3fc' }
    };
    cell.font = { bold: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
};

const prepareB2BDataRow = (newRow, topRowData, invRowData, itemRowData) => {
  newRow.getCell('ctin').value = topRowData.ctin;
  newRow.getCell('supplierName').value = topRowData.trdnm;
  newRow.getCell('inum').value = invRowData.inum;
  newRow.getCell('inv_typ').value = invRowData.typ;
  newRow.getCell('idt').value = invRowData.dt;
  newRow.getCell('val').value = invRowData.val;
  newRow.getCell('pos').value = invRowData.pos;
  newRow.getCell('rchrg').value = invRowData.rev;
  newRow.getCell('rt').value = itemRowData?.rt;
  newRow.getCell('txval').value = itemRowData?.txval;
  newRow.getCell('iamt').value = itemRowData?.igst;
  newRow.getCell('camt').value = itemRowData?.cgst;
  newRow.getCell('samt').value = itemRowData?.sgst;
  newRow.getCell('csamt').value = itemRowData?.cess;
  newRow.getCell('cfs').value = topRowData.cfs;
  newRow.getCell('fldtr1').value = topRowData.supfildt;
  newRow.getCell('flprdr1').value = topRowData.supprd;
  newRow.getCell('cfs3b').value = topRowData.cfs3b;
  newRow.getCell('irn').value = invRowData.irn;
  newRow.getCell('irndate').value = invRowData.irngendate;
};
const prepareB2BADataRow = (newRow, topRowData, invRowData, itemRowData) => {
  newRow.getCell('inumUp').value = invRowData.oinum;
  newRow.getCell('idtUp').value = invRowData.oidt;
  newRow.getCell('ctin').value = topRowData.ctin;
  newRow.getCell('supplierName').value = '';
  newRow.getCell('inum').value = invRowData.inum;
  newRow.getCell('inv_typ').value = invRowData.typ;
  newRow.getCell('idt').value = invRowData.dt;
  newRow.getCell('val').value = invRowData.val;
  newRow.getCell('pos').value = invRowData.pos;
  newRow.getCell('rchrg').value = invRowData.rev;
  newRow.getCell('rt').value = itemRowData?.rt;
  newRow.getCell('txval').value = itemRowData?.txval;
  newRow.getCell('iamt').value = itemRowData?.igst;
  newRow.getCell('camt').value = itemRowData?.cgst;
  newRow.getCell('samt').value = itemRowData?.sgst;
  newRow.getCell('csamt').value = itemRowData?.cess;
  newRow.getCell('fldtr1').value = topRowData.supfildt;
  newRow.getCell('flprdr1').value = topRowData.supprd;
  newRow.getCell('itcavail').value = invRowData.itcavl;
  newRow.getCell('reason').value = invRowData.rsn;
};
const prepareCDNRDataRow = (newRow, topRowData, invRowData, itemRowData) => {
  newRow.getCell('ctin').value = topRowData.ctin;
  newRow.getCell('supplierName').value = '';
  newRow.getCell('ntty').value = invRowData.typ;
  newRow.getCell('nt_num').value = invRowData.ntnum;
  newRow.getCell('nt_dt').value = invRowData.dt;
  newRow.getCell('val').value = invRowData.val;
  newRow.getCell('pos').value = invRowData.pos;
  newRow.getCell('rchrg').value = invRowData.rev;
  newRow.getCell('rt').value = itemRowData?.rt;
  newRow.getCell('txval').value = itemRowData?.txval;
  newRow.getCell('iamt').value = itemRowData?.igst;
  newRow.getCell('camt').value = itemRowData?.cgst;
  newRow.getCell('samt').value = itemRowData?.sgst;
  newRow.getCell('csamt').value = itemRowData?.cess;
  newRow.getCell('fldtr1').value = topRowData.supfildt;
  newRow.getCell('itcavail').value = invRowData.itcavl;
  newRow.getCell('reason').value = invRowData.rsn;
  newRow.getCell('source').value = invRowData.srctyp;
  newRow.getCell('irn').value = invRowData.irn;
  newRow.getCell('irndate').value = invRowData.irngendate;
};
const prepareCDNRADataRow = (newRow, topRowData, invRowData, itemRowData) => {
  newRow.getCell('nttyUp').value = invRowData.onttyp;
  newRow.getCell('nt_numUp').value = invRowData.ontnum;
  newRow.getCell('nt_dtUp').value = invRowData.ontdt;
  newRow.getCell('ctin').value = topRowData.ctin;
  newRow.getCell('supplierName').value = topRowData.trdnm;
  newRow.getCell('ntty').value = invRowData.typ;
  newRow.getCell('nt_num').value = invRowData.ntnum;
  newRow.getCell('nt_dt').value = invRowData.dt;
  newRow.getCell('val').value = invRowData.val;
  newRow.getCell('pos').value = invRowData.pos;
  newRow.getCell('rchrg').value = invRowData.rev;
  newRow.getCell('rt').value = itemRowData?.rt;
  newRow.getCell('txval').value = itemRowData?.txval;
  newRow.getCell('iamt').value = itemRowData?.igst;
  newRow.getCell('camt').value = itemRowData?.cgst;
  newRow.getCell('samt').value = itemRowData?.sgst;
  newRow.getCell('csamt').value = itemRowData?.cess;
  newRow.getCell('fldtr1').value = topRowData.supfildt;
  newRow.getCell('flprdr1').value = topRowData.supprd;
  newRow.getCell('itcavail').value = invRowData.itcavl;
  newRow.getCell('reason').value = invRowData.rsn;
};
const prepareISDDataRow = (newRow, topRowData, invRowData) => {
  newRow.getCell('ctin').value = topRowData.ctin;
  newRow.getCell('trade').value = topRowData.trdnm;
  newRow.getCell('isd_docty').value = invRowData.doctyp;
  newRow.getCell('isd_docno').value = invRowData.docnum;
  newRow.getCell('isd_docdate').value = invRowData.docdt;
  newRow.getCell('invno').value = invRowData.oinvnum;
  newRow.getCell('invdt').value = invRowData.oinvdt;
  newRow.getCell('iamt').value = invRowData.igst;
  newRow.getCell('camt').value = invRowData.cgst;
  newRow.getCell('samt').value = invRowData.sgst;
  newRow.getCell('cess').value = invRowData.cess;
  newRow.getCell('isd6pd').value = topRowData.supprd;
  newRow.getCell('isd6dt').value = topRowData.supfildt;
  newRow.getCell('eligitc').value = invRowData.itcelg;
};
const prepareISDADataRow = (newRow, topRowData, invRowData) => {
  newRow.getCell('isd_docty1').value = invRowData.odoctyp;
  newRow.getCell('isd_docno1').value = invRowData.odocnum;
  newRow.getCell('isd_docdate1').value = invRowData.odocdt;
  newRow.getCell('ctin').value = topRowData.ctin;
  newRow.getCell('trade').value = topRowData.trdnm;
  newRow.getCell('isd_docty').value = invRowData.doctyp;
  newRow.getCell('isd_docno').value = invRowData.docnum;
  newRow.getCell('isd_docdate').value = invRowData.docdt;
  newRow.getCell('invno').value = invRowData.oinvnum;
  newRow.getCell('invdt').value = invRowData.oinvdt;
  newRow.getCell('iamt').value = invRowData.igst;
  newRow.getCell('camt').value = invRowData.cgst;
  newRow.getCell('samt').value = invRowData.sgst;
  newRow.getCell('cess').value = invRowData.cess;
  newRow.getCell('isd6pd').value = topRowData.supprd;
  newRow.getCell('isd6dt').value = topRowData.supfildt;
  newRow.getCell('eligitc').value = invRowData.itcelg;
};
const prepareIMPGDataRow = (newRow, topRowData) => {
  newRow.getCell('refdt').value = topRowData.refdt;
  newRow.getCell('portcd').value = topRowData.portcode;
  newRow.getCell('benum').value = topRowData.boenum;
  newRow.getCell('bedt').value = topRowData.boedt;
  newRow.getCell('txval').value = topRowData.txval;
  newRow.getCell('iamt').value = topRowData.igst;
  newRow.getCell('csamt').value = topRowData.cess;
  newRow.getCell('amd').value = topRowData.isamd;
};
const prepareIMPGSEZDataRow = (newRow, topRowData) => {
  newRow.getCell('sgstin').value = topRowData.ctin;
  newRow.getCell('tdname').value = topRowData.trdnm;
  newRow.getCell('refdt').value = topRowData.refdt;
  newRow.getCell('portcd').value = topRowData.portcode;
  newRow.getCell('benum').value = topRowData.boenum;
  newRow.getCell('bedt').value = topRowData.boedt;
  newRow.getCell('txval').value = topRowData.txval;
  newRow.getCell('iamt').value = topRowData.igst;
  newRow.getCell('csamt').value = topRowData.cess;
  newRow.getCell('amd').value = topRowData.isamd;
};

export const prepare2BOtherSheet = async (workbook, xlsxData, sheetName, headerRowFunction, mergeRange1, mergeRange2) => {
  const worksheet = workbook.addWorksheet(sheetName);
  const filteredColumns = [];
  await headerRowFunction(filteredColumns);
  worksheet.columns = filteredColumns;

  const headerValues = getHeaderValues(sheetName);

  // Set first row values to empty
  const firstRow = worksheet.getRow(1);
  firstRow.values = new Array(headerValues.length).fill('');

  // Merge cells in the first row
  if(sheetName == 'B2B' || sheetName == 'B2BA'){
    mergeCells(worksheet, mergeRange1, 'Invoice details');
    mergeCells(worksheet, mergeRange2, 'Tax Amount');
  }else if(sheetName == 'CDNR' || sheetName == 'CDNRA'){
    mergeCells(worksheet, mergeRange1, 'Credit note/Debit note details');
    mergeCells(worksheet, mergeRange2, 'Tax Amount');
  }else if(sheetName == 'ISD'  || sheetName == 'ISDA'){
    mergeCells(worksheet, mergeRange1, 'Input tax distribution by ISD');
  }else if(sheetName == 'IMPG' || sheetName == 'IMPGSEZ'){
    mergeCells(worksheet, mergeRange1, 'Bill of entry details');
    mergeCells(worksheet, mergeRange2, 'Amount of tax (₹)');
  }
  

  const headerRow = worksheet.getRow(2);
  worksheet.getRow(2).values = headerValues;
  formatHeaderRow(headerRow);

  if(xlsxData && xlsxData.length > 0) {
      xlsxData.forEach((data) => {
        if(sheetName == 'B2B'){
          data.inv.forEach((inv) => {
              inv.items.forEach((item) => {
                  const newRow = worksheet.addRow({});
                  prepareB2BDataRow(newRow, data, inv, item);
              });
          });
        }
        if(sheetName == 'B2BA'){
          data.inv.forEach((inv) => {
              inv.items.forEach((item) => {
                  const newRow = worksheet.addRow({});
                  prepareB2BADataRow(newRow, data, inv, item);
              });
          });
        }
        if(sheetName == 'CDNR'){
          data.nt.forEach((nt) => {
              nt.items.forEach((item) => {
                  const newRow = worksheet.addRow({});
                  prepareCDNRDataRow(newRow, data, nt, item);
              });
          });
        }
        if(sheetName == 'CDNRA'){
          data.nt.forEach((nt) => {
              nt.items.forEach((item) => {
                  const newRow = worksheet.addRow({});
                  prepareCDNRADataRow(newRow, data, nt, item);
              });
          });
        }
        if(sheetName == 'ISD'){
          data.doclist.forEach((doclist) => {
              const newRow = worksheet.addRow({});
              prepareISDDataRow(newRow, data, doclist);
          });
        }
        if(sheetName == 'ISDA'){
          data.doclist.forEach((doclist) => {
              const newRow = worksheet.addRow({});
              prepareISDADataRow(newRow, data, doclist);
          });
        }
        if(sheetName == 'IMPG'){
          const newRow = worksheet.addRow({});
          prepareIMPGDataRow(newRow, data);
        }
        if(sheetName == 'IMPGSEZ'){
          const newRow = worksheet.addRow({});
          prepareIMPGSEZDataRow(newRow, data);
        }
      });
  }

  
};

export const prepare2A2BHeaderRow = (filteredColumns) => {
  filteredColumns.push({ header: 'GSTIN', key: 'ctin', width: 20 });
  filteredColumns.push({ header: 'SUPPLIER NAME', key: 'supplierName', width: 20 });
  filteredColumns.push({ header: 'INVOICE NUMBER', key: 'inum', width: 20 });
  filteredColumns.push({ header: 'DATE', key: 'date', width: 20 });
  filteredColumns.push({ header: 'AGE', key: 'age', width: 20 });
  filteredColumns.push({ header: 'BOOKS', key: 'books', width: 20 });
  filteredColumns.push({ header: '2A', key: '2a', width: 20 });
  filteredColumns.push({ header: '2B', key: '2b', width: 20 });
  filteredColumns.push({ header: 'GSTR-1 FP', key: 'gstr1_fp', width: 20 });
  filteredColumns.push({ header: 'RC', key: 'rc', width: 20 });
  filteredColumns.push({ header: 'ITC AVAILABLE', key: 'itc_available', width: 20 });
  filteredColumns.push({ header: 'TAXABLE AMT (BOOKS)', key: 'val_books', width: 20 });
  filteredColumns.push({ header: 'IGST AMT (BOOKS)', key: 'igst_books', width: 20 });
  filteredColumns.push({ header: 'CGST AMT (BOOKS)', key: 'cgst_books', width: 20 });
  filteredColumns.push({ header: 'SGST AMT (BOOKS)', key: 'sgst_books', width: 20 });
  filteredColumns.push({ header: 'CESS AMT (BOOKS)', key: 'cess_books', width: 20 });
  filteredColumns.push({ header: 'TAXABLE AMT (PORTAL)', key: 'val', width: 20 });
  filteredColumns.push({ header: 'IGST AMT (PORTAL)', key: 'igst', width: 20 });
  filteredColumns.push({ header: 'CGST AMT (PORTAL', key: 'cgst', width: 20 });
  filteredColumns.push({ header: 'SGST AMT (PORTAL)', key: 'sgst', width: 20 });
  filteredColumns.push({ header: 'CESS AMT (PORTAL)', key: 'cess', width: 20 });
};



