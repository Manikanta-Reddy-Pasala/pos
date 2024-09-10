import React, { useState, useEffect } from 'react';
import {
  Paper,
  makeStyles,
  InputAdornment,
  IconButton,
  Grid,
  Typography,
  Avatar,
  Button
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from '../../../../components/controls/index';
import * as Db from '../../../../RxDb/Database/Database';
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
import useWindowDimensions from '../../../../components/windowDimension';
import { getSalesTxnByVendor } from 'src/components/Helpers/ProductTxnQueryHelper';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import { getVendorAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';

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
  listbox: {
    margin: 5,
    padding: 10,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
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
  alignCenter: {
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  vendorDesign: {
    marginTop: 'auto',
    marginLeft: '-10%'
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
  root: {
    minWidth: 140,
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

const SalesByVendor = (props) => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  let [onChange, setOnChange] = useState(true);

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

  const [columnDefs] = useState([
    {
      headerName: 'NAME',
      field: 'productName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100
    },
    {
      headerName: 'CATEGORY',
      field: 'categoryLevel2DisplayName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100
    },
    {
      headerName: 'SUB CATEGORY',
      field: 'categoryLevel3DisplayName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>SUB</p>
            <p>CATEGORY</p>
          </div>
        );
      }
    },
    {
      headerName: 'SALE QTY',
      field: 'saleQty',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
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
      headerName: 'SALE AMOUNT',
      field: 'saleAmount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>SALE</p>
            <p>AMOUNT</p>
          </div>
        );
      }
    },
    {
      headerName: 'PURCHASE QTY',
      field: 'purchaseQty',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PURCHASE</p>
            <p>QTY</p>
          </div>
        );
      }
    },
    {
      headerName: 'PURCHASE AMOUNT',
      field: 'purchaseAmount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PURCHASE</p>
            <p>AMOUNT</p>
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

  const getDataFromSalesByVendor = () => {
    const wb = new Workbook();

    let data = [];

    if (rowData && rowData.length > 0) {
      for (var i = 0; i < rowData.length; i++) {
        const record = {
          NAME: rowData[i].productName,
          CATEGORY: rowData[i].categoryLevel2DisplayName,
          'SUB CATEGORY': rowData[i].categoryLevel3DisplayName,
          'SALE QTY': rowData[i].saleQty,
          'SALE AMOUNT': rowData[i].saleAmount,
          'PURCHASE QTY': rowData[i].purchaseQty,
          'PURCHASE AMOUNT': rowData[i].purchaseAmount
        };
        data.push(record);
      }
    } else {
      const record = {
        NAME: '',
        CATEGORY: '',
        'SUB CATEGORY': '',
        'SALE QTY': '',
        'SALE AMOUNT': '',
        'PURCHASE QTY': '',
        'PURCHASE AMOUNT': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Sales By Vendor Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Sales By Vendor Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Sales_By_Vendor_Report';

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

  const rowClassRules = {
    rowHighlight: function (params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);

  const [fromDate, setFromDate] = React.useState();
  const [toDate, setToDate] = React.useState();
  const [vendorList, setVendorList] = React.useState();
  const [vendorName, setVendorName] = React.useState('');
  const [vendorPhoneNumber, setVendorPhoneNumber] = React.useState('');

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

      if (target === '') {
        const db = await Db.get();
        setRowData(
          await getSalesTxnByVendor(
            db,
            vendorPhoneNumber,
            fromDate,
            toDate,
            getFilterArray()
          )
        );
      } else {
        let filteredData = [];
        for (let item of rowData) {
          if (
            item.productName.toLowerCase().includes(target) ||
            item.categoryLevel2DisplayName.toLowerCase().includes(target) ||
            item.categoryLevel3DisplayName.toLowerCase().includes(target)
          ) {
            filteredData.push(item);
          }
        }
        setRowData(filteredData);
      }
    }
  };

  const getVendorList = async (value) => {
    setVendorList(await getVendorAutoCompleteList(value));
  };

  const handleVendorClick = async (vendor) => {
    setVendorName(vendor.name);
    setVendorPhoneNumber(vendor.phoneNo);
    setVendorList([]);

    const db = await Db.get();

    setRowData(
      await getSalesTxnByVendor(
        db,
        vendor.phoneNo,
        fromDate,
        toDate,
        getFilterArray()
      )
    );
  };

  function getFilterArray() {
    let txnFilterArray = [];

    const saleTxnTypeFilter = {
      txnType: { $eq: 'Sales' }
    };
    txnFilterArray.push(saleTxnTypeFilter);

    const purchaseTxnTypeFilter = {
      txnType: { $eq: 'Purchases' }
    };
    txnFilterArray.push(purchaseTxnTypeFilter);

    const kotTxnTypeFilter = {
      txnType: { $eq: 'KOT' }
    };
    txnFilterArray.push(kotTxnTypeFilter);

    return txnFilterArray;
  }

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    setFromDate(formatDate(firstThisMonth));
    setToDate(formatDate(todayDate));
    setVendorList([]);
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Sales Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  useEffect(() => {
    if (gridApi) {
      if (rowData) {
        gridApi.setRowData(rowData);
      }
    } else {
      setRowData(rowData);
    }
  }, [rowData]);

  function convertPXToVW(px) {
    const result = px * (100 / document.documentElement.clientWidth) + 5;
    return result + 'vh';
  }

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div className={classes.root} style={{ minHeight: height - 53 }}>
          {isFeatureAvailable ? (
            <Paper className={classes.root} style={{ minHeight: height - 53 }}>
              <div className={classes.content}>
                <div className={classes.contentLeft}>
                  <Typography gutterBottom variant="h4" component="h4">
                    SALES - VENDOR
                  </Typography>
                </div>
              </div>

              <Grid container className={classes.categoryActionWrapper}>
                <Grid item xs={7}>
                  <div>
                    <form className={classes.blockLine} noValidate>
                      <TextField
                        id="date"
                        label="From"
                        type="date"
                        value={fromDate}
                        onChange={(e) =>
                          setFromDate(formatDate(e.target.value))
                        }
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
                        onChange={(e) => setToDate(formatDate(e.target.value))}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </form>
                  </div>
                </Grid>
                <Grid item xs={4} className={classes.vendorDesign}>
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
                                    style={{ padding: 10, cursor: 'pointer' }}
                                    onClick={() => {
                                      handleVendorClick(option);
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

              <Paper className={classes.paperRoot}>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  className={classes.sectionHeader}
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
                      <Grid sm={2} xs={12} className="category-actions-right">
                        <Avatar>
                          <IconButton
                            onClick={() => getDataFromSalesByVendor()}
                          >
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
                    height:
                      rowData && rowData.length < 6
                        ? rowData.length === 0
                          ? convertPXToVW(height)
                          : '56vh'
                        : '93vh'
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
                      suppressMenuHide={true}
                      rowData={rowData}
                      columnDefs={columnDefs}
                      defaultColDef={defaultColDef}
                      pagination={true}
                      headerHeight={40}
                      rowClassRules={rowClassRules}
                      suppressPaginationPanel={true}
                      suppressScrollOnNewData={true}
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
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
    </div>
  );
};

export default InjectObserver(SalesByVendor);
