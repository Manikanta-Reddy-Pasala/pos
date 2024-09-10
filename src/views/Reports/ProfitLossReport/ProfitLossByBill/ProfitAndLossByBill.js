import React, { useState, useEffect } from 'react';
import {
  Paper,
  makeStyles,
  InputAdornment,
  IconButton,
  Grid,
  Typography,
  Avatar,
  Button,
  Box
} from '@material-ui/core';
import { Search, Print } from '@material-ui/icons';
import Controls from '../../../../components/controls/index';
import * as Db from '../../../../RxDb/Database/Database';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { AgGridReact } from 'ag-grid-react';
import TextField from '@material-ui/core/TextField';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import Arrowtopright from '../../../../icons/Arrowtopright';
import Arrowbottomleft from '../../../../icons/Arrowbottomleft';
import ProfitLossDetail from '../../../../components/modal/ProfitLossByBillModal';
import useWindowDimensions from '../../../../components/windowDimension';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import { getCustomerAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice/index';
import { toJS } from 'mobx';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
import ProductModal from 'src/components/modal/ProductModal';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 2,
    borderRadius: '12px'
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
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
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
  input: {
    width: '90%'
  },
  contentRight: {
    display: 'flex',
    justifyContent: 'space-between'
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
  listbox: {
    minWidth: '30%',
    margin: 0,
    padding: 5,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    textAlign: 'left',
    border: '1px solid rgba(0,0,0,.25)',
    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    },
    '& li:active': {
      backgroundColor: '#2977f5',
      color: 'white'
    }
  },
  tableForm: {
    padding: '10px 6px'
  },
  bootstrapInput: {
    borderRadius: 2,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '5px 12px',
    width: 'calc(100% - 30px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: ['Nunito Sans, Roboto, sans-serif'].join(','),
    '&:focus': {
      borderColor: '#ff7961'
      // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  bootstrapFormLabel: {
    fontSize: 16
  },
  alignCenter: {
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  greenText: {
    color: '#339900'
  },
  redText: {
    color: '#EF5350'
  }
}));

