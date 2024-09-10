import React, { useState, useEffect } from 'react';
import {
  Paper,
  makeStyles,
  InputAdornment,
  IconButton,
  Grid,
  Typography,
  Avatar,
  TextField
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from '../../../../components/controls/index';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { AgGridReact } from 'ag-grid-react';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import * as Db from '../../../../RxDb/Database/Database';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import useWindowDimensions from '../../../../components/windowDimension';
import dateFormat from 'dateformat';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice/index';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import PDFIcon from '@material-ui/icons/PictureAsPdf';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
import ProductModal from 'src/components/modal/ProductModal';
import { getAllSalesByWarrantyEndDateSorted } from 'src/components/Helpers/dbQueries/producttxn';
import * as ExcelJS from 'exceljs';
import {
  prepareWarrantyHeaderRow,
  formatDownloadExcelDate,
  formatHeaderRow
} from '../Helper/ItemSerialExcelHelper';
import { convertDateToYYYYMMDD } from 'src/components/Helpers/DateHelper';
import { getSalesDataById } from 'src/components/Helpers/dbQueries/sales';

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
  texthead: {
    textColor: '#86ca94',
    marginLeft: theme.spacing(2)
  },
  text: { textColor: '#faab53' },
  plus: {
    margin: 6,
    paddingTop: 23,
    fontSize: '20px'
  },
  headerRoot: {
    minWidth: 200,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    padding: '3px 0px 0px 8px'
  }
}));

