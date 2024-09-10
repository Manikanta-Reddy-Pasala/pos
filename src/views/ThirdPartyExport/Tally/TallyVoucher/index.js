import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Controls from 'src/components/controls';
import * as Db from 'src/RxDb/Database/Database';
import dateFormat from 'dateformat';
import DateRangePicker from 'src/components/controls/DateRangePicker';
import Styles from 'src/views/Export/style';
import { AgGridReact } from 'ag-grid-react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Dialog,
  DialogContent,
  DialogContentText,
  withStyles,
  Button,
  InputAdornment
} from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import 'src/views/Export/style.css';
import * as moment from 'moment';
import useWindowDimensions from 'src/components/windowDimension';
import * as Bd from 'src/components/SelectedBusiness';
import * as helper from 'src/components/Helpers/TallyApiHelper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { toJS } from 'mobx';
import MoreOptionsTallyVouchers from 'src/components/MoreOptionsTallyVouchers';
import moreoption from 'src/components/Options';
import * as txnSettings from 'src/components/Helpers/TransactionSettingsHelper';
import * as sequence from 'src/components/Helpers/SequenceNumberHelper';
import left_arrow from 'src/icons/svg/left_arrow.svg';
import right_arrow from 'src/icons/svg/right_arrow.svg';
import first_page_arrow from 'src/icons/svg/first_page_arrow.svg';
import last_page_arrow from 'src/icons/svg/last_page_arrow.svg';
import Loader from 'react-js-loader';
import * as dateHelper from 'src/components/Helpers/DateHelper';
import { Search } from '@material-ui/icons';
import * as timestamp from 'src/components/Helpers/TimeStampGeneratorHelper';
import { getPartyDataById } from 'src/components/Helpers/dbQueries/parties';
import {
  getTallySequenceNumbers
} from 'src/components/Helpers/dbQueries/tallysequencenumbers';

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const TallyVoucher = () => {
  const { height } = useWindowDimensions();
  const classes = Styles.useStyles();

  const [dateRange, setDateRange] = useState({
    fromDate: new Date(),
    toDate: new Date()
  });

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const store = useStore();
  const { getInvoiceSettings } = store.PrinterSettingsStore;
  let [onChange, setOnChange] = useState(true);

  const [rowData, setRowData] = useState(null);

  const [salesChecked, setSalesChecked] = useState(true);
  const [salesReturnChecked, setSalesReturnChecked] = useState(true);
  const [purchaseChecked, setPurchaseChecked] = useState(true);
  const [purchaseReturnChecked, setPurchaseReturnChecked] = useState(true);
  const [expenseChecked, setExpenseChecked] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  let [saleTransactions, setSaleTransactions] = useState([]);
  let [salesReturnTransactions, setSalesReturnTransactions] = useState([]);
  let [purchaseTransactions, setPurchaseTransactions] = useState([]);
  let [purchaseReturnTransactions, setPurchaseReturnTransactions] = useState(
    []
  );
  let [expenseTransactions, setExpenseTransactions] = useState([]);
  const [searchText, setSearchText] = useState('');

  const { tallymastersettingsData } = toJS(store.TallyMasterSettingsStore);
  const {
    getTallyLedgerName,
    getExportToTallyData,
    setAllTrnasactionsDataForPagination,
    getAllTrnasactionsDataForPagination,
    getTallyGroupName
  } = store.TallyMasterSettingsStore;

  const { getBankTallyLedgerName, getBankExportToTallyData } =
    store.TallyBankSettingsStore;

  let [tallyTransactionsData] = useState([]);
  let [allTrnasactionsData, setAllTrnasactionsData] = useState([]);
  let [partyLedgersToPush, setPartyLedgersToPush] = useState([]);
  let [expenseCategoriesLedgersToPush, setExpenseCategoriesLedgersToPush] =
    useState([]);
  let [tallyPartiesTransactionsData, setTallyPartiesTransactionsData] =
    useState([]);
  let [partyLedgersToReset, setPartyLedgersToReset] = useState([]);
  let [expenseCategoriesLedgersToReset, setExpenseCategoriesLedgersToReset] =
    useState([]);

  const { updateBulkSaleTallySyncStatus } = store.SalesAddStore;
  const { updateBulkSaleReturnTallySyncStatus } = store.ReturnsAddStore;
  const { updateBulkPurchaseTallySyncStatus } = store.PurchasesAddStore;
  const { updateBulkPurchaseReturnTallySyncStatus } =
    store.PurchasesReturnsAddStore;
  const { updateBulkExpenseTallySyncStatus } = store.ExpensesStore;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [messsage, setMessage] = React.useState('');
  const [openMesssageDialog, setOpenErrorMesssageDialog] =
    React.useState(false);
  const [limit] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState([]);
  const [totalDataCount, setTotalDataCount] = useState(0);

  const handleMessageAlertClose = () => {
    setMessage('');
    setOpenErrorMesssageDialog(false);
  };

  const [openReleasingDialog, setOpenReleasingDialog] = React.useState(false);

  const handleReleasingAlertClose = () => {
    setOpenReleasingDialog(false);
  };

  const [openLoadingAlert, setLoadingAlert] = useState(false);
  const [loadingAlertMessage, setLoadingAlertMessage] = useState('');

  const handleLoadingAlertClose = () => {
    setLoadingAlert(false);
  };

  useEffect(() => {
    async function fetchData() {
      await getExportToTallyData();
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      await getBankExportToTallyData();
    }

    fetchData();
  }, []);

  const rowClassRules = {
    rowHighlight: function (params) {
      return params.node.rowIndex % 2 === 0;
    }
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

  function dateFormatter(params) {
    var dateAsString = params.data.date
      ? params.data.date
      : params.data.invoice_date
      ? params.data.invoice_date
      : params.data.bill_date;
    //console.log(dateAsString);
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const tallyStatusCellStyle = (params) => {
    let data = params['data'];

    if (data['tallySynced'] === false) {
      return { color: '#faab53', fontWeight: 500 };
    } else {
      return { color: '#86ca94', fontWeight: 500 };
    }
  };

  const [columnDefs] = useState([
    {
      headerName: 'DATE',
      field: 'date',
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
      filter: 'agDateColumnFilter',
      valueFormatter: dateFormatter
    },
    {
      headerName: 'REF NO.',
      field: 'sequenceNumber',
      valueFormatter: (params) => {
        let number = '';
        if (params.data.sales_return_number) {
          number = params.data.sequenceNumber;
        } else if (params.data.purchase_return_number) {
          number = params.data.purchaseReturnBillNumber;
        } else if (params.data.sequenceNumber) {
          number = params.data.sequenceNumber;
        } else if (params.data.bill_number) {
          number = params.data.vendor_bill_number;
        } else {
          number = params.data.billNumber;
        }

        return number;
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>INVOICE NO.</p>
          </div>
        );
      }
    },
    {
      headerName: 'CUSTOMER/VENDOR',
      valueFormatter: (params) => {
        return params['data']['customer_name'] || params['data']['vendor_name'];
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>CUSTOMER /</p>
            <p>VENDOR</p>
          </div>
        );
      }
    },
    {
      headerName: 'TYPE',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let type = '';
        if (params.data.sales_return_number) {
          type = 'Sales Return';
        } else if (params.data.purchase_return_number) {
          type = 'Purchases Return';
        } else if (params.data.sequenceNumber) {
          type = 'Sales';
        } else if (params.data.bill_number) {
          type = 'Purchases';
        } else {
          type = 'Expenses';
        }

        return type;
      }
    },
    {
      headerName: 'TOTAL',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['total_amount'] || params['data']['total'];
      }
    },
    {
      headerName: 'BALANCE',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return (
          params['data']['balance_amount'] || params['data']['balance'] || 0
        );
      }
    },
    {
      headerName: 'STATUS',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: tallyStatusCellStyle,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TALLY PUSH</p>
            <p>STATUS</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];
        if (data.tallySynced === true) {
          return 'PUSHED';
        } else {
          return 'PENDING';
        }
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

  const getInvoideId = (props) => {
    let invoiceId = '';
    if (props.data.sales_return_number) {
      invoiceId = props.data.sales_return_number;
    } else if (props.data.purchase_return_number) {
      invoiceId = props.data.purchase_return_number;
    } else if (props.data.sequenceNumber) {
      invoiceId = props.data.sequenceNumber;
    } else if (props.data.bill_number) {
      invoiceId = props.data.bill_number;
    } else {
      invoiceId = props.data.expenseId;
    }

    return invoiceId;
  };

  const TemplateActionRenderer = (props) => {
    return (
      <MoreOptionsTallyVouchers
        menu={moreoption.moreoptionsdata}
        index={getInvoideId(props)}
        item={props['data']}
        id={getInvoideId(props)}
        component="vouchersList"
      />
    );
  };

  useEffect(() => {
    const listener = async () => {
      setCurrentPage(1);
      setTotalPages(1);
      setTotalRecords([]);
      setDataLoaded(false);
      setAllTrnasactionsDataForPagination(0);
      setOnChange(true);
    };
    window.addEventListener('onTallyStatusChangedEvent', listener);

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener('onTallyStatusChangedEvent', listener);
    };
  }, []);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setOnChange(false);
        await getAllTxnData();
      }
    };

    loadPaginationData();
  }, [onChange]);

  const onFirstPageClicked = () => {
    if (gridApi) {
      setCurrentPage(1);
      setDataLoaded(true);
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

  useEffect(() => {
    if (gridApi) {
      if (rowData) {
        gridApi.setRowData(rowData);
      }
    }
  }, [rowData]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 100);
    window.addEventListener('resize', function () {
      setTimeout(function () {
        params.api.sizeColumnsToFit();
      });
    });
  };

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('mobileNumber'));
  }, []);

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      setSearchText(target);
      if (target) {
        setCurrentPage(1);
        setTotalPages(1);
        await setTotalRecords([]);
        setDataLoaded(false);
        setAllTrnasactionsDataForPagination(0);
        setTimeout(() => {
          getAllTxnData(target);
        }, 500);
      } else {
        setCurrentPage(1);
        setTotalPages(1);
        setTotalRecords([]);
        setDataLoaded(false);
        setAllTrnasactionsDataForPagination(0);
        setOnChange(true);
      }
    } else {
      setCurrentPage(1);
      setTotalPages(1);
      setTotalRecords([]);
      setDataLoaded(false);
      setAllTrnasactionsDataForPagination(0);
      setOnChange(true);
    }
  };

  function dateXMLFormatter(data) {
    var dateParts = data.split('-');
    return `${dateParts[0]}${dateParts[1]}${dateParts[2]}`;
    //return '20231101';
  }

  function dateGSTXMLFormatter(data) {
    var dateAsString = data;
    var dateParts = dateAsString.split('-');
    return `${dateParts[0]}${dateParts[1]}${dateParts[2]}`;
    //return '20231101';
  }

  function isRegistered(gstType) {
    let isRegistered = false;

    if (
      gstType === 'Registered Customer' ||
      gstType === 'Composition Reg Customer' ||
      gstType === 'Registered Vendor' ||
      gstType === 'Composition Reg Vendor'
    ) {
      isRegistered = true;
    }

    return isRegistered;
  }

  const getPartyName = async (item, type) => {
    let customerName = '';
    let partyData = await getPartyDataById(
      type === 'Customer' ? item.customer_id : item.vendor_id,
      ['tallyMappingName']
    );
    if (
      partyData &&
      partyData.tallyMappingName &&
      partyData.tallyMappingName !== '' &&
      partyData.tallyMappingName !== null
    )
      customerName = partyData.tallyMappingName;
    else
      customerName =
        type === 'Customer'
          ? item.customer_name + '-' + item.customerGSTNo
          : item.vendor_name + '-' + item.vendor_gst_number;

    return customerName;
  };

  const getSalesData = async (db, skip, searchText) => {
    return new Promise(async (resolve) => {
      if (salesChecked) {
        var query;
        let result = [];
        const businessData = await Bd.getBusinessData();

        if (
          searchText &&
          searchText !== null &&
          searchText !== undefined &&
          searchText !== ''
        ) {
          var regexp = new RegExp('^.*' + searchText + '.*$', 'i');
          query = db.sales.find({
            selector: {
              $or: [
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { sequenceNumber: { $regex: regexp } },
                    {
                      invoice_date: {
                        $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                      }
                    },
                    {
                      invoice_date: {
                        $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { customer_name: { $regex: regexp } },
                    {
                      invoice_date: {
                        $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                      }
                    },
                    {
                      invoice_date: {
                        $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                      }
                    }
                  ]
                }
              ]
            },
            skip: skip,
            limit: limit
          });
        } else {
          query = db.sales.find({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  invoice_date: {
                    $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                  }
                },
                {
                  invoice_date: {
                    $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                  }
                }
              ]
            },
            skip: skip,
            limit: limit
          });
        }

        await query.exec().then((data) => {
          if (!data) {
            resolve(`Resolved sales`);
            return;
          }

          result = data.map((item) => {
            let temp = item;

            return temp;
          });

          if (result.length > 0) {
            allTrnasactionsData.push(...result);
          }
          resolve(`Resolved sales`);
        });
      } else {
        resolve(`Resolved sales`);
      }
    });
  };

  const getAllSalesData = async (db, searchText) => {
    return new Promise(async (resolve) => {
      if (salesChecked) {
        var query;
        const businessData = await Bd.getBusinessData();
        setSaleTransactions([]);
        if (
          searchText &&
          searchText !== null &&
          searchText !== undefined &&
          searchText !== ''
        ) {
          var regexp = new RegExp('^.*' + searchText + '.*$', 'i');
          query = db.sales.find({
            selector: {
              $or: [
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { sequenceNumber: { $regex: regexp } },
                    {
                      invoice_date: {
                        $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                      }
                    },
                    {
                      invoice_date: {
                        $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { customer_name: { $regex: regexp } },
                    {
                      invoice_date: {
                        $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                      }
                    },
                    {
                      invoice_date: {
                        $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                      }
                    }
                  ]
                }
              ]
            }
          });
        } else {
          query = db.sales.find({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  invoice_date: {
                    $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                  }
                },
                {
                  invoice_date: {
                    $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                  }
                }
              ]
            }
          });
        }

        await query.exec().then(async (data) => {
          if (!data) {
            resolve(`Resolved sales`);
            return;
          }

          let count = data.length;
          let result = [];
          result = data.map((item) => {
            let temp = item;

            return temp;
          });

          for (let data of result) {
            if (
              data.customerGSTNo !== '' &&
              data.customerGSTNo !== null &&
              isRegistered(data.customerGstType)
            ) {
              // B2B is always by Party Ledger which is created under B2B Customer Sales Group
              if (data.customer_name !== '' && data.customer_name !== null) {
                if (!partyLedgersToReset.includes(data.customer_id)) {
                  partyLedgersToReset.push(data.customer_id);
                }
              }
            }
          }
          setSaleTransactions(data.map((item) => item.toJSON()));
          let total =
            parseFloat(getAllTrnasactionsDataForPagination()) +
            parseFloat(count);
          setAllTrnasactionsDataForPagination(parseFloat(total));

          resolve(`Resolved sales`);
        });
      } else {
        resolve(`Resolved sales`);
      }
    });
  };

  const getSalesXMLData = async (db) => {
    return new Promise(async (resolve) => {
      if (salesChecked) {
        var query;
        const businessData = await Bd.getBusinessData();
        let results = [];

        query = db.sales.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                invoice_date: {
                  $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                }
              },
              {
                invoice_date: {
                  $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                }
              },
              {
                updatedAt: { $exists: true }
              }
            ]
          }
        });

        await query.exec().then(async (data) => {
          if (!data) {
            resolve(`Resolved sales`);
            return;
          }

          results = data.map((item) => item.toJSON());
          for (let item of results) {
            if (
              item.is_credit === true &&
              item.linked_amount !== 0 &&
              item.linked_amount < item.total_amount
            ) {
              continue;
            }
            let ledgerList = [];
            let cgst_amount = 0;
            let sgst_amount = 0;
            let igst_amount = 0;
            let total_amount_before_tax = 0;
            let packageCharge = 0;
            let shippingCharge = 0;
            let roundOff = 0;
            let discount = 0;
            let finalSubtotal = 0;

            let b2bTaxMap = new Map();
            let b2cTaxMap = new Map();

            for (let product of item.item_list) {
              cgst_amount = cgst_amount + (product.cgst_amount || 0);
              sgst_amount = sgst_amount + (product.sgst_amount || 0);
              igst_amount = igst_amount + (product.igst_amount || 0);
              discount = discount + (product.discount_amount || 0);

              let tax =
                (parseFloat(product.cgst) || 0) +
                (parseFloat(product.sgst) || 0);
              let igst_tax = parseFloat(product.igst || 0);

              const taxIncluded = product.taxIncluded;
              let itemPrice = 0;
              if (
                product.offerPrice &&
                product.offerPrice > 0 &&
                product.mrp > product.offerPrice
              ) {
                itemPrice = product.offerPrice;
              } else {
                itemPrice = product.mrp;
              }

              let netWeight = parseFloat(product.netWeight || 0);
              if (parseFloat(product.wastageGrams || 0) > 0 && netWeight > 0) {
                netWeight = netWeight + parseFloat(product.wastageGrams || 0);
              }

              if (product.pricePerGram > 0 && netWeight > 0) {
                itemPrice =
                  parseFloat(product.pricePerGram || 0) *
                  parseFloat(netWeight || 0);
              }

              //calculate wastage percentage
              let wastageAmount = 0;
              if (
                product.pricePerGram > 0 &&
                netWeight > 0 &&
                parseFloat(product.wastagePercentage || 0) > 0
              ) {
                wastageAmount = parseFloat(
                  (itemPrice * parseFloat(product.wastagePercentage || 0)) /
                    100 || 0
                ).toFixed(2);
              }

              let discountAmount = 0;

              //add making charges amount if any to mrp_before_tax
              if (product.makingChargeType === 'percentage') {
                let percentage = product.makingChargePercent || 0;

                // making charge
                product.makingChargeAmount = parseFloat(
                  (itemPrice * percentage) / 100 || 0
                ).toFixed(2);
              } else if (product.makingChargeType === 'amount') {
                product.makingChargePercent =
                  Math.round(
                    ((product.makingChargeAmount / itemPrice) * 100 || 0) * 100
                  ) / 100;
              }

              if (netWeight > 0) {
                if (!product.makingChargeIncluded) {
                  itemPrice =
                    itemPrice +
                    parseFloat(product.makingChargePerGramAmount || 0) *
                      parseFloat(product.netWeight);
                }
              }

              if (!product.makingChargeIncluded) {
                itemPrice =
                  itemPrice + parseFloat(product.makingChargeAmount || 0);
              }

              if (product.stoneCharge > 0) {
                itemPrice = itemPrice + parseFloat(product.stoneCharge || 0);
              }

              if (wastageAmount > 0) {
                itemPrice = itemPrice + parseFloat(wastageAmount || 0);
              }

              let totalGST = 0;
              let totalIGST = 0;
              let mrp_before_tax = 0;

              if (taxIncluded) {
                totalGST = itemPrice - itemPrice * (100 / (100 + tax));
                totalIGST = itemPrice - itemPrice * (100 / (100 + igst_tax));
              }

              mrp_before_tax =
                itemPrice - parseFloat(totalGST) - parseFloat(totalIGST);
              let discountAmountPerProduct = 0;

              const discountType = product.discount_type;
              if (discountType === 'percentage') {
                let percentage = product.discount_percent || 0;

                discountAmount = parseFloat(
                  (mrp_before_tax * percentage) / 100 || 0
                ).toFixed(2);
              } else if (discountType === 'amount') {
                // do nothing
              }

              discountAmountPerProduct =
                parseFloat(discountAmount) / parseFloat(product.qty);

              // let itemPriceAfterDiscount =
              //   mrp_before_tax - discountAmountPerProduct;

              let finalAmount = mrp_before_tax * product.qty;

              if (
                product.cgst_amount === 0 &&
                product.sgst_amount === 0 &&
                product.igst_amount === 0
              ) {
                if (
                  item.customerGSTNo !== '' &&
                  item.customerGSTNo !== null &&
                  isRegistered(item.customerGstType)
                ) {
                  // Credit the amount
                  let pc = {
                    'ALLLEDGERENTRIES.LIST': {
                      LEDGERNAME: getTallyLedgerName(
                        'B2B Sales Exempted',
                        'salesMastersMapping'
                      ),
                      ISDEEMEDPOSITIVE: 'No',
                      AMOUNT:
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    }
                  };
                  ledgerList.push(pc);
                } else {
                  // Credit the amount
                  let pc = {
                    'ALLLEDGERENTRIES.LIST': {
                      LEDGERNAME: getTallyLedgerName(
                        'B2C Sales Exempted',
                        'salesMastersMapping'
                      ),
                      ISDEEMEDPOSITIVE: 'No',
                      AMOUNT:
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    }
                  };
                  ledgerList.push(pc);
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 3 ||
                parseFloat(product.igst) === 3
              ) {
                if (
                  item.customerGSTNo !== '' &&
                  item.customerGSTNo !== null &&
                  isRegistered(item.customerGstType)
                ) {
                  if (b2bTaxMap.has('B2B Sales 3%')) {
                    b2bTaxMap.set(
                      'B2B Sales 3%',
                      b2bTaxMap.get('B2B Sales 3%') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2bTaxMap.set(
                      'B2B Sales 3%',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                } else {
                  if (b2cTaxMap.has('B2C Sales 3%')) {
                    b2cTaxMap.set(
                      'B2C Sales 3%',
                      b2cTaxMap.get('B2C Sales 3%') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2cTaxMap.set(
                      'B2C Sales 3%',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 5 ||
                parseFloat(product.igst) === 5
              ) {
                if (
                  item.customerGSTNo !== '' &&
                  item.customerGSTNo !== null &&
                  isRegistered(item.customerGstType)
                ) {
                  if (b2bTaxMap.has('B2B Sales 5%')) {
                    b2bTaxMap.set(
                      'B2B Sales 5%',
                      b2bTaxMap.get('B2B Sales 5%') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2bTaxMap.set(
                      'B2B Sales 5%',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                } else {
                  if (b2cTaxMap.has('B2C Sales 5%')) {
                    b2cTaxMap.set(
                      'B2C Sales 5%',
                      b2cTaxMap.get('B2C Sales 5%') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2cTaxMap.set(
                      'B2C Sales 5%',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 12 ||
                parseFloat(product.igst) === 12
              ) {
                if (
                  item.customerGSTNo !== '' &&
                  item.customerGSTNo !== null &&
                  isRegistered(item.customerGstType)
                ) {
                  if (b2bTaxMap.has('B2B Sales 12%')) {
                    b2bTaxMap.set(
                      'B2B Sales 12%',
                      b2bTaxMap.get('B2B Sales 12%') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2bTaxMap.set(
                      'B2B Sales 12%',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                } else {
                  if (b2cTaxMap.has('B2C Sales 12%')) {
                    b2cTaxMap.set(
                      'B2C Sales 12%',
                      b2cTaxMap.get('B2C Sales 12%') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2cTaxMap.set(
                      'B2C Sales 12%',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 18 ||
                parseFloat(product.igst) === 18
              ) {
                if (
                  item.customerGSTNo !== '' &&
                  item.customerGSTNo !== null &&
                  isRegistered(item.customerGstType)
                ) {
                  if (b2bTaxMap.has('B2B Sales 18%')) {
                    b2bTaxMap.set(
                      'B2B Sales 18%',
                      b2bTaxMap.get('B2B Sales 18%') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2bTaxMap.set(
                      'B2B Sales 18%',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                } else {
                  if (b2cTaxMap.has('B2C Sales 18%')) {
                    b2cTaxMap.set(
                      'B2C Sales 18%',
                      b2cTaxMap.get('B2C Sales 18%') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2cTaxMap.set(
                      'B2C Sales 18%',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 28 ||
                parseFloat(product.igst) === 28
              ) {
                if (
                  item.customerGSTNo !== '' &&
                  item.customerGSTNo !== null &&
                  isRegistered(item.customerGstType)
                ) {
                  if (b2bTaxMap.has('B2B Sales 28%')) {
                    b2bTaxMap.set(
                      'B2B Sales 28%',
                      b2bTaxMap.get('B2B Sales 28%') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2bTaxMap.set(
                      'B2B Sales 28%',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                } else {
                  if (b2cTaxMap.has('B2C Sales 28%')) {
                    b2cTaxMap.set(
                      'B2C Sales 28%',
                      b2cTaxMap.get('B2C Sales 28%') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2cTaxMap.set(
                      'B2C Sales 28%',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                }
              }
            }

            // if (item.discount_amount > 0) {
            //   discount = discount + item.discount_amount;
            // }

            if (item.packing_charge > 0) {
              packageCharge = item.packing_charge;
            }

            if (item.shipping_charge > 0) {
              shippingCharge = item.shipping_charge;
            }

            if (item.round_amount > 0) {
              roundOff = item.round_amount;
            }

            total_amount_before_tax =
              parseFloat(item.total_amount) -
              parseFloat(cgst_amount) -
              parseFloat(sgst_amount) -
              parseFloat(igst_amount);

            finalSubtotal =
              parseFloat(item.total_amount) -
              parseFloat(cgst_amount) -
              parseFloat(sgst_amount) -
              parseFloat(igst_amount) -
              parseFloat(packageCharge) -
              parseFloat(shippingCharge) -
              parseFloat(roundOff);

            if (
              item.customerGSTNo !== '' &&
              item.customerGSTNo !== null &&
              isRegistered(item.customerGstType)
            ) {
              // B2B is always by Party Ledger which is created under B2B Customer Sales Group
              if (item.customer_name !== '' && item.customer_name !== null) {
                let pc = {
                  'ALLLEDGERENTRIES.LIST': {
                    LEDGERNAME: await getPartyName(item, 'Customer'),
                    PARENT: getTallyLedgerName(
                      'B2B Customer Sales',
                      'salesMastersMapping'
                    ),
                    ISPARTYLEDGER: 'Yes',
                    ISDEEMEDPOSITIVE: 'Yes',
                    AMOUNT: -Math.abs(
                      Math.round((item.total_amount + Number.EPSILON) * 100) /
                        100
                    )
                  }
                };
                ledgerList.push(pc);

                if (!partyLedgersToPush.includes(item.customer_id)) {
                  partyLedgersToPush.push(item.customer_id);
                }
              }
            } else if (
              item.customer_name !== '' &&
              item.customer_name !== null &&
              item.customer_id !== '' &&
              tallymastersettingsData.b2c === true
            ) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: await getPartyName(item, 'Customer'),
                  PARENT: getTallyLedgerName(
                    'B2C Customer Sales',
                    'salesMastersMapping'
                  ),
                  ISPARTYLEDGER: 'Yes',
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((item.total_amount + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);

              if (!partyLedgersToPush.includes(item.customer_id)) {
                partyLedgersToPush.push(item.customer_id);
              }
            } else {
              if (
                (item.payment_type === 'Credit' && item.linked_amount === 0) ||
                item.payment_type === 'Split'
              ) {
                let ledgerName = '';
                if (
                  (item.customerGSTNo === '' || item.customerGSTNo === null) &&
                  !isRegistered(item.customerGstType)
                ) {
                  ledgerName = 'B2C Customer Sales';
                  // Credit the amount
                  let pc = {
                    'ALLLEDGERENTRIES.LIST': {
                      LEDGERNAME: getTallyLedgerName(
                        ledgerName,
                        'salesMastersMapping'
                      ),
                      ISDEEMEDPOSITIVE: 'Yes',
                      AMOUNT: -Math.abs(
                        Math.round((item.total_amount + Number.EPSILON) * 100) /
                          100
                      )
                    }
                  };
                  ledgerList.push(pc);
                }
              }

              //payments preparation
              if (
                item.payment_type !== 'Split' &&
                item.payment_type !== 'Credit'
              ) {
                let paymentsMap = new Map();
                await getPaymentSplitLedgersList(item, 'Sales', paymentsMap);
                if (paymentsMap) {
                  for (const [key, value] of paymentsMap.entries()) {
                    if (value !== 0) {
                      let oneshellLedgerName = '';
                      switch (key) {
                        case 'CASH':
                          oneshellLedgerName = 'Cash';
                          break;
                        case 'UPI':
                          oneshellLedgerName = 'UPI Sales';
                          break;
                        case 'NEFT/RTGS':
                          oneshellLedgerName = 'Internet Banking Sales';
                          break;
                        case 'CHEQUE':
                          oneshellLedgerName = 'Cheque Sales';
                          break;
                        case 'CREDIT CARD':
                          oneshellLedgerName = 'Credit Card Sales';
                          break;
                        case 'DEBIT CARD':
                          oneshellLedgerName = 'Debit Card Sales';
                          break;
                        case 'GIFT CARD':
                          oneshellLedgerName = 'Gift Card';
                          break;
                        case 'CUSTOM FINANCE':
                          oneshellLedgerName = '3rd Party Finance';
                          break;
                        default:
                          break;
                      }

                      // Debit the amount
                      let pc = {
                        'ALLLEDGERENTRIES.LIST': {
                          LEDGERNAME: getTallyLedgerName(
                            oneshellLedgerName,
                            'salesMastersMapping'
                          ),
                          ISDEEMEDPOSITIVE: 'Yes',
                          AMOUNT: -Math.abs(
                            Math.round((value + Number.EPSILON) * 100) / 100
                          ),
                          'LEDGSTREGDETAILS.LIST': {
                            APPLICABLEFROM: dateGSTXMLFormatter(
                              dateHelper.getFinancialYearStartDate()
                            ),
                            GSTREGISTRATIONTYPE: getRegistrationType(
                              item.gstType
                            ),
                            PLACEOFSUPPLY: item.placeOfSupplyName,
                            GSTIN: item.customerGSTNo
                          },
                          'LEDMAILINGDETAILS.LIST': {
                            APPLICABLEFROM: dateGSTXMLFormatter(
                              dateHelper.getFinancialYearStartDate()
                            ),
                            MAILINGNAME: getTallyLedgerName(
                              oneshellLedgerName,
                              'salesMastersMapping'
                            ),
                            STATE: item.customerState,
                            COUNTRY: item.customerCountry
                          }
                        }
                      };
                      ledgerList.push(pc);
                    }
                  }
                }
              }
            }

            if (b2bTaxMap) {
              for (let [key, value] of b2bTaxMap) {
                if (value !== 0) {
                  // Credit the amount
                  let pc = {
                    'ALLLEDGERENTRIES.LIST': {
                      LEDGERNAME: getTallyLedgerName(
                        key,
                        'salesMastersMapping'
                      ),
                      ISDEEMEDPOSITIVE: 'No',
                      AMOUNT: Math.round((value + Number.EPSILON) * 100) / 100
                    }
                  };
                  ledgerList.push(pc);
                }
              }
            }

            if (b2cTaxMap) {
              for (let [key, value] of b2cTaxMap) {
                if (value !== 0) {
                  // Debit the amount
                  let pc = {
                    'ALLLEDGERENTRIES.LIST': {
                      LEDGERNAME: getTallyLedgerName(
                        key,
                        'salesMastersMapping'
                      ),
                      ISDEEMEDPOSITIVE: 'No',
                      AMOUNT: Math.round((value + Number.EPSILON) * 100) / 100
                    }
                  };
                  ledgerList.push(pc);
                }
              }
            }

            // Prepare CGST Ledger
            if (cgst_amount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Output CGST',
                    'taxesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'No',
                  AMOUNT: Math.round((cgst_amount + Number.EPSILON) * 100) / 100
                }
              };
              ledgerList.push(pc);
            }

            // Prepare SGST Ledger
            if (sgst_amount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Output SGST',
                    'taxesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'No',
                  AMOUNT: Math.round((sgst_amount + Number.EPSILON) * 100) / 100
                }
              };
              ledgerList.push(pc);
            }

            // Prepare IGST Ledger
            if (igst_amount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Output IGST',
                    'taxesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'No',
                  AMOUNT: Math.round((igst_amount + Number.EPSILON) * 100) / 100
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Packing Charge Ledger
            if (packageCharge > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Sales Package Charge',
                    'packingChargesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'No',
                  AMOUNT:
                    Math.round((packageCharge + Number.EPSILON) * 100) / 100
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Shipping Charge Ledger
            if (shippingCharge > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Sales Shipping Charge',
                    'shippingChargesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'No',
                  AMOUNT:
                    Math.round((shippingCharge + Number.EPSILON) * 100) / 100
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Discount Charge Ledger
            if (discount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Sales Discount',
                    'discountMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((discount + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Round Off Ledger
            if (roundOff > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Sales Round Off',
                    'roundOffMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'No',
                  AMOUNT: Math.round((roundOff + Number.EPSILON) * 100) / 100
                }
              };
              ledgerList.push(pc);
            }

            // Add to Round Off Ledger
            let amount = 0;
            for (let ledger of ledgerList) {
              amount += parseFloat(ledger['ALLLEDGERENTRIES.LIST'].AMOUNT);
            }

            if (amount !== 0) {
              let value =
                amount > 0
                  ? -Math.abs(Math.round((amount + Number.EPSILON) * 100) / 100)
                  : Math.abs(Math.round((amount + Number.EPSILON) * 100) / 100);
              if (value !== 0) {
                let pc = {
                  'ALLLEDGERENTRIES.LIST': {
                    LEDGERNAME: getTallyLedgerName(
                      'Sales Round Off',
                      'roundOffMastersMapping'
                    ),
                    ISDEEMEDPOSITIVE: amount > 0 ? 'Yes' : 'No',
                    AMOUNT: value
                  }
                };
                ledgerList.push(pc);
              }
            }

            let voucher = {
              TALLYMESSAGE: {
                '@xmlns:UDF': 'TallyUDF',
                VOUCHER: {
                  //'@ACTION': 'Create',
                  //'@VCHTYPE': 'Sales',
                  // '@OBJVIEW': 'Invoice Voucher View',
                  DATE: dateXMLFormatter(item.invoice_date),
                  VOUCHERTYPENAME: 'Sales',
                  VOUCHERNUMBER: item.sequenceNumber,
                  //OBJVIEW: 'Invoice Voucher View',
                  '#text': [ledgerList]
                }
              }
            };

            tallyTransactionsData.push(voucher);

            if (
              item.payment_type === 'Split' ||
              (item.customerGSTNo !== '' &&
                item.customerGSTNo !== null &&
                isRegistered(item.customerGstType)) ||
              (item.customer_name !== '' &&
                item.customer_name !== null &&
                item.customer_id !== '' &&
                tallymastersettingsData.b2c === true)
            ) {
              if (
                item.payment_type === 'Credit' &&
                (item.linked_amount === 0 ||
                  item.linked_amount !== item.total_amount)
              ) {
                // Partials do nothing in phase one
              } else {
                let receiptLedgerList = [];
                if (
                  item.customerGSTNo !== '' &&
                  item.customerGSTNo !== null &&
                  isRegistered(item.customerGstType)
                ) {
                  // Credit the amount
                  if (
                    item.customer_name !== '' &&
                    item.customer_name !== null
                  ) {
                    let pc = {
                      'ALLLEDGERENTRIES.LIST': {
                        LEDGERNAME: await getPartyName(item, 'Customer'),
                        PARENT: getTallyLedgerName(
                          'B2B Customer Sales',
                          'salesMastersMapping'
                        ),
                        ISPARTYLEDGER: 'Yes',
                        ISDEEMEDPOSITIVE: 'No',
                        AMOUNT:
                          Math.round(
                            (item.total_amount + Number.EPSILON) * 100
                          ) / 100
                      }
                    };
                    receiptLedgerList.push(pc);
                  }
                } else if (
                  item.customer_name !== '' &&
                  item.customer_name !== null &&
                  item.customer_id !== ''
                ) {
                  let pc = {
                    'ALLLEDGERENTRIES.LIST': {
                      LEDGERNAME: await getPartyName(item, 'Customer'),
                      PARENT: getTallyLedgerName(
                        'B2C Customer Sales',
                        'salesMastersMapping'
                      ),
                      ISPARTYLEDGER: 'Yes',
                      ISDEEMEDPOSITIVE: 'No',
                      AMOUNT:
                        Math.round((item.total_amount + Number.EPSILON) * 100) /
                        100
                    }
                  };
                  receiptLedgerList.push(pc);
                } else {
                  let ledgerName = 'B2C Customer Sales';
                  // Credit the amount
                  let pc = {
                    'ALLLEDGERENTRIES.LIST': {
                      LEDGERNAME: getTallyLedgerName(
                        ledgerName,
                        'salesMastersMapping'
                      ),
                      ISDEEMEDPOSITIVE: 'No',
                      AMOUNT:
                        Math.round((item.total_amount + Number.EPSILON) * 100) /
                        100
                    }
                  };
                  receiptLedgerList.push(pc);
                }

                let paymentsMap = new Map();
                await getPaymentSplitLedgersList(item, 'Sales', paymentsMap);
                if (paymentsMap) {
                  for (const [key, value] of paymentsMap.entries()) {
                    if (value !== 0) {
                      let oneshellLedgerName = '';
                      let tallyLedgerName = 'salesMastersMapping';
                      switch (key) {
                        case 'CASH':
                          oneshellLedgerName = 'Cash';
                          break;
                        case 'UPI':
                          oneshellLedgerName = 'UPI Sales';
                          break;
                        case 'NEFT/RTGS':
                          oneshellLedgerName = 'Internet Banking Sales';
                          break;
                        case 'CHEQUE':
                          oneshellLedgerName = 'Cheque Sales';
                          break;
                        case 'CREDIT CARD':
                          oneshellLedgerName = 'Credit Card Sales';
                          break;
                        case 'DEBIT CARD':
                          oneshellLedgerName = 'Debit Card Sales';
                          break;
                        case 'GIFT CARD':
                          oneshellLedgerName = 'Gift Card';
                          break;
                        case 'CUSTOM FINANCE':
                          oneshellLedgerName = '3rd Party Finance';
                          break;
                        case 'RETURNED SALE':
                          oneshellLedgerName = 'B2C Customer Sales Return';
                          tallyLedgerName = 'creditNoteMastersMapping';
                          break;
                        default:
                          break;
                      }

                      // Debit the amount
                      let pc = {
                        'ALLLEDGERENTRIES.LIST': {
                          LEDGERNAME: getTallyLedgerName(
                            oneshellLedgerName,
                            tallyLedgerName
                          ),
                          ISDEEMEDPOSITIVE: 'Yes',
                          AMOUNT: -Math.abs(
                            Math.round((value + Number.EPSILON) * 100) / 100
                          ),
                          'LEDGSTREGDETAILS.LIST': {
                            APPLICABLEFROM: dateGSTXMLFormatter(
                              dateHelper.getFinancialYearStartDate()
                            ),
                            GSTREGISTRATIONTYPE: getRegistrationType(
                              item.gstType
                            ),
                            PLACEOFSUPPLY: item.placeOfSupplyName,
                            GSTIN: item.customerGSTNo
                          },
                          'LEDMAILINGDETAILS.LIST': {
                            APPLICABLEFROM: dateGSTXMLFormatter(
                              dateHelper.getFinancialYearStartDate()
                            ),
                            MAILINGNAME: getTallyLedgerName(
                              oneshellLedgerName,
                              'salesMastersMapping'
                            ),
                            STATE: item.customerState,
                            COUNTRY: item.customerCountry
                          }
                        }
                      };
                      receiptLedgerList.push(pc);
                    }
                  }
                }

                let receiptNumber = await getSequenceNumber(
                  item.invoice_date,
                  item.invoice_number,
                  'Export To TallyReceipt'
                );

                // Generate Receipt
                let voucher = {
                  TALLYMESSAGE: {
                    '@xmlns:UDF': 'TallyUDF',
                    VOUCHER: {
                      //'@ACTION': 'Create',
                      //'@VCHTYPE': 'Sales',
                      // '@OBJVIEW': 'Invoice Voucher View',
                      DATE: dateXMLFormatter(item.invoice_date),
                      VOUCHERTYPENAME: 'Receipt',
                      VOUCHERNUMBER: receiptNumber,
                      //OBJVIEW: 'Invoice Voucher View',
                      '#text': [receiptLedgerList]
                    }
                  }
                };

                tallyTransactionsData.push(voucher);
              }
            }
          }

          resolve(`Resolved sales`);
        });
      } else {
        resolve(`Resolved sales`);
      }
    });
  };

  const getSalesReturnData = async (db, skip) => {
    return new Promise(async (resolve) => {
      if (salesReturnChecked) {
        var query;
        let result = [];
        const businessData = await Bd.getBusinessData();

        if (
          searchText &&
          searchText !== null &&
          searchText !== undefined &&
          searchText !== ''
        ) {
          var regexp = new RegExp('^.*' + searchText + '.*$', 'i');
          query = db.salesreturn.find({
            selector: {
              $or: [
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { sequenceNumber: { $regex: regexp } },
                    {
                      date: {
                        $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                      }
                    },
                    {
                      date: {
                        $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { customer_name: { $regex: regexp } },
                    {
                      date: {
                        $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                      }
                    },
                    {
                      date: {
                        $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                      }
                    }
                  ]
                }
              ]
            },
            skip: skip,
            limit: limit
          });
        } else {
          query = db.salesreturn.find({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  date: { $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd') }
                },
                {
                  date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
                }
              ]
            },
            skip: skip,
            limit: limit
          });
        }

        await query.exec().then((data) => {
          if (!data) {
            resolve(`Resolved sales return`);
            return;
          }

          result = data.map((item) => {
            let temp = item;

            return temp;
          });

          if (result.length > 0) {
            allTrnasactionsData.push(...result);
          }
          resolve(`Resolved sales return`);
        });
      } else {
        resolve(`Resolved sales return`);
      }
    });
  };

  const getAllSalesReturnData = async (db) => {
    return new Promise(async (resolve) => {
      if (salesReturnChecked) {
        var query;
        setSalesReturnTransactions([]);
        const businessData = await Bd.getBusinessData();

        if (
          searchText &&
          searchText !== null &&
          searchText !== undefined &&
          searchText !== ''
        ) {
          var regexp = new RegExp('^.*' + searchText + '.*$', 'i');
          query = db.salesreturn.find({
            selector: {
              $or: [
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { sequenceNumber: { $regex: regexp } },
                    {
                      date: {
                        $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                      }
                    },
                    {
                      date: {
                        $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { customer_name: { $regex: regexp } },
                    {
                      date: {
                        $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                      }
                    },
                    {
                      date: {
                        $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                      }
                    }
                  ]
                }
              ]
            }
          });
        } else {
          query = db.salesreturn.find({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  date: { $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd') }
                },
                {
                  date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
                }
              ]
            }
          });
        }

        await query.exec().then((data) => {
          if (!data) {
            resolve(`Resolved sales return`);
            return;
          }

          let count = data.length;
          let result = [];
          result = data.map((item) => {
            let temp = item;

            return temp;
          });

          for (let data of result) {
            if (
              data.customerGSTNo !== '' &&
              data.customerGSTNo !== null &&
              isRegistered(data.customerGstType)
            ) {
              // B2B is always by Party Ledger which is created under B2B Customer Sales Group
              if (data.customer_name !== '' && data.customer_name !== null) {
                if (!partyLedgersToReset.includes(data.customer_id)) {
                  partyLedgersToReset.push(data.customer_id);
                }
              }
            }
          }
          setSalesReturnTransactions(data.map((item) => item.toJSON()));
          let total =
            parseFloat(getAllTrnasactionsDataForPagination()) +
            parseFloat(count);
          setAllTrnasactionsDataForPagination(parseFloat(total));

          resolve(`Resolved sales return`);
        });
      } else {
        resolve(`Resolved sales return`);
      }
    });
  };

  const getSalesReturnXMLData = async (db) => {
    return new Promise(async (resolve) => {
      if (salesReturnChecked) {
        var query;
        let results = [];
        const businessData = await Bd.getBusinessData();

        query = db.salesreturn.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                date: { $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd') }
              },
              {
                date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
              }
            ]
          }
        });

        await query.exec().then(async (data) => {
          if (!data) {
            resolve(`Resolved sales return`);
            return;
          }

          results = data.map((item) => item.toJSON());
          for (let item of results) {
            if (
              item.is_credit === true &&
              item.linked_amount !== 0 &&
              item.linked_amount < item.total_amount
            ) {
              continue;
            }
            let ledgerList = [];
            let cgst_amount = 0;
            let sgst_amount = 0;
            let igst_amount = 0;
            let total_amount_before_tax = 0;
            let packageCharge = 0;
            let shippingCharge = 0;
            let roundOff = 0;
            let discount = 0;
            let finalSubtotal = 0;

            let b2bTaxMap = new Map();
            let b2cTaxMap = new Map();

            for (let product of item.item_list) {
              cgst_amount = cgst_amount + (product.cgst_amount || 0);
              sgst_amount = sgst_amount + (product.sgst_amount || 0);
              igst_amount = igst_amount + (product.igst_amount || 0);
              discount = discount + (product.discount_amount || 0);

              let tax =
                (parseFloat(product.cgst) || 0) +
                (parseFloat(product.sgst) || 0);
              let igst_tax = parseFloat(product.igst || 0);

              const taxIncluded = product.taxIncluded;
              let itemPrice = 0;
              if (
                product.offerPrice &&
                product.offerPrice > 0 &&
                product.mrp > product.offerPrice
              ) {
                itemPrice = product.offerPrice;
              } else {
                itemPrice = product.mrp;
              }

              let netWeight = parseFloat(product.netWeight || 0);
              if (parseFloat(product.wastageGrams || 0) > 0 && netWeight > 0) {
                netWeight = netWeight + parseFloat(product.wastageGrams || 0);
              }

              if (product.pricePerGram > 0 && netWeight > 0) {
                itemPrice =
                  parseFloat(product.pricePerGram || 0) *
                  parseFloat(netWeight || 0);
              }

              //calculate wastage percentage
              let wastageAmount = 0;
              if (
                product.pricePerGram > 0 &&
                netWeight > 0 &&
                parseFloat(product.wastagePercentage || 0) > 0
              ) {
                wastageAmount = parseFloat(
                  (itemPrice * parseFloat(product.wastagePercentage || 0)) /
                    100 || 0
                ).toFixed(2);
              }

              let discountAmount = 0;

              //add making charges amount if any to mrp_before_tax
              if (product.makingChargeType === 'percentage') {
                let percentage = product.makingChargePercent || 0;

                // making charge
                product.makingChargeAmount = parseFloat(
                  (itemPrice * percentage) / 100 || 0
                ).toFixed(2);
              } else if (product.makingChargeType === 'amount') {
                product.makingChargePercent =
                  Math.round(
                    ((product.makingChargeAmount / itemPrice) * 100 || 0) * 100
                  ) / 100;
              }

              if (netWeight > 0) {
                if (!product.makingChargeIncluded) {
                  itemPrice =
                    itemPrice +
                    parseFloat(product.makingChargePerGramAmount || 0) *
                      parseFloat(product.netWeight);
                }
              }

              if (!product.makingChargeIncluded) {
                itemPrice =
                  itemPrice + parseFloat(product.makingChargeAmount || 0);
              }

              if (product.stoneCharge > 0) {
                itemPrice = itemPrice + parseFloat(product.stoneCharge || 0);
              }

              if (wastageAmount > 0) {
                itemPrice = itemPrice + parseFloat(wastageAmount || 0);
              }

              let totalGST = 0;
              let totalIGST = 0;
              let mrp_before_tax = 0;

              if (taxIncluded) {
                totalGST = itemPrice - itemPrice * (100 / (100 + tax));
                totalIGST = itemPrice - itemPrice * (100 / (100 + igst_tax));
              }

              mrp_before_tax =
                itemPrice - parseFloat(totalGST) - parseFloat(totalIGST);

              let discountAmountPerProduct = 0;

              const discountType = product.discount_type;
              if (discountType === 'percentage') {
                let percentage = product.discount_percent || 0;

                discountAmount = parseFloat(
                  (mrp_before_tax * percentage) / 100 || 0
                ).toFixed(2);
              } else if (discountType === 'amount') {
                // do nothing
              }

              discountAmountPerProduct =
                parseFloat(discountAmount) / parseFloat(product.qty);

              // let itemPriceAfterDiscount =
              //   mrp_before_tax - discountAmountPerProduct;

              let finalAmount = mrp_before_tax * product.qty;

              if (
                product.cgst_amount === 0 &&
                product.sgst_amount === 0 &&
                product.igst_amount === 0
              ) {
                if (
                  item.customerGSTNo !== '' &&
                  item.customerGSTNo !== null &&
                  isRegistered(item.customerGstType)
                ) {
                  // Credit the amount
                  let pc = {
                    'ALLLEDGERENTRIES.LIST': {
                      LEDGERNAME: getTallyLedgerName(
                        'Sales Return Exempted B2B',
                        'creditNoteMastersMapping'
                      ),
                      ISDEEMEDPOSITIVE: 'Yes',
                      AMOUNT: -Math.abs(
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                      )
                    }
                  };
                  ledgerList.push(pc);
                } else {
                  // Credit the amount
                  let pc = {
                    'ALLLEDGERENTRIES.LIST': {
                      LEDGERNAME: getTallyLedgerName(
                        'Sales Return Exempted B2C',
                        'creditNoteMastersMapping'
                      ),
                      ISDEEMEDPOSITIVE: 'Yes',
                      AMOUNT: -Math.abs(
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                      )
                    }
                  };
                  ledgerList.push(pc);
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 3 ||
                parseFloat(product.igst) === 3
              ) {
                if (
                  item.customerGSTNo !== '' &&
                  item.customerGSTNo !== null &&
                  isRegistered(item.customerGstType)
                ) {
                  if (b2bTaxMap.has('Sales Return 3% B2B')) {
                    b2bTaxMap.set(
                      'Sales Return 3% B2B',
                      b2bTaxMap.get('Sales Return 3% B2B') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2bTaxMap.set(
                      'Sales Return 3% B2B',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                } else {
                  if (b2cTaxMap.has('Sales Return 3% B2C')) {
                    b2cTaxMap.set(
                      'Sales Return 3% B2C',
                      b2cTaxMap.get('Sales Return 3% B2C') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2cTaxMap.set(
                      'Sales Return 3% B2C',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 5 ||
                parseFloat(product.igst) === 5
              ) {
                if (
                  item.customerGSTNo !== '' &&
                  item.customerGSTNo !== null &&
                  isRegistered(item.customerGstType)
                ) {
                  if (b2bTaxMap.has('Sales Return 5% B2B')) {
                    b2bTaxMap.set(
                      'Sales Return 5% B2B',
                      b2bTaxMap.get('Sales Return 5% B2B') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2bTaxMap.set(
                      'Sales Return 5% B2B',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                } else {
                  if (b2cTaxMap.has('Sales Return 5% B2C')) {
                    b2cTaxMap.set(
                      'Sales Return 5% B2C',
                      b2cTaxMap.get('Sales Return 5% B2C') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2cTaxMap.set(
                      'Sales Return 5% B2C',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 12 ||
                parseFloat(product.igst) === 12
              ) {
                if (
                  item.customerGSTNo !== '' &&
                  item.customerGSTNo !== null &&
                  isRegistered(item.customerGstType)
                ) {
                  if (b2bTaxMap.has('Sales Return 12% B2B')) {
                    b2bTaxMap.set(
                      'Sales Return 12% B2B',
                      b2bTaxMap.get('Sales Return 12% B2B') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2bTaxMap.set(
                      'Sales Return 12% B2B',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                } else {
                  if (b2cTaxMap.has('Sales Return 12% B2C')) {
                    b2cTaxMap.set(
                      'Sales Return 12% B2C',
                      b2cTaxMap.get('Sales Return 12% B2C') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2cTaxMap.set(
                      'Sales Return 12% B2C',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 18 ||
                parseFloat(product.igst) === 18
              ) {
                if (
                  item.customerGSTNo !== '' &&
                  item.customerGSTNo !== null &&
                  isRegistered(item.customerGstType)
                ) {
                  if (b2bTaxMap.has('Sales Return 18% B2B')) {
                    b2bTaxMap.set(
                      'Sales Return 18% B2B',
                      b2bTaxMap.get('Sales Return 18% B2B') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2bTaxMap.set(
                      'Sales Return 18% B2B',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                } else {
                  if (b2cTaxMap.has('Sales Return 18% B2C')) {
                    b2cTaxMap.set(
                      'Sales Return 18% B2C',
                      b2cTaxMap.get('Sales Return 18% B2C') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2cTaxMap.set(
                      'Sales Return 18% B2C',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 28 ||
                parseFloat(product.igst) === 28
              ) {
                if (
                  item.customerGSTNo !== '' &&
                  item.customerGSTNo !== null &&
                  isRegistered(item.customerGstType)
                ) {
                  if (b2bTaxMap.has('Sales Return 28% B2B')) {
                    b2bTaxMap.set(
                      'Sales Return 28% B2B',
                      b2bTaxMap.get('Sales Return 28% B2B') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2bTaxMap.set(
                      'Sales Return 28% B2B',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                } else {
                  if (b2cTaxMap.has('Sales Return 28% B2C')) {
                    b2cTaxMap.set(
                      'Sales Return 28% B2C',
                      b2cTaxMap.get('Sales Return 28% B2C') +
                        Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  } else {
                    b2cTaxMap.set(
                      'Sales Return 28% B2C',
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    );
                  }
                }
              }
            }

            // if (item.discount_amount > 0) {
            //   discount = discount + item.discount_amount;
            // }

            if (item.packing_charge > 0) {
              packageCharge = item.packing_charge;
            }

            if (item.shipping_charge > 0) {
              shippingCharge = item.shipping_charge;
            }

            if (item.round_amount > 0) {
              roundOff = item.round_amount;
            }

            total_amount_before_tax =
              parseFloat(item.total_amount) -
              parseFloat(cgst_amount) -
              parseFloat(sgst_amount) -
              parseFloat(igst_amount);

            finalSubtotal =
              parseFloat(item.total_amount) -
              parseFloat(cgst_amount) -
              parseFloat(sgst_amount) -
              parseFloat(igst_amount) -
              parseFloat(packageCharge) -
              parseFloat(shippingCharge) -
              parseFloat(roundOff);

            if (
              item.customerGSTNo !== '' &&
              item.customerGSTNo !== null &&
              isRegistered(item.customerGstType)
            ) {
              // B2B is always by Party Ledger which is created under B2B Customer Sales Group
              if (item.customer_name !== '' && item.customer_name !== null) {
                let pc = {
                  'ALLLEDGERENTRIES.LIST': {
                    LEDGERNAME: await getPartyName(item, 'Customer'),
                    PARENT: getTallyLedgerName(
                      'B2B Customer Sales Return',
                      'creditNoteMastersMapping'
                    ),
                    ISPARTYLEDGER: 'Yes',
                    ISDEEMEDPOSITIVE: 'No',
                    AMOUNT:
                      Math.round((item.total_amount + Number.EPSILON) * 100) /
                      100
                  }
                };
                ledgerList.push(pc);

                if (!partyLedgersToPush.includes(item.customer_id)) {
                  partyLedgersToPush.push(item.customer_id);
                }
              }
            } else if(item.customer_name !== '' && item.customer_name !== null && item.customer_id !== '' && tallymastersettingsData.b2c === true) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: await getPartyName(item, 'Customer'),
                  PARENT: getTallyLedgerName(
                    'B2C Customer Sales Return',
                    'creditNoteMastersMapping'
                  ),
                  ISPARTYLEDGER: 'Yes',
                  ISDEEMEDPOSITIVE: 'No',
                  AMOUNT:
                    Math.round((item.total_amount + Number.EPSILON) * 100) /
                    100
                }
              };
              ledgerList.push(pc);

              if (!partyLedgersToPush.includes(item.customer_id)) {
                partyLedgersToPush.push(item.customer_id);
              }
            } else {
              if (
                (item.payment_type === 'Credit' && item.linked_amount === 0) ||
                item.payment_type === 'Split'
              ) {
                let ledgerName = '';
                if (
                  (item.customerGSTNo === '' || item.customerGSTNo === null) &&
                  !isRegistered(item.customerGstType)
                ) {
                  ledgerName = 'B2C Customer Sales Return';
                  // Credit the amount
                  let pc = {
                    'ALLLEDGERENTRIES.LIST': {
                      LEDGERNAME: getTallyLedgerName(
                        ledgerName,
                        'creditNoteMastersMapping'
                      ),
                      ISDEEMEDPOSITIVE: 'No',
                      AMOUNT:
                        Math.round((item.total_amount + Number.EPSILON) * 100) /
                        100
                    }
                  };
                  ledgerList.push(pc);
                }
              }

              //payments preparation
              if (
                item.payment_type !== 'Split' &&
                item.payment_type !== 'Credit'
              ) {
                let paymentsMap = new Map();
                await getPaymentSplitLedgersList(
                  item,
                  'Sales Return',
                  paymentsMap
                );
                if (paymentsMap) {
                  for (const [key, value] of paymentsMap.entries()) {
                    if (value !== 0) {
                      let oneshellLedgerName = '';
                      switch (key) {
                        case 'CASH':
                          oneshellLedgerName = 'Cash';
                          break;
                        case 'UPI':
                          oneshellLedgerName = 'UPI Sales';
                          break;
                        case 'NEFT/RTGS':
                          oneshellLedgerName = 'Internet Banking Sales';
                          break;
                        case 'CHEQUE':
                          oneshellLedgerName = 'Cheque Sales';
                          break;
                        case 'CREDIT CARD':
                          oneshellLedgerName = 'Credit Card Sales';
                          break;
                        case 'DEBIT CARD':
                          oneshellLedgerName = 'Debit Card Sales';
                          break;
                        case 'GIFT CARD':
                          oneshellLedgerName = 'Gift Card';
                          break;
                        case 'CUSTOM FINANCE':
                          oneshellLedgerName = '3rd Party Finance';
                          break;
                        default:
                          break;
                      }

                      // Debit the amount
                      let pc = {
                        'ALLLEDGERENTRIES.LIST': {
                          LEDGERNAME: getTallyLedgerName(
                            oneshellLedgerName,
                            'salesMastersMapping'
                          ),
                          ISDEEMEDPOSITIVE: 'No',
                          AMOUNT:
                            Math.round((value + Number.EPSILON) * 100) / 100
                        }
                      };
                      ledgerList.push(pc);
                    }
                  }
                }
              }
            }

            if (b2bTaxMap) {
              for (let [key, value] of b2bTaxMap) {
                if (value !== 0) {
                  // Credit the amount
                  let pc = {
                    'ALLLEDGERENTRIES.LIST': {
                      LEDGERNAME: getTallyLedgerName(
                        key,
                        'creditNoteMastersMapping'
                      ),
                      ISDEEMEDPOSITIVE: 'Yes',
                      AMOUNT: -Math.abs(
                        Math.round((value + Number.EPSILON) * 100) / 100
                      )
                    }
                  };
                  ledgerList.push(pc);
                }
              }
            }

            if (b2cTaxMap) {
              for (let [key, value] of b2cTaxMap) {
                if (value !== 0) {
                  // Debit the amount
                  let pc = {
                    'ALLLEDGERENTRIES.LIST': {
                      LEDGERNAME: getTallyLedgerName(
                        key,
                        'creditNoteMastersMapping'
                      ),
                      ISDEEMEDPOSITIVE: 'Yes',
                      AMOUNT: -Math.abs(
                        Math.round((value + Number.EPSILON) * 100) / 100
                      )
                    }
                  };
                  ledgerList.push(pc);
                }
              }
            }

            // Prepare CGST Ledger
            if (cgst_amount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Input CGST',
                    'taxesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((cgst_amount + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Prepare SGST Ledger
            if (sgst_amount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Input SGST',
                    'taxesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((sgst_amount + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Prepare IGST Ledger
            if (igst_amount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Input IGST',
                    'taxesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((igst_amount + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Packing Charge Ledger
            if (packageCharge > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Sales Return Package Charge',
                    'packingChargesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((packageCharge + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Shipping Charge Ledger
            if (shippingCharge > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Sales Return Shipping Charge',
                    'shippingChargesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((shippingCharge + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Discount Charge Ledger
            if (discount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Sales Return Discount',
                    'discountMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'No',
                  AMOUNT: Math.round((discount + Number.EPSILON) * 100) / 100
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Round Off Ledger
            if (roundOff > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Sales Return Round Off',
                    'roundOffMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((roundOff + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Add to Round Off Ledger
            let amount = 0;
            for (let ledger of ledgerList) {
              amount += parseFloat(ledger['ALLLEDGERENTRIES.LIST'].AMOUNT);
            }

            if (amount !== 0) {
              let value =
                amount > 0
                  ? -Math.abs(Math.round((amount + Number.EPSILON) * 100) / 100)
                  : Math.abs(Math.round((amount + Number.EPSILON) * 100) / 100);
              if (value !== 0) {
                let pc = {
                  'ALLLEDGERENTRIES.LIST': {
                    LEDGERNAME: getTallyLedgerName(
                      'Sales Return Round Off',
                      'roundOffMastersMapping'
                    ),
                    ISDEEMEDPOSITIVE: amount > 0 ? 'Yes' : 'No',
                    AMOUNT: value
                  }
                };
                ledgerList.push(pc);
              }
            }

            let voucher = {
              TALLYMESSAGE: {
                '@xmlns:UDF': 'TallyUDF',
                VOUCHER: {
                  //'@ACTION': 'Create',
                  //'@VCHTYPE': 'Sales',
                  // '@OBJVIEW': 'Invoice Voucher View',
                  DATE: dateXMLFormatter(item.date),
                  VOUCHERTYPENAME: 'Credit Note',
                  VOUCHERNUMBER: item.sequenceNumber,
                  //OBJVIEW: 'Invoice Voucher View',
                  '#text': [ledgerList]
                }
              }
            };

            tallyTransactionsData.push(voucher);

            if (
              item.payment_type === 'Split' ||
              (item.customerGSTNo !== '' &&
                item.customerGSTNo !== null &&
                isRegistered(item.customerGstType)) ||
                (item.customer_name !== '' &&
                  item.customer_name !== null && item.customer_id !== '' && tallymastersettingsData.b2c)
            ) {
              if (
                item.payment_type === 'Credit' &&
                (item.linked_amount === 0 ||
                  item.linked_amount !== item.total_amount)
              ) {
              } else {
                let receiptLedgerList = [];
                if (
                  item.customerGSTNo !== '' &&
                  item.customerGSTNo !== null &&
                  isRegistered(item.customerGstType)
                ) {
                  // Credit the amount
                  if (
                    item.customer_name !== '' &&
                    item.customer_name !== null
                  ) {
                    let pc = {
                      'ALLLEDGERENTRIES.LIST': {
                        LEDGERNAME: await getPartyName(item, 'Customer'),
                        PARENT: getTallyLedgerName(
                          'B2B Customer Sales Return',
                          'creditNoteMastersMapping'
                        ),
                        ISDEEMEDPOSITIVE: 'Yes',
                        AMOUNT: -Math.abs(
                          Math.round(
                            (item.total_amount + Number.EPSILON) * 100
                          ) / 100
                        )
                      }
                    };
                    receiptLedgerList.push(pc);
                  }
                } else if (item.customer_name !== '' &&
                  item.customer_name !== null && item.customer_id !== '' && tallymastersettingsData.b2c) {
                    let pc = {
                      'ALLLEDGERENTRIES.LIST': {
                        LEDGERNAME: await getPartyName(item, 'Customer'),
                        PARENT: getTallyLedgerName(
                          'B2C Customer Sales Return',
                          'creditNoteMastersMapping'
                        ),
                        ISDEEMEDPOSITIVE: 'Yes',
                        AMOUNT: -Math.abs(
                          Math.round(
                            (item.total_amount + Number.EPSILON) * 100
                          ) / 100
                        )
                      }
                    };
                    receiptLedgerList.push(pc);
                } else {
                  let ledgerName = 'B2C Customer Sales Return';
                  // Credit the amount
                  let pc = {
                    'ALLLEDGERENTRIES.LIST': {
                      LEDGERNAME: getTallyLedgerName(
                        ledgerName,
                        'creditNoteMastersMapping'
                      ),
                      ISDEEMEDPOSITIVE: 'Yes',
                      AMOUNT: -Math.abs(
                        Math.round((item.total_amount + Number.EPSILON) * 100) /
                          100
                      )
                    }
                  };
                  receiptLedgerList.push(pc);
                }

                let paymentsMap = new Map();
                await getPaymentSplitLedgersList(
                  item,
                  'Sales Return',
                  paymentsMap
                );
                if (paymentsMap) {
                  for (const [key, value] of paymentsMap.entries()) {
                    if (value !== 0) {
                      let oneshellLedgerName = '';
                      switch (key) {
                        case 'CASH':
                          oneshellLedgerName = 'Cash';
                          break;
                        case 'UPI':
                          oneshellLedgerName = 'UPI Sales';
                          break;
                        case 'NEFT/RTGS':
                          oneshellLedgerName = 'Internet Banking Sales';
                          break;
                        case 'CHEQUE':
                          oneshellLedgerName = 'Cheque Sales';
                          break;
                        case 'CREDIT CARD':
                          oneshellLedgerName = 'Credit Card Sales';
                          break;
                        case 'DEBIT CARD':
                          oneshellLedgerName = 'Debit Card Sales';
                          break;
                        case 'GIFT CARD':
                          oneshellLedgerName = 'Gift Card';
                          break;
                        case 'CUSTOM FINANCE':
                          oneshellLedgerName = '3rd Party Finance';
                          break;
                        default:
                          break;
                      }

                      // Debit the amount
                      let pc = {
                        'ALLLEDGERENTRIES.LIST': {
                          LEDGERNAME: getTallyLedgerName(
                            oneshellLedgerName,
                            'salesMastersMapping'
                          ),
                          ISDEEMEDPOSITIVE: 'No',
                          AMOUNT:
                            Math.round((value + Number.EPSILON) * 100) / 100
                        }
                      };
                      receiptLedgerList.push(pc);
                    }
                  }
                }

                let receiptNumber = await getSequenceNumber(
                  item.date,
                  item.sales_return_number,
                  'Export To TallyPayment'
                );

                // Generate Receipt
                let voucher = {
                  TALLYMESSAGE: {
                    '@xmlns:UDF': 'TallyUDF',
                    VOUCHER: {
                      //'@ACTION': 'Create',
                      //'@VCHTYPE': 'Sales',
                      // '@OBJVIEW': 'Invoice Voucher View',
                      DATE: dateXMLFormatter(item.date),
                      VOUCHERTYPENAME: 'Payment',
                      VOUCHERNUMBER: receiptNumber,
                      //OBJVIEW: 'Invoice Voucher View',
                      '#text': [receiptLedgerList]
                    }
                  }
                };

                tallyTransactionsData.push(voucher);
              }
            }
          }

          resolve(`Resolved sales return`);
        });
      } else {
        resolve(`Resolved sales return`);
      }
    });
  };

  const getPurchasesData = async (db, skip) => {
    return new Promise(async (resolve) => {
      if (purchaseChecked) {
        var query;
        let result = [];
        const businessData = await Bd.getBusinessData();

        if (
          searchText &&
          searchText !== null &&
          searchText !== undefined &&
          searchText !== ''
        ) {
          var regexp = new RegExp('^.*' + searchText + '.*$', 'i');
          query = db.purchases.find({
            selector: {
              $or: [
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { vendor_bill_number: { $regex: regexp } },
                    {
                      bill_date: {
                        $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                      }
                    },
                    {
                      bill_date: {
                        $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { vendor_name: { $regex: regexp } },
                    {
                      bill_date: {
                        $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                      }
                    },
                    {
                      bill_date: {
                        $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                      }
                    }
                  ]
                }
              ]
            },
            skip: skip,
            limit: limit
          });
        } else {
          query = db.purchases.find({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  bill_date: {
                    $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                  }
                },
                {
                  bill_date: {
                    $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                  }
                }
              ]
            },
            skip: skip,
            limit: limit
          });
        }

        await query.exec().then((data) => {
          if (!data) {
            resolve(`Resolved purchase`);
            return;
          }
          result = data.map((item) => {
            let temp = item;

            return temp;
          });

          if (result.length > 0) {
            for (let data of result) {
              if (data.vendor_name !== '' && data.vendor_name !== null) {
                if (!partyLedgersToReset.includes(data.vendor_id)) {
                  partyLedgersToReset.push(data.vendor_id);
                }
              }
            }
            allTrnasactionsData.push(...result);
          }

          resolve(`Resolved purchase`);
        });
      } else {
        resolve(`Resolved purchase`);
      }
    });
  };

  const getAllPurchasesData = async (db) => {
    return new Promise(async (resolve) => {
      if (purchaseChecked) {
        const businessData = await Bd.getBusinessData();
        setPurchaseTransactions([]);
        var query;

        if (
          searchText &&
          searchText !== null &&
          searchText !== undefined &&
          searchText !== ''
        ) {
          var regexp = new RegExp('^.*' + searchText + '.*$', 'i');
          query = db.purchases.find({
            selector: {
              $or: [
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { vendor_bill_number: { $regex: regexp } },
                    {
                      bill_date: {
                        $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                      }
                    },
                    {
                      bill_date: {
                        $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { vendor_name: { $regex: regexp } },
                    {
                      bill_date: {
                        $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                      }
                    },
                    {
                      bill_date: {
                        $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                      }
                    }
                  ]
                }
              ]
            }
          });
        } else {
          query = db.purchases.find({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  bill_date: {
                    $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                  }
                },
                {
                  bill_date: {
                    $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                  }
                }
              ]
            }
          });
        }

        await query.exec().then((data) => {
          if (!data) {
            resolve(`Resolved purchase`);
            return;
          }

          let count = data.length;
          let result = [];
          result = data.map((item) => {
            let temp = item;

            return temp;
          });

          if (result.length > 0) {
            for (let data of result) {
              if (data.vendor_name !== '' && data.vendor_name !== null) {
                if (!partyLedgersToReset.includes(data.vendor_id)) {
                  partyLedgersToReset.push(data.vendor_id);
                }
              }
            }
          }
          setPurchaseTransactions(data.map((item) => item.toJSON()));
          let total =
            parseFloat(getAllTrnasactionsDataForPagination()) +
            parseFloat(count);
          setAllTrnasactionsDataForPagination(parseFloat(total));

          resolve(`Resolved purchase`);
        });
      } else {
        resolve(`Resolved purchase`);
      }
    });
  };

  const getPurchasesXMLData = async (db) => {
    return new Promise(async (resolve) => {
      if (purchaseChecked) {
        var query;
        let results = [];
        const businessData = await Bd.getBusinessData();

        query = db.purchases.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                bill_date: {
                  $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                }
              },
              {
                bill_date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
              }
            ]
          }
        });

        await query.exec().then(async (data) => {
          if (!data) {
            resolve(`Resolved purchase`);
            return;
          }

          results = data.map((item) => item.toJSON());
          for (let item of results) {
            if (
              item.is_credit === true &&
              item.linked_amount !== 0 &&
              item.linked_amount < item.total_amount
            ) {
              continue;
            }
            let ledgerList = [];
            let cgst_amount = 0;
            let sgst_amount = 0;
            let igst_amount = 0;
            let total_amount_before_tax = 0;
            let packageCharge = 0;
            let shippingCharge = 0;
            let roundOff = 0;
            let discount = 0;
            let finalSubtotal = 0;

            let b2bTaxMap = new Map();

            for (let product of item.item_list) {
              cgst_amount = cgst_amount + (product.cgst_amount || 0);
              sgst_amount = sgst_amount + (product.sgst_amount || 0);
              igst_amount = igst_amount + (product.igst_amount || 0);
              discount = discount + (product.discount_amount || 0);

              let tax =
                (parseFloat(product.cgst) || 0) +
                (parseFloat(product.sgst) || 0);
              let igst_tax = parseFloat(product.igst || 0);

              const taxIncluded = product.taxIncluded;
              let itemPrice = product.purchased_price;

              let netWeight = parseFloat(product.netWeight || 0);
              if (parseFloat(product.wastageGrams || 0) > 0 && netWeight > 0) {
                netWeight = netWeight + parseFloat(product.wastageGrams || 0);
              }

              if (product.pricePerGram > 0 && netWeight > 0) {
                itemPrice =
                  parseFloat(product.pricePerGram || 0) *
                  parseFloat(netWeight || 0);
              }

              //calculate wastage percentage
              let wastageAmount = 0;
              if (
                product.pricePerGram > 0 &&
                netWeight > 0 &&
                parseFloat(product.wastagePercentage || 0) > 0
              ) {
                wastageAmount = parseFloat(
                  (itemPrice * parseFloat(product.wastagePercentage || 0)) /
                    100 || 0
                ).toFixed(2);
              }

              let discountAmount = 0;

              //add making charges amount if any to mrp_before_tax
              if (product.makingChargeType === 'percentage') {
                let percentage = product.makingChargePercent || 0;

                // making charge
                product.makingChargeAmount = parseFloat(
                  (itemPrice * percentage) / 100 || 0
                ).toFixed(2);
              } else if (product.makingChargeType === 'amount') {
                product.makingChargePercent =
                  Math.round(
                    ((product.makingChargeAmount / itemPrice) * 100 || 0) * 100
                  ) / 100;
              }

              if (netWeight > 0) {
                if (!product.makingChargeIncluded) {
                  itemPrice =
                    itemPrice +
                    parseFloat(product.makingChargePerGramAmount || 0) *
                      parseFloat(product.netWeight);
                }
              }

              if (!product.makingChargeIncluded) {
                itemPrice =
                  itemPrice + parseFloat(product.makingChargeAmount || 0);
              }

              if (product.stoneCharge > 0) {
                itemPrice = itemPrice + parseFloat(product.stoneCharge || 0);
              }

              if (wastageAmount > 0) {
                itemPrice = itemPrice + parseFloat(wastageAmount || 0);
              }

              let totalGST = 0;
              let totalIGST = 0;
              let mrp_before_tax = 0;

              if (taxIncluded) {
                totalGST = itemPrice - itemPrice * (100 / (100 + tax));
                totalIGST = itemPrice - itemPrice * (100 / (100 + igst_tax));
              }

              mrp_before_tax =
                itemPrice - parseFloat(totalGST) - parseFloat(totalIGST);

              let discountAmountPerProduct = 0;

              const discountType = product.discount_type;
              if (discountType === 'percentage') {
                let percentage = product.discount_percent || 0;

                discountAmount = parseFloat(
                  (mrp_before_tax * percentage) / 100 || 0
                ).toFixed(2);
              } else if (discountType === 'amount') {
                // do nothing
              }

              discountAmountPerProduct =
                parseFloat(discountAmount) / parseFloat(product.qty);

              // let itemPriceAfterDiscount =
              //   mrp_before_tax - discountAmountPerProduct;

              let finalAmount = mrp_before_tax * product.qty;

              if (
                product.cgst_amount === 0 &&
                product.sgst_amount === 0 &&
                product.igst_amount === 0
              ) {
                // Credit the amount
                let pc = {
                  'ALLLEDGERENTRIES.LIST': {
                    LEDGERNAME: getTallyLedgerName(
                      'Purchases Exempted',
                      'purchasesMastersMapping'
                    ),
                    ISDEEMEDPOSITIVE: 'Yes',
                    AMOUNT: -Math.abs(
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                    )
                  }
                };
                ledgerList.push(pc);
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 3 ||
                parseFloat(product.igst) === 3
              ) {
                if (b2bTaxMap.has('Purchases 3%')) {
                  b2bTaxMap.set(
                    'Purchases 3%',
                    b2bTaxMap.get('Purchases 3%') +
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                } else {
                  b2bTaxMap.set(
                    'Purchases 3%',
                    Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 5 ||
                parseFloat(product.igst) === 5
              ) {
                if (b2bTaxMap.has('Purchases 5%')) {
                  b2bTaxMap.set(
                    'Purchases 5%',
                    b2bTaxMap.get('Purchases 5%') +
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                } else {
                  b2bTaxMap.set(
                    'Purchases 5%',
                    Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 12 ||
                parseFloat(product.igst) === 12
              ) {
                if (b2bTaxMap.has('Purchases 12%')) {
                  b2bTaxMap.set(
                    'Purchases 12%',
                    b2bTaxMap.get('Purchases 12%') +
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                } else {
                  b2bTaxMap.set(
                    'Purchases 12%',
                    Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 18 ||
                parseFloat(product.igst) === 18
              ) {
                if (b2bTaxMap.has('Purchases 18%')) {
                  b2bTaxMap.set(
                    'Purchases 18%',
                    b2bTaxMap.get('Purchases 18%') +
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                } else {
                  b2bTaxMap.set(
                    'Purchases 18%',
                    Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 28 ||
                parseFloat(product.igst) === 28
              ) {
                if (b2bTaxMap.has('Purchases 28%')) {
                  b2bTaxMap.set(
                    'Purchases 28%',
                    b2bTaxMap.get('Purchases 28%') +
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                } else {
                  b2bTaxMap.set(
                    'Purchases 28%',
                    Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                }
              }
            }

            // if (item.discount_amount > 0) {
            //   discount = discount + item.discount_amount;
            // }

            if (item.packing_charge > 0) {
              packageCharge = item.packing_charge;
            }

            if (item.shipping_charge > 0) {
              shippingCharge = item.shipping_charge;
            }

            if (item.round_amount > 0) {
              roundOff = item.round_amount;
            }

            total_amount_before_tax =
              parseFloat(item.total_amount) -
              parseFloat(cgst_amount) -
              parseFloat(sgst_amount) -
              parseFloat(igst_amount);

            finalSubtotal =
              parseFloat(item.total_amount) -
              parseFloat(cgst_amount) -
              parseFloat(sgst_amount) -
              parseFloat(igst_amount) -
              parseFloat(packageCharge) -
              parseFloat(shippingCharge) -
              parseFloat(roundOff);

            // B2B is always by Party Ledger which is created under B2B Customer Sales Group
            if (item.vendor_name !== '' && item.vendor_name !== null) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: await getPartyName(item, 'Vendor'),
                  ISDEEMEDPOSITIVE: 'No',
                  ISPARTYLEDGER: 'Yes',
                  AMOUNT:
                    Math.round((item.total_amount + Number.EPSILON) * 100) / 100
                }
              };
              ledgerList.push(pc);

              if (!partyLedgersToPush.includes(item.vendor_id)) {
                partyLedgersToPush.push(item.vendor_id);
              }
            }

            if (b2bTaxMap) {
              for (let [key, value] of b2bTaxMap) {
                if (value !== 0) {
                  // Credit the amount
                  let pc = {
                    'ALLLEDGERENTRIES.LIST': {
                      LEDGERNAME: getTallyLedgerName(
                        key,
                        'purchasesMastersMapping'
                      ),
                      ISDEEMEDPOSITIVE: 'Yes',
                      AMOUNT: -Math.abs(
                        Math.round((value + Number.EPSILON) * 100) / 100
                      )
                    }
                  };
                  ledgerList.push(pc);
                }
              }
            }

            // Prepare CGST Ledger
            if (cgst_amount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Input CGST',
                    'taxesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((cgst_amount + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Prepare SGST Ledger
            if (sgst_amount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Input SGST',
                    'taxesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((sgst_amount + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Prepare IGST Ledger
            if (igst_amount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Input IGST',
                    'taxesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((igst_amount + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Packing Charge Ledger
            if (packageCharge > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Purchases Package Charge',
                    'packingChargesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((packageCharge + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Shipping Charge Ledger
            if (shippingCharge > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Purchases Shipping Charge',
                    'shippingChargesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((shippingCharge + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Discount Charge Ledger
            if (discount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Purchases Discount',
                    'discountMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'No',
                  AMOUNT: Math.round((discount + Number.EPSILON) * 100) / 100
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Round Off Ledger
            if (roundOff > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Purchases Round Off',
                    'roundOffMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((roundOff + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Add to Round Off Ledger
            let amount = 0;
            for (let ledger of ledgerList) {
              amount += parseFloat(ledger['ALLLEDGERENTRIES.LIST'].AMOUNT);
            }

            if (amount !== 0) {
              let value =
                amount > 0
                  ? -Math.abs(Math.round((amount + Number.EPSILON) * 100) / 100)
                  : Math.abs(Math.round((amount + Number.EPSILON) * 100) / 100);
              if (value !== 0) {
                let pc = {
                  'ALLLEDGERENTRIES.LIST': {
                    LEDGERNAME: getTallyLedgerName(
                      'Purchases Round Off',
                      'roundOffMastersMapping'
                    ),
                    ISDEEMEDPOSITIVE: amount > 0 ? 'Yes' : 'No',
                    AMOUNT: value
                  }
                };
                ledgerList.push(pc);
              }
            }

            let voucher = {
              TALLYMESSAGE: {
                '@xmlns:UDF': 'TallyUDF',
                VOUCHER: {
                  //'@ACTION': 'Create',
                  //'@VCHTYPE': 'Purchases',
                  // '@OBJVIEW': 'Invoice Voucher View',
                  DATE: dateXMLFormatter(item.bill_date),
                  VOUCHERTYPENAME: 'Purchase',
                  VOUCHERNUMBER: item.vendor_bill_number,
                  //OBJVIEW: 'Invoice Voucher View',
                  '#text': [ledgerList]
                }
              }
            };

            tallyTransactionsData.push(voucher);

            if (
              item.payment_type === 'Credit' &&
              (item.linked_amount === 0 ||
                item.linked_amount !== item.total_amount)
            ) {
              //Partials to support in future
            } else {
              let receiptLedgerList = [];

              // Debit the amount
              if (item.vendor_name !== '' && item.vendor_name !== null) {
                let pc = {
                  'ALLLEDGERENTRIES.LIST': {
                    LEDGERNAME: await getPartyName(item, 'Vendor'),
                    ISDEEMEDPOSITIVE: 'Yes',
                    ISPARTYLEDGER: 'Yes',
                    AMOUNT: -Math.abs(
                      Math.round((item.total_amount + Number.EPSILON) * 100) /
                        100
                    )
                  }
                };
                receiptLedgerList.push(pc);
              }

              let receiptPaymentsMap = new Map();
              await getBankPaymentSplitLedgersList(
                item,
                'Purchases',
                receiptPaymentsMap
              );
              if (receiptPaymentsMap) {
                for (const [key, value] of receiptPaymentsMap.entries()) {
                  if (value !== 0) {
                    let oneshellLedgerName = '';
                    if (key === 'CASH') {
                      oneshellLedgerName = 'Cash';
                    } else {
                      oneshellLedgerName = key;
                    }
                    // Credit the amount
                    let pc = {
                      'ALLLEDGERENTRIES.LIST': {
                        LEDGERNAME:
                          key === 'CASH'
                            ? getTallyLedgerName(
                                oneshellLedgerName,
                                'salesMastersMapping'
                              )
                            : getBankTallyLedgerName(oneshellLedgerName),
                        ISDEEMEDPOSITIVE: 'No',
                        AMOUNT: Math.round((value + Number.EPSILON) * 100) / 100
                      }
                    };
                    receiptLedgerList.push(pc);
                  }
                }
              }

              let receiptNumber = await getSequenceNumber(
                item.bill_date,
                item.bill_number,
                'Export To TallyPayment'
              );

              // Generate Receipt
              let receiptVoucher = {
                TALLYMESSAGE: {
                  '@xmlns:UDF': 'TallyUDF',
                  VOUCHER: {
                    //'@ACTION': 'Create',
                    //'@VCHTYPE': 'Receipt',
                    // '@OBJVIEW': 'Invoice Voucher View',
                    DATE: dateXMLFormatter(item.bill_date),
                    VOUCHERTYPENAME: 'Payment',
                    VOUCHERNUMBER: receiptNumber,
                    //OBJVIEW: 'Invoice Voucher View',
                    '#text': [receiptLedgerList]
                  }
                }
              };

              tallyTransactionsData.push(receiptVoucher);
            }
          }

          resolve(`Resolved purchase`);
        });
      } else {
        resolve(`Resolved purchase`);
      }
    });
  };

  const getPurchasesReturnData = async (db, skip) => {
    return new Promise(async (resolve) => {
      if (purchaseReturnChecked) {
        var query;
        let result = [];
        const businessData = await Bd.getBusinessData();

        if (
          searchText &&
          searchText !== null &&
          searchText !== undefined &&
          searchText !== ''
        ) {
          var regexp = new RegExp('^.*' + searchText + '.*$', 'i');
          query = db.purchasesreturn.find({
            selector: {
              $or: [
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { purchaseReturnBillNumber: { $regex: regexp } },
                    {
                      date: {
                        $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                      }
                    },
                    {
                      date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
                    }
                  ]
                },
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { vendor_name: { $regex: regexp } },
                    {
                      date: {
                        $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                      }
                    },
                    {
                      date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
                    }
                  ]
                }
              ]
            },
            skip: skip,
            limit: limit
          });
        } else {
          query = db.purchasesreturn.find({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  date: { $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd') }
                },
                {
                  date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
                }
              ]
            },
            skip: skip,
            limit: limit
          });
        }

        await query.exec().then((data) => {
          if (!data) {
            resolve(`Resolved purchase returns`);
            return;
          }
          result = data.map((item) => {
            let temp = item;

            return temp;
          });

          if (result.length > 0) {
            allTrnasactionsData.push(...result);
          }

          resolve(`Resolved purchase returns`);
        });
      } else {
        resolve(`Resolved purchase returns`);
      }
    });
  };

  const getAllPurchasesReturnData = async (db) => {
    return new Promise(async (resolve) => {
      if (purchaseReturnChecked) {
        var query;
        setPurchaseReturnTransactions([]);
        const businessData = await Bd.getBusinessData();

        if (
          searchText &&
          searchText !== null &&
          searchText !== undefined &&
          searchText !== ''
        ) {
          var regexp = new RegExp('^.*' + searchText + '.*$', 'i');
          query = db.purchasesreturn.find({
            selector: {
              $or: [
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { purchaseReturnBillNumber: { $regex: regexp } },
                    {
                      date: {
                        $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                      }
                    },
                    {
                      date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
                    }
                  ]
                },
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { vendor_name: { $regex: regexp } },
                    {
                      date: {
                        $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                      }
                    },
                    {
                      date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
                    }
                  ]
                }
              ]
            }
          });
        } else {
          query = db.purchasesreturn.find({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  date: { $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd') }
                },
                {
                  date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
                }
              ]
            }
          });
        }

        await query.exec().then((data) => {
          if (!data) {
            resolve(`Resolved purchase returns`);
            return;
          }
          let count = data.length;
          let result = [];
          result = data.map((item) => {
            let temp = item;

            return temp;
          });

          if (result.length > 0) {
            for (let data of result) {
              if (data.vendor_name !== '' && data.vendor_name !== null) {
                if (!partyLedgersToReset.includes(data.vendor_id)) {
                  partyLedgersToReset.push(data.vendor_id);
                }
              }
            }
          }
          setPurchaseReturnTransactions(data.map((item) => item.toJSON()));
          let total =
            parseFloat(getAllTrnasactionsDataForPagination()) +
            parseFloat(count);
          setAllTrnasactionsDataForPagination(parseFloat(total));

          resolve(`Resolved purchase returns`);
        });
      } else {
        resolve(`Resolved purchase returns`);
      }
    });
  };

  const getPurchasesXMLReturnData = async (db) => {
    return new Promise(async (resolve) => {
      if (purchaseReturnChecked) {
        var query;
        let results = [];
        const businessData = await Bd.getBusinessData();

        query = db.purchasesreturn.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                date: { $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd') }
              },
              {
                date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
              }
            ]
          }
        });

        await query.exec().then(async (data) => {
          if (!data) {
            resolve(`Resolved purchase returns`);
            return;
          }

          results = data.map((item) => item.toJSON());
          for (let item of results) {
            if (
              item.is_credit === true &&
              item.linked_amount !== 0 &&
              item.linked_amount < item.total_amount
            ) {
              continue;
            }
            let ledgerList = [];
            let cgst_amount = 0;
            let sgst_amount = 0;
            let igst_amount = 0;
            let total_amount_before_tax = 0;
            let packageCharge = 0;
            let shippingCharge = 0;
            let roundOff = 0;
            let discount = 0;
            let finalSubtotal = 0;

            let b2bTaxMap = new Map();
            let b2cTaxMap = new Map();

            for (let product of item.item_list) {
              cgst_amount = cgst_amount + (product.cgst_amount || 0);
              sgst_amount = sgst_amount + (product.sgst_amount || 0);
              igst_amount = igst_amount + (product.igst_amount || 0);
              discount = discount + (product.discount_amount || 0);

              let tax =
                (parseFloat(product.cgst) || 0) +
                (parseFloat(product.sgst) || 0);
              let igst_tax = parseFloat(product.igst || 0);

              const taxIncluded = product.taxIncluded;
              let itemPrice = product.purchased_price;

              let netWeight = parseFloat(product.netWeight || 0);
              if (parseFloat(product.wastageGrams || 0) > 0 && netWeight > 0) {
                netWeight = netWeight + parseFloat(product.wastageGrams || 0);
              }

              if (product.pricePerGram > 0 && netWeight > 0) {
                itemPrice =
                  parseFloat(product.pricePerGram || 0) *
                  parseFloat(netWeight || 0);
              }

              //calculate wastage percentage
              let wastageAmount = 0;
              if (
                product.pricePerGram > 0 &&
                netWeight > 0 &&
                parseFloat(product.wastagePercentage || 0) > 0
              ) {
                wastageAmount = parseFloat(
                  (itemPrice * parseFloat(product.wastagePercentage || 0)) /
                    100 || 0
                ).toFixed(2);
              }

              let discountAmount = 0;

              //add making charges amount if any to mrp_before_tax
              if (product.makingChargeType === 'percentage') {
                let percentage = product.makingChargePercent || 0;

                // making charge
                product.makingChargeAmount = parseFloat(
                  (itemPrice * percentage) / 100 || 0
                ).toFixed(2);
              } else if (product.makingChargeType === 'amount') {
                product.makingChargePercent =
                  Math.round(
                    ((product.makingChargeAmount / itemPrice) * 100 || 0) * 100
                  ) / 100;
              }

              if (netWeight > 0) {
                if (!product.makingChargeIncluded) {
                  itemPrice =
                    itemPrice +
                    parseFloat(product.makingChargePerGramAmount || 0) *
                      parseFloat(product.netWeight);
                }
              }

              if (!product.makingChargeIncluded) {
                itemPrice =
                  itemPrice + parseFloat(product.makingChargeAmount || 0);
              }

              if (product.stoneCharge > 0) {
                itemPrice = itemPrice + parseFloat(product.stoneCharge || 0);
              }

              if (wastageAmount > 0) {
                itemPrice = itemPrice + parseFloat(wastageAmount || 0);
              }

              let totalGST = 0;
              let totalIGST = 0;
              let mrp_before_tax = 0;

              if (taxIncluded) {
                totalGST = itemPrice - itemPrice * (100 / (100 + tax));
                totalIGST = itemPrice - itemPrice * (100 / (100 + igst_tax));
              }

              mrp_before_tax =
                itemPrice - parseFloat(totalGST) - parseFloat(totalIGST);

              let discountAmountPerProduct = 0;

              const discountType = product.discount_type;
              if (discountType === 'percentage') {
                let percentage = product.discount_percent || 0;

                discountAmount = parseFloat(
                  (mrp_before_tax * percentage) / 100 || 0
                ).toFixed(2);
              } else if (discountType === 'amount') {
                // do nothing
              }

              discountAmountPerProduct =
                parseFloat(discountAmount) / parseFloat(product.qty);

              // let itemPriceAfterDiscount =
              //   mrp_before_tax - discountAmountPerProduct;

              let finalAmount = mrp_before_tax * product.qty;

              if (
                product.cgst_amount === 0 &&
                product.sgst_amount === 0 &&
                product.igst_amount === 0
              ) {
                // Credit the amount
                let pc = {
                  'ALLLEDGERENTRIES.LIST': {
                    LEDGERNAME: getTallyLedgerName(
                      'Purchases Return Exempted',
                      'debitNoteMastersMapping'
                    ),
                    ISDEEMEDPOSITIVE: 'No',
                    AMOUNT:
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  }
                };
                ledgerList.push(pc);
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 3 ||
                parseFloat(product.igst) === 3
              ) {
                if (b2bTaxMap.has('Purchases Return 3%')) {
                  b2bTaxMap.set(
                    'Purchases Return 3%',
                    b2bTaxMap.get('Purchases Return 3%') +
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                } else {
                  b2bTaxMap.set(
                    'Purchases Return 3%',
                    Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 5 ||
                parseFloat(product.igst) === 5
              ) {
                if (b2bTaxMap.has('Purchases Return 5%')) {
                  b2bTaxMap.set(
                    'Purchases Return 5%',
                    b2bTaxMap.get('Purchases Return 5%') +
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                } else {
                  b2bTaxMap.set(
                    'Purchases Return 5%',
                    Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 12 ||
                parseFloat(product.igst) === 12
              ) {
                if (b2bTaxMap.has('Purchases Return 12%')) {
                  b2bTaxMap.set(
                    'Purchases Return 12%',
                    b2bTaxMap.get('Purchases Return 12%') +
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                } else {
                  b2bTaxMap.set(
                    'Purchases Return 12%',
                    Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 18 ||
                parseFloat(product.igst) === 18
              ) {
                if (b2bTaxMap.has('Purchases Return 18%')) {
                  b2bTaxMap.set(
                    'Purchases Return 18%',
                    b2bTaxMap.get('Purchases Return 18%') +
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                } else {
                  b2bTaxMap.set(
                    'Purchases Return 18%',
                    Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 28 ||
                parseFloat(product.igst) === 28
              ) {
                if (b2bTaxMap.has('Purchases Return 28%')) {
                  b2bTaxMap.set(
                    'Purchases Return 28%',
                    b2bTaxMap.get('Purchases Return 28%') +
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                } else {
                  b2bTaxMap.set(
                    'Purchases Return 28%',
                    Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                }
              }
            }

            // if (item.discount_amount > 0) {
            //   discount = discount + item.discount_amount;
            // }

            if (item.packing_charge > 0) {
              packageCharge = item.packing_charge;
            }

            if (item.shipping_charge > 0) {
              shippingCharge = item.shipping_charge;
            }

            if (item.round_amount > 0) {
              roundOff = item.round_amount;
            }

            total_amount_before_tax =
              parseFloat(item.total_amount) -
              parseFloat(cgst_amount) -
              parseFloat(sgst_amount) -
              parseFloat(igst_amount);

            finalSubtotal =
              parseFloat(item.total_amount) -
              parseFloat(cgst_amount) -
              parseFloat(sgst_amount) -
              parseFloat(igst_amount) -
              parseFloat(packageCharge) -
              parseFloat(shippingCharge) -
              parseFloat(roundOff);

            // B2B is always by Party Ledger which is created under B2B Customer Sales Group
            if (item.vendor_name !== '' && item.vendor_name !== null) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: await getPartyName(item, 'Vendor'),
                  ISDEEMEDPOSITIVE: 'Yes',
                  ISPARTYLEDGER: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((item.total_amount + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);

              if (!partyLedgersToPush.includes(item.vendor_id)) {
                partyLedgersToPush.push(item.vendor_id);
              }
            }

            if (b2bTaxMap) {
              for (let [key, value] of b2bTaxMap) {
                if (value !== 0) {
                  // Credit the amount
                  let pc = {
                    'ALLLEDGERENTRIES.LIST': {
                      LEDGERNAME: getTallyLedgerName(
                        key,
                        'debitNoteMastersMapping'
                      ),
                      ISDEEMEDPOSITIVE: 'No',
                      AMOUNT: Math.round((value + Number.EPSILON) * 100) / 100
                    }
                  };
                  ledgerList.push(pc);
                }
              }
            }

            // Prepare CGST Ledger
            if (cgst_amount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Output CGST',
                    'taxesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'No',
                  AMOUNT: Math.round((cgst_amount + Number.EPSILON) * 100) / 100
                }
              };
              ledgerList.push(pc);
            }

            // Prepare SGST Ledger
            if (sgst_amount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Output SGST',
                    'taxesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'No',
                  AMOUNT: Math.round((sgst_amount + Number.EPSILON) * 100) / 100
                }
              };
              ledgerList.push(pc);
            }

            // Prepare IGST Ledger
            if (igst_amount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Output IGST',
                    'taxesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'No',
                  AMOUNT: Math.round((igst_amount + Number.EPSILON) * 100) / 100
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Packing Charge Ledger
            if (packageCharge > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Purchases Return Package Charge',
                    'packingChargesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'No',
                  AMOUNT:
                    Math.round((packageCharge + Number.EPSILON) * 100) / 100
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Shipping Charge Ledger
            if (shippingCharge > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Purchases Return Shipping Charge',
                    'shippingChargesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'No',
                  AMOUNT:
                    Math.round((shippingCharge + Number.EPSILON) * 100) / 100
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Discount Charge Ledger
            if (discount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Purchases Return Discount',
                    'discountMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'No',
                  AMOUNT: -Math.abs(
                    Math.round((discount + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Round Off Ledger
            if (roundOff > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Purchases Return Round Off',
                    'roundOffMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'No',
                  AMOUNT: Math.round((roundOff + Number.EPSILON) * 100) / 100
                }
              };
              ledgerList.push(pc);
            }

            // Add to Round Off Ledger
            let amount = 0;
            for (let ledger of ledgerList) {
              amount += parseFloat(ledger['ALLLEDGERENTRIES.LIST'].AMOUNT);
            }

            if (amount !== 0) {
              let value =
                amount > 0
                  ? -Math.abs(Math.round((amount + Number.EPSILON) * 100) / 100)
                  : Math.abs(Math.round((amount + Number.EPSILON) * 100) / 100);
              if (value !== 0) {
                let pc = {
                  'ALLLEDGERENTRIES.LIST': {
                    LEDGERNAME: getTallyLedgerName(
                      'Purchases Return Round Off',
                      'roundOffMastersMapping'
                    ),
                    ISDEEMEDPOSITIVE: amount > 0 ? 'Yes' : 'No',
                    AMOUNT: value
                  }
                };
                ledgerList.push(pc);
              }
            }

            let voucher = {
              TALLYMESSAGE: {
                '@xmlns:UDF': 'TallyUDF',
                VOUCHER: {
                  //'@ACTION': 'Create',
                  //'@VCHTYPE': 'Purchases',
                  // '@OBJVIEW': 'Invoice Voucher View',
                  DATE: dateXMLFormatter(item.date),
                  VOUCHERTYPENAME: 'Debit Note',
                  VOUCHERNUMBER: item.purchaseReturnBillNumber,
                  //OBJVIEW: 'Invoice Voucher View',
                  '#text': [ledgerList]
                }
              }
            };

            tallyTransactionsData.push(voucher);

            if (
              item.payment_type === 'Credit' &&
              (item.linked_amount === 0 ||
                item.linked_amount !== item.total_amount)
            ) {
              //Partials to support in future
            } else {
              let receiptLedgerList = [];

              // Credit the amount
              if (item.vendor_name !== '' && item.vendor_name !== null) {
                let pc = {
                  'ALLLEDGERENTRIES.LIST': {
                    LEDGERNAME: await getPartyName(item, 'Vendor'),
                    ISDEEMEDPOSITIVE: 'No',
                    ISPARTYLEDGER: 'Yes',
                    AMOUNT:
                      Math.round((item.total_amount + Number.EPSILON) * 100) /
                      100
                  }
                };
                receiptLedgerList.push(pc);
              }

              let receiptPaymentsMap = new Map();
              await getBankPaymentSplitLedgersList(
                item,
                'Purchases Return',
                receiptPaymentsMap
              );
              if (receiptPaymentsMap) {
                for (const [key, value] of receiptPaymentsMap.entries()) {
                  if (value !== 0) {
                    let oneshellLedgerName = '';
                    if (key === 'CASH') {
                      oneshellLedgerName = 'Cash';
                    } else {
                      oneshellLedgerName = key;
                    }
                    // Credit the amount
                    let pc = {
                      'ALLLEDGERENTRIES.LIST': {
                        LEDGERNAME:
                          key === 'CASH'
                            ? getTallyLedgerName(
                                oneshellLedgerName,
                                'salesMastersMapping'
                              )
                            : getBankTallyLedgerName(oneshellLedgerName),
                        ISDEEMEDPOSITIVE: 'Yes',
                        AMOUNT: -Math.abs(
                          Math.round((value + Number.EPSILON) * 100) / 100
                        )
                      }
                    };
                    receiptLedgerList.push(pc);
                  }
                }
              }

              let receiptNumber = await getSequenceNumber(
                item.date,
                item.purchase_return_number,
                'Export To TallyReceipt'
              );

              // Generate Receipt
              let receiptVoucher = {
                TALLYMESSAGE: {
                  '@xmlns:UDF': 'TallyUDF',
                  VOUCHER: {
                    //'@ACTION': 'Create',
                    //'@VCHTYPE': 'Receipt',
                    // '@OBJVIEW': 'Invoice Voucher View',
                    DATE: dateXMLFormatter(item.date),
                    VOUCHERTYPENAME: 'Receipt',
                    VOUCHERNUMBER: receiptNumber,
                    //OBJVIEW: 'Invoice Voucher View',
                    '#text': [receiptLedgerList]
                  }
                }
              };

              tallyTransactionsData.push(receiptVoucher);
            }
          }

          resolve(`Resolved purchase returns`);
        });
      } else {
        resolve(`Resolved purchase returns`);
      }
    });
  };

  const getExpensesData = async (db, skip) => {
    return new Promise(async (resolve) => {
      if (expenseChecked) {
        var query;
        let result = [];
        const businessData = await Bd.getBusinessData();

        if (
          searchText &&
          searchText !== null &&
          searchText !== undefined &&
          searchText !== ''
        ) {
          var regexp = new RegExp('^.*' + searchText + '.*$', 'i');
          query = db.expenses.find({
            selector: {
              selector: {
                $or: [
                  {
                    $and: [
                      { businessId: { $eq: businessData.businessId } },
                      { billNumber: { $regex: regexp } },
                      {
                        date: {
                          $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                        }
                      },
                      {
                        date: {
                          $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                        }
                      }
                    ]
                  },
                  {
                    $and: [
                      { businessId: { $eq: businessData.businessId } },
                      { vendor_name: { $regex: regexp } },
                      {
                        date: {
                          $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                        }
                      },
                      {
                        date: {
                          $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd')
                        }
                      }
                    ]
                  }
                ]
              }
            },
            skip: skip,
            limit: limit
          });
        } else {
          query = db.expenses.find({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  date: { $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd') }
                },
                {
                  date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
                }
              ]
            },
            skip: skip,
            limit: limit
          });
        }

        await query.exec().then(async (data) => {
          if (!data) {
            resolve(`Resolved expenses`);
            return;
          }

          result = data.map((item) => {
            let temp = item;

            return temp;
          });

          if (result.length > 0) {
            for (let data of result) {
              if (data.vendor_name !== '' && data.vendor_name !== null) {
                if (!partyLedgersToReset.includes(data.vendor_id)) {
                  partyLedgersToReset.push(data.vendor_id);
                }
              }
            }
            allTrnasactionsData.push(...result);
          }
          resolve(`Resolved expenses`);
        });
      } else {
        resolve(`Resolved expenses`);
      }
    });
  };

  const getAllExpensesData = async (db) => {
    return new Promise(async (resolve) => {
      if (expenseChecked) {
        var query;
        setExpenseTransactions([]);
        const businessData = await Bd.getBusinessData();

        if (
          searchText &&
          searchText !== null &&
          searchText !== undefined &&
          searchText !== ''
        ) {
          var regexp = new RegExp('^.*' + searchText + '.*$', 'i');
          query = db.expenses.find({
            selector: {
              $or: [
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { billNumber: { $regex: regexp } },
                    {
                      date: {
                        $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                      }
                    },
                    {
                      date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
                    }
                  ]
                },
                {
                  $and: [
                    { businessId: { $eq: businessData.businessId } },
                    { vendor_name: { $regex: regexp } },
                    {
                      date: {
                        $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd')
                      }
                    },
                    {
                      date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
                    }
                  ]
                }
              ]
            }
          });
        } else {
          query = db.expenses.find({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  date: { $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd') }
                },
                {
                  date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
                }
              ]
            }
          });
        }

        await query.exec().then(async (data) => {
          if (!data) {
            resolve(`Resolved expenses`);
            return;
          }

          let count = data.length;
          let result = [];
          result = data.map((item) => {
            let temp = item;

            return temp;
          });

          if (result.length > 0) {
            for (let data of result) {
              if (data.vendor_name !== '' && data.vendor_name !== null) {
                if (!partyLedgersToReset.includes(data.vendor_id)) {
                  partyLedgersToReset.push(data.vendor_id);
                }
              }
            }
          }
          setExpenseTransactions(data.map((item) => item.toJSON()));
          let total =
            parseFloat(getAllTrnasactionsDataForPagination()) +
            parseFloat(count);
          setAllTrnasactionsDataForPagination(parseFloat(total));

          resolve(`Resolved expenses`);
        });
      } else {
        resolve(`Resolved expenses`);
      }
    });
  };

  const getExpensesXMLData = async (db) => {
    return new Promise(async (resolve) => {
      if (expenseChecked) {
        var query;
        let results = [];
        const businessData = await Bd.getBusinessData();

        query = db.expenses.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                date: { $gte: dateFormat(dateRange.fromDate, 'yyyy-mm-dd') }
              },
              {
                date: { $lte: dateFormat(dateRange.toDate, 'yyyy-mm-dd') }
              }
            ]
          }
        });

        await query.exec().then(async (data) => {
          if (!data) {
            resolve(`Resolved expenses`);
            return;
          }

          results = data.map((item) => item.toJSON());
          for (let item of results) {
            if (
              item.is_credit === true &&
              item.linked_amount !== 0 &&
              item.linked_amount < item.total_amount
            ) {
              continue;
            }
            let ledgerList = [];
            let cgst_amount = 0;
            let sgst_amount = 0;
            let igst_amount = 0;
            let total_amount_before_tax = 0;
            let packageCharge = 0;
            let shippingCharge = 0;
            let roundOff = 0;
            let discount = 0;
            let finalSubtotal = 0;

            let b2bTaxMap = new Map();

            for (let product of item.item_list) {
              cgst_amount = cgst_amount + (product.cgst_amount || 0);
              sgst_amount = sgst_amount + (product.sgst_amount || 0);
              igst_amount = igst_amount + (product.igst_amount || 0);
              discount = discount + (product.discount_amount || 0);

              let tax =
                (parseFloat(product.cgst) || 0) +
                (parseFloat(product.sgst) || 0);
              let igst_tax = parseFloat(product.igst || 0);

              const taxIncluded = product.taxIncluded;
              let itemPrice = product.price;

              let discountAmount = 0;

              let totalGST = 0;
              let totalIGST = 0;
              let mrp_before_tax = 0;

              if (taxIncluded) {
                totalGST = itemPrice - itemPrice * (100 / (100 + tax));
                totalIGST = itemPrice - itemPrice * (100 / (100 + igst_tax));
              }

              mrp_before_tax =
                itemPrice - parseFloat(totalGST) - parseFloat(totalIGST);

              let discountAmountPerProduct = 0;

              const discountType = product.discountType;
              if (discountType === 'percentage') {
                let percentage = product.discountPercent || 0;

                discountAmount = parseFloat(
                  (mrp_before_tax * percentage) / 100 || 0
                ).toFixed(2);
              } else if (discountType === 'amount') {
                // do nothing
              }

              discountAmountPerProduct =
                parseFloat(discountAmount) / parseFloat(product.qty);

              // let itemPriceAfterDiscount =
              //   mrp_before_tax - discountAmountPerProduct;

              let finalAmount = mrp_before_tax * product.quantity;

              if (
                product.cgst_amount === 0 &&
                product.sgst_amount === 0 &&
                product.igst_amount === 0
              ) {
                // Credit the amount
                let expenseType =
                  item.expenseType === 'Direct'
                    ? 'Direct Expenses Exempted'
                    : 'Indirect Expenses Exempted';

                if (b2bTaxMap.has(expenseType)) {
                  b2bTaxMap.set(
                    expenseType,
                    b2bTaxMap.get(expenseType) +
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                } else {
                  b2bTaxMap.set(
                    expenseType,
                    Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 3 ||
                parseFloat(product.igst) === 3
              ) {
                let expenseType =
                  item.expenseType === 'Direct'
                    ? 'Direct Expenses 3%'
                    : 'Indirect Expenses 3%';

                if (b2bTaxMap.has(expenseType)) {
                  b2bTaxMap.set(
                    expenseType,
                    b2bTaxMap.get(expenseType) +
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                } else {
                  b2bTaxMap.set(
                    expenseType,
                    Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 5 ||
                parseFloat(product.igst) === 5
              ) {
                let expenseType =
                  item.expenseType === 'Direct'
                    ? 'Direct Expenses 5%'
                    : 'Indirect Expenses 5%';

                if (b2bTaxMap.has(expenseType)) {
                  b2bTaxMap.set(
                    expenseType,
                    b2bTaxMap.get(expenseType) +
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                } else {
                  b2bTaxMap.set(
                    expenseType,
                    Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 12 ||
                parseFloat(product.igst) === 12
              ) {
                let expenseType =
                  item.expenseType === 'Direct'
                    ? 'Direct Expenses 12%'
                    : 'Indirect Expenses 12%';

                if (b2bTaxMap.has(expenseType)) {
                  b2bTaxMap.set(
                    expenseType,
                    b2bTaxMap.get(expenseType) +
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                } else {
                  b2bTaxMap.set(
                    expenseType,
                    Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 18 ||
                parseFloat(product.igst) === 18
              ) {
                let expenseType =
                  item.expenseType === 'Direct'
                    ? 'Direct Expenses 18%'
                    : 'Indirect Expenses 18%';

                if (b2bTaxMap.has(expenseType)) {
                  b2bTaxMap.set(
                    expenseType,
                    b2bTaxMap.get(expenseType) +
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                } else {
                  b2bTaxMap.set(
                    expenseType,
                    Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                }
              }

              if (
                parseFloat(product.cgst) + parseFloat(product.sgst) === 28 ||
                parseFloat(product.igst) === 28
              ) {
                let expenseType =
                  item.expenseType === 'Direct'
                    ? 'Direct Expenses 28%'
                    : 'Indirect Expenses 28%';

                if (b2bTaxMap.has(expenseType)) {
                  b2bTaxMap.set(
                    expenseType,
                    b2bTaxMap.get(expenseType) +
                      Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                } else {
                  b2bTaxMap.set(
                    expenseType,
                    Math.round((finalAmount + Number.EPSILON) * 100) / 100
                  );
                }
              }
            }

            // if (item.discount_amount > 0) {
            //   discount = discount + item.discountAmount;
            // }

            if (item.packing_charge > 0) {
              packageCharge = item.packageCharge;
            }

            if (item.shipping_charge > 0) {
              shippingCharge = item.shippingCharge;
            }

            if (item.round_amount > 0) {
              roundOff = item.roundAmount;
            }

            total_amount_before_tax =
              parseFloat(item.total) -
              parseFloat(cgst_amount) -
              parseFloat(sgst_amount) -
              parseFloat(igst_amount);

            finalSubtotal =
              parseFloat(item.total) -
              parseFloat(cgst_amount) -
              parseFloat(sgst_amount) -
              parseFloat(igst_amount) -
              parseFloat(packageCharge) -
              parseFloat(shippingCharge) -
              parseFloat(roundOff);

            // B2B is always by Party Ledger which is created under B2B Customer Sales Group
            if (item.vendor_name !== '' && item.vendor_name !== null) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: await getPartyName(item, 'Vendor'),
                  ISDEEMEDPOSITIVE: 'No',
                  ISPARTYLEDGER: 'Yes',
                  AMOUNT: Math.round((item.total + Number.EPSILON) * 100) / 100
                }
              };
              ledgerList.push(pc);

              if (!partyLedgersToPush.includes(item.vendor_id)) {
                partyLedgersToPush.push(item.vendor_id);
              }
            } else {
              if (!expenseCategoriesLedgersToPush.includes(item.categoryId)) {
                expenseCategoriesLedgersToPush.push(item.categoryId);
              }

              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: item.categoryName,
                  ISDEEMEDPOSITIVE: 'No',
                  AMOUNT: Math.round((item.total + Number.EPSILON) * 100) / 100
                }
              };
              ledgerList.push(pc);
            }

            if (b2bTaxMap) {
              for (let [key, value] of b2bTaxMap) {
                if (value !== 0) {
                  // Credit the amount
                  let pc = {
                    'ALLLEDGERENTRIES.LIST': {
                      LEDGERNAME: getTallyLedgerName(
                        key,
                        'expensesMastersMapping'
                      ),
                      ISDEEMEDPOSITIVE: 'Yes',
                      AMOUNT: -Math.abs(
                        Math.round((value + Number.EPSILON) * 100) / 100
                      )
                    }
                  };
                  ledgerList.push(pc);
                }
              }
            }

            // Prepare CGST Ledger
            if (cgst_amount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Input CGST',
                    'taxesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((cgst_amount + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Prepare SGST Ledger
            if (sgst_amount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Input SGST',
                    'taxesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((sgst_amount + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Prepare IGST Ledger
            if (igst_amount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Input IGST',
                    'taxesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((igst_amount + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Packing Charge Ledger
            if (packageCharge > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Expenses Package Charge',
                    'packingChargesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((packageCharge + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Shipping Charge Ledger
            if (shippingCharge > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Expenses Shipping Charge',
                    'shippingChargesMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((shippingCharge + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Discount Charge Ledger
            if (discount > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Expenses Discount',
                    'discountMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'No',
                  AMOUNT: Math.round((discount + Number.EPSILON) * 100) / 100
                }
              };
              ledgerList.push(pc);
            }

            // Prepare Round Off Ledger
            if (roundOff > 0) {
              let pc = {
                'ALLLEDGERENTRIES.LIST': {
                  LEDGERNAME: getTallyLedgerName(
                    'Expenses Round Off',
                    'roundOffMastersMapping'
                  ),
                  ISDEEMEDPOSITIVE: 'Yes',
                  AMOUNT: -Math.abs(
                    Math.round((roundOff + Number.EPSILON) * 100) / 100
                  )
                }
              };
              ledgerList.push(pc);
            }

            // Add to Round Off Ledger
            let amount = 0;
            for (let ledger of ledgerList) {
              amount += parseFloat(ledger['ALLLEDGERENTRIES.LIST'].AMOUNT);
            }

            if (amount !== 0) {
              let value =
                amount > 0
                  ? -Math.abs(Math.round((amount + Number.EPSILON) * 100) / 100)
                  : Math.abs(Math.round((amount + Number.EPSILON) * 100) / 100);
              if (value !== 0) {
                let pc = {
                  'ALLLEDGERENTRIES.LIST': {
                    LEDGERNAME: getTallyLedgerName(
                      'Expenses Round Off',
                      'roundOffMastersMapping'
                    ),
                    ISDEEMEDPOSITIVE: amount > 0 ? 'Yes' : 'No',
                    AMOUNT: value
                  }
                };
                ledgerList.push(pc);
              }
            }

            let voucher = {
              TALLYMESSAGE: {
                '@xmlns:UDF': 'TallyUDF',
                VOUCHER: {
                  //'@ACTION': 'Create',
                  //'@VCHTYPE': 'Expenses',
                  // '@OBJVIEW': 'Invoice Voucher View',
                  DATE: dateXMLFormatter(item.date),
                  VOUCHERTYPENAME: 'Expenses',
                  VOUCHERNUMBER: item.billNumber,
                  //OBJVIEW: 'Invoice Voucher View',
                  '#text': [ledgerList]
                }
              }
            };

            tallyTransactionsData.push(voucher);

            if (
              item.paymentType === 'Credit' &&
              (item.linked_amount === 0 || item.linked_amount !== item.total)
            ) {
              //Partials to support in future
            } else {
              let receiptLedgerList = [];

              // Debit the amount
              if (item.vendor_name !== '' && item.vendor_name !== null) {
                let pc = {
                  'ALLLEDGERENTRIES.LIST': {
                    LEDGERNAME: await getPartyName(item, 'Vendor'),
                    ISDEEMEDPOSITIVE: 'Yes',
                    ISPARTYLEDGER: 'Yes',
                    AMOUNT: -Math.abs(
                      Math.round((item.total + Number.EPSILON) * 100) / 100
                    )
                  }
                };
                receiptLedgerList.push(pc);
              } else {
                let pc = {
                  'ALLLEDGERENTRIES.LIST': {
                    LEDGERNAME: item.categoryName,
                    ISDEEMEDPOSITIVE: 'Yes',
                    AMOUNT: -Math.abs(
                      Math.round((item.total + Number.EPSILON) * 100) / 100
                    )
                  }
                };
                receiptLedgerList.push(pc);
              }

              let receiptPaymentsMap = new Map();
              await getExpensePaymentSplitLedgersList(item, receiptPaymentsMap);
              if (receiptPaymentsMap) {
                for (const [key, value] of receiptPaymentsMap.entries()) {
                  if (value !== 0) {
                    let oneshellLedgerName = '';
                    if (key === 'CASH') {
                      oneshellLedgerName = 'Cash';
                    } else {
                      oneshellLedgerName = key;
                    }
                    // Credit the amount
                    let pc = {
                      'ALLLEDGERENTRIES.LIST': {
                        LEDGERNAME:
                          key === 'CASH'
                            ? getTallyLedgerName(
                                oneshellLedgerName,
                                'salesMastersMapping'
                              )
                            : getBankTallyLedgerName(oneshellLedgerName),
                        ISDEEMEDPOSITIVE: 'No',
                        AMOUNT: Math.round((value + Number.EPSILON) * 100) / 100
                      }
                    };
                    receiptLedgerList.push(pc);
                  }
                }
              }

              let receiptNumber = await getSequenceNumber(
                item.date,
                item.billNumber,
                'Export To TallyPayment'
              );

              // Generate Receipt
              let receiptVoucher = {
                TALLYMESSAGE: {
                  '@xmlns:UDF': 'TallyUDF',
                  VOUCHER: {
                    //'@ACTION': 'Create',
                    //'@VCHTYPE': 'Receipt',
                    // '@OBJVIEW': 'Invoice Voucher View',
                    DATE: dateXMLFormatter(item.date),
                    VOUCHERTYPENAME: 'Payment',
                    VOUCHERNUMBER: receiptNumber,
                    //OBJVIEW: 'Invoice Voucher View',
                    '#text': [receiptLedgerList]
                  }
                }
              };

              tallyTransactionsData.push(receiptVoucher);
            }
          }

          resolve(`Resolved expenses`);
        });
      } else {
        resolve(`Resolved expenses`);
      }
    });
  };

  const getAllTxnData = async (searchText) => {
    const db = await Db.get();
    let skip = 0;

    await setRowData([]);

    await setAllTrnasactionsData([]);
    allTrnasactionsData = [];

    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1 && !dataLoaded) {
      await setTotalRecords([]);
      await Promise.all([
        getAllSalesData(db, searchText),
        getAllSalesReturnData(db, searchText),
        getAllPurchasesData(db, searchText),
        getAllPurchasesReturnData(db, searchText),
        getAllExpensesData(db, searchText)
      ]).then(() => {
        let numberOfPages = 1;
        let count = getAllTrnasactionsDataForPagination();

        if (count % limit === 0) {
          numberOfPages = parseInt(count / limit);
        } else {
          numberOfPages = parseInt(count / limit + 1);
        }
        setTotalPages(numberOfPages);
        setTotalDataCount(count);
        setDataLoaded(true);

        console.log('completed all fetching');
      });
    }

    await Promise.all([
      getSalesData(db, skip, searchText),
      getSalesReturnData(db, skip, searchText),
      getPurchasesData(db, skip, searchText),
      getPurchasesReturnData(db, skip, searchText),
      getExpensesData(db, skip, searchText)
    ]).then(() => {
      if (
        (allTrnasactionsData && allTrnasactionsData.length > 0) ||
        currentPage <= totalPages
      ) {
        const updatedRecords = [...totalRecords]; // Create a copy of the current records
        let totalCount = 0;

        for (const newRecord of allTrnasactionsData) {
          totalCount += newRecord.count;
          newRecord.totalCount = totalCount;
          updatedRecords.push(newRecord);
        }

        setTotalRecords(updatedRecords);

        let startIndex = (currentPage - 1) * limit;
        let endIndex = currentPage * limit;

        setRowData(updatedRecords.slice(startIndex, endIndex + 1));
      } else {
        setRowData([]);
      }
      console.log('completed fetching');
    });
  };

  const prepareXmlContent = async () => {
    const db = await Db.get();

    await Promise.all([getSalesXMLData(db)]).then(() => {
      console.log('completed fetching');

      var envelope = {
        ENVELOPE: {
          HEADER: {
            TALLYREQUEST: 'Import Data'
          },
          IMPORTDATA: {
            REQUESTDESC: {
              REPORTNAME: 'All Masters',
              STATICVARIABLES: {
                SVCURRENTCOMPANY: tallymastersettingsData.tallyCompanyName
              }
            },
            REQUESTDATA: {
              '#text': [tallyTransactionsData]
            }
          }
        }
      };

      return envelope;
    });
  };

  const pushToTally = async () => {
    // to integrate by mani
    let envelope = await prepareXmlContent();

    var builder = require('xmlbuilder');
    var root = builder.create(envelope);

    helper.sendXmlDataToTally(root);
  };

  const getRegistrationType = (gstType) => {
    let registrationType = '';
    switch (gstType) {
      case 'Registered Customer':
      case 'Registered Vendor':
        registrationType = 'Regular';
        break;
      case 'Composition Reg Customer':
      case 'Composition Reg Vendor':
        registrationType = 'Composition';
        break;
      case 'Oveseas Customer':
      case 'Oveseas Vendor':
        registrationType = 'Overseas';
        break;
      default:
        registrationType = 'Unregistered/Consumer';
        break;
    }
    return registrationType;
  };

  const preparePartyLedgers = async () => {
    const db = await Db.get();
    setTallyPartiesTransactionsData([]);
    const businessData = await Bd.getBusinessData();

    for (let id of partyLedgersToPush) {
      const query = db.parties.findOne({
        selector: {
          $and: [{ businessId: { $eq: businessData.businessId } }, { id: id }]
        }
      });

      await query.exec().then(async (data) => {
        if (!data) {
          // No customer data is found so cannot update any information
          return;
        }

        let registrationType = '';
        switch (data.gstType) {
          case 'Registered Customer':
          case 'Registered Vendor':
            registrationType = 'Regular';
            break;
          case 'Composition Reg Customer':
          case 'Composition Reg Vendor':
            registrationType = 'Composition';
            break;
          case 'Oveseas Customer':
          case 'Oveseas Vendor':
            registrationType = 'Overseas';
            break;
          default:
            registrationType = 'Unregistered/Consumer';
            break;
        }

        if (
          data.tallySynced === false &&
          (data.tallyMappingName === '' || data.tallyMappingName === null)
        ) {
          let partyObjLedgerGroup = {
            TALLYMESSAGE: {
              '@xmlns:UDF': 'TallyUDF',
              LEDGER: {
                '@ACTION': 'Create',
                NAME: data.tallyMappingName
                  ? data.tallyMappingName
                  : data.gstNumber
                  ? data.name + '-' + data.gstNumber
                  : data.name,
                INCOMETAXNUMBER: data.panNumber,
                GSTREGISTRATIONTYPE: registrationType,
                PARENT: data.isCustomer
                  ? tallymastersettingsData.customerMastersMapping[0]
                      .tallyLedgerGroup
                  : tallymastersettingsData.vendorMastersMapping[0]
                      .tallyLedgerGroup,
                PRIORSTATENAME: data.state,
                VATDEALERTYPE: registrationType,
                TAXTYPE: 'Others',
                COUNTRYOFRESIDENCE: data.country,
                LEDGERMOBILE: data.phoneNo,
                PINCODE: data.pincode,
                EMAIL: data.emailId,
                'LANGUAGENAME.LIST': {
                  'NAME.LIST': {
                    '@TYPE': 'String',
                    NAME: data.name + '-' + data.gstNumber
                  }
                },
                'LEDMAILINGDETAILS.LIST': {
                  'ADDRESS.LIST': {
                    '@TYPE': 'String',
                    ADDRESS: data.address,
                    ADDRESS: data.city
                  },
                  APPLICABLEFROM: dateGSTXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  PINCODE: data.pincode,
                  MAILINGNAME: data.name,
                  STATE: data.state,
                  COUNTRY: data.country
                },
                'LEDGSTREGDETAILS.LIST': {
                  APPLICABLEFROM: dateGSTXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  GSTREGISTRATIONTYPE: registrationType,
                  PLACEOFSUPPLY: data.state,
                  GSTIN: data.gstNumber
                }
              }
            }
          };
          tallyPartiesTransactionsData.push(partyObjLedgerGroup);
        }
      });
    }

    for (let id of expenseCategoriesLedgersToPush) {
      const query = db.expensecategories.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { categoryId: id }
          ]
        }
      });

      await query.exec().then(async (data) => {
        if (!data) {
          // No category data is found so cannot update any information
          return;
        }

        if (data.tallySynced === false) {
          let categoryLedgerGroup = {
            TALLYMESSAGE: {
              '@xmlns:UDF': 'TallyUDF',
              LEDGER: {
                '@Action': 'Create',
                NAME: data.category,
                PARENT: getTallyGroupName(
                  'Indirect Expenses Exempted',
                  'expensesMastersMapping'
                ),
                'LEDGSTREGDETAILS.LIST': {
                  APPLICABLEFROM: dateGSTXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  TAXTYPE: 'Others',
                  GSTAPPLICABLE: 'Yes',
                  GSTTYPEOFSUPPLY: 'Goods',
                  'NAME.LIST': {
                    '@TYPE': 'String',
                    NAME: data.category
                  },
                  'HSNDETAILS.LIST': {
                    APPLICABLEFROM: dateGSTXMLFormatter(
                      dateHelper.getFinancialYearStartDate()
                    ),
                    SRCOFHSNDETAILS: 'As per Company/Group'
                  }
                }
              }
            }
          };

          tallyPartiesTransactionsData.push(categoryLedgerGroup);
        }
      });
    }

    if (
      tallyPartiesTransactionsData &&
      tallyPartiesTransactionsData.length > 0
    ) {
      var envelope = {
        ENVELOPE: {
          HEADER: {
            TALLYREQUEST: 'Import Data'
          },
          BODY: {
            IMPORTDATA: {
              REQUESTDESC: {
                REPORTNAME: 'All Masters',
                STATICVARIABLES: {
                  SVCURRENTCOMPANY: tallymastersettingsData.tallyCompanyName
                }
              },
              REQUESTDATA: {
                '#text': [tallyPartiesTransactionsData]
              }
            }
          }
        }
      };

      var builder = require('xmlbuilder');
      var root = builder.create(envelope);

      var filename = 'tally_oneshell_masters_import.xml';
      var pom = document.createElement('a');
      var bb = new Blob([root], { type: 'text/plain' });

      pom.setAttribute('href', window.URL.createObjectURL(bb));
      pom.setAttribute('download', filename);

      pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(
        ':'
      );
      pom.draggable = true;
      pom.classList.add('dragout');

      pom.click();

      console.log(root.toString());
    }
  };

  const generateXML = async () => {
    const db = await Db.get();
    setLoadingAlertMessage(
      'Please wait while the Tally import XML is being generated!!!'
    );
    setLoadingAlert(true);
    setMessage('');
    setOpenErrorMesssageDialog(false);

    setPartyLedgersToPush([]);
    setExpenseCategoriesLedgersToPush([]);
    await Promise.all([
      getSalesXMLData(db),
      getSalesReturnXMLData(db),
      getPurchasesXMLData(db),
      getPurchasesXMLReturnData(db),
      getExpensesXMLData(db)
    ]).then(async () => {
      console.log('completed fetching');

      setMessage('');
      setOpenErrorMesssageDialog(false);

      await preparePartyLedgers();

      var envelope = {
        ENVELOPE: {
          HEADER: {
            VERSION: 1,
            TALLYREQUEST: 'Import',
            TYPE: 'Data',
            ID: 'Vouchers'
          },
          BODY: {
            DATA: {
              '#text': [tallyTransactionsData]
            }
          }
        }
      };

      var builder = require('xmlbuilder');
      var root = builder.create(envelope);

      var filename = 'tally_oneshell_vouchers_import.xml';
      var pom = document.createElement('a');
      var bb = new Blob([root], { type: 'text/plain' });

      pom.setAttribute('href', window.URL.createObjectURL(bb));
      pom.setAttribute('download', filename);

      pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(
        ':'
      );
      pom.draggable = true;
      pom.classList.add('dragout');

      pom.click();

      setLoadingAlertMessage('');
      setLoadingAlert(false);

      markBulkTallyPushStatus(true);
    });
  };

  const markBulkTallyPushStatus = async (status) => {
    setLoadingAlertMessage('Please wait. We are resetting the data!');
    setLoadingAlert(true);
    await updateBulkSaleTallySyncStatus(saleTransactions, status);
    await updateBulkSaleReturnTallySyncStatus(salesReturnTransactions, status);
    await updateBulkPurchaseTallySyncStatus(purchaseTransactions, status);
    await updateBulkPurchaseReturnTallySyncStatus(
      purchaseReturnTransactions,
      status
    );
    await updateBulkExpenseTallySyncStatus(expenseTransactions, status);

    // Update parties
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    let partyResetArray =
      status === true ? partyLedgersToPush : partyLedgersToReset;
    for (var i = 0; i < partyResetArray.length; i++) {
      let id = partyResetArray[i];
      let updatedAtNewTime = timestamp.getUniqueTimestamp();
      const query = await db.parties.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              id: {
                $eq: id
              }
            }
          ]
        }
      });
      query
        .exec()
        .then(async (data) => {
          if (!data) {
            // No Sales data is not found so cannot update any information
            return;
          }

          await query
            .update({
              $set: {
                updatedAt: updatedAtNewTime,
                tallySynced: status
              }
            })
            .then(async (data) => {})
            .catch((err) => {
              console.log('Internal Server Error', err);
            });
        })
        .catch((err) => {
          console.log('Internal Server Error Sale Order', err);
        });
    }

    setCurrentPage(1);
    setTotalPages(1);
    setTotalRecords([]);
    setDataLoaded(false);
    setAllTrnasactionsDataForPagination(0);
    setOnChange(true);

    setLoadingAlertMessage('');
    setLoadingAlert(false);
  };

  const getSequenceNumber = async (date, id, type) => {
    let data = {};
    //sequence number
    let transSettings = {};
    let multiDeviceSettings = {};
    let isOnline = true;

    if (window.navigator.onLine) {
      transSettings = await getTallySequenceNumbers();
      if(type === 'Export To TallyReceipt') {
        data.prefix =
        transSettings.receipt.prefixSequence &&
        transSettings.receipt.prefixSequence.length > 0
          ? transSettings.receipt.prefixSequence[0].prefix
          : '';
      } else {
        data.prefix =
        transSettings.payment.prefixSequence &&
        transSettings.payment.prefixSequence.length > 0
          ? transSettings.payment.prefixSequence[0].prefix
          : '';
      }
    }

    const sequenceNumber = await sequence.getFinalSequenceNumber(
      data,
      type,
      date,
      id,
      txnSettings,
      multiDeviceSettings,
      isOnline
    );
    return sequenceNumber;
  };

  const getPaymentSplitLedgersList = async (_data, type, paymentsMap) => {
    let listOfPaymentInData = [];
    if (type === 'Sales') {
      for (let linkedTxn of _data.linkedTxnList) {
        let tableName = '';
        switch (linkedTxn.paymentType) {
          case 'Payment In':
            tableName = 'paymentin';
            break;
          case 'Sales Return':
            tableName = 'salesreturn';
            break;
          case 'Purchases':
            tableName = 'purchases';
            break;
          case 'Opening Payable Balance':
            tableName = 'alltransactions';
            break;
          default:
            return null;
        }

        if (tableName !== null) {
          const response = await getLinkedData(linkedTxn.linkedId, tableName);
          linkedTxn.splitPaymentList = response.splitPaymentList;
          linkedTxn.bankAccount = response.bankAccount;
          if ('Payment In' === linkedTxn.paymentType) {
            linkedTxn.paymentType = response.paymentType;
            linkedTxn.total = response.total;
          } else if ('Sales Return' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Sales Return';
            linkedTxn.total = response.total_amount;
          } else if ('Purchases' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Purchases';
            linkedTxn.total = response.total_amount;
          } else if ('Opening Payable Balance' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Opening Balance';
            linkedTxn.total = response.amount;
          }

          listOfPaymentInData.push(linkedTxn);
        }
      }
    } else if (type === 'Sales Return') {
      for (let linkedTxn of _data.linkedTxnList) {
        console.log('Sales Return linked transaction', linkedTxn);
        let tableName = '';
        switch (linkedTxn.paymentType) {
          case 'Payment Out':
            tableName = 'paymentout';
            break;
          case 'Sales':
            tableName = 'sales';
            break;
          case 'Purchases Return':
            tableName = 'purchasesreturn';
            break;
          case 'Opening Receivable Balance':
            tableName = 'alltransactions';
            break;
          default:
            return null;
        }

        if (tableName !== null) {
          const response = await getLinkedData(linkedTxn.linkedId, tableName);
          linkedTxn.splitPaymentList = response.splitPaymentList;
          linkedTxn.bankAccount = response.bankAccount;
          if ('Payment Out' === linkedTxn.paymentType) {
            linkedTxn.paymentType = response.paymentType;
            linkedTxn.total = response.total;
          } else if ('Sales' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Sales';
            linkedTxn.total = response.total_amount;
          } else if ('Purchases Return' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Purchases Return';
            linkedTxn.total = response.total_amount;
          } else if ('Opening Receivable Balance' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Opening Balance';
            linkedTxn.total = response.amount;
          }

          listOfPaymentInData.push(linkedTxn);
        }
      }
    } else if (type === 'Purchases') {
      for (let linkedTxn of _data.linkedTxnList) {
        let tableName = '';
        switch (linkedTxn.paymentType) {
          case 'Payment Out':
            tableName = 'paymentout';
            break;
          case 'Sales':
            tableName = 'sales';
            break;
          case 'Purchases Return':
            tableName = 'purchasesreturn';
            break;
          case 'Opening Receivable Balance':
            tableName = 'alltransactions';
            break;
          default:
            return null;
        }

        if (tableName !== null) {
          const response = await getLinkedData(linkedTxn.linkedId, tableName);
          linkedTxn.splitPaymentList = response.splitPaymentList;
          linkedTxn.bankAccount = response.bankAccount;
          if ('Payment Out' === linkedTxn.paymentType) {
            linkedTxn.paymentType = response.paymentType;
            linkedTxn.total = response.total;
          } else if ('Sales' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Sales';
            linkedTxn.total = response.total_amount;
          } else if ('Purchases Return' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Purchases Return';
            linkedTxn.total = response.total_amount;
          } else if ('Opening Receivable Balance' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Opening Balance';
            linkedTxn.total = response.amount;
          }

          listOfPaymentInData.push(linkedTxn);
        }
      }
    } else if (type === 'Purchases Return') {
      for (let linkedTxn of _data.linkedTxnList) {
        let tableName = '';
        switch (linkedTxn.paymentType) {
          case 'Payment In':
            tableName = 'paymentin';
            break;
          case 'Sales Return':
            tableName = 'salesreturn';
            break;
          case 'Purchases':
            tableName = 'purchases';
            break;
          case 'Opening Payable Balance':
            tableName = 'alltransactions';
            break;
          default:
            return null;
        }

        if (tableName !== null) {
          const response = await getLinkedData(linkedTxn.linkedId, tableName);
          linkedTxn.splitPaymentList = response.splitPaymentList;
          linkedTxn.bankAccount = response.bankAccount;
          if ('Payment In' === linkedTxn.paymentType) {
            linkedTxn.paymentType = response.paymentType;
            linkedTxn.total = response.total;
          } else if ('Sales Return' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Sales Return';
            linkedTxn.total = response.total_amount;
          } else if ('Purchases' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Purchases';
            linkedTxn.total = response.total_amount;
          } else if ('Opening Payable Balance' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Opening Balance';
            linkedTxn.total = response.amount;
          }

          listOfPaymentInData.push(linkedTxn);
        }
      }
    }

    if (_data.payment_type === 'Split') {
      for (let payment of _data.splitPaymentList) {
        if (payment.amount > 0 && payment.paymentType === 'Cash') {
          paymentsMap.set('CASH', payment.amount);
        }
        if (payment.amount > 0 && payment.paymentType === 'Gift Card') {
          paymentsMap.set('GIFT CARD', payment.amount);
        }
        if (payment.amount > 0 && payment.paymentType === 'Custom Finance') {
          paymentsMap.set('CUSTOM FINANCE', payment.amount);
        }

        if (
          payment.paymentMode === 'UPI' ||
          payment.paymentMode === 'Internet Banking' ||
          payment.paymentMode === 'Credit Card' ||
          payment.paymentMode === 'Debit Card' ||
          payment.paymentMode === 'Cheque'
        ) {
          let mode = '';
          switch (payment.paymentMode) {
            case 'UPI':
              mode = 'UPI';
              break;
            case 'Internet Banking':
              mode = 'NEFT/RTGS';
              break;
            case 'Credit Card':
              mode = 'CREDIT CARD';
              break;
            case 'Debit Card':
              mode = 'DEBIT CARD';
              break;
            case 'Cheque':
              mode = 'CHEQUE';
              break;
            default:
              return '';
          }

          if (paymentsMap.has(mode)) {
            paymentsMap.set(mode, paymentsMap.get(mode) + payment.amount);
          } else {
            paymentsMap.set(mode, payment.amount);
          }
        }
      }
    } else if (_data.payment_type === 'cash' || _data.payment_type === 'Cash') {
      paymentsMap.set('CASH', _data.total_amount);
    } else if (_data.payment_type === 'upi') {
      paymentsMap.set('UPI', _data.total_amount);
    } else if (_data.payment_type === 'internetbanking') {
      paymentsMap.set('NEFT/RTGS', _data.total_amount);
    } else if (_data.payment_type === 'cheque') {
      paymentsMap.set('CHEQUE', _data.total_amount);
    } else if (_data.payment_type === 'creditcard') {
      paymentsMap.set('CREDIT CARD', _data.total_amount);
    } else if (_data.payment_type === 'debitcard') {
      paymentsMap.set('DEBIT CARD', _data.total_amount);
    } else if (_data.payment_type === 'Credit') {
      for (let pI of listOfPaymentInData) {
        let amountToConsider = pI.linkedAmount;
        if (pI.paymentType === 'Split') {
          for (let payment of pI.splitPaymentList) {
            let amount = 0;
            if (amountToConsider >= payment.amount) {
              amount = payment.amount;
              amountToConsider = amountToConsider - payment.amount;
            } else {
              amount = amountToConsider;
              amountToConsider = 0;
            }
            if (payment.amount > 0 && payment.paymentType === 'Cash') {
              if (paymentsMap.has('CASH')) {
                paymentsMap.set('CASH', paymentsMap.get('CASH') + amount);
              } else {
                paymentsMap.set('CASH', amount);
              }
            }
            if (payment.amount > 0 && payment.paymentType === 'Gift Card') {
              if (paymentsMap.has('GIFT CARD')) {
                paymentsMap.set(
                  'GIFT CARD',
                  paymentsMap.get('GIFT CARD') + amount
                );
              } else {
                paymentsMap.set('GIFT CARD', amount);
              }
            }
            if (
              payment.amount > 0 &&
              payment.paymentType === 'Custom Finance'
            ) {
              if (paymentsMap.has('CUSTOM FINANCE')) {
                paymentsMap.set(
                  'CUSTOM FINANCE',
                  paymentsMap.get('CUSTOM FINANCE') + amount
                );
              } else {
                paymentsMap.set('CUSTOM FINANCE', amount);
              }
            }

            if (
              payment.paymentMode === 'UPI' ||
              payment.paymentMode === 'Internet Banking' ||
              payment.paymentMode === 'Credit Card' ||
              payment.paymentMode === 'Debit Card' ||
              payment.paymentMode === 'Cheque'
            ) {
              let mode = '';
              switch (payment.paymentMode) {
                case 'UPI':
                  mode = 'UPI';
                  break;
                case 'Internet Banking':
                  mode = 'NEFT/RTGS';
                  break;
                case 'Credit Card':
                  mode = 'CREDIT CARD';
                  break;
                case 'Debit Card':
                  mode = 'DEBIT CARD';
                  break;
                case 'Cheque':
                  mode = 'CHEQUE';
                  break;
                default:
                  return '';
              }
              if (paymentsMap.has(mode)) {
                paymentsMap.set(mode, paymentsMap.get(mode) + amount);
              } else {
                paymentsMap.set(mode, amount);
              }
            }

            if (amountToConsider === 0) {
              continue;
            }
          }
        } else if (pI.paymentType === 'cash' || pI.paymentType === 'Cash') {
          let amount = 0;
          if (amountToConsider >= pI.total) {
            amount = pI.total;
            amountToConsider = amountToConsider - pI.total;
          } else {
            amount = amountToConsider;
            amountToConsider = 0;
          }
          if (paymentsMap.has('CASH')) {
            paymentsMap.set('CASH', paymentsMap.get('CASH') + amount);
          } else {
            paymentsMap.set('CASH', amount);
          }

          if (amountToConsider === 0) {
            continue;
          }
        } else if (pI.paymentType === 'upi') {
          let amount = 0;
          if (amountToConsider >= pI.total) {
            amount = pI.total;
            amountToConsider = amountToConsider - pI.total;
          } else {
            amount = amountToConsider;
            amountToConsider = 0;
          }
          if (paymentsMap.has('UPI')) {
            paymentsMap.set('UPI', paymentsMap.get('UPI') + amount);
          } else {
            paymentsMap.set('UPI', amount);
          }

          if (amountToConsider === 0) {
            continue;
          }
        } else if (pI.paymentType === 'internetbanking') {
          let amount = 0;
          if (amountToConsider >= pI.total) {
            amount = pI.total;
            amountToConsider = amountToConsider - pI.total;
          } else {
            amount = amountToConsider;
            amountToConsider = 0;
          }
          if (paymentsMap.has('NEFT/RTGS')) {
            paymentsMap.set('NEFT/RTGS', paymentsMap.get('NEFT/RTGS') + amount);
          } else {
            paymentsMap.set('NEFT/RTGS', amount);
          }

          if (amountToConsider === 0) {
            continue;
          }
        } else if (pI.paymentType === 'cheque') {
          let amount = 0;
          if (amountToConsider >= pI.total) {
            amount = pI.total;
            amountToConsider = amountToConsider - pI.total;
          } else {
            amount = amountToConsider;
            amountToConsider = 0;
          }
          if (paymentsMap.has('CHEQUE')) {
            paymentsMap.set('CHEQUE', paymentsMap.get('CHEQUE') + amount);
          } else {
            paymentsMap.set('CHEQUE', amount);
          }

          if (amountToConsider === 0) {
            continue;
          }
        } else if (pI.paymentType === 'creditcard') {
          let amount = 0;
          if (amountToConsider >= pI.total) {
            amount = pI.total;
            amountToConsider = amountToConsider - pI.total;
          } else {
            amount = amountToConsider;
            amountToConsider = 0;
          }
          if (paymentsMap.has('CREDIT CARD')) {
            paymentsMap.set(
              'CREDIT CARD',
              paymentsMap.get('CREDIT CARD') + amount
            );
          } else {
            paymentsMap.set('CREDIT CARD', amount);
          }

          if (amountToConsider === 0) {
            continue;
          }
        } else if (pI.paymentType === 'debitcard') {
          let amount = 0;
          if (amountToConsider >= pI.total) {
            amount = pI.total;
            amountToConsider = amountToConsider - pI.total;
          } else {
            amount = amountToConsider;
            amountToConsider = 0;
          }
          if (paymentsMap.has('DEBIT CARD')) {
            paymentsMap.set(
              'DEBIT CARD',
              paymentsMap.get('DEBIT CARD') + amount
            );
          } else {
            paymentsMap.set('DEBIT CARD', amount);
          }

          if (amountToConsider === 0) {
            continue;
          }
        } else if (
          pI.paymentType === 'Sales Return' ||
          pI.paymentType === 'Purchases' ||
          pI.paymentType === 'Sales' ||
          pI.paymentType === 'Opening Balance' ||
          pI.paymentType === 'Purchases Return'
        ) {
          let amount = 0;
          if (amountToConsider >= pI.total) {
            amount = pI.total;
            amountToConsider = amountToConsider - pI.total;
          } else {
            amount = amountToConsider;
            amountToConsider = 0;
          }
          let type = '';
          switch (pI.paymentType) {
            case 'Sales Return':
              type = 'RETURNED SALE';
              break;
            case 'Sales':
              type = 'CREDIT SALE';
              break;
            case 'Purchases':
              type = 'CREDIT PURCHASE';
              break;
            case 'Purchases Return':
              type = 'RETURNED PURCHASE';
              break;
            case 'Opening Balance':
              type = 'OPENING BALANCE';
              break;
            default:
              return null;
          }
          if (paymentsMap.has(type)) {
            paymentsMap.set(type, paymentsMap.get(type) + amount);
          } else {
            paymentsMap.set(type, amount);
          }

          if (amountToConsider === 0) {
            continue;
          }
        }
      }
    }

    return paymentsMap;
  };

  const getBankPaymentSplitLedgersList = async (_data, type, paymentsMap) => {
    let listOfPaymentInData = [];
    if (type === 'Sales') {
      for (let linkedTxn of _data.linkedTxnList) {
        let tableName = '';
        switch (linkedTxn.paymentType) {
          case 'Payment In':
            tableName = 'paymentin';
            break;
          case 'Sales Return':
            tableName = 'salesreturn';
            break;
          case 'Purchases':
            tableName = 'purchases';
            break;
          case 'Opening Payable Balance':
            tableName = 'alltransactions';
            break;
          default:
            return null;
        }

        if (tableName !== null) {
          const response = await getLinkedData(linkedTxn.linkedId, tableName);
          linkedTxn.splitPaymentList = response.splitPaymentList;
          linkedTxn.bankAccount = response.bankAccount;
          if ('Payment In' === linkedTxn.paymentType) {
            linkedTxn.paymentType = response.paymentType;
            linkedTxn.total = response.total;
          } else if ('Sales Return' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Sales Return';
            linkedTxn.total = response.total_amount;
          } else if ('Purchases' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Purchases';
            linkedTxn.total = response.total_amount;
          } else if ('Opening Payable Balance' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Opening Balance';
            linkedTxn.total = response.amount;
          }

          listOfPaymentInData.push(linkedTxn);
        }
      }
    } else if (type === 'Sales Return') {
      for (let linkedTxn of _data.linkedTxnList) {
        console.log('Sales Return linked transaction', linkedTxn);
        let tableName = '';
        switch (linkedTxn.paymentType) {
          case 'Payment Out':
            tableName = 'paymentout';
            break;
          case 'Sales':
            tableName = 'sales';
            break;
          case 'Purchases Return':
            tableName = 'purchasesreturn';
            break;
          case 'Opening Receivable Balance':
            tableName = 'alltransactions';
            break;
          default:
            return null;
        }

        if (tableName !== null) {
          const response = await getLinkedData(linkedTxn.linkedId, tableName);
          linkedTxn.splitPaymentList = response.splitPaymentList;
          linkedTxn.bankAccount = response.bankAccount;
          if ('Payment Out' === linkedTxn.paymentType) {
            linkedTxn.paymentType = response.paymentType;
            linkedTxn.total = response.total;
          } else if ('Sales' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Sales';
            linkedTxn.total = response.total_amount;
          } else if ('Purchases Return' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Purchases Return';
            linkedTxn.total = response.total_amount;
          } else if ('Opening Receivable Balance' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Opening Balance';
            linkedTxn.total = response.amount;
          }

          listOfPaymentInData.push(linkedTxn);
        }
      }
    } else if (type === 'Purchases') {
      for (let linkedTxn of _data.linkedTxnList) {
        let tableName = '';
        switch (linkedTxn.paymentType) {
          case 'Payment Out':
            tableName = 'paymentout';
            break;
          case 'Sales':
            tableName = 'sales';
            break;
          case 'Purchases Return':
            tableName = 'purchasesreturn';
            break;
          case 'Opening Receivable Balance':
            tableName = 'alltransactions';
            break;
          default:
            return null;
        }

        if (tableName !== null) {
          const response = await getLinkedData(linkedTxn.linkedId, tableName);
          linkedTxn.splitPaymentList = response.splitPaymentList;
          linkedTxn.bankAccount = response.bankAccount;
          if ('Payment Out' === linkedTxn.paymentType) {
            linkedTxn.paymentType = response.paymentType;
            linkedTxn.total = response.total;
          } else if ('Sales' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Sales';
            linkedTxn.total = response.total_amount;
          } else if ('Purchases Return' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Purchases Return';
            linkedTxn.total = response.total_amount;
          } else if ('Opening Receivable Balance' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Opening Balance';
            linkedTxn.total = response.amount;
          }

          listOfPaymentInData.push(linkedTxn);
        }
      }
    } else if (type === 'Purchases Return') {
      for (let linkedTxn of _data.linkedTxnList) {
        let tableName = '';
        switch (linkedTxn.paymentType) {
          case 'Payment In':
            tableName = 'paymentin';
            break;
          case 'Sales Return':
            tableName = 'salesreturn';
            break;
          case 'Purchases':
            tableName = 'purchases';
            break;
          case 'Opening Payable Balance':
            tableName = 'alltransactions';
            break;
          default:
            return null;
        }

        if (tableName !== null) {
          const response = await getLinkedData(linkedTxn.linkedId, tableName);
          linkedTxn.splitPaymentList = response.splitPaymentList;
          linkedTxn.bankAccount = response.bankAccount;
          if ('Payment In' === linkedTxn.paymentType) {
            linkedTxn.paymentType = response.paymentType;
            linkedTxn.total = response.total;
          } else if ('Sales Return' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Sales Return';
            linkedTxn.total = response.total_amount;
          } else if ('Purchases' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Purchases';
            linkedTxn.total = response.total_amount;
          } else if ('Opening Payable Balance' === linkedTxn.paymentType) {
            linkedTxn.paymentType = 'Opening Balance';
            linkedTxn.total = response.amount;
          }

          listOfPaymentInData.push(linkedTxn);
        }
      }
    }

    if (_data.payment_type === 'Split') {
      for (let payment of _data.splitPaymentList) {
        if (payment.amount > 0 && payment.paymentType === 'Cash') {
          paymentsMap.set('CASH', payment.amount);
        }
        if (payment.amount > 0 && payment.paymentType === 'Gift Card') {
          paymentsMap.set('GIFT CARD', payment.amount);
        }
        if (payment.amount > 0 && payment.paymentType === 'Custom Finance') {
          paymentsMap.set('CUSTOM FINANCE', payment.amount);
        }

        if (
          payment.paymentMode === 'UPI' ||
          payment.paymentMode === 'Internet Banking' ||
          payment.paymentMode === 'Credit Card' ||
          payment.paymentMode === 'Debit Card' ||
          payment.paymentMode === 'Cheque'
        ) {
          let mode = '';
          switch (payment.paymentMode) {
            case 'UPI':
              mode = 'UPI';
              break;
            case 'Internet Banking':
              mode = 'NEFT/RTGS';
              break;
            case 'Credit Card':
              mode = 'CREDIT CARD';
              break;
            case 'Debit Card':
              mode = 'DEBIT CARD';
              break;
            case 'Cheque':
              mode = 'CHEQUE';
              break;
            default:
              return '';
          }

          if (paymentsMap.has(payment.accountDisplayName)) {
            paymentsMap.set(
              payment.accountDisplayName,
              paymentsMap.get(payment.accountDisplayName) + payment.amount
            );
          } else {
            paymentsMap.set(payment.accountDisplayName, payment.amount);
          }
        }
      }
    } else if (_data.payment_type === 'cash' || _data.payment_type === 'Cash') {
      paymentsMap.set('CASH', _data.total_amount);
    } else if (_data.payment_type === 'upi') {
      paymentsMap.set(_data.bankAccount, _data.total_amount);
    } else if (_data.payment_type === 'internetbanking') {
      paymentsMap.set(_data.bankAccount, _data.total_amount);
    } else if (_data.payment_type === 'cheque') {
      paymentsMap.set(_data.bankAccount, _data.total_amount);
    } else if (_data.payment_type === 'creditcard') {
      paymentsMap.set(_data.bankAccount, _data.total_amount);
    } else if (_data.payment_type === 'debitcard') {
      paymentsMap.set(_data.bankAccount, _data.total_amount);
    } else if (_data.payment_type === 'Credit') {
      for (let pI of listOfPaymentInData) {
        let amountToConsider = pI.linkedAmount;
        if (pI.paymentType === 'Split') {
          for (let payment of pI.splitPaymentList) {
            let amount = 0;
            if (amountToConsider >= payment.amount) {
              amount = payment.amount;
              amountToConsider = amountToConsider - payment.amount;
            } else {
              amount = amountToConsider;
              amountToConsider = 0;
            }
            if (payment.amount > 0 && payment.paymentType === 'Cash') {
              if (paymentsMap.has('CASH')) {
                paymentsMap.set('CASH', paymentsMap.get('CASH') + amount);
              } else {
                paymentsMap.set('CASH', amount);
              }
            }
            if (payment.amount > 0 && payment.paymentType === 'Gift Card') {
              if (paymentsMap.has('GIFT CARD')) {
                paymentsMap.set(
                  'GIFT CARD',
                  paymentsMap.get('GIFT CARD') + amount
                );
              } else {
                paymentsMap.set('GIFT CARD', amount);
              }
            }
            if (
              payment.amount > 0 &&
              payment.paymentType === 'Custom Finance'
            ) {
              if (paymentsMap.has('CUSTOM FINANCE')) {
                paymentsMap.set(
                  'CUSTOM FINANCE',
                  paymentsMap.get('CUSTOM FINANCE') + amount
                );
              } else {
                paymentsMap.set('CUSTOM FINANCE', amount);
              }
            }

            if (
              payment.paymentMode === 'UPI' ||
              payment.paymentMode === 'Internet Banking' ||
              payment.paymentMode === 'Credit Card' ||
              payment.paymentMode === 'Debit Card' ||
              payment.paymentMode === 'Cheque'
            ) {
              let mode = '';
              switch (payment.paymentMode) {
                case 'UPI':
                  mode = 'UPI';
                  break;
                case 'Internet Banking':
                  mode = 'NEFT/RTGS';
                  break;
                case 'Credit Card':
                  mode = 'CREDIT CARD';
                  break;
                case 'Debit Card':
                  mode = 'DEBIT CARD';
                  break;
                case 'Cheque':
                  mode = 'CHEQUE';
                  break;
                default:
                  return '';
              }
              if (paymentsMap.has(payment.accountDisplayName)) {
                paymentsMap.set(
                  payment.accountDisplayName,
                  paymentsMap.get(payment.accountDisplayName) + amount
                );
              } else {
                paymentsMap.set(payment.accountDisplayName, amount);
              }
            }

            if (amountToConsider === 0) {
              continue;
            }
          }
        } else if (pI.paymentType === 'cash' || pI.paymentType === 'Cash') {
          let amount = 0;
          if (amountToConsider >= pI.total) {
            amount = pI.total;
            amountToConsider = amountToConsider - pI.total;
          } else {
            amount = amountToConsider;
            amountToConsider = 0;
          }
          if (paymentsMap.has('CASH')) {
            paymentsMap.set('CASH', paymentsMap.get('CASH') + amount);
          } else {
            paymentsMap.set('CASH', amount);
          }

          if (amountToConsider === 0) {
            continue;
          }
        } else if (pI.paymentType === 'upi') {
          let amount = 0;
          if (amountToConsider >= pI.total) {
            amount = pI.total;
            amountToConsider = amountToConsider - pI.total;
          } else {
            amount = amountToConsider;
            amountToConsider = 0;
          }
          if (paymentsMap.has(pI.bankAccount)) {
            paymentsMap.set(
              pI.bankAccount,
              paymentsMap.get(pI.bankAccount) + amount
            );
          } else {
            paymentsMap.set(pI.bankAccount, amount);
          }

          if (amountToConsider === 0) {
            continue;
          }
        } else if (pI.paymentType === 'internetbanking') {
          let amount = 0;
          if (amountToConsider >= pI.total) {
            amount = pI.total;
            amountToConsider = amountToConsider - pI.total;
          } else {
            amount = amountToConsider;
            amountToConsider = 0;
          }
          if (paymentsMap.has(pI.bankAccount)) {
            paymentsMap.set(
              pI.bankAccount,
              paymentsMap.get(pI.bankAccount) + amount
            );
          } else {
            paymentsMap.set(pI.bankAccount, amount);
          }

          if (amountToConsider === 0) {
            continue;
          }
        } else if (pI.paymentType === 'cheque') {
          let amount = 0;
          if (amountToConsider >= pI.total) {
            amount = pI.total;
            amountToConsider = amountToConsider - pI.total;
          } else {
            amount = amountToConsider;
            amountToConsider = 0;
          }
          if (paymentsMap.has(pI.bankAccount)) {
            paymentsMap.set(
              pI.bankAccount,
              paymentsMap.get(pI.bankAccount) + amount
            );
          } else {
            paymentsMap.set(pI.bankAccount, amount);
          }

          if (amountToConsider === 0) {
            continue;
          }
        } else if (pI.paymentType === 'creditcard') {
          let amount = 0;
          if (amountToConsider >= pI.total) {
            amount = pI.total;
            amountToConsider = amountToConsider - pI.total;
          } else {
            amount = amountToConsider;
            amountToConsider = 0;
          }
          if (paymentsMap.has(pI.bankAccount)) {
            paymentsMap.set(
              pI.bankAccount,
              paymentsMap.get(pI.bankAccount) + amount
            );
          } else {
            paymentsMap.set(pI.bankAccount, amount);
          }

          if (amountToConsider === 0) {
            continue;
          }
        } else if (pI.paymentType === 'debitcard') {
          let amount = 0;
          if (amountToConsider >= pI.total) {
            amount = pI.total;
            amountToConsider = amountToConsider - pI.total;
          } else {
            amount = amountToConsider;
            amountToConsider = 0;
          }
          if (paymentsMap.has(pI.bankAccount)) {
            paymentsMap.set(
              pI.bankAccount,
              paymentsMap.get(pI.bankAccount) + amount
            );
          } else {
            paymentsMap.set(pI.bankAccount, amount);
          }

          if (amountToConsider === 0) {
            continue;
          }
        } else if (
          pI.paymentType === 'Sales Return' ||
          pI.paymentType === 'Purchases' ||
          pI.paymentType === 'Sales' ||
          pI.paymentType === 'Opening Balance' ||
          pI.paymentType === 'Purchases Return'
        ) {
          let amount = 0;
          if (amountToConsider >= pI.total) {
            amount = pI.total;
            amountToConsider = amountToConsider - pI.total;
          } else {
            amount = amountToConsider;
            amountToConsider = 0;
          }
          let type = '';
          switch (pI.paymentType) {
            case 'Sales Return':
              type = 'RETURNED SALE';
              break;
            case 'Sales':
              type = 'CREDIT SALE';
              break;
            case 'Purchases':
              type = 'CREDIT PURCHASE';
              break;
            case 'Purchases Return':
              type = 'RETURNED PURCHASE';
              break;
            case 'Opening Balance':
              type = 'OPENING BALANCE';
              break;
            default:
              return null;
          }
          if (paymentsMap.has(type)) {
            paymentsMap.set(type, paymentsMap.get(type) + amount);
          } else {
            paymentsMap.set(type, amount);
          }

          if (amountToConsider === 0) {
            continue;
          }
        }
      }
    }

    return paymentsMap;
  };

  const getExpensePaymentSplitLedgersList = async (_data, paymentsMap) => {
    if (_data.paymentType === 'Split') {
      for (let payment of _data.splitPaymentList) {
        if (payment.amount > 0 && payment.paymentType === 'Cash') {
          paymentsMap.set('CASH', payment.amount);
        }
        if (payment.amount > 0 && payment.paymentType === 'Gift Card') {
          paymentsMap.set('GIFT CARD', payment.amount);
        }
        if (payment.amount > 0 && payment.paymentType === 'Custom Finance') {
          paymentsMap.set('CUSTOM FINANCE', payment.amount);
        }

        if (
          payment.paymentMode === 'UPI' ||
          payment.paymentMode === 'Internet Banking' ||
          payment.paymentMode === 'Credit Card' ||
          payment.paymentMode === 'Debit Card' ||
          payment.paymentMode === 'Cheque'
        ) {
          let mode = '';
          switch (payment.paymentMode) {
            case 'UPI':
              mode = 'UPI';
              break;
            case 'Internet Banking':
              mode = 'NEFT/RTGS';
              break;
            case 'Credit Card':
              mode = 'CREDIT CARD';
              break;
            case 'Debit Card':
              mode = 'DEBIT CARD';
              break;
            case 'Cheque':
              mode = 'CHEQUE';
              break;
            default:
              return '';
          }

          if (paymentsMap.has(payment.accountDisplayName)) {
            paymentsMap.set(
              payment.accountDisplayName,
              paymentsMap.get(payment.accountDisplayName) + payment.amount
            );
          } else {
            paymentsMap.set(payment.accountDisplayName, payment.amount);
          }
        }
      }
    } else if (_data.paymentType === 'cash' || _data.paymentType === 'Cash') {
      paymentsMap.set('CASH', _data.total);
    } else if (_data.paymentType === 'upi') {
      paymentsMap.set(_data.bankAccount, _data.total);
    } else if (_data.paymentType === 'internetbanking') {
      paymentsMap.set(_data.bankAccount, _data.total);
    } else if (_data.paymentType === 'cheque') {
      paymentsMap.set(_data.bankAccount, _data.total);
    } else if (_data.paymentType === 'creditcard') {
      paymentsMap.set(_data.bankAccount, _data.total);
    } else if (_data.paymentType === 'debitcard') {
      paymentsMap.set(_data.bankAccount, _data.total);
    }

    return paymentsMap;
  };

  const getLinkedData = async (id, table) => {
    const db = await Db.get();
    const businessId = localStorage.getItem('businessId');

    let response = {};

    if (table === 'paymentin' || table === 'paymentout') {
      await db[table]
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessId } },
              { receiptNumber: { $eq: id } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    } else if (table === 'salesreturn') {
      await db[table]
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessId } },
              { sales_return_number: { $eq: id } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    } else if (table === 'sales') {
      await db[table]
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessId } },
              { invoice_number: { $eq: id } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    } else if (table === 'purchases') {
      await db[table]
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessId } },
              { bill_number: { $eq: id } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    } else if (table === 'purchasesreturn') {
      await db[table]
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessId } },
              { purchase_return_number: { $eq: id } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    } else if (table === 'alltransactions') {
      await db[table]
        .findOne({
          selector: {
            $and: [{ businessId: { $eq: businessId } }, { id: { $eq: id } }]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    }

    return response;
  };

  return (
    <div style={{ marginTop: '16px', marginBottom: '10px' }}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <DateRangePicker
            style={{ marginTop: 20 }}
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
              setDataLoaded(false);
              setCurrentPage(1);
              setTotalPages(1);
              setTotalRecords([]);
              setAllTrnasactionsDataForPagination(0);
              setOnChange(true);
            }}
          />
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}>
          <Controls.Button
            text="DOWNLOAD XML"
            size="medium"
            variant="contained"
            color="primary"
            className={classes.newButton}
            onClick={() => {
              setMessage(
                'We will mark the downloaded transactions as Pushed to Tally. Please proceed to download.'
              );
              setOpenErrorMesssageDialog(true);
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <Controls.Button
            text="AUTO PUSH TO TALLY"
            size="medium"
            variant="contained"
            color="primary"
            className={classes.newButton}
            onClick={() =>
              //pushToTally()
              setOpenReleasingDialog(true)
            }
          />
        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        spacing={2}
        className={classes.sectionHeader}
        style={{
          display: 'flex',
          marginLeft: '15px',
          justifyContent: 'space-between',
          marginBottom: '10px',
          marginTop: '10px'
        }}
      >
        <FormControl>
          <Grid item style={{ width: '100%' }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="sales"
                  defaultChecked="true"
                  onChange={(event) => {
                    setSalesChecked(event.target.checked);
                    setDataLoaded(false);
                    setCurrentPage(1);
                    setTotalPages(1);
                    setTotalRecords([]);
                    setAllTrnasactionsDataForPagination(0);
                    setOnChange(true);
                  }}
                />
              }
              label="Sales"
              size="small"
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="salesReturn"
                  defaultChecked="true"
                  onChange={(event) => {
                    setSalesReturnChecked(event.target.checked);
                    setDataLoaded(false);
                    setCurrentPage(1);
                    setTotalPages(1);
                    setTotalRecords([]);
                    setAllTrnasactionsDataForPagination(0);
                    setOnChange(true);
                  }}
                />
              }
              label="Sales Return"
              size="small"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="purchase"
                  defaultChecked="true"
                  onChange={(event) => {
                    setPurchaseChecked(event.target.checked);
                    setDataLoaded(false);
                    setCurrentPage(1);
                    setTotalPages(1);
                    setTotalRecords([]);
                    setAllTrnasactionsDataForPagination(0);
                    setOnChange(true);
                  }}
                />
              }
              label="Purchase"
              size="small"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="purchaseReturn"
                  defaultChecked="true"
                  onChange={(event) => {
                    setPurchaseReturnChecked(event.target.checked);
                    setDataLoaded(false);
                    setCurrentPage(1);
                    setTotalPages(1);
                    setTotalRecords([]);
                    setAllTrnasactionsDataForPagination(0);
                    setOnChange(true);
                  }}
                />
              }
              label="Purchase Return"
              size="small"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="expense"
                  defaultChecked="true"
                  onChange={(event) => {
                    setExpenseChecked(event.target.checked);
                    setDataLoaded(false);
                    setCurrentPage(1);
                    setTotalPages(1);
                    setTotalRecords([]);
                    setAllTrnasactionsDataForPagination(0);
                    setOnChange(true);
                  }}
                />
              }
              label="Expense"
              size="small"
            />

            <Controls.Input
              placeholder="Search Transaction"
              size="medium"
              style={{ marginLeft: '16px', width: '300px' }}
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

            {/* <Controls.Button
              text="RESET ALL TALLY PUSHED STATUS"
              size="medium"
              variant="contained"
              className={classes.newButton}
              onClick={() => {
                markBulkTallyPushStatus(false);
              }}
            /> */}
          </Grid>
        </FormControl>
      </Grid>

      <div
        id="sales-return-grid"
        style={{ width: '100%', height: height - 265 + 'px' }}
        className=" blue-theme"
      >
        <div
          style={{ height: '95%', width: '100%' }}
          className="ag-theme-material"
        >
          <AgGridReact
            onGridReady={onGridReady}
            paginationPageSize={30}
            suppressMenuHide={true}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows="true"
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

      <Dialog
        fullScreen={fullScreen}
        open={openMesssageDialog}
        onClose={handleMessageAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{messsage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(event) => {
              generateXML();
            }}
            color="primary"
            autoFocus
          >
            OK
          </Button>
          <Button onClick={handleMessageAlertClose} color="primary" autoFocus>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openReleasingDialog}
        onClose={handleReleasingAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            {
              'Releasing shortly. Please use Download XML feature to import data to Tally'
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReleasingAlertClose} color="primary" autoFocus>
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
                <p>{loadingAlertMessage}</p>
              </div>
              <div>
                <br />
                <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default TallyVoucher;