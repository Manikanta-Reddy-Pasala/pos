import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Paper
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import TextField from '@material-ui/core/TextField';
import Excel from '../../../icons/Excel';
import XLSX from 'xlsx';
import * as Db from '../../../RxDb/Database/Database';
import NoPermission from '../../noPermission';
import * as Bd from '../../../components/SelectedBusiness';
import BubbleLoader from '../../../components/loader';
import useWindowDimensions from '../../../components/windowDimension';
import { getManufactureProductTxnListByDateAndProduct } from 'src/components/Helpers/ProductTxnQueryHelper';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import EditMfgModal from 'src/components/modal/EditMfgModal';
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
  nameList: {
    marginLeft: '12px',
    marginTop: '20px'
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
    minHeight: '616px',
    padding: 2,
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
  },
  outlinedInput: {
    width: '100%'
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
  resetbtn: {
    margin: 20,
    padding: 6
  }
}));

const ManufactureReport = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
  const [rowData, setRowData] = useState([]);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [productName, setProductName] = React.useState('');
  const [productNameWhileEditing, setProductNameWhileEditing] =
    React.useState();
  const [productlist, setproductlist] = useState([]);

  const store = useStore();

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

  const stores = useStore();
  const { editMfgOpenDialog } = toJS(stores.ProductStore);
  const { updateProductFromManufacture } = stores.ProductStore;

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const handleCellClicked = (event) => {
    const colId = event.column.getId();

    if ('sequenceNumber' === colId) {
      updateProductFromManufacture(event.data);
    }
  };

  const [columnDefs] = useState([
    {
      headerName: 'INVOICE NUMBER',
      field: 'sequenceNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'DATE',
      field: 'txnDate',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'NAME',
      field: 'productName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'QUANTITY',
      field: 'txnQty',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>QTY</p>
            <p>MANUFACTURED</p>
          </div>
        );
      }
    },
    {
      headerName: 'FREE MANUFACTURE QTY',
      field: 'freeTxnQty',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>FREE QTY</p>
            <p>MANUFACTURED</p>
          </div>
        );
      }
    },
    {
      headerName: 'COST',
      field: 'amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100
    }
  ]);

  const getProductList = async (value) => {
    setproductlist(await getProductAutoCompleteList(value));
  };

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromExcel = () => {
    const wb = new Workbook();

    let data = [];

    if (rowData && rowData.length > 0) {
      for (var i = 0; i < rowData.length; i++) {
        const record = {
          DATE: rowData[i].txnDate,
          'INVOICE NUMBER': rowData[i].sequenceNumber,
          NAME: rowData[i].productName,
          'QTY MANUFACTURED': rowData[i].txnQty,
          COST: rowData[i].amount
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        'INVOICE NUMBER': '',
        NAME: '',
        'QTY MANUFACTURED': '',
        COST: ''
      };
      data.push(record);
    }
    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Manufacturing Report Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Manufacturing Report Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Manufacturing_Report';

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
      const db = await Db.get();
      setRowData(
        await getManufactureProductTxnListByDateAndProduct(db, fromDate, toDate)
      );
    }

    fetchData();
    setproductlist([]);
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const getAllData = async () => {
    const businessData = await Bd.getBusinessData();
    await checkPermissionAvailable(businessData);
    const db = await Db.get();
    setRowData(
      await getManufactureProductTxnListByDateAndProduct(db, fromDate, toDate)
    );
    setproductlist([]);
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

  const handleProductClick = async (option) => {
    setProductName(option.name);
    setSelectedProduct(option);
    setProductNameWhileEditing('');

    const db = await Db.get();

    setRowData(
      await getManufactureProductTxnListByDateAndProduct(
        db,
        fromDate,
        toDate,
        option.productId
      )
    );
    setproductlist([]);
  };

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

  const rowClassRules = {
    rowHighlight(params) {
      return params.node.rowIndex % 2 === 0;
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
                    MANUFACTURING REPORT
                  </Typography>
                </div>
              </div>

              <div>
                <Grid
                  container
                  spacing={1}
                  className={classes.categoryActionWrapper}
                >
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
                          onChange={(e) =>
                            setToDate(formatDate(e.target.value))
                          }
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
                    <div className={classes.selectOption}>
                      <div>
                        <TextField
                          fullWidth
                          className={classes.input}
                          placeholder="Select Product"
                          value={
                            productName === ''
                              ? productNameWhileEditing
                              : productName
                          }
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
                          onChange={(e) => {
                            if (e.target.value !== productNameWhileEditing) {
                              setProductName('');
                              setSelectedProduct();
                            }

                            setProductNameWhileEditing(e.target.value);
                            getProductList(e.target.value);
                            if (e.target.value.length === 0) {
                              getAllData();
                            }
                          }}
                        />{' '}
                        {productlist.length > 0 ? (
                          <div>
                            <ul
                              className={classes.listbox}
                              style={{ width: '25%' }}
                            >
                              {productlist.map((option, index) => (
                                <li
                                  style={{ padding: 10, cursor: 'pointer' }}
                                  onClick={() => {
                                    handleProductClick(option);
                                  }}
                                >
                                  <Grid
                                    container
                                    // justify="space-between"
                                    style={{ display: 'flex' }}
                                    className={classes.listitemGroup}
                                  >
                                    <Grid item xs={12}>
                                      <p>{option.name}</p>
                                    </Grid>
                                  </Grid>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </div>
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
                        <IconButton onClick={() => getDataFromExcel()}>
                          <Excel fontSize="inherit" />
                        </IconButton>
                      </Avatar>
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
                        paginationPageSize={10}
                        suppressMenuHide
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        pagination
                        headerHeight={40}
                        rowClassRules={rowClassRules}
                        onCellClicked={handleCellClicked}
                      />
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
      {editMfgOpenDialog ? <EditMfgModal /> : null}
    </div>
  );
};

export default InjectObserver(ManufactureReport);