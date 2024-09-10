import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import {
  Box,
  Typography,
  Grid,
  Radio,
  Avatar,
  IconButton,
  Paper,
  Input,
  Select
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import useWindowDimensions from '../../../../components/windowDimension';
import * as moment from 'moment';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import * as Db from '../../../../RxDb/Database/Database';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import MenuItem from '@material-ui/core/MenuItem';
import clsx from 'clsx';
import ProductModal from 'src/components/modal/ProductModal';
import { toJS } from 'mobx';
import { getProductTransactionSettings } from '../../../../components/Helpers/dbQueries/producttransactionsettings';

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
    marginTop: '10px',
    marginBottom: '10px'
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
    minHeight: '616px',
    borderRadius: '12px',
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
  }
}));

const ExpiryReport = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();

  const firstThisMonth = new Date(thisYear, 3, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [onChange, setOnChange] = useState(true);
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

  const [mfDateChecked, setMfDateChecked] = React.useState(false);
  const [expiryDateChecked, setExpiryDateChecked] = React.useState(true);
  const [expiredProductData, setExpiredProductData] = React.useState([]);

  const [warehouse, setWarehouse] = React.useState('');
  const [warehouseList, setWarehouseList] = React.useState([]);

  const store = useStore();
  const { getWarehouse } = store.WarehouseStore;

  const { productDialogOpen } = toJS(store.ProductStore);
  const { handleEditProductModalLaunchFromReports } = store.ProductStore;

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const handleCellClicked = async (event) => {
    const colId = event.column.getId();

    if ('name' === colId) {
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

  useEffect(() => {
    async function fetchData() {
      setWarehouseList(await getWarehouse());
    }

    fetchData();
  }, []);

  const [columnDefs] = useState([
    {
      headerName: 'NAME',
      field: 'name',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'HSN',
      field: 'hsn',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'BATCH NO',
      field: 'batchNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>BATCH</p>
            <p>NO</p>
          </div>
        );
      }
    },
    {
      headerName: 'QTY',
      field: 'qty',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'PURCHASE PRICE',
      field: 'purchasedPrice',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PURCHASE</p>
            <p>PRICE</p>
          </div>
        );
      }
    },
    {
      headerName: 'MRP',
      field: 'mrp',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'OFFER PRICE',
      field: 'offerPrice',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>OFFER</p>
            <p>PRICE</p>
          </div>
        );
      }
    },
    {
      headerName: 'MF. DATE',
      field: 'mfDate',
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
    },
    {
      headerName: 'EXP. DATE',
      field: 'expiryDate',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
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

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromExpiryReport = async () => {
    const wb = new Workbook();

    let xlsxExpiredProductData = await getExpiryProductReportDataXlsx(
      fromDate,
      toDate,
      expiryDateChecked,
      mfDateChecked,
      warehouse
    );

    let data = [];
    if (xlsxExpiredProductData.length > 0) {
      for (var i = 0; i < xlsxExpiredProductData.length; i++) {
        const record = {
          NAME: xlsxExpiredProductData[i].name,
          HSN: xlsxExpiredProductData[i].hsn,
          'BATCH NO': xlsxExpiredProductData[i].batchNumber,
          QTY: xlsxExpiredProductData[i].qty,
          MRP: xlsxExpiredProductData[i].mrp,
          'PURCHASE PRICE': xlsxExpiredProductData[i].purchasedPrice,
          'OFFER PRICE': xlsxExpiredProductData[i].offerPrice,
          'MF. DATE': xlsxExpiredProductData[i].mfDate,
          'EXP. DATE': xlsxExpiredProductData[i].expiryDate
        };
        data.push(record);
      }
    } else {
      const record = {
        NAME: '',
        HSN: '',
        'BATCH NO': '',
        QTY: '',
        MRP: '',
        'PURCHASE PRICE': '',
        'OFFER PRICE': '',
        'MF. DATE': '',
        'EXP. DATE': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Expiry Report Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Expiry Report Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Expiry_Report';

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

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);

      if (onChange) {
        getExpiryProductReportData(
          fromDate,
          toDate,
          expiryDateChecked,
          mfDateChecked,
          warehouse
        );

        setOnChange(false);
      }
    }

    fetchData();

    setTimeout(() => setLoadingShown(false), 200);
  }, [onChange]);


  // Helper function to create the filter object based on the given criteria
  const createFilter = (businessId, fromDate, toDate, isExpiryDate, isMfDate, warehouse, daysToExpiry) => {
    const commonFilter = [
      { businessId: { $eq: businessId } },
      warehouse ? { warehouseData: { $eq: warehouse } } : {}
    ];

    const dateField = isExpiryDate ? 'expiryDate' : 'mfDate';

    let dateFilter;

    if (isExpiryDate && daysToExpiry && daysToExpiry > 0) {
      const currentDate = new Date();
      const expiryDateLimit = new Date();
      expiryDateLimit.setDate(currentDate.getDate() + daysToExpiry);

      // Format expiryDateLimit to "yyyy-mm-dd"
      const formattedExpiryDateLimit = expiryDateLimit.toISOString().split('T')[0];

      dateFilter = {
        [dateField]: { $exists: true, $lte: formattedExpiryDateLimit }
      };
    } else {
      dateFilter = {
        $or: [
          {
            batchData: {
              $elemMatch: {
                [dateField]: { $gte: fromDate, $lte: toDate }
              }
            }
          },
          {
            [dateField]: { $exists: true, $gte: fromDate, $lte: toDate }
          }
        ]
      };
    }

    return { $and: [...commonFilter, dateFilter] };
  };

