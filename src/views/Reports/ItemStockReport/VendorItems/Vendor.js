import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Paper,
  Button
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import TextField from '@material-ui/core/TextField';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import * as Db from '../../../../RxDb/Database/Database';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import useWindowDimensions from '../../../../components/windowDimension';
import Arrowtopright from '../../../../icons/Arrowtopright';
import Arrowbottomleft from '../../../../icons/Arrowbottomleft';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import { getVendorAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import ProductModal from 'src/components/modal/ProductModal';
import { toJS } from 'mobx';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none'
  },

  selectFont: {
    fontSize: '13px'
  },
  noLabel: {
    marginTop: theme.spacing(3)
  },
  datepickerbg: {
    '& .MuiPickersToolbar-toolbar': {
      backgroundColor: '#ef5350 !important'
    },
    '& .MuiButton-textPrimary': {
      color: '#ef5350 !important'
    },
    '& .MuiPickersDay-daySelected': {
      backgroundColor: '#ef5350 !important'
    }
  },
  selectOption: {
    float: 'left',
    '& .makeStyles-formControl-53': {
      borderRadius: '7px'
    }
  },
  datePickerOption: {
    float: 'right',
    display: 'inline-block',
    marginRight: '26px'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
    '& .MuiSelect-selectMenu': {
      background: 'white'
    }
  },
  paymentTypeOption: {
    margin: theme.spacing(2),
    minWidth: 120
  },
  itemTable: {
    width: '100%',
    display: 'inline-block'
  },
  roundOff: {
    '& .MuiFormControl-root': {
      background: 'white',
      verticalAlign: 'inherit',
      width: '100px',
      paddingLeft: '10px'
    }
  },
  searchInputRoot: {
    borderRadius: 50,
    marginLeft: '-12px',
    marginTop: '13px'
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

  inputField: {
    '& .MuiOutlinedInput-input': {
      padding: '8px'
    },
    '& .MuiOutlinedInput-root': {
      position: 'relative',
      borderRadius: 18
    }
  },
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  },
  radioDate: {
    marginLeft: '13px',
    marginTop: '15px'
  },

  addExpenseBtn: {
    background: '#ffaf00',
    '&:hover': {
      backgroundColor: '#ffaf00'
    },
    color: 'white',
    borderRadius: '20px',
    paddingLeft: '10px',
    paddingRight: '10px',
    textTransform: 'none'
  },
  searchField: {
    marginRight: 20
  },
  root: {
    padding: 2,
    borderRadius: '12px',
    minHeight: '616px',
    '& .makeStyles-paper-31': {
      borderRadius: '12px'
    }
  },

  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
    border: '1px solid grey',
    padding: '6px',
    background: 'white'
  },
  label: {
    flexDirection: 'column'
  },
  iconLabel: {
    fontSize: 'x-small'
  },
  iconAlign: {
    textAlign: 'end',
    padding: '14px'
  },
  footer: {
    borderTop: '1px solid #d8d8d8',
    padding: '20px'
  },
  amount: {
    textAlign: 'center'
  },
  totalQty: {
    color: '#80D5B8',
    textAlign: 'center'
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
  nameList: {
    marginLeft: '12px',
    marginTop: '20px'
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
  }
}));

