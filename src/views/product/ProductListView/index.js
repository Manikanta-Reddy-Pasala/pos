import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Grid,
  makeStyles,
  InputAdornment,
  Divider,
  Paper,
  Switch,
  Typography,
  Button,
  Avatar,
  ListSubheader,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  DialogActions,
  DialogContent,
  DialogContentText,
  Dialog,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import { AgGridReact } from 'ag-grid-react';
import Controls from '../../../components/controls/index';
import Page from '../../../components/Page';
import './Products.css';
import Excel from '../../../icons/Excel';
import ProductModal from '../../../components/modal/ProductModal';
import BarCodeModal from 'src/components/modal/BarCodeModal';
import * as Db from '../../../RxDb/Database/Database';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import { Link } from 'react-router-dom';
import NoPermission from '../../noPermission';
import * as Bd from '../../../components/SelectedBusiness';
import BubbleLoader from '../../../components/loader';
import useWindowDimensions from 'src/components/windowDimension';
import left_arrow from '../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../icons/svg/last_page_arrow.svg';
import MfgModal from 'src/components/modal/MfgModal';
import { getTxnByProduct } from 'src/components/Helpers/ProductTxnQueryHelper';
import ConfirmModal from 'src/components/modal/ConfirmModal';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(1)
  },
  productCard: {
    height: '100%',
    backgroundColor: '#fff'
  },
  productContainer: {
    padding: 8,
    margin: 0
  },
  gridControl: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  productListBody: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  productHeader: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    position: 'sticky',
    display: 'block',
    zIndex: 1,
    top: 0
  },
  searchInputRoot: {
    borderRadius: 50
  },
  searchInputInput: {
    paddingTop: '10.5px !important',
    paddingBottom: '10.5px !important'
  },
  categoryListRoot: {
    width: '100%',
    //maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    borderRadius: 15
  },
  categorySubHeader: {
    borderRadius: 15,
    paddingTop: '22px'
  },
  accordionDetail: {
    padding: 0
  },
  nested: {
    paddingLeft: theme.spacing(2),
    '& .listitem-button:hover': {
      backgroundColor: '#fff'
    }
  },
  excelIcon: {
    color: 'grey'
  },
  categoryActionWrapper: {
    padding: theme.spacing(2),
    '& .category-actions-left': {
      '& > *': {
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    },
    '& .category-actions-right': {
      '& > *': {
        // marginLeft: theme.spacing(2),
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    },
    '& .barcode': {
      marginRight: theme.spacing(2)
    }
  },
  panelHeading: {
    fontSize: 14
  },
  panelColor: {
    background: 'red'
  },

  storebtn: {
    borderTop: '1px solid #d8d8d8',
    borderRadius: 'initial',
    borderBottom: '1px solid #d8d8d8',
    paddingLeft: '12px',
    paddingRight: '12px',
    position: 'relative',
    fontSize: 12,
    color: '#b5b3b3',
    padding: '9px 5px 7px 5px'
  },
  onlinebtn: {
    // paddingRight: '14px',
    // paddingLeft: '12px',
    border: '1px solid #d8d8d8',
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 'initial',
    borderTopLeftRadius: 'initial',
    position: 'relative',
    fontSize: 12,
    color: '#b5b3b3',
    padding: '9px 14px 7px 12px'
  },
  allbtn: {
    border: '1px solid #d8d8d8',
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 'initial',
    borderTopRightRadius: 'initial',
    position: 'relative',
    fontSize: 12,
    color: '#b5b3b3',
    padding: '9px 5px 7px 5px'
  },
  icon: {
    width: '20px',
    height: '20px',
    margin: '0 !important',
    objectFit: 'contain'
  },
  tabStyle: {
    position: 'relative',
    fontSize: 12,
    color: '#b5b3b3',
    padding: '9px 5px'
  }
}));

const ActivateSwitch = withStyles((theme) => ({
  root: {
    width: 34,
    height: 17,
    padding: 0,
    marginLeft: '1rem'
  },
  switchBase: {
    padding: '1px !important',
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: '#2e7d32',
        borderColor: '#2e7d32'
      }
    }
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 20,
    opacity: 1,
    backgroundColor: theme.palette.common.white
  },
  checked: {}
}))(Switch);

