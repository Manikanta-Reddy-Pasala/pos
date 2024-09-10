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
import Controls from 'src/components/controls/index';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import { AgGridReact } from 'ag-grid-react';
import TextField from '@material-ui/core/TextField';
import Excel from '../../../icons/Excel';
import XLSX from 'xlsx';
import NoPermission from '../../noPermission';
import * as Bd from 'src/components/SelectedBusiness';
import * as Db from 'src/RxDb/Database/Database';
import BubbleLoader from 'src/components/loader';
import useWindowDimensions from 'src/components/windowDimension';
import left_arrow from '../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../icons/svg/last_page_arrow.svg';
import dateFormat from 'dateformat';
import ProductModal from 'src/components/modal/ProductModal';
import AddBackToBackPurchasesBill from 'src/views/purchases/BackToBackPurchase/BackToBackAddPurchase/index';

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

const Procurement = (props) => {
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

  const { OpenAddBackToBackPurchaseBill } = toJS(
    stores.BackToBackPurchaseStore
  );
  const { productDialogOpen } = toJS(stores.ProductStore);
  const { viewOrEditItem } = stores.BackToBackPurchaseStore;
  const [searchText, setSearchText] = useState('');

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const handleCellClicked = (event) => {
    const colId = event.column.getId();

    if ('lrNumber' === colId) {
      viewOrEditItem(event.data);
    }
  };

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
    var dateAsString = params.data.bill_date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const [columnDefs] = useState([
    {
      headerName: 'LR NO',
      field: 'lrNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'DATE',
      field: 'bill_date',
      valueFormatter: dateFormatter,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'TRANSPORTER NAME',
      field: 'transporterVendorName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TRANSPORTER</p>
            <p>NAME</p>
          </div>
        );
      }
    },
    {
      headerName: 'SUPERVISOR NAME',
      field: 'supervisorName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>SUPERVISOR</p>
            <p>NAME</p>
          </div>
        );
      }
    },
    {
      headerName: 'IN-CHARGE NAME',
      field: 'materialsInChargeName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>MATERIAL IN-CHARGE</p>
            <p>NAME</p>
          </div>
        );
      }
    },
    {
      headerName: 'TOTAL AMOUNT',
      field: 'total_amount',
      valueFormatter: (params) => {
        let data = params['data'];
        return parseFloat(data['total_amount']).toFixed(2);
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    }
  ]);

  function getPurchaseStatus(purchaseData) {
    let result = '';

    if (purchaseData.balance_amount === 0) {
      result = 'Paid';
    } else if (purchaseData.balance_amount < purchaseData.total_amount) {
      result = 'Partial';
    } else {
      result = 'Un Paid';
    }
    return result;
  }

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  function formatDownloadExcelDate(dateAsString) {
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const getDataFromPurchases = async () => {
    const wb = new Workbook();
    let xlsxPurchaseData = await getAllPurchaseDataByDateXlsx(fromDate, toDate);

    let data = [];
    if (xlsxPurchaseData && xlsxPurchaseData.length > 0) {
      for (var i = 0; i < xlsxPurchaseData.length; i++) {
        const record = {
          DATE: formatDownloadExcelDate(xlsxPurchaseData[i].bill_date),
          'LR NO': xlsxPurchaseData[i].lrNumber,
          'TRANSPORTER NAME': xlsxPurchaseData[i].transporterVendorName,
          'SUPERVISOR NAME': xlsxPurchaseData[i].supervisorName,
          'IN-CHARGE NAME': xlsxPurchaseData[i].materialsInChargeName,
          TOTAL: parseFloat(xlsxPurchaseData[i].total_amount).toFixed(2)
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        'LR NO': '',
        'TRANSPORTER NAME': '',
        'SUPERVISOR NAME': '',
        'IN-CHARGE NAME': '',
        TOTAL: ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('All Procurement Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['All Procurement Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'All_Procurements_Report';

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
      setSearchText(target);
      if (target) {
        await getPurchaseDataBySearch(target);
      } else {
        getPurchaseDataByDate(fromDate, toDate);
      }
    } else {
      getPurchaseDataByDate(fromDate, toDate);
    }
  };

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setOnChange(false);
        setPurchaseData([]);
        if (searchText.length > 0) {
          let searchTextConverted = { target: { value: searchText } };
          handleSearch(searchTextConverted);
        } else {
          await getPurchaseDataByDate(fromDate, toDate);
        }
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

    Query = db.backtobackpurchases.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            bill_date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            bill_date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          },
          {
            updatedAt: { $exists: true }
          }
        ]
      },
      sort: [{ bill_date: 'desc' }, { updatedAt: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      setPurchaseData(response);
    });
  };

  const getAllPurchaseDataByDate = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.backtobackpurchases.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            bill_date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            bill_date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          }
        ]
      }
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

    Query = db.backtobackpurchases.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { transporterVendorName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { supervisorName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { materialsInChargeName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { lrNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } }
            ]
          }
        ]
      },
      sort: [{ bill_date: 'desc' }, { updatedAt: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      setPurchaseData(response);
    });
  };

  const getAllPurchaseDataBySearch = async (value) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    Query = db.backtobackpurchases.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { transporterVendorName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { supervisorName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { materialsInChargeName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { lrNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } }
            ]
          }
        ]
      }
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

    Query = db.backtobackpurchases.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            bill_date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            bill_date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          }
        ]
      },
      sort: [{ bill_date: 'asc' }]
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
      if (!businessData.posFeatures.includes('Manufacture Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div className={classes.root} style={{ minHeight: height - 63 }}>
          {isFeatureAvailable ? (
            <Paper className={classes.root} style={{ minHeight: height - 63 }}>
              <div className={classes.content}>
                <div className={classes.contentLeft}>
                  <Typography gutterBottom variant="h4" component="h4">
                    ALL PROCUREMENTS
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
                  height: height - 225 + 'px'
                }}
                className=" blue-theme"
              >
                <div
                  id="sales-invoice-grid"
                  style={{ height: '93%', width: '100%' }}
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
                      marginTop: '2px',
                      marginBottom: '10px'
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
      {OpenAddBackToBackPurchaseBill ? <AddBackToBackPurchasesBill /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(Procurement);