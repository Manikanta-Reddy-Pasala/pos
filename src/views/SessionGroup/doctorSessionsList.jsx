import React, { useEffect, useState } from 'react';
import Page from 'src/components/Page';
import {
  Paper,
  makeStyles,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  InputLabel,
  Avatar,
  IconButton
} from '@material-ui/core';
import Controls from 'src/components/controls/index';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import { Search } from '@material-ui/icons';
import * as moment from 'moment';
import DateRangePicker from 'src/components/controls/DateRangePicker';
import { toJS } from 'mobx';
import DocSessionGroupList from './DocSessionGroupList';
import AddSessionGroup from './AddSessionGroup';
import AllSessionsGroup from './AllSessionsGroup';
import { getEmployees } from 'src/components/Helpers/dbQueries/employees';
import ViewSessions from './ViewSession';
import Excel from 'src/icons/Excel';
import XLSX from 'xlsx';
import PDFIcon from '@material-ui/icons/PictureAsPdf';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import DoctorSessionGroupPDF from '../PDF/DoctorSessionGroup/DoctorSessionGroupPDF';
import * as clinicHelper from 'src/components/Utility/ClinicUtility';

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

const DoctorsSessionsList = (props) => {
  const classes = useStyles();
  const headerClasses = useHeaderStyles();
  const stores = useStore();
  const {
    doctorSessionList,
    addSessionNotesDialogOpen,
    sessionGroupDialogOpen,
    viewSessionDialogOpen
  } = toJS(stores.SessionGroupStore);
  const { handleSessionGroupList } = stores.SessionGroupStore;
  const [dateRange, setDateRange] = useState({
    fromDate: new Date(),
    toDate: new Date()
  });
  const [searchText, setSearchText] = useState('');
  const [filterBy, setFilter] = useState('all');
  const [isAdmin, setIsAdmin] = useState();
  const [employeeList, setEmployeeList] = useState([]);
  const [employee, setEmployee] = useState('all');
  const [open, setOpen] = useState(false);

  const { invoiceRegular, invoiceThermal } = toJS(stores.PrinterSettingsStore);
  const { getInvoiceSettings } = stores.PrinterSettingsStore;

  useEffect(() => {
    const loadPaginationData = async () => {
      const admin = localStorage.getItem('isAdmin');
      let is_admin = String(admin).toLowerCase() === 'true';
      setIsAdmin(is_admin);
      handleSessionGroupList(
        dateRange,
        filterBy,
        searchText,
        is_admin,
        true,
        employee
      );
      const data = await getEmployees('', false, clinicHelper.getDoctors());
      setEmployeeList(data);
    };

    loadPaginationData();
  }, [dateRange, addSessionNotesDialogOpen]);

  useEffect(() => {
    // handleSessionGroupList(
    //   dateRange,
    //   filterBy,
    //   searchText,
    //   isAdmin,
    //   true,
    //   employee
    // );
  }, [dateRange, addSessionNotesDialogOpen]);

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));
  }, []);

  const handleOnChange = (value) => {
    setFilter(value);
    handleSessionGroupList(
      dateRange,
      value,
      searchText,
      isAdmin,
      true,
      employee
    );
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    handleSessionGroupList(
      dateRange,
      filterBy,
      e.target.value,
      isAdmin,
      true,
      employee
    );
  };

  const handleEmployeeOnChange = (value) => {
    setEmployee(value);
    setOpen(false);
    handleSessionGroupList(
      dateRange,
      filterBy,
      searchText,
      isAdmin,
      true,
      value
    );
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderMenuItems = () => {
    return employeeList?.map((employee) => (
      <MenuItem key={employee?.userName} value={employee?.userName}>
        {employee?.name}
      </MenuItem>
    ));
  };

  const getAllExcelDataByDate = async () => {
    const wb = new Workbook();

    let data = [];
    if (doctorSessionList && doctorSessionList.length > 0) {
      for (var i = 0; i < doctorSessionList.length; i++) {
        const record = {
          DATE: dateFormatterExcel(doctorSessionList[i].sessionDate),
          DOCTOR: doctorSessionList[i].doctorName,
          CLIENT: doctorSessionList[i].patientName,
          'START TIME': doctorSessionList[i].sessionStartTime,
          'END TIME': doctorSessionList[i].sessionEndTime,
          STATUS: doctorSessionList[i].status
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        DOCTOR: '',
        CLIENT: '',
        'START TIME': '',
        'END TIME': '',
        STATUS: ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Sessions Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Sessions Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'All_Sessions_Report';

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

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  function dateFormatterExcel(date) {
    var dateAsString = date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const generatePDFDocument = async () => {
    const blob = await pdf(
      <DoctorSessionGroupPDF
        data={doctorSessionList}
        fromDate={dateRange.fromDate}
        toDate={dateRange.toDate}
        settings={invoiceRegular}
      />
    ).toBlob();

    saveAs(
      blob,
      isAdmin ? 'All_Sessions_Report.pdf' : 'Doctor_Sessions_Report.pdf'
    );
  };

  return (
    <div>
      <Page className={classes.root} title="Session Management">
        <Paper className={headerClasses.paperRoot}>
          <Grid container>
            <Grid item xs={10} className={headerClasses.card}>
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
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={1} className={[classes.categoryActionWrapper]}>
              <div
                style={{
                  marginRight: '10px',
                  marginTop: '20px',
                  cursor: 'pointer'
                }}
              >
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  className="category-actions-right"
                >
                  <Avatar>
                    <IconButton onClick={() => getAllExcelDataByDate()}>
                      <Excel fontSize="inherit" />
                    </IconButton>
                  </Avatar>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={1} className={[classes.categoryActionWrapper]}>
              <div
                style={{
                  marginRight: '10px',
                  marginTop: '20px',
                  cursor: 'pointer'
                }}
              >
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  className="category-actions-right"
                >
                  <Avatar>
                    <IconButton onClick={() => generatePDFDocument(false, 0)}>
                      <PDFIcon fontSize="inherit" />
                    </IconButton>
                  </Avatar>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </Paper>

        <Paper className={classes.paperRoot}>
          <Grid
            container
            direction="row"
            spacing={2}
            alignItems="center"
            className={classes.sectionHeader}
          >
            <Grid item xs={12} sm={3}>
              <Typography variant="h4">Transactions</Typography>
            </Grid>
            <Grid item xs={12} sm={3} style={{ marginTop: '13px' }}>
              {isAdmin && (
                <FormControl>
                  <InputLabel
                    style={{
                      marginTop: '-18px',
                      fontSize: '18px',
                      color: 'black'
                    }}
                  >
                    Doctors
                  </InputLabel>
                  <Select
                    value={employee}
                    onChange={(e) => handleEmployeeOnChange(e.target.value)}
                    variant="outlined"
                    style={{ minWidth: '200px' }}
                    onOpen={handleOpen}
                    onClose={handleClose}
                    open={open}
                    renderValue={(selected) => {
                      const selectedEmployee = employeeList.find(
                        (emp) => emp.userName === selected
                      );
                      return selectedEmployee ? selectedEmployee.name : 'All';
                    }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {renderMenuItems()}
                  </Select>
                </FormControl>
              )}
            </Grid>

            <Grid item xs={12} sm={6} style={{ marginTop: '13px' }}>
              <Grid container>
                <Grid item xs={6}>
                  <FormControl>
                    <InputLabel
                      style={{
                        marginTop: '-18px',
                        fontSize: '18px',
                        color: 'black'
                      }}
                    >
                      Status
                    </InputLabel>
                    <Select
                      value={filterBy}
                      onChange={(e) => handleOnChange(e.target.value)}
                      variant="outlined"
                      style={{
                        minWidth: '200px'
                      }}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                      <MenuItem value="rescheduled">Rescheduled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} align="right">
                  <Controls.Input
                    placeholder="Search Sessions"
                    size="small"
                    value={searchText}
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
              </Grid>
            </Grid>
          </Grid>
          <div>
            {isAdmin ? (
              <AllSessionsGroup
                doctorSessionList={doctorSessionList}
                addSessionNotesDialogOpen={addSessionNotesDialogOpen}
              />
            ) : (
              <DocSessionGroupList
                doctorSessionList={doctorSessionList}
                addSessionNotesDialogOpen={addSessionNotesDialogOpen}
              />
            )}
            {sessionGroupDialogOpen && <AddSessionGroup />}
            {viewSessionDialogOpen && <ViewSessions />}
          </div>
        </Paper>
      </Page>
    </div>
  );
};

export default InjectObserver(DoctorsSessionsList);