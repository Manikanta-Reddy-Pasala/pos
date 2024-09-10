import React, { useState, useEffect } from 'react';
import {
  Paper,
  makeStyles,
  InputAdornment,
  Grid,
  Typography,
  Card,
  Select,
  OutlinedInput,
  MenuItem,
  Button
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from '../../../../components/controls/index';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import dateFormat from 'dateformat';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { AgGridReact } from 'ag-grid-react';
import TextField from '@material-ui/core/TextField';
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
import * as ExcelJS from 'exceljs';
import getStateList from 'src/components/StateList';
import styled from 'styled-components';
import { getAllDeletedByDateRangeAndType } from 'src/components/Helpers/dbQueries/alltransactionsdeleted';
import { getSelectedDateMonthAndYearMMYYYY } from 'src/components/Helpers/DateHelper';
import { getDataByTaxSplit } from 'src/components/Helpers/GSTHelper/SaleDataPreparationHelper';
import GstObject from 'src/components/Helpers/GSTHelper/GstObject';

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

const Dropbtn = styled.button`
  background-color: rgb(239, 83, 80);
  color: white;
  padding: 7px;
  font-size: 16px;
  border: none;
`;

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 171px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  left: -3rem;
`;

const DropdownLink = styled.a`
  color: #fff;
  padding: 12px 16px;
  text-decoration: none;
  display: flex;
  justify-content: space-around;
`;

const DropdownLinkHover = styled(DropdownLink)`
  &:hover {
    background-color: #ddd;
  }
`;

const DropdownHoverContent = styled(DropdownContent)`
  ${Dropdown}:hover & {
    display: block;
  }
`;

const DropdownHoverBtn = styled(Dropbtn)`
  ${Dropdown}:hover & {
    background-color: rgb(239, 83, 80);
  }
`;

const AuditorSalesReport = (props) => {
  const classes = useStyles();
  const headerClasses = useHeaderStyles();
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

  const { getSalesTransSettingdetails } = store.SalesTransSettingsStore;

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
  const { getAuditSettingsData } = store.AuditSettingsStore;
  const { auditSettings } = toJS(store.AuditSettingsStore);

  const [columnDefs, setColumnDefs] = useState([]);

  const { getTaxSettingsDetails } = store.TaxSettingsStore;

  const {
    setSalesTxnEnableFieldsMap,
    getSalesReportFilters,
    setSalesReportFilters
  } = store.SalesAddStore;

  useEffect(() => {
    async function fetchData() {
      await getAuditSettingsData();
      await setSalesTxnEnableFieldsMap(await getSalesTransSettingdetails());
      await setSalesReportFilters(await getSalesReportFilters(true));
      setColumnDefs(getColumnDefs());
    }

    fetchData();
  }, []);

  useEffect(() => {
    setColumnDefs(getColumnDefs());
  }, [salesReportFilters && salesReportFilters.length > 0]);

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
    var dateAsString = params.data.invoice_date;
    if (dateAsString !== '' && dateAsString !== null) {
      var dateParts = dateAsString.split('-');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    } else {
      return '';
    }
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

    if ('sequenceNumber' === colId) {
      viewOrEditItem(event.data);
    }
  };

  function getColumnDefs() {
    let columnDefs = [];
    setColumnDefs(columnDefs);

    const gstin = {
      headerName: 'GSTIN/UIN',
      field: 'customerGSTNo',
      width: 100,

      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const placeOfSupply = {
      headerName: 'Place of Supply',
      field: 'place_of_supply',
      width: 100,
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

    const invoiceNo = {
      headerName: 'INVOICE NO',
      field: 'sequenceNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    };

    const date = {
      headerName: 'DATE',
      field: 'invoice_date',
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
            <p>INVOICE</p>
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

    const dueDate = {
      headerName: 'DUE DATE',
      field: 'dueDate',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: dueDateFormatter
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

    const grossWeight = {
      headerName: 'Gross Weight',
      field: 'total_gross_weight',
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
          result += parseFloat(item.grossWeight || 0);
        }

        return parseFloat(result).toFixed(2);
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
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;
        let itemsList = data['item_list'];

        for (let item of itemsList) {
          result += parseFloat(item.wastageGrams || 0);
        }

        return parseFloat(result).toFixed(2);
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
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;
        let itemsList = data['item_list'];

        for (let item of itemsList) {
          result += parseFloat(item.netWeight || 0);
        }

        return parseFloat(result).toFixed(2);
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
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;
        let itemsList = data['item_list'];

        for (let item of itemsList) {
          result += parseFloat(item.makingChargeAmount || 0);
        }

        return parseFloat(result).toFixed(2);
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
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;
        let itemsList = data['item_list'];

        for (let item of itemsList) {
          result += parseFloat(item.makingChargePerGramAmount || 0);
        }

        return parseFloat(result).toFixed(2);
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
            <p>ITEM DISC</p>
          </div>
        );
      }
    };

    const billDiscount = {
      field: 'discount_amount',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];

        return parseFloat(data.discount_amount).toFixed(2);
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TOTAL</p>
            <p>BILL DISC</p>
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

    const irnNo = {
      headerName: 'IRN',
      field: 'irnNo',
      filter: false
    };

    const ewayNo = {
      headerName: 'E-WAY',
      field: 'ewayBillNo',
      filter: false
    };

    const cash = {
      headerName: 'CASH',
      field: 'cash',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const creditNote = {
      field: 'creditNote',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>CREDIT</p>
            <p>NOTE</p>
          </div>
        );
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

    const giftCard = {
      field: 'giftCard',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GIFT</p>
            <p>CARD</p>
          </div>
        );
      }
    };

    const customFinance = {
      field: 'customFinance',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>CUSTOM</p>
            <p>FINANCE</p>
          </div>
        );
      }
    };

    const exchange = {
      headerName: 'EXCHANGE',
      field: 'exchange',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    columnDefs.push(invoiceNo);
    columnDefs.push(date);
    columnDefs.push(customerName);
    columnDefs.push(gstin);
    columnDefs.push(placeOfSupply);
    columnDefs.push(invoiceValue);
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
    columnDefs.push(creditNote);
    columnDefs.push(upi);
    columnDefs.push(card);
    columnDefs.push(neftOrRtgs);
    columnDefs.push(cheque);
    columnDefs.push(giftCard);
    columnDefs.push(customFinance);
    columnDefs.push(exchange);
    columnDefs.push(totalDiscount);
    columnDefs.push(billDiscount);
    columnDefs.push(balanceDue);
    columnDefs.push(irnNo);
    columnDefs.push(ewayNo);
    columnDefs.push(dueDate);

    salesReportFilters.forEach((filter) => {
      if (filter.name === 'Gross Weight' && filter.val === true) {
        columnDefs.push(grossWeight);
      }

      if (filter.name === 'Wastage' && filter.val === true) {
        columnDefs.push(wastage);
      }

      if (filter.name === 'Net Weight' && filter.val === true) {
        columnDefs.push(netWeight);
      }

      if (filter.name === 'Making Charge' && filter.val === true) {
        columnDefs.push(makingCharge);
      }

      if (filter.name === 'Making Charge/g' && filter.val === true) {
        columnDefs.push(makingChargePerGram);
      }
    });

    return columnDefs;
  }

  function formatDownloadExcelDate(dateAsString) {
    if (dateAsString !== '' && dateAsString !== null) {
      var dateParts = dateAsString.split('-');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    } else {
      return '';
    }
  }

  function getGrossWeight(data) {
    let result = 0;

    for (let item of data.item_list) {
      result += parseFloat(item.grossWeight || 0);
    }

    return result;
  }

  function getWastage(data) {
    let result = 0;

    for (let item of data.item_list) {
      result += parseFloat(item.wastageGrams || 0);
    }

    return result;
  }

  function getNetWeight(data) {
    let result = 0;

    for (let item of data.item_list) {
      result += parseFloat(item.netWeight || 0);
    }

    return result;
  }

  function getMakingCharge(data) {
    let result = 0;

    for (let item of data.item_list) {
      result += parseFloat(item.makingChargeAmount || 0);
    }

    return result;
  }

  function getMakingChargePerGram(data) {
    let result = 0;

    for (let item of data.item_list) {
      result += parseFloat(item.makingChargePerGramAmount || 0);
    }

    return result;
  }

  function getTotalDiscount(data) {
    let result = 0;

    for (let item of data.item_list) {
      result += parseFloat(item.discount_amount || 0);
    }

    return result;
  }

  const getExcelDataNew = async () => {
    const xlsxData = await getSaleDataByDatexlsx(fromDate, toDate);
    const deletedData = await getAllDeletedByDateRangeAndType(
      fromDate,
      toDate,
      'Sales'
    );
    const auditSettingsExists =
      auditSettings &&
      auditSettings.taxApplicability &&
      auditSettings.taxApplicability.length > 0;

    let taxData = await getTaxSettingsDetails();
    let defaultState = getStateList().find((e) => e.name === taxData.state);

    let b2bGstTotal = new GstObject().getDefaultValues();
    let b2bCancelledGstTotal = new GstObject().getDefaultValues();
    let b2cGstTotal = new GstObject().getDefaultValues();
    let b2cCancelledGstTotal = new GstObject().getDefaultValues();
    let deletedGstTotal = new GstObject().getDefaultValues();

    let b2bData = [];
    let b2bCancelledData = [];
    let b2cCancelledData = [];
    let b2cData = [];
    let errorData = [];

    if (xlsxData && xlsxData.length > 0) {
      let type = '';
      for (let i = 0; i < xlsxData.length; i++) {
        type = 'B2C';
        if (
          xlsxData[i].customerGSTNo === '' ||
          xlsxData[i].customerGSTNo === null ||
          xlsxData[i].customerGSTNo === undefined
        ) {
          if (
            (xlsxData[i].isCancelled && xlsxData[i].isCancelled === true) ||
            xlsxData[i].einvoiceBillStatus === 'Cancelled'
          ) {
            b2cCancelledData.push(xlsxData[i]);
          } else {
            b2cData.push(xlsxData[i]);
          }
        } else {
          type = 'B2B';
          if (
            (xlsxData[i].isCancelled && xlsxData[i].isCancelled === true) ||
            xlsxData[i].einvoiceBillStatus === 'Cancelled'
          ) {
            b2bCancelledData.push(xlsxData[i]);
          } else {
            b2bData.push(xlsxData[i]);
          }
        }

        let prodMessage = '';
        for (let product of xlsxData[i].item_list) {
          if (
            product.cgst_amount === 0 &&
            product.sgst_amount === 0 &&
            product.igst_amount === 0 &&
            (product.discount_percent === 0 ||
              product.discount_percent == null ||
              product.discount_percent === undefined)
          ) {
            prodMessage += product.item_name + ' - Tax rate is not defined.\n';
          }

          if (product.hsn === '') {
            prodMessage += product.item_name + ' - HSN is not defined.\n';
          }
        }

        if (prodMessage !== '') {
          errorData.push({
            sequenceNumber: xlsxData[i].sequenceNumber,
            customerName: xlsxData[i].customer_name,
            type: type,
            errorMessage: prodMessage
          });
        }
      }
    }

    // Create a workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    await prepareSalesSheet(workbook, auditSettingsExists, xlsxData, deletedData, deletedGstTotal);
    await prepareSalesReturnSheet(workbook, auditSettingsExists);
    await prepareB2BSheet(
      workbook,
      auditSettingsExists,
      b2bData,
      b2bCancelledData,
      b2bGstTotal,
      b2bCancelledGstTotal,
      defaultState
    );
    await prepareB2CSheet(
      workbook,
      auditSettingsExists,
      b2cData,
      b2cCancelledData,
      b2cGstTotal,
      b2cCancelledGstTotal,
      defaultState
    );
    if(errorData.length > 0) {
   // await prepareErrorSheet(workbook, errorData);
    }

    //prepareHSN
    // if (b2bData.length > 0 || b2cData.length > 0) {
    //   worksheet.addRow({});
    //   worksheet.addRow({});
    //   totalRowsDrawn += 2;

    //   await prepareSubtitle(
    //     'HSN SUMMARY TOTAL',
    //     worksheet,
    //     totalRowsDrawn,
    //     'FF00EE90'
    //   );
    //   totalRowsDrawn += 1;

    //   const row = worksheet.addRow({});
    //   row.getCell('invoiceNumber').value = 'Taxable Amount';
    //   row.getCell('invoiceNumber').font = {
    //     bold: true
    //   };
    //   row.getCell('invoiceNumber').border = {
    //     top: { style: 'thin' },
    //     bottom: { style: 'thin' }
    //   };
    //   row.getCell('date').value = 'CAMT';
    //   row.getCell('date').font = {
    //     bold: true
    //   };
    //   row.getCell('date').border = {
    //     top: { style: 'thin' },
    //     bottom: { style: 'thin' }
    //   };
    //   row.getCell('customerName').value = 'SAMT';
    //   row.getCell('customerName').font = {
    //     bold: true
    //   };
    //   row.getCell('customerName').border = {
    //     top: { style: 'thin' },
    //     bottom: { style: 'thin' }
    //   };

    //   row.getCell('gstin').value = 'IAMT';
    //   row.getCell('gstin').font = {
    //     bold: true
    //   };
    //   row.getCell('gstin').border = {
    //     top: { style: 'thin' },
    //     bottom: { style: 'thin' }
    //   };
    //   totalRowsDrawn += 1;

    //   const dataRow = worksheet.addRow({});
    //   dataRow.getCell('invoiceNumber').value = getTaxableTotal(
    //     b2bGstTotal,
    //     b2cGstTotal
    //   );
    //   dataRow.getCell('invoiceNumber').font = {
    //     bold: true
    //   };
    //   dataRow.getCell('invoiceNumber').border = {
    //     top: { style: 'thin' },
    //     bottom: { style: 'thin' }
    //   };
    //   dataRow.getCell('date').value = getCAMTTaxableTotal(
    //     b2bGstTotal,
    //     b2cGstTotal
    //   );
    //   dataRow.getCell('date').font = {
    //     bold: true
    //   };
    //   dataRow.getCell('date').border = {
    //     top: { style: 'thin' },
    //     bottom: { style: 'thin' }
    //   };
    //   dataRow.getCell('customerName').value = getSAMTTaxableTotal(
    //     b2bGstTotal,
    //     b2cGstTotal
    //   );
    //   dataRow.getCell('customerName').font = {
    //     bold: true
    //   };
    //   dataRow.getCell('customerName').border = {
    //     top: { style: 'thin' },
    //     bottom: { style: 'thin' }
    //   };

    //   dataRow.getCell('gstin').value = getIAMTTaxableTotal(
    //     b2bGstTotal,
    //     b2cGstTotal
    //   );
    //   dataRow.getCell('gstin').font = {
    //     bold: true
    //   };
    //   dataRow.getCell('gstin').border = {
    //     top: { style: 'thin' },
    //     bottom: { style: 'thin' }
    //   };
    //   totalRowsDrawn += 1;
    // }

    // Generate Excel file buffer
    workbook.xlsx.writeBuffer().then((buffer) => {
      // Create a Blob from the buffer
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);
      // Create a link element
      const a = document.createElement('a');
      // Set the link's href attribute to the URL of the Blob
      a.href = url;
      // Set the download attribute to specify the filename
      const fileName =
        localStorage.getItem('businessName') +
        '_Audit_Report_' +
        getSelectedDateMonthAndYearMMYYYY(fromDate);
      a.download = fileName + '.xlsx';
      // Append the link to the body
      document.body.appendChild(a);
      // Click the link programmatically to start the download
      a.click();
      // Remove the link from the body
      document.body.removeChild(a);
    });
  };

  const prepareSalesSheet = async (
    workbook,
    auditSettingsExists,
    xlsxData,
    deletedData,
    deletedGstTotal
  ) => {
    const worksheet = workbook.addWorksheet('SALES (' + xlsxData.length + ')');

    let filteredColumns = [];
    await prepareHeaderRow(filteredColumns, auditSettingsExists);

    worksheet.columns = filteredColumns;

    let totalRowsDrawn = 0;

    // Make header row bold and color header cells
    const headerRow = worksheet.getRow(1);
    formatHeaderRow(headerRow);
    totalRowsDrawn += 1;

    let taxData = await getTaxSettingsDetails();
    let defaultState = getStateList().find((e) => e.name === taxData.state);
    let gstTotal = new GstObject().getDefaultValues();

    if (xlsxData && xlsxData.length > 0) {
      for (let i = 0; i < xlsxData.length; i++) {
        // Add a blank row
        let newRow = worksheet.addRow({});
        await prepareDataRow(
          newRow,
          xlsxData[i],
          gstTotal,
          auditSettingsExists,
          defaultState
        );

        if (
          (xlsxData[i].isCancelled && xlsxData[i].isCancelled === true) ||
          xlsxData[i].einvoiceBillStatus === 'Cancelled'
        ) {
          applyColorToRow(worksheet, newRow, 'FFFF474C');
        }
      }

      totalRowsDrawn += xlsxData.length;
    }

    if (deletedData && deletedData.length > 0) {
      worksheet.addRow({});
      worksheet.addRow({});
      totalRowsDrawn += 2;

      await prepareSubtitle(
        'DELETED INVOICES',
        worksheet,
        totalRowsDrawn,
        'FFFF474C'
      );
      totalRowsDrawn += 1;

      for (let record of deletedData) {
        let parsedData = JSON.parse(record.data);

        // Add a blank row
        const newRow = worksheet.addRow({});
        await prepareDataRow(
          newRow,
          parsedData,
          deletedGstTotal,
          auditSettingsExists,
          defaultState
        );
      }

      totalRowsDrawn += deletedData.length;

      // Add a b2c total row
      const deletedTotalRow = worksheet.addRow({});
      await prepareTotalRow(
        deletedTotalRow,
        deletedGstTotal,
        auditSettingsExists,
        'Deleted Total'
      );

      totalRowsDrawn += 1;
    }
  };

  const prepareSalesReturnSheet = async (workbook, auditSettingsExists) => {
    const worksheet = workbook.addWorksheet('SALES RETURN');
  };

  const prepareB2BSheet = async (
    workbook,
    auditSettingsExists,
    b2bData,
    b2bCancelledData,
    b2bGstTotal,
    b2bCancelledGstTotal,
    defaultState
  ) => {
    const worksheet = workbook.addWorksheet('B2B');

    let filteredColumns = [];
    let totalRowsDrawn = 2;
    await prepareHeaderRow(filteredColumns, auditSettingsExists);

    worksheet.columns = filteredColumns;

    // Make header row bold and color header cells
    const headerRow = worksheet.getRow(1);
    formatHeaderRow(headerRow);

    if (b2bData.length > 0) {
      await prepareSubtitle(
        'B2B INVOICES',
        worksheet,
        totalRowsDrawn,
        'FF00EE90'
      );
      totalRowsDrawn += 1;

      for (let record of b2bData) {
        // Add a blank row
        const newRow = worksheet.addRow({});
        await prepareDataRow(
          newRow,
          record,
          b2bGstTotal,
          auditSettingsExists,
          defaultState
        );
      }
      totalRowsDrawn += b2bData.length;

      const b2bTotalRow = worksheet.addRow({});
      await prepareTotalRow(
        b2bTotalRow,
        b2bGstTotal,
        auditSettingsExists,
        'B2B Total'
      );

      totalRowsDrawn += 1;
    }

    if (b2bCancelledData.length > 0) {
      worksheet.addRow({});
      worksheet.addRow({});

      totalRowsDrawn += 2;

      await prepareSubtitle(
        'B2B CANCELLED INVOICES',
        worksheet,
        totalRowsDrawn,
        'FFFF474C'
      );
      totalRowsDrawn += 1;

      for (let record of b2bCancelledData) {
        // Add a blank row
        const newRow = worksheet.addRow({});
        await prepareDataRow(
          newRow,
          record,
          b2bCancelledGstTotal,
          auditSettingsExists,
          defaultState
        );
      }
      totalRowsDrawn += b2bCancelledData.length;

      // Add a b2b total row
      const b2bCancelledTotalRow = worksheet.addRow({});
      await prepareTotalRow(
        b2bCancelledTotalRow,
        b2bCancelledGstTotal,
        auditSettingsExists,
        'B2B Cancelled Total'
      );

      totalRowsDrawn += 1;
    }

    if (b2bData.length > 0) {
      worksheet.addRow({});
      worksheet.addRow({});
      totalRowsDrawn += 2;

      worksheet.addRow({});
      totalRowsDrawn += 1;
      totalRowsDrawn = await preparePaymentSnapshot(
        worksheet,
        b2bGstTotal,
        totalRowsDrawn,
        'B2B'
      );

      totalRowsDrawn = await prepareSalesSnapshot(
        worksheet,
        b2bGstTotal,
        totalRowsDrawn,
        auditSettings
      );

      worksheet.addRow({});
      totalRowsDrawn += 1;

      const row = worksheet.addRow({});
      row.getCell('gstin').value = getB2BPaymentTotal(b2bGstTotal);
      row.getCell('gstin').font = {
        bold: true
      };
      row.getCell('gstin').border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      row.getCell('invoiceValue').value = getB2BSalesTotal(b2bGstTotal);
      row.getCell('invoiceValue').font = {
        bold: true
      };
      row.getCell('invoiceValue').border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      let isDrawn = false;
      if (auditSettingsExists) {
        if (auditSettings.taxApplicability.includes(0)) {
          row.getCell('zerotaxable').value = b2bGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(3) && !isDrawn) {
          row.getCell('threetaxable').value = b2bGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(5) && !isDrawn) {
          row.getCell('fivetaxable').value = b2bGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(12) && !isDrawn) {
          row.getCell('twelvetaxable').value = b2bGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(18) && !isDrawn) {
          row.getCell('eighteentaxable').value = b2bGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(28) && !isDrawn) {
          row.getCell('twentyeighttaxable').value = b2bGstTotal.roundoff;
          isDrawn = true;
        }
      }
      totalRowsDrawn += 1;
    }
  };

  const prepareB2CSheet = async (
    workbook,
    auditSettingsExists,
    b2cData,
    b2cCancelledData,
    b2cGstTotal,
    b2cCancelledGstTotal,
    defaultState
  ) => {
    const worksheet = workbook.addWorksheet('B2C');

    let filteredColumns = [];
    let totalRowsDrawn = 1;
    await prepareHeaderRow(filteredColumns, auditSettingsExists);

    worksheet.columns = filteredColumns;

    // Make header row bold and color header cells
    const headerRow = worksheet.getRow(1);
    formatHeaderRow(headerRow);

    if (b2cData.length > 0) {

      for (let record of b2cData) {
        // Add a blank row
        const newRow = worksheet.addRow({});
        await prepareDataRow(
          newRow,
          record,
          b2cGstTotal,
          auditSettingsExists,
          defaultState
        );
      }

      totalRowsDrawn += b2cData.length;

      // Add a b2c total row
      const b2cTotalRow = worksheet.addRow({});
      await prepareTotalRow(
        b2cTotalRow,
        b2cGstTotal,
        auditSettingsExists,
        'B2C Total'
      );

      totalRowsDrawn += 1;
    }

    if (b2cCancelledData.length > 0) {
      worksheet.addRow({});
      worksheet.addRow({});
      totalRowsDrawn += 2;

      await prepareSubtitle(
        'B2C CANCELLED INVOICES',
        worksheet,
        totalRowsDrawn,
        'FFFF474C'
      );
      totalRowsDrawn += 1;

      for (let record of b2cCancelledData) {
        // Add a blank row
        const newRow = worksheet.addRow({});
        await prepareDataRow(
          newRow,
          record,
          b2cCancelledGstTotal,
          auditSettingsExists,
          defaultState
        );
      }
      totalRowsDrawn += b2cCancelledData.length;

      // Add a b2c total row
      const b2cCancelledTotalRow = worksheet.addRow({});
      await prepareTotalRow(
        b2cCancelledTotalRow,
        b2cCancelledGstTotal,
        auditSettingsExists,
        'B2C Cancelled Total'
      );

      totalRowsDrawn += 1;
    }

    if (b2cData.length > 0) {
      worksheet.addRow({});
      worksheet.addRow({});
      totalRowsDrawn += 2;

      worksheet.addRow({});
      totalRowsDrawn += 1;
      totalRowsDrawn = await preparePaymentSnapshot(
        worksheet,
        b2cGstTotal,
        totalRowsDrawn,
        'B2C'
      );

      worksheet.addRow({});
      totalRowsDrawn += 1;

      totalRowsDrawn = await prepareSalesSnapshot(
        worksheet,
        b2cGstTotal,
        totalRowsDrawn,
        auditSettings
      );

      worksheet.addRow({});
      totalRowsDrawn += 1;

      const row = worksheet.addRow({});
      row.getCell('gstin').value = getB2CPaymentTotal(b2cGstTotal);
      row.getCell('gstin').font = {
        bold: true
      };
      row.getCell('gstin').border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      row.getCell('invoiceValue').value = getB2CSalesTotal(b2cGstTotal);
      row.getCell('invoiceValue').font = {
        bold: true
      };
      row.getCell('invoiceValue').border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      let isDrawn = false;
      if (auditSettingsExists) {
        if (auditSettings.taxApplicability.includes(0)) {
          row.getCell('zerotaxable').value = b2cGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(3) && !isDrawn) {
          row.getCell('threetaxable').value = b2cGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(5) && !isDrawn) {
          row.getCell('fivetaxable').value = b2cGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(12) && !isDrawn) {
          row.getCell('twelvetaxable').value = b2cGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(18) && !isDrawn) {
          row.getCell('eighteentaxable').value = b2cGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(28) && !isDrawn) {
          row.getCell('twentyeighttaxable').value = b2cGstTotal.roundoff;
          isDrawn = true;
        }
      }

      totalRowsDrawn += 1;
    }
  };

  const prepareErrorSheet = async (workbook, errorData) => {
    const worksheet = workbook.addWorksheet('ERROR');

    let totalRowsDrawn = 0;

    if (errorData && errorData.length > 0) {
      for (let record of errorData) {
        const row = worksheet.addRow({});
        row.getCell('invoiceNumber').value = record.sequenceNumber;
        row.getCell('date').value = record.type;
        row.getCell('customerName').value = record.customerName;

        row.getCell('gstin').value = record.errorMessage;
        row.getCell('gstin').alignment = {
          vertical: 'top',
          wrapText: true
        };
      }

      totalRowsDrawn += errorData.length;
    }
  };

  const formatHeaderRow = (headerRow) => {
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'd8f3fc' } // Yellow color
      };
      cell.font = { bold: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  };

  const getB2BPaymentTotal = (b2bGstTotal) => {
    return (
      b2bGstTotal.cash +
      b2bGstTotal.creditnote +
      b2bGstTotal.upi +
      b2bGstTotal.card +
      b2bGstTotal.neft +
      b2bGstTotal.cheque +
      b2bGstTotal.balancedue
    );
  };

  const getB2CPaymentTotal = (b2cGstTotal) => {
    return (
      b2cGstTotal.cash +
      b2cGstTotal.creditnote +
      b2cGstTotal.upi +
      b2cGstTotal.card +
      b2cGstTotal.neft +
      b2cGstTotal.cheque +
      b2cGstTotal.balancedue
    );
  };

  const getB2BSalesTotal = (b2bGstTotal) => {
    return (
      b2bGstTotal.zerotaxable +
      b2bGstTotal.zerocgst +
      b2bGstTotal.zerosgst +
      b2bGstTotal.zeroigst +
      b2bGstTotal.threetaxable +
      b2bGstTotal.threecgst +
      b2bGstTotal.threesgst +
      b2bGstTotal.threeigst +
      b2bGstTotal.fivetaxable +
      b2bGstTotal.fivecgst +
      b2bGstTotal.fivesgst +
      b2bGstTotal.fiveigst +
      b2bGstTotal.twelvetaxable +
      b2bGstTotal.twelvecgst +
      b2bGstTotal.twelvesgst +
      b2bGstTotal.twelveigst +
      b2bGstTotal.eighteentaxable +
      b2bGstTotal.eighteencgst +
      b2bGstTotal.eighteensgst +
      b2bGstTotal.eighteenigst +
      b2bGstTotal.twentyeighttaxable +
      b2bGstTotal.twentyeightcgst +
      b2bGstTotal.twentyeightsgst +
      b2bGstTotal.twentyeightigst
    );
  };

  const getB2CSalesTotal = (b2cGstTotal) => {
    return (
      b2cGstTotal.zerotaxable +
      b2cGstTotal.zerocgst +
      b2cGstTotal.zerosgst +
      b2cGstTotal.zeroigst +
      b2cGstTotal.threetaxable +
      b2cGstTotal.threecgst +
      b2cGstTotal.threesgst +
      b2cGstTotal.threeigst +
      b2cGstTotal.fivetaxable +
      b2cGstTotal.fivecgst +
      b2cGstTotal.fivesgst +
      b2cGstTotal.fiveigst +
      b2cGstTotal.twelvetaxable +
      b2cGstTotal.twelvecgst +
      b2cGstTotal.twelvesgst +
      b2cGstTotal.twelveigst +
      b2cGstTotal.eighteentaxable +
      b2cGstTotal.eighteencgst +
      b2cGstTotal.eighteensgst +
      b2cGstTotal.eighteenigst +
      b2cGstTotal.twentyeighttaxable +
      b2cGstTotal.twentyeightcgst +
      b2cGstTotal.twentyeightsgst +
      b2cGstTotal.twentyeightigst
    );
  };

  const getTaxableTotal = (b2bGstTotal, b2cGstTotal) => {
    return (
      b2bGstTotal.zerotaxable +
      b2bGstTotal.threetaxable +
      b2bGstTotal.fivetaxable +
      b2bGstTotal.twelvetaxable +
      b2bGstTotal.eighteentaxable +
      b2bGstTotal.twentyeighttaxable +
      b2cGstTotal.zerotaxable +
      b2cGstTotal.threetaxable +
      b2cGstTotal.fivetaxable +
      b2cGstTotal.twelvetaxable +
      b2cGstTotal.eighteentaxable +
      b2cGstTotal.twentyeighttaxable
    );
  };

  const getCAMTTaxableTotal = (b2bGstTotal, b2cGstTotal) => {
    return (
      b2bGstTotal.zerocgst +
      b2bGstTotal.threecgst +
      b2bGstTotal.fivecgst +
      b2bGstTotal.twelvecgst +
      b2bGstTotal.eighteencgst +
      b2bGstTotal.twentyeightcgst +
      b2cGstTotal.zerocgst +
      b2cGstTotal.threecgst +
      b2cGstTotal.fivecgst +
      b2cGstTotal.twelvecgst +
      b2cGstTotal.eighteencgst +
      b2cGstTotal.twentyeightcgst
    );
  };

  const getSAMTTaxableTotal = (b2bGstTotal, b2cGstTotal) => {
    return (
      b2bGstTotal.zerosgst +
      b2bGstTotal.threesgst +
      b2bGstTotal.fivesgst +
      b2bGstTotal.twelvesgst +
      b2bGstTotal.eighteensgst +
      b2bGstTotal.twentyeightsgst +
      b2cGstTotal.zerosgst +
      b2cGstTotal.threesgst +
      b2cGstTotal.fivesgst +
      b2cGstTotal.twelvesgst +
      b2cGstTotal.eighteensgst +
      b2cGstTotal.twentyeightsgst
    );
  };

  const getIAMTTaxableTotal = (b2bGstTotal, b2cGstTotal) => {
    return (
      b2bGstTotal.zeroigst +
      b2bGstTotal.threeigst +
      b2bGstTotal.fiveigst +
      b2bGstTotal.twelveigst +
      b2bGstTotal.eighteenigst +
      b2bGstTotal.twentyeightigst +
      b2cGstTotal.zeroigst +
      b2cGstTotal.threeigst +
      b2cGstTotal.fiveigst +
      b2cGstTotal.twelveigst +
      b2cGstTotal.eighteenigst +
      b2cGstTotal.twentyeightigst
    );
  };

  const preparePaymentSnapshot = (worksheet, total, totalRowsDrawn, type) => {
    preparePaymentsWorkingRow(worksheet, 'CASH', total.cash, type);
    preparePaymentsWorkingRow(worksheet, 'CREDIT NOTE', total.creditnote);
    preparePaymentsWorkingRow(worksheet, 'UPI', total.upi);
    preparePaymentsWorkingRow(worksheet, 'CARD', total.card);
    preparePaymentsWorkingRow(worksheet, 'NEFT', total.neft);
    preparePaymentsWorkingRow(worksheet, 'CHEQUE', total.cheque);
    preparePaymentsWorkingRow(worksheet, 'DEBTORS', total.balancedue);
    totalRowsDrawn += 7;

    return totalRowsDrawn;
  };

  const prepareSalesSnapshot = (
    worksheet,
    total,
    totalRowsDrawn,
    auditSettingsExists,
    type
  ) => {
    worksheet.addRow({});
    totalRowsDrawn += 1;

    if (auditSettingsExists) {
      if (auditSettings.taxApplicability.includes(0)) {
        prepareSalesWorkingRow(worksheet, 'SALES 0%', total.zerotaxable, type);
        prepareSalesWorkingRow(worksheet, 'CGST 0%', total.zerocgst);
        prepareSalesWorkingRow(worksheet, 'SGST 0%', total.zerosgst);
        prepareSalesWorkingRow(worksheet, 'IGST 0%', total.zeroigst);
        totalRowsDrawn += 4;
      }

      if (auditSettings.taxApplicability.includes(3)) {
        prepareSalesWorkingRow(worksheet, 'SALES 3%', total.threetaxable, type);
        prepareSalesWorkingRow(worksheet, 'CGST 3%', total.threecgst);
        prepareSalesWorkingRow(worksheet, 'SGST 3%', total.threesgst);
        prepareSalesWorkingRow(worksheet, 'IGST 3%', total.threeigst);
        totalRowsDrawn += 4;
      }

      if (auditSettings.taxApplicability.includes(5)) {
        prepareSalesWorkingRow(worksheet, 'SALES 5%', total.fivetaxable, type);
        prepareSalesWorkingRow(worksheet, 'CGST 5%', total.fivecgst);
        prepareSalesWorkingRow(worksheet, 'SGST 5%', total.fivesgst);
        prepareSalesWorkingRow(worksheet, 'IGST 5%', total.fiveigst);
        totalRowsDrawn += 4;
      }

      if (auditSettings.taxApplicability.includes(12)) {
        prepareSalesWorkingRow(
          worksheet,
          'SALES 12%',
          total.twelvetaxable,
          type
        );
        prepareSalesWorkingRow(worksheet, 'CGST 12%', total.twelvecgst);
        prepareSalesWorkingRow(worksheet, 'SGST 12%', total.twelvesgst);
        prepareSalesWorkingRow(worksheet, 'IGST 12%', total.twelveigst);
        totalRowsDrawn += 4;
      }

      if (auditSettings.taxApplicability.includes(18)) {
        prepareSalesWorkingRow(
          worksheet,
          'SALES 18%',
          total.eighteentaxable,
          type
        );
        prepareSalesWorkingRow(worksheet, 'CGST 18%', total.eighteencgst);
        prepareSalesWorkingRow(worksheet, 'SGST 18%', total.eighteensgst);
        prepareSalesWorkingRow(worksheet, 'IGST 18%', total.eighteensgst);
        totalRowsDrawn += 4;
      }

      if (auditSettings.taxApplicability.includes(28)) {
        prepareSalesWorkingRow(
          worksheet,
          'SALES 28%',
          total.twentyeighttaxable,
          type
        );
        prepareSalesWorkingRow(worksheet, 'CGST 28%', total.twentyeightcgst);
        prepareSalesWorkingRow(worksheet, 'SGST 28%', total.twentyeightsgst);
        prepareSalesWorkingRow(worksheet, 'IGST 28%', total.twentyeightigst);
        totalRowsDrawn += 4;
      }
    }

    return totalRowsDrawn;
  };

  const preparePaymentsWorkingRow = (worksheet, title, value, type) => {
    const row = worksheet.addRow({});
    if (type) {
      row.getCell('date').value = type;
      row.getCell('date').font = {
        bold: true
      };
    }

    row.getCell('customerName').value = title;
    row.getCell('customerName').font = {
      bold: true
    };
    row.getCell('gstin').value = value;
    row.getCell('gstin').font = {
      bold: true
    };
  };

  const prepareSalesWorkingRow = (worksheet, title, value, type) => {
    const row = worksheet.addRow({});

    if (type) {
      row.getCell('date').value = type;
      row.getCell('date').font = {
        bold: true
      };
    }
    row.getCell('invoiceNumber').value = '';
    row.getCell('customerName').value = title;
    row.getCell('customerName').font = {
      bold: true
    };
    row.getCell('gstin').value = '';
    row.getCell('placeOfSupply').value = '';
    row.getCell('invoiceValue').value = value;
    row.getCell('invoiceValue').font = {
      bold: true
    };
  };

  const prepareHeaderRow = (filteredColumns, auditSettingsExists) => {
    filteredColumns.push({
      header: 'INVOICE NUMBER',
      key: 'invoiceNumber',
      width: 15
    });
    filteredColumns.push({ header: 'DATE', key: 'date', width: 15 });
    filteredColumns.push({
      header: 'CUSTOMER NAME',
      key: 'customerName',
      width: 20
    });
    filteredColumns.push({ header: 'GSTIN/UIN', key: 'gstin', width: 20 });
    filteredColumns.push({
      header: 'POS',
      key: 'placeOfSupply',
      width: 8
    });
    filteredColumns.push({
      header: 'INVOICE VALUE',
      key: 'invoiceValue',
      width: 20
    });
    if (auditSettingsExists) {
      if (auditSettings.taxApplicability.includes(0)) {
        filteredColumns.push({
          header: 'GST % - TAXABLE',
          key: 'zerotaxable',
          width: 20
        });
        filteredColumns.push({
          header: 'GST % - SGST',
          key: 'zerosgst',
          width: 15
        });
        filteredColumns.push({
          header: 'GST % - CGST',
          key: 'zerocgst',
          width: 15
        });
        filteredColumns.push({
          header: 'GST % - IGST',
          key: 'zeroigst',
          width: 15
        });
      }

      if (auditSettings.taxApplicability.includes(3)) {
        filteredColumns.push({
          header: 'GST 3% - TAXABLE',
          key: 'threetaxable',
          width: 20
        });
        filteredColumns.push({
          header: 'GST 1.5% - SGST',
          key: 'threesgst',
          width: 15
        });
        filteredColumns.push({
          header: 'GST 1.5% - CGST',
          key: 'threecgst',
          width: 15
        });
        filteredColumns.push({
          header: 'GST 3% - IGST',
          key: 'threeigst',
          width: 15
        });
      }

      if (auditSettings.taxApplicability.includes(5)) {
        filteredColumns.push({
          header: 'GST 5% - TAXABLE',
          key: 'fivetaxable',
          width: 20
        });
        filteredColumns.push({
          header: 'GST 2.5% - SGST',
          key: 'fivesgst',
          width: 15
        });
        filteredColumns.push({
          header: 'GST 2.5% - CGST',
          key: 'fivecgst',
          width: 15
        });
        filteredColumns.push({
          header: 'GST 5% - IGST',
          key: 'fiveigst',
          width: 15
        });
      }

      if (auditSettings.taxApplicability.includes(12)) {
        filteredColumns.push({
          header: 'GST 12% - TAXABLE',
          key: 'twelvetaxable',
          width: 20
        });
        filteredColumns.push({
          header: 'GST 6% - SGST',
          key: 'twelvesgst',
          width: 15
        });
        filteredColumns.push({
          header: 'GST 6% - CGST',
          key: 'twelvecgst',
          width: 15
        });
        filteredColumns.push({
          header: 'GST 12% - IGST',
          key: 'twelveigst',
          width: 15
        });
      }

      if (auditSettings.taxApplicability.includes(18)) {
        filteredColumns.push({
          header: 'GST 18% - TAXABLE',
          key: 'eighteentaxable',
          width: 20
        });
        filteredColumns.push({
          header: 'GST 9% - SGST',
          key: 'eighteensgst',
          width: 15
        });
        filteredColumns.push({
          header: 'GST 9% - CGST',
          key: 'eighteencgst',
          width: 15
        });
        filteredColumns.push({
          header: 'GST 18% - IGST',
          key: 'eighteenigst',
          width: 15
        });
      }

      if (auditSettings.taxApplicability.includes(28)) {
        filteredColumns.push({
          header: 'GST 28% - TAXABLE',
          key: 'twentyeighttaxable',
          width: 20
        });
        filteredColumns.push({
          header: 'GST 14% - SGST',
          key: 'twentyeightsgst',
          width: 15
        });
        filteredColumns.push({
          header: 'GST 14% - CGST',
          key: 'twentyeightcgst',
          width: 15
        });
        filteredColumns.push({
          header: 'GST 28% - IGST',
          key: 'twentyeightigst',
          width: 15
        });
      }
    }

    filteredColumns.push({ header: 'ROUND OFF', key: 'roundOff', width: 15 });
    filteredColumns.push({ header: 'CASH', key: 'cash', width: 15 });
    filteredColumns.push({
      header: 'CREDIT NOTE',
      key: 'creditNote',
      width: 15
    });
    filteredColumns.push({ header: 'UPI', key: 'upi', width: 15 });
    filteredColumns.push({ header: 'CARD', key: 'card', width: 15 });
    filteredColumns.push({ header: 'NEFT/RTGS', key: 'neft', width: 15 });
    filteredColumns.push({ header: 'CHEQUE', key: 'cheque', width: 15 });
    filteredColumns.push({ header: 'GIFT CARD', key: 'giftCard', width: 15 });
    filteredColumns.push({
      header: 'CUSTOM FINANCE',
      key: 'customFinance',
      width: 15
    });
    filteredColumns.push({
      header: 'EXCHANGE',
      key: 'exchange',
      width: 15
    });
    filteredColumns.push({
      header: 'BALANCE DUE',
      key: 'balanceDue',
      width: 20
    });
    filteredColumns.push({ header: 'DUE DATE', key: 'dueDate', width: 10 });
    filteredColumns.push({ header: 'IRN', key: 'irn', width: 30 });
    filteredColumns.push({ header: 'E-WAY', key: 'eway', width: 25 });

    salesReportFilters.forEach((filter) => {
      if (filter.name === 'Gross Weight' && filter.val === true) {
        filteredColumns.push({
          header: 'GROSS WEIGHT',
          key: 'grossWeight',
          width: 20
        });
      }

      if (filter.name === 'Wastage' && filter.val === true) {
        filteredColumns.push({ header: 'WASTAGE', key: 'wastage', width: 20 });
      }

      if (filter.name === 'Net Weight' && filter.val === true) {
        filteredColumns.push({
          header: 'NET WEIGHT',
          key: 'netWeight',
          width: 20
        });
      }

      if (filter.name === 'Making Charge' && filter.val === true) {
        filteredColumns.push({
          header: 'MAKING C.',
          key: 'makingCharge',
          width: 20
        });
      }

      if (filter.name === 'Making Charge/g' && filter.val === true) {
        filteredColumns.push({
          header: 'MAKING C. PER GRAM',
          key: 'makingChargePerGram',
          width: 20
        });
      }
    });

    filteredColumns.push({
      header: 'TOTAL ITEM DISC',
      key: 'totalDisc',
      width: 20
    });

    filteredColumns.push({
      header: 'TOTAL BILL DISC',
      key: 'totalBillDisc',
      width: 20
    });
  };

  const prepareDataRow = (
    newRow,
    rowData,
    totalGST,
    auditSettingsExists,
    defaultState
  ) => {
    // Set values for the specific row (1-based index)
    newRow.getCell('invoiceNumber').value = rowData.sequenceNumber;
    newRow.getCell('date').value = formatDownloadExcelDate(
      rowData.invoice_date
    );
    newRow.getCell('customerName').value = rowData.customer_name;
    newRow.getCell('gstin').value = rowData.customerGSTNo;
    newRow.getCell('placeOfSupply').value = rowData.place_of_supply
      ? rowData.place_of_supply
      : defaultState
      ? defaultState.val
      : '';
    newRow.getCell('invoiceValue').value = parseFloat(
      rowData.total_amount || 0
    );
    totalGST.invoiceValue += parseFloat(rowData.total_amount || 0);

    // To add dynamic GST data
    if (auditSettingsExists) {
      if (auditSettings.taxApplicability.includes(0)) {
        newRow.getCell('zerotaxable').value = parseFloat(
          rowData.taxable_zero || 0
        );
        newRow.getCell('zerosgst').value = parseFloat(
          rowData.sgst_amount_zero || 0
        );
        newRow.getCell('zerocgst').value = parseFloat(
          rowData.cgst_amount_zero || 0
        );
        newRow.getCell('zeroigst').value = parseFloat(
          rowData.igst_amount_zero || 0
        );

        totalGST.zerotaxable += parseFloat(rowData.taxable_zero || 0);
        totalGST.zerosgst += parseFloat(rowData.sgst_amount_zero || 0);
        totalGST.zerocgst += parseFloat(rowData.cgst_amount_zero || 0);
        totalGST.zeroigst += parseFloat(rowData.igst_amount_zero || 0);
      }

      if (auditSettings.taxApplicability.includes(3)) {
        newRow.getCell('threetaxable').value = parseFloat(
          rowData.taxable_three || 0
        );
        newRow.getCell('threesgst').value = parseFloat(
          rowData.sgst_amount_three || 0
        );
        newRow.getCell('threecgst').value = parseFloat(
          rowData.cgst_amount_three || 0
        );
        newRow.getCell('threeigst').value = parseFloat(
          rowData.igst_amount_three || 0
        );

        totalGST.threetaxable += parseFloat(rowData.taxable_three || 0);
        totalGST.threesgst += parseFloat(rowData.sgst_amount_three || 0);
        totalGST.threecgst += parseFloat(rowData.cgst_amount_three || 0);
        totalGST.threeigst += parseFloat(rowData.igst_amount_three || 0);
      }

      if (auditSettings.taxApplicability.includes(5)) {
        newRow.getCell('fivetaxable').value = parseFloat(
          rowData.taxable_five || 0
        );
        newRow.getCell('fivesgst').value = parseFloat(
          rowData.sgst_amount_five || 0
        );
        newRow.getCell('fivecgst').value = parseFloat(
          rowData.cgst_amount_five || 0
        );
        newRow.getCell('fiveigst').value = parseFloat(
          rowData.igst_amount_five || 0
        );

        totalGST.fivetaxable += parseFloat(rowData.taxable_five || 0);
        totalGST.fivesgst += parseFloat(rowData.sgst_amount_five || 0);
        totalGST.fivecgst += parseFloat(rowData.cgst_amount_five || 0);
        totalGST.fiveigst += parseFloat(rowData.igst_amount_five || 0);
      }

      if (auditSettings.taxApplicability.includes(12)) {
        newRow.getCell('twelvetaxable').value = parseFloat(
          rowData.taxable_twelve || 0
        );
        newRow.getCell('twelvesgst').value = parseFloat(
          rowData.sgst_amount_twelve || 0
        );
        newRow.getCell('twelvecgst').value = parseFloat(
          rowData.cgst_amount_twelve || 0
        );
        newRow.getCell('twelveigst').value = parseFloat(
          rowData.igst_amount_twelve || 0
        );

        totalGST.twelvetaxable += parseFloat(rowData.taxable_twelve || 0);
        totalGST.twelvesgst += parseFloat(rowData.sgst_amount_twelve || 0);
        totalGST.twelvecgst += parseFloat(rowData.cgst_amount_twelve || 0);
        totalGST.twelveigst += parseFloat(rowData.igst_amount_twelve || 0);
      }

      if (auditSettings.taxApplicability.includes(18)) {
        newRow.getCell('eighteentaxable').value = parseFloat(
          rowData.taxable_eighteen || 0
        );
        newRow.getCell('eighteensgst').value = parseFloat(
          rowData.sgst_amount_eighteen || 0
        );
        newRow.getCell('eighteencgst').value = parseFloat(
          rowData.cgst_amount_eighteen || 0
        );
        newRow.getCell('eighteenigst').value = parseFloat(
          rowData.igst_amount_eighteen || 0
        );

        totalGST.eighteentaxable += parseFloat(rowData.taxable_eighteen || 0);
        totalGST.eighteensgst += parseFloat(rowData.sgst_amount_eighteen || 0);
        totalGST.eighteencgst += parseFloat(rowData.cgst_amount_eighteen || 0);
        totalGST.eighteenigst += parseFloat(rowData.igst_amount_eighteen || 0);
      }

      if (auditSettings.taxApplicability.includes(28)) {
        newRow.getCell('twentyeighttaxable').value = parseFloat(
          rowData.taxable_twenty_eight || 0
        );
        newRow.getCell('twentyeightsgst').value = parseFloat(
          rowData.sgst_amount_twenty_eight || 0
        );
        newRow.getCell('twentyeightcgst').value = parseFloat(
          rowData.cgst_amount_twenty_eight || 0
        );
        newRow.getCell('twentyeightigst').value = parseFloat(
          rowData.igst_amount_twenty_eight || 0
        );

        totalGST.twentyeighttaxable += parseFloat(
          rowData.taxable_twenty_eight || 0
        );
        totalGST.twentyeightsgst += parseFloat(
          rowData.sgst_amount_twenty_eight || 0
        );
        totalGST.twentyeightcgst += parseFloat(
          rowData.cgst_amount_twenty_eight || 0
        );
        totalGST.twentyeightigst += parseFloat(
          rowData.igst_amount_twenty_eight || 0
        );
      }
    }

    newRow.getCell('roundOff').value = parseFloat(rowData.round_amount || 0);
    newRow.getCell('cash').value = parseFloat(rowData.cash || 0);
    newRow.getCell('creditNote').value = parseFloat(rowData.creditNote || 0);
    newRow.getCell('upi').value = parseFloat(rowData.upi || 0);
    newRow.getCell('card').value = parseFloat(rowData.card || 0);
    newRow.getCell('neft').value = parseFloat(rowData.netBanking || 0);
    newRow.getCell('cheque').value = parseFloat(rowData.cheque || 0);
    newRow.getCell('giftCard').value = parseFloat(rowData.giftCard || 0);
    newRow.getCell('customFinance').value = parseFloat(
      rowData.customFinance || 0
    );
    newRow.getCell('exchange').value = parseFloat(rowData.exchange || 0);
    newRow.getCell('balanceDue').value = parseFloat(
      rowData.balance_amount || 0
    );

    totalGST.roundoff += parseFloat(rowData.round_amount || 0);
    totalGST.cash += parseFloat(rowData.cash || 0);
    totalGST.creditnote += parseFloat(rowData.creditNote || 0);
    totalGST.upi += parseFloat(rowData.upi || 0);
    totalGST.card += parseFloat(rowData.card || 0);
    totalGST.neft += parseFloat(rowData.netBanking || 0);
    totalGST.cheque += parseFloat(rowData.cheque || 0);
    totalGST.giftcard += parseFloat(rowData.giftCard || 0);
    totalGST.customfinance += parseFloat(rowData.customFinance || 0);
    totalGST.exchange += parseFloat(rowData.exchange || 0);
    totalGST.balancedue += parseFloat(rowData.balance_amount || 0);

    newRow.getCell('irn').value = rowData.irnNo;
    newRow.getCell('eway').value = rowData.ewayBillNo;
    newRow.getCell('dueDate').value = formatDownloadExcelDate(rowData.dueDate);

    salesReportFilters.forEach((filter) => {
      if (filter.name === 'Gross Weight' && filter.val === true) {
        newRow.getCell('grossWeight').value = getGrossWeight(rowData);
      }

      if (filter.name === 'Wastage' && filter.val === true) {
        newRow.getCell('wastage').value = getWastage(rowData);
      }

      if (filter.name === 'Net Weight' && filter.val === true) {
        newRow.getCell('netWeight').value = getNetWeight(rowData);
      }

      if (filter.name === 'Making Charge' && filter.val === true) {
        newRow.getCell('makingCharge').value = getMakingCharge(rowData);
      }

      if (filter.name === 'Making Charge/g' && filter.val === true) {
        newRow.getCell('makingChargePerGram').value =
          getMakingChargePerGram(rowData);
      }
    });

    newRow.getCell('totalDisc').value = getTotalDiscount(rowData);
    newRow.getCell('totalBillDisc').value = rowData.discount_amount;

    totalGST.itemdisc += getTotalDiscount(rowData);
    totalGST.billdisc += parseFloat(rowData.discount_amount).toFixed(2);
  };

  const prepareTotalRow = (
    totalRow,
    totalGST,
    auditSettingsExists,
    totalName
  ) => {
    totalRow.getCell('customerName').value = totalName;
    totalRow.getCell('invoiceValue').value = totalGST.invoiceValue;

    if (auditSettingsExists) {
      if (auditSettings.taxApplicability.includes(0)) {
        totalRow.getCell('zerotaxable').value = totalGST.zerotaxable;
        totalRow.getCell('zerosgst').value = totalGST.zerotaxable;
        totalRow.getCell('zerocgst').value = totalGST.zerocgst;
        totalRow.getCell('zeroigst').value = totalGST.zeroigst;
      }

      if (auditSettings.taxApplicability.includes(3)) {
        totalRow.zeroigst.getCell('threetaxable').value = totalGST.threetaxable;
        totalRow.zeroigst.getCell('threesgst').value = totalGST.threesgst;
        totalRow.zeroigst.getCell('threecgst').value = totalGST.threecgst;
        totalRow.zeroigst.getCell('threeigst').value = totalGST.threeigst;
      }

      if (auditSettings.taxApplicability.includes(5)) {
        totalRow.getCell('fivetaxable').value = totalGST.fivetaxable;
        totalRow.getCell('fivesgst').value = totalGST.fivesgst;
        totalRow.getCell('fivecgst').value = totalGST.fivecgst;
        totalRow.getCell('fiveigst').value = totalGST.fiveigst;
      }

      if (auditSettings.taxApplicability.includes(12)) {
        totalRow.getCell('twelvetaxable').value = totalGST.twelvetaxable;
        totalRow.getCell('twelvesgst').value = totalGST.twelvesgst;
        totalRow.getCell('twelvecgst').value = totalGST.twelvecgst;
        totalRow.getCell('twelveigst').value = totalGST.twelveigst;
      }

      if (auditSettings.taxApplicability.includes(18)) {
        totalRow.getCell('eighteentaxable').value = totalGST.eighteentaxable;
        totalRow.getCell('eighteensgst').value = totalGST.eighteensgst;
        totalRow.getCell('eighteencgst').value = totalGST.eighteencgst;
        totalRow.getCell('eighteenigst').value = totalGST.eighteenigst;
      }

      if (auditSettings.taxApplicability.includes(28)) {
        totalRow.getCell('twentyeighttaxable').value =
          totalGST.twentyeighttaxable;
        totalRow.getCell('twentyeightsgst').value = totalGST.twentyeightsgst;
        totalRow.getCell('twentyeightcgst').value = totalGST.twentyeightcgst;
        totalRow.getCell('twentyeightigst').value = totalGST.twentyeightigst;
      }
    }

    totalRow.getCell('roundOff').value = parseFloat(totalGST.roundoff || 0);
    totalRow.getCell('cash').value = parseFloat(totalGST.cash || 0);
    totalRow.getCell('creditNote').value = parseFloat(totalGST.creditnote || 0);
    totalRow.getCell('upi').value = parseFloat(totalGST.upi || 0);
    totalRow.getCell('card').value = parseFloat(totalGST.card || 0);
    totalRow.getCell('neft').value = parseFloat(totalGST.neft || 0);
    totalRow.getCell('cheque').value = parseFloat(totalGST.cheque || 0);
    totalRow.getCell('giftCard').value = parseFloat(totalGST.giftcard || 0);
    totalRow.getCell('customFinance').value = parseFloat(
      totalGST.customfinance || 0
    );
    totalRow.getCell('exchange').value = parseFloat(totalGST.exchange || 0);
    totalRow.getCell('balanceDue').value = parseFloat(totalGST.balancedue || 0);

    totalRow.getCell('totalDisc').value = parseFloat(totalGST.itemdisc || 0);
    totalRow.getCell('totalBillDisc').value = parseFloat(
      totalGST.billdisc || 0
    );

    totalRow.font = { bold: true };
    totalRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };
    });
  };

  const prepareSubtitle = (title, worksheet, rowNumber, color) => {
    // Define the header
    const header = title;

    let cellNumber = 1;

    worksheet.getRow(rowNumber + 1).getCell(cellNumber).value = header;
    worksheet.getRow(rowNumber + 1).getCell(cellNumber).font = {
      bold: true,
      size: 14
    };

    worksheet.getRow(rowNumber + 1).getCell(cellNumber).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }
    };
    worksheet.getRow(rowNumber + 1).getCell(cellNumber + 1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }
    };
    worksheet.getRow(rowNumber + 1).getCell(cellNumber + 1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }
    };
  };

  const getExcelRawData = async () => {
    // Create a workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('SALES');

    const auditSettingsExists =
      auditSettings &&
      auditSettings.taxApplicability &&
      auditSettings.taxApplicability.length > 0;

    let filteredColumns = [];
    await prepareHeaderRow(filteredColumns, auditSettingsExists);

    worksheet.columns = filteredColumns;

    // Make header row bold and color header cells
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'd8f3fc' } // Yellow color
      };
      cell.font = { bold: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    const xlsxData = await getSaleDataByDatexlsx(fromDate, toDate);

    let taxData = await getTaxSettingsDetails();
    let defaultState = getStateList().find((e) => e.name === taxData.state);
    let gstTotal = new GstObject().getDefaultValues();

    if (xlsxData && xlsxData.length > 0) {
      for (let i = 0; i < xlsxData.length; i++) {
        // Add a blank row
        let newRow = worksheet.addRow({});
        await prepareDataRow(
          newRow,
          xlsxData[i],
          gstTotal,
          auditSettingsExists,
          defaultState
        );

        if (
          (xlsxData[i].isCancelled && xlsxData[i].isCancelled === true) ||
          xlsxData[i].einvoiceBillStatus === 'Cancelled'
        ) {
          applyColorToRow(worksheet, newRow, 'FFFF474C');
        }
      }
    }

    // Generate Excel file buffer
    workbook.xlsx.writeBuffer().then((buffer) => {
      // Create a Blob from the buffer
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);
      // Create a link element
      const a = document.createElement('a');
      // Set the link's href attribute to the URL of the Blob
      a.href = url;
      // Set the download attribute to specify the filename
      const fileName =
        localStorage.getItem('businessName') +
        '_Audit_Report_' +
        getSelectedDateMonthAndYearMMYYYY(fromDate);
      a.download = fileName + '.xlsx';
      // Append the link to the body
      document.body.appendChild(a);
      // Click the link programmatically to start the download
      a.click();
      // Remove the link from the body
      document.body.removeChild(a);
    });
  };

  // Function to apply color to a specific row
  function applyColorToRow(worksheet, row, color) {
    row.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      };
    });
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
        getSalesSearchWithDate(target, fromDate, toDate, billTypeName);
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
          getSalesSearchWithDate(searchText, fromDate, toDate, billTypeName);
        } else {
          getSaleDataByDate(fromDate, toDate);
        }
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
      sort: [{ sortingNumber: 'asc' }],
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
                case 'Payment In':
                  tableName = 'paymentin';
                  break;
                case 'Sales Return':
                  tableName = 'salesreturn';
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
                if ('Payment In' === linkedTxn.paymentType) {
                  linkedTxn.paymentType = response.paymentType;
                  linkedTxn.total = response.total;
                } else if ('Sales Return' === linkedTxn.paymentType) {
                  linkedTxn.paymentType = 'Sales Return';
                  linkedTxn.total = response.total_amount;
                } else if ('Purchases' === linkedTxn.paymentType) {
                  linkedTxn.paymentType = 'Purchases';
                  linkedTxn.total = response.total_amount;
                } else if (
                  'Opening Payable Balance' === linkedTxn.paymentType
                ) {
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
              if (
                payment.amount > 0 &&
                payment.paymentType === 'Custom Finance'
              ) {
                paymentsMap.set('CUSTOM FINANCE', payment.amount);
              }
              if (payment.amount > 0 && payment.paymentType === 'Exchange') {
                paymentsMap.set('EXCHANGE', payment.amount);
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
                    payment.amount > 0 &&
                    payment.paymentType === 'Exchange'
                  ) {
                    if (paymentsMap.has('EXCHANGE')) {
                      paymentsMap.set(
                        'EXCHANGE',
                        paymentsMap.get('EXCHANGE') + amount
                      );
                    } else {
                      paymentsMap.set('EXCHANGE', amount);
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
          _data['exchange'] = 0;

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
                  case 'EXCHANGE':
                    _data['exchange'] = value;
                    break;
                  case 'RETURNED SALE':
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

  const getSaleDataByDatexlsx = async (fromDate, toDate) => {
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

    let response = [];
    await Query.exec().then(async (data) => {
      if (!data) {
        return;
      }

      response = await Promise.all(
        data.map(async (item) => {
          return await getDataByTaxSplit(item);
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

  const getSalesSearchWithDate = async (
    value,
    fromDate,
    toDate,
    billTypeName
  ) => {
    const db = await Db.get();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    let skip = 0;
    setSalesData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSalesSearchWithDate(value, fromDate, toDate, billTypeName);
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
                case 'Payment In':
                  tableName = 'paymentin';
                  break;
                case 'Sales Return':
                  tableName = 'salesreturn';
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
                if ('Payment In' === linkedTxn.paymentType) {
                  linkedTxn.paymentType = response.paymentType;
                  linkedTxn.total = response.total;
                } else if ('Sales Return' === linkedTxn.paymentType) {
                  linkedTxn.paymentType = 'Sales Return';
                  linkedTxn.total = response.total_amount;
                } else if ('Purchases' === linkedTxn.paymentType) {
                  linkedTxn.paymentType = 'Purchases';
                  linkedTxn.total = response.total_amount;
                } else if (
                  'Opening Payable Balance' === linkedTxn.paymentType
                ) {
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
              if (
                payment.amount > 0 &&
                payment.paymentType === 'Custom Finance'
              ) {
                paymentsMap.set('CUSTOM FINANCE', payment.amount);
              }
              if (payment.amount > 0 && payment.paymentType === 'Exchange') {
                paymentsMap.set('EXCHANGE', payment.amount);
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
                    payment.amount > 0 &&
                    payment.paymentType === 'Exchange'
                  ) {
                    if (paymentsMap.has('EXCHANGE')) {
                      paymentsMap.set(
                        'EXCHANGE',
                        paymentsMap.get('EXCHANGE') + amount
                      );
                    } else {
                      paymentsMap.set('EXCHANGE', amount);
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
          _data['exchange'] = 0;

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
                  case 'EXCHANGE':
                    _data['exchange'] = value;
                    break;
                  case 'RETURNED SALE':
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
                    ALL SALES
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
                {transaction.sales.prefixSequence &&
                transaction.sales.prefixSequence.length > 0 ? (
                  <Grid item xs={12} sm={3} style={{ display: 'flex' }}>
                    <Select
                      displayEmpty
                      value={prefixSelect}
                      input={
                        <OutlinedInput
                          style={{ width: '100%', marginLeft: '15px' }}
                        />
                      }
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem disabled value="">
                        Select Prefix
                      </MenuItem>
                      {transaction.sales.prefixSequence.map(
                        (option, index) =>
                          option.prefix !== '' && (
                            <MenuItem
                              key={option.prefix}
                              value={option.prefix}
                              name={option.prefix}
                              style={{ color: 'black' }}
                              onClick={() => {
                                setPrefixSelect(option.prefix);
                                setCurrentPage(1);
                                setTotalPages(1);
                                setOnChange(true);
                              }}
                            >
                              {option.prefix}
                            </MenuItem>
                          )
                      )}
                      <MenuItem
                        value="NoPrefix"
                        key="NoPrefix"
                        name="NoPrefix"
                        style={{ color: 'black' }}
                        onClick={() => {
                          setPrefixSelect('NoPrefix');
                          setCurrentPage(1);
                          setTotalPages(1);
                          setOnChange(true);
                        }}
                      >
                        No Prefix
                      </MenuItem>

                      <MenuItem
                        value="AllPrefix"
                        key="AllPrefix"
                        name="AllPrefix"
                        onClick={() => {
                          setPrefixSelect('AllPrefix');
                          setCurrentPage(1);
                          setTotalPages(1);
                          setOnChange(true);
                        }}
                      >
                        All Prefix
                      </MenuItem>
                    </Select>
                    <Button
                      className={classes.resetbtn}
                      size="small"
                      onClick={() => {
                        setPrefixSelect('');
                        setCurrentPage(1);
                        setTotalPages(1);
                        setOnChange(true);
                      }}
                      color="secondary"
                    >
                      RESET
                    </Button>
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={3}></Grid>
                )}

                {transaction.billTypes && transaction.billTypes.length > 0 ? (
                  <Grid item xs={12} sm={3}>
                    <Grid item xs={11} style={{ display: 'flex' }}>
                      <Select
                        displayEmpty
                        value={billTypeName}
                        input={
                          <OutlinedInput
                            style={{ width: '100%', marginLeft: '15px' }}
                          />
                        }
                        inputProps={{ 'aria-label': 'Without label' }}
                      >
                        <MenuItem disabled value="">
                          Select Bill Type
                        </MenuItem>
                        {transaction.billTypes &&
                          transaction.billTypes.map((c) => (
                            <MenuItem
                              key={c}
                              value={c}
                              name={c}
                              style={{ color: 'black' }}
                              onClick={() => {
                                setBillTypeName(c);
                                setCurrentPage(1);
                                setTotalPages(1);
                                setOnChange(true);
                              }}
                            >
                              {c}
                            </MenuItem>
                          ))}
                      </Select>
                      <Button
                        className={classes.resetbtn}
                        size="small"
                        onClick={() => {
                          setBillTypeName('');
                          setCurrentPage(1);
                          setTotalPages(1);
                          setOnChange(true);
                        }}
                        color="secondary"
                      >
                        RESET
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={3}></Grid>
                )}
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
                      <Dropdown>
                        <DropdownHoverBtn style={{ cursor: 'pointer' }}>
                          Download
                        </DropdownHoverBtn>
                        <DropdownHoverContent>
                          <DropdownLinkHover>
                            <Typography
                              onClick={() => getExcelRawData()}
                              style={{ cursor: 'pointer', color: '#000' }}
                            >
                              Sales Raw Data
                            </Typography>
                          </DropdownLinkHover>
                          <DropdownLinkHover>
                            <Typography
                              onClick={() => getExcelDataNew()}
                              style={{ cursor: 'pointer', color: '#000' }}
                            >
                              Sales Workings
                            </Typography>
                          </DropdownLinkHover>
                        </DropdownHoverContent>
                      </Dropdown>
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
      {openAddSalesInvoice ? <AddSalesInvoice /> : null}
      {openEWayGenerateModal ? <EWayGenerate /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(AuditorSalesReport);