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
  Box
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from '../../../../components/controls/index';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { AgGridReact } from 'ag-grid-react';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import useWindowDimensions from '../../../../components/windowDimension';
import * as Db from '../../../../RxDb/Database/Database';
import { toJS } from 'mobx';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice/index';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
import ProductModal from 'src/components/modal/ProductModal';
import { pdf } from '@react-pdf/renderer';
import SalesPDF from 'src/views/PDF/Sales/SalesPDF';
import { saveAs } from 'file-saver';
import PDFIcon from '@material-ui/icons/PictureAsPdf';
import {
  getAllSalesByDateRangeSorted,
  getAllSalesByDateRangeSortedWithLimit
} from 'src/components/Helpers/dbQueries/sales';
import { SecondaryButton } from '../../../sales/SalesInvoices/AddInvoice/MFGDetails/MEGDetails.styles';

import { salesColumnDef, getTotals, defaultColumnConfig } from './utils';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 2,
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column'
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
    paddingLeft: '20px',
    paddingTop: '15px',
    display: 'flex',
    alignItems: 'center',
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
    flexDirection: 'row',
    flexGrow: 1,
    padding: '0 16px'
  },

  label: {
    flexDirection: 'column'
  },
  iconLabel: {
    fontSize: 'x-small'
  },
  cardWrapper: {
    flexGrow: 1,
    maxWidth: 140
  },
  root: {
    maxWidth: 140,
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

const SalesInfo = ({ salesReport, cleearReport, isPL, plHeader }) => {
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

  const { getSalesTransSettingdetails } = store.SalesTransSettingsStore;
  const { invoiceRegular } = toJS(store.PrinterSettingsStore);

  const {
    salesReportFilters,
    openAddSalesInvoice,
    isLaunchEWayAfterSaleCreation,
    printData
  } = toJS(store.SalesAddStore);
  const { viewOrEditItem, resetEWayLaunchFlag } = store.SalesAddStore;
  const { openEWayGenerateModal } = toJS(store.EWayStore);
  const { productDialogOpen } = toJS(store.ProductStore);
  const { handleOpenEWayGenerateModal } = store.EWayStore;

  const [columnDefs, setColumnDefs] = useState([]);

  const {
    setSalesTxnEnableFieldsMap,
    getSalesReportFilters,
    setSalesReportFilters
  } = store.SalesAddStore;

  useEffect(() => {
    async function fetchData() {
      await setSalesTxnEnableFieldsMap(await getSalesTransSettingdetails());
      await setSalesReportFilters(await getSalesReportFilters(true));
      setColumnDefs(salesColumnDef(salesReportFilters));
    }

    fetchData();
  }, []);

  useEffect(() => {
    setColumnDefs(salesColumnDef(salesReportFilters));
  }, [salesReportFilters && salesReportFilters.length > 0]);

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

  function dateFormatterPDF(data) {
    var dateParts = data.split('-');
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

  const handleCellClicked = (event) => {
    const colId = event.column.getId();

    if ('sequenceNumber' === colId) {
      viewOrEditItem(event.data);
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

  const getGrossWeight = (data) => getTotals(data, 'grossWeight');
  const getWastage = (data) => getTotals(data, 'wastageGrams');
  const getNetWeight = (data) => getTotals(data, 'netWeight');
  const getMakingCharge = (data) => getTotals(data, 'makingChargeAmount');
  const getMakingChargePerGram = (data) =>
    getTotals(data, 'makingChargePerGramAmount');
  const getTotalDiscount = (data) => getTotals(data, 'discount_amount');
  const getTotalCgst = (data) => getTotals(data, 'cgst_amount');
  const getTotalSgst = (data) => getTotals(data, 'sgst_amount');
  const getTotalIgst = (data) => getTotals(data, 'igst_amount');

  function getTaxableValue(data) {
    let totalTax = 0;
    let result = 0;

    for (let item of data.item_list) {
      totalTax +=
        parseFloat(item.cgst_amount) +
        parseFloat(item.sgst_amount) +
        parseFloat(item.igst_amount) +
        parseFloat(item.cess);
    }

    result = data.total_amount - totalTax;
    return parseFloat(result).toFixed(2);
  }

  function getTotalTax(data) {
    let totalTax = 0;

    for (let item of data.item_list) {
      totalTax +=
        parseFloat(item.cgst_amount) +
        parseFloat(item.sgst_amount) +
        parseFloat(item.igst_amount) +
        parseFloat(item.cess);
    }

    return parseFloat(totalTax).toFixed(2);
  }

  const getDataFromSales = async () => {
    const wb = new Workbook();

    const xlsxData = await getAllSalesByDateRangeSorted(fromDate, toDate);

    let data = [];
    if (xlsxData && xlsxData.length > 0) {
      for (let i = 0; i < xlsxData.length; i++) {
        let record = {};

        record['GSTIN/UIN'] = xlsxData[i].customerGSTNo;
        record['CUSTOMER NAME'] = xlsxData[i].customer_name;
        record['PLACE OF SUPPLY'] = xlsxData[i].place_of_supply;
        record['INVOICE NUMBER'] = xlsxData[i].sequenceNumber;
        record['DATE'] = formatDownloadExcelDate(xlsxData[i].invoice_date);
        record['INVOICE VALUE'] = xlsxData[i].total_amount;
        // record['TOTAL TAX %'] = getTotalTaxPercent(xlsxData[i]);
        record['TAXABLE VALUE'] = getTaxableValue(xlsxData[i]);
        record['SGST'] = getTotalSgst(xlsxData[i]);
        record['CGST'] = getTotalCgst(xlsxData[i]);
        record['IGST'] = getTotalIgst(xlsxData[i]);
        record['TOTAL TAX'] = getTotalTax(xlsxData[i]);
        record['ROUND OFF'] = xlsxData[i].round_amount;
        record['BALANCE DUE'] = xlsxData[i].balance_amount;

        salesReportFilters.forEach((filter) => {
          if (filter.name === 'Gross Weight' && filter.val === true) {
            record['GROSS WEIGHT'] = getGrossWeight(xlsxData[i]);
          }

          if (filter.name === 'Wastage' && filter.val === true) {
            record['WASTAGE'] = getWastage(xlsxData[i]);
          }

          if (filter.name === 'Net Weight' && filter.val === true) {
            record['NET WEIGHT'] = getNetWeight(xlsxData[i]);
          }

          if (filter.name === 'Making Charge' && filter.val === true) {
            record['MAKING CHARGE'] = getMakingCharge(xlsxData[i]);
          }

          if (filter.name === 'Making Charge/g' && filter.val === true) {
            record['MAKING CHARGE PER GRAM'] = getMakingChargePerGram(
              xlsxData[i]
            );
          }

          if (filter.name === 'Discount' && filter.val === true) {
            record['TOTAL DISCOUNT'] = getTotalDiscount(xlsxData[i]);
          }
        });

        record['IRN'] = xlsxData[i].irnNo;
        record['E-WAY'] = xlsxData[i].ewayBillNo;

        data.push(record);
      }
    } else {
      let record = {};

      record['GSTIN/UIN'] = '';
      record['CUSTOMER NAME'] = '';
      record['PLACE OF SUPPLY'] = '';
      record['INVOICE NUMBER'] = '';
      record['DATE'] = '';
      record['INVOICE VALUE'] = '';
      //  record['TOTAL TAX %'] = '';
      record['TAXABLE VALUE'] = '';
      record['SGST'] = '';
      record['CGST'] = '';
      record['IGST'] = '';
      record['CESS'] = '';
      record['TOTAL TAX'] = '';
      record['BALANCE DUE'] = '';

      salesReportFilters.forEach((filter) => {
        if (filter.name === 'Gross Weight' && filter.val === true) {
          record['GROSS WEIGHT'] = '';
        }

        if (filter.name === 'Wastage' && filter.val === true) {
          record['WASTAGE'] = '';
        }

        if (filter.name === 'Net Weight' && filter.val === true) {
          record['NET WEIGHT'] = '';
        }

        if (filter.name === 'Making Charge' && filter.val === true) {
          record['MAKING CHARGE'] = '';
        }

        if (filter.name === 'Making Charge/g' && filter.val === true) {
          record['MAKING CHARGE PER GRAM'] = '';
        }

        if (filter.name === 'Discount' && filter.val === true) {
          record['TOTAL DISCOUNT'] = '';
        }
      });

      record['IRN'] = '';
      record['E-WAY'] = '';

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

    const fileName = 'All_Sales_Report';

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
  const [fromDate, setFromDate] = React.useState(salesReport?.reportStartDate);
  const [toDate, setToDate] = React.useState(salesReport?.reportEndDate);

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
        getSalesSearchWithDate(target, fromDate, toDate, '');
      } else {
        getSaleDataByDate(fromDate, toDate);
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
    setFromDate(salesReport?.reportStartDate);
    setToDate(salesReport?.reportEndDate);
    setOnChange(true);
    setTimeout(() => setLoadingShown(false), 200);
    return () => custSub.map((sub) => sub.unsubscribe());
  }, [salesReport]);

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
      if (onChange && fromDate && toDate) {
        setOnChange(false);
        if (searchText && searchText.length > 0) {
          getSalesSearchWithDate(searchText, fromDate, toDate, '');
        } else {
          getSaleDataByDate(fromDate, toDate);
        }
      }
    };

    loadPaginationData();
  }, [onChange, salesReport]);

  const getSaleDataByDate = async (fromDate, toDate) => {
    setSalesData([]);
    if (currentPage === 1) {
      getAllSaleDataByDate(fromDate, toDate);
    }

    let data = await getAllSalesByDateRangeSortedWithLimit(
      fromDate,
      toDate,
      currentPage,
      limit,
      'asc'
    );

    if (data) {
      let response = data.map((item) => item);
      setSalesData(response);
    }
  };

  const getAllSaleDataByDate = async (fromDate, toDate) => {
    let data = await getAllSalesByDateRangeSorted(fromDate, toDate);

    if (data) {
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
    }
  };

  const getSalesSearchWithDate = async (value, fromDate, toDate) => {
    const db = await Db.get();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    let skip = 0;
    setSalesData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSalesSearchWithDate(value, fromDate, toDate, '');
    }
    const businessData = await Bd.getBusinessData();

    let query = await db.sales.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $regex: regexp } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              },
              {
                sortingNumber: { $exists: true }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { payment_type: { $regex: regexp } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              },
              {
                sortingNumber: { $exists: true }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { customer_name: { $regex: regexp } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              },
              {
                sortingNumber: { $exists: true }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              },
              {
                sortingNumber: { $exists: true }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { balance_amount: { $eq: parseFloat(value) } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              },
              {
                sortingNumber: { $exists: true }
              }
            ]
          }
        ]
      },
      sort: [{ sortingNumber: 'asc' }],
      skip: skip,
      limit: limit
    });

    await query.exec().then((data) => {
      let response = data.map((item) => item);
      setSalesData(response);
    });
  };

  const getAllSalesSearchWithDate = async (value, fromDate, toDate) => {
    const db = await Db.get();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    let query = await db.sales.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $regex: regexp } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
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
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
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
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
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
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
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
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
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

  useEffect(() => {
    if (isLaunchEWayAfterSaleCreation === true) {
      handleOpenEWayGenerateModal('Invoice', printData);

      resetEWayLaunchFlag();
    }
  }, [isLaunchEWayAfterSaleCreation]);

  const generatePDFDocument = async () => {
    let allData = await getAllSalesByDateRangeSorted(fromDate, toDate);

    const blob = await pdf(
      <SalesPDF
        data={allData}
        settings={invoiceRegular}
        fromdate={dateFormatterPDF(fromDate)}
        todate={dateFormatterPDF(toDate)}
        total=""
      />
    ).toBlob();

    console.log(blob);

    saveAs(blob, 'All_Sales');
  };

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div
          className={classes.root}
          style={{ minHeight: height - (!isPL ? 145 : 83) }}
        >
          {isFeatureAvailable ? (
            <Paper className={classes.root}>
              {!isPL ? (
                <Grid>
                  <Box display="flex" p={2} alignItems="center">
                    <SecondaryButton
                      color="secondary"
                      variant="contained"
                      onClick={cleearReport}
                    >
                      Back
                    </SecondaryButton>
                    <Box display="flex" px={2}>
                      <Box fontWeight={600} pr={2}>
                        Start Date:
                      </Box>{' '}
                      {salesReport?.reportStartDate}
                    </Box>
                    <Box display="flex" px={2}>
                      <Box fontWeight={600} pr={2}>
                        End Date:
                      </Box>
                      {salesReport?.reportEndDate}
                    </Box>
                  </Box>
                </Grid>
              ) : (
                plHeader
              )}
              <Grid
                container
                direction="row"
                alignItems="right"
                className={classes.sectionHeader}
              >
                <Grid item xs={12} sm={6}>
                  <Grid container>
                    <Grid item className={headerClasses.card}>
                      <div className={headerClasses.cardWrapper}>
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
                      <div className={headerClasses.cardWrapper}>
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

                      <div className={headerClasses.cardWrapper}>
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
                <Grid
                  item
                  xs={12}
                  sm={6}
                  align="right"
                  className={classes.categoryActionWrapper}
                  alignItems="center"
                  display="flex"
                >
                  <Grid container direction="row">
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
                        <IconButton onClick={() => getDataFromSales()}>
                          <Excel fontSize="inherit" />
                        </IconButton>
                      </Avatar>
                    </Grid>
                    <Grid item xs={2}>
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
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <div
                style={{
                  width: '100%',
                  height: height - (!isPL ? 300 : 230) + 'px',
                  flexGrow: 1
                }}
                className="blue-theme"
              >
                <div
                  id="sales-invoice-grid"
                  style={{ height: '93%', width: '100%' }}
                  className="ag-theme-material"
                >
                  <AgGridReact
                    onGridReady={onGridReady}
                    paginationPageSize={10}
                    suppressMenuHide={true}
                    rowData={salesData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColumnConfig.defaultColDef}
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

export default InjectObserver(SalesInfo);
