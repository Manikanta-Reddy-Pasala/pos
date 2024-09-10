import React, { useState, useEffect } from 'react';
import {
  Paper,
  makeStyles,
  InputAdornment,
  IconButton,
  Grid,
  Typography,
  Avatar,
  Card
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from '../../../../components/controls/index';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import dateFormat from 'dateformat';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { AgGridReact } from 'ag-grid-react';
import TextField from '@material-ui/core/TextField';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import useWindowDimensions from '../../../../components/windowDimension';
import * as moment from 'moment';
import * as Db from '../../../../RxDb/Database/Database';
import { toJS } from 'mobx';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import ProductModal from 'src/components/modal/ProductModal';
import AddPurchase from 'src/views/purchases/PurchaseBill/AddPurchase';

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

const AuditorPurchasesReport = (props) => {
  const classes = useStyles();
  const headerClasses = useHeaderStyles();
  const { height } = useWindowDimensions();
  const [custSub] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const store = useStore();
  const { getTransactionData } = store.TransactionStore;

  const { viewOrEditItem } = store.PurchasesAddStore;
  const { OpenAddPurchaseBill } = toJS(store.PurchasesAddStore);

  const { productDialogOpen } = toJS(store.ProductStore);
  const { getAuditSettingsData } = store.AuditSettingsStore;
  const { auditSettings } = toJS(store.AuditSettingsStore);

  const [columnDefs, setColumnDefs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await getAuditSettingsData();
      setColumnDefs(getColumnDefs());
    }

    fetchData();
  }, []);

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
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

  function dueDateFormatter(params) {
    var dateAsString = params.data.dueDate;
    if (dateAsString !== '' && dateAsString !== null) {
      var dateParts = dateAsString.split('-');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    } else {
      return '';
    }
  }

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

  const handleCellClicked = (event) => {
    const colId = event.column.getId();

    if ('vendor_bill_number' === colId) {
      viewOrEditItem(event.data);
    }
  };

  function getColumnDefs() {
    let columnDefs = [];
    setColumnDefs(columnDefs);

    const invoiceNo = {
      headerName: 'BILL NO',
      field: 'vendor_bill_number',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    };

    const supplierInvoiceNo = {
      headerName: 'SUPPLIER BILL NO',
      field: 'vendor_bill_number',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const date = {
      headerName: 'DATE',
      field: 'bill_date',
      valueFormatter: dateFormatter,
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
      }
    };

    const dueDate = {
      headerName: 'DUE DATE',
      field: 'dueDate',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: dueDateFormatter
    };

    const gstin = {
      headerName: 'GSTIN/UIN',
      field: 'vendor_gst_number',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const customerName = {
      headerName: 'Supplier Name',
      field: 'vendor_name',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>SUPPLIER</p>
            <p>NAME</p>
          </div>
        );
      }
    };

    const invoiceValue = {
      field: 'total_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TOTAL</p>
            <p>VALUE</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = parseFloat(data['total_amount']).toFixed(2);
        return result;
      }
    };

    const transportationValue = {
      field: 'shipping_charge',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TRANSPORTATION</p>
            <p>CHARGE</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = parseFloat(data['shipping_charge']).toFixed(2);
        return result;
      }
    };

    const roundOff = {
      field: 'round_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>ROUND</p>
            <p>OFF</p>
          </div>
        );
      }
    };

    const balanceDue = {
      // headerName: 'BALANCE DUE',
      field: 'balance_amount',
      width: 90,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>BALANCE</p>
            <p>DUE</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const totalDiscount = {
      headerName: 'Total Discount',
      field: 'total_discount',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;
        let itemsList = data['item_list'];

        for (let item of itemsList) {
          result += parseFloat(item.discount_amount || 0);
        }

        return parseFloat(result).toFixed(2);
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TOTAL</p>
            <p>DISCOUNT</p>
          </div>
        );
      }
    };

    const gstTaxableZero = {
      field: 'taxable_zero',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST %</p>
            <p>TAXABLE</p>
          </div>
        );
      }
    };

    const gstSgstZero = {
      field: 'sgst_amount_zero',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST %</p>
            <p>SGST</p>
          </div>
        );
      }
    };

    const gstCgstZero = {
      field: 'cgst_amount_zero',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST %</p>
            <p>CGST</p>
          </div>
        );
      }
    };

    const gstIgstZero = {
      field: 'igst_amount_zero',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST %</p>
            <p>IGST</p>
          </div>
        );
      }
    };

    const gstTaxableThree = {
      field: 'taxable_three',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 3%</p>
            <p>TAXABLE</p>
          </div>
        );
      }
    };

    const gstSgstThree = {
      field: 'sgst_amount_three',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 1.5%</p>
            <p>SGST</p>
          </div>
        );
      }
    };

    const gstCgstThree = {
      field: 'cgst_amount_three',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 1.5%</p>
            <p>CGST</p>
          </div>
        );
      }
    };

    const gstIgstThree = {
      field: 'igst_amount_three',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 3%</p>
            <p>IGST</p>
          </div>
        );
      }
    };

    const gstTaxablefive = {
      field: 'taxable_five',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 5%</p>
            <p>TAXABLE</p>
          </div>
        );
      }
    };

    const gstSgstFive = {
      field: 'sgst_amount_five',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 2.5%</p>
            <p>SGST</p>
          </div>
        );
      }
    };

    const gstCgstFive = {
      field: 'cgst_amount_five',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 2.5%</p>
            <p>CGST</p>
          </div>
        );
      }
    };

    const gstIgstFive = {
      field: 'igst_amount_five',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 5%</p>
            <p>IGST</p>
          </div>
        );
      }
    };

    const gstTaxableTwelve = {
      field: 'taxable_twelve',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 12%</p>
            <p>TAXABLE</p>
          </div>
        );
      }
    };

    const gstSgstTwelve = {
      field: 'sgst_amount_twelve',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 6%</p>
            <p>SGST</p>
          </div>
        );
      }
    };

    const gstCgstTwelve = {
      field: 'cgst_amount_twelve',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 6%</p>
            <p>CGST</p>
          </div>
        );
      }
    };

    const gstIgstTwelve = {
      field: 'igst_amount_twelve',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 12%</p>
            <p>IGST</p>
          </div>
        );
      }
    };

    const gstTaxableEighteen = {
      field: 'taxable_eighteen',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 18%</p>
            <p>TAXABLE</p>
          </div>
        );
      }
    };

    const gstSgstEighteen = {
      field: 'sgst_amount_eighteen',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 9%</p>
            <p>SGST</p>
          </div>
        );
      }
    };

    const gstCgstEighteen = {
      field: 'cgst_amount_eighteen',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 9%</p>
            <p>CGST</p>
          </div>
        );
      }
    };

    const gstIgstEighteen = {
      field: 'igst_amount_eighteen',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 18%</p>
            <p>IGST</p>
          </div>
        );
      }
    };

    const gstTaxableTwentyEight = {
      field: 'taxable_twenty_eight',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 28%</p>
            <p>TAXABLE</p>
          </div>
        );
      }
    };

    const gstSgstTwentyEight = {
      field: 'sgst_amount_twenty_eight',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 14%</p>
            <p>SGST</p>
          </div>
        );
      }
    };

    const gstCgstTwentyEight = {
      field: 'cgst_amount_twenty_eight',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 14%</p>
            <p>CGST</p>
          </div>
        );
      }
    };

    const gstIgstTwentyEight = {
      field: 'igst_amount_twenty_eight',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GST 28%</p>
            <p>IGST</p>
          </div>
        );
      }
    };

    const cash = {
      headerName: 'CASH',
      field: 'cash',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const upi = {
      headerName: 'UPI',
      field: 'upi',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const card = {
      headerName: 'CARD',
      field: 'card',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const neftOrRtgs = {
      field: 'netBanking',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>NEFT/</p>
            <p>RTGS</p>
          </div>
        );
      }
    };

    const cheque = {
      headerName: 'CHEQUE',
      field: 'cheque',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    columnDefs.push(invoiceNo);
    columnDefs.push(date);
    columnDefs.push(customerName);
    columnDefs.push(gstin);
    columnDefs.push(invoiceValue);
    columnDefs.push(transportationValue);

    // To add dynamic GST data
    if (
      auditSettings &&
      auditSettings.taxApplicability &&
      auditSettings.taxApplicability.length > 0
    ) {
      if (auditSettings.taxApplicability.includes(0)) {
        columnDefs.push(gstTaxableZero);
        columnDefs.push(gstSgstZero);
        columnDefs.push(gstCgstZero);
        columnDefs.push(gstIgstZero);
      }

      if (auditSettings.taxApplicability.includes(3)) {
        columnDefs.push(gstTaxableThree);
        columnDefs.push(gstSgstThree);
        columnDefs.push(gstCgstThree);
        columnDefs.push(gstIgstThree);
      }

      if (auditSettings.taxApplicability.includes(5)) {
        columnDefs.push(gstTaxablefive);
        columnDefs.push(gstSgstFive);
        columnDefs.push(gstCgstFive);
        columnDefs.push(gstIgstFive);
      }

      if (auditSettings.taxApplicability.includes(12)) {
        columnDefs.push(gstTaxableTwelve);
        columnDefs.push(gstSgstTwelve);
        columnDefs.push(gstCgstTwelve);
        columnDefs.push(gstIgstTwelve);
      }

      if (auditSettings.taxApplicability.includes(18)) {
        columnDefs.push(gstTaxableEighteen);
        columnDefs.push(gstSgstEighteen);
        columnDefs.push(gstCgstEighteen);
        columnDefs.push(gstIgstEighteen);
      }

      if (auditSettings.taxApplicability.includes(28)) {
        columnDefs.push(gstTaxableTwentyEight);
        columnDefs.push(gstSgstTwentyEight);
        columnDefs.push(gstCgstTwentyEight);
        columnDefs.push(gstIgstTwentyEight);
      }
    }

    columnDefs.push(roundOff);
    columnDefs.push(cash);
    columnDefs.push(upi);
    columnDefs.push(card);
    columnDefs.push(neftOrRtgs);
    columnDefs.push(cheque);
    columnDefs.push(totalDiscount);
    columnDefs.push(balanceDue);
    columnDefs.push(dueDate);

    return columnDefs;
  }

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  function formatDownloadExcelDate(dateAsString) {
    if (dateAsString !== '' && dateAsString !== null) {
      var dateParts = dateAsString.split('-');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    } else {
      return '';
    }
  }

  const getDataFromPurchases = async () => {
    const wb = new Workbook();

    const xlsxData = await getPurchaseDataByDatexlsx(fromDate, toDate);

    let data = [];
    if (xlsxData && xlsxData.length > 0) {
      for (let i = 0; i < xlsxData.length; i++) {
        let record = {};

        record['BILL NO'] = xlsxData[i].vendor_bill_number;
        //record['SUPPLIER BILL NO'] = xlsxData[i].vendor_bill_number;
        record['DATE'] = formatDownloadExcelDate(xlsxData[i].bill_date);
        record['SUPPLIER NAME'] = xlsxData[i].vendor_name;
        record['GSTIN/UIN'] = xlsxData[i].vendor_gst_number;
        record['TOTAL VALUE'] = xlsxData[i].total_amount;
        record['TRANSPORTATION CHARGE'] = xlsxData[i].shipping_charge;

        // To add dynamic GST data
        if (
          auditSettings &&
          auditSettings.taxApplicability &&
          auditSettings.taxApplicability.length > 0
        ) {
          if (auditSettings.taxApplicability.includes(0)) {
            record['GST % - TAXABLE'] = xlsxData[i].taxable_zero;
            record['GST % - SGST'] = xlsxData[i].sgst_amount_zero;
            record['GST % - CGST'] = xlsxData[i].cgst_amount_zero;
            record['GST % - IGST'] = xlsxData[i].igst_amount_zero;
          }

          if (auditSettings.taxApplicability.includes(3)) {
            record['GST 3% - TAXABLE'] = xlsxData[i].taxable_three;
            record['GST 1.5% - SGST'] = xlsxData[i].sgst_amount_three;
            record['GST 1.5% - CGST'] = xlsxData[i].cgst_amount_three;
            record['GST 3% - IGST'] = xlsxData[i].igst_amount_three;
          }

          if (auditSettings.taxApplicability.includes(5)) {
            record['GST 5% - TAXABLE'] = xlsxData[i].taxable_five;
            record['GST 2.5% - SGST'] = xlsxData[i].sgst_amount_five;
            record['GST 2.5% - CGST'] = xlsxData[i].cgst_amount_five;
            record['GST 5% - IGST'] = xlsxData[i].igst_amount_five;
          }

          if (auditSettings.taxApplicability.includes(12)) {
            record['GST 12% - TAXABLE'] = xlsxData[i].taxable_twelve;
            record['GST 6% - SGST'] = xlsxData[i].sgst_amount_twelve;
            record['GST 6% - CGST'] = xlsxData[i].cgst_amount_twelve;
            record['GST 12% - IGST'] = xlsxData[i].igst_amount_twelve;
          }

          if (auditSettings.taxApplicability.includes(18)) {
            record['GST 18% - TAXABLE'] = xlsxData[i].taxable_eighteen;
            record['GST 9% - SGST'] = xlsxData[i].sgst_amount_eighteen;
            record['GST 9% - CGST'] = xlsxData[i].cgst_amount_eighteen;
            record['GST 18% - IGST'] = xlsxData[i].igst_amount_eighteen;
          }

          if (auditSettings.taxApplicability.includes(28)) {
            record['GST 28% - TAXABLE'] = xlsxData[i].taxable_twenty_eight;
            record['GST 14% - SGST'] = xlsxData[i].sgst_amount_twenty_eight;
            record['GST 14% - CGST'] = xlsxData[i].cgst_amount_twenty_eight;
            record['GST 28% - IGST'] = xlsxData[i].igst_amount_twenty_eight;
          }
        }

        record['ROUND OFF'] = xlsxData[i].round_amount;

        record['CASH'] = xlsxData[i].cash;
        record['UPI'] = xlsxData[i].upi;
        record['CARD'] = xlsxData[i].card;
        record['NEFT/RTGS'] = xlsxData[i].netBanking;
        record['CHEQUE'] = xlsxData[i].cheque;
        record['BALANCE DUE'] = xlsxData[i].balance_amount;
        record['DUE DATE'] = formatDownloadExcelDate(xlsxData[i].dueDate);

        data.push(record);
      }
    } else {
      let record = {};

      record['BILL NO'] = '';
      //record['SUPPLIER BILL NO'] = '';
      record['DATE'] = '';
      record['SUPPLIER NAME'] = '';
      record['GSTIN/UIN'] = '';
      record['TOTAL VALUE'] = '';
      record['TRANSPORTATION CHARGE'] = '';

      // To add dynamic GST data
      if (
        auditSettings &&
        auditSettings.taxApplicability &&
        auditSettings.taxApplicability.length > 0
      ) {
        if (auditSettings.taxApplicability.includes(0)) {
          record['GST % - TAXABLE'] = '';
          record['GST % - SGST'] = '';
          record['GST % - CGST'] = '';
          record['GST % - IGST'] = '';
        }

        if (auditSettings.taxApplicability.includes(3)) {
          record['GST 3% - TAXABLE'] = '';
          record['GST 1.5% - SGST'] = '';
          record['GST 1.5% - CGST'] = '';
          record['GST 3% - IGST'] = '';
        }

        if (auditSettings.taxApplicability.includes(5)) {
          record['GST 3% - TAXABLE'] = '';
          record['GST 1.5% - SGST'] = '';
          record['GST 1.5% - CGST'] = '';
          record['GST 3% - IGST'] = '';
        }

        if (auditSettings.taxApplicability.includes(12)) {
          record['GST 12% - TAXABLE'] = '';
          record['GST 6% - SGST'] = '';
          record['GST 6% - CGST'] = '';
          record['GST 12% - IGST'] = '';
        }

        if (auditSettings.taxApplicability.includes(18)) {
          record['GST 18% - TAXABLE'] = '';
          record['GST 9% - SGST'] = '';
          record['GST 9% - CGST'] = '';
          record['GST 18% - IGST'] = '';
        }

        if (auditSettings.taxApplicability.includes(28)) {
          record['GST 28% - TAXABLE'] = '';
          record['GST 14% - SGST'] = '';
          record['GST 14% - CGST'] = '';
          record['GST 28% - IGST'] = '';
        }
      }

      record['ROUND OFF'] = '';
      record['CASH'] = '';
      record['UPI'] = '';
      record['CARD'] = '';
      record['NEFT/RTGS'] = '';
      record['CHEQUE'] = '';
      record['BALANCE DUE'] = '';
      record['DUE DATE'] = '';

      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('All Purchases Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['All Purchases Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'All_Purchases_Report';

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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [salesData, setSalesData] = useState([]);
  let [onChange, setOnChange] = useState(false);
  let [allSaleData, setAllSaleData] = useState({ paid: 0, unPaid: 0 });
  const [searchText, setSearchText] = useState('');

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

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      setSearchText(target);
      if (target) {
        getPurchasesSearchWithDate(target, fromDate, toDate);
      } else {
        getPurchaseDataByDate(fromDate, toDate);
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      getTransactionData();
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
      if (!businessData.posFeatures.includes('Accounting & Audit')) {
        setFeatureAvailable(false);
      }
    }
  };

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange && fromDate && toDate) {
        setOnChange(false);
        if (searchText && searchText.length > 0) {
          getPurchasesSearchWithDate(searchText, fromDate, toDate);
        } else {
          getPurchaseDataByDate(fromDate, toDate);
        }
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getPurchaseDataByDate = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setSalesData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSaleDataByDate(fromDate, toDate);
    }
    const businessData = await Bd.getBusinessData();

    let filterArray = [
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
    ];

    Query = db.purchases.find({
      selector: {
        $and: filterArray
      },
      sort: [{ bill_date: 'asc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe(async (data) => {
      if (!data) {
        return;
      }

      let response = await Promise.all(
        data.map(async (item) => {
          let _data = item.toJSON();
          let listOfPaymentInData = [];
          let paymentsMap = new Map();

          //0,3,5,12,18,28

          let taxable_zero = 0;
          let cgst_amount_zero = 0;
          let sgst_amount_zero = 0;
          let igst_amount_zero = 0;

          let taxable_three = 0;
          let cgst_amount_three = 0;
          let sgst_amount_three = 0;
          let igst_amount_three = 0;

          let taxable_five = 0;
          let cgst_amount_five = 0;
          let sgst_amount_five = 0;
          let igst_amount_five = 0;

          let taxable_twelve = 0;
          let cgst_amount_twelve = 0;
          let sgst_amount_twelve = 0;
          let igst_amount_twelve = 0;

          let taxable_eighteen = 0;
          let cgst_amount_eighteen = 0;
          let sgst_amount_eighteen = 0;
          let igst_amount_eighteen = 0;

          let taxable_twenty_eight = 0;
          let cgst_amount_twenty_eight = 0;
          let sgst_amount_twenty_eight = 0;
          let igst_amount_twenty_eight = 0;

          for (let product of _data.item_list) {
            let finalAmount =
              parseFloat(product.amount) -
              (parseFloat(product.cgst_amount) +
                parseFloat(product.sgst_amount) +
                parseFloat(product.igst_amount) +
                parseFloat(product.cess));

            if (
              parseFloat(product.cgst) +
                parseFloat(product.sgst) +
                parseFloat(product.igst) ===
              0
            ) {
              taxable_zero +=
                Math.round((finalAmount + Number.EPSILON) * 100) / 100;
              cgst_amount_zero +=
                Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
              sgst_amount_zero +=
                Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
              igst_amount_zero +=
                Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
            }

            if (
              parseFloat(product.cgst) +
                parseFloat(product.sgst) +
                parseFloat(product.igst) ===
              3
            ) {
              taxable_three +=
                Math.round((finalAmount + Number.EPSILON) * 100) / 100;
              cgst_amount_three +=
                Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
              sgst_amount_three +=
                Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
              igst_amount_three +=
                Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
            }

            if (
              parseFloat(product.cgst) +
                parseFloat(product.sgst) +
                parseFloat(product.igst) ===
              5
            ) {
              taxable_five +=
                Math.round((finalAmount + Number.EPSILON) * 100) / 100;
              cgst_amount_five +=
                Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
              sgst_amount_five +=
                Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
              igst_amount_five +=
                Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
            }

            if (
              parseFloat(product.cgst) +
                parseFloat(product.sgst) +
                parseFloat(product.igst) ===
              12
            ) {
              taxable_twelve +=
                Math.round((finalAmount + Number.EPSILON) * 100) / 100;
              cgst_amount_twelve +=
                Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
              sgst_amount_twelve +=
                Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
              igst_amount_twelve +=
                Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
            }

            if (
              parseFloat(product.cgst) +
                parseFloat(product.sgst) +
                parseFloat(product.igst) ===
              18
            ) {
              taxable_eighteen +=
                Math.round((finalAmount + Number.EPSILON) * 100) / 100;
              cgst_amount_eighteen +=
                Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
              sgst_amount_eighteen +=
                Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
              igst_amount_eighteen +=
                Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
            }

            if (
              parseFloat(product.cgst) +
                parseFloat(product.sgst) +
                parseFloat(product.igst) ===
              28
            ) {
              taxable_twenty_eight +=
                Math.round((finalAmount + Number.EPSILON) * 100) / 100;
              cgst_amount_twenty_eight +=
                Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
              sgst_amount_twenty_eight +=
                Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
              igst_amount_twenty_eight +=
                Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
            }
          }

          _data['taxable_zero'] = parseFloat(taxable_zero.toFixed(2));
          _data['cgst_amount_zero'] = parseFloat(cgst_amount_zero.toFixed(2));
          _data['sgst_amount_zero'] = parseFloat(sgst_amount_zero.toFixed(2));
          _data['igst_amount_zero'] = parseFloat(igst_amount_zero.toFixed(2));

          _data['taxable_three'] = parseFloat(taxable_three.toFixed(2));
          _data['cgst_amount_three'] = parseFloat(cgst_amount_three.toFixed(2));
          _data['sgst_amount_three'] = parseFloat(sgst_amount_three.toFixed(2));
          _data['igst_amount_three'] = parseFloat(igst_amount_three.toFixed(2));

          _data['taxable_five'] = parseFloat(taxable_five.toFixed(2));
          _data['cgst_amount_five'] = parseFloat(cgst_amount_five.toFixed(2));
          _data['sgst_amount_five'] = parseFloat(sgst_amount_five.toFixed(2));
          _data['igst_amount_five'] = parseFloat(igst_amount_five.toFixed(2));

          _data['taxable_twelve'] = parseFloat(taxable_twelve.toFixed(2));
          _data['cgst_amount_twelve'] = parseFloat(
            cgst_amount_twelve.toFixed(2)
          );
          _data['sgst_amount_twelve'] = parseFloat(
            sgst_amount_twelve.toFixed(2)
          );
          _data['igst_amount_twelve'] = parseFloat(
            igst_amount_twelve.toFixed(2)
          );

          _data['taxable_eighteen'] = parseFloat(taxable_eighteen.toFixed(2));
          _data['cgst_amount_eighteen'] = parseFloat(
            cgst_amount_eighteen.toFixed(2)
          );
          _data['sgst_amount_eighteen'] = parseFloat(
            sgst_amount_eighteen.toFixed(2)
          );
          _data['igst_amount_eighteen'] = parseFloat(
            igst_amount_eighteen.toFixed(2)
          );

          _data['taxable_twenty_eight'] = parseFloat(
            taxable_twenty_eight.toFixed(2)
          );
          _data['cgst_amount_twenty_eight'] = parseFloat(
            cgst_amount_twenty_eight.toFixed(2)
          );
          _data['sgst_amount_twenty_eight'] = parseFloat(
            sgst_amount_twenty_eight.toFixed(2)
          );
          _data['igst_amount_twenty_eight'] = parseFloat(
            igst_amount_twenty_eight.toFixed(2)
          );

          _data['creditNote'] = 0;

          if (_data.linkedTxnList) {
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
                default:
                  return null;
              }

              if (tableName !== null) {
                const response = await getLinkedData(
                  linkedTxn.linkedId,
                  tableName
                );
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
              if (
                payment.amount > 0 &&
                payment.paymentType === 'Custom Finance'
              ) {
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
          } else if (
            _data.payment_type === 'cash' ||
            _data.payment_type === 'Cash'
          ) {
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
                  if (
                    payment.amount > 0 &&
                    payment.paymentType === 'Gift Card'
                  ) {
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
              } else if (
                pI.paymentType === 'cash' ||
                pI.paymentType === 'Cash'
              ) {
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
                  paymentsMap.set(
                    'NEFT/RTGS',
                    paymentsMap.get('NEFT/RTGS') + amount
                  );
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

          _data['upi'] = 0;
          _data['netBanking'] = 0;
          _data['cheque'] = 0;
          _data['card'] = 0;
          _data['cash'] = 0;
          _data['giftCard'] = 0;
          _data['customFinance'] = 0;

          if (paymentsMap) {
            for (const [key, value] of paymentsMap.entries()) {
              if (value !== 0) {
                switch (key) {
                  case 'CASH':
                    _data['cash'] = value;
                    break;
                  case 'UPI':
                    _data['upi'] = value;
                    break;
                  case 'NEFT/RTGS':
                    _data['netBanking'] = value;
                    break;
                  case 'CHEQUE':
                    _data['cheque'] = value;
                    break;
                  case 'CREDIT CARD':
                    _data['card'] += value;
                    break;
                  case 'DEBIT CARD':
                    _data['card'] += value;
                    break;
                  case 'GIFT CARD':
                    _data['giftCard'] = value;
                    break;
                  case 'CUSTOM FINANCE':
                    _data['customFinance'] = value;
                    break;
                  case 'CREDIT SALE':
                    _data['creditNote'] = value;
                    break;
                  default:
                    break;
                }
              }
            }
          }
          return _data;
        })
      );
      setSalesData(response);
    });
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

  const getPurchaseDataByDatexlsx = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;

    const businessData = await Bd.getBusinessData();

    let filterArray = [
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
    ];

    Query = db.purchases.find({
      selector: {
        $and: filterArray
      },
      sort: [{ bill_date: 'asc' }]
    });

    let response = [];
    await Query.exec().then(async (data) => {
      if (!data) {
        return;
      }

      response = await Promise.all(
        data.map(async (item) => {
          let _data = item.toJSON();
          let listOfPaymentInData = [];
          let paymentsMap = new Map();

          //0,3,5,12,18,28

          let taxable_zero = 0;
          let cgst_amount_zero = 0;
          let sgst_amount_zero = 0;
          let igst_amount_zero = 0;

          let taxable_three = 0;
          let cgst_amount_three = 0;
          let sgst_amount_three = 0;
          let igst_amount_three = 0;

          let taxable_five = 0;
          let cgst_amount_five = 0;
          let sgst_amount_five = 0;
          let igst_amount_five = 0;

          let taxable_twelve = 0;
          let cgst_amount_twelve = 0;
          let sgst_amount_twelve = 0;
          let igst_amount_twelve = 0;

          let taxable_eighteen = 0;
          let cgst_amount_eighteen = 0;
          let sgst_amount_eighteen = 0;
          let igst_amount_eighteen = 0;

          let taxable_twenty_eight = 0;
          let cgst_amount_twenty_eight = 0;
          let sgst_amount_twenty_eight = 0;
          let igst_amount_twenty_eight = 0;

          for (let product of _data.item_list) {
            let finalAmount =
              parseFloat(product.amount) -
              (parseFloat(product.cgst_amount) +
                parseFloat(product.sgst_amount) +
                parseFloat(product.igst_amount) +
                parseFloat(product.cess));

            if (
              parseFloat(product.cgst) +
                parseFloat(product.sgst) +
                parseFloat(product.igst) ===
              0
            ) {
              taxable_zero +=
                Math.round((finalAmount + Number.EPSILON) * 100) / 100;
              cgst_amount_zero +=
                Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
              sgst_amount_zero +=
                Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
              igst_amount_zero +=
                Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
            }

            if (
              parseFloat(product.cgst) +
                parseFloat(product.sgst) +
                parseFloat(product.igst) ===
              3
            ) {
              taxable_three +=
                Math.round((finalAmount + Number.EPSILON) * 100) / 100;
              cgst_amount_three +=
                Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
              sgst_amount_three +=
                Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
              igst_amount_three +=
                Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
            }

            if (
              parseFloat(product.cgst) +
                parseFloat(product.sgst) +
                parseFloat(product.igst) ===
              5
            ) {
              taxable_five +=
                Math.round((finalAmount + Number.EPSILON) * 100) / 100;
              cgst_amount_five +=
                Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
              sgst_amount_five +=
                Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
              igst_amount_five +=
                Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
            }

            if (
              parseFloat(product.cgst) +
                parseFloat(product.sgst) +
                parseFloat(product.igst) ===
              12
            ) {
              taxable_twelve +=
                Math.round((finalAmount + Number.EPSILON) * 100) / 100;
              cgst_amount_twelve +=
                Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
              sgst_amount_twelve +=
                Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
              igst_amount_twelve +=
                Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
            }

            if (
              parseFloat(product.cgst) +
                parseFloat(product.sgst) +
                parseFloat(product.igst) ===
              18
            ) {
              taxable_eighteen +=
                Math.round((finalAmount + Number.EPSILON) * 100) / 100;
              cgst_amount_eighteen +=
                Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
              sgst_amount_eighteen +=
                Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
              igst_amount_eighteen +=
                Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
            }

            if (
              parseFloat(product.cgst) +
                parseFloat(product.sgst) +
                parseFloat(product.igst) ===
              28
            ) {
              taxable_twenty_eight +=
                Math.round((finalAmount + Number.EPSILON) * 100) / 100;
              cgst_amount_twenty_eight +=
                Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
              sgst_amount_twenty_eight +=
                Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
              igst_amount_twenty_eight +=
                Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
            }
          }

          _data['taxable_zero'] = parseFloat(taxable_zero.toFixed(2));
          _data['cgst_amount_zero'] = parseFloat(cgst_amount_zero.toFixed(2));
          _data['sgst_amount_zero'] = parseFloat(sgst_amount_zero.toFixed(2));
          _data['igst_amount_zero'] = parseFloat(igst_amount_zero.toFixed(2));

          _data['taxable_three'] = parseFloat(taxable_three.toFixed(2));
          _data['cgst_amount_three'] = parseFloat(cgst_amount_three.toFixed(2));
          _data['sgst_amount_three'] = parseFloat(sgst_amount_three.toFixed(2));
          _data['igst_amount_three'] = parseFloat(igst_amount_three.toFixed(2));

          _data['taxable_five'] = parseFloat(taxable_five.toFixed(2));
          _data['cgst_amount_five'] = parseFloat(cgst_amount_five.toFixed(2));
          _data['sgst_amount_five'] = parseFloat(sgst_amount_five.toFixed(2));
          _data['igst_amount_five'] = parseFloat(igst_amount_five.toFixed(2));

          _data['taxable_twelve'] = parseFloat(taxable_twelve.toFixed(2));
          _data['cgst_amount_twelve'] = parseFloat(
            cgst_amount_twelve.toFixed(2)
          );
          _data['sgst_amount_twelve'] = parseFloat(
            sgst_amount_twelve.toFixed(2)
          );
          _data['igst_amount_twelve'] = parseFloat(
            igst_amount_twelve.toFixed(2)
          );

          _data['taxable_eighteen'] = parseFloat(taxable_eighteen.toFixed());
          _data['cgst_amount_eighteen'] = parseFloat(
            cgst_amount_eighteen.toFixed(2)
          );
          _data['sgst_amount_eighteen'] = parseFloat(
            sgst_amount_eighteen.toFixed(2)
          );
          _data['igst_amount_eighteen'] = parseFloat(
            igst_amount_eighteen.toFixed(2)
          );

          _data['taxable_twenty_eight'] = parseFloat(
            taxable_twenty_eight.toFixed(2)
          );
          _data['cgst_amount_twenty_eight'] = parseFloat(
            cgst_amount_twenty_eight.toFixed(2)
          );
          _data['sgst_amount_twenty_eight'] = parseFloat(
            sgst_amount_twenty_eight.toFixed(2)
          );
          _data['igst_amount_twenty_eight'] = parseFloat(
            igst_amount_twenty_eight.toFixed(2)
          );

          _data['creditNote'] = 0;

          if (_data.linkedTxnList) {
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
                default:
                  return null;
              }

              if (tableName !== null) {
                const response = await getLinkedData(
                  linkedTxn.linkedId,
                  tableName
                );
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
              if (
                payment.amount > 0 &&
                payment.paymentType === 'Custom Finance'
              ) {
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
          } else if (
            _data.payment_type === 'cash' ||
            _data.payment_type === 'Cash'
          ) {
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
                  if (
                    payment.amount > 0 &&
                    payment.paymentType === 'Gift Card'
                  ) {
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
              } else if (
                pI.paymentType === 'cash' ||
                pI.paymentType === 'Cash'
              ) {
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
                  paymentsMap.set(
                    'NEFT/RTGS',
                    paymentsMap.get('NEFT/RTGS') + amount
                  );
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

          _data['upi'] = 0;
          _data['netBanking'] = 0;
          _data['cheque'] = 0;
          _data['card'] = 0;
          _data['cash'] = 0;
          _data['giftCard'] = 0;
          _data['customFinance'] = 0;

          if (paymentsMap) {
            for (const [key, value] of paymentsMap.entries()) {
              if (value !== 0) {
                switch (key) {
                  case 'CASH':
                    _data['cash'] = value;
                    break;
                  case 'UPI':
                    _data['upi'] = value;
                    break;
                  case 'NEFT/RTGS':
                    _data['netBanking'] = value;
                    break;
                  case 'CHEQUE':
                    _data['cheque'] = value;
                    break;
                  case 'CREDIT CARD':
                    _data['card'] += value;
                    break;
                  case 'DEBIT CARD':
                    _data['card'] += value;
                    break;
                  case 'GIFT CARD':
                    _data['giftCard'] = value;
                    break;
                  case 'CUSTOM FINANCE':
                    _data['customFinance'] = value;
                    break;
                  case 'CREDIT SALE':
                    _data['creditNote'] = value;
                    break;
                  default:
                    break;
                }
              }
            }
          }
          return _data;
        })
      );
    });
    return response;
  };

  const getAllSaleDataByDate = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    let filterArray = [
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
    ];

    Query = db.purchases.find({
      selector: {
        $and: filterArray
      },
      sort: [{ bill_date: 'asc' }]
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

          ++count;
          return output;
        })
        .reduce(
          (a, b) => {
            let data = toJS(b);

            a.paid = parseFloat(
              parseFloat(a.paid) +
                (parseFloat(data.total_amount) -
                  parseFloat(data.balance_amount))
            ).toFixed(2);

            a.unPaid = parseFloat(
              parseFloat(a.unPaid) + parseFloat(data.balance_amount)
            ).toFixed(2);

            return a;
          },
          {
            paid: 0,
            unPaid: 0
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

  const getPurchasesSearchWithDate = async (value, fromDate, toDate) => {
    const db = await Db.get();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    let skip = 0;
    setSalesData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSalesSearchWithDate(value, fromDate, toDate);
    }
    const businessData = await Bd.getBusinessData();

    let query = await db.purchases.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { vendor_bill_number: { $regex: regexp } },

              {
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { payment_type: { $regex: regexp } },

              {
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
                  $lte: toDate
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
                  $gte: fromDate
                }
              },
              {
                bill_date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } },

              {
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { balance_amount: { $eq: parseFloat(value) } },

              {
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
                  $lte: toDate
                }
              }
            ]
          }
        ]
      },
      sort: [{ bill_date: 'asc' }],
      skip: skip,
      limit: limit
    });

    await query.exec().then(async (data) => {
      if (!data) {
        return;
      }

      let response = await Promise.all(
        data.map(async (item) => {
          let _data = item.toJSON();
          let listOfPaymentInData = [];
          let paymentsMap = new Map();

          //0,3,5,12,18,28

          let taxable_zero = 0;
          let cgst_amount_zero = 0;
          let sgst_amount_zero = 0;
          let igst_amount_zero = 0;

          let taxable_three = 0;
          let cgst_amount_three = 0;
          let sgst_amount_three = 0;
          let igst_amount_three = 0;

          let taxable_five = 0;
          let cgst_amount_five = 0;
          let sgst_amount_five = 0;
          let igst_amount_five = 0;

          let taxable_twelve = 0;
          let cgst_amount_twelve = 0;
          let sgst_amount_twelve = 0;
          let igst_amount_twelve = 0;

          let taxable_eighteen = 0;
          let cgst_amount_eighteen = 0;
          let sgst_amount_eighteen = 0;
          let igst_amount_eighteen = 0;

          let taxable_twenty_eight = 0;
          let cgst_amount_twenty_eight = 0;
          let sgst_amount_twenty_eight = 0;
          let igst_amount_twenty_eight = 0;

          for (let product of _data.item_list) {
            let finalAmount =
              parseFloat(product.amount) -
              (parseFloat(product.cgst_amount) +
                parseFloat(product.sgst_amount) +
                parseFloat(product.igst_amount) +
                parseFloat(product.cess));

            if (
              parseFloat(product.cgst) +
                parseFloat(product.sgst) +
                parseFloat(product.igst) ===
              0
            ) {
              taxable_zero +=
                Math.round((finalAmount + Number.EPSILON) * 100) / 100;
              cgst_amount_zero +=
                Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
              sgst_amount_zero +=
                Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
              igst_amount_zero +=
                Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
            }

            if (
              parseFloat(product.cgst) +
                parseFloat(product.sgst) +
                parseFloat(product.igst) ===
              3
            ) {
              taxable_three +=
                Math.round((finalAmount + Number.EPSILON) * 100) / 100;
              cgst_amount_three +=
                Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
              sgst_amount_three +=
                Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
              igst_amount_three +=
                Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
            }

            if (
              parseFloat(product.cgst) +
                parseFloat(product.sgst) +
                parseFloat(product.igst) ===
              5
            ) {
              taxable_five +=
                Math.round((finalAmount + Number.EPSILON) * 100) / 100;
              cgst_amount_five +=
                Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
              sgst_amount_five +=
                Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
              igst_amount_five +=
                Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
            }

            if (
              parseFloat(product.cgst) +
                parseFloat(product.sgst) +
                parseFloat(product.igst) ===
              12
            ) {
              taxable_twelve +=
                Math.round((finalAmount + Number.EPSILON) * 100) / 100;
              cgst_amount_twelve +=
                Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
              sgst_amount_twelve +=
                Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
              igst_amount_twelve +=
                Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
            }

            if (
              parseFloat(product.cgst) +
                parseFloat(product.sgst) +
                parseFloat(product.igst) ===
              18
            ) {
              taxable_eighteen +=
                Math.round((finalAmount + Number.EPSILON) * 100) / 100;
              cgst_amount_eighteen +=
                Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
              sgst_amount_eighteen +=
                Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
              igst_amount_eighteen +=
                Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
            }

            if (
              parseFloat(product.cgst) +
                parseFloat(product.sgst) +
                parseFloat(product.igst) ===
              28
            ) {
              taxable_twenty_eight +=
                Math.round((finalAmount + Number.EPSILON) * 100) / 100;
              cgst_amount_twenty_eight +=
                Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
              sgst_amount_twenty_eight +=
                Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
              igst_amount_twenty_eight +=
                Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
            }
          }

          _data['taxable_zero'] = parseFloat(taxable_zero.toFixed(2));
          _data['cgst_amount_zero'] = parseFloat(cgst_amount_zero.toFixed(2));
          _data['sgst_amount_zero'] = parseFloat(sgst_amount_zero.toFixed(2));
          _data['igst_amount_zero'] = parseFloat(igst_amount_zero.toFixed(2));

          _data['taxable_three'] = parseFloat(taxable_three.toFixed(2));
          _data['cgst_amount_three'] = parseFloat(cgst_amount_three.toFixed(2));
          _data['sgst_amount_three'] = parseFloat(sgst_amount_three.toFixed(2));
          _data['igst_amount_three'] = parseFloat(igst_amount_three.toFixed(2));

          _data['taxable_five'] = parseFloat(taxable_five.toFixed(2));
          _data['cgst_amount_five'] = parseFloat(cgst_amount_five.toFixed(2));
          _data['sgst_amount_five'] = parseFloat(sgst_amount_five.toFixed(2));
          _data['igst_amount_five'] = parseFloat(igst_amount_five.toFixed(2));

          _data['taxable_twelve'] = parseFloat(taxable_twelve.toFixed(2));
          _data['cgst_amount_twelve'] = parseFloat(
            cgst_amount_twelve.toFixed(2)
          );
          _data['sgst_amount_twelve'] = parseFloat(
            sgst_amount_twelve.toFixed(2)
          );
          _data['igst_amount_twelve'] = parseFloat(
            igst_amount_twelve.toFixed(2)
          );

          _data['taxable_eighteen'] = parseFloat(taxable_eighteen.toFixed(2));
          _data['cgst_amount_eighteen'] = parseFloat(
            cgst_amount_eighteen.toFixed(2)
          );
          _data['sgst_amount_eighteen'] = parseFloat(
            sgst_amount_eighteen.toFixed(2)
          );
          _data['igst_amount_eighteen'] = parseFloat(
            igst_amount_eighteen.toFixed(2)
          );

          _data['taxable_twenty_eight'] = parseFloat(
            taxable_twenty_eight.toFixed(2)
          );
          _data['cgst_amount_twenty_eight'] = parseFloat(
            cgst_amount_twenty_eight.toFixed(2)
          );
          _data['sgst_amount_twenty_eight'] = parseFloat(
            sgst_amount_twenty_eight.toFixed(2)
          );
          _data['igst_amount_twenty_eight'] = parseFloat(
            igst_amount_twenty_eight.toFixed(2)
          );

          _data['creditNote'] = 0;

          if (_data.linkedTxnList) {
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
                default:
                  return null;
              }

              if (tableName !== null) {
                const response = await getLinkedData(
                  linkedTxn.linkedId,
                  tableName
                );
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
              if (
                payment.amount > 0 &&
                payment.paymentType === 'Custom Finance'
              ) {
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
          } else if (
            _data.payment_type === 'cash' ||
            _data.payment_type === 'Cash'
          ) {
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
                  if (
                    payment.amount > 0 &&
                    payment.paymentType === 'Gift Card'
                  ) {
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
              } else if (
                pI.paymentType === 'cash' ||
                pI.paymentType === 'Cash'
              ) {
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
                  paymentsMap.set(
                    'NEFT/RTGS',
                    paymentsMap.get('NEFT/RTGS') + amount
                  );
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

          _data['upi'] = 0;
          _data['netBanking'] = 0;
          _data['cheque'] = 0;
          _data['card'] = 0;
          _data['cash'] = 0;
          _data['giftCard'] = 0;
          _data['customFinance'] = 0;

          if (paymentsMap) {
            for (const [key, value] of paymentsMap.entries()) {
              if (value !== 0) {
                switch (key) {
                  case 'CASH':
                    _data['cash'] = value;
                    break;
                  case 'UPI':
                    _data['upi'] = value;
                    break;
                  case 'NEFT/RTGS':
                    _data['netBanking'] = value;
                    break;
                  case 'CHEQUE':
                    _data['cheque'] = value;
                    break;
                  case 'CREDIT CARD':
                    _data['card'] += value;
                    break;
                  case 'DEBIT CARD':
                    _data['card'] += value;
                    break;
                  case 'GIFT CARD':
                    _data['giftCard'] = value;
                    break;
                  case 'CUSTOM FINANCE':
                    _data['customFinance'] = value;
                    break;
                  case 'CREDIT SALE':
                    _data['creditNote'] = value;
                    break;
                  default:
                    break;
                }
              }
            }
          }
          return _data;
        })
      );
      setSalesData(response);
    });
  };

  const getAllSalesSearchWithDate = async (
    value,
    fromDate,
    toDate,
    billTypeName
  ) => {
    const db = await Db.get();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    let query = await db.purchases.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $regex: regexp } },

              {
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { payment_type: { $regex: regexp } },

              {
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { customer_name: { $regex: regexp } },

              {
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } },

              {
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { balance_amount: { $eq: parseFloat(value) } },

              {
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
                  $lte: toDate
                }
              }
            ]
          }
        ]
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      let response = data
        .map((item) => {
          let output = {};

          output.total_amount = item.total_amount;
          output.balance_amount = item.balance_amount;

          ++count;
          return output;
        })
        .reduce(
          (a, b) => {
            let data = toJS(b);

            a.paid = parseFloat(
              parseFloat(a.paid) +
                (parseFloat(data.total_amount) -
                  parseFloat(data.balance_amount))
            ).toFixed(2);

            a.unPaid = parseFloat(
              parseFloat(a.unPaid) + parseFloat(data.balance_amount)
            ).toFixed(2);

            return a;
          },
          {
            paid: 0,
            unPaid: 0
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
                    ALL PURCHASES
                  </Typography>
                </div>
              </div>

              <Grid container className={classes.categoryActionWrapper}>
                <Grid item xs={5}>
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
                          setOnChange(true);
                          setToDate(formatDate(e.target.value));
                        }}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </form>
                  </div>
                </Grid>
                <Grid item xs={7}>
                  <Grid container style={{ marginTop: '-14px' }}>
                    <Grid item className={headerClasses.card}>
                      <div>
                        <Typography className={headerClasses.texthead}>
                          Paid
                        </Typography>
                        <Card
                          className={headerClasses.root}
                          style={{
                            border: '1px solid #33ff00',
                            borderRadius: 8
                          }}
                        >
                          <Typography
                            className={headerClasses.text}
                          >{`₹${parseFloat(allSaleData.paid).toFixed(
                            2
                          )}`}</Typography>
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
                          style={{
                            border: '1px solid #f7941d',
                            borderRadius: 8
                          }}
                        >
                          <Typography
                            className={headerClasses.text}
                          >{`₹${parseFloat(allSaleData.unPaid).toFixed(
                            2
                          )}`}</Typography>
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
                          style={{
                            border: '1px solid #4a83fb',
                            borderRadius: 8
                          }}
                        >
                          <Typography
                            className={headerClasses.text}
                          >{`₹${parseFloat(
                            Number(allSaleData.paid) +
                              Number(allSaleData.unPaid)
                          ).toFixed(2)}`}</Typography>
                        </Card>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                container
                direction="row"
                alignItems="right"
                className={classes.sectionHeader}
              >
                <Grid item xs={12} sm={6}></Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  align="right"
                  className={classes.categoryActionWrapper}
                >
                  <Grid container direction="row" alignItems="right">
                    <Grid item xs={12} sm={6} align="right">
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

                    <Grid
                      item
                      xs={12}
                      sm={2}
                      className="category-actions-right"
                    >
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
                  height: height - 230 + 'px'
                }}
                className=" blue-theme"
              >
                <div
                  id="sales-invoice-grid"
                  style={{ height: '94%', width: '100%' }}
                  className="ag-theme-material"
                >
                  <AgGridReact
                    onGridReady={onGridReady}
                    paginationPageSize={10}
                    suppressMenuHide={true}
                    rowData={salesData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    headerHeight={40}
                    rowClassRules={rowClassRules}
                    suppressPaginationPanel={true}
                    suppressScrollOnNewData={true}
                    onCellClicked={handleCellClicked}
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
                      marginTop: '4px'
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
            // </Paper>
            <NoPermission />
          )}
        </div>
      )}
      {productDialogOpen ? <ProductModal /> : null}
      {OpenAddPurchaseBill ? <AddPurchase /> : null}
    </div>
  );
};

export default InjectObserver(AuditorPurchasesReport);