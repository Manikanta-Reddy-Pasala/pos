import React, { useEffect } from 'react';
import {
  Typography,
  makeStyles,
  Grid,
  withStyles,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogContentText
} from '@material-ui/core';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InformationIcon from '@material-ui/icons/Info';
import { toJS } from 'mobx';
import * as Bd from 'src/components/SelectedBusiness';
import axios from 'axios';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import * as helper from 'src/components/Helpers/TallyApiHelper';

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: '10px',
    height: '97%'
  },

  paper: {
    padding: 2
  },

  uploadContainer: {
    border: '2px dashed blue',
    padding: '100px',
    borderRadius: '50%',
    display: 'block',
    textAlign: 'center',
    width: '400px'
  },

  dropzoneStyle: {
    '& .MuiDropzoneArea-icon': {
      color: 'blue'
    },
    '& .MuiDropzoneArea-root': {
      border: '2px dashed rgb(0, 0, 255) !important',
      borderRadius: '50% !important',
      display: 'block !important',
      textAlign: 'center !important',
      width: '400px !important',
      height: '370px !important',
      marginTop: '-3px !important'
    }
  },

  uploadText: {
    display: 'grid',
    marginTop: '60px'
  },
  textCenter: {
    textAlign: 'center',
    color: 'grey'
  },
  marginSpace: {
    margin: '0px 0 20px 0px'
  },
  jsonContainer: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    height: '70%'
  },
  jsontempContainer: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center'
  },

  headerContain: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 10px 40px 20px'
  },
  flexGrid: {
    display: 'grid'
  },
  flexCenter: {
    display: 'flex',
    justifyContent: 'center'
  },
  header: {
    fontWeight: 'bold',
    fontFamily: 'Roboto'
  },
  clickBtn: {
    color: 'blue',
    marginTop: '5px',
    cursor: 'pointer'
  },
  previewChip: {
    minWidth: 160,
    maxWidth: 210
  },
  subHeader: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    paddingLeft: '20px'
  },
  resetContain: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: '20px'
  },
  sideList: {
    padding: theme.spacing(1)
  }
}));

const API_SERVER = window.REACT_APP_API_SERVER;

