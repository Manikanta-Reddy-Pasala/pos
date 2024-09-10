import React, { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
  Typography,
  Radio,
  makeStyles,
  TextField,
  Button,
  Avatar,
  IconButton
} from '@material-ui/core';
import dateFormat from 'dateformat';

import { Add, Search } from '@material-ui/icons';
import * as Db from '../../../RxDb/Database/Database';
import DateRangePicker from '../../../components/controls/DateRangePicker';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import Styles from './style';
import moreoption from '../../../components/Options';
import Moreoptions from '../../../components/MoreoptionSpecialDaysManagment';
import Controls from '../../../components/controls';
import { AgGridReact } from 'ag-grid-react';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import Page from '../../../components/Page';
import * as moment from 'moment';
import useWindowDimensions from 'src/components/windowDimension';
import Excel from '../../../icons/Excel';
import XLSX from 'xlsx';
import * as Bd from '../../../components/SelectedBusiness';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  sectionHeader: {
    marginBottom: 30
  },
  pageContent: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: 6
  },
  DayTypeListbox: {
    minWidth: '11%',
    marginLeft: '15px',
    margin: 0,
    padding: 5,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    textAlign: 'left',
    border: '1px solid rgba(0,0,0,.25)',
    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    },
    '& li:active': {
      backgroundColor: '#2977f5',
      color: 'white'
    }
  },
  specialDayTextField: {
    width: '100%',
    marginLeft: '13px',
    backgroundColor: 'white',
    padding: '5px',
    marginTop: '10px',
    borderRadius: '8px'
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

const CustomerSpecialDaysReport = (props) => {
  const classes = useStyles();

  const { height } = useWindowDimensions();
  const [filterType, setFilterType] = React.useState('');
  const [templeSpecialDayName, setTempleSpecialDayName] = React.useState('');
  const [specialDayNameWhileEditing, setSpecialDayNameWhileEditing] =
    useState('');
  const [specialDayList, setspecialDayList] = React.useState([]);
  const [specialDayMenuOpen, handleSpecialDayMenuOpen] = React.useState(false);

  const [rowData, setRowData] = useState([]);
  const [dateRange, setDateRange] = useState({
    fromDate: new Date(),
    toDate: new Date()
  });
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const handleSpecialDay = (val) => {
    handleSpecialDayMenuOpen(false);
  };

  useEffect(() => {
    setRowData([]);
  }, []);

  const handleSpecialDayfilterData = async (filterType, value, value2) => {
    const db = await Db.get();
    let query;
    const businessData = await Bd.getBusinessData();

    if (filterType === 'date') {
      query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              templeSpecialDayStartDate: {
                $gte: dateFormat(value, 'yyyy-mm-dd')
              }
            },
            {
              templeSpecialDayStartDate: {
                $lte: dateFormat(value2, 'yyyy-mm-dd')
              }
            },
            { templeSpecialDayStartDate: { $exists: true } }
          ]
        }
      });
    } else if (filterType === 'search' && value && value.length > 1) {
      query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { templeSpecialDayName: value }
          ]
        }
      });
    }

    if (query) {
      await query.exec().then(async (data) => {
        if (!data) {
          // No sale data is found so cannot update any information
          setRowData([]);
          return;
        }

        let response = [];
        data.map((sale) => {
          let formatted = {};
          let row = sale.toJSON();

          let particulars = '';
          let pooja = '';
          let astrology = '';

          if (row.customer_name) {
            particulars = particulars + 'Name:' + row.customer_name + ' ';
          }

          if (row.customer_phoneNo) {
            particulars = particulars + 'Ph no:' + row.customer_phoneNo + ' ';
          }

          if (row.customer_address) {
            particulars = particulars + 'Addr:' + row.customer_address + ' ';
          }

          if (row.templeSpecialDayStartDate) {
            pooja = pooja + 'Date:' + row.templeSpecialDayStartDate + ' - ';
          }

          if (row.templeSpecialDayEndDate) {
            pooja = pooja + row.templeSpecialDayEndDate + ' ';
          }

          if (row.templeSpecialDayTimings) {
            pooja = pooja + 'Time:' + row.templeSpecialDayTimings + ' - ';
          }

          if (row.rashi) {
            astrology = astrology + 'rashi:' + row.rashi + ' ';
          }
          if (row.gothra) {
            astrology = astrology + 'gothra:' + row.gothra + ' ';
          }
          if (row.star) {
            astrology = astrology + 'star:' + row.star + '  ';
          }

          formatted.particulars = particulars;
          formatted.pooja = pooja;
          formatted.astrology = astrology;

          if (formatted.particulars.length > 1) {
            response.push(formatted);
          }
        });

        setRowData(response);
      });
    }
  };

  const getSpecialDaysData = async (value) => {
    if (value) {
      const db = await Db.get();

      var regexp = new RegExp('^.*' + value + '.*$', 'i');
      const businessData = await Bd.getBusinessData();

      await db.specialdays
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                $or: [{ name: { $regex: regexp } }, { date: { $eq: value } }]
              }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            // No customer is available
            return;
          }
          if (data && data.length > 0) {
            let results = data.map((item) => item.toJSON());
            setspecialDayList(results);
          }
        })
        .catch((err) => {
          setspecialDayList([]);
        });
    } else {
      setspecialDayList([]);
    }
  };

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

  const [columnDefs] = useState([
    {
      headerName: 'Customer Details',
      field: 'particulars',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Pooja Details',
      field: 'pooja',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false
    },
    {
      headerName: 'Astrology Details',
      field: 'astrology',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    }
  ]);

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

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getCustomerSpecialDaysExcel = () => {
    const wb = new Workbook();

    let data = [];
    if (rowData && rowData.length > 0) {
      for (var i = 0; i < rowData.length; i++) {
        if (rowData[i]) {
          const record = {
            'Customer Details': rowData[i].particulars,
            'Pooja Details': rowData[i].pooja,
            'Astrology Details': rowData[i].astrology
          };
          data.push(record);
        }
      }
    } else {
      const record = {
        'Customer Details': '',
        'Pooja Details': '',
        'Astrology Details': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Customer Special Days Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Customer Special Days Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Customer_Special_Days';

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

  return (
    <Page className={classes.root} title="Customer Special Days">
      <Paper className={classes.pageContent}>
        <Grid container className={classes.categoryActionWrapper}>
          <Grid item xs={8}>
            <Typography variant="h4" style={{ margin: '15px' }}>
              Customer Special Days
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="flex-end"
              className="category-actions-right"
            >
              <Avatar>
                <IconButton onClick={() => getCustomerSpecialDaysExcel()}>
                  <Excel fontSize="inherit" />
                </IconButton>
              </Avatar>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={1} className={classes.sectionHeader}>
            <Grid item xs={5} style={{ display: 'flex' }}>
              <Radio
                onChange={(e) => {
                  setFilterType('search');
                }}
                value={filterType}
                checked={filterType === 'search' ? true : false}
                name="radio-button"
                aria-label="Search"
              />
              <div>
                <TextField
                  className={classes.specialDayTextField}
                  variant="outlined"
                  margin="dense"
                  InputProps={{
                    disableUnderline: true
                  }}
                  placeholder="Choose Special Day"
                  value={
                    templeSpecialDayName === ''
                      ? specialDayNameWhileEditing
                      : templeSpecialDayName
                  }
                  onChange={(e) => {
                    if (e.target.value !== specialDayNameWhileEditing) {
                      setTempleSpecialDayName('');
                    }
                    getSpecialDaysData(e.target.value);
                    setSpecialDayNameWhileEditing(e.target.value);
                  }}
                  onClick={(e) => {
                    handleSpecialDayMenuOpen(true);
                  }}
                ></TextField>
                <>
                  {specialDayMenuOpen &&
                    specialDayList &&
                    specialDayList.length > 0 && (
                      <ul className={classes.DayTypeListbox}>
                        <div>
                          {specialDayList.map((option, index) => (
                            <li
                              style={{ cursor: 'pointer' }}
                              key={`${index}customer`}
                            >
                              <Button
                                className={classes.liBtn}
                                disableRipple
                                onClick={(e) => {
                                  if (e.target.value !== '') {
                                    setTempleSpecialDayName(option.name);
                                    handleSpecialDayfilterData(
                                      'search',
                                      option.name
                                    );
                                  } else {
                                    setTempleSpecialDayName('');
                                  }
                                  handleSpecialDay(option);
                                }}
                              >
                                {option.name}
                              </Button>
                            </li>
                          ))}
                        </div>
                      </ul>
                    )}
                </>
              </div>
            </Grid>
            <Grid item xs={7} style={{ display: 'flex' }}>
              <Radio
                name="radio-button"
                aria-label="SpecialDay"
                onChange={(e) => {
                  setFilterType('date');
                  handleSpecialDayfilterData(
                    'date',
                    dateRange.fromDate,
                    dateRange.toDate
                  );
                }}
                value={filterType}
                checked={filterType === 'date' ? true : false}
              />
              <div>
                <DateRangePicker
                  value={dateRange}
                  onChange={(dateRange) => {
                    if (
                      moment(dateRange.fromDate).isValid() &&
                      moment(dateRange.toDate).isValid()
                    ) {
                      setDateRange(dateRange);
                      console.log(dateRange);
                      handleSpecialDayfilterData(
                        'date',
                        dateRange.fromDate,
                        dateRange.toDate
                      );
                    } else {
                      setDateRange({
                        fromDate: new Date(),
                        toDate: new Date()
                      });
                    }
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
        <div
          id="sales-return-grid"
          style={{ width: '100%', height: height - 202 + 'px' }}
          className=" blue-theme"
        >
          <div
            style={{ height: '95%', width: '100%' }}
            className="ag-theme-material"
          >
            <AgGridReact
              onGridReady={onGridReady}
              enableRangeSelection={true}
              paginationPageSize={10}
              suppressMenuHide={true}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination
              rowSelection="single"
              headerHeight={40}
              suppressScrollOnNewData={true}
              rowClassRules={rowClassRules}
              overlayLoadingTemplate={
                '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
              }
              overlayNoRowsTemplate={
                '<span className="ag-overlay-loading-center">No Rows to Show!</span>'
              }
            ></AgGridReact>
          </div>
        </div>
      </Paper>
    </Page>
  );
};
export default InjectObserver(CustomerSpecialDaysReport);