const VendorItemReport = () => {
  const classes = useStyles();
  const [gridApi, setGridApi] = useState(null);
  const { height } = useWindowDimensions();
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [vendorList, setVendorList] = React.useState();
  const [vendorName, setVendorName] = React.useState('');
  const [vendorId, setVendorId] = React.useState('');
  const [rowData, setRowData] = React.useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [onChange, setOnChange] = useState(false);
  const [limit] = useState(10);

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const [fromDate, setFromDate] = React.useState(formatDate(firstThisMonth));
  const [toDate, setToDate] = React.useState(formatDate(todayDate));

  const store = useStore();
  const { productDialogOpen } = toJS(store.ProductStore);
  const { handleEditProductModalLaunchFromReports } = store.ProductStore;

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const handleCellClicked = async (event) => {
    const colId = event.column.getId();

    if ('productName' === colId) {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      await db.businessproduct
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { productId: { $eq: event.data.productId } }
            ]
          }
        })
        .exec()
        .then(async (data) => {
          if (!data) {
            // No proudct match found
            return;
          }

          handleEditProductModalLaunchFromReports(data);
        });
    }
  };

  const [columnDefs] = useState([
    {
      headerName: 'NAME',
      field: 'productName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'Date',
      field: 'txnDate',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'CATEGORY',
      field: 'categoryLevel2DisplayName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'SUB CATEGORY',
      field: 'categoryLevel3DisplayName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'PURCHASE QTY',
      field: 'purchaseQty',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'PURCHASE AMOUNT',
      field: 'purchaseAmount',
      valueFormatter: (params) => {
        return params['data']['purchaseAmount']
          ? parseFloat(params['data']['purchaseAmount']).toFixed(2)
          : '0';
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'PURCHASE AMOUNT',
      field: 'purchaseAmount',
      valueFormatter: (params) => {
        let data = params['data'];
        let result =
          parseFloat(data['purchaseAmount'] || 0) / data['purchaseQty'];
        return parseFloat(result || 0).toFixed(2);
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>AVG. PURCHASE</p>
            <p>AMOUNT</p>
          </div>
        );
      }
    }
  ]);

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

  function getAverageAmount(amount, qty) {
    let result = amount / qty;
    return parseFloat(result || 0).toFixed(2);
  }

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromExpiryReport = async () => {
    const wb = new Workbook();

    let xlsxData = await getPurchasesOnlyTxnByVendorxlsx(
      vendorId,
      fromDate,
      toDate
    );

    let data = [];
    if (xlsxData && xlsxData.length > 0) {
      for (var i = 0; i < xlsxData.length; i++) {
        const record = {
          NAME: xlsxData[i].productName,
          CATEGORY: xlsxData[i].categoryLevel2DisplayName,
          'SUB CATEGORY': xlsxData[i].categoryLevel3DisplayName,
          'PURCHASE QTY': xlsxData[i].purchaseQty,
          'PURCHASE AMOUNT': xlsxData[i].purchaseAmount,
          'AVG. PURCHASE AMOUNT': getAverageAmount(
            xlsxData[i].purchaseAmount,
            xlsxData[i].purchaseQty
          )
        };
        data.push(record);
      }
    } else {
      const record = {
        NAME: '',
        CATEGORY: '',
        'SUB CATEGORY': '',
        'PURCHASE QTY': '',
        'PURCHASE AMOUNT': '',
        'AVG. PURCHASE AMOUNT': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Product Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Product Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Product_Report_By_Vendor_Report';

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

  const getVendorList = async (value) => {
    setVendorList(await getVendorAutoCompleteList(value));
  };

  const handleVendorClick = async (vendor) => {
    setVendorName(vendor.name);
    setVendorId(vendor.id);
    setVendorList([]);
    const db = await Db.get();
    getPurchasesOnlyTxnByVendor(db, vendor.id, fromDate, toDate);
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    setVendorList([]);
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Item Stock Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange && fromDate && toDate && vendorId) {
        setOnChange(false);
        const db = await Db.get();

        getPurchasesOnlyTxnByVendor(db, vendorId, fromDate, toDate);
      } else {
        setRowData([]);
        setTotalPages(1);
        setCurrentPage(1);
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

  const getPurchasesOnlyTxnByVendor = async (
    db,
    vendorId,
    fromDate,
    toDate
  ) => {
    let results = [];

    let skip = 0;
    setRowData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPurchasesOnlyTxnByVendor(db, fromDate, toDate, vendorId);
    }
    const businessData = await Bd.getBusinessData();

    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { vendorId: { $eq: vendorId } },
            { txnType: { $eq: 'Purchases' } },
            { txnDate: { $gte: fromDate } },
            { txnDate: { $lte: toDate } }
          ]
        },
        skip: skip,
        limit: limit
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }

        data.map((item) => {
          let finalData = item.toJSON();

          finalData.purchaseQty = finalData.txnQty;
          finalData.purchaseAmount = parseFloat(finalData.amount);
          if (
            finalData.productName ||
            finalData.categoryLevel2DisplayName ||
            finalData.categoryLevel3DisplayName
          ) {
            results.push(finalData);
          }
        });
      });
    setRowData(results);
  };

  const getPurchasesOnlyTxnByVendorxlsx = async (
    vendorId,
    fromDate,
    toDate
  ) => {
    let results = [];
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { vendorId: { $eq: vendorId } },
            { txnType: { $eq: 'Purchases' } },
            { txnDate: { $gte: fromDate } },
            { txnDate: { $lte: toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }

        data.map((item) => {
          let finalData = item.toJSON();

          finalData.purchaseQty = finalData.txnQty;
          finalData.purchaseAmount = parseFloat(finalData.amount);
          if (
            finalData.productName ||
            finalData.categoryLevel2DisplayName ||
            finalData.categoryLevel3DisplayName
          ) {
            results.push(finalData);
          }
        });
      });
    return results;
  };

  const getAllPurchasesOnlyTxnByVendor = async (
    db,
    fromDate,
    toDate,
    vendorId
  ) => {
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          { vendorId: { $eq: vendorId } },
          { txnType: { $eq: 'Purchases' } },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    });

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

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
    window.addEventListener('resize', () => {
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      });
    });
  };

  const handleReset = async () => {
    setVendorName('');
    setVendorId('');
    setVendorList([]);
    setRowData([]);
    setOnChange(true);
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
                    PRODUCT REPORT - VENDOR
                  </Typography>
                </div>
              </div>

              <div>
                <Grid container className={classes.categoryActionWrapper}>
                  <Grid item xs={6} style={{ marginTop: 3 }}>
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
                    xs={4}
                    style={{ marginTop: 'auto', marginLeft: '-10%' }}
                  >
                    <Grid style={{ display: 'flex' }} item xs={11}>
                      <div className={classes.blockLine}>
                        <div className={classes.nameList}>
                          <TextField
                            fullWidth
                            placeholder="Select Vendor *"
                            className={classes.input}
                            value={vendorName}
                            onChange={(e) => {
                              if (e.target.value !== vendorName) {
                                setVendorName(e.target.value);
                              }
                              getVendorList(e.target.value);
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
                          {vendorList && vendorList.length > 0 ? (
                            <>
                              <ul
                                className={classes.listbox}
                                style={{ width: '18%' }}
                              >
                                <li>
                                  <Grid container justify="space-between">
                                    {vendorList.length === 1 &&
                                    vendorList[0].name === '' ? (
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
                                {vendorList.length === 1 &&
                                vendorList[0].name === '' ? (
                                  <li></li>
                                ) : (
                                  <div>
                                    {vendorList.map((option, index) => (
                                      <li
                                        key={`${index}vendor`}
                                        style={{
                                          padding: 10,
                                          cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                          handleVendorClick(option);
                                        }}
                                      >
                                        <Grid container justify="space-between">
                                          <Grid item style={{ color: 'black' }}>
                                            {option.name}
                                            <br />
                                            {option.phoneNo}
                                            <br />
                                            <b>
                                              {' '}
                                              GSTIN:{' '}
                                              {option.gstNumber
                                                ? option.gstNumber
                                                : 'NA'}{' '}
                                            </b>
                                          </Grid>
                                          <Grid item style={{ color: 'black' }}>
                                            {' '}
                                            <span>
                                              {parseFloat(
                                                option.balance
                                              ).toFixed(2)}
                                            </span>
                                            {option.balance > 0 ? (
                                              option.balanceType ===
                                              'Payable' ? (
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
                      <Button
                        className={classes.resetbtn}
                        size="small"
                        style={{ marginTop: '16px' }}
                        onClick={() => {
                          handleReset();
                        }}
                        color="secondary"
                      >
                        RESET
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    style={{ marginTop: 'auto', marginLeft: '10%' }}
                  >
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justify="flex-end"
                      className="category-actions-right"
                    >
                      <Avatar>
                        <IconButton onClick={() => getDataFromExpiryReport()}>
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
              </div>

              <div className={classes.itemTable}>
                {/* <App />  */}

                <Box mt={2}>
                  <div
                    style={{
                      width: '100%',
                      height: height - 180 + 'px'
                    }}
                    className=" blue-theme"
                  >
                    <div
                      id="product-list-grid"
                      style={{ height: '95%', width: '100%' }}
                      className="ag-theme-material"
                    >
                      <AgGridReact
                        onGridReady={onGridReady}
                        enableRangeSelection
                        paginationPageSize={10}
                        suppressMenuHide
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        rowSelection="single"
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
                </Box>
              </div>
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(VendorItemReport);