import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import {
  Box,
  Typography,
  FormControl,
  Input,
  Select,
  Grid,
  IconButton,
  Avatar,
  Paper,
  Button
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import MenuItem from '@material-ui/core/MenuItem';
import clsx from 'clsx';
import { toJS } from 'mobx';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import useWindowDimensions from '../../../../components/windowDimension';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import * as Db from '../../../../RxDb/Database/Database';
import ProductModal from 'src/components/modal/ProductModal';

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
  topCard: {
    backgroundColor: '#fff'
  },
  excelIcon: {
    borderWidth: 1,
    borderColor: 'grey !important',
    borderRadius: '50%',
    padding: 6,
    borderStyle: 'solid',
    marginLeft: '10px'
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
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
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
  resetbtn: {
    margin: 20,
    padding: 6
  }
}));

const LowStockSummary = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [category, setCategory] = React.useState([]);
  const [subCategory, setSubCategory] = React.useState([]);
  const [subCategoryName, setSubCategoryName] = React.useState([]);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const store = useStore();
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [onChange, setOnChange] = useState(true);
  const [limit] = useState(10);
  const [lowStockProductsList, setLowStockProductsList] = useState([]);

  const { level2CategoriesList, level3CategoriesList, resetData } = toJS(
    store.ReportsStore
  );
  const { getBusinessLevel2Categorieslist, getBusinessLevel3Categorieslist } =
    store.ReportsStore;

  const [warehouse, setWarehouse] = React.useState('');
  const [warehouseList, setWarehouseList] = React.useState([]);

  // const formatDate = (date) => {
  //   var d = new Date(date),
  //     month = '' + (d.getMonth() + 1),
  //     day = '' + d.getDate(),
  //     year = d.getFullYear();

  //   if (month.length < 2) month = '0' + month;
  //   if (day.length < 2) day = '0' + day;

  //   return [year, month, day].join('-');
  // };

  // const [fromDate, setFromDate] = React.useState(formatDate(firstThisMonth));
  // const [toDate, setToDate] = React.useState(formatDate(todayDate));

  const { getWarehouse } = store.WarehouseStore;

  const { productDialogOpen } = toJS(store.ProductStore);
  const { handleEditProductModalLaunchFromReports } = store.ProductStore;

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const handleCellClicked = async (event) => {
    const colId = event.column.getId();

    if ('name' === colId) {
      handleEditProductModalLaunchFromReports(event.data);
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
      width: 100,
      minWidth: 110,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'HSN',
      field: 'hsn',
      width: 100,
      minWidth: 100,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'STOCK REORDER QTY',
      field: 'stockReOrderQty',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 100,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>STOCK REORDER</p>
            <p>QTY</p>
          </div>
        );
      }
    },

    {
      headerName: 'STOCK QTY',
      field: 'stockQty',
      width: 90,
      minWidth: 100,
      cellStyle() {
        return { color: '#339900' };
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'STOCK VALUE',
      field: 'stockValue',
      width: 90,
      minWidth: 100,
      valueGetter: multiplierGetter,
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

  const getLowStockSummaryByCategory = async (level3Category, warehouse) => {
    const db = await Db.get();
    setLowStockProductsList([]);

    var Query;
    let skip = 0;
    setLowStockProductsList([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllLowStockSummaryByCategory(level3Category, warehouse);
    }
    const businessData = await Bd.getBusinessData();

    if (warehouse) {
      Query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              'categoryLevel3.name': { $eq: level3Category }
            },
            { isStockReOrderQtyReached: { $eq: true } },
            { warehouseData: { $eq: warehouse } }
          ]
        },
        skip: skip,
        limit: limit
      });
    } else {
      Query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              'categoryLevel3.name': { $eq: level3Category }
            },
            { isStockReOrderQtyReached: { $eq: true } }
          ]
        },
        skip: skip,
        limit: limit
      });
    }

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      setLowStockProductsList(response);
    });
  };

  const getAllLowStockSummaryByCategory = async (level3Category, warehouse) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    if (warehouse) {
      Query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              'categoryLevel3.name': { $eq: level3Category }
            },
            { isStockReOrderQtyReached: { $eq: true } },
            { warehouseData: { $eq: warehouse } }
          ]
        }
      });
    } else {
      Query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              'categoryLevel3.name': { $eq: level3Category }
            },
            { isStockReOrderQtyReached: { $eq: true } }
          ]
        }
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

  const getAllLowStockSummaryByCategoryxlsx = async (level3Category) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    if (warehouse) {
      Query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              'categoryLevel3.name': { $eq: level3Category }
            },
            { isStockReOrderQtyReached: { $eq: true } },
            { warehouseData: { $eq: warehouse } }
          ]
        }
      });
    } else {
      Query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              'categoryLevel3.name': { $eq: level3Category }
            },
            { isStockReOrderQtyReached: { $eq: true } }
          ]
        }
      });
    }

    let response = [];
    await Query.exec().then((data) => {
      if (!data) {
        return;
      }

      response = data.map((item) => item);
    });
    return response;
  };

  const getLowStockSummaryByWarehouse = async (warehouse) => {
    if (subCategory.length > 0) {
      getLowStockSummaryByCategory(subCategoryName, warehouse);
    } else {
      getLowStockSummaryForAllCategories(warehouse);
    }
  };

  const getLowStockSummaryForAllCategories = async (warehouse) => {
    setLowStockProductsList([]);
    const db = await Db.get();

    var Query;
    let skip = 0;
    setLowStockProductsList([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllLowStockSummaryForAllCategories(warehouse);
    }
    const businessData = await Bd.getBusinessData();

    if (warehouse) {
      Query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { isStockReOrderQtyReached: { $eq: true } },
            { warehouseData: { $eq: warehouse } }
          ]
        },
        skip: skip,
        limit: limit
      });
    } else {
      Query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { isStockReOrderQtyReached: { $eq: true } }
          ]
        },
        skip: skip,
        limit: limit
      });
    }

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      setLowStockProductsList(response);
    });
  };

  const getAllLowStockSummaryForAllCategories = async (warehouse) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    if (warehouse) {
      Query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { isStockReOrderQtyReached: { $eq: true } },
            { warehouseData: { $eq: warehouse } }
          ]
        }
      });
    } else {
      Query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { isStockReOrderQtyReached: { $eq: true } }
          ]
        }
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

  const getAllLowStockSummaryForAllCategoriesxlsx = async () => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    if (warehouse) {
      Query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { isStockReOrderQtyReached: { $eq: true } },
            { warehouseData: { $eq: warehouse } }
          ]
        }
      });
    } else {
      Query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { isStockReOrderQtyReached: { $eq: true } }
          ]
        }
      });
    }

    let response = [];
    await Query.exec().then((data) => {
      if (!data) {
        return;
      }

      response = data.map((item) => item);
    });
    return response;
  };

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromLowStock = async () => {
    const wb = new Workbook();

    let xlsxLowStockProduct = [];

    if (subCategory.length > 0) {
      xlsxLowStockProduct = await getAllLowStockSummaryByCategoryxlsx(
        subCategory
      );
    } else {
      xlsxLowStockProduct = await getAllLowStockSummaryForAllCategoriesxlsx();
    }

    let data = [];
    if (xlsxLowStockProduct.length > 0) {
      for (var i = 0; i < xlsxLowStockProduct.length; i++) {
        const record = {
          Id: i + 1,
          'Product Name': xlsxLowStockProduct[i].name,
          Hsn: xlsxLowStockProduct[i].hsn,
          'Stock Reorder Qty': xlsxLowStockProduct[i].stockReOrderQty,
          'Stock Qty': xlsxLowStockProduct[i].stockQty,
          'Stock Value':
            xlsxLowStockProduct[i].stockQty *
            xlsxLowStockProduct[i].purchasedPrice
        };
        data.push(record);
      }
    } else {
      const record = {
        Id: '',
        'Product Name': '',
        Hsn: '',
        'Stock Reorder Qty': '',
        'Stock Qty': '',
        'Stock Value': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Low Stock Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Low Stock Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Low_Stock_Report';
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

  function multiplierGetter(params) {
    return params.data.stockQty * params.data.purchasedPrice;
  }

  const handleChange = (event) => {
    setCategory(event.displayName);
    getBusinessLevel3Categorieslist(event.name);
  };

  const handleChangeSubCategory = (event) => {
    setSubCategory(event.displayName);
    setSubCategoryName(event.name);

    setTotalPages(1);
    setCurrentPage(1);
    setOnChange(true);
  };

  const resetCategory = () => {
    setCategory([]);
    setSubCategory([]);
    setSubCategoryName([]);
    setCurrentPage(1);
    setTotalPages(1);
    setOnChange(true);
    getBusinessLevel2Categorieslist();
    resetData();
    getAllLowStockSummaryForAllCategories(warehouse);
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    resetData();
    getBusinessLevel2Categorieslist();
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        if (subCategory.length > 0) {
          getLowStockSummaryByCategory(subCategoryName);
        } else {
          getLowStockSummaryForAllCategories();
        }
        setOnChange(false);
      }
    };

    loadPaginationData();
  }, [onChange]);

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
                    LOW STOCK SUMMARY
                  </Typography>
                </div>
              </div>

              <div>
                <Grid
                  container
                  spacing={1}
                  className={classes.categoryActionWrapper}
                >
                  <Grid item xs={10}>
                    {/*  <div>
                      <form className={classes.blockLine} noValidate>
                        
                        <TextField
                          id="date"
                          label="From"
                          type="date"
                          className={classes.textField}
                          value={fromDate}
                          onChange={(e) =>
                            setFromDate(formatDate(e.target.value))
                          }
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
                    </div> */}
                  </Grid>
                  <Grid item xs={2} style={{ marginTop: '14px' }}>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justify="flex-end"
                      className="category-actions-right"
                    >
                      <Avatar>
                        <IconButton onClick={() => getDataFromLowStock()}>
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

                <Grid container className={classes.categoryActionWrapper}>
                  <Grid item xs={12}>
                    <div className={classes.selectOption}>
                      <FormControl
                        required
                        className={clsx(classes.formControl, classes.noLabel)}
                      >
                        <Select
                          displayEmpty
                          value={category}
                          input={<Input />}
                          disableUnderline
                          className={classes.selectFont}
                        >
                          <MenuItem disabled value="">
                            Choose Category
                          </MenuItem>
                          {level2CategoriesList.map((c) => (
                            <MenuItem
                              key={c.name}
                              value={c.displayName}
                              name={c.name}
                              onClick={() => handleChange(c)}
                            >
                              {c.displayName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className={classes.selectOption}>
                      <FormControl
                        required
                        className={clsx(classes.formControl, classes.noLabel)}
                      >
                        <Select
                          displayEmpty
                          value={subCategory}
                          input={<Input />}
                          disableUnderline
                          className={classes.selectFont}
                        >
                          <MenuItem disabled value="">
                            Choose Sub Category
                          </MenuItem>
                          {level3CategoriesList.map((c) => (
                            <MenuItem
                              key={c.name}
                              value={c.displayName}
                              onClick={() => handleChangeSubCategory(c)}
                            >
                              {c.displayName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className={classes.selectOption}>
                      <Button
                        className={classes.resetbtn}
                        size="small"
                        onClick={resetCategory}
                        color="secondary"
                      >
                        Reset Categories
                      </Button>
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
                                getLowStockSummaryByWarehouse(e.target.value);
                              } else {
                                setWarehouse('');
                                getLowStockSummaryByWarehouse('');
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
              {/* lowStockProductsList */}

              <div className={classes.itemTable}>
                {/* <App />  */}

                <Box mt={1}>
                  <div
                    style={{
                      width: '100%',
                      height: height - 249 + 'px'
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
                        rowData={lowStockProductsList}
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

export default InjectObserver(LowStockSummary);