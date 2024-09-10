import React, { useState, useEffect } from 'react';
import {
  Paper,
  makeStyles,
  InputAdornment,
  IconButton,
  Grid,
  Typography,
  Avatar
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from '../../../../components/controls/index';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { AgGridReact } from 'ag-grid-react';
import TextField from '@material-ui/core/TextField';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import * as Db from '../../../../RxDb/Database/Database';
import BubbleLoader from '../../../../components/loader';
import useWindowDimensions from '../../../../components/windowDimension';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import dateFormat from 'dateformat';
import AddCreditNote from 'src/views/sales/SalesReturn/AddCreditNote';
import AddPurchasesBill from 'src/views/purchases/PurchaseBill/AddPurchase';
import AddExpenses from 'src/views/Expenses/Modal/AddExpenses';
import ProductModal from 'src/components/modal/ProductModal';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 2,
    borderRadius: '12px',
    '& .makeStyles-paper-31': {
      borderRadius: '12px'
    }
  },
  paperRoot: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: 6
  },
  newButton: {
    position: 'relative',
    borderRadius: 25
  },
  searchInputRoot: {
    borderRadius: 50
  },
  sectionHeader: {
    marginBottom: 10
  },
  tableRow: {
    '&.Mui-selected': {
      backgroundColor: '#CEE6F3 !important'
    }
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    borderRadius: '12px'
  },
  contentRight: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  },
  categoryActionWrapper: {
    paddingRight: '10px',
    '& .category-actions-left': {
      '& > *': {
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    },
    '& .category-actions-right': {
      '& > *': {
        marginLeft: theme.spacing(2),
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    }
  },
  card: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    alignItems: 'center',
    flexDirection: 'row'
  },

  label: {
    flexDirection: 'column'
  },
  iconLabel: {
    fontSize: 'x-small'
  },
  headerRoot: {
    minWidth: 200,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    padding: '3px 0px 0px 8px'
  },
  texthead: {
    textColor: '#86ca94',
    marginLeft: theme.spacing(2)
  },
  text: { textColor: '#faab53' },
  plus: {
    margin: 6,
    paddingTop: 23,
    fontSize: '20px'
  }
}));

