import React, { useState, useEffect } from 'react';
import { Paper, Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Controls from 'src/components/controls';
import * as Db from 'src/RxDb/Database/Database';
import dateFormat from 'dateformat';
import DateRangePicker from 'src/components/controls/DateRangePicker';
import Styles from 'src/views/Export/style';
import { AgGridReact } from 'ag-grid-react';
import { Checkbox, FormControl, FormControlLabel } from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import 'src/views/Export/style.css';
import Page from 'src/components/Page';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import useWindowDimensions from 'src/components/windowDimension';
import left_arrow from '../../icons/svg/left_arrow.svg';
import right_arrow from '../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../icons/svg/last_page_arrow.svg';
import * as Bd from '../../components/SelectedBusiness';
import BubbleLoader from 'src/components/loader';
import NoPermission from '../noPermission';

const TallyExp = (props) => {
  const { height } = useWindowDimensions();
  const classes = Styles.useStyles();
  const [records, setRecords] = useState(null);

  const [dateRange, setDateRange] = useState({
    fromDate: new Date(),
    toDate: new Date()
  });

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const store = useStore();
  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  let [onChange, setOnChange] = useState(true);
  const [limit] = useState(10);

  const [rowData, setRowData] = useState(null);

  const [salesChecked, setSalesChecked] = useState(true);
  const [salesReturnChecked, setSalesReturnChecked] = useState(true);
  const [purchaseChecked, setPurchaseChecked] = useState(true);
  const [purchaseReturnChecked, setPurchaseReturnChecked] = useState(true);
  const [expenseChecked, setExpenseChecked] = useState(true);
  const [paymentInChecked, setPaymentInChecked] = useState(true);
  const [paymentOutChecked, setPaymentOutChecked] = useState(true);

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  let [vouchersData] = useState([]);
  let [multiEntryData] = useState([]);

  const statusCellStyle = (params) => {
    let data = params['data'];

    if (data['balance_amount'] === 0) {
      return { color: '#86ca94', fontWeight: 500 };
    } else if (
      data['balance_amount'] < data['total_amount'] ||
      data['balance_amount'] === data['total_amount']
    ) {
      return { color: '#faab53', fontWeight: 500 };
    }
    return null;
  };

  const rowClassRules = {
    rowHighlight: function (params) {
      return params.node.rowIndex % 2 === 0;
    }
  };
  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    filter: true,
    rowHeight: 10,
    headerHeight: 30,
    suppressMenuHide: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  const onFirstPageClicked = () => {
    if (gridApi) {
      setCurrentPage(1);
      setOnChange(true);
    }
  };

  const onLastPageClicked = () => {
    if (gridApi) {
      setCurrentPage(totalPages);
      setOnChange(true);
    }
  };

  const onPreviousPageClicked = () => {
    if (gridApi) {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        setOnChange(true);
      }
    }
  };

  const onNextPageClicked = () => {
    if (gridApi) {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        setOnChange(true);
      }
    }
  };

  function dateFormatter(params) {
    var dateAsString = params.data.date
      ? params.data.date
      : params.data.invoice_date
      ? params.data.invoice_date
      : params.data.bill_date;
    //console.log(dateAsString);
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const [columnDefs] = useState([
    {
      headerName: 'DATE',
      field: 'date',
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
      filter: 'agDateColumnFilter',
      valueFormatter: dateFormatter
    },
    {
      headerName: 'REF NO.',
      field: 'sequenceNumber',
      valueFormatter: (params) => {
        return params['data']['sequenceNumber']
          ? params['data']['sequenceNumber']
          : params['data']['bill_number'];
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>REFERENCE /</p>
            <p>INVOICE NO.</p>
          </div>
        );
      }
    },
    {
      headerName: 'CUSTOMER/VENDOR',
      field: 'customerName',
      valueFormatter: (params) => {
        return params['data']['customerName']
          ? params['data']['customerName']
          : params['data']['vendorName'];
      },
      /* field: ((salesChecked || salesReturnChecked) ? 'customer_name' : 'vendor_name'), */
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>CUSTOMER /</p>
            <p>VENDOR</p>
          </div>
        );
      }
    },
    {
      headerName: 'TYPE',
      field: 'paymentType',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'TOTAL',
      field: 'amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['amount'] ? params['data']['amount'] : '0';
      }
    },
    {
      headerName: 'PAID',
      field: 'paidOrReceivedAmount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return (
          (params['data']['paidOrReceivedAmount'] || 0) +
          (params['data']['linkedAmount'] || 0)
        );
      }
    },
    {
      headerName: 'BALANCE',
      field: 'balance',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['balance'] ? params['data']['balance'] : '0';
      }
    },
    {
      headerName: 'STATUS',
      field: 'paymentStatus',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueGetter: (params) => {
        let data = params['data'];
        let result = '';

        if (data['balance'] === 0) {
          result = 'Paid';
        } else if (data['balance'] < data['amount']) {
          result = 'Partial';
        } else if (data['balance'] === data['amount']) {
          result = 'Un Paid';
        } else if (data['balance'] > data['amount']) {
          result = 'Pending';
        }

        return result;
      },
      cellStyle: statusCellStyle
    }
  ]);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setOnChange(false);
        setRecords([]);
        await getTransactionsBySelection(dateRange);
      }
    };
    loadPaginationData();
  }, [onChange]);

  useEffect(() => {
    if (gridApi) {
      if (rowData) {
        gridApi.setRowData(rowData);
      }
    }
  }, [rowData]);

  const getTransactionsBySelection = async (dateRange) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRowData([]);

    const businessData = await Bd.getBusinessData();

    let arrayFilter = [
      { businessId: { $eq: businessData.businessId } },

      {
        date: {
          $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
        }
      },
      {
        date: {
          $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
        }
      },
      {
        updatedAt: { $exists: true }
      }
    ];

    let txnTypeFilter = [];

    if (salesChecked) {
      let filter = {
        $or: [{ txnType: { $eq: 'Sales' } }, { txnType: { $eq: 'KOT' } }]
      };

      txnTypeFilter.push(filter);
    }

    if (salesReturnChecked) {
      let filter = { txnType: { $eq: 'Sales Return' } };
      txnTypeFilter.push(filter);
    }

    if (purchaseChecked) {
      let filter = { txnType: { $eq: 'Purchases' } };
      txnTypeFilter.push(filter);
    }

    if (purchaseReturnChecked) {
      let filter = { txnType: { $eq: 'Purchases Return' } };
      txnTypeFilter.push(filter);
    }

    if (expenseChecked) {
      let filter = { txnType: { $eq: 'Expenses' } };
      txnTypeFilter.push(filter);
    }

    if (paymentInChecked) {
      let filter = { txnType: { $eq: 'Payment In' } };
      txnTypeFilter.push(filter);
    }

    if (paymentOutChecked) {
      let filter = { txnType: { $eq: 'Payment Out' } };
      txnTypeFilter.push(filter);
    }

    if (txnTypeFilter.length > 0) {
      let filter = {
        $or: txnTypeFilter
      };

      arrayFilter.push(filter);
    }

    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllTransactionsBySelection(arrayFilter);
    }

    Query = db.alltransactions.find({
      selector: {
        $and: arrayFilter
      },
      sort: [{ date: 'desc' }, { updatedAt: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }

      if (data.length > 0) {
        setRowData(data);
      } else {
        setRowData([]);
      }
    });
  };

  const getAllTransactionsBySelection = async (filterArray) => {
    const db = await Db.get();
    var Query;

    Query = db.alltransactions.find({
      selector: {
        $and: filterArray
      }
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = data.length;

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 100);
    window.addEventListener('resize', function () {
      setTimeout(function () {
        params.api.sizeColumnsToFit();
      });
    });
  };

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('mobileNumber'));
  }, []);

  useEffect(() => {
    if (!!gridApi) {
      gridApi.setRowData(records);
    }
  }, [records]);

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getSalesData = async (db) => {
    return new Promise(async (resolve) => {
      var query;
      let result = [];
      let gstResult = [];
      const businessData = await Bd.getBusinessData();

      query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
              }
            },
            {
              invoice_date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
            }
          ]
        }
      });

      await query.exec().then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          //filter GST + non GST records
          let isMultiEntryRecord = false;
          for (let product of item.item_list) {
            if (
              parseFloat(product.sgst_amount) > 0 ||
              parseFloat(product.igst_amount) > 0
            ) {
              isMultiEntryRecord = true;
              break;
            }
          }

          if (item.balance_amount > 0) {
            isMultiEntryRecord = true;
          }

          if (isMultiEntryRecord) {
            //gst record
            isMultiEntryRecord = false;

            //get total cgst amount
            //get total sgst amount
            //total cess amount
            //total igst amount
            let cgst_amount = 0;
            let sgst_amount = 0;
            let igst_amount = 0;
            let cess_amount = 0;
            let total_amount_before_tax = 0;

            for (let product of item.item_list) {
              cgst_amount = cgst_amount + (product.cgst_amount || 0);
              sgst_amount = sgst_amount + (product.sgst_amount || 0);
              igst_amount = igst_amount + (product.igst_amount || 0);
              cess_amount = cess_amount + (product.cess || 0);
            }

            total_amount_before_tax =
              parseFloat(item.total_amount) -
              parseFloat(cgst_amount) -
              parseFloat(sgst_amount) -
              parseFloat(igst_amount) -
              parseFloat(cess_amount);

            const record = {
              Date: item.invoice_date,
              'VOUCHER NO.': item.sequenceNumber,
              'VOUCHER TYPE': 'Sales',
              NARRATION: item.payment_type,
              DR: item.payment_type,
              AMOUNT: item.total_amount,
              'DR ': '',
              'AMOUNT ': '',
              'DR  ': '',
              'AMOUNT  ': '',
              'DR   ': '',
              'AMOUNT   ': '',
              'DR    ': '',
              'AMOUNT    ': '',
              'DR     ': '',
              'AMOUNT     ': '',
              CR: 'Sales A/C',
              'AMOUNT      ': total_amount_before_tax,
              'CR ': 'Cgst',
              'AMOUNT       ': cgst_amount,
              'CR  ': 'Sgst',
              'AMOUNT        ': sgst_amount,
              'CR   ': 'Igst',
              'AMOUNT         ': igst_amount,
              'CR    ': 'Cess',
              'AMOUNT          ': cess_amount,
              'CR     ': 'Rounding off',
              'AMOUNT            ': item.round_amount
            };

            if (item.balance_amount > 0) {
              record['AMOUNT'] = item.received_amount;
              record['DR '] = item.customer_name;
              record['AMOUNT '] = item.balance_amount;
            }

            gstResult.push(record);
          } else {
            //non gst record

            let toCr = 'Sales A/C';
            let toDr = '';
            if (item.balance_amount > 0) {
              toDr = item.customer_name + ' Account';
            } else {
              toDr = item.payment_type;
            }

            const record = {
              Date: item.invoice_date,
              'VOUCHER NO.': item.sequenceNumber,
              'BY / DR': toDr,
              'TO / CR': toCr,
              AMOUNT: item.total_amount,
              NARRATION: item.payment_type,
              'VOUCHER TYPE': 'Sales',
              DAY: ''
            };

            result.push(record);
          }
        });

        if (result.length > 0) {
          vouchersData.push(...result);
        }

        if (gstResult.length > 0) {
          multiEntryData.push(...gstResult);
        }

        resolve(`Resolved sales`);
      });
    });
  };

  const getSalesReturnData = async (db) => {
    return new Promise(async (resolve) => {
      var query;
      let result = [];
      let gstResult = [];
      const businessData = await Bd.getBusinessData();

      query = db.salesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: { $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd') }
            },
            {
              date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
            }
          ]
        }
      });

      await query.exec().then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          //filter GST + non GST records

          let isMultiEntryRecord = false;
          for (let product of item.item_list) {
            if (
              parseFloat(product.sgst_amount) > 0 ||
              parseFloat(product.igst_amount) > 0
            ) {
              isMultiEntryRecord = true;
              break;
            }
          }

          if (item.balance_amount > 0) {
            isMultiEntryRecord = true;
          }

          if (isMultiEntryRecord) {
            //gst record
            isMultiEntryRecord = false;

            //get total cgst amount
            //get total sgst amount
            //total cess amount
            //total igst amount
            let cgst_amount = 0;
            let sgst_amount = 0;
            let igst_amount = 0;
            let cess_amount = 0;
            let total_amount_before_tax = 0;

            for (let product of item.item_list) {
              cgst_amount = cgst_amount + (product.cgst_amount || 0);
              sgst_amount = sgst_amount + (product.sgst_amount || 0);
              igst_amount = igst_amount + (product.igst_amount || 0);
              cess_amount = cess_amount + (product.cess || 0);
            }

            total_amount_before_tax =
              parseFloat(item.total_amount) -
              parseFloat(cgst_amount) -
              parseFloat(sgst_amount) -
              parseFloat(igst_amount) -
              parseFloat(cess_amount);

            const record = {
              Date: item.date,
              'VOUCHER NO.': item.sequenceNumber,
              'VOUCHER TYPE': 'Credit Note',
              NARRATION: item.payment_type,
              DR: 'Credit Note',
              AMOUNT: total_amount_before_tax,
              'DR ': 'Cgst',
              'AMOUNT ': cgst_amount,
              'DR  ': 'Sgst',
              'AMOUNT  ': sgst_amount,
              'DR   ': 'Igst',
              'AMOUNT   ': igst_amount,
              'DR    ': 'Cess',
              'AMOUNT    ': cess_amount,
              'DR     ': 'Rounding off',
              'AMOUNT     ': item.round_amount,
              CR: item.payment_type,
              'AMOUNT      ': item.total_amount,
              'CR ': '',
              'AMOUNT       ': ''
            };

            if (item.balance_amount > 0) {
              record['AMOUNT'] = item.paid_amount;
              record['CR'] = item.customer_name;
              record['AMOUNT      '] = item.balance_amount;
            }

            gstResult.push(record);
          } else {
            //non gst record

            let toCr = '';
            let toDr = '';
            if (item.balance_amount > 0) {
              toCr = item.customer_name + ' Account';
              toDr = 'Credit Note';
            } else {
              toDr = 'Credit Note';
              toCr = item.payment_type;
            }

            const record = {
              Date: item.date,
              'VOUCHER NO.': item.sequenceNumber,
              'BY / DR': toCr,
              'TO / CR': toDr,
              AMOUNT: item.total_amount,
              NARRATION: item.payment_type,
              'VOUCHER TYPE': 'Credit Note',
              DAY: ''
            };

            result.push(record);
          }
        });

        if (result.length > 0) {
          vouchersData.push(...result);
        }

        if (gstResult.length > 0) {
          multiEntryData.push(...gstResult);
        }
        resolve(`Resolved sales return`);
      });
    });
  };

  const getPurchasesData = async (db) => {
    return new Promise(async (resolve) => {
      var query;
      let result = [];
      let gstResult = [];
      const businessData = await Bd.getBusinessData();

      query = db.purchases.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              bill_date: { $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd') }
            },
            {
              bill_date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
            }
          ]
        }
      });

      await query.exec().then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          //filter GST + non GST records
          let isMultiEntryRecord = false;
          for (let product of item.item_list) {
            if (
              parseFloat(product.sgst_amount) > 0 ||
              parseFloat(product.igst_amount) > 0
            ) {
              isMultiEntryRecord = true;
              break;
            }
          }

          if (parseFloat(item.balance_amount) > 0) {
            isMultiEntryRecord = true;
          }

          if (isMultiEntryRecord) {
            //gst record
            isMultiEntryRecord = false;

            //get total cgst amount
            //get total sgst amount
            //total cess amount
            //total igst amount
            let cgst_amount = 0;
            let sgst_amount = 0;
            let igst_amount = 0;
            let cess_amount = 0;
            let total_amount_before_tax = 0;

            for (let product of item.item_list) {
              cgst_amount = cgst_amount + (product.cgst_amount || 0);
              sgst_amount = sgst_amount + (product.sgst_amount || 0);
              igst_amount = igst_amount + (product.igst_amount || 0);
              cess_amount = cess_amount + (product.cess || 0);
            }

            total_amount_before_tax =
              parseFloat(item.total_amount) -
              parseFloat(cgst_amount) -
              parseFloat(sgst_amount) -
              parseFloat(igst_amount) -
              parseFloat(cess_amount);

            const record = {
              Date: item.bill_date,
              'VOUCHER NO.': item.vendor_bill_number,
              'VOUCHER TYPE': 'Purchase',
              NARRATION: item.payment_type,
              DR: 'Purchase A/C',
              AMOUNT: total_amount_before_tax,
              'DR ': 'Cgst',
              'AMOUNT ': cgst_amount,
              'DR  ': 'Sgst',
              'AMOUNT  ': sgst_amount,
              'DR   ': 'Igst',
              'AMOUNT   ': igst_amount,
              'DR    ': 'Cess',
              'AMOUNT    ': cess_amount,
              'DR     ': 'Rounding off',
              'AMOUNT     ': item.round_amount,
              CR: item.payment_type,
              'AMOUNT      ': item.total_amount,
              'CR ': '',
              'AMOUNT       ': ''
            };

            if (item.balance_amount > 0) {
              record['AMOUNT'] = item.paid_amount;
              record['CR '] = item.vendor_name;
              record['AMOUNT      '] = item.balance_amount;
            }

            gstResult.push(record);
          } else {
            //non gst record

            let toCr = '';
            let toDr = 'Purchase A/C';
            if (item.balance_amount > 0) {
              toCr = item.vendor_name + ' Account';
            } else {
              toCr = item.payment_type;
            }

            const record = {
              Date: item.bill_date,
              'VOUCHER NO.': item.vendor_bill_number,
              'BY / DR': toDr,
              'TO / CR': toCr,
              AMOUNT: item.total_amount,
              NARRATION: item.payment_type,
              'VOUCHER TYPE': 'Purchase',
              DAY: ''
            };

            result.push(record);
          }
        });
        if (result.length > 0) {
          vouchersData.push(...result);
        }

        if (gstResult.length > 0) {
          multiEntryData.push(...gstResult);
        }

        resolve(`Resolved purchase`);
      });
    });
  };
  const getPurchasesReturnData = async (db) => {
    return new Promise(async (resolve) => {
      var query;
      let result = [];
      let gstResult = [];
      const businessData = await Bd.getBusinessData();

      query = db.purchasesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: { $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd') }
            },
            {
              date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
            }
          ]
        }
      });

      await query.exec().then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          //filter GST + non GST records
          let isMultiEntryRecord = false;
          for (let product of item.item_list) {
            if (
              parseFloat(product.sgst_amount) > 0 ||
              parseFloat(product.igst_amount) > 0
            ) {
              isMultiEntryRecord = true;
              break;
            }
          }

          if (item.balance_amount > 0) {
            isMultiEntryRecord = true;
          }

          if (isMultiEntryRecord) {
            //gst record
            isMultiEntryRecord = false;

            //get total cgst amount
            //get total sgst amount
            //total cess amount
            //total igst amount
            let cgst_amount = 0;
            let sgst_amount = 0;
            let igst_amount = 0;
            let cess_amount = 0;
            let total_amount_before_tax = 0;

            for (let product of item.item_list) {
              cgst_amount = cgst_amount + (product.cgst_amount || 0);
              sgst_amount = sgst_amount + (product.sgst_amount || 0);
              igst_amount = igst_amount + (product.igst_amount || 0);
              cess_amount = cess_amount + (product.cess || 0);
            }

            total_amount_before_tax =
              parseFloat(item.total_amount) -
              parseFloat(cgst_amount) -
              parseFloat(sgst_amount) -
              parseFloat(igst_amount) -
              parseFloat(cess_amount);

            const record = {
              Date: item.date,
              'VOUCHER NO.': item.purchaseReturnBillNumber,
              'VOUCHER TYPE': 'Debit Note',
              NARRATION: item.payment_type,
              DR: item.payment_type,
              AMOUNT: item.total_amount,
              'DR ': 'Cash',
              'AMOUNT ': '',
              'DR  ': '',
              'AMOUNT  ': '',
              'DR   ': '',
              'AMOUNT   ': '',
              'DR    ': '',
              'AMOUNT    ': '',
              'DR     ': '',
              'AMOUNT     ': '',
              CR: 'Debit Note',
              'AMOUNT      ': total_amount_before_tax,
              'CR ': 'Cgst',
              'AMOUNT       ': cgst_amount,
              'CR  ': 'Sgst',
              'AMOUNT        ': sgst_amount,
              'CR   ': 'Igst',
              'AMOUNT         ': igst_amount,
              'CR    ': 'Cess',
              'AMOUNT          ': cess_amount,
              'CR     ': 'Rounding off',
              'AMOUNT           ': item.round_amount
            };

            if (item.balance_amount > 0) {
              record['AMOUNT'] = item.received_amount;
              record['DR '] = item.vendorName;
              record['AMOUNT '] = item.balance_amount;
            }

            gstResult.push(record);
          } else {
            //non gst record

            let toCr = '';
            let toDr = '';
            if (item.balance_amount > 0) {
              toDr = item.vendorName ? item.vendorName + ' Account' : '';
              toCr = 'Debit Note';
            } else {
              toCr = item.vendorName + ' Account';
              toDr = item.payment_type;
            }

            const record = {
              Date: item.date,
              'VOUCHER NO.': item.purchaseReturnBillNumber,
              'BY / DR': toDr,
              'TO / CR': toCr,
              AMOUNT: item.total_amount,
              NARRATION: item.payment_type,
              'VOUCHER TYPE': 'Debit Note',
              DAY: ''
            };

            result.push(record);
          }
        });
        if (result.length > 0) {
          vouchersData.push(...result);
        }

        if (gstResult.length > 0) {
          multiEntryData.push(...gstResult);
        }

        resolve(`Resolved purchase returns`);
      });
    });
  };
  const getExpensesData = async (db) => {
    return new Promise(async (resolve) => {
      var query;
      let result = [];
      const businessData = await Bd.getBusinessData();

      query = db.expenses.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: { $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd') }
            },
            {
              date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
            }
          ]
        }
      });

      await query.exec().then(async (data) => {
        if (!data) {
          // No customer is available
          return;
        }

        if (data.length > 0) {
          //load categories data
          const businessData = await Bd.getBusinessData();

          let expensesCategories = db.expensecategories.find({
            selector: {
              businessId: { $eq: businessData.businessId }
            }
          });

          const categories = new Map();

          await expensesCategories.exec().then(async (categoryData) => {
            if (!categoryData) {
              // No customer is available
              return;
            }

            categoryData.map((item) => {
              categories.set(item.categoryId, item.category);
            });
          });

          data.map((item) => {
            let toCR = '';
            if (parseFloat(item.balance) === 0) {
              toCR = 'Cash';
            } else {
              toCR = item.payment_type;
            }

            const record = {
              Date: item.date,
              'VOUCHER NO.': item.sequenceNumber,
              'BY / DR': categories.get(item.categoryId),
              'TO / CR': toCR,
              AMOUNT: item.total,
              NARRATION: item.paymentType,
              'VOUCHER TYPE': 'Expense',
              DAY: ''
            };
            result.push(record);
          });

          if (result.length > 0) {
            vouchersData.push(...result);
          }
        }
        resolve(`Resolved expenses`);
      });
    });
  };
  const getPaymentInData = async (db) => {
    return new Promise(async (resolve) => {
      var query;
      let result = [];
      const businessData = await Bd.getBusinessData();

      query = db.paymentin.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: { $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd') }
            },
            {
              date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
            }
          ]
        }
      });

      await query.exec().then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          const record = {
            Date: item.date,
            'VOUCHER NO.': item.sequenceNumber,
            'BY / DR': item.paymentType,
            'TO / CR': item.customerName,
            AMOUNT: item.total,
            NARRATION: item.paymentType,
            'VOUCHER TYPE': 'Payment In',
            DAY: ''
          };

          result.push(record);
        });
        if (result.length > 0) {
          vouchersData.push(...result);
        }
        resolve(`Resolved payment in`);
      });
    });
  };
  const getPaymentOutData = async (db) => {
    return new Promise(async (resolve) => {
      var query;
      let result = [];
      const businessData = await Bd.getBusinessData();

      query = db.paymentout.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: { $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd') }
            },
            {
              date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
            }
          ]
        }
      });

      await query.exec().then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          const record = {
            Date: item.date,
            'VOUCHER NO.': item.sequenceNumber,
            'BY / DR': item.vendorName,
            'TO / CR': item.paymentType,
            AMOUNT: item.total,
            NARRATION: item.paymentType,
            'VOUCHER TYPE': 'Payment Out',
            DAY: ''
          };

          result.push(record);
        });
        if (result.length > 0) {
          vouchersData.push(...result);
        }
        resolve(`Resolved payment out`);
      });
    });
  };

  const getAllTxnData = async () => {
    const db = await Db.get();
    await Promise.all([
      getSalesData(db),
      getSalesReturnData(db),
      getPurchasesData(db),
      getPurchasesReturnData(db),
      getExpensesData(db),
      getPaymentInData(db),
      getPaymentOutData(db)
    ]).then(() => {
      if (vouchersData.length === 0) {
        const record = {
          Date: '',
          'VOUCHER NO.': '',
          'BY / DR': '',
          'TO / CR': '',
          AMOUNT: '',
          NARRATION: '',
          'VOUCHER TYPE': '',
          DAY: ''
        };
        vouchersData.push(record);
      }

      if (multiEntryData.length === 0) {
        const gstRecord = {
          Date: '',
          'VOUCHER TYPE': '',
          'VOUCHER NO.': '',
          NARRATION: '',
          DR: '',
          AMOUNT: '',
          'DR ': '',
          'AMOUNT ': '',
          CR: '',
          'AMOUNT  ': '',
          'CR ': '',
          'AMOUNT   ': '',
          'CR   ': '',
          'AMOUNT    ': '',
          'CR    ': '',
          'AMOUNT     ': '',
          'DR  ': '',
          'AMOUNT      ': '',
          'DR   ': '',
          'AMOUNT       ': '',
          'DR    ': '',
          'AMOUNT       ': '',
          'DR     ': '',
          'AMOUNT        ': '',
          'DR      ': '',
          'AMOUNT         ': '',
          'DR       ': '',
          'AMOUNT          ': '',
          'CR     ': '',
          'AMOUNT           ': '',
          'DR        ': '',
          'AMOUNT            ': '',
          'CR      ': '',
          'AMOUNT             ': '',
          'CR       ': '',
          'AMOUNT              ': '',
          'CR        ': '',
          'AMOUNT               ': ''
        };
        multiEntryData.push(gstRecord);
      }
      console.log('completed fetching');
    });
  };

  const exportTallyDataToExcel = async () => {
    const wb = new Workbook();

    /**
     * get data from
     * sales, sales return, purchase, purchase returns
     * expenses, payment in and payment out
     */

    await getAllTxnData();

    //sheet Voucher Tab
    let ws = XLSX.utils.json_to_sheet(vouchersData);

    wb.SheetNames.push('Voucher Tab');

    wb.Sheets['Voucher Tab'] = ws;

    //sheet Multi Entry - with GST / Cess

    let ws2 = XLSX.utils.json_to_sheet(multiEntryData);

    wb.SheetNames.push('Multi Entry with GST Cess');

    wb.Sheets['Multi Entry with GST Cess'] = ws2;

    const wbout = XLSX.write(wb, {
      bookType: 'xls',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName =
      'export_to_tally' + '_' + dateFormat(new Date(), 'yyyy-mm-dd');

    download(url, fileName + '.xls');
  };

  const download = (url, name) => {
    let a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);

    const view = new Uint8Array(buf);

    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;

    return buf;
  }

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Export To Tally')) {
        setFeatureAvailable(false);
      }
    }
  };

  return (
    <Page className={classes.root} title="Export To Tally">
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div>
          {isFeatureAvailable ? (
            <Paper className={classes.pageContent} style={{ width: '98%' }}>
              <Grid container spacing={1} className={classes.sectionHeader}>
                <Grid item xs={6} sm={5}>
                  <DateRangePicker
                    value={dateRange}
                    onChange={(dateRange) => {
                      if (
                        moment(dateRange.fromDate).isValid() &&
                        moment(dateRange.toDate).isValid()
                      ) {
                        setDateRange(dateRange);
                      } else {
                        setDateRange({
                          fromDate: new Date(),
                          toDate: new Date()
                        });
                      }
                      setOnChange(true);
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={2}></Grid>
              </Grid>

              <Grid item xs={12} sm={12}>
                <Typography
                  variant="h4"
                  style={{ marginLeft: '15px', marginBottom: '10px' }}
                >
                  TRANSACTIONS
                </Typography>
              </Grid>

              <Grid
                container
                direction="row"
                spacing={2}
                className={classes.sectionHeader}
                style={{
                  display: 'flex',
                  marginLeft: '15px',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}
              >
                <FormControl>
                  <Grid item style={{ width: '100%' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="sales"
                          defaultChecked="true"
                          onChange={(event) => {
                            setSalesChecked(event.target.checked);
                            setOnChange(true);
                          }}
                        />
                      }
                      label="Sales"
                      size="small"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          name="salesReturn"
                          defaultChecked="true"
                          onChange={(event) => {
                            setSalesReturnChecked(event.target.checked);
                            setOnChange(true);
                          }}
                        />
                      }
                      label="Sales Return"
                      size="small"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="purchase"
                          defaultChecked="true"
                          onChange={(event) => {
                            setPurchaseChecked(event.target.checked);
                            setOnChange(true);
                          }}
                        />
                      }
                      label="Purchase"
                      size="small"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="purchaseReturn"
                          defaultChecked="true"
                          onChange={(event) => {
                            setPurchaseReturnChecked(event.target.checked);
                            setOnChange(true);
                          }}
                        />
                      }
                      label="Purchase Return"
                      size="small"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="expense"
                          defaultChecked="true"
                          onChange={(event) => {
                            setExpenseChecked(event.target.checked);
                            setOnChange(true);
                          }}
                        />
                      }
                      label="Expense"
                      size="small"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="paymentIn"
                          defaultChecked="true"
                          onChange={(event) => {
                            setPaymentInChecked(event.target.checked);
                            setOnChange(true);
                          }}
                        />
                      }
                      label="Payment-In"
                      size="small"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="paymentOut"
                          defaultChecked="true"
                          onChange={(event) => {
                            setPaymentOutChecked(event.target.checked);
                            setOnChange(true);
                          }}
                        />
                      }
                      label="Payment-Out"
                      size="small"
                    />

                    <Controls.Button
                      text="Export to Tally"
                      size="medium"
                      variant="contained"
                      color="primary"
                      className={classes.newButton}
                      onClick={() => exportTallyDataToExcel()}
                    />
                  </Grid>
                </FormControl>
              </Grid>

              <div
                id="sales-return-grid"
                style={{ width: '100%', height: height - 270 + 'px' }}
                className=" blue-theme"
              >
                <div
                  style={{ height: '97%', width: '100%' }}
                  className="ag-theme-material"
                >
                  <AgGridReact
                    onGridReady={onGridReady}
                    enableRangeSelection={true}
                    paginationPageSize={limit}
                    suppressMenuHide={true}
                    rowData={records}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    animateRows="true"
                    pagination={true}
                    headerHeight={40}
                    suppressPaginationPanel={true}
                    suppressScrollOnNewData={true}
                    rowClassRules={rowClassRules}
                    overlayLoadingTemplate={
                      '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                    }
                    overlayNoRowsTemplate={
                      '<span className="ag-overlay-loading-center">No Rows to Show!</span>'
                    }
                  ></AgGridReact>
                  <div
                    style={{
                      display: 'flex',
                      float: 'right',
                      marginTop: '5px',
                      marginBottom: '5px'
                    }}
                  >
                    <img
                      alt="Logo"
                      src={first_page_arrow}
                      width="20px"
                      height="20px"
                      style={{ marginRight: '10px' }}
                      onClick={() => onFirstPageClicked()}
                    />
                    <img
                      alt="Logo"
                      src={right_arrow}
                      width="20px"
                      height="20px"
                      onClick={() => onPreviousPageClicked()}
                    />
                    <p
                      style={{
                        marginLeft: '10px',
                        marginRight: '10px',
                        marginTop: '2px'
                      }}
                    >
                      Page {currentPage} of {totalPages}
                    </p>
                    <img
                      alt="Logo"
                      src={left_arrow}
                      width="20px"
                      height="20px"
                      style={{ marginRight: '10px' }}
                      onClick={() => onNextPageClicked()}
                    />
                    <img
                      alt="Logo"
                      src={last_page_arrow}
                      width="20px"
                      height="20px"
                      onClick={() => onLastPageClicked()}
                    />
                  </div>
                </div>
              </div>
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
    </Page>
  );
};
export default TallyExp;
