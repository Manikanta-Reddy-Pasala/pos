import React, { useState, useEffect } from 'react';
import {
  Paper,
  makeStyles,
  InputAdornment,
  IconButton,
  Grid,
  Typography,
  Avatar,
  Card,
  Select,
  OutlinedInput,
  MenuItem,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  FormControlLabel,
  Checkbox,
  FormControl
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
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice/index';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
import ProductModal from 'src/components/modal/ProductModal';
import PDFIcon from '@material-ui/icons/PictureAsPdf';
import { pdf } from '@react-pdf/renderer';
import SalesSplitPDF from 'src/views/PDF/SalesSplit/SalesSplitPDF';
import { saveAs } from 'file-saver';

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

const AllSalesTaxSplit = (props) => {
  const classes = useStyles();
  const headerClasses = useHeaderStyles();
  const stores = useStore();
  const { height } = useWindowDimensions();
  const [custSub] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const [billTypeName, setBillTypeName] = React.useState('');
  const [prefixSelect, setPrefixSelect] = React.useState('');

  const store = useStore();
  const { getTransactionData } = store.TransactionStore;
  const { transaction } = toJS(store.TransactionStore);
  const [openFilterDialog, setFilterDialog] = React.useState(false);
  const { getSalesTransSettingdetails } = store.SalesTransSettingsStore;

  const { salesReportFilters } = toJS(store.SalesAddStore);
  const [columnDefs, setColumnDefs] = React.useState([]);

  const {
    setSalesTxnEnableFieldsMap,
    getSalesReportFilters,
    setSalesReportFilters,
    updateSalesReportFilters
  } = store.SalesAddStore;

  const { openAddSalesInvoice, isLaunchEWayAfterSaleCreation, printData } =
    toJS(store.SalesAddStore);
  const { viewOrEditItem, resetEWayLaunchFlag } = store.SalesAddStore;
  const { openEWayGenerateModal } = toJS(store.EWayStore);
  const { productDialogOpen } = toJS(store.ProductStore);
  const { handleOpenEWayGenerateModal } = store.EWayStore;
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);

  useEffect(() => {
    async function fetchData() {
      await setSalesTxnEnableFieldsMap(await getSalesTransSettingdetails());
      await setSalesReportFilters(await getSalesReportFilters(false));
      setColumnDefs(await getColumnDefs());
    }

    fetchData();
  }, []);

  useEffect(() => {
    setColumnDefs(getColumnDefs());
  }, [salesReportFilters && salesReportFilters.length > 0]);

  const handleFilterDialogClose = async () => {
    await getSaleDataByDate(fromDate, toDate);
    await setColumnDefs(await getColumnDefs());
    setFilterDialog(false);
  };

  function dateFormatterPDF(data) {
    var dateParts = data.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

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

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const handleCellClicked = (event) => {
    const colId = event.column.getId();

    if ('sequenceNumber' === colId) {
      viewOrEditItem(event.data);
    }
  };

  function getColumnDefs() {

    const gstin = {
      headerName: 'GSTIN/UIN',
      field: 'customerGSTNo',
      width: 120,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>BILLING ADDRESS</p>
            <p>GSTIN</p>
          </div>
        );
      }
    };

    const customerName = {
      headerName: 'Customer Name',
      field: 'customer_name',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>CUSTOMER</p>
            <p>NAME</p>
          </div>
        );
      }
    };

    const placeOfSupply = {
      headerName: 'Place of Supply',
      field: 'place_of_supply',
      width: 80,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PLACE OF</p>
            <p>SUPPLY</p>
          </div>
        );
      }
    };

    const invoiceNo = {
      headerName: 'INVOICE NUMBER',
      field: 'sequenceNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>INVOICE</p>
            <p>NUMBER</p>
          </div>
        );
      },
      cellStyle: invoiceNumberCellStyle
    };

    const date = {
      headerName: 'DATE',
      field: 'invoice_date',
      valueFormatter: dateFormatter,
      // filter: false,
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
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>INVOICE</p>
            <p>DATE</p>
          </div>
        );
      },
      filter: 'agDateColumnFilter'
    };

    const invoiceValue = {
      headerName: 'INVOICE VALUE',
      field: 'total_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>INVOICE GRAND</p>
            <p>TOTAL</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = parseFloat(data['total_amount']).toFixed(2);
        return result;
      }
    };

    const quantity = {
      headerName: 'QUANTITY',
      field: 'qty',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const discount = {
      headerName: 'DISCOUNT',
      field: 'total_discount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const otherCharges = {
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>OTHER</p>
            <p>CHARGES</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let result = 0;
        return parseFloat(result).toFixed(2);
      }
    };

    const totalTaxPercent = {
      field: 'tax_percentage',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TAX</p>
            <p>RATE</p>
          </div>
        );
      }
    };

    const reverseCharge = {
      field: 'reverse_charge',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>REVERSE</p>
            <p>CHARGE</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        return 'N';
      }
    };

    const hsnSacCode = {
      field: 'hsn',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>HSN/SAC</p>
            <p>CODE</p>
          </div>
        );
      }
    };

    const itemName = {
      headerName: 'ITEM NAME',
      field: 'itemName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const description = {
      headerName: 'DESCRIPTION',
      field: 'description',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const unit = {
      field: 'qtyUnit',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>UNIT OF</p>
            <p>MEASUREMENT</p>
          </div>
        );
      }
    };

    const taxableValue = {
      field: 'total_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TAXABLE</p>
            <p>VALUE</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;
        result =
          (parseFloat(data['amount']) || 0) -
          (parseFloat(data['total_tax']) || 0);
        return parseFloat(result).toFixed(2);
      }
    };

    const itemValue = {
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>ITEM</p>
            <p>VALUE</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;
        result =
          (parseFloat(data['amount']) || 0) +
          (parseFloat(data['total_discount']) || 0) -
          (parseFloat(data['total_tax']) || 0);
        return parseFloat(result).toFixed(2);
      }
    };

    const cgst = {
      headerName: 'CGST',
      field: 'cgst_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const sgst = {
      headerName: 'SGST',
      field: 'sgst_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const igst = {
      headerName: 'IGST',
      field: 'igst_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const cess = {
      headerName: 'CESS',
      field: 'cess',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const round = {
      headerName: 'ROUND',
      field: 'round_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const tcs = {
      headerName: 'TCS',
      field: 'tcsAmount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const totalTax = {
      headerName: 'TOTAL TAX',
      field: 'total_tax',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TOTAL</p>
            <p>TAX</p>
          </div>
        );
      }
    };

    const balanceDue = {
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

    const grossWeight = {
      headerName: 'Gross Weight',
      field: 'total_gross_weight',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GROSS</p>
            <p>WEIGHT</p>
          </div>
        );
      }
    };

    const wastage = {
      headerName: 'WASTAGE',
      field: 'total_wastage',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const netWeight = {
      headerName: 'Net Weight',
      field: 'total_net_weight',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>NET</p>
            <p>WEIGHT</p>
          </div>
        );
      }
    };

    const makingCharge = {
      headerName: 'Making Charge',
      field: 'total_making_charge',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>MAKING</p>
            <p>CHARGE</p>
          </div>
        );
      }
    };

    const makingChargePerGram = {
      headerName: 'Making Charge/g',
      field: 'total_making_charge_per_gram',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>MAKING</p>
            <p>CHARGE/g</p>
          </div>
        );
      }
    };

    columnDefs.push(invoiceNo);
    columnDefs.push(date);
    columnDefs.push(customerName);
    columnDefs.push(gstin);
    columnDefs.push(reverseCharge);
    columnDefs.push(placeOfSupply);
    columnDefs.push(hsnSacCode);
    columnDefs.push(itemName);
    columnDefs.push(description);
    columnDefs.push(unit);
    columnDefs.push(quantity);
    columnDefs.push(totalTaxPercent);
    columnDefs.push(itemValue);
    columnDefs.push(otherCharges);

    if (String(localStorage.getItem('isJewellery')).toLowerCase() === 'true') {
      columnDefs.push(grossWeight);
      columnDefs.push(wastage);
      columnDefs.push(netWeight);
      columnDefs.push(makingCharge);
      columnDefs.push(makingChargePerGram);
      columnDefs.push(round);
    }

    columnDefs.push(discount);
    columnDefs.push(taxableValue);
    columnDefs.push(igst);
    columnDefs.push(sgst);
    columnDefs.push(cgst);
    columnDefs.push(cess);
    columnDefs.push(tcs);
    columnDefs.push(invoiceValue);

    return columnDefs;
  }

  function dateFormatter(params) {
    var dateAsString = params.data.invoice_date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
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

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
  }

  function formatDownloadExcelDate(dateAsString) {
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  function getTaxableValue(data) {
    let result = 0;
    result = parseFloat(data['amount'] - data['total_tax']).toFixed(2);
    return parseFloat(result).toFixed(2);
  }

  function getItemValue(data) {
    let result = 0;
    result =
      (parseFloat(data['amount']) || 0) +
      (parseFloat(data['total_discount']) || 0) -
      (parseFloat(data['total_tax']) || 0);
    return parseFloat(result).toFixed(2);
  }

  const composeData = async () => {
    const wb = new Workbook();

    const xlsxData = await getSaleDataByDateXlsx(fromDate, toDate);

    let data = [];
    if (xlsxData && xlsxData.length > 0) {
      for (let i = 0; i < xlsxData.length; i++) {
        let record = {};

        record['INVOICE NUMBER'] = xlsxData[i].sequenceNumber;
        record['INVOICE DATE'] = formatDownloadExcelDate(
          xlsxData[i].invoice_date
        );
        record['CUSTOMER NAME'] = xlsxData[i].customer_name;
        record['BILLING ADDRESS GSTIN'] = xlsxData[i].customerGSTNo;
        record['REVERSE CHARGE'] = 'N';
        record['PLACE OF SUPPLY'] = xlsxData[i].place_of_supply;
        record['HSN/SAC CODE'] = xlsxData[i].hsn;
        record['ITEM NAME'] = xlsxData[i].itemName;
        record['DESCRIPTION'] = xlsxData[i].description;
        record['UNIT OF MEASUREMENT'] = xlsxData[i].qtyUnit;
        record['QUANTITY'] = xlsxData[i].qty;
        record['TAX RATE'] = parseFloat(xlsxData[i].tax_percentage).toFixed(2);
        record['ITEM VALUE'] = getItemValue(xlsxData[i]);
        record['OTHER CHARGES'] = 0;
        if (
          String(localStorage.getItem('isJewellery')).toLowerCase() === 'true'
        ) {
          record['GROSS WEIGHT'] = xlsxData[i].total_gross_weight;
          record['WASTAGE'] = xlsxData[i].total_wastage;
          record['NET WEIGHT'] = xlsxData[i].total_net_weight;
          record['MAKING CHARGE'] = xlsxData[i].total_making_charge;
          record['MAKING CHARGE PER GRAM'] =
            xlsxData[i].total_making_charge_per_gram;
          record['ROUND'] = xlsxData[i].round_amount;
        }
        record['DISCOUNT'] = parseFloat(xlsxData[i].total_discount).toFixed(2);
        record['TAXABLE VALUE'] = getTaxableValue(xlsxData[i]);
        record['IGST'] = xlsxData[i].igst_amount;

        record['INVOICE VALUE'] = xlsxData[i].total_amount;
        record['SGST'] = xlsxData[i].sgst_amount;
        record['CGST'] = xlsxData[i].cgst_amount;
        record['CESS'] = xlsxData[i].cess;
        record['TCS'] = xlsxData[i].tcsAmount;
        record['INVOICE GRAND TOTAL'] = parseFloat(
          xlsxData[i].total_amount
        ).toFixed(2);

        data.push(record);
      }
    } else {
      let record = {};

      record['INVOICE NUMBER'] = '';
      record['INVOICE DATE'] = '';
      record['CUSTOMER NAME'] = '';
      record['BILLING ADDRESS GSTIN'] = '';
      record['REVERSE CHARGE'] = '';
      record['PLACE OF SUPPLY'] = '';
      record['HSN/SAC CODE'] = '';
      record['ITEM NAME'] = '';
      record['DESCRIPTION'] = '';
      record['UNIT OF MEASUREMENT'] = '';
      record['QUANTITY'] = '';
      record['TAX RATE'] = '';
      record['ITEM VALUE'] = '';
      record['OTHER CHARGES'] = '';
      if (
        String(localStorage.getItem('isJewellery')).toLowerCase() === 'true'
      ) {
        record['GROSS WEIGHT'] = '';
        record['WASTAGE'] = '';
        record['NET WEIGHT'] = '';
        record['MAKING CHARGE'] = '';
        record['MAKING CHARGE PER GRAM'] = '';
        record['ROUND'] = '';
      }
      record['DISCOUNT'] = '';
      record['TAXABLE VALUE'] = '';
      record['IGST'] = '';

      record['INVOICE VALUE'] = '';
      record['SGST'] = '';
      record['CGST'] = '';
      record['CESS'] = '';
      record['TCS'] = '';
      record['INVOICE GRAND TOTAL'] = '';

      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('All Sales Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['All Sales Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'All_Sales_Report_Split';

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

  const { handleSalesSearchWithDate } = stores.SalesAddStore;

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [salesData, setSalesData] = useState([]);
  let [onChange, setOnChange] = useState(false);
  let [allSaleData, setAllSaleData] = useState({
    paidAmount: 0,
    unPaidAmount: 0
  });

  const [limit] = useState(10);

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      if (target) {
        formatSaleData(
          await handleSalesSearchWithDate(
            target,
            fromDate,
            toDate,
            billTypeName
          )
        );
      } else {
        getSaleDataByDate(fromDate, toDate);
      }
    }
  };

  /* const handlePrefixChange = (event) => {
    setPrefixSelect(event.target.value);
  }; */

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      await getTransactionData();
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
      if (!businessData.posFeatures.includes('Sales Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setOnChange(false);
        await getSaleDataByDate(fromDate, toDate);
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getSaleDataByDate = async (fromDate, toDate) => {
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
        invoice_date: {
          $gte: dateFormat(fromDate, 'yyyy-mm-dd')
        }
      },
      {
        invoice_date: {
          $lte: dateFormat(toDate, 'yyyy-mm-dd')
        }
      },
      {
        sortingNumber: { $exists: true }
      }
    ];

    if (prefixSelect && prefixSelect !== '') {
      let prefixFilter = {};

      if (prefixSelect === 'NoPrefix' || prefixSelect === 'AllPrefix') {
        if (prefixSelect === 'NoPrefix') {
          prefixFilter = {
            prefix: { $eq: null }
          };
        } else if (prefixSelect === 'AllPrefix') {
          prefixFilter = {
            prefix: { $ne: null }
          };
        }
      } else {
        var regexp = new RegExp('^.*' + prefixSelect + '.*$', 'i');

        prefixFilter = {
          prefix: { $regex: regexp }
        };
      }
      filterArray.push(prefixFilter);
    }

    if (billTypeName !== '') {
      let billTypeFilter = {
        templeBillType: { $eq: billTypeName }
      };

      filterArray.push(billTypeFilter);
    }

    Query = db.sales.find({
      selector: {
        $and: filterArray
      },
      sort: [{ sortingNumber: 'asc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }

      formatSaleData(data);
    });
  };

  const formatSaleData = async (data) => {
    let result = [];
    await data.map((item) => {
      let row = item.toJSON();
      let items = row.item_list;
      let taxSlabs = new Map();

      for (let item of items) {
        let cess = 0;
        let igst_amount = 0;
        let cgst_amount = 0;
        let sgst_amount = 0;
        let total_tax = 0;
        let amount = 0;

        let total_gross_weight = 0;
        let total_wastage = 0;
        let total_net_weight = 0;
        let total_making_charge = 0;
        let total_making_charge_per_gram = 0;
        let total_discount = 0;
        let hsn = '';

        let qtyUnit = item.qtyUnit;
        let itemName = item.item_name;
        let description = item.description;
        let round_amount = row.round_amount;
        let qty = item.qty;

        let keyToFind = '';
        if (item.hsn !== '') {
          keyToFind = item.hsn;
          hsn = item.hsn;
        }

        if (item.cgst && item.cgst > 0) {
          keyToFind = keyToFind + '_' + item.cgst;
        } else if (item.igst && item.igst > 0) {
          keyToFind = keyToFind + '_' + item.igst;
        }

        //add all items tax and amount details in map then finally that many rows in
        if (taxSlabs.has(keyToFind)) {
          let existingRow = {};

          if (taxSlabs.has(keyToFind)) {
            existingRow = taxSlabs.get(keyToFind);
          } else {
            existingRow = taxSlabs.get(keyToFind);
          }

          cess = parseFloat(existingRow.cess);
          igst_amount = parseFloat(existingRow.igst_amount);
          cgst_amount = parseFloat(existingRow.cgst_amount);
          sgst_amount = parseFloat(existingRow.sgst_amount);
          total_tax = parseFloat(existingRow.total_tax);
          amount = parseFloat(existingRow.amount);
        }

        cess = cess + parseFloat(item.cess);
        igst_amount = parseFloat(igst_amount) + parseFloat(item.igst_amount);
        cgst_amount = parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
        sgst_amount = parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
        amount = parseFloat(amount) + parseFloat(item.amount);

        total_tax =
          parseFloat(cess) +
          parseFloat(cgst_amount) +
          parseFloat(sgst_amount) +
          parseFloat(igst_amount);

        total_gross_weight = parseFloat(item.grossWeight || 0);
        total_wastage = parseFloat(item.wastageGrams || 0);
        total_net_weight = parseFloat(item.netWeight || 0);
        total_making_charge = parseFloat(item.makingChargeAmount || 0);
        total_making_charge_per_gram = parseFloat(
          item.makingChargePerGramAmount || 0
        );
        total_discount = parseFloat(item.discount_amount);

        let tempRow = {};
        tempRow.total_tax = parseFloat(total_tax).toFixed(2);
        tempRow.cess = cess;
        tempRow.igst_amount = parseFloat(igst_amount).toFixed(2);
        tempRow.cgst_amount = parseFloat(cgst_amount).toFixed(2);
        tempRow.sgst_amount = parseFloat(sgst_amount).toFixed(2);
        tempRow.amount = parseFloat(amount).toFixed(2);
        tempRow.total_gross_weight = parseFloat(total_gross_weight).toFixed(2);
        tempRow.total_wastage = parseFloat(total_wastage).toFixed(2);
        tempRow.total_net_weight = parseFloat(total_net_weight).toFixed(2);
        tempRow.total_making_charge =
          parseFloat(total_making_charge).toFixed(2);
        tempRow.total_making_charge_per_gram = parseFloat(
          total_making_charge_per_gram
        ).toFixed(2);
        tempRow.total_discount = parseFloat(total_discount).toFixed(2);
        tempRow.qtyUnit = qtyUnit;
        tempRow.description = description;
        tempRow.itemName = itemName;
        tempRow.round_amount = round_amount;
        tempRow.qty = qty;
        tempRow.hsn = hsn;

        taxSlabs.set(keyToFind, tempRow);
      }

      taxSlabs.forEach((value, key) => {
        // console.log(value, key);
        let individualTaxSlotRow = item.toJSON();

        let taxRecord = value;
        individualTaxSlotRow.total_tax = parseFloat(
          taxRecord.total_tax
        ).toFixed(2);
        individualTaxSlotRow.cess = taxRecord.cess;
        individualTaxSlotRow.qtyUnit = taxRecord.qtyUnit;
        individualTaxSlotRow.description = taxRecord.description;
        individualTaxSlotRow.itemName = taxRecord.itemName;
        individualTaxSlotRow.round_amount = taxRecord.round_amount;
        individualTaxSlotRow.qty = taxRecord.qty;
        individualTaxSlotRow.hsn = taxRecord.hsn;
        individualTaxSlotRow.igst_amount = parseFloat(
          taxRecord.igst_amount
        ).toFixed(2);
        individualTaxSlotRow.cgst_amount = parseFloat(
          taxRecord.cgst_amount
        ).toFixed(2);
        individualTaxSlotRow.sgst_amount = parseFloat(
          taxRecord.sgst_amount
        ).toFixed(2);
        individualTaxSlotRow.amount = parseFloat(taxRecord.amount).toFixed(2);
        let tax = key.split('_');
        if (individualTaxSlotRow.igst_amount > 0) {
          individualTaxSlotRow.tax_percentage = parseFloat(tax[1]) || 0;
        } else {
          individualTaxSlotRow.tax_percentage = parseFloat(tax[1]) * 2 || 0;
        }

        individualTaxSlotRow.total_gross_weight = parseFloat(
          taxRecord.total_gross_weight
        ).toFixed(2);
        individualTaxSlotRow.total_wastage = parseFloat(
          taxRecord.total_wastage
        ).toFixed(2);
        individualTaxSlotRow.total_net_weight = parseFloat(
          taxRecord.total_net_weight
        ).toFixed(2);
        individualTaxSlotRow.total_making_charge = parseFloat(
          taxRecord.total_making_charge
        ).toFixed(2);
        individualTaxSlotRow.total_making_charge_per_gram = parseFloat(
          taxRecord.total_making_charge_per_gram
        ).toFixed(2);
        individualTaxSlotRow.total_discount = parseFloat(
          taxRecord.total_discount
        ).toFixed(2);

        result.push(individualTaxSlotRow);
        individualTaxSlotRow = {};
      });
    });
    setSalesData(result);
  };

  const getSaleDataByDateXlsx = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;

    const businessData = await Bd.getBusinessData();

    let filterArray = [
      { businessId: { $eq: businessData.businessId } },

      {
        invoice_date: {
          $gte: dateFormat(fromDate, 'yyyy-mm-dd')
        }
      },
      {
        invoice_date: {
          $lte: dateFormat(toDate, 'yyyy-mm-dd')
        }
      },
      {
        sortingNumber: { $exists: true }
      }
    ];

    if (prefixSelect && prefixSelect !== '') {
      let prefixFilter = {};

      if (prefixSelect === 'NoPrefix' || prefixSelect === 'AllPrefix') {
        if (prefixSelect === 'NoPrefix') {
          prefixFilter = {
            prefix: { $exists: false }
          };
        } else if (prefixSelect === 'AllPrefix') {
          prefixFilter = {
            prefix: { $exists: true }
          };
        }
      } else {
        var regexp = new RegExp('^.*' + prefixSelect + '.*$', 'i');

        prefixFilter = {
          prefix: { $regex: regexp }
        };
      }
      filterArray.push(prefixFilter);
    }

    if (billTypeName !== '') {
      let billTypeFilter = {
        templeBillType: { $eq: billTypeName }
      };

      filterArray.push(billTypeFilter);
    }

    Query = db.sales.find({
      selector: {
        $and: filterArray
      },
      sort: [{ sortingNumber: 'asc' }]
    });

    let result = [];
    await Query.exec().then((data) => {
      if (!data) {
        return;
      }

      data.map((item) => {
        let row = item.toJSON();
        let items = row.item_list;
        let taxSlabs = new Map();

        for (let item of items) {
          let cess = 0;
          let igst_amount = 0;
          let cgst_amount = 0;
          let sgst_amount = 0;
          let total_tax = 0;
          let amount = 0;

          let total_gross_weight = 0;
          let total_wastage = 0;
          let total_net_weight = 0;
          let total_making_charge = 0;
          let total_making_charge_per_gram = 0;
          let total_discount = 0;
          let hsn = '';

          let qtyUnit = item.qtyUnit;
          let description = item.description;
          let itemName = item.item_name;
          let round_amount = row.round_amount;
          let qty = item.qty;

          let keyToFind = '';
          if (item.hsn !== '') {
            keyToFind = item.hsn;
            hsn = item.hsn;
          }

          if (item.cgst && item.cgst > 0) {
            keyToFind = keyToFind + '_' + item.cgst;
          } else if (item.igst && item.igst > 0) {
            keyToFind = keyToFind + '_' + item.igst;
          }

          //add all items tax and amount details in map then finally that many rows in
          if (taxSlabs.has(keyToFind)) {
            let existingRow = {};

            if (taxSlabs.has(keyToFind)) {
              existingRow = taxSlabs.get(keyToFind);
            } else {
              existingRow = taxSlabs.get(keyToFind);
            }

            cess = parseFloat(existingRow.cess);
            igst_amount = parseFloat(existingRow.igst_amount);
            cgst_amount = parseFloat(existingRow.cgst_amount);
            sgst_amount = parseFloat(existingRow.sgst_amount);
            total_tax = parseFloat(existingRow.total_tax);
            amount = parseFloat(existingRow.amount);
          }

          cess = cess + parseFloat(item.cess);
          igst_amount = parseFloat(igst_amount) + parseFloat(item.igst_amount);
          cgst_amount = parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
          sgst_amount = parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
          amount = parseFloat(amount) + parseFloat(item.amount);

          total_tax =
            parseFloat(cess) +
            parseFloat(cgst_amount) +
            parseFloat(sgst_amount) +
            parseFloat(igst_amount);

          total_gross_weight = parseFloat(item.grossWeight || 0);
          total_wastage = parseFloat(item.wastageGrams || 0);
          total_net_weight = parseFloat(item.netWeight || 0);
          total_making_charge = parseFloat(item.makingChargeAmount || 0);
          total_making_charge_per_gram = parseFloat(
            item.makingChargePerGramAmount || 0
          );
          total_discount = parseFloat(item.discount_amount);

          let tempRow = {};
          tempRow.total_tax = parseFloat(total_tax).toFixed(2);
          tempRow.cess = cess;
          tempRow.igst_amount = parseFloat(igst_amount).toFixed(2);
          tempRow.cgst_amount = parseFloat(cgst_amount).toFixed(2);
          tempRow.sgst_amount = parseFloat(sgst_amount).toFixed(2);
          tempRow.amount = parseFloat(amount).toFixed(2);
          tempRow.total_gross_weight =
            parseFloat(total_gross_weight).toFixed(2);
          tempRow.total_wastage = parseFloat(total_wastage).toFixed(2);
          tempRow.total_net_weight = parseFloat(total_net_weight).toFixed(2);
          tempRow.total_making_charge =
            parseFloat(total_making_charge).toFixed(2);
          tempRow.total_making_charge_per_gram = parseFloat(
            total_making_charge_per_gram
          ).toFixed(2);
          tempRow.total_discount = parseFloat(total_discount).toFixed(2);
          tempRow.qtyUnit = qtyUnit;
          tempRow.description = description;
          tempRow.itemName = itemName;
          tempRow.round_amount = round_amount;
          tempRow.qty = qty;
          tempRow.hsn = hsn;

          taxSlabs.set(keyToFind, tempRow);
        }

        taxSlabs.forEach((value, key) => {
          // console.log(value, key);
          let individualTaxSlotRow = item.toJSON();

          let taxRecord = value;
          individualTaxSlotRow.total_tax = parseFloat(
            taxRecord.total_tax
          ).toFixed(2);
          individualTaxSlotRow.cess = taxRecord.cess;
          individualTaxSlotRow.qtyUnit = taxRecord.qtyUnit;
          individualTaxSlotRow.description = taxRecord.description;
          individualTaxSlotRow.itemName = taxRecord.itemName;
          individualTaxSlotRow.round_amount = taxRecord.round_amount;
          individualTaxSlotRow.qty = taxRecord.qty;
          individualTaxSlotRow.hsn = taxRecord.hsn;
          individualTaxSlotRow.igst_amount = parseFloat(
            taxRecord.igst_amount
          ).toFixed(2);
          individualTaxSlotRow.cgst_amount = parseFloat(
            taxRecord.cgst_amount
          ).toFixed(2);
          individualTaxSlotRow.sgst_amount = parseFloat(
            taxRecord.sgst_amount
          ).toFixed(2);
          individualTaxSlotRow.amount = parseFloat(taxRecord.amount).toFixed(2);
          let tax = key.split('_');
          if (individualTaxSlotRow.igst_amount > 0) {
            individualTaxSlotRow.tax_percentage = parseFloat(tax[1]) || 0;
          } else {
            individualTaxSlotRow.tax_percentage = parseFloat(tax[1]) * 2 || 0;
          }

          individualTaxSlotRow.total_gross_weight = parseFloat(
            taxRecord.total_gross_weight
          ).toFixed(2);
          individualTaxSlotRow.total_wastage = parseFloat(
            taxRecord.total_wastage
          ).toFixed(2);
          individualTaxSlotRow.total_net_weight = parseFloat(
            taxRecord.total_net_weight
          ).toFixed(2);
          individualTaxSlotRow.total_making_charge = parseFloat(
            taxRecord.total_making_charge
          ).toFixed(2);
          individualTaxSlotRow.total_making_charge_per_gram = parseFloat(
            taxRecord.total_making_charge_per_gram
          ).toFixed(2);
          individualTaxSlotRow.total_discount = parseFloat(
            taxRecord.total_discount
          ).toFixed(2);

          result.push(individualTaxSlotRow);
          individualTaxSlotRow = {};
        });
      });
    });
    return result;
  };

  const getAllSaleDataByDate = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    let filterArray = [
      { businessId: { $eq: businessData.businessId } },

      {
        invoice_date: {
          $gte: dateFormat(fromDate, 'yyyy-mm-dd')
        }
      },
      {
        invoice_date: {
          $lte: dateFormat(toDate, 'yyyy-mm-dd')
        }
      },
      {
        sortingNumber: { $exists: true }
      }
    ];

    if (prefixSelect && prefixSelect !== '') {
      let prefixFilter = {};

      if (prefixSelect === 'NoPrefix' || prefixSelect === 'AllPrefix') {
        if (prefixSelect === 'NoPrefix') {
          prefixFilter = {
            prefix: { $exists: false }
          };
        } else if (prefixSelect === 'AllPrefix') {
          prefixFilter = {
            prefix: { $exists: true }
          };
        }
      } else {
        var regexp = new RegExp('^.*' + prefixSelect + '.*$', 'i');

        prefixFilter = {
          prefix: { $regex: regexp }
        };
      }
      filterArray.push(prefixFilter);
    }

    if (billTypeName !== '') {
      let billTypeFilter = {
        templeBillType: { $eq: billTypeName }
      };

      filterArray.push(billTypeFilter);
    }

    Query = db.sales.find({
      selector: {
        $and: filterArray
      },
      sort: [{ sortingNumber: 'asc' }]
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      let result = [];
      let paidAmount = 0;
      let unPaidAmount = 0;

      data.map((item) => {
        let row = item.toJSON();
        let items = row.item_list;
        let taxSlabs = new Map();

        for (let item of items) {
          let cess = 0;
          let igst_amount = 0;
          let cgst_amount = 0;
          let sgst_amount = 0;
          let total_tax = 0;
          let amount = 0;

          let total_gross_weight = 0;
          let total_wastage = 0;
          let total_net_weight = 0;
          let total_making_charge = 0;
          let total_making_charge_per_gram = 0;
          let total_discount = 0;
          let hsn = '';

          let qtyUnit = item.qtyUnit;
          let description = item.description;
          let itemName = item.item_name;
          let round_amount = row.round_amount;
          let qty = item.qty;

          let keyToFind = '';
          if (item.hsn !== '') {
            keyToFind = item.hsn;
            hsn = item.hsn;
          }

          if (item.cgst && item.cgst > 0) {
            keyToFind = keyToFind + '_' + item.cgst;
          } else if (item.igst && item.igst > 0) {
            keyToFind = keyToFind + '_' + item.igst;
          }

          //add all items tax and amount details in map then finally that many rows in
          if (taxSlabs.has(keyToFind)) {
            let existingRow = {};

            if (taxSlabs.has(keyToFind)) {
              existingRow = taxSlabs.get(keyToFind);
            } else {
              existingRow = taxSlabs.get(keyToFind);
            }

            cess = parseFloat(existingRow.cess);
            igst_amount = parseFloat(existingRow.igst_amount);
            cgst_amount = parseFloat(existingRow.cgst_amount);
            sgst_amount = parseFloat(existingRow.sgst_amount);
            total_tax = parseFloat(existingRow.total_tax);
            amount = parseFloat(existingRow.amount);
          }

          cess = cess + parseFloat(item.cess);
          igst_amount = parseFloat(igst_amount) + parseFloat(item.igst_amount);
          cgst_amount = parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
          sgst_amount = parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
          amount = parseFloat(amount) + parseFloat(item.amount);

          total_tax =
            parseFloat(cess) +
            parseFloat(cgst_amount) +
            parseFloat(sgst_amount) +
            parseFloat(igst_amount);

          total_gross_weight = parseFloat(item.grossWeight || 0);
          total_wastage = parseFloat(item.wastageGrams || 0);
          total_net_weight = parseFloat(item.netWeight || 0);
          total_making_charge = parseFloat(item.makingChargeAmount || 0);
          total_making_charge_per_gram = parseFloat(
            item.makingChargePerGramAmount || 0
          );
          total_discount = parseFloat(item.discount_amount);

          let tempRow = {};
          tempRow.total_tax = parseFloat(total_tax).toFixed(2);
          tempRow.cess = cess;
          tempRow.igst_amount = parseFloat(igst_amount).toFixed(2);
          tempRow.cgst_amount = parseFloat(cgst_amount).toFixed(2);
          tempRow.sgst_amount = parseFloat(sgst_amount).toFixed(2);
          tempRow.amount = parseFloat(amount).toFixed(2);
          tempRow.total_gross_weight =
            parseFloat(total_gross_weight).toFixed(2);
          tempRow.total_wastage = parseFloat(total_wastage).toFixed(2);
          tempRow.total_net_weight = parseFloat(total_net_weight).toFixed(2);
          tempRow.total_making_charge =
            parseFloat(total_making_charge).toFixed(2);
          tempRow.total_making_charge_per_gram = parseFloat(
            total_making_charge_per_gram
          ).toFixed(2);
          tempRow.total_discount = parseFloat(total_discount).toFixed(2);
          tempRow.qtyUnit = qtyUnit;
          tempRow.description = description;
          tempRow.itemName = itemName;
          tempRow.round_amount = round_amount;
          tempRow.qty = qty;
          tempRow.hsn = hsn;

          taxSlabs.set(keyToFind, tempRow);
        }

        taxSlabs.forEach((value, key) => {
          // console.log(value, key);
          let individualTaxSlotRow = item.toJSON();

          let taxRecord = value;
          individualTaxSlotRow.total_tax = parseFloat(
            taxRecord.total_tax
          ).toFixed(2);
          individualTaxSlotRow.cess = taxRecord.cess;
          individualTaxSlotRow.qtyUnit = taxRecord.qtyUnit;
          individualTaxSlotRow.description = taxRecord.description;
          individualTaxSlotRow.itemName = taxRecord.itemName;
          individualTaxSlotRow.round_amount = taxRecord.round_amount;
          individualTaxSlotRow.qty = taxRecord.qty;
          individualTaxSlotRow.hsn = taxRecord.hsn;
          individualTaxSlotRow.igst_amount = parseFloat(
            taxRecord.igst_amount
          ).toFixed(2);
          individualTaxSlotRow.cgst_amount = parseFloat(
            taxRecord.cgst_amount
          ).toFixed(2);
          individualTaxSlotRow.sgst_amount = parseFloat(
            taxRecord.sgst_amount
          ).toFixed(2);
          individualTaxSlotRow.amount = parseFloat(taxRecord.amount).toFixed(2);
          let tax = key.split('_');
          if (individualTaxSlotRow.igst_amount > 0) {
            individualTaxSlotRow.tax_percentage = parseFloat(tax[1]) || 0;
          } else {
            individualTaxSlotRow.tax_percentage = parseFloat(tax[1]) * 2 || 0;
          }

          individualTaxSlotRow.total_gross_weight = parseFloat(
            taxRecord.total_gross_weight
          ).toFixed(2);
          individualTaxSlotRow.total_wastage = parseFloat(
            taxRecord.total_wastage
          ).toFixed(2);
          individualTaxSlotRow.total_net_weight = parseFloat(
            taxRecord.total_net_weight
          ).toFixed(2);
          individualTaxSlotRow.total_making_charge = parseFloat(
            taxRecord.total_making_charge
          ).toFixed(2);
          individualTaxSlotRow.total_making_charge_per_gram = parseFloat(
            taxRecord.total_making_charge_per_gram
          ).toFixed(2);
          individualTaxSlotRow.total_discount = parseFloat(
            taxRecord.total_discount
          ).toFixed(2);

          result.push(individualTaxSlotRow);
          individualTaxSlotRow = {};

          ++count;
        });

        paidAmount = parseFloat(
          parseFloat(paidAmount) +
            (parseFloat(row.total_amount) - parseFloat(row.balance_amount))
        ).toFixed(2);

        unPaidAmount = parseFloat(
          parseFloat(unPaidAmount) + parseFloat(row.balance_amount)
        ).toFixed(2);
      });

      let response = {};
      response.paidAmount = paidAmount;
      response.unPaidAmount = unPaidAmount;

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

  const updateUI = async (value, index) => {
    await updateSalesReportFilters(value, index);
  };

  useEffect(() => {
    if (isLaunchEWayAfterSaleCreation === true) {
      handleOpenEWayGenerateModal('Invoice', printData);

      resetEWayLaunchFlag();
    }
  }, [isLaunchEWayAfterSaleCreation]);

  const generatePDFDocument = async () => {
    let allData = await getSaleDataByDateXlsx(fromDate, toDate);

    const blob = await pdf(
      <SalesSplitPDF
        data={allData}
        settings={invoiceRegular}
        fromdate={dateFormatterPDF(fromDate)}
        todate={dateFormatterPDF(toDate)}
        total=""
      />
    ).toBlob();

    console.log(blob);

    saveAs(blob, 'All_Sales_Split');
  };

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
                    ALL SALES (HSN)
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
                          >{`₹${parseFloat(allSaleData.paidAmount).toFixed(
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
                          >{`₹${parseFloat(allSaleData.unPaidAmount).toFixed(
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
                            Number(allSaleData.paidAmount) +
                              Number(allSaleData.unPaidAmount)
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

                <Grid item xs={12} sm={2}></Grid>
               
                <Grid item xs={12} sm={2}></Grid>

                <Grid
                  item
                  xs={12}
                  sm={8}
                  align="right"
                  className={classes.categoryActionWrapper}
                >
                  <Grid container direction="row" alignItems="right">
                    <Grid item xs={12} sm={8} align="right">
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
                        <IconButton onClick={() => composeData()}>
                          <Excel fontSize="inherit" />
                        </IconButton>
                      </Avatar>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={2}
                      className="category-actions-right"
                    >
                      <Avatar>
                        <IconButton onClick={() => generatePDFDocument()}>
                          <PDFIcon fontSize="inherit" />
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
                  style={{ height: '95%', width: '100%' }}
                  className="ag-theme-material"
                >
                  <AgGridReact
                    onGridReady={onGridReady}
                    paginationPageSize={10}
                    suppressMenuHide={true}
                    maintainColumnOrder={true}
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
          ) : (
            // </Paper>
            <NoPermission />
          )}
        </div>
      )}

      <Dialog
        open={openFilterDialog}
        onClose={handleFilterDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>Filters</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Grid container>
                {salesReportFilters &&
                  salesReportFilters.length > 0 &&
                  salesReportFilters.map((prodEle, index) => (
                    <Grid item xs={12} key={index}>
                      <FormControl variant="standard">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={prodEle.val}
                              name={prodEle.name}
                              className={classes.tickSize}
                              onChange={(e) => {
                                updateUI(!prodEle.val, index);
                              }}
                            />
                          }
                          label={prodEle.name}
                        />
                      </FormControl>
                    </Grid>
                  ))}
              </Grid>
            </div>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleFilterDialogClose}
            color="secondary"
            variant="outlined"
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {openAddSalesInvoice ? <AddSalesInvoice /> : null}
      {openEWayGenerateModal ? <EWayGenerate /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(AllSalesTaxSplit);