const ProfitAndLossByBill = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [totalPLAmount, settotalPLAmount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [onChange, setOnChange] = useState(true);
  const [limit] = useState(10);

  const store = useStore();
  const { openAddSalesInvoice, isLaunchEWayAfterSaleCreation, printData } =
    toJS(store.SalesAddStore);
  const { viewOrEditItem, resetEWayLaunchFlag } = store.SalesAddStore;
  const { openEWayGenerateModal } = toJS(store.EWayStore);
  const { productDialogOpen } = toJS(store.ProductStore);
  const { handleOpenEWayGenerateModal } = store.EWayStore;

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
    var dateAsString = params.data.invoice_date;
    if (dateAsString) {
      var dateParts = dateAsString.split('-');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }
  }

  const statusCellStyle = (params) => {
    let data = params['data'];
    if (data['profit_loss'] > 0) {
      return { color: '#339900', fontWeight: 500 };
    } else {
      return { color: '#EF5350', fontWeight: 500 };
    }
  };

  const handleCellClicked = (event) => {
    const colId = event.column.getId();

    if ('sequenceNumber' === colId) {
      viewOrEditItem(event.data);
    }
  };

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const [columnDefs] = useState([
    {
      headerName: 'INVOICE NO',
      field: 'sequenceNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'DATE',
      field: 'invoice_date',
      valueFormatter: dateFormatter,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'CUSTOMER',
      field: 'customer_name',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'TOTAL SALE AMOUNT',
      field: 'total_amount',
      valueFormatter: (params) => {
        return params['data']['total_amount']
          ? parseFloat(params['data']['total_amount']).toFixed(2)
          : '0';
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TOTAL</p>
            <p>SALE AMOUNT</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'PROFIT/LOSS',
      field: 'profit_loss',
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PROFIT/</p>
            <p>LOSS</p>
          </div>
        );
      },
      cellStyle: statusCellStyle,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    }
  ]);

  const TemplateActionRenderer = (props) => {
    return (
      <Box>
        <Button size="small" onClick={() => handleProfitLossDetailOpen(props)}>
          Details
        </Button>
      </Box>
    );
  };

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromSales = async () => {
    const wb = new Workbook();
    let xlsxData = await getSalesListForPlByBillxlsx(
      fromDate,
      toDate,
      customerPhoneNo
    );
    let data = [];
    if (xlsxData && xlsxData.length > 0) {
      for (var i = 0; i < xlsxData.length; i++) {
        const record = {
          DATE: xlsxData[i].invoice_date,
          'INVOICE NUMBER': xlsxData[i].sequenceNumber,
          CUSTOMER: xlsxData[i].customer_name,
          'TOTAL SALE AMOUNT': xlsxData[i].total_amount,
          'PROFIT/LOSS': xlsxData[i].profit_loss
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        'INVOICE NUMBER': '',
        CUSTOMER: '',
        'TOTAL SALE AMOUNT': '',
        'PROFIT/LOSS': ''
      };
      data.push(record);
    }

    const emptyRecord = {};
    data.push(emptyRecord);
    data.push(emptyRecord);

    const totalSalesRecord = {
      DATE: 'Total Sales',
      'INVOICE NUMBER': totalSalesAmount
    };
    data.push(totalSalesRecord);

    const totalProfitLossRecord = {
      DATE: 'Total Profit/Loss',
      'INVOICE NUMBER': totalPLAmount
    };
    data.push(totalProfitLossRecord);

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Profit By Transaction Sheet');

    // console.log('test:: ws::', ws);
    wb.Sheets['Profit By Transaction Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Profit_By_Transaction_Report';

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

  const TempaltePrintShareRenderer = (props) => {
    return (
      <div>
        <IconButton disableRipple disableFocusRipple disableTouchRipple>
          <Print fontSize="inherit" />{' '}
        </IconButton>
        {/* <IconButton disableRipple disableFocusRipple>
          <Sharemenu fontSize="inherit" menu={sharemenu} />
        </IconButton> */}
      </div>
    );
  };

  const {
    addSalesJSONData,
    setCustomerList,
    handleSalesByCustomerSearch,
    handleProfitLossDetailOpen
  } = stores.SalesAddStore;

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);

  const [fromDate, setFromDate] = React.useState();
  const [toDate, setToDate] = React.useState();
  const [customerList, setcustomerList] = React.useState();
  const [customerName, setCustomerName] = React.useState('');
  const [customerPhoneNo, setCustomerPhoneNo] = React.useState('');
  const [rowData, setRowData] = React.useState([]);

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const getSalesListForPlByBill = async (phoneNo) => {
    const db = await Db.get();

    let skip = 0;
    var query;

    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSalesListForPlByBill(db, phoneNo);
    }
    const businessData = await Bd.getBusinessData();

    if (phoneNo) {
      query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: fromDate
              }
            },
            {
              invoice_date: {
                $lte: toDate
              }
            },
            {
              customer_phoneNo: {
                $eq: phoneNo
              }
            },
            {
              invoice_date: { $exists: true }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        skip: skip,
        limit: limit,
        sort: [{ invoice_date: 'desc' }]
      });
    } else {
      query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              invoice_date: {
                $gte: fromDate
              }
            },
            {
              invoice_date: {
                $lte: toDate
              }
            },
            {
              invoice_date: { $exists: true }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        skip: skip,
        limit: limit,
        sort: [{ invoice_date: 'desc' }]
      });
    }

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          return;
        }

        let response = data.map((item) => {
          let row = item.toJSON();
          let purchasedPrice = 0;

          for (let item of row.item_list) {
            purchasedPrice =
              parseFloat(purchasedPrice) +
              parseFloat(item.qty * item.purchased_price);
          }
          row.profit_loss =
            parseFloat(row.total_amount) - parseFloat(purchasedPrice);

          return row;
        });

        setRowData(response);
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  const getSalesListForPlByBillxlsx = async (fromDate, toDate, phoneNo) => {
    const db = await Db.get();

    var query;
    let result = [];
    const businessData = await Bd.getBusinessData();

    if (fromDate || toDate) {
      if (phoneNo) {
        query = db.sales.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              },
              {
                customer_phoneNo: {
                  $eq: phoneNo
                }
              },
              {
                invoice_date: { $exists: true }
              },
              {
                updatedAt: { $exists: true }
              }
            ]
          },
          sort: [{ invoice_date: 'asc' }]
        });
      } else {
        query = db.sales.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              },
              {
                invoice_date: { $exists: true }
              },
              {
                updatedAt: { $exists: true }
              }
            ]
          },
          sort: [{ invoice_date: 'asc' }]
        });
      }
    }

    if (query) {
      await query
        .exec()
        .then(async (data) => {
          if (!data) {
            return;
          }

          data.map((item) => {
            let row = item.toJSON();
            let purchasedPrice = 0;

            for (let item of row.item_list) {
              purchasedPrice =
                parseFloat(purchasedPrice) +
                parseFloat(item.qty * item.purchased_price);
            }
            row.profit_loss =
              parseFloat(row.total_amount) - parseFloat(purchasedPrice);

            result.push(row);
          });
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
      return result;
    }
  };

  const getAllSalesListForPlByBill = async (db, mobileNo) => {
    var Query;
    const businessData = await Bd.getBusinessData();

    if (mobileNo) {
      Query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: fromDate
              }
            },
            {
              invoice_date: {
                $lte: toDate
              }
            },
            {
              customer_phoneNo: {
                $eq: mobileNo
              }
            },
            {
              invoice_date: { $exists: true }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }]
      });
    } else {
      Query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: fromDate
              }
            },
            {
              invoice_date: {
                $lte: toDate
              }
            },
            {
              invoice_date: { $exists: true }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }]
      });
    }

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      count = data.length;

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();

      if (customerPhoneNo.length >= 10) {
        if (target) {
          setRowData(
            await handleSalesByCustomerSearch(
              target,
              fromDate,
              toDate,
              customerPhoneNo
            )
          );
        } else {
          await getSalesListForPlByBill(customerPhoneNo);
        }
      }
    }
  };

  const getCustomerList = async (value) => {
    setcustomerList(await getCustomerAutoCompleteList(value));
  };

  const handleCustomerClick = async (customer) => {
    setCustomerName(customer.name);
    setCustomerPhoneNo(customer.phoneNo);

    setcustomerList([]);
    setCurrentPage(1);
    setTotalPages(1);
    await getSalesListForPlByBill(customer.phoneNo);
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    setFromDate(formatDate(firstThisMonth));
    setToDate(formatDate(todayDate));
    setCustomerList([]);
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('P&L Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  const calculateTotalSumValues = () => {
    let saleAmount = 0;
    let plAmount = 0;
    for (let item of rowData) {
      saleAmount =
        (parseFloat(saleAmount) || 0) + (parseFloat(item.total_amount) || 0);
      plAmount =
        (parseFloat(plAmount) || 0) + (parseFloat(item.profit_loss) || 0);
    }
    setTotalSalesAmount(saleAmount);
    settotalPLAmount(plAmount);
  };

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setOnChange(false);
        await getSalesListForPlByBill(customerPhoneNo);
      }
    };

    loadPaginationData();
  }, [onChange]);

  useEffect(() => {
    // calculate total sales amount and Total Profit/Loss

    if (rowData.length > 0) {
      if (gridApi) {
        if (rowData) {
          gridApi.setRowData(rowData);
        }
      }
      calculateTotalSumValues();
    }
  }, [rowData]);

  function resetData() {
    setRowData([]);
    setTotalSalesAmount(0);
    settotalPLAmount(0);
  }

  useEffect(() => {
    if (isLaunchEWayAfterSaleCreation === true) {
      handleOpenEWayGenerateModal('Invoice', printData);

      resetEWayLaunchFlag();
    }
  }, [isLaunchEWayAfterSaleCreation]);

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div className={classes.root} style={{ minHeight: height - 83 }}>
          {isFeatureAvailable ? (
            <Paper className={classes.root} style={{ minHeight: height - 83 }}>
              <div className={classes.content}>
                <div className={classes.contentLeft}>
                  <Typography gutterBottom variant="h4" component="h4">
                    PROFIT BY TRANSACTION
                  </Typography>
                </div>
              </div>

              <Grid container className={classes.categoryActionWrapper}>
                <Grid item xs={5}>
                  <div>
                    <form className={classes.blockLine} noValidate>
                      <TextField
                        id="date"
                        label="From"
                        type="date"
                        value={fromDate}
                        onChange={(e) => {
                          setCurrentPage(1);
                          setTotalPages(1);
                          setFromDate(formatDate(e.target.value));
                          setOnChange(true);
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
                        className={classes.textField}
                        onChange={(e) => {
                          setCurrentPage(1);
                          setTotalPages(1);
                          setToDate(formatDate(e.target.value));
                          setOnChange(true);
                        }}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </form>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={3}
                  style={{ marginTop: 'auto', marginLeft: '-10%' }}
                >
                  <div className={classes.blockLine}>
                    <div className={classes.nameList}>
                      <TextField
                        fullWidth
                        placeholder="Select Customer *"
                        className={classes.input}
                        value={customerName}
                        onChange={(e) => {
                          if (e.target.value !== customerName) {
                            setCustomerName(e.target.value);
                          }
                          getCustomerList(e.target.value);

                          if (e.target.value.length === 0) {
                            setCurrentPage(1);
                            setTotalPages(1);
                            getSalesListForPlByBill();
                          }
                        }}
                        InputProps={{
                          disableUnderline: true,
                          classes: {
                            root: classes.bootstrapRoot,
                            input: classes.bootstrapInput
                          }
                        }}
                        InputLabelProps={{
                          shrink: true,
                          className: classes.bootstrapFormLabel
                        }}
                      />
                      {customerList && customerList.length > 0 ? (
                        <>
                          <ul
                            className={classes.listbox}
                            style={{ width: '18%' }}
                          >
                            <li>
                              <Grid container justify="space-between">
                                {customerList.length === 1 &&
                                customerList[0].name === '' ? (
                                  <Grid item></Grid>
                                ) : (
                                  <Grid item>
                                    <Button
                                      size="small"
                                      style={{
                                        position: 'relative',
                                        fontSize: 12
                                      }}
                                    >
                                      Balance
                                    </Button>
                                  </Grid>
                                )}
                              </Grid>
                            </li>
                            {customerList.length === 1 &&
                            customerList[0].name === '' ? (
                              <li></li>
                            ) : (
                              <div>
                                {customerList.map((option, index) => (
                                  <li
                                    key={`${index}vendor`}
                                    style={{ padding: 10, cursor: 'pointer' }}
                                    onClick={() => {
                                      handleCustomerClick(option);
                                    }}
                                  >
                                    <Grid container justify="space-between">
                                      <Grid item style={{ color: 'black' }}>
                                        {option.name}
                                        <br />
                                        {option.phoneNo}
                                      </Grid>
                                      <Grid item style={{ color: 'black' }}>
                                        {' '}
                                        <span>
                                          {parseFloat(option.balance).toFixed(
                                            2
                                          )}
                                        </span>
                                        {option.balance > 0 ? (
                                          option.balanceType === 'Payable' ? (
                                            <Arrowtopright fontSize="inherit" />
                                          ) : (
                                            <Arrowbottomleft fontSize="inherit" />
                                          )
                                        ) : (
                                          ''
                                        )}
                                      </Grid>
                                    </Grid>
                                  </li>
                                ))}
                              </div>
                            )}
                          </ul>
                        </>
                      ) : null}
                    </div>
                  </div>
                </Grid>
              </Grid>

              <Grid
                container
                direction="row"
                alignItems="center"
                className={classes.sectionHeader}
                style={{ marginTop: '16px' }}
              >
                <Grid item xs={12} sm={7}>
                  {/* <Typography variant="h4">Transaction</Typography> */}
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

                    <Grid xs={2} className="category-actions-right">
                      <Avatar>
                        <IconButton onClick={() => getDataFromSales()}>
                          <Excel fontSize="inherit" />
                        </IconButton>
                      </Avatar>
                      {/* <IconButton classes={{ label: classes.label }}>
              <Print fontSize="inherit" />
              <span className={classes.iconLabel}>Print</span>
                  </IconButton> */}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <div
                style={{
                  width: '100%',
                  height: height - 300 + 'px'
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
                    enableRangeSelection={true}
                    paginationPageSize={10}
                    suppressMenuHide={true}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowSelection="single"
                    pagination={true}
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
                    frameworkComponents={{
                      templateActionRenderer: TemplateActionRenderer
                    }}
                  ></AgGridReact>
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

              <div style={{ marginTop: '10px' }}>
                <Grid container>
                  <Grid item xs={12}>
                    <p>Total Sales: &#8377; {totalSalesAmount}</p>
                  </Grid>
                  <Grid item xs={12}>
                    {totalPLAmount > 0 ? (
                      <p className={classes.greenText}>
                        Total Profit/Loss: &#8377; {totalPLAmount}
                      </p>
                    ) : (
                      <p className={classes.redText}>
                        Total Profit/Loss: &#8377; {totalPLAmount}
                      </p>
                    )}
                  </Grid>
                </Grid>
              </div>
              <ProfitLossDetail />
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
      {openAddSalesInvoice ? <AddSalesInvoice /> : null}
      {openEWayGenerateModal ? <EWayGenerate /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(ProfitAndLossByBill);