const FormNo26Q = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const { height } = useWindowDimensions();
  const [custSub, setCustSub] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  let [onChange, setOnChange] = useState(false);
  const [limit] = useState(10);
  let [allPurchaseData, setAllPurchaseData] = useState([]);
  let [totalTDS, setTotalTDS] = useState(0);

  const { openAddSalesReturn } = toJS(stores.ReturnsAddStore);
  const { OpenAddPurchaseBill } = toJS(stores.PurchasesAddStore);
  const { addExpensesDialogue } = toJS(stores.ExpensesStore);
  const { viewOrEditSaleReturnTxnItem } = stores.ReturnsAddStore;
  const { viewOrEditPurchaseTxnItem } = stores.PurchasesAddStore;
  const { viewOrEditExpenseItem } = stores.ExpensesStore;
  const { productDialogOpen } = toJS(stores.ProductStore);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
    window.addEventListener('resize', function () {
      setTimeout(function () {
        params.api.sizeColumnsToFit();
      });
    });
  };

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

  const calculateAggrigatedValues = async (response) => {
    let totalTDS = 0;

    response.forEach((res) => {
      totalTDS += res.tdsAmount;
    });

    totalTDS = parseFloat(totalTDS).toFixed(2);

    //set env variables
    setTotalTDS(totalTDS);
  };

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    filter: true,
    rowHeight: 10,
    headerHeight: 30,
    minWidth: 150,
    suppressMenuHide: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  function dateFormatter(params) {
    var dateAsString = params.data.date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const handleCellClicked = async (event) => {
    const colId = event.column.getId();

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    if ('sequenceNumber' === colId) {
      if ('Purchases' === event.data.txnType) {
        const query = db.purchases.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { bill_number: { $eq: event.data.id } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (!data) {
              // No Sales data is not found so cannot update any information
              return;
            }

            viewOrEditPurchaseTxnItem(data);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      } else if ('Sales Return' === event.data.txnType) {
        const query = db.salesreturn.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sales_return_number: { $eq: event.data.id } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (!data) {
              // No Sales data is not found so cannot update any information
              return;
            }

            let clone = JSON.parse(JSON.stringify(data));
            viewOrEditSaleReturnTxnItem(clone);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      } else if ('Expenses' === event.data.txnType) {
        const query = db.expenses.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { expenseId: { $eq: event.data.id } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (!data) {
              // No Sales data is not found so cannot update any information
              return;
            }

            let clone = JSON.parse(JSON.stringify(data));
            viewOrEditExpenseItem(clone);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      }
    }
  };

  const [columnDefs] = useState([
    {
      headerName: 'INVOICE NO',
      field: 'sequenceNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>INVOICE</p>
            <p>NO</p>
          </div>
        );
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'DATE',
      field: 'date',
      valueFormatter: dateFormatter,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'PARTY NAME',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PARTY</p>
            <p>NAME</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';
        if (data.txnType === 'Sales Return') {
          result = data.customerName;
        } else {
          result = data.vendorName;
        }
        return result;
      }
    },
    {
      headerName: 'PARTY GSTN',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PARTY</p>
            <p>GSTN</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';
        if (data.txnType === 'Sales Return') {
          result = data.customerGSTNo;
        } else {
          result = data.vendorGSTNo;
        }
        return result;
      }
    },
    {
      headerName: 'PARTY PAN',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PARTY</p>
            <p>PAN</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';
        if (data.txnType === 'Sales Return') {
          result = data.customerPAN;
        } else {
          result = data.vendorPAN;
        }
        return result;
      }
    },
    {
      headerName: 'TOTAL VALUE',
      field: 'amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = parseFloat(data['amount']).toFixed(2);
        return result;
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TOTAL</p>
            <p>VALUE</p>
          </div>
        );
      }
    },
    {
      headerName: 'AMOUNT PAID',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;
        if (data['isCredit']) {
          result = data['linkedAmount'];
        } else {
          result = data['amount'];
        }
        return parseFloat(result).toFixed(2);
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>AMOUNT</p>
            <p>PAID</p>
          </div>
        );
      }
    },
    {
      headerName: 'TDS DEDUCTED',
      field: 'tdsAmount',
      width: 90,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TDS</p>
            <p>DEDUCTED</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = parseFloat(data['tdsAmount']).toFixed(2);
        return result;
      },
    },
    {
      headerName: 'TDS Code',
      field: 'tdsCode',
      width: 80,
      minWidth: 80,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TDS</p>
            <p>CODE</p>
          </div>
        );
      }
    },
    {
      headerName: 'TDS NAME',
      field: 'tdsName',
      width: 90,
      minWidth: 100,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TDS</p>
            <p>NAME</p>
          </div>
        );
      }
    },
    {
      headerName: 'TDS RATE(%)',
      field: 'tdsRate',
      width: 90,
      minWidth: 100,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TDS</p>
            <p>RATE(%)</p>
          </div>
        );
      }
    }
  ]);

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  function formatDownloadExcelDate(dateAsString) {
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  function getPaidData(data) {
    let result = 0;

    if (data.isCredit) {
      result = data.linkedAmount;
    } else {
      result = data.amount;
    }

    return result;
  }

  function getVendorName(data) {
    let result = '';
    if (data.txnType === 'Sales Return') {
      result = data.customerName;
    } else {
      result = data.vendorName;
    }
    return result;
  }

  function getVendorGSTN(data) {
    let result = '';
    if (data.txnType === 'Sales Return') {
      result = data.customerGSTNo;
    } else {
      result = data.vendorGSTNo;
    }
    return result;
  }

  function getVendorPAN(data) {
    let result = '';
    if (data.txnType === 'Sales Return') {
      result = data.customerPAN;
    } else {
      result = data.vendorPAN;
    }
    return result;
  }

  const getDataFromPurchases = async () => {
    const wb = new Workbook();
    let xlsxPurchaseData = await getAllPurchaseDataByDateXlsx(fromDate, toDate);

    let data = [];
    if (xlsxPurchaseData && xlsxPurchaseData.length > 0) {
      for (var i = 0; i < xlsxPurchaseData.length; i++) {
        const record = {
          DATE: formatDownloadExcelDate(xlsxPurchaseData[i].date),
          'PARTY NAME': getVendorName(xlsxPurchaseData[i]),
          'PARTY GSTN': getVendorGSTN(xlsxPurchaseData[i]),
          'PARTY PAN': getVendorPAN(xlsxPurchaseData[i]),
          'INVOICE NO': xlsxPurchaseData[i].sequenceNumber,
          'TOTAL VALUE': xlsxPurchaseData[i].amount,
          'AMOUNT PAID': getPaidData(xlsxPurchaseData[i]),
          'TDS DEDUCTED': parseFloat(xlsxPurchaseData[i].tdsAmount).toFixed(2),
          'TDS CODE': xlsxPurchaseData[i].tdsCode,
          'TDS NAME': xlsxPurchaseData[i].tdsName,
          'TDS RATE(%)': xlsxPurchaseData[i].tdsRate
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        'PARTY NAME': '',
        'PARTY GSTN': '',
        'PARTY PAN': '',
        'INVOICE NO': '',
        'TOTAL VALUE': '',
        'AMOUNT PAID': '',
        'TDS PAID': '',
        'TDS CODE': '',
        'TDS NAME': '',
        'TDS RATE(%)': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('TDS Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['TDS Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'FormNo26Q_Report';

    download(url, fileName + '.xlsx');
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

  const [purchasesData, setPurchaseData] = useState([]);

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);

  const [fromDate, setFromDate] = React.useState();
  const [toDate, setToDate] = React.useState();

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      if (target) {
        if (fromDate && toDate) {
          getPurchaseDataBySearch(target);
        }
      } else {
        if (fromDate && toDate) {
          getPurchaseDataByDate(fromDate, toDate);
        }
      }
    } else {
      if (fromDate && toDate) {
        getPurchaseDataByDate(fromDate, toDate);
      }
    }
  };

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setOnChange(false);
        setPurchaseData([]);
        await getPurchaseDataByDate(fromDate, toDate);
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getPurchaseDataByDate = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setPurchaseData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPurchaseDataByDate(fromDate, toDate);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.alltransactions.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          },
          {
            tdsAmount: {
              $gt: 0
            }
          },
          {
            $or: [
              { txnType: { $eq: 'Sales Return' } },
              { txnType: { $eq: 'Purchases' } },
              { txnType: { $eq: 'Expenses' } }
            ]
          }
        ]
      },
      sort: [{ date: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      setPurchaseData(response);
      calculateAggrigatedValues(response);
    });
  };

  const getAllPurchaseDataByDate = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.alltransactions.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          },
          {
            tdsAmount: {
              $gt: 0
            }
          },
          {
            $or: [
              { txnType: { $eq: 'Sales Return' } },
              { txnType: { $eq: 'Purchases' } },
              { txnType: { $eq: 'Expenses' } }
            ]
          }
        ]
      },
      sort: [{ date: 'desc' }]
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      let response = data.map((item) => {
        let output = {};

        output.total_amount = item.total_amount;
        output.balance_amount = item.balance_amount;
        output.order_type = item.order_type;

        ++count;
        return output;
      });

      setAllPurchaseData(response);

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const getPurchaseDataBySearch = async (value) => {
    const db = await Db.get();
    var Query;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    let skip = 0;
    setPurchaseData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPurchaseDataBySearch(value);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.alltransactions.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tdsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales Return' } },
                  { txnType: { $eq: 'Purchases' } },
                  { txnType: { $eq: 'Expenses' } }
                ]
              },
              { customerName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tdsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales Return' } },
                  { txnType: { $eq: 'Purchases' } },
                  { txnType: { $eq: 'Expenses' } }
                ]
              },
              { vendorName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tdsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales Return' } },
                  { txnType: { $eq: 'Purchases' } },
                  { txnType: { $eq: 'Expenses' } }
                ]
              },
              { customerGSTNo: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tdsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales Return' } },
                  { txnType: { $eq: 'Purchases' } },
                  { txnType: { $eq: 'Expenses' } }
                ]
              },
              { vendorGSTNo: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tdsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales Return' } },
                  { txnType: { $eq: 'Purchases' } },
                  { txnType: { $eq: 'Expenses' } }
                ]
              },
              { customerPAN: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tdsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales Return' } },
                  { txnType: { $eq: 'Purchases' } },
                  { txnType: { $eq: 'Expenses' } }
                ]
              },
              { vendorPAN: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tdsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales Return' } },
                  { txnType: { $eq: 'Purchases' } },
                  { txnType: { $eq: 'Expenses' } }
                ]
              },
              { sequenceNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tdsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales Return' } },
                  { txnType: { $eq: 'Purchases' } },
                  { txnType: { $eq: 'Expenses' } }
                ]
              },
              { tdsName: { $regex: regexp } }
            ]
          }
        ]
      },
      sort: [{ date: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      setPurchaseData(response);
      calculateAggrigatedValues(response);
    });
  };

  const getAllPurchaseDataBySearch = async (value) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    Query = db.alltransactions.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tdsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales Return' } },
                  { txnType: { $eq: 'Purchases' } },
                  { txnType: { $eq: 'Expenses' } }
                ]
              },
              { customerName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tdsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales Return' } },
                  { txnType: { $eq: 'Purchases' } },
                  { txnType: { $eq: 'Expenses' } }
                ]
              },
              { vendorName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tdsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales Return' } },
                  { txnType: { $eq: 'Purchases' } },
                  { txnType: { $eq: 'Expenses' } }
                ]
              },
              { customerGSTNo: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tdsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales Return' } },
                  { txnType: { $eq: 'Purchases' } },
                  { txnType: { $eq: 'Expenses' } }
                ]
              },
              { vendorGSTNo: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tdsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales Return' } },
                  { txnType: { $eq: 'Purchases' } },
                  { txnType: { $eq: 'Expenses' } }
                ]
              },
              { customerPAN: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tdsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales Return' } },
                  { txnType: { $eq: 'Purchases' } },
                  { txnType: { $eq: 'Expenses' } }
                ]
              },
              { vendorPAN: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tdsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales Return' } },
                  { txnType: { $eq: 'Purchases' } },
                  { txnType: { $eq: 'Expenses' } }
                ]
              },
              { sequenceNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tdsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales Return' } },
                  { txnType: { $eq: 'Purchases' } },
                  { txnType: { $eq: 'Expenses' } }
                ]
              },
              { tdsName: { $regex: regexp } }
            ]
          }
        ]
      },
      sort: [{ date: 'desc' }]
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      let response = data.map((item) => {
        let output = {};

        output.total_amount = item.total_amount;
        output.balance_amount = item.balance_amount;
        output.order_type = item.order_type;

        ++count;
        return output;
      });

      setAllPurchaseData(response);

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const getAllPurchaseDataByDateXlsx = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.alltransactions.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          },
          {
            tdsAmount: {
              $gt: 0
            }
          },
          {
            $or: [
              { txnType: { $eq: 'Sales Return' } },
              { txnType: { $eq: 'Purchases' } },
              { txnType: { $eq: 'Expenses' } }
            ]
          },
          {
            updatedAt: { $exists: true }
          }
        ]
      },
      sort: [{ date: 'asc' }]
    });

    let response = [];
    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      response = data.map((item) => item);
    });
    return response;
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    setFromDate(formatDate(firstThisMonth));
    setToDate(formatDate(todayDate));
    setOnChange(true);

    setTimeout(() => setLoadingShown(false), 200);
    return () => custSub.map((sub) => sub.unsubscribe());
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Tax Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div className={classes.root} style={{ minHeight: height - 60 }}>
          {isFeatureAvailable ? (
            <Paper className={classes.root} style={{ minHeight: height - 60 }}>
              <div className={classes.content}>
                <div className={classes.contentLeft}>
                  <Typography gutterBottom variant="h4" component="h4">
                    FORM NO. 26Q
                  </Typography>
                </div>
              </div>

              <Grid container className={classes.categoryActionWrapper}>
                <Grid item xs={8}>
                  <div>
                    <form className={classes.blockLine} noValidate>
                      <TextField
                        id="date"
                        label="From"
                        type="date"
                        value={fromDate}
                        onChange={(e) => {
                          setFromDate(formatDate(e.target.value));
                          setOnChange(true);
                          setCurrentPage(1);
                          setTotalPages(1);
                        }}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </form>
                    <form className={classes.blockLine} noValidate>
                      <TextField
                        id="date"
                        label="To"
                        type="date"
                        value={toDate}
                        onChange={(e) => {
                          setToDate(formatDate(e.target.value));
                          setOnChange(true);
                          setCurrentPage(1);
                          setTotalPages(1);
                        }}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </form>
                  </div>
                </Grid>
              </Grid>

              <Grid
                container
                direction="row"
                alignItems="center"
                className={classes.sectionHeader}
              >
                <Grid item xs={12} sm={7}>
                  {/* <Typography variant="h4" style={{marginLeft:'10px'}}>Transaction</Typography> */}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={5}
                  align="right"
                  className={classes.categoryActionWrapper}
                >
                  <Grid container direction="row" alignItems="center">
                    <Grid item xs={10} align="right">
                      <Controls.Input
                        placeholder="Search Transaction"
                        size="small"
                        fullWidth
                        InputProps={{
                          classes: {
                            root: classes.searchInputRoot,
                            input: classes.searchInputInput
                          },
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          )
                        }}
                        onChange={handleSearch}
                      />
                    </Grid>
                    <Grid item sm={2} className="category-actions-right">
                      <Avatar>
                        <IconButton onClick={() => getDataFromPurchases()}>
                          <Excel fontSize="inherit" />
                        </IconButton>
                      </Avatar>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <div
                style={{
                  width: '100%',
                  height: height - 265 + 'px'
                }}
                className=" blue-theme"
              >
                <div
                  id="sales-invoice-grid"
                  style={{ height: '95%', width: '100%' }}
                  className="ag-theme-material"
                >
                  <AgGridReact
                    onGridReady={onGridReady}
                    enableRangeSelection
                    paginationPageSize={10}
                    suppressMenuHide
                    rowData={purchasesData}
                    rowSelection="single"
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination
                    headerHeight={40}
                    suppressPaginationPanel={true}
                    suppressScrollOnNewData={true}
                    onCellClicked={handleCellClicked}
                    overlayLoadingTemplate={
                      '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                    }
                    overlayNoRowsTemplate={
                      '<span className="ag-overlay-loading-center">No Rows to Show!</span>'
                    }
                  />
                  <div
                    style={{
                      display: 'flex',
                      float: 'right',
                      marginTop: '2px'
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
              <div>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginLeft: '15px',
                      marginTop: '15px'
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      style={{ display: 'flex', flexDirection: 'row' }}
                    >
                      <Grid item>
                        <Typography>Total TDS : {totalTDS} </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
      {openAddSalesReturn ? <AddCreditNote /> : null}
      {OpenAddPurchaseBill ? <AddPurchasesBill /> : null}
      {addExpensesDialogue ? <AddExpenses /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(FormNo26Q);