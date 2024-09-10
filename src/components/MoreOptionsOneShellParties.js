import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  DialogContentText,
  withStyles,
  Button
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import * as Bd from 'src/components/SelectedBusiness';
import * as Db from 'src/RxDb/Database/Database';
import { toJS } from 'mobx';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import MuiDialogActions from '@material-ui/core/DialogActions';
import * as txnSettings from 'src/components/Helpers/TransactionSettingsHelper';
import * as sequence from 'src/components/Helpers/SequenceNumberHelper';

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

function Moreoptions(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const store = useStore();

  const { getTallyLedgerName, getExportToTallyData } =
    store.TallyMasterSettingsStore;

  let [tallyTransactionsData] = useState([]);
  let [partyLedgersToPush, setPartyLedgersToPush] = useState([]);
  let [tallyPartiesTransactionsData, setTallyPartiesTransactionsData] =
    useState([]);
  const { tallymastersettingsData } = toJS(store.TallyMasterSettingsStore);
  const { getBankTallyLedgerName, getBankExportToTallyData } =
    store.TallyBankSettingsStore;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [messsage, setMessage] = React.useState('');
  const [openMesssageDialog, setOpenErrorMesssageDialog] =
    React.useState(false);

  const { handleVendorModalOpen } = store.VendorStore;

  const { handleCustomerModalOpen } = store.CustomerStore;

  const handleMessageAlertClose = () => {
    setMessage('');
    setOpenErrorMesssageDialog(false);
  };

  const [openReleasingDialog, setOpenReleasingDialog] = React.useState(false);

  const handleReleasingAlertClose = () => {
    setOpenReleasingDialog(false);
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const resetItemTallyStatus = async (tallyStatus) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = await db.parties.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            id: {
              $eq: props.item.id
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
              updatedAt: Date.now(),
              tallySynced: tallyStatus
            }
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      })
      .catch((err) => {
        console.log('Internal Server Error Sale Order', err);
      });
  };

  const generateXML = async () => {
    setPartyLedgersToPush([]);

    await preparePartyLedgers();
  };

  const preparePartyLedgers = async () => {
    let registrationType = '';
    switch (props.item.gstType) {
      case 'Registered Customer':
        registrationType = 'Regular';
        break;
      case 'Composition Reg Customer':
        registrationType = 'Composition';
        break;
      case 'Oveseas Customer':
        registrationType = 'Overseas';
        break;
      default:
        registrationType = 'Unregistered/Consumer';
        break;
    }

    let openingBalance = 0;
    if (props.item.balanceType === 'Payable') {
      openingBalance = -props.item.balance;
    } else if (props.item.balanceType === 'Receivable') {
      openingBalance = props.item.balance;
    }

    if (
      props.item.tallySynced === false &&
      (props.item.tallyMappingName === '' ||
        props.item.tallyMappingName === null)
    ) {
      let partyObjLedgerGroup = {
        TALLYMESSAGE: {
          '@xmlns:UDF': 'TallyUDF',
          LEDGER: {
            '@ACTION': 'Create',
            NAME: props.item.tallyMappingName
              ? props.item.tallyMappingName
              : props.item.name + '-' + props.item.gstNumber,
            PARENT: props.item.isCustomer
              ? tallymastersettingsData.customerMastersMapping[0]
                  .tallyLedgerGroup
              : tallymastersettingsData.vendorMastersMapping[0]
                  .tallyLedgerGroup,
            COUNTRYNAME: props.item.country,
            LEDSTATENAME: props.item.state,
            GSTREGISTRATIONTYPE: registrationType,
            PARTYGSTIN: props.item.gstNumber,
            COUNTRYOFRESIDENCE: props.item.country,
            LEDGERMOBILE: props.item.phoneNo,
            PINCODE: props.item.pincode,
            EMAIL: props.item.emailId,
            OPENINGBALANCE: openingBalance,
            PLACEOFSUPPLY: props.item.state,
            'LANGUAGENAME.LIST': {
              'NAME.LIST': {
                '@TYPE': 'String',
                NAME: props.item.legalName
              }
            },
            'ADDRESS.LIST': {
              '@TYPE': 'String',
              ADDRESS: props.item.address
            }
          }
        }
      };
      tallyPartiesTransactionsData.push(partyObjLedgerGroup);
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

  const pushToTally = async () => {
    // to integrate by mani
  };

  const viewOrEditPartyItem = async () => {
    if (props.item.isCustomer === true) {
      handleCustomerModalOpen();
    } else if (props.item.isVendor === true) {
      handleVendorModalOpen();
    }
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreVert fontSize="inherit" />
      </IconButton>

      {props.item.tallySynced === false ? (
        <Menu
          id="moremenu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem key={1} onClick={() => generateXML()}>
            Download Single XML{' '}
          </MenuItem>
          <MenuItem key={2}>Push to Tally </MenuItem>
          <MenuItem key={3} onClick={() => resetItemTallyStatus(true)}>
            Mark Pushed to Tally{' '}
          </MenuItem>
          <MenuItem key={4} onClick={() => viewOrEditPartyItem()}>
            View/Edit{' '}
          </MenuItem>
        </Menu>
      ) : (
        <Menu
          id="moremenu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem key={1} onClick={() => resetItemTallyStatus(false)}>
            Reset Tally Push status{' '}
          </MenuItem>
          <MenuItem key={2} onClick={() => viewOrEditPartyItem()}>
            View/Edit{' '}
          </MenuItem>
        </Menu>
      )}
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
    </div>
  );
}

export default injectWithObserver(Moreoptions);