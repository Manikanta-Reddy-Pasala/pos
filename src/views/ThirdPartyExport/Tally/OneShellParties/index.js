import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Controls from 'src/components/controls';
import * as Db from 'src/RxDb/Database/Database';
import Styles from 'src/views/Export/style';
import { AgGridReact } from 'ag-grid-react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  withStyles,
  Button,
  InputAdornment,
  FormControl,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import 'src/views/Export/style.css';
import useWindowDimensions from 'src/components/windowDimension';
import * as Bd from 'src/components/SelectedBusiness';
import * as helper from 'src/components/Helpers/TallyApiHelper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { toJS } from 'mobx';
import MoreOptionsOneShellParties from 'src/components/MoreOptionsOneShellParties';
import moreoption from 'src/components/Options';
import left_arrow from 'src/icons/svg/left_arrow.svg';
import right_arrow from 'src/icons/svg/right_arrow.svg';
import first_page_arrow from 'src/icons/svg/first_page_arrow.svg';
import last_page_arrow from 'src/icons/svg/last_page_arrow.svg';
import Loader from 'react-js-loader';
import * as dateHelper from 'src/components/Helpers/DateHelper';
import { Search } from '@material-ui/icons';
import AddVendor from 'src/views/Vendors/modal/AddVendor';
import AddCustomer from 'src/views/customers/modal/AddCustomer';

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const OneShellParties = () => {
  const { height } = useWindowDimensions();
  const classes = Styles.useStyles();

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const store = useStore();
  let [onChange, setOnChange] = useState(true);

  const [rowData, setRowData] = useState(null);

  const { tallymastersettingsData } = toJS(store.TallyMasterSettingsStore);
  const { getExportToTallyData } = store.TallyMasterSettingsStore;

  const { getBankExportToTallyData } = store.TallyBankSettingsStore;

  let [partyLedgersToPush, setPartyLedgersToPush] = useState([]);
  let [tallyPartiesTransactionsData, setTallyPartiesTransactionsData] =
    useState([]);
  const [searchText, setSearchText] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [messsage, setMessage] = React.useState('');
  const [openMesssageDialog, setOpenErrorMesssageDialog] =
    React.useState(false);
  const [limit] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { vendorDialogOpen } = toJS(store.VendorStore);
  const { customerDialogOpen } = toJS(store.CustomerStore);

  const { setTallyB2B, setTallyB2C } = store.TallyMasterSettingsStore;

  const handleMessageAlertClose = () => {
    setMessage('');
    setOpenErrorMesssageDialog(false);
  };

  const [openReleasingDialog, setOpenReleasingDialog] = React.useState(false);

  const handleReleasingAlertClose = () => {
    setOpenReleasingDialog(false);
  };

  const [openLoadingAlert, setLoadingAlert] = useState(false);

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
      headerName: 'NAME',
      field: 'name',
      valueFormatter: (params) => {
        return params['data']['customer_name'] || params['data']['vendor_name'];
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'TALLY NAME',
      field: 'tallyMappingName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'GST NO',
      field: 'gstNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'GST TYPE',
      field: 'gstType',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['total_amount'] || params['data']['total'];
      }
    },
    {
      headerName: 'LEGAL NAME',
      field: 'legalName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['total_amount'] || params['data']['total'];
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

  const TemplateActionRenderer = (props) => {
    return (
      <MoreOptionsOneShellParties
        menu={moreoption.moreoptionsdata}
        index={props.data.id}
        item={props['data']}
        id={props.data.id}
        component="vouchersList"
      />
    );
  };

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setOnChange(false);
        await getPartiesData();
      }
    };

    loadPaginationData();
  }, [onChange]);

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

  function dateGSTXMLFormatter(data) {
    var dateAsString = data;
    var dateParts = dateAsString.split('-');
    return `${dateParts[0]}${dateParts[1]}${dateParts[2]}`;
  }

  const prepareXmlContent = async () => {
    const db = await Db.get();
  };

  const pushToTally = async () => {
    // to integrate by mani
    let envelope = await prepareXmlContent();

    var builder = require('xmlbuilder');
    var root = builder.create(envelope);

    helper.sendXmlDataToTally(root);
  };

  const preparePartyLedgers = async () => {
    setTallyPartiesTransactionsData([]);

    for (let data of rowData) {
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

      let openingBalance = 0;
      if (data.balanceType === 'Payable') {
        openingBalance = -data.balance;
      } else if (data.balanceType === 'Receivable') {
        openingBalance = data.balance;
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
                : data.name + '-' + data.gstNumber,
              INCOMETAXNUMBER: data.panNumber,
              GSTREGISTRATIONTYPE: registrationType,
              PARENT: data.isCustomer
                ? tallymastersettingsData.customerMastersMapping[0]
                    .tallyLedgerGroup
                : tallymastersettingsData.vendorMastersMapping[0]
                    .tallyLedgerGroup,
              TAXTYPE: 'Others',
              COUNTRYOFRESIDENCE: data.country,
              LEDGERMOBILE: data.phoneNo,
              PINCODE: data.pincode,
              EMAIL: data.emailId,
              OPENINGBALANCE: openingBalance,
              'LANGUAGENAME.LIST': {
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: data.legalName ? data.legalName : data.name
                }
              },
              'LEDMAILINGDETAILS.LIST': {
                'ADDRESS.LIST': {
                  '@TYPE': 'String',
                  ADDRESS: data.address
                },
                PINCODE: data.pincode,
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

      var filename = 'tally_oneshell_parties_import.xml';
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
    setLoadingAlert(true);
    setPartyLedgersToPush([]);

    setMessage('');
    setOpenErrorMesssageDialog(false);

    await preparePartyLedgers();

    setLoadingAlert(false);

    markBulkTallyPushStatus(true);
  };

  const markBulkTallyPushStatus = async (status) => {
    // Update parties
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    for (let data of rowData) {
      const query = await db.parties.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              id: {
                $eq: data.id
              }
            }
          ]
        }
      });
      query
        .exec()
        .then(async (data) => {
          if (!data) {
            // No PArites data is not found so cannot update any information
            return;
          }

          await query
            .update({
              $set: {
                updatedAt: Date.now(),
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

    setOnChange(true);
  };

  const getPartiesData = async () => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRowData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPartiesData();
    }
    const businessData = await Bd.getBusinessData();

    Query = db.parties.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { name: { $exists: true } }
        ]
      },
      skip: skip,
      limit: limit,
      sort: [{ name: 'asc' }]
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item.toJSON());
      setRowData(response);
    });
  };

  const getAllPartiesData = async () => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.parties.find({
      selector: {
        $and: [{ businessId: { $eq: businessData.businessId } }]
      }
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      count = data.length;

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const getSearchPartiesData = async (value) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRowData([]);

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    var regexpMobile = new RegExp(value + '.*$', 'i');

    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSearchPartiesData(value);
    }

    const businessData = await Bd.getBusinessData();

    Query = db.parties.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { phoneNo: { $regex: regexpMobile } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { name: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { gstNumber: { $regex: regexp } }
            ]
          }
        ]
      },
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item.toJSON());
      setRowData(response);
    });
  };

  const getAllSearchPartiesData = async (value) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    var regexpMobile = new RegExp(value + '.*$', 'i');

    Query = db.parties.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { phoneNo: { $regex: regexpMobile } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { name: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { gstNumber: { $regex: regexp } }
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
      count = data.length;

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      setSearchText(target);
      if (target) {
        await getSearchPartiesData(target);
      } else {
        await getPartiesData();
      }
    } else {
      await getPartiesData();
    }
  };

  return (
    <div style={{ marginTop: '16px', marginBottom: '10px' }}>
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <Grid
            container
            direction="row"
            className={classes.sectionHeader}
            style={{
              display: 'flex',
              marginLeft: '15px',
              justifyContent: 'space-between'
            }}
          >
            <FormControl>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="b2b"
                      checked={tallymastersettingsData.b2b}
                      onChange={(event) => {
                        setTallyB2B(event.target.checked);
                      }}
                    />
                  }
                  label="B2B"
                  size="small"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      name="b2c"
                      checked={tallymastersettingsData.b2c}
                      onChange={(event) => {
                        setTallyB2C(event.target.checked);
                      }}
                    />
                  }
                  label="B2C"
                  size="small"
                />
              </Grid>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={4}>
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
        </Grid>
        <Grid item xs={2}>
          <Controls.Button
            text="RESET STATUS"
            size="medium"
            variant="contained"
            className={classes.newButton}
            onClick={() => {
              markBulkTallyPushStatus(false);
            }}
          />
        </Grid>
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

      <div
        id="sales-return-grid"
        style={{
          width: '100%',
          height: height - 200 + 'px',
          marginTop: '16px'
        }}
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
                <p>
                  Please wait while the Tally import XML is being generated!!!
                </p>
              </div>
              <div>
                <br />
                <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {vendorDialogOpen === true ? <AddVendor /> : null}
      {customerDialogOpen === true ? <AddCustomer /> : null}
    </div>
  );
};
export default OneShellParties;