// Helper function to process the fetched data
  const processFetchedData = (data, fromDate, toDate, isMfDate, isExpiryDate) => {
    return data.flatMap(item => {
      const finalData = item.toJSON();
      const batchData = finalData.batchData || [];
      const finalBatchData = getDateRangeMatchRecords(batchData, fromDate, toDate, isMfDate);

      if (finalBatchData.length > 0) {
        return finalBatchData.map(batch => ({
          name: finalData.name,
          batchNumber: batch.batchNumber,
          qty: batch.qty,
          purchasedPrice: batch.purchasedPrice,
          mrp: batch.salePrice,
          offerPrice: batch.offerPrice,
          mfDate: batch.mfDate,
          expiryDate: batch.expiryDate,
          productId: finalData.productId
        }));
      } else {
        const row = {
          name: finalData.name,
          qty: finalData.qty,
          purchasedPrice: finalData.purchasedPrice,
          mrp: finalData.salePrice,
          offerPrice: finalData.offerPrice,
          mfDate: finalData.mfDate,
          expiryDate: finalData.expiryDate,
          productId: finalData.productId
        };

        const isValidRecord = (isMfDate && row.mfDate) || (isExpiryDate && row.expiryDate);
        return isValidRecord ? [row] : [];
      }
    });
  };

// Main function to get expiry product report data
  const getExpiryProductReportData = async (fromDate, toDate, isExpiryDate, isMfDate, warehouse) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const productTxnData = await  getProductTransactionSettings();
    const filter = createFilter(businessData.businessId, fromDate, toDate, isExpiryDate, isMfDate, warehouse, productTxnData.expiryNotificationDays);

    let skip = 0;
    setExpiredProductData([]);

    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      await getAllExpiryProductReportData(filter, isMfDate, isExpiryDate);
    }

    const data = await db.businessproduct.find({ selector: filter, limit: limit, skip: skip }).exec();
    if (!data) return;

    const responseData = processFetchedData(data, fromDate, toDate, isMfDate, isExpiryDate);
    setExpiredProductData(responseData);
  };

// Main function to get expiry product report data for XLSX export
  const getExpiryProductReportDataXlsx = async (fromDate, toDate, isExpiryDate, isMfDate, warehouse) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const filter = createFilter(businessData.businessId, fromDate, toDate, isExpiryDate, isMfDate, warehouse);

    const data = await db.businessproduct.find({ selector: filter }).exec();
    if (!data) return [];

    return processFetchedData(data, fromDate, toDate, isMfDate, isExpiryDate);
  };

