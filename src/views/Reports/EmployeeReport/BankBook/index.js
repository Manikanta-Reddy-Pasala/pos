import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import TextField from '@material-ui/core/TextField';
import '../../../Expenses/ExpenseTable.css';
import {
  Box,
  Typography,
  Grid,
  Paper
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import useWindowDimensions from '../../../../components/windowDimension';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import NoPermission from '../../../noPermission';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    borderRadius: '12px'
  },
  root: {
    // padding: 2,
    borderRadius: '12px'
  },
  label: {
    flexDirection: 'column'
  },
  iconLabel: {
    fontSize: 'x-small'
  },
  footer: {
    borderTop: '1px solid #d8d8d8'
  },
  amount: {
    textAlign: 'center',
    color: '#EF5350'
  },
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  },
  greenText: {
    color: '#339900'
  },
  csh: {
    marginTop: '30px',
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
        marginLeft: theme.spacing(1),
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    }
  }
}));

const BankBookbyEmployeeReport = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [dayBookData, setDayBookData] = useState([]);
  const [rowData, setRowData] = useState([]);

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
  const [isLoading, setLoadingShown] = useState(true);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

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

  const [columnDefs] = useState([
    {
      headerName: 'Date',
      field: 'transactionDate',
      width: 300,
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        if (data['date']) {
          result = data['date'];
        }

        var dateParts = result.split('-');
        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    },
    {
      headerName: 'Ref No',
      field: 'refNo',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Name',
      field: 'name',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Total',
      field: 'total',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Received',
      field: 'received',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Balance',
      field: 'balance',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'New/Edit',
      field: 'newedit',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    }
  ]);

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getData = () => {
    const wb = new Workbook();

    let data = [];
    if (dayBookData && dayBookData.length > 0) {
      for (var i = 0; i < dayBookData.length; i++) {
        const record = {
          Date: '',
          'Ref No': '',
          Name: '',
          Total: '',
          Received: '',
          Balance: '',
          'New/Edit': ''
        };
        data.push(record);
      }
    } else {
      const record = {
        Date: '',
        'Ref No': '',
        Name: '',
        Total: '',
        Received: '',
        Balance: '',
        'New/Edit': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Bank Book Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Bank Book Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Bank_Book_by_Employee_Report';

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
    suppressMenuHide: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();

    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if(!businessData.posFeatures.includes('Employees Report')) {
          setFeatureAvailable(false);
        }
      }
  };

  return (
    <div>
      <div className={classes.root} style={{ height: height - 50 }}>
        {isLoading && <BubbleLoader></BubbleLoader>}
        {!isLoading && (
          <div className={classes.root}>
            {isFeatureAvailable ? (
              <Paper className={classes.root} style={{ height: height - 50 }}>
                <div className={classes.content}>
                  <div className={classes.contentLeft}>
                    <Typography gutterBottom variant="h4" component="h4">
                      BANK BOOK
                    </Typography>
                  </div>
                </div>

                <div>
                  <Grid container className={classes.categoryActionWrapper}>
                    <Grid item xs={8}>
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
                            onChange={(e) =>
                              setToDate(formatDate(e.target.value))
                            }
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </form>
                      </div>
                    </Grid>
                    <Grid item xs={4} style={{ marginTop: '14px' }}>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justify="flex-end"
                        className="category-actions-right"
                      >
                        {/* <Avatar>
                    <IconButton onClick={() => getData()}>
                      <Excel fontSize="inherit" />
                    </IconButton>
                  </Avatar> */}
                        {/* <IconButton classes={{ label: classes.label }}>
              <Print fontSize="inherit" />
              <span className={classes.iconLabel}>Print</span>
                  </IconButton> */}
                      </Grid>
                    </Grid>
                  </Grid>
                </div>

                <div>
                  {/* <App />  */}

                  <Box>
                    <div
                      style={{
                        width: '100%',
                        height: height - 162 + 'px'
                      }}
                      className=" blue-theme"
                    >
                      <div
                        id="product-list-grid"
                        style={{ height: '100%', width: '100%' }}
                        className="ag-theme-material"
                      >
                        <AgGridReact
                          onGridReady={onGridReady}
                          enableRangeSelection
                          paginationPageSize={10}
                          suppressMenuHide
                          rowData={rowData}
                          columnDefs={columnDefs}
                          defaultColDef={defaultColDef}
                          rowSelection="single"
                          pagination
                          headerHeight={40}
                          rowClassRules={rowClassRules}
                          overlayLoadingTemplate={
                            '<span className="ag-overlay-loading-center">Please wait while your rows are loading</span>'
                          }
                          frameworkComponents={{}}
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
      </div>
    </div>
  );
};

export default InjectObserver(BankBookbyEmployeeReport);