const ProductList = () => {
  const classes = useStyles();
  const stores = useStore();
  const { height } = useWindowDimensions();

  const [selectedRowData, setSelectedRowData] = useState(null);

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleErrorAlertMessageClose = () => {
    setErrorAlertMessage(false);
    setErrorMessage('');
  };

  const { productCategory, selectedLevel3CategoryName } = toJS(
    stores.ProductStore
  );
  const {
    setProductCategory,
    handleEditProductModal,
    handleRemoveProduct,
    setSelectedLevel3Category,
    handleEnableOrDisableProduct,
    resetSelectedLevel3Category,
    setProductDetailDataForManufacture
  } = stores.ProductStore;

  let [onChange, setOnChange] = useState(true);
  let [productData, setProductData] = useState([]);
  const [category, setCategory] = useState([]);
  const [categoryHeader, setCategoryHeader] = useState('');
  const [categoryCountHeader, setCategoryCountHeader] = useState('');
  const [expanded, setExpanded] = React.useState(false);

  const [isOpenedAll, setIsOpenedAll] = useState(true);
  const [isOpenedInStore, setIsOpenedInStore] = useState(false);
  const [isOpenedOnline, setIsOpenedOnline] = useState(false);
  const [columnDefs, setColumnDefs] = useState([]);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [productToDelete, setProductToDelete] = useState();

  const confirmDeleteItem = async (confirm) => {
    if (confirm) {
      handleRemoveProduct(productToDelete);
      setIsOpenConfirmModal(false);
      setAnchorEl(null);
    }
  };

  function toggle(value) {
    if (value === 'ALL') {
      setIsOpenedAll(true);
      setIsOpenedInStore(false);
      setIsOpenedOnline(false);
      setOnChange(true);
      //LoadProductsByLevel3CategoryAndProductType('ALL');
    }
    if (value === 'STORE') {
      setIsOpenedAll(false);
      setIsOpenedInStore(true);
      setIsOpenedOnline(false);
      setOnChange(true);
      //LoadProductsByLevel3CategoryAndProductType('STORE');
    }
    if (value === 'ONLINE') {
      setIsOpenedAll(false);
      setIsOpenedInStore(false);
      setIsOpenedOnline(true);
      setOnChange(true);
      //LoadProductsByLevel3CategoryAndProductType('ONLINE');
    }
  }

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

  useEffect(() => {
    async function fetchData() {
      setColumnDefs(await getColumnDefs());
    }

    fetchData();
  }, []);

  function getColumnDefs() {
    let columnDefs = [];
    setColumnDefs(columnDefs);

    const name = {
      headerName: 'NAME',
      field: 'name',
      width: 600,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    // const quantity = {
    //   headerName: 'QUANTITY',
    //   field: 'stockQty',
    //   width: 120,
    //   filterParams: {
    //     buttons: ['reset', 'apply'],
    //     closeOnApply: true
    //   },
    //   valueFormatter: (params) => {
    //     let data = params['data'];
    //     let result = 0;

    //     result =
    //       (parseFloat(data['stockQty']) || 0) +
    //       (parseFloat(data['freeQty']) || 0);

    //     return parseFloat(result).toFixed(2);
    //   },
    //   headerComponentFramework: (props) => {
    //     return (
    //       <div>
    //         <p>TOTAL</p>
    //         <p>STOCK</p>
    //       </div>
    //     );
    //   }
    // };

    // const freeQty = {
    //   headerName: 'FREE QUANTITY',
    //   field: 'stockQty',
    //   width: 120,
    //   filterParams: {
    //     buttons: ['reset', 'apply'],
    //     closeOnApply: true
    //   },
    //   valueFormatter: (params) => {
    //     let data = params['data'];
    //     let result = 0;

    //     result = parseFloat(data['freeQty']) || 0;

    //     return parseFloat(result).toFixed(2);
    //   },
    //   headerComponentFramework: (props) => {
    //     return (
    //       <div>
    //         <p>FREE</p>
    //         <p>STOCK</p>
    //       </div>
    //     );
    //   }
    // };

    // const stockVal = {
    //   headerName: 'STOCK VALUE',
    //   field: 'stockValue',
    //   width: 120,
    //   filterParams: {
    //     buttons: ['reset', 'apply'],
    //     closeOnApply: true
    //   },
    //   valueFormatter: (params) => {
    //     let data = params['data'];
    //     let result = 0;

    //     let batchData = data['batchData'];

    //     let tax = 0;
    //     if (data.purchaseTaxIncluded) {
    //       if (data.purchaseTaxType === 'CGST - SGST') {
    //         const cgst = parseFloat(data.purchaseSgst) || 0;
    //         const sgst = parseFloat(data.purchaseCgst) || 0;

    //         tax = cgst + sgst;
    //       } else if (data.purchaseTaxType === 'IGST') {
    //         tax = parseFloat(data.purchaseIgst) || 0;
    //       }
    //     }

    //     if (batchData && batchData.length > 0) {
    //       for (let batch of batchData) {
    //         let purchasedPrice = batch.purchasedPrice;

    //         if (tax > 0) {
    //           purchasedPrice = purchasedPrice / (1 + tax / 100);
    //         }

    //         let quantity =
    //           parseFloat(batch.qty) - parseFloat(batch.manufacturingQty);

    //         result =
    //           result + (parseFloat(purchasedPrice) || 0) * parseFloat(quantity);

    //         if (batch.manufacturingQty > 0) {
    //           let mfgCost = 0;
    //           if (data.rawMaterialData && data.rawMaterialData) {
    //             mfgCost = parseFloat(data.rawMaterialData.total);
    //           }
    //           result =
    //             result +
    //             (parseFloat(mfgCost) || 0) * parseFloat(batch.manufacturingQty);
    //         }
    //       }
    //     } else {
    //       let purchasedPrice = data.purchasedPrice;
    //       if (tax > 0) {
    //         purchasedPrice = purchasedPrice / (1 + tax / 100);
    //       }

    //       result =
    //         parseFloat(data['stockQty']) * (parseFloat(purchasedPrice) || 0);
    //     }

    //     return parseFloat(result).toFixed(2);
    //   },
    //   headerComponentFramework: (props) => {
    //     return (
    //       <div>
    //         <p>TOTAL</p>
    //         <p>STOCK VALUE</p>
    //       </div>
    //     );
    //   }
    // };

    const mfgRenderer = {
      headerName: '',
      field: '',
      suppressMenu: true,
      sortable: false,
      width: 50,
      cellRenderer: 'templateMfgRenderer',
      cellRendererParams: {
        clicked: function (field) {
          alert(`${field} was clicked`);
        }
      }
    };

    const actionRenderer = {
      headerName: '',
      field: '',
      suppressMenu: true,
      sortable: false,
      cellRenderer: 'templateActionRenderer',
      cellRendererParams: {
        clicked: function (field) {
          alert(`${field} was clicked`);
        }
      }
    };

    // const netWeight = {
    //   width: 100,
    //   filterParams: {
    //     buttons: ['reset', 'apply'],
    //     closeOnApply: true
    //   },
    //   headerComponentFramework: (props) => {
    //     return (
    //       <div>
    //         <p>TOTAL</p>
    //         <p>NT. W</p>
    //       </div>
    //     );
    //   },
    //   valueFormatter: (params) => {
    //     return params['data']['netWeight']
    //       ? parseFloat(params['data']['netWeight']).toFixed(3)
    //       : parseFloat(0).toFixed(3);
    //   }
    // };

    columnDefs.push(name);
    // columnDefs.push(quantity);
    // columnDefs.push(freeQty);
    // columnDefs.push(stockVal);
    // if (String(localStorage.getItem('isJewellery')).toLowerCase() === 'true') {
    //   columnDefs.push(netWeight);
    // }
    columnDefs.push(mfgRenderer);
    columnDefs.push(actionRenderer);

    return columnDefs;
  }

  let [rowData, setRowData] = useState(null);

  const getInitialCategories = async () => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    const categoryQuery = db.businesscategories.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });
    const category = categoryQuery.$.subscribe((data) => {
      if (!data) {
        console.log('Internal Server Error');
        return;
      }
      let response = data.map((item) => item.toJSON());
      // console.log("joe",response);
      // set level2 and level3 categories list to a varaible
      setProductCategory(response);
      // load products by level2 category
    });
    setCategory((prevState) => [...prevState, category]);
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    setCategory([]);
    resetSelectedLevel3Category();
    fetchData();

    /**
     * by default open all the products
     */
    setIsOpenedAll(true);
    setIsOpenedInStore(false);
    setIsOpenedOnline(false);
    /**
     * get categories
     */
    getInitialCategories();
    setTimeout(() => setLoadingShown(false));
    return () => {
      category.map((sub) => sub.unsubscribe());
    };
  }, []);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setOnChange(false);
        setRowData([]);
        await getProductData();
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getProductData = async () => {
    const db = await Db.get();
    var Query;

    let filterArray = [];

    const businessData = await Bd.getBusinessData();

    const businessFilter = { businessId: { $eq: businessData.businessId } };
    filterArray.push(businessFilter);

    if (category.name) {
      let filter = {
        'categoryLevel3.name': { $eq: category.name }
      };
      filterArray.push(filter);
    }

    if (isOpenedInStore) {
      let filter = {
        isOffLine: { $eq: true }
      };

      filterArray.push(filter);
    } else if (isOpenedOnline) {
      let filter = {
        isOnLine: { $eq: true }
      };
      filterArray.push(filter);
    }

    let skip = 0;
    setRowData([]);
    setProductData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllProductData(filterArray);
    }

    Query = db.businessproduct.find({
      selector: {
        $and: filterArray
      },
      limit: limit,
      skip: skip
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => {
        let temp = item;

        temp.item_count = 0;

        if (item.item_list) {
          temp.item_count = item.item_list.length;
        }

        return temp;
      });
      setProductData(response);
    });
  };

  const getAllProductData = async (filterArray) => {
    const db = await Db.get();
    var Query;

    Query = db.businessproduct.find({
      selector: {
        $and: filterArray
      }
    });

    await Query.exec().then((data) => {
      let count = data.length;
      let numberOfPages = 1;

      if (!data) {
        return;
      }

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const getProductSearchData = async (value) => {
    const db = await Db.get();
    var Query;

    let finalValue = value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

    const businessData = await Bd.getBusinessData();
    var regexp = new RegExp('^.*' + finalValue + '.*$', 'i');

    let skip = 0;
    setRowData([]);
    setProductData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllProductSearchData(finalValue);
    }

    Query = db.businessproduct.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            name: { $regex: regexp }
          }
        ]
      },
      limit: limit,
      skip: skip
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => {
        let temp = item;

        temp.item_count = 0;

        if (item.item_list) {
          temp.item_count = item.item_list.length;
        }

        return temp;
      });
      setProductData(response);
    });
  };

  const getAllProductSearchData = async (value) => {
    const db = await Db.get();
    var Query;

    const businessData = await Bd.getBusinessData();
    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    Query = db.businessproduct.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            name: { $regex: regexp }
          }
        ]
      }
    });

    await Query.exec().then((data) => {
      let count = data.length;
      let numberOfPages = 1;

      if (!data) {
        return;
      }

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Product')) {
        setFeatureAvailable(false);
      }
    }
  };

  useEffect(() => {
    // console.log('use effect:::', productData);
    if (gridApi) {
      if (productData) {
        gridApi.setRowData(productData);
      }
    } else {
      setRowData(productData);
    }
  }, [productData]);

  useEffect(() => {
    // console.log('use effect:::', productData);
    if (gridApi) {
      if (productData) {
        gridApi.setRowData(rowData);
      }
    }
  }, [rowData]);

  const innerHandleProductSearch = async (value) => {
    if (value.length > 2) {
      getProductSearchData(value);
    } else {
      getProductData();
    }
  };

  const rowClassRules = {
    rowHighlight(params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    });
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

  const deleteProduct = async (props) => {
    let data = props['data'];
    const db = await Db.get();
    let txnList = await getTxnByProduct(db, data.productId);
    if (txnList && txnList.length > 0) {
      setErrorMessage(
        'Product cannot be deleted as it has transactions associated!'
      );
      setErrorAlertMessage(true);
    } else {
      setIsOpenConfirmModal(true);
    }
  };

  /**
   * based on isOnline value ActivateSwitch should enable or disbale
   */
  const TemplateActionRenderer = (props) => {
    // console.log('props:::', toJS(props['data']));
    let data = props['data'];
    setSelectedRowData(props);
    return (
      <Box style={{float:'right'}}>
        {/* {String(localStorage.getItem('isHotelOrRestaurant')).toLowerCase() === 'false' && data.rawMaterialData && data.rawMaterialData.rawMaterialList && data.rawMaterialData.rawMaterialList.length > 0 ? (
         <Button size="small">
            <Avatar
              style={{ height: '25px', width: '25px', marginTop: '10px' }}
            >
              <IconButton
                style={{
                  fontSize: '12px',
                  width: '25px',
                  height: '25px',
                  color: '#FFFFFF',
                  backgroundColor: '#4a83fb'
                }}
                onClick={() => {
                  setProductDetailDataForManufacture(data, false);
                }}
              >
                M
              </IconButton>
            </Avatar>
          </Button>
        ) : ' '} */}
        <Button
          size="small"
          onClick={() => {
            handleEditProductModal(props);
          }}
        >
          Edit
        </Button>
        <Button
          color="secondary"
          size="small"
          onClick={() => {
            setProductToDelete(props);
            deleteProduct(props);
          }}
        >
          Delete
        </Button>

        <ActivateSwitch
          name="product-swtich"
          size="small"
          checked={!props.data.isOutOfStock}
          onClick={() => handleEnableOrDisableProduct(props)}
        />
      </Box>
    );
  };

  const TemplateMfgRenderer = (props) => {
    let data = props['data'];
    setSelectedRowData(props);
    return String(localStorage.getItem('isHotelOrRestaurant')).toLowerCase() ===
    'false' &&
    data.rawMaterialData &&
    data.rawMaterialData.rawMaterialList &&
    data.rawMaterialData.rawMaterialList.length > 0 ? (
      <Avatar style={{ height: '25px', width: '25px', marginTop: '10px',float:'right' }}>
        <IconButton
          style={{
            fontSize: '12px',
            width: '25px',
            height: '25px',
            color: '#FFFFFF',
            backgroundColor: '#4a83fb'
          }}
          onClick={() => {
            setProductDetailDataForManufacture(data, false);
          }}
        >
          M
        </IconButton>
      </Avatar>
    ) : (
      ' '
    );
  };

  var expandedid = null;

  const handleListChange = (panel) => (event, isExpanded) => {
    expandedid = isExpanded ? panel : null;
    setExpanded(isExpanded ? panel : false);
  };

  const handleLevel3CategoryClick = (item) => {
    setCategoryHeader(item.displayName);
    setCategoryCountHeader(item.count);
    setSelectedLevel3Category(item);
    category.name = item.name;
    setOnChange(true);
  };

  const getLevel2Count = (item) => {
    let count = 0;
    for (let category of item.level3Categories) {
      count += category.count;
    }

    return count;
  };

  return (
    <div>
      <Page className={classes.root} title="Products">
        <div>
          {isLoading && <BubbleLoader></BubbleLoader>}
          {!isLoading && (
            <div>
              {isFeatureAvailable ? (
                <div>
                  <Container
                    maxWidth={false}
                    className={classes.productContainer}
                  >
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="stretch"
                      spacing={1}
                    >
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        className={classes.gridControl}
                      >
                        <Paper className={classes.productCard}>
                          <List
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                              <ListSubheader
                                component="div"
                                className={classes.categorySubHeader}
                              >
                                CATEGORIES
                              </ListSubheader>
                            }
                            className={classes.categoryListRoot}
                            dense
                          >
                            <Divider />
                            {productCategory.map((item, idx) => (
                              <Accordion
                                expanded={expanded === String(idx)}
                                onChange={handleListChange(String(idx))}
                              >
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  aria-controls={String(idx)}
                                  id={String(idx)}
                                  style={
                                    expanded === String(idx)
                                      ? { background: '#f6f8fa' }
                                      : {}
                                  }
                                >
                                  <Typography className={classes.panelHeading}>
                                    {item.level2Category.displayName +
                                      ' (' +
                                      getLevel2Count(item) +
                                      ')'}
                                  </Typography>
                                </AccordionSummary>

                                <AccordionDetails
                                  className={classes.accordionDetail}
                                  style={{ background: '#f6f8fa' }}
                                >
                                  <List
                                    component="div"
                                    disablePadding
                                    dense
                                    className={classes.nested}
                                  >
                                    {item.level3Categories.map(
                                      (category, idx) => (
                                        <ListItem
                                          button
                                          className="listitem-button"
                                          onClick={() =>
                                            handleLevel3CategoryClick(category)
                                          }
                                        >
                                          <ListItemText
                                            primary={
                                              category.displayName +
                                              ' (' +
                                              category.count +
                                              ')'
                                            }
                                          />
                                        </ListItem>
                                      )
                                    )}
                                  </List>
                                </AccordionDetails>
                              </Accordion>
                            ))}
                          </List>
                        </Paper>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={8}
                        md={9}
                        className={classes.gridControl}
                      >
                        {/* <Paper className={classes.productHeader}>

                      </Paper> */}
                        <Paper
                          className={classes.productListBody}
                          style={{ marginBottom: 0 }}
                        >
                          <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                            style={{ marginBottom: '10px', marginTop: '-10px' }}
                          >
                            <Grid item xs={6}>
                              <Grid
                                container
                                direction="row"
                                className={classes.categoryActionWrapper}
                              >
                                <Grid
                                  container
                                  direction="row"
                                  className="category-actions-right"
                                >
                                  {/* <Avatar  className="barcode">
                                <Link to="/app/barcodePrinter">
                                  <Svg
                                    icon="barcode"
                                    className={classes.icon}
                                  />
                                </Link>
                              </Avatar> */}

                                  <Avatar>
                                    <Link to="/app/excelUpload">
                                      <IconButton
                                        classes={{ label: classes.label }}
                                      >
                                        <Excel fontSize="inherit" />
                                      </IconButton>
                                    </Link>
                                  </Avatar>

                                  {/*<Avatar>
                      <Print color="action" />
                   </Avatar>*/}
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: 'end' }}>
                              <ProductModal />
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            justify="center"
                          >
                            <Grid item xs={12} sm={4}>
                              <Typography
                                variant="h4"
                                style={{ marginLeft: '20px' }}
                              >
                                {selectedLevel3CategoryName}
                                {/* {selectedLevel3Category.count} */}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Button
                                size="small"
                                /* style={{
                                position: 'relative',
                                fontSize: 12,
                                color: '#b5b3b3',
                                padding: '9px 5px'
                              }} */
                                style={
                                  isOpenedAll
                                    ? { background: '#9DCB6A', color: 'white' }
                                    : {}
                                }
                                onClick={() => {
                                  toggle('ALL');
                                }}
                                className={classes.allbtn}
                              >
                                All
                              </Button>
                              <Button
                                size="small"
                                /* style={{
                                position: 'relative',
                                fontSize: 12,
                                color: '#b5b3b3',
                                padding: '9px 5px'
                              }} */
                                style={
                                  isOpenedInStore
                                    ? { background: '#9DCB6A', color: 'white' }
                                    : {}
                                }
                                onClick={() => {
                                  toggle('STORE');
                                }}
                                className={classes.storebtn}
                              >
                                In-Store
                              </Button>
                              <Button
                                size="small"
                                style={
                                  isOpenedOnline
                                    ? {
                                      background: '#9DCB6A',
                                      color: 'white',
                                      padding: '9px 14px 7px 12px'
                                    }
                                    : {}
                                }
                                className={classes.onlinebtn}
                                onClick={() => {
                                  toggle('ONLINE');
                                }}
                              >
                                Online
                              </Button>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Controls.Input
                                placeholder="Search"
                                size="small"
                                fullWidth
                                onKeyUp={(event) =>
                                  innerHandleProductSearch(event.target.value)
                                }
                                InputProps={{
                                  classes: {
                                    root: classes.searchInputRoot,
                                    input: classes.searchInputInput
                                  },
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Search color="disabled" />
                                    </InputAdornment>
                                  )
                                }}
                              />
                            </Grid>
                          </Grid>

                          <Box mt={4}>
                            <div
                              style={{
                                width: '100%',
                                height: height - 248 + 'px'
                              }}
                            >
                              <div
                                id="product-list-grid"
                                style={{
                                  height: '100%',
                                  width: '100%',
                                  overflowX: 'auto'
                                }}
                                className="ag-theme-material"
                              >
                                <AgGridReact
                                  onGridReady={onGridReady}
                                  enableRangeSelection
                                  paginationPageSize={20}
                                  suppressMenuHide
                                  rowData={rowData}
                                  columnDefs={columnDefs}
                                  defaultColDef={defaultColDef}
                                  pagination
                                  headerHeight={40}
                                  rowSelection="single"
                                  suppressPaginationPanel={true}
                                  suppressScrollOnNewData={true}
                                  rowClassRules={rowClassRules}
                                  force
                                  suppressFlash
                                  overlayLoadingTemplate={
                                    '<span className="ag-overlay-loading-center">Please wait while your rows are loading</span>'
                                  }
                                  frameworkComponents={{
                                    templateMfgRenderer: TemplateMfgRenderer,
                                    templateActionRenderer:
                                    TemplateActionRenderer
                                  }}
                                />
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
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Container>
                  <BarCodeModal />
                </div>
              ) : (
                <NoPermission />
              )}
            </div>
          )}
          <MfgModal />
        </div>
      </Page>
      <Dialog
        fullScreen={fullScreen}
        open={openErrorAlertMessage}
        onClose={handleErrorAlertMessageClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorAlertMessageClose}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {isOpenConfirmModal ? (
        <ConfirmModal
          open={isOpenConfirmModal}
          onConfirm={(isConfirm) => confirmDeleteItem(isConfirm)}
          onClose={() => setIsOpenConfirmModal(false)}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default InjectObserver(ProductList);
