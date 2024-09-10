import React, {  useEffect, useState } from 'react';
import Page from '../../../../components/Page';
import FilterDropdown from '../../../common/FilterDropdown';

import {
  Box,
  Button,
  Card,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography
} from '@material-ui/core';
import { Add, Print, Search } from '@material-ui/icons';
import AddSalesInvoice from '../AddInvoice';
import Controls from '../../../../components/controls/index';
import Moreoptions from '../../../../components/MoreoptionsSales';
import * as Db from '../../../../RxDb/Database/Database';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { AgGridReact } from 'ag-grid-react';
import ProductModal from '../../../../components/modal/ProductModal';
import './sale.css';
import { printThermal } from '../../../Printers/ComponentsToPrint/printThermalContent';
import { InvoiceThermalPrintContent } from '../../../Printers/ComponentsToPrint/invoiceThermalPrintContent';
import * as moment from 'moment';
import DateRangePicker from '../../../../components/controls/DateRangePicker';
import dateFormat from 'dateformat';
import useWindowDimensions from 'src/components/windowDimension';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import AddDeliveryChallan from '../../DeliveryChallan/AddDeliveryChallan';
import * as Bd from '../../../../components/SelectedBusiness';
import AddCreditNote from '../../SalesReturn/AddCreditNote';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import RecievePayment from 'src/components/RecievePayment';
import OpenPreview from 'src/components/OpenPreview';
import CustomPrintPopUp from 'src/views/Printers/Invoice/CustomPrintPopUp';
import { getCustomerName, getSaleName } from 'src/names/constants';
import * as einvoice from 'src/components/Helpers/EinvoiceAPIHelper';
import Loader from 'react-js-loader';
import { getSaleDataBySearch } from '../../../../components/Helpers/SearchHelper';
import { getDateBeforeMonths, getFinancialYearStartDate } from '../../../../components/Helpers/DateHelper';
import moreoption from '../../../../components/Options';


const useStyles = makeStyles((theme) => ({
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
    marginBottom: 30
  },
  tableRow: {
    '&.Mui-selected': {
      backgroundColor: '#CEE6F3 !important'
    }
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
  }
}));