const TallyBanks = () => {
  const classes = useStyles();
  const store = useStore();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { tallymastersettingsData } = toJS(store.TallyMasterSettingsStore);
  const { getExportToTallyData } = store.TallyMasterSettingsStore;
  const { tallybankmastersettingsData } = toJS(store.TallyBankSettingsStore);
  const { getBankExportToTallyData, saveData, setTxnProperty } =
    store.TallyBankSettingsStore;

  const [messsage, setMessage] = React.useState('');
  const [openMesssageDialog, setOpenErrorMesssageDialog] =
    React.useState(false);

  const handleMessageAlertClose = () => {
    setMessage('');
    setOpenErrorMesssageDialog(false);
  };

  const [openReleasingDialog, setOpenReleasingDialog] =
    React.useState(false);

  const handleReleasingAlertClose = () => {
    setOpenReleasingDialog(false);
  };

  useEffect(() => {
    async function fetchData() {
      await getBankExportToTallyData();
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      await getExportToTallyData();
    }

    fetchData();
  }, []);

  const pushToTally = async () => {
    // to integrate by mani
    var envelope = await prepareXmlContent();

    var builder = require('xmlbuilder');
    var root = builder.create(envelope);

    helper.sendXmlDataToTally(root);
  };

  const prepareXmlContent = async () => {
    var tallyMessageList = [];

    for (let bankObj of tallybankmastersettingsData) {
      let bankLedgerGroup = {
        TALLYMESSAGE: {
          '@xmlns:UDF': 'TallyUDF',
          LEDGER: {
            '@Action': 'Create',
            NAME: bankObj.tallyLedgerName,
            PARENT: bankObj.tallyLedgerGroup
              ? bankObj.tallyLedgerGroup
              : bankObj.tallyParentGroup
          }
        }
      };
      tallyMessageList.push(bankLedgerGroup);
    }

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
              '#text': [tallyMessageList]
            }
          }
        }
      }
    };

    return envelope;
  };

  const prepareTallyPartiesImportXML = async () => {
    var builder = require('xmlbuilder');
    let envelope = await prepareXmlContent();

    var root = builder.create(envelope);

    var filename = 'bank_tally_ledger_import.xml';
    var pom = document.createElement('a');
    var bb = new Blob([root], { type: 'text/plain' });

    pom.setAttribute('href', window.URL.createObjectURL(bb));
    pom.setAttribute('download', filename);

    pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
    pom.draggable = true;
    pom.classList.add('dragout');

    pom.click();

    console.log(root.toString());
  };

  return (
    <div>
      <div>
        <Grid container>
          <Grid item xs={7}></Grid>
          <Grid item xs={5}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Button
                variant="contained"
                color="green"
                onClick={function (event) {
                  // do nothing
                }}
                style={{ marginTop: 20, marginRight: 25 }}
              >
                SAVE
              </Button>
              <Button
                variant="contained"
                color="green"
                onClick={function (event) {
                  prepareTallyPartiesImportXML();
                }}
                style={{ marginTop: 20, textAlign: 'center', marginRight: 25 }}
              >
                DOWNLOAD XML
              </Button>
              <Button
                variant="contained"
                color="green"
                onClick={function (event) {
                 // pushToTally();
                 setOpenReleasingDialog(true)
                }}
                style={{ marginTop: 20 }}
              >
                AUTO PUSH TO TALLY
              </Button>
            </div>
          </Grid>
        </Grid>
        <div style={{ margin: '12px' }}>
          <Typography component="subtitle1">
            Recommended approach for seamless book keeping. OneShell will create
            the mentioned Parties Masters in Tally and all further transactions
            will be synced under the mentioned ledgers and groups. However we
            don't restrict Accountants and Auditors to give custom names for
            OneShell to push transactions. <br />
            NOTE: All mapped Masters should be available in Tally upfront
          </Typography>{' '}
        </div>

        {tallybankmastersettingsData &&
          tallybankmastersettingsData.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <Typography
                component="subtitle1"
                style={{
                  margin: '12px',
                  fontWeight: '800',
                  textAlign: 'center'
                }}
              >
                BANKS
              </Typography>

              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  margin: '12px',
                  overflowY: 'scroll'
                }}
              >
                <div style={{ marginRight: '16px', width: '20%' }}>
                  <Typography style={{ fontWeight: '500' }}>
                    {' '}
                    OneShell Ledger Name
                  </Typography>
                </div>

                <div style={{ marginRight: '16px', width: '20%' }}>
                  <Typography style={{ fontWeight: '500' }}>
                    {' '}
                    Tally Ledger Name
                  </Typography>
                </div>

                <div style={{ marginRight: '16px', width: '25%' }}>
                  <Typography style={{ fontWeight: '500' }}>
                    {' '}
                    Tally Sub Group
                  </Typography>
                </div>

                <div style={{ marginRight: '16px', width: '25%' }}>
                  <Typography style={{ fontWeight: '500' }}>
                    {' '}
                    Tally Parent Group
                  </Typography>
                </div>
              </div>

              {tallybankmastersettingsData &&
                tallybankmastersettingsData.map((option, index) => (
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      margin: '12px',
                      overflowY: 'scroll'
                    }}
                  >
                    <div style={{ marginRight: '16px', width: '20%' }}>
                      <TextField
                        fullWidth
                        variant={'outlined'}
                        value={option.oneshellLedgerName}
                        type="text"
                        InputLabelProps={{
                          shrink: true
                        }}
                        onChange={(e) => {
                          setTxnProperty(
                            'oneshellLedgerName',
                            index,
                            e.target.value
                          );
                        }}
                      />
                    </div>

                    <div style={{ marginRight: '16px', width: '20%' }}>
                      <TextField
                        fullWidth
                        variant={'outlined'}
                        value={option.tallyLedgerName}
                        type="text"
                        InputLabelProps={{
                          shrink: true
                        }}
                        onChange={(e) => {
                          setTxnProperty(
                            'tallyLedgerName',
                            index,
                            e.target.value
                          );
                        }}
                      />
                    </div>

                    <div style={{ marginRight: '16px', width: '25%' }}>
                      <TextField
                        fullWidth
                        variant={'outlined'}
                        value={option.tallyLedgerGroup}
                        type="text"
                        InputLabelProps={{
                          shrink: true
                        }}
                        onChange={(e) => {
                          setTxnProperty(
                            'tallyLedgerGroup',
                            index,
                            e.target.value
                          );
                        }}
                      />
                    </div>

                    <div style={{ marginRight: '16px', width: '25%' }}>
                      <TextField
                        fullWidth
                        //disabled={true}
                        variant={'outlined'}
                        value={option.tallyParentGroup}
                        type="text"
                        InputLabelProps={{
                          shrink: true
                        }}
                        onChange={(e) => {
                          setTxnProperty(
                            'tallyParentGroup',
                            index,
                            e.target.value
                          );
                        }}
                      />
                    </div>

                    {/* <InformationIcon
                    style={{ marginTop: '5px' }}
                    className={classes.deleteIcon}
                    /> */}
                  </div>
                ))}
            </div>
          )}
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
          <Button onClick={handleMessageAlertClose} color="primary" autoFocus>
            OK
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
          <DialogContentText>{'Releasing shortly. Please use Download XML feature to import data to Tally'}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReleasingAlertClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InjectObserver(TallyBanks);