// Helper function to fetch all expiry product report data and set the total pages
  const getAllExpiryProductReportData = async (filter, isMfDate, isExpiryDate) => {
    const db = await Db.get();
    const data = await db.businessproduct.find({ selector: filter }).exec();
    if (!data) return;

    let count = 0;
    data.forEach(item => {
      const finalData = item.toJSON();
      const batchData = finalData.batchData || [];
      const finalBatchData = getDateRangeMatchRecords(batchData, fromDate, toDate, isMfDate);

      if (finalBatchData.length > 0) {
        count += finalBatchData.length;
      } else {
        const isValidRecord = (isMfDate && finalData.mfDate) || (isExpiryDate && finalData.expiryDate);
        if (isValidRecord) count++;
      }
    });

    const numberOfPages = Math.ceil(count / limit);
    setTotalPages(numberOfPages);
  };

// Helper function to get date range matched records
  const getDateRangeMatchRecords = (batchData, fromDate, toDate, isMfDate) => {
    const dateField = isMfDate ? 'mfDate' : 'expiryDate';
    return batchData.filter(batch => {
      const date = new Date(batch[dateField]);
      return date >= new Date(fromDate) && date <= new Date(toDate);
    });
  };


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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value === 'manufacturingDate') {
      setMfDateChecked(true);
      setExpiryDateChecked(false);
    } else {
      setExpiryDateChecked(true);
      setMfDateChecked(false);
    }
    setCurrentPage(1);
    setTotalPages(1);
    setOnChange(true);
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
                    EXPIRY REPORT
                  </Typography>
                </div>
              </div>

              <div>
                <Grid
                  container
                  spacing={1}
                  className={classes.categoryActionWrapper}
                >
                  <Grid item xs={8}>
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
                  <Grid item xs={4} style={{ marginTop: '14px' }}>
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
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <div className={classes.selectOption}>
                      <FormControl
                        component="fieldset"
                        className={classes.radioDate}
                      >
                        <RadioGroup
                          row
                          aria-label="position"
                          name="position"
                          defaultValue="expiryDate"
                        >
                          <FormControlLabel
                            value="expiryDate"
                            control={
                              <Radio
                                color="secondary"
                                onChange={handleChange}
                              />
                            }
                            label="Expiry Date"
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="manufacturingDate"
                            labelPlacement="end"
                            control={
                              <Radio
                                color="secondary"
                                onChange={handleChange}
                              />
                            }
                            label="Manufacturing Date"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                    {warehouseList && warehouseList.length > 0 && (
                      <div className={classes.selectOption}>
                        <FormControl
                          required
                          className={clsx(classes.formControl, classes.noLabel)}
                        >
                          <Select
                            disableUnderline
                            className={classes.selectFont}
                            value={warehouse ? warehouse : 'Select'}
                            input={<Input />}
                            onChange={async (e) => {
                              if (e.target.value !== 'Select') {
                                setWarehouse(e.target.value);
                                getExpiryProductReportData(
                                  fromDate,
                                  toDate,
                                  expiryDateChecked,
                                  mfDateChecked,
                                  warehouse
                                );
                              } else {
                                setWarehouse('');
                                getExpiryProductReportData(
                                  fromDate,
                                  toDate,
                                  expiryDateChecked,
                                  mfDateChecked,
                                  null
                                );
                              }
                            }}
                          >
                            <MenuItem value={'Select'}>{'Select'}</MenuItem>

                            {warehouseList &&
                              warehouseList.map((option, index) => (
                                <MenuItem value={option.name}>
                                  {option.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </div>
                    )}
                  </Grid>
                </Grid>
              </div>
              {/* expiredProductData */}

              <div className={classes.itemTable}>
                {/* <App />  */}

                <Box mt={1}>
                  <div
                    style={{ width: '100%', height: height - 245 + 'px' }}
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
                        rowData={expiredProductData}
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

export default InjectObserver(ExpiryReport);