const useHeaderStyles = makeStyles((theme) => ({
  paperRoot: {
    margin: theme.spacing(1),
    borderRadius: 6
  },
  pageHeader: {
    padding: theme.spacing(2)
  },
  pageIcon: {
    display: 'inline-block',
    padding: theme.spacing(2),
    color: '#3c44b1'
  },
  pageTitle: {
    paddingLeft: theme.spacing(4),
    '& .MuiTypography-subtitle2': {
      opacity: '0.6'
    }
  },
  mySvgStyle: {
    fillColor: theme.palette.primary.main
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

const Saleslist = (props) => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const headerClasses = useHeaderStyles();
  const stores = useStore();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const { productDialogOpen } = stores.ProductStore;

  const [searchText, setSearchText] = useState('');

  const { OpenAddDeliveryChallanInvoice } = toJS(stores.DeliveryChallanStore);

  const [selectedMonthFilter] = useState(() => {
    // Initialize state from local storage if available
    return localStorage.getItem('saleSelectedMonthFilter') || 3;
  });
  const {
    openAddSalesInvoice,
    printData,
    openPrintSelectionAlert,
    isLaunchEWayAfterSaleCreation,
    openCancelDialog,
    cancelRemark,
    cancelItem,
    cancelItemIsEInvoice
  } = toJS(stores.SalesAddStore);
  const {
    openAddSalesReturn,
    openSaleReturnPrintSelectionAlert,
    printDataSalesReturn
  } = toJS(stores.ReturnsAddStore);
  const { handleCloseSaleReturnPrintSelectionAlertMessage } =
    stores.ReturnsAddStore;
  const {
    openEWayGenerateModal,
    openSuccessAlertSaleMessage,
    successMessage,
    openEWayPrintSelectionAlert,
    invoiceDetails
  } = toJS(stores.EWayStore);
  const { handleSaleSuccessAlertMessageClose, handleOpenEWayGenerateModal } =
    stores.EWayStore;
  const { OpenReceivePayment } = toJS(stores.PaymentInStore);

  const {
    openForNewSale,
    handleClosePrintSelectionAlertMessage,
    resetEWayLaunchFlag,
    isSaleLockedForCancel,
    handleCancelClose,
    setCancelRemark,
    cancelSale
  } = stores.SalesAddStore;
  const { getInvoiceSettings } = stores.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal, openCustomPrintPopUp } = toJS(
    stores.PrinterSettingsStore
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDialogName, setOpenDialog] = React.useState(null);
  const [isStartPrint, setIsStartPrint] = React.useState(false);

  const { getTransactionData } = stores.TransactionStore;
  const { transaction } = toJS(stores.TransactionStore);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [limit] = useState(10);

  const [rowData, setRowData] = useState(null);
  let [saleData, setSaleData] = useState([]);
  let [allSaleData, setAllSaleData] = useState({});
  let [onChange, setOnChange] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = useState(false);

  const [openLoadingAlert, setOpenLoadingAlert] = useState(false);
  const [loadingAlertText, setLoadingAlertText] = useState('');

  const handleErrorAlertMessageClose = () => {
    setErrorAlertMessage(false);
    setErrorMessage('');
  };

  const handleOpenLoadingAlertClose = () => {
    setLoadingAlertText('');
    setOpenLoadingAlert(false);
  };

  const [dateRange, setDateRange] = useState({
    fromDate: new Date(),
    toDate: new Date()
  });

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    filter: true,
    rowHeight: 50,
    headerHeight: 30,
    suppressMenuHide: true,
    suppressHorizontalScroll: false,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  const getSaleDataByDate = async (dateRange) => {
    const db = await Db.get();
    let Query;

    let skip = 0;
    setRowData([]);
    setSaleData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      await getAllSaleDataByDate(dateRange);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.sales.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            invoice_date: {
              $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
            }
          },
          {
            invoice_date: {
              $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
            }
          },
          {
            sortingNumber: { $exists: true }
          }
        ]
      },
      sort: [{ sortingNumber: 'desc' }],
      skip: skip,
      limit: limit
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
      setSaleData(response);
    });
  };

  const getSaleDataBySearchHandler = async (value) => {
    setRowData([]);
    setSaleData([]);
    setAllSaleData({});

    const requestId = Date.now().toString(); // Generate a unique request ID
    localStorage.setItem('currentRequestId', requestId); // Store the current request ID in local storage

    console.log('Request string:', value);

    let selectedMonthFilter = localStorage.getItem('saleSelectedMonthFilter');
    console.log("selectedMonthFilter",selectedMonthFilter);

    if(!selectedMonthFilter) {
      selectedMonthFilter = 3;
    }
    let date;
    if (selectedMonthFilter === 'FY') {
      date = getFinancialYearStartDate();
    } else {
      date = getDateBeforeMonths(selectedMonthFilter);
    }

    try {
      const data = await getSaleDataBySearch(value, currentPage, limit, date, requestId);

      // Check if the request ID matches the current request ID
      if (data && data.requestId === localStorage.getItem('currentRequestId')) {
        console.log('Request ID match. Updating state with response data.');
        if (data.saleData) {
          setSaleData(data.saleData);
        }
        if (data.allSaleData) {

          let updatedData = allSaleData;
          updatedData.unPaid = data.allSaleData.allUnPaid;
          updatedData.paid = data.allSaleData.allPaid;

          console.log('updatedData:', updatedData);
          setAllSaleData(updatedData);
        }
        if (data.totalPages && currentPage === 1) {
          setTotalPages(data.totalPages);
        }
      } else {
        console.log('Request ID mismatch. Ignoring response.');
      }
    } catch (error) {
      console.error('Error fetching sale data by search:', error);
    }
  };

  const getAllSaleDataByDate = async (dateRange) => {
    const db = await Db.get();
    let Query;
    const businessData = await Bd.getBusinessData();

    Query = db.sales.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            invoice_date: {
              $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
            }
          },
          {
            invoice_date: {
              $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
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
      let response = data
        .map((item) => {
          let output = {};

          output.total_amount = item.total_amount;
          output.balance_amount = item.balance_amount;
          output.order_type = item.order_type;
          output.item_count = 0;

          if (item.item_list) {
            output.item_count = item.item_list.length;
          }

          ++count;
          return output;
        })
        .reduce(
          (a, b) => {
            let data = toJS(b);

            a.allPaid = parseFloat(
              parseFloat(a.allPaid) +
              (parseFloat(data.total_amount) -
                parseFloat(data.balance_amount))
            ).toFixed(2);

            a.allUnPaid = parseFloat(
              parseFloat(a.allUnPaid) + parseFloat(data.balance_amount)
            ).toFixed(2);

            if (
              data.order_type &&
              (data.order_type.toUpperCase() === 'POS' ||
                data.order_type.toUpperCase() === 'KOT' ||
                data.order_type.toUpperCase() === 'INVOICE')
            ) {
              a.storePaid = parseFloat(
                parseFloat(a.storePaid) +
                (parseFloat(data.total_amount) -
                  parseFloat(data.balance_amount))
              ).toFixed(2);

              a.storeUnPaid = parseFloat(
                parseFloat(a.storeUnPaid) + parseFloat(data.balance_amount)
              ).toFixed(2);
            } else {
              if (
                data.order_type &&
                data.order_type.toUpperCase() !== 'POS' &&
                data.order_type.toUpperCase() !== 'KOT' &&
                data.order_type.toUpperCase() !== 'INVOICE'
              ) {
                a.onlinePaid = parseFloat(
                  parseFloat(a.onlinePaid) +
                  (parseFloat(data.total_amount) -
                    parseFloat(data.balance_amount))
                ).toFixed(2);

                a.onlineUnPaid = parseFloat(
                  parseFloat(a.onlineUnPaid) + parseFloat(data.balance_amount)
                ).toFixed(2);
              }
            }

            a.paid = a.allPaid;
            a.unPaid = a.allUnPaid;

            return a;
          },
          {
            paid: 0,
            unPaid: 0,
            allPaid: 0,
            allUnPaid: 0,
            storePaid: 0,
            storeUnPaid: 0,
            onlinePaid: 0,
            onlineUnPaid: 0
          }
        );

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


  const statusCellStyle = (params) => {
    let data = params['data'];

    if (data['balance_amount'] === 0) {
      return { color: '#86ca94', fontWeight: 500 };
    } else if (
      data['balance_amount'] < data['total_amount'] ||
      data['balance_amount'] === data['total_amount']
    ) {
      return { color: '#faab53', fontWeight: 500 };
    }
    return null;
  };

  const einvoicestatusCellStyle = (params) => {
    let data = params['data'];

    if (data['einvoiceBillStatus'] === 'Completed') {
      return { color: '#86ca94', fontWeight: 500 };
    } else {
      return { color: '#ff0000', fontWeight: 500 };
    }
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 100);

    window.addEventListener('resize', function() {
      setTimeout(function() {
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

  function dateFormatter(params) {
    var dateAsString = params.data.invoice_date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const [columnDefs] = useState([
    {
      headerName: 'DATE',
      field: 'invoice_date',
      filter: false,
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
      valueFormatter: dateFormatter,
      width: 200
    },
    {
      headerName: 'INVOICE NUMBER',
      field: 'sequenceNumber',
      width: 250,
      filter: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>VOUCHER</p>
            <p>NUMBER</p>
          </div>
        );
      }
    },
    {
      headerName: getCustomerName().toUpperCase(),
      field: 'customer_name',
      filter: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 200
    },
    {
      headerName: 'PAYMENT TYPE',
      field: 'payment_type',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PAYMENT</p>
            <p>TYPE</p>
          </div>
        );
      },
      width: 150
    },
    {
      headerName: 'AMOUNT',
      field: 'total_amount',
      filter: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 240
    },
    {
      headerName: 'BALANCE DUE',
      field: 'balance_amount',
      filter: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>BALANCE</p>
            <p>DUE</p>
          </div>
        );
      },
      width: 240
    },
    {
      headerName: 'STATUS',
      field: 'status',
      filter: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueGetter: (params) => {
        let data = params['data'];
        let result = '';

        if (
          data['isCancelled'] === true ||
          'Cancelled' === data['einvoiceBillStatus']
        ) {
          result = 'Cancelled';
        } else if (parseFloat(data['balance_amount']) === 0) {
          result = 'Paid';
        } else if (
          parseFloat(data['balance_amount']) < parseFloat(data['total_amount'])
        ) {
          result = 'Partial';
        } else if (
          parseFloat(data['balance_amount']) ===
          parseFloat(data['total_amount'])
        ) {
          result = 'Unpaid';
        }

        return result;
      },
      cellStyle: statusCellStyle,
      width: 180
    },
    {
      headerName: 'E-WAY',
      field: 'ewayBillNo',
      filter: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'IRN',
      field: 'irnNo',
      filter: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: '',
      field: '',
      suppressMenu: true,
      sortable: false,
      cellRenderer: 'templateActionRenderer'
    }
  ]);

  const rowClassRules = {
    rowHighlight: function(params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  const TemplateActionRenderer = (props) => {
    return (
      <Moreoptions
        menu={moreoption.moreoptionsdata}
        index={props['data']['sequenceNumber']}
        item={props['data']}
        id={props['data']['sequenceNumber']}
        ewayminamount={transaction.enableEWayAmountLimit}
        component="salesList"
      />
    );
  };

  const TempaltePrintShareRenderer = (props) => {
    let printerlist;
    try {
      printerlist = JSON.parse(window.localStorage.getItem('printers'));
    } catch (e) {
      console.error(' Error: ', e.message);
    }

    return (
      <Box>
        {printerlist && printerlist.length > 0 && (
          <IconButton
            disableRipple
            disableFocusRipple
            disableTouchRipple
            onClick={() => onPrintClicked(props)}
          >
            <Print fontSize="inherit" />{' '}
          </IconButton>
        )}
      </Box>
    );
  };

  const onPrintClicked = (props) => {
    if (!invoiceThermal.boolDefault) {
      setIsStartPrint(true);
      setOpenDialog('print');
    } else {
      onIsStartPrint(props['data']);
    }
  };

  const onIsStartPrint = (data) => {
    const printContent = InvoiceThermalPrintContent(invoiceThermal, data);
    if (invoiceThermal.boolCustomization) {
      const customData = {
        pageSize: invoiceThermal.boolPageSize,
        width: invoiceThermal.customWidth,
        pageWidth: invoiceThermal.pageSizeWidth,
        pageHeight: invoiceThermal.pageSizeHeight,
        margin: invoiceThermal.customMargin
      };
      printContent.customData = customData;
    }
    printThermal(printContent);
  };

  const getsalesListBySaleType = async (saleTxnType) => {
    if (saleData) {
      let updatedData = allSaleData;
      if (saleTxnType === 'ALL') {
        setRowData(saleData);

        updatedData.paid = updatedData.allPaid;
        updatedData.unPaid = updatedData.allUnPaid;
        setAllSaleData(updatedData);
      } else {
        let filteredData = [];

        if (saleTxnType === 'STORE') {
          updatedData.paid = updatedData.storePaid;
          updatedData.unPaid = updatedData.storeUnPaid;
          if(updatedData.paid != undefined){
            setAllSaleData(updatedData);
          }
          
        } else {
          updatedData.paid = updatedData.onlinePaid;
          updatedData.unPaid = updatedData.onlineUnPaid;
          setAllSaleData(updatedData);
        }
        //filter in selected page
        for (let row of saleData) {
          let matchFound = false;

          if (saleTxnType === 'STORE') {
            if (
              row.order_type.toUpperCase() === 'POS' ||
              row.order_type.toUpperCase() === 'KOT' ||
              row.order_type.toUpperCase() === 'INVOICE'
            ) {
              matchFound = true;
            }
          } else {
            if (
              row.order_type.toUpperCase() !== 'POS' &&
              row.order_type.toUpperCase() !== 'KOT' &&
              row.order_type.toUpperCase() !== 'INVOICE'
            ) {
              matchFound = true;
            }
          }

          if (matchFound) {
            filteredData.push(row);
          }
        }

        setRowData(filteredData);
      }
    }
  };



  useEffect(() => {
    const timerId = setTimeout(() => {
      filterData().then(() => {
        setAllSaleData({
          paid: 0,
          unPaid: 0
        });
      });
    }, 500); // Delay of 500 milliseconds

    return () => clearTimeout(timerId); // Cleanup timeout if dependencies change
  }, [currentPage, limit, dateRange, searchText, onChange]);

  const filterData = async() => {
    if(searchText.length > 0){
      console.log("searchText",searchText)
        getSaleDataBySearchHandler(searchText);
    }else {
        getSaleDataByDate(dateRange);
    }
  }

  
  useEffect(() => {
    if (gridApi) {
      if (saleData) {
        if (isOpenedAll) {
          gridApi.setRowData(saleData);
        } else if (isOpenedInStore) {
          toggle('STORE');
        } else if (isOpenedOnline) {
          toggle('ONLINE');
        }
      }
    }
  }, [saleData]);

  useEffect(() => {
    if (gridApi) {
      if (rowData) {
        window.setTimeout(() => {
          gridApi.setRowData(rowData);
        });
      }
    }
  }, [rowData]);


  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId')).then(r => {
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      getTransactionData().then(r => {
      });
    }

    fetchData().then(r => {
    });
  }, []);

  useEffect(() => {
    if (isLaunchEWayAfterSaleCreation === true) {
      handleOpenEWayGenerateModal('Invoice', printData);

      resetEWayLaunchFlag();
    }
  }, [isLaunchEWayAfterSaleCreation]);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setOnChange(false);
        setRowData([]);
        //check whether search is clicked or not
        if (!(searchText.length > 0)) {
          await getSaleDataByDate(dateRange);
        }
      }
    };

    loadPaginationData().then(r => {
    });
  }, [onChange]);


  const handleFilterChange = async (e) => {
    let newValue = e.target.value;


    console.log('Filter value:', newValue);
    localStorage.setItem('saleSelectedMonthFilter', newValue); // Store in local storage
    setOnChange(true);

  };

  const [isOpenedAll, setIsOpenedAll] = useState(false);
  const [isOpenedInStore, setIsOpenedInStore] = useState(true);
  const [isOpenedOnline, setIsOpenedOnline] = useState(false);

  function toggle(value) {
    if (value === 'ALL') {
      setIsOpenedAll(true);
      setIsOpenedInStore(false);
      setIsOpenedOnline(false);

      getsalesListBySaleType('ALL').then(r => {
      });
    }
    if (value === 'STORE') {
      setIsOpenedAll(false);
      setIsOpenedInStore(true);
      setIsOpenedOnline(false);

      getsalesListBySaleType('STORE').then(r => {
      });
    }
    if (value === 'ONLINE') {
      setIsOpenedAll(false);
      setIsOpenedInStore(false);
      setIsOpenedOnline(true);

      getsalesListBySaleType('ONLINE').then(r => {
      });
    }
  }

  const closeDialog = () => {
    handleClosePrintSelectionAlertMessage().then(r => {
    });
  };

  const closeSaleReturnPrintDialog = () => {
    handleCloseSaleReturnPrintSelectionAlertMessage().then(r => {
    });
  };

  const cancelSaleItem = async () => {
    let returnObj = await isSaleLockedForCancel(cancelItem);
    if (returnObj.isLocked === true) {
      handleCancelClose();
      setErrorMessage(returnObj.saleLockMessage);
      setErrorAlertMessage(true);
    } else {
      await cancelSale(cancelItem, cancelRemark);
      handleCancelClose(false);

      if (cancelItemIsEInvoice === true) {
        await handleCancelEInvoice();
      }
    }
  };

  const handleCancelEInvoice = async () => {
    setLoadingAlertText(
      'Please wait while the E-Invoice is being cancelled!!!'
    );
    setOpenLoadingAlert(true);

    const response = await einvoice.cancelEinvoice(cancelItem);

    if (response.success) {
      setErrorMessage('E-Invoice is cancelled successfully!!');
    } else {
      setErrorMessage(response.errorMessage);
    }

    handleOpenLoadingAlertClose();
    setErrorAlertMessage(true);
  };


  return (
    <div>
      <Page className={classes.root} title={getSaleName()}>
        {/* <PageHeader /> */}

        {/* ------------------------------------------- HEADER -------------------------------------------- */}

        <Paper className={headerClasses.paperRoot}>
          <Grid container>
            <Grid item xs={12} sm={12} className={headerClasses.card}>
              <div
                style={{
                  marginRight: '10px',
                  marginTop: '20px',
                  cursor: 'pointer'
                }}
              >
                <DateRangePicker
                  value={dateRange}
                  onChange={(dateRange) => {
                    if (
                      moment(dateRange.fromDate).isValid() &&
                      moment(dateRange.toDate).isValid()
                    ) {
                      setDateRange(dateRange);
                    } else {
                      setDateRange({
                        fromDate: new Date(),
                        toDate: new Date()
                      });
                    }
                    setOnChange(true);
                    setCurrentPage(1);
                    setTotalPages(1);
                    setSearchText('');
                  }}
                />
              </div>
              <div>
                <Typography className={headerClasses.texthead}>Paid</Typography>
                <Card
                  className={headerClasses.root}
                  style={{ border: '1px solid #33ff00', borderRadius: 8 }}
                >
                  <Typography className={headerClasses.text}>{`₹${parseFloat(
                    allSaleData.paid || 0
                  ).toFixed(2)}`}</Typography>
                </Card>
              </div>

              <Typography variant="h6" className={headerClasses.plus}>
                +
              </Typography>
              <div>
                <Typography className={headerClasses.texthead}>
                  Unpaid
                </Typography>
                <Card
                  className={headerClasses.root}
                  style={{ border: '1px solid #f7941d', borderRadius: 8 }}
                >
                  <Typography className={headerClasses.text}>{`₹${parseFloat(
                    allSaleData.unPaid || 0
                  ).toFixed(2)}`}</Typography>
                </Card>
              </div>

              <Typography variant="h6" className={headerClasses.plus}>
                =
              </Typography>

              <div>
                <Typography className={headerClasses.texthead}>
                  Total
                </Typography>
                <Card
                  className={headerClasses.root}
                  style={{ border: '1px solid #4a83fb', borderRadius: 8 }}
                >
                  <Typography className={headerClasses.text}>{`₹${parseFloat(
                    Number(allSaleData.paid || 0) +
                    Number(allSaleData.unPaid || 0)
                  ).toFixed(2)}`}</Typography>
                </Card>
              </div>
            </Grid>
          </Grid>
        </Paper>

        {/* -------------------------------------------- BODY ------------------------------------------------- */}

        <Paper className={classes.paperRoot}>
          <Grid
            container
            direction="row"
            spacing={2}
            alignItems="center"
            className={classes.sectionHeader}
          >
            <Grid item xs={12} sm={2}>
              <Typography variant="h4">Transaction </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                size="small"
                style={
                  isOpenedAll ? { background: '#4A83FB', color: 'white' } : {}
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
                style={
                  isOpenedInStore
                    ? { background: '#4A83FB', color: 'white' }
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
                    ? { background: '#4A83FB', color: 'white' }
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
            <Grid item xs={12} sm={2}>
              <Grid item xs={11} style={{ display: 'flex', justifyContent: 'center' }}>
                <FilterDropdown value={selectedMonthFilter}
                                onChange={handleFilterChange} />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={5} align="right">
              <Grid container direction="row" spacing={2} alignItems="center">
                <Grid item xs={8} align="right">
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
                    onChange={(e) => {
                      setSearchText(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={4} align="right">
                  <Controls.Button
                    text="Add Sale"
                    size="medium"
                    variant="contained"
                    color="primary"
                    autoFocus={true}
                    startIcon={<Add />}
                    className={classes.newButton}
                    onClick={() => openForNewSale()}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <div style={{ width: '100%', height: height - 242 + 'px' }}>
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
                suppressPaginationPanel={true}
                suppressScrollOnNewData={true}
                rowClassRules={rowClassRules}
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

        <Dialog
          fullScreen={fullScreen}
          maxWidth={'sm'}
          open={openSuccessAlertSaleMessage}
          onClose={handleSaleSuccessAlertMessageClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>{successMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleSaleSuccessAlertMessageClose}
              color="primary"
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullScreen={fullScreen}
          open={openCancelDialog}
          onClose={handleCancelClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            Are you sure you want to cancel this invoice?
          </DialogTitle>

          <DialogContent>
            <FormControl fullWidth>
              <Typography variant="subtitle1">Reason</Typography>
              <TextField
                fullWidth
                multiline
                type="text"
                variant="outlined"
                margin="dense"
                minRows="3"
                className="customTextField"
                value={cancelRemark}
                onChange={(event) => setCancelRemark(event.target.value)}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ marginLeft: '100px' }}>
                <Button variant="contained" onClick={() => cancelSaleItem()}>
                  Yes
                </Button>
              </div>
              <Button
                style={{ marginLeft: '10px' }}
                variant="contained"
                onClick={() => handleCancelClose()}
              >
                No
              </Button>
            </div>
          </DialogActions>
        </Dialog>
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
        <Dialog
          fullScreen={fullScreen}
          open={openLoadingAlert}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ textAlign: 'center' }}>
                  <p>{loadingAlertText}</p>
                </div>
                <div>
                  <br />
                  <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
        {OpenReceivePayment ? <RecievePayment /> : null}
      </Page>

      {OpenAddDeliveryChallanInvoice ? <AddDeliveryChallan /> : null}
      {openAddSalesReturn ? <AddCreditNote /> : null}
      {openEWayGenerateModal ? <EWayGenerate /> : null}
      {productDialogOpen ? <ProductModal /> : null}
      {openAddSalesInvoice ? <AddSalesInvoice /> : null}

      {openPrintSelectionAlert === true ? (
        <OpenPreview
          open={true}
          onClose={closeDialog}
          id={printData.sequenceNumber}
          invoiceData={printData}
          startPrint={false}
        />
      ) : (
        ''
      )}

      {openCustomPrintPopUp ? (
        <CustomPrintPopUp isComingFromPrint={true} />
      ) : null}

      {openEWayPrintSelectionAlert === true ? (
        <OpenPreview
          open={true}
          onClose={closeDialog}
          id={invoiceDetails.sequenceNumber}
          invoiceData={invoiceDetails}
          isEWayPrint={true}
          startPrint={false}
        />
      ) : (
        ''
      )}

      {openSaleReturnPrintSelectionAlert === true ? (
        <OpenPreview
          open={true}
          onClose={closeSaleReturnPrintDialog}
          id={printDataSalesReturn.sales_return_number}
          invoiceData={printDataSalesReturn}
          startPrint={false}
        />
      ) : (
        ''
      )}
    </div>
  );
};
export default InjectObserver(Saleslist);