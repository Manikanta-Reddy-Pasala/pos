import React, { useState, useEffect } from 'react';
import Page from '../../../../components/Page';
import {
  Paper,
  makeStyles,
  InputAdornment,
  IconButton,
  Grid,
  Typography,
  Box
} from '@material-ui/core';
import { Search, Print } from '@material-ui/icons';
import AddApproval from '../AddApproval';
import Controls from '../../../../components/controls/index';
import Moreoptions from '../../../../components/MoreOptionsApprovalList';
import * as Db from '../../../../RxDb/Database/Database';
import moreoption from '../../../../components/Options';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { Add } from '@material-ui/icons';
import { AgGridReact } from 'ag-grid-react';
import ProductModal from '../../../../components/modal/ProductModal';
import './approval.css';
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
import ComponentToPrint from '../../../Printers/ComponentsToPrint/index';
import * as Bd from '../../../../components/SelectedBusiness';
import OpenPreview from 'src/components/OpenPreview';
import CustomPrintPopUp from 'src/views/Printers/Invoice/CustomPrintPopUp';

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

const Approvalslist = (props) => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const headerClasses = useHeaderStyles();
  const stores = useStore();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const { productDialogOpen } = stores.ProductStore;

  const { OpenAddApprovalInvoice, printData, openApprovalPrintSelectionAlert } =
    toJS(stores.ApprovalsStore);
  const {
    openForNewApproval,
    handleApprovalsSearch,
    handleCloseApprovalPrintSelectionAlertMessage
  } = stores.ApprovalsStore;

  const { getInvoiceSettings } = stores.PrinterSettingsStore;
  const { openCustomPrintPopUp } = toJS(stores.PrinterSettingsStore);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [limit] = useState(10);

  const [rowData, setRowData] = useState(null);
  let [approvalData, setApprovalData] = useState([]);
  let [onChange, setOnChange] = useState(true);
  const [searchText, setSearchText] = useState('');

  const [dateRange, setDateRange] = useState({
    fromDate: new Date(),
    toDate: new Date()
  });

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    filter: true,
    rowHeight: 10,
    headerHeight: 30,
    suppressMenuHide: true,
    suppressHorizontalScroll: false,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  const getApprovalDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRowData([]);
    setApprovalData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getallApprovalDataByDate(dateRange);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.approvals.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            approvalDate: {
              $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
            }
          },
          {
            approvalDate: {
              $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
            }
          },
          {
            updatedAt: { $exists: true }
          }
        ]
      },
      sort: [{ approvalDate: 'desc' }, { updatedAt: 'desc' }],
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
      setApprovalData(response);
    });
  };

  const getallApprovalDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.approvals.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            approvalDate: {
              $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
            }
          },
          {
            approvalDate: {
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
      data.map((item) => {
        ++count;
      });

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const getApprovalDataBySearch = async (value) => {
    const db = await Db.get();
    var Query;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    let skip = 0;
    setRowData([]);
    setApprovalData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getallApprovalDataBySearch(value);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.approvals.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { employeeName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { employeeMobile: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { totalAmount: { $eq: parseFloat(value) } }
            ]
          }
        ]
      },
      sort: [{ approvalDate: 'desc' }, { updatedAt: 'desc' }],
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
      setApprovalData(response);
    });
  };

  const getallApprovalDataBySearch = async (value) => {
    const db = await Db.get();
    var Query;

    const businessData = await Bd.getBusinessData();
    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    Query = db.approvals.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { employeeName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { employeeMobile: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { totalAmount: { $eq: parseFloat(value) } }
            ]
          }
        ]
      }
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      data.map((item) => {
        ++count;
      });

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

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
    var dateAsString = params.data.approvalDate;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const [columnDefs] = useState([
    {
      headerName: 'DATE',
      field: 'approvalDate',
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
      headerName: 'APPROVAL NUMBER',
      field: 'sequenceNumber',
      width: 200,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>APPROVAL</p>
            <p>NUMBER</p>
          </div>
        );
      }
    },
    {
      headerName: 'EMPLOYEE',
      field: 'employeeName',
      width: 250,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'NUMBER OF ITEMS',
      field: 'numberOfItems',
      width: 100,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>NO.OF</p>
            <p>ITEMS</p>
          </div>
        );
      }
    },
    {
      headerName: 'AMOUNT',
      field: 'totalAmount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'SOLD',
      field: 'numberOfSelectedItems',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>NO OF ITEMS</p>
            <p>SELECTED</p>
          </div>
        );
      }
    },
    {
      headerName: 'NO OF PENDING ITEMS',
      field: 'numberOfPendingItems',
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>NO OF ITEMS</p>
            <p>PENDING </p>
          </div>
        );
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
    rowHighlight: function (params) {
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
        component="Approvalslist"
      />
    );
  };

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      setSearchText(target);

      if (target) {
        await getApprovalDataBySearch(target);
      } else {
        await getApprovalDataByDate(dateRange);
      }
    } else {
      await getApprovalDataByDate(dateRange);
    }
  };

  useEffect(() => {
    // console.log('use effect:::', productData);
    if (gridApi) {
      if (approvalData) {
        gridApi.setRowData(approvalData);
      }
    }
  }, [approvalData]);

  useEffect(() => {
    if (gridApi) {
      if (rowData) {
        gridApi.setRowData(rowData);
      }
    }
  }, [rowData]);

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));
  }, []);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setOnChange(false);
        setRowData([]);
        //check whether search is clicked or not
        if (searchText.length > 0) {
          let searchTextConverted = { target: { value: searchText } };
          handleSearch(searchTextConverted);
        } else {
          await getApprovalDataByDate(dateRange);
        }
      }
    };

    loadPaginationData();
  }, [onChange]);

  const closeDialog = () => {
    handleCloseApprovalPrintSelectionAlertMessage();
  };

  return (
    <div>
      <Page className={classes.root} title="Approvals">
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
            <Grid item xs={12} sm={4}>
              <Typography variant="h4">Transaction </Typography>
            </Grid>
            <Grid item xs={12} sm={3}></Grid>
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
                    onChange={handleSearch}
                  />
                </Grid>
                <Grid item xs={4} align="right">
                  <Controls.Button
                    text="Add Approval"
                    size="medium"
                    variant="contained"
                    color="primary"
                    autoFocus={true}
                    startIcon={<Add />}
                    className={classes.newButton}
                    onClick={() => openForNewApproval()}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <div style={{ width: '100%', height: height - 242 + 'px' }}>
            <div
              id="approvals-invoice-grid"
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
          {productDialogOpen ? <ProductModal /> : null}
          {OpenAddApprovalInvoice ? <AddApproval /> : null}
        </Paper>
      </Page>

      {openApprovalPrintSelectionAlert === true ? (
        <OpenPreview
          open={true}
          onClose={closeDialog}
          id={printData.approvalNumber}
          invoiceData={printData}
          startPrint={false}
        />
      ) : (
        ''
      )}
      {openCustomPrintPopUp ? (
        <CustomPrintPopUp isComingFromPrint={true} />
      ) : null}
    </div>
  );
};
export default InjectObserver(Approvalslist);