const WarrantyReport = (props) => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [custSub, setCustSub] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [salesData, setSalesData] = useState([]);
  let [onChange, setOnChange] = useState(false);
  let [allSaleData, setAllSaleData] = useState([]);

  const store = useStore();

  const [limit] = useState(10);

  const { openAddSalesInvoice, isLaunchEWayAfterSaleCreation, printData } =
    toJS(store.SalesAddStore);
  const { openEWayGenerateModal } = toJS(store.EWayStore);
  const { productDialogOpen } = toJS(store.ProductStore);
  const { viewOrEditSaleTxnItem, resetEWayLaunchFlag } = store.SalesAddStore;
  const { handleOpenEWayGenerateModal } = store.EWayStore;

  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { getInvoiceSettings } = store.PrinterSettingsStore;

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));
  }, []);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 500);

    window.addEventListener('resize', function () {
      setTimeout(function () {
        params.api.sizeColumnsToFit();
      });
    });
  };

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    filter: true,
    rowHeight: 10,
    headerHeight: 30,
    minWidth: 150,
    suppressMenuHide: true,
    suppressHorizontalScroll: false,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  function dateFormatter(params) {
    var dateAsString = params.data.txnDate;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  function warrantyDateFormatter(params) {
    var dateAsString = params.data.warrantyEndDate;
    if (dateAsString !== undefined && dateAsString !== null) {
      var dateParts = dateAsString.split('-');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    } else {
      return '';
    }
  }

  function formatDownloadExcelDate(dateAsString) {
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const handleCellClicked = async (event) => {
    const colId = event.column.getId();

    if ('sequenceNumber' === colId) {
      let data = await getSalesDataById(event.data.txnId);
      if (data) viewOrEditSaleTxnItem(data);
    }
  };

  const [columnDefs] = useState([
    {
      headerName: 'PRODUCT NAME',
      field: 'productName',
      filter: false
    },
    {
      headerName: 'SALE QTY',
      field: 'txnQty',
      width: 90,
      minWidth: 90,
      filter: false,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>SALE</p>
            <p>QTY</p>
          </div>
        );
      }
    },
    {
      headerName: 'SALE DATE',
      field: 'txnDate',
      width: 120,
      minWidth: 120,
      valueFormatter: dateFormatter,
      filter: false
    },
    {
      headerName: 'INVOICE NO',
      field: 'sequenceNumber',
      filter: false,
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'WARRANTY DAYS',
      field: 'warrantyDays',
      filter: false,
      width: 90,
      minWidth: 90,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>WARRANTY</p>
            <p>DAYS</p>
          </div>
        );
      }
    },
    {
      headerName: 'WARRANTY END DATE',
      field: 'warrantyEndDate',
      width: 120,
      minWidth: 120,
      valueFormatter: warrantyDateFormatter,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>WARRANTY</p>
            <p>END DATE</p>
          </div>
        );
      }
    },
    {
      filter: false,
      width: 90,
      minWidth: 90,
      valueFormatter: (params) => {
        let data = params['data'];
        return getAge(data);
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>DAYS</p>
            <p>LEFT</p>
          </div>
        );
      }
    },
    {
      headerName: 'CUSTOMER NAME',
      field: 'customerName',
      width: 180,
      minWidth: 180,
      filter: false,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>CUSTOMER</p>
            <p>NAME</p>
          </div>
        );
      }
    }
  ]);

  function getAge(data) {
    var date1 = new Date(data.warrantyEndDate);
    var date2 = new Date(formatDate(todayDate));
    let Difference_In_Days = 0;

    if (date2 !== undefined && date1 !== undefined) {
      // To calculate the time difference of two dates
      var Difference_In_Time = date1.getTime() - date2.getTime();

      // To calculate the no. of days between two dates
      Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    }
    return Difference_In_Days;
  }

  const getExcelDataFromSales = async () => {
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet(
      'WARRANTY (' + parseInt(salesData.length || 0) + ')'
    );
    const filteredColumns = [];

    await prepareWarrantyHeaderRow(filteredColumns);
    worksheet.columns = filteredColumns;

    // Make header row bold and color header cells
    const headerRow = worksheet.getRow(1);
    await formatHeaderRow(headerRow);

    for (var i = 0; i < salesData.length; i++) {
      // Add a blank row
      const newRow = worksheet.addRow({});
      newRow.getCell('productName').value = salesData[i].productName;
      newRow.getCell('saleQty').value = salesData[i].txnQty;
      newRow.getCell('saleDate').value = formatDownloadExcelDate(
        salesData[i].txnDate
      );
      newRow.getCell('invoiceNo').value = salesData[i].sequenceNumber;
      newRow.getCell('warrantyDays').value = salesData[i].warrantyDays;
      newRow.getCell('warrantyEndDate').value = formatDownloadExcelDate(
        salesData[i].warrantyEndDate
      );
      newRow.getCell('daysLeft').value = getAge(salesData[i]);
      newRow.getCell('customerName').value = salesData[i].customerName;
    }

    // Generate Excel file buffer
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const fileName = `${localStorage.getItem(
        'businessName'
      )}_Warranty_Item_Serial_Report_${convertDateToYYYYMMDD(toDate)}.xlsx`;
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const rowClassRules = {
    rowHighlight: function (params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();

  const todayDate = new Date(thisYear, thisMonth, today);

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
        // to add search
        getSaleDataBySearch(target);
      } else {
        getWarrantyData(formatDate(toDate));
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    // Setting From and To Dates for today
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
      if (!businessData.posFeatures.includes('Aging Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange && toDate) {
        setOnChange(false);
        await getWarrantyData(formatDate(toDate));
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getWarrantyData = async (toDate) => {
    let data = await getAllSalesByWarrantyEndDateSorted(toDate);
    setSalesData(data);
  };

  const getSaleDataBySearch = async (value) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    let skip = 0;
    setSalesData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSaleDataBySearch(value);
    }

    Query = db.sales.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $regex: regexp } },
              {
                dueDate: { $exists: true }
              },
              {
                dueDate: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              },
              {
                balance_amount: { $gt: 0 }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { customer_name: { $regex: regexp } },
              {
                dueDate: { $exists: true }
              },
              {
                dueDate: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              },
              {
                balance_amount: { $gt: 0 }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { payment_type: { $regex: regexp } },
              {
                dueDate: { $exists: true }
              },
              {
                dueDate: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              },
              {
                balance_amount: { $gt: 0 }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } },
              {
                dueDate: { $exists: true }
              },
              {
                dueDate: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              },
              {
                balance_amount: { $gt: 0 }
              }
            ]
          }
        ]
      },
      sort: [{ dueDate: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      let filteredData = [];
      for (let item of response) {
        if (item.dueDate !== null) {
          filteredData.push(item);
        }
      }
      setSalesData(filteredData);
    });
  };

  const getAllSaleDataBySearch = async (value) => {
    const db = await Db.get();
    var Query;

    const businessData = await Bd.getBusinessData();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    Query = db.sales.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $regex: regexp } },
              {
                dueDate: { $exists: true }
              },
              {
                dueDate: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              },
              {
                balance_amount: { $gt: 0 }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { customer_name: { $regex: regexp } },
              {
                dueDate: { $exists: true }
              },
              {
                dueDate: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              },
              {
                balance_amount: { $gt: 0 }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { payment_type: { $regex: regexp } },
              {
                dueDate: { $exists: true }
              },
              {
                dueDate: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              },
              {
                balance_amount: { $gt: 0 }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } },
              {
                dueDate: { $exists: true }
              },
              {
                dueDate: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              },
              {
                balance_amount: { $gt: 0 }
              }
            ]
          }
        ]
      },
      sort: [{ dueDate: 'desc' }]
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      let response = data.map((item) => {
        let output = {};

        if (item.dueDate !== null) {
          ++count;
        }
        return output;
      });

      setAllSaleData(response);

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const generatePDFDocument = async () => {};

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
        <div className={classes.root} style={{ minHeight: height - 60 }}>
          {isFeatureAvailable ? (
            <Paper className={classes.root} style={{ minHeight: height - 60 }}>
              <div className={classes.content}>
                <div className={classes.contentLeft}>
                  <Typography gutterBottom variant="h4" component="h4">
                    WARRANTY BY END DATE
                  </Typography>
                </div>
              </div>

              <Grid container className={classes.categoryActionWrapper}>
                <Grid item xs={12}>
                  <div>
                    <form className={classes.blockLine} noValidate>
                      <TextField
                        id="date"
                        label="Warranty End Date"
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
                alignItems="right"
                className={classes.sectionHeader}
              >
                <Grid item xs={12} sm={3}></Grid>
                <Grid item xs={12} sm={1}></Grid>

                <Grid
                  item
                  xs={12}
                  sm={8}
                  align="right"
                  className={classes.categoryActionWrapper}
                >
                  <Grid container direction="row" alignItems="center">
                    <Grid item xs={10}>
                      {/* <Controls.Input
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
                      /> */}
                    </Grid>
                    <Grid item xs={1}>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        className="category-actions-right"
                      >
                        <Avatar>
                          <IconButton onClick={() => getExcelDataFromSales()}>
                            <Excel fontSize="inherit" />
                          </IconButton>
                        </Avatar>
                      </Grid>
                    </Grid>
                    {/* <Grid item xs={1}>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        className="category-actions-right"
                      >
                        <Avatar>
                          <IconButton onClick={() => generatePDFDocument()}>
                            <PDFIcon fontSize="inherit" />
                          </IconButton>
                        </Avatar>
                      </Grid>
                    </Grid> */}
                  </Grid>
                </Grid>
              </Grid>
              <div
                style={{
                  width: '100%',
                  height: height - 195 + 'px'
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
                    paginationPageSize={10}
                    suppressMenuHide
                    rowData={salesData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination
                    headerHeight={40}
                    rowClassRules={rowClassRules}
                    onCellClicked={handleCellClicked}
                  />
                </div>
              </div>
            </Paper>
          ) : (
            // </Paper>
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

export default InjectObserver(WarrantyReport);