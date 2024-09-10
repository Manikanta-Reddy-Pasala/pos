import React, { useEffect } from 'react';
import {
  Typography,
  makeStyles,
  Grid,
  withStyles,
  TextField,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText
} from '@material-ui/core';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import * as Bd from 'src/components/SelectedBusiness';
import axios from 'axios';
import * as helper from 'src/components/Helpers/TallyApiHelper';
import * as dateHelper from 'src/components/Helpers/DateHelper';
import * as taxSettings from 'src/components/Helpers/TaxSettingsHelper';
import getStateList from 'src/components/StateList';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

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

const TallyMaster = () => {
  const classes = useStyles();
  const store = useStore();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { tallymastersettingsData, mastersSelectionMap } = toJS(
    store.TallyMasterSettingsStore
  );
  const {
    getExportToTallyData,
    saveData,
    setTxnProperty,
    resetMastersToDefaultSettings,
    setTallyCompanyName,
    setMasterSelectionIndex
  } = store.TallyMasterSettingsStore;

  const [openReleasingDialog, setOpenReleasingDialog] =
    React.useState(false);

  const handleReleasingAlertClose = () => {
    setOpenReleasingDialog(false);
  };

  useEffect(() => {
    async function fetchData() {
      await getExportToTallyData();
    }

    fetchData();
  }, []);

  const getDefaultTallyMasterSettings = async () => {
    const businessData = await Bd.getBusinessData();
    const businessId = businessData.businessId;
    const businessCity = businessData.businessCity;

    await axios
      .get(API_SERVER + '/v1/pos/tally/settings/default', {
        params: {
          businessId: businessId,
          businessCity: businessCity
        }
      })
      .then(async (response) => {
        if (response) {
          if (
            response.data &&
            response.data !== null &&
            response.data !== undefined
          ) {
            let tallyMasterSettings = response.data;
            resetMastersToDefaultSettings(tallyMasterSettings);
          }
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  const prepareGroupXmlContent = async () => {
    let tallyMessageList = [];

    // Prepare Groups
    for (let salesObj of tallymastersettingsData.salesMastersMapping) {
      if (
        salesObj.tallyLedgerGroup !== '' &&
        salesObj.tallyParentGroup !== ''
      ) {
        let saleLedgerGroup = {
          TALLYMESSAGE: {
            '@xmlns:UDF': 'TallyUDF',
            GROUP: {
              '@Action': 'Create',
              NAME: salesObj.tallyLedgerGroup,
              PARENT: salesObj.tallyParentGroup,
              'LEDGSTREGDETAILS.LIST': {
                APPLICABLEFROM: dateXMLFormatter(
                  dateHelper.getFinancialYearStartDate()
                ),
                TAXTYPE: 'Others',
                GSTAPPLICABLE: 'Yes',
                GSTTYPEOFSUPPLY: 'Goods',
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: salesObj.tallyLedgerName
                },
                'HSNDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  SRCOFHSNDETAILS: 'As per Company/Group'
                }
              }
            }
          }
        };
        let isGroupAdded = false;
        if (tallyMessageList && tallyMessageList.length > 0) {
          for (let ledGroup of tallyMessageList) {
            if (
              salesObj.tallyLedgerGroup === ledGroup.TALLYMESSAGE.GROUP.NAME
            ) {
              isGroupAdded = true;
              break;
            }
          }
        }
        if (!isGroupAdded) {
          tallyMessageList.push(saleLedgerGroup);
        }
      }
    }

    for (let purchasesObj of tallymastersettingsData.purchasesMastersMapping) {
      if (
        purchasesObj.tallyLedgerGroup !== '' &&
        purchasesObj.tallyParentGroup !== ''
      ) {
        let purchaseLedgerGroup = {
          TALLYMESSAGE: {
            '@xmlns:UDF': 'TallyUDF',
            GROUP: {
              '@Action': 'Create',
              NAME: purchasesObj.tallyLedgerGroup,
              PARENT: purchasesObj.tallyParentGroup,
              'LEDGSTREGDETAILS.LIST': {
                APPLICABLEFROM: dateXMLFormatter(
                  dateHelper.getFinancialYearStartDate()
                ),
                TAXTYPE: 'Others',
                GSTAPPLICABLE: 'Yes',
                GSTTYPEOFSUPPLY: 'Goods',
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: purchasesObj.tallyLedgerName
                },
                'HSNDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  SRCOFHSNDETAILS: 'As per Company/Group'
                }
              }
            }
          }
        };

        let isGroupAdded = false;
        if (tallyMessageList && tallyMessageList.length > 0) {
          for (let ledGroup of tallyMessageList) {
            if (
              purchasesObj.tallyLedgerGroup === ledGroup.TALLYMESSAGE.GROUP.NAME
            ) {
              isGroupAdded = true;
              break;
            }
          }
        }
        if (!isGroupAdded) {
          tallyMessageList.push(purchaseLedgerGroup);
        }
      }
    }

    for (let creditNoteObj of tallymastersettingsData.creditNoteMastersMapping) {
      if (
        creditNoteObj.tallyLedgerGroup !== '' &&
        creditNoteObj.tallyParentGroup !== ''
      ) {
        let saleLedgerGroup = {
          TALLYMESSAGE: {
            '@xmlns:UDF': 'TallyUDF',
            GROUP: {
              '@Action': 'Create',
              NAME: creditNoteObj.tallyLedgerGroup,
              PARENT: creditNoteObj.tallyParentGroup,
              'LEDGSTREGDETAILS.LIST': {
                APPLICABLEFROM: dateXMLFormatter(
                  dateHelper.getFinancialYearStartDate()
                ),
                TAXTYPE: 'Others',
                GSTAPPLICABLE: 'Yes',
                GSTTYPEOFSUPPLY: 'Goods',
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: creditNoteObj.tallyLedgerName
                },
                'HSNDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  SRCOFHSNDETAILS: 'As per Company/Group'
                }
              }
            }
          }
        };
        let isGroupAdded = false;
        if (tallyMessageList && tallyMessageList.length > 0) {
          for (let ledGroup of tallyMessageList) {
            if (
              creditNoteObj.tallyLedgerGroup ===
              ledGroup.TALLYMESSAGE.GROUP.NAME
            ) {
              isGroupAdded = true;
              break;
            }
          }
        }
        if (!isGroupAdded) {
          tallyMessageList.push(saleLedgerGroup);
        }
      }
    }

    for (let debitNoteObj of tallymastersettingsData.debitNoteMastersMapping) {
      if (
        debitNoteObj.tallyLedgerGroup !== '' &&
        debitNoteObj.tallyParentGroup !== ''
      ) {
        let debitNoteLedgerGroup = {
          TALLYMESSAGE: {
            '@xmlns:UDF': 'TallyUDF',
            GROUP: {
              '@Action': 'Create',
              NAME: debitNoteObj.tallyLedgerGroup,
              PARENT: debitNoteObj.tallyParentGroup,
              'LEDGSTREGDETAILS.LIST': {
                APPLICABLEFROM: dateXMLFormatter(
                  dateHelper.getFinancialYearStartDate()
                ),
                TAXTYPE: 'Others',
                GSTAPPLICABLE: 'Yes',
                GSTTYPEOFSUPPLY: 'Goods',
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: debitNoteObj.tallyLedgerName
                },
                'HSNDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  SRCOFHSNDETAILS: 'As per Company/Group'
                }
              }
            }
          }
        };
        let isGroupAdded = false;
        if (tallyMessageList && tallyMessageList.length > 0) {
          for (let ledGroup of tallyMessageList) {
            if (
              debitNoteObj.tallyLedgerGroup === ledGroup.TALLYMESSAGE.GROUP.NAME
            ) {
              isGroupAdded = true;
              break;
            }
          }
        }
        if (!isGroupAdded) {
          tallyMessageList.push(debitNoteLedgerGroup);
        }
      }
    }

    for (let expensesObj of tallymastersettingsData.expensesMastersMapping) {
      if (
        expensesObj.tallyLedgerGroup !== '' &&
        expensesObj.tallyParentGroup !== ''
      ) {
        let expensesLedgerGroup = {
          TALLYMESSAGE: {
            '@xmlns:UDF': 'TallyUDF',
            GROUP: {
              '@Action': 'Create',
              NAME: expensesObj.tallyLedgerGroup,
              PARENT: expensesObj.tallyParentGroup,
              'LEDGSTREGDETAILS.LIST': {
                APPLICABLEFROM: dateXMLFormatter(
                  dateHelper.getFinancialYearStartDate()
                ),
                TAXTYPE: 'Others',
                GSTAPPLICABLE: 'Yes',
                GSTTYPEOFSUPPLY: 'Goods',
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: expensesObj.tallyLedgerName
                },
                'HSNDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  SRCOFHSNDETAILS: 'As per Company/Group'
                }
              }
            }
          }
        };
        let isGroupAdded = false;
        if (tallyMessageList && tallyMessageList.length > 0) {
          for (let ledGroup of tallyMessageList) {
            if (
              expensesObj.tallyLedgerGroup === ledGroup.TALLYMESSAGE.GROUP.NAME
            ) {
              isGroupAdded = true;
              break;
            }
          }
        }
        if (!isGroupAdded) {
          tallyMessageList.push(expensesLedgerGroup);
        }
      }
    }

    for (let taxesObj of tallymastersettingsData.taxesMastersMapping) {
      if (
        taxesObj.tallyLedgerGroup !== '' &&
        taxesObj.tallyParentGroup !== ''
      ) {
        let taxesLedgerGroup = {
          TALLYMESSAGE: {
            '@xmlns:UDF': 'TallyUDF',
            GROUP: {
              '@Action': 'Create',
              NAME: taxesObj.tallyLedgerGroup,
              PARENT: taxesObj.tallyParentGroup,
              'LEDGSTREGDETAILS.LIST': {
                APPLICABLEFROM: dateXMLFormatter(
                  dateHelper.getFinancialYearStartDate()
                ),
                TAXTYPE: 'Others',
                GSTAPPLICABLE: 'Yes',
                GSTTYPEOFSUPPLY: 'Goods',
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: taxesObj.tallyLedgerName
                },
                'HSNDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  SRCOFHSNDETAILS: 'As per Company/Group'
                }
              }
            }
          }
        };
        let isGroupAdded = false;
        if (tallyMessageList && tallyMessageList.length > 0) {
          for (let ledGroup of tallyMessageList) {
            if (
              taxesObj.tallyLedgerGroup === ledGroup.TALLYMESSAGE.GROUP.NAME
            ) {
              isGroupAdded = true;
              break;
            }
          }
        }
        if (!isGroupAdded) {
          tallyMessageList.push(taxesLedgerGroup);
        }
      }
    }

    for (let roundOffObj of tallymastersettingsData.roundOffMastersMapping) {
      if (
        roundOffObj.tallyLedgerGroup !== '' &&
        roundOffObj.tallyParentGroup !== ''
      ) {
        let roundOffLedgerGroup = {
          TALLYMESSAGE: {
            '@xmlns:UDF': 'TallyUDF',
            GROUP: {
              '@Action': 'Create',
              NAME: roundOffObj.tallyLedgerGroup,
              PARENT: roundOffObj.tallyParentGroup,
              'LEDGSTREGDETAILS.LIST': {
                APPLICABLEFROM: dateXMLFormatter(
                  dateHelper.getFinancialYearStartDate()
                ),
                TAXTYPE: 'Others',
                GSTAPPLICABLE: 'Yes',
                GSTTYPEOFSUPPLY: 'Goods',
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: roundOffObj.tallyLedgerName
                },
                'HSNDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  SRCOFHSNDETAILS: 'As per Company/Group'
                }
              }
            }
          }
        };
        let isGroupAdded = false;
        if (tallyMessageList && tallyMessageList.length > 0) {
          for (let ledGroup of tallyMessageList) {
            if (
              roundOffObj.tallyLedgerGroup === ledGroup.TALLYMESSAGE.GROUP.NAME
            ) {
              isGroupAdded = true;
              break;
            }
          }
        }
        if (!isGroupAdded) {
          tallyMessageList.push(roundOffLedgerGroup);
        }
      }
    }

    for (let packingChargesObj of tallymastersettingsData.packingChargesMastersMapping) {
      if (
        packingChargesObj.tallyLedgerGroup !== '' &&
        packingChargesObj.tallyParentGroup !== ''
      ) {
        let packingChargesLedgerGroup = {
          TALLYMESSAGE: {
            '@xmlns:UDF': 'TallyUDF',
            GROUP: {
              '@Action': 'Create',
              NAME: packingChargesObj.tallyLedgerGroup,
              PARENT: packingChargesObj.tallyParentGroup,
              'LEDGSTREGDETAILS.LIST': {
                APPLICABLEFROM: dateXMLFormatter(
                  dateHelper.getFinancialYearStartDate()
                ),
                TAXTYPE: 'Others',
                GSTAPPLICABLE: 'Yes',
                GSTTYPEOFSUPPLY: 'Goods',
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: packingChargesObj.tallyLedgerName
                },
                'HSNDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  SRCOFHSNDETAILS: 'As per Company/Group'
                }
              }
            }
          }
        };
        let isGroupAdded = false;
        if (tallyMessageList && tallyMessageList.length > 0) {
          for (let ledGroup of tallyMessageList) {
            if (
              packingChargesObj.tallyLedgerGroup ===
              ledGroup.TALLYMESSAGE.GROUP.NAME
            ) {
              isGroupAdded = true;
              break;
            }
          }
        }
        if (!isGroupAdded) {
          tallyMessageList.push(packingChargesLedgerGroup);
        }
      }
    }
    for (let shippingChargesObj of tallymastersettingsData.shippingChargesMastersMapping) {
      if (
        shippingChargesObj.tallyLedgerGroup !== '' &&
        shippingChargesObj.tallyParentGroup !== ''
      ) {
        let shippingChargesLedgerGroup = {
          TALLYMESSAGE: {
            '@xmlns:UDF': 'TallyUDF',
            GROUP: {
              '@Action': 'Create',
              NAME: shippingChargesObj.tallyLedgerGroup,
              PARENT: shippingChargesObj.tallyParentGroup,
              'LEDGSTREGDETAILS.LIST': {
                APPLICABLEFROM: dateXMLFormatter(
                  dateHelper.getFinancialYearStartDate()
                ),
                TAXTYPE: 'Others',
                GSTAPPLICABLE: 'Yes',
                GSTTYPEOFSUPPLY: 'Goods',
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: shippingChargesObj.tallyLedgerName
                },
                'HSNDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  SRCOFHSNDETAILS: 'As per Company/Group'
                }
              }
            }
          }
        };
        let isGroupAdded = false;
        if (tallyMessageList && tallyMessageList.length > 0) {
          for (let ledGroup of tallyMessageList) {
            if (
              shippingChargesObj.tallyLedgerGroup ===
              ledGroup.TALLYMESSAGE.GROUP.NAME
            ) {
              isGroupAdded = true;
              break;
            }
          }
        }
        if (!isGroupAdded) {
          tallyMessageList.push(shippingChargesLedgerGroup);
        }
      }
    }
    for (let discountObj of tallymastersettingsData.discountMastersMapping) {
      if (
        discountObj.tallyLedgerGroup !== '' &&
        discountObj.tallyParentGroup !== ''
      ) {
        let discountObjLedgerGroup = {
          TALLYMESSAGE: {
            '@xmlns:UDF': 'TallyUDF',
            GROUP: {
              '@Action': 'Create',
              NAME: discountObj.tallyLedgerGroup,
              PARENT: discountObj.tallyParentGroup,
              'LEDGSTREGDETAILS.LIST': {
                APPLICABLEFROM: dateXMLFormatter(
                  dateHelper.getFinancialYearStartDate()
                ),
                TAXTYPE: 'Others',
                GSTAPPLICABLE: 'Yes',
                GSTTYPEOFSUPPLY: 'Goods',
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: discountObj.tallyLedgerName
                },
                'HSNDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  SRCOFHSNDETAILS: 'As per Company/Group'
                }
              }
            }
          }
        };
        let isGroupAdded = false;
        if (tallyMessageList && tallyMessageList.length > 0) {
          for (let ledGroup of tallyMessageList) {
            if (
              discountObj.tallyLedgerGroup === ledGroup.TALLYMESSAGE.GROUP.NAME
            ) {
              isGroupAdded = true;
              break;
            }
          }
        }
        if (!isGroupAdded) {
          tallyMessageList.push(discountObjLedgerGroup);
        }
      }
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

  function dateXMLFormatter(data) {
    var dateAsString = data;
    var dateParts = dateAsString.split('-');
    return `${dateParts[0]}${dateParts[1]}${dateParts[2]}`;
    //return '20231101';
  }

  function getGSTDetails(oneshellLedgerName) {
    let gstDetails = {};

    if (
      oneshellLedgerName === 'B2C Sales Exempted' ||
      oneshellLedgerName === 'B2C Sales 5%' ||
      oneshellLedgerName === 'B2C Sales 12%' ||
      oneshellLedgerName === 'B2C Sales 18%' ||
      oneshellLedgerName === 'B2C Sales 28%' ||
      oneshellLedgerName === 'B2B Sales Exempted' ||
      oneshellLedgerName === 'B2B Sales 5%' ||
      oneshellLedgerName === 'B2B Sales 12%' ||
      oneshellLedgerName === 'B2B Sales 18%' ||
      oneshellLedgerName === 'B2B Sales 28%' ||
      oneshellLedgerName === 'Purchases Exempted' ||
      oneshellLedgerName === 'Purchases 5%' ||
      oneshellLedgerName === 'Purchases 12%' ||
      oneshellLedgerName === 'Purchases 18%' ||
      oneshellLedgerName === 'Purchases 28%' ||
      oneshellLedgerName === 'Purchases Return Expemted' ||
      oneshellLedgerName === 'Purchases Return 5%' ||
      oneshellLedgerName === 'Purchases Return 12%' ||
      oneshellLedgerName === 'Purchases Return 18%' ||
      oneshellLedgerName === 'Purchases Return 28%' ||
      oneshellLedgerName === 'Direct Expenses Expemted' ||
      oneshellLedgerName === 'Direct Expenses 5%' ||
      oneshellLedgerName === 'Direct Expenses 12%' ||
      oneshellLedgerName === 'Direct Expenses 18%' ||
      oneshellLedgerName === 'Direct Expenses 28%' ||
      oneshellLedgerName === 'Indirect Expenses Expemted' ||
      oneshellLedgerName === 'Indirect Expenses 5%' ||
      oneshellLedgerName === 'Indirect Expenses 12%' ||
      oneshellLedgerName === 'Indirect Expenses 18%' ||
      oneshellLedgerName === 'Indirect Expenses 28%' ||
      oneshellLedgerName === 'Sales Return Expemted B2B' ||
      oneshellLedgerName === 'Sales Return 5% B2B' ||
      oneshellLedgerName === 'Sales Return 12% B2B' ||
      oneshellLedgerName === 'Sales Return 18% B2B' ||
      oneshellLedgerName === 'Sales Return 28% B2B' ||
      oneshellLedgerName === 'Sales Return Expemted B2C' ||
      oneshellLedgerName === 'Sales Return 5% B2C' ||
      oneshellLedgerName === 'Sales Return 12% B2C' ||
      oneshellLedgerName === 'Sales Return 18% B2C' ||
      oneshellLedgerName === 'Sales Return 28% B2C'
    ) {
      let rate = 0;
      let taxability = '';

      switch (oneshellLedgerName) {
        case 'B2C Sales Exempted':
        case 'B2B Sales Exempted':
        case 'Purchases Exempted':
        case 'Purchases Return Expemted':
        case 'Direct Expenses Expemted':
        case 'Indirect Expenses Expemted':
        case 'Sales Return Expemted B2B':
        case 'Sales Return Expemted B2C':
          rate = 0;
          taxability = 'Exempt';
          break;
        case 'B2C Sales 5%':
        case 'B2B Sales 5%':
        case 'Purchases 5%':
        case 'Purchases Return 5%':
        case 'Direct Expenses 5%':
        case 'Indirect Expenses 5%':
        case 'Sales Return 5% B2B':
        case 'Sales Return 5% B2C':
          rate = 5;
          taxability = 'Taxable';
          break;
        case 'B2C Sales 12%':
        case 'B2B Sales 12%':
        case 'Purchases 12%':
        case 'Purchases Return 12%':
        case 'Direct Expenses 12%':
        case 'Indirect Expenses 12%':
        case 'Sales Return 12% B2B':
        case 'Sales Return 12% B2C':
          rate = 12;
          taxability = 'Taxable';
          break;
        case 'B2C Sales 18%':
        case 'B2B Sales 18%':
        case 'Purchases 18%':
        case 'Purchases Return 18%':
        case 'Direct Expenses 18%':
        case 'Indirect Expenses 18%':
        case 'Sales Return 18% B2B':
        case 'Sales Return 18% B2C':
          rate = 18;
          taxability = 'Taxable';
          break;
        case 'B2C Sales 28%':
        case 'B2B Sales 28%':
        case 'Purchases 28%':
        case 'Purchases Return 28%':
        case 'Direct Expenses 28%':
        case 'Indirect Expenses 28%':
        case 'Sales Return 28% B2B':
        case 'Sales Return 28% B2C':
          rate = 28;
          taxability = 'Taxable';
          break;
        default:
          break;
      }

      gstDetails = {
        'GSTDETAILS.LIST': {
          APPLICABLEFROM: dateXMLFormatter(
            dateHelper.getFinancialYearStartDate()
          ),
          TAXABILITY: taxability,
          SRCOFGSTDETAILS: 'Specify Details Here',
          GSTCALCSLABONMRP: 'No',
          ISREVERSECHARGEAPPLICABLE: 'No',
          ISNONGSTGOODS: 'No',
          GSTINELIGIBLEITC: 'Yes',
          INCLUDEEXPFORSLABCALC: 'No',
          'STATEWISEDETAILS.LIST': {
            STATENAME: '&#4; Any',
            'RATEDETAILS.LIST': [
              {
                GSTRATEDUTYHEAD: 'CGST',
                GSTRATEVALUATIONTYPE: 'Based on Value',
                GSTRATE: rate !== 0 ? ' ' + rate / 2 : ' ' + 0
              },
              {
                GSTRATEDUTYHEAD: 'SGST/UTGST',
                GSTRATEVALUATIONTYPE: 'Based on Value',
                GSTRATE: rate !== 0 ? ' ' + rate / 2 : ' ' + 0
              },
              {
                GSTRATEDUTYHEAD: 'IGST',
                GSTRATEVALUATIONTYPE: 'Based on Value',
                GSTRATE: ' ' + rate
              },
              {
                GSTRATEDUTYHEAD: 'Cess',
                GSTRATEVALUATIONTYPE: '&#4; Not Applicable'
              },
              {
                GSTRATEDUTYHEAD: 'State Cess',
                GSTRATEVALUATIONTYPE: 'Based on Value'
              }
            ]
          }
        }
      };
    }

    return gstDetails;
  }

  const prepareLedgersXmlContent = async () => {
    let tallyMessageList = [];

    let b2cPlaceOfSupply = '';

    let taxData = await taxSettings.getTaxSettingsDetails();
    if (taxData && taxData.gstin && taxData.gstin !== '') {
      let businessStateCode = taxData.gstin.slice(0, 2);
      let result = getStateList().find((e) => e.code === businessStateCode);
      if (result) {
        b2cPlaceOfSupply = result.name;
      }
    }

    // Prepare Ledgers
    for (let salesObj of tallymastersettingsData.salesMastersMapping) {
      if (
        mastersSelectionMap &&
        mastersSelectionMap.get(salesObj.oneshellLedgerName)
      ) {
        if (salesObj.oneshellLedgerName.includes('B2B')) {
          let saleLedgerGroup = {
            TALLYMESSAGE: {
              '@xmlns:UDF': 'TallyUDF',
              LEDGER: {
                '@Action': 'Create',
                NAME: salesObj.tallyLedgerName,
                PARENT: salesObj.tallyLedgerGroup
                  ? salesObj.tallyLedgerGroup
                  : salesObj.tallyParentGroup,
                'LEDGSTREGDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  TAXTYPE: 'Others',
                  GSTAPPLICABLE:
                    'B2B Customer Sales' === salesObj.oneshellLedgerName
                      ? 'No'
                      : 'Yes',
                  GSTTYPEOFSUPPLY: 'Goods',
                  'NAME.LIST': {
                    '@TYPE': 'String',
                    NAME: salesObj.tallyLedgerName
                  },
                  'HSNDETAILS.LIST': {
                    APPLICABLEFROM: dateXMLFormatter(
                      dateHelper.getFinancialYearStartDate()
                    ),
                    SRCOFHSNDETAILS: 'As per Company/Group'
                  },
                  'GSTDETAILS.LIST': getGSTDetails(salesObj.oneshellLedgerName)
                }
              }
            }
          };
          tallyMessageList.push(saleLedgerGroup);
        } else {
          let saleLedgerGroup = {
            TALLYMESSAGE: {
              '@xmlns:UDF': 'TallyUDF',
              LEDGER: {
                '@Action': 'Create',
                NAME: salesObj.tallyLedgerName,
                PARENT: salesObj.tallyLedgerGroup
                  ? salesObj.tallyLedgerGroup
                  : salesObj.tallyParentGroup,
                'LEDGSTREGDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  GSTREGISTRATIONTYPE: 'Unregistered/Consumer',
                  PLACEOFSUPPLY: b2cPlaceOfSupply,
                  ISOTHTERRITORYASSESSEE: 'No',
                  CONSIDERPURCHASEFOREXPORT: 'No',
                  ISTRANSPORTER: 'No',
                  ISCOMMONPARTY: 'No',
                  'LEDMAILINGDETAILS.LIST': {
                    APPLICABLEFROM: dateXMLFormatter(
                      dateHelper.getFinancialYearStartDate()
                    ),
                    MAILINGNAME: salesObj.tallyLedgerName,
                    STATE: b2cPlaceOfSupply,
                    COUNTRY: 'India'
                  },
                  TAXTYPE: 'Others',
                  GSTAPPLICABLE:
                    'B2C Customer Sales' === salesObj.oneshellLedgerName
                      ? 'No'
                      : 'Yes',
                  GSTTYPEOFSUPPLY: 'Goods',
                  'NAME.LIST': {
                    '@TYPE': 'String',
                    NAME: salesObj.tallyLedgerName
                  },
                  'HSNDETAILS.LIST': {
                    APPLICABLEFROM: dateXMLFormatter(
                      dateHelper.getFinancialYearStartDate()
                    ),
                    SRCOFHSNDETAILS: 'As per Company/Group'
                  },
                  'GSTDETAILS.LIST': getGSTDetails(salesObj.oneshellLedgerName)
                }
              }
            }
          };
          tallyMessageList.push(saleLedgerGroup);
        }
      }
    }

    for (let purchasesObj of tallymastersettingsData.purchasesMastersMapping) {
      if (
        mastersSelectionMap &&
        mastersSelectionMap.get(purchasesObj.oneshellLedgerName)
      ) {
        let purchaseLedgerGroup = {
          TALLYMESSAGE: {
            '@xmlns:UDF': 'TallyUDF',
            LEDGER: {
              '@Action': 'Create',
              NAME: purchasesObj.tallyLedgerName,
              PARENT: purchasesObj.tallyLedgerGroup
                ? purchasesObj.tallyLedgerGroup
                : purchasesObj.tallyParentGroup,
              'LEDGSTREGDETAILS.LIST': {
                APPLICABLEFROM: dateXMLFormatter(
                  dateHelper.getFinancialYearStartDate()
                ),
                TAXTYPE: 'Others',
                GSTAPPLICABLE: 'Yes',
                GSTTYPEOFSUPPLY: 'Goods',
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: purchasesObj.tallyLedgerName
                },
                'HSNDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  SRCOFHSNDETAILS: 'As per Company/Group'
                },
                'GSTDETAILS.LIST': getGSTDetails(
                  purchasesObj.oneshellLedgerName
                )
              }
            }
          }
        };
        tallyMessageList.push(purchaseLedgerGroup);
      }
    }

    for (let creditNoteObj of tallymastersettingsData.creditNoteMastersMapping) {
      if (
        mastersSelectionMap &&
        mastersSelectionMap.get(creditNoteObj.oneshellLedgerName)
      ) {
        if (creditNoteObj.oneshellLedgerName.includes('B2B')) {
          let saleLedgerGroup = {
            TALLYMESSAGE: {
              '@xmlns:UDF': 'TallyUDF',
              LEDGER: {
                '@Action': 'Create',
                NAME: creditNoteObj.tallyLedgerName,
                PARENT: creditNoteObj.tallyLedgerGroup
                  ? creditNoteObj.tallyLedgerGroup
                  : creditNoteObj.tallyParentGroup,
                'LEDGSTREGDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  TAXTYPE: 'Others',
                  GSTAPPLICABLE: 'Yes',
                  GSTTYPEOFSUPPLY: 'Goods',
                  'NAME.LIST': {
                    '@TYPE': 'String',
                    NAME: creditNoteObj.tallyLedgerName
                  },
                  'HSNDETAILS.LIST': {
                    APPLICABLEFROM: dateXMLFormatter(
                      dateHelper.getFinancialYearStartDate()
                    ),
                    SRCOFHSNDETAILS: 'As per Company/Group'
                  },
                  'GSTDETAILS.LIST': getGSTDetails(
                    creditNoteObj.oneshellLedgerName
                  )
                }
              }
            }
          };
          tallyMessageList.push(saleLedgerGroup);
        } else {
          let saleLedgerGroup = {
            TALLYMESSAGE: {
              '@xmlns:UDF': 'TallyUDF',
              LEDGER: {
                '@Action': 'Create',
                NAME: creditNoteObj.tallyLedgerName,
                PARENT: creditNoteObj.tallyLedgerGroup
                  ? creditNoteObj.tallyLedgerGroup
                  : creditNoteObj.tallyParentGroup,
                'LEDGSTREGDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  GSTREGISTRATIONTYPE: 'Unregistered/Consumer',
                  PLACEOFSUPPLY: b2cPlaceOfSupply,
                  ISOTHTERRITORYASSESSEE: 'No',
                  CONSIDERPURCHASEFOREXPORT: 'No',
                  ISTRANSPORTER: 'No',
                  ISCOMMONPARTY: 'No',
                  'LEDMAILINGDETAILS.LIST': {
                    APPLICABLEFROM: dateXMLFormatter(
                      dateHelper.getFinancialYearStartDate()
                    ),
                    MAILINGNAME: creditNoteObj.tallyLedgerName,
                    STATE: b2cPlaceOfSupply,
                    COUNTRY: 'India'
                  },
                  TAXTYPE: 'Others',
                  GSTAPPLICABLE: 'Yes',
                  GSTTYPEOFSUPPLY: 'Goods',
                  'NAME.LIST': {
                    '@TYPE': 'String',
                    NAME: creditNoteObj.tallyLedgerName
                  },
                  'HSNDETAILS.LIST': {
                    APPLICABLEFROM: dateXMLFormatter(
                      dateHelper.getFinancialYearStartDate()
                    ),
                    SRCOFHSNDETAILS: 'As per Company/Group'
                  },
                  'GSTDETAILS.LIST': getGSTDetails(
                    creditNoteObj.oneshellLedgerName
                  )
                }
              }
            }
          };
          tallyMessageList.push(saleLedgerGroup);
        }
      }
    }
    for (let debitNoteObj of tallymastersettingsData.debitNoteMastersMapping) {
      if (
        mastersSelectionMap &&
        mastersSelectionMap.get(debitNoteObj.oneshellLedgerName)
      ) {
        let debitNoteLedgerGroup = {
          TALLYMESSAGE: {
            '@xmlns:UDF': 'TallyUDF',
            LEDGER: {
              '@Action': 'Create',
              NAME: debitNoteObj.tallyLedgerName,
              PARENT: debitNoteObj.tallyLedgerGroup
                ? debitNoteObj.tallyLedgerGroup
                : debitNoteObj.tallyParentGroup,
              'LEDGSTREGDETAILS.LIST': {
                APPLICABLEFROM: dateXMLFormatter(
                  dateHelper.getFinancialYearStartDate()
                ),
                TAXTYPE: 'Others',
                GSTAPPLICABLE: 'Yes',
                GSTTYPEOFSUPPLY: 'Goods',
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: debitNoteObj.tallyLedgerName
                },
                'HSNDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  SRCOFHSNDETAILS: 'As per Company/Group'
                },
                'GSTDETAILS.LIST': getGSTDetails(
                  debitNoteObj.oneshellLedgerName
                )
              }
            }
          }
        };
        tallyMessageList.push(debitNoteLedgerGroup);
      }
    }

    for (let expensesObj of tallymastersettingsData.expensesMastersMapping) {
      if (
        mastersSelectionMap &&
        mastersSelectionMap.get(expensesObj.oneshellLedgerName)
      ) {
        let expensesLedgerGroup = {
          TALLYMESSAGE: {
            '@xmlns:UDF': 'TallyUDF',
            LEDGER: {
              '@Action': 'Create',
              NAME: expensesObj.tallyLedgerName,
              PARENT: expensesObj.tallyLedgerGroup
                ? expensesObj.tallyLedgerGroup
                : expensesObj.tallyParentGroup,
              'LEDGSTREGDETAILS.LIST': {
                APPLICABLEFROM: dateXMLFormatter(
                  dateHelper.getFinancialYearStartDate()
                ),
                TAXTYPE: 'Others',
                GSTAPPLICABLE: 'Yes',
                GSTTYPEOFSUPPLY: 'Goods',
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: expensesObj.tallyLedgerName
                },
                'HSNDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  SRCOFHSNDETAILS: 'As per Company/Group'
                },
                'GSTDETAILS.LIST': getGSTDetails(expensesObj.oneshellLedgerName)
              }
            }
          }
        };
        tallyMessageList.push(expensesLedgerGroup);
      }
    }

    for (let taxesObj of tallymastersettingsData.taxesMastersMapping) {
      if (
        mastersSelectionMap &&
        mastersSelectionMap.get(taxesObj.oneshellLedgerName)
      ) {
        let taxesLedgerGroup = {
          TALLYMESSAGE: {
            '@xmlns:UDF': 'TallyUDF',
            LEDGER: {
              '@Action': 'Create',
              NAME: taxesObj.tallyLedgerName,
              PARENT: taxesObj.tallyLedgerGroup
                ? taxesObj.tallyLedgerGroup
                : taxesObj.tallyParentGroup,
              'LEDGSTREGDETAILS.LIST': {
                APPLICABLEFROM: dateXMLFormatter(
                  dateHelper.getFinancialYearStartDate()
                ),
                TAXTYPE: 'Others',
                GSTAPPLICABLE: 'Yes',
                GSTTYPEOFSUPPLY: 'Goods',
                GSTDUTYHEAD: taxesObj.oneshellLedgerName.includes('CGST') || taxesObj.oneshellLedgerName.includes('SGST') ? 'SGST/UTGST' : 'IGST',
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: taxesObj.tallyLedgerName
                },
                'HSNDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  SRCOFHSNDETAILS: 'As per Company/Group'
                }
              }
            }
          }
        };
        tallyMessageList.push(taxesLedgerGroup);
      }
    }

    for (let roundOffObj of tallymastersettingsData.roundOffMastersMapping) {
      if (
        mastersSelectionMap &&
        mastersSelectionMap.get(roundOffObj.oneshellLedgerName)
      ) {
        let roundOffLedgerGroup = {
          TALLYMESSAGE: {
            '@xmlns:UDF': 'TallyUDF',
            LEDGER: {
              '@Action': 'Create',
              NAME: roundOffObj.tallyLedgerName,
              PARENT: roundOffObj.tallyLedgerGroup
                ? roundOffObj.tallyLedgerGroup
                : roundOffObj.tallyParentGroup,
              'LEDGSTREGDETAILS.LIST': {
                APPLICABLEFROM: dateXMLFormatter(
                  dateHelper.getFinancialYearStartDate()
                ),
                TAXTYPE: 'Others',
                GSTAPPLICABLE: 'Yes',
                GSTTYPEOFSUPPLY: 'Goods',
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: roundOffObj.tallyLedgerName
                },
                'HSNDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  SRCOFHSNDETAILS: 'As per Company/Group'
                }
              }
            }
          }
        };
        tallyMessageList.push(roundOffLedgerGroup);
      }
    }

    for (let packingChargesObj of tallymastersettingsData.packingChargesMastersMapping) {
      if (
        mastersSelectionMap &&
        mastersSelectionMap.get(packingChargesObj.oneshellLedgerName)
      ) {
        let packingChargesLedgerGroup = {
          TALLYMESSAGE: {
            '@xmlns:UDF': 'TallyUDF',
            LEDGER: {
              '@Action': 'Create',
              NAME: packingChargesObj.tallyLedgerName,
              PARENT: packingChargesObj.tallyLedgerGroup
                ? packingChargesObj.tallyLedgerGroup
                : packingChargesObj.tallyParentGroup,
              'LEDGSTREGDETAILS.LIST': {
                APPLICABLEFROM: dateXMLFormatter(
                  dateHelper.getFinancialYearStartDate()
                ),
                TAXTYPE: 'Others',
                GSTAPPLICABLE: 'Yes',
                GSTTYPEOFSUPPLY: 'Goods',
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: packingChargesObj.tallyLedgerName
                },
                'HSNDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  SRCOFHSNDETAILS: 'As per Company/Group'
                }
              }
            }
          }
        };
        tallyMessageList.push(packingChargesLedgerGroup);
      }
    }

    for (let shippingChargesObj of tallymastersettingsData.shippingChargesMastersMapping) {
      if (
        mastersSelectionMap &&
        mastersSelectionMap.get(shippingChargesObj.oneshellLedgerName)
      ) {
        let shippingChargesLedgerGroup = {
          TALLYMESSAGE: {
            '@xmlns:UDF': 'TallyUDF',
            LEDGER: {
              '@Action': 'Create',
              NAME: shippingChargesObj.tallyLedgerName,
              PARENT: shippingChargesObj.tallyLedgerGroup
                ? shippingChargesObj.tallyLedgerGroup
                : shippingChargesObj.tallyParentGroup,
              'LEDGSTREGDETAILS.LIST': {
                APPLICABLEFROM: dateXMLFormatter(
                  dateHelper.getFinancialYearStartDate()
                ),
                TAXTYPE: 'Others',
                GSTAPPLICABLE: 'Yes',
                GSTTYPEOFSUPPLY: 'Goods',
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: shippingChargesObj.tallyLedgerName
                },
                'HSNDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  SRCOFHSNDETAILS: 'As per Company/Group'
                }
              }
            }
          }
        };
        tallyMessageList.push(shippingChargesLedgerGroup);
      }
    }

    for (let discountObj of tallymastersettingsData.discountMastersMapping) {
      if (
        mastersSelectionMap &&
        mastersSelectionMap.get(discountObj.oneshellLedgerName)
      ) {
        let discountObjLedgerGroup = {
          TALLYMESSAGE: {
            '@xmlns:UDF': 'TallyUDF',
            LEDGER: {
              '@Action': 'Create',
              NAME: discountObj.tallyLedgerName,
              PARENT: discountObj.tallyLedgerGroup
                ? discountObj.tallyLedgerGroup
                : discountObj.tallyParentGroup,
              'LEDGSTREGDETAILS.LIST': {
                APPLICABLEFROM: dateXMLFormatter(
                  dateHelper.getFinancialYearStartDate()
                ),
                TAXTYPE: 'Others',
                GSTAPPLICABLE: 'Yes',
                GSTTYPEOFSUPPLY: 'Goods',
                'NAME.LIST': {
                  '@TYPE': 'String',
                  NAME: discountObj.tallyLedgerName
                },
                'HSNDETAILS.LIST': {
                  APPLICABLEFROM: dateXMLFormatter(
                    dateHelper.getFinancialYearStartDate()
                  ),
                  SRCOFHSNDETAILS: 'As per Company/Group'
                }
              }
            }
          }
        };
        tallyMessageList.push(discountObjLedgerGroup);
      }
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

  const pushDataToTally = async () => {
    // to integrate by mani
    var envelope = await prepareGroupXmlContent();
    var builder = require('xmlbuilder');

    var root = await builder.create(envelope);

    helper.sendXmlDataToTally(root);
  };

  const prepareTallyGroupMastersImportXML = async () => {
    var builder = require('xmlbuilder');
    var envelope = await prepareGroupXmlContent();

    var root = builder.create(envelope);

    var filename = 'tally_oneshell_groups_master_import.xml';
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

  const prepareTallyLedgerMastersImportXML = async () => {
    var builder = require('xmlbuilder');
    var envelope = await prepareLedgersXmlContent();

    var root = builder.create(envelope);

    var filename = 'tally_oneshell_ledgers_master_import.xml';
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
        <Grid item xs={5}></Grid>
        <Grid item xs={7}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Button
              variant="contained"
              color="green"
              onClick={function (event) {
                getDefaultTallyMasterSettings();
              }}
              style={{ marginTop: 20, marginRight: 25 }}
            >
              RESET TO DEFAULT
            </Button>
            <Button
              variant="contained"
              color="green"
              onClick={function (event) {
                saveData();
              }}
              style={{ marginTop: 20, marginRight: 25 }}
            >
              SAVE
            </Button>
            <Button
              variant="contained"
              color="green"
              onClick={function (event) {
                prepareTallyGroupMastersImportXML();
                prepareTallyLedgerMastersImportXML();
              }}
              style={{ marginTop: 20, textAlign: 'center', marginRight: 25 }}
            >
              DOWNLOAD XML
            </Button>
            <Button
              variant="contained"
              color="green"
              onClick={function (event) {
                //pushDataToTally();
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
        <Typography component={'span'} variant={'body2'}>
          Recommended approach for seamless book keeping. OneShell will create
          the mentioned Tally Ledgers and Sub Groups in Tally and all further
          transactions will be synced under the mentioned heads.
          <br />
          NOTE: Tally Parent Groups should be created or made available upfront
          in Tally
        </Typography>{' '}
      </div>

      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          margin: '12px',
          overflowY: 'scroll'
        }}
      >
        <div style={{ marginRight: '16px', marginTop: '5px' }}>
          <Typography Typography component={'span'} variant={'body2'} style={{ fontWeight: '500' }}>
            COMPANY NAME AS PER TALLY:{' '}
          </Typography>
        </div>

        <div style={{ marginRight: '16px' }}>
          <TextField
            fullWidth
            variant={'outlined'}
            value={tallymastersettingsData.tallyCompanyName}
            type="text"
            InputLabelProps={{
              shrink: true
            }}
            onChange={(e) => {
              setTallyCompanyName(e.target.value);
            }}
          />
        </div>
      </div>

      {tallymastersettingsData &&
        tallymastersettingsData.salesMastersMapping &&
        tallymastersettingsData.salesMastersMapping.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <Typography
              component="subtitle1"
              style={{
                marginLeft: '12px',
                fontWeight: '800'
              }}
            >
              SALES
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

            {tallymastersettingsData.salesMastersMapping.map(
              (option, index) => (
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.oneshellLedgerName}
                      type="text"
                      InputLabelProps={{
                        shrink: true
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
                          'salesMastersMapping',
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
                          'salesMastersMapping',
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.tallyParentGroup}
                      type="text"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </div>

                  {/* <InformationIcon
                    style={{ marginTop: '5px' }}
                    className={classes.deleteIcon}
                    /> */}
                  <Checkbox
                    checked={
                      mastersSelectionMap &&
                      mastersSelectionMap.get(option.oneshellLedgerName)
                    }
                    style={{ padding: '0px' }}
                    onChange={(e) => {
                      setMasterSelectionIndex(
                        option.oneshellLedgerName,
                        e.target.checked
                      );
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </div>
              )
            )}
          </div>
        )}

      {tallymastersettingsData &&
        tallymastersettingsData.creditNoteMastersMapping &&
        tallymastersettingsData.creditNoteMastersMapping.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <Typography
              component="subtitle1"
              style={{
                marginLeft: '12px',
                marginTop: '60px',
                fontWeight: '800'
              }}
            >
              SALES RETURN
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

            {tallymastersettingsData.creditNoteMastersMapping.map(
              (option, index) => (
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.oneshellLedgerName}
                      type="text"
                      InputLabelProps={{
                        shrink: true
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
                          'creditNoteMastersMapping',
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
                          'creditNoteMastersMapping',
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.tallyParentGroup}
                      type="text"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </div>

                  {/* <InformationIcon
                    style={{ marginTop: '5px' }}
                    className={classes.deleteIcon}
                    /> */}
                  <Checkbox
                    checked={
                      mastersSelectionMap &&
                      mastersSelectionMap.get(option.oneshellLedgerName)
                    }
                    style={{ padding: '0px' }}
                    onChange={(e) => {
                      setMasterSelectionIndex(
                        option.oneshellLedgerName,
                        e.target.checked
                      );
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </div>
              )
            )}
          </div>
        )}

      {tallymastersettingsData &&
        tallymastersettingsData.purchasesMastersMapping &&
        tallymastersettingsData.purchasesMastersMapping.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <Typography
              component="subtitle1"
              style={{
                margin: '12px',
                fontWeight: '800',
                textAlign: 'center'
              }}
            >
              PURCHASES
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

            {tallymastersettingsData.purchasesMastersMapping.map(
              (option, index) => (
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.oneshellLedgerName}
                      type="text"
                      InputLabelProps={{
                        shrink: true
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
                          'purchasesMastersMapping',
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
                          'purchasesMastersMapping',
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.tallyParentGroup}
                      type="text"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </div>

                  {/* <InformationIcon
                    style={{ marginTop: '5px' }}
                    className={classes.deleteIcon}
                    /> */}
                  <Checkbox
                    checked={
                      mastersSelectionMap &&
                      mastersSelectionMap.get(option.oneshellLedgerName)
                    }
                    style={{ padding: '0px' }}
                    onChange={(e) => {
                      setMasterSelectionIndex(
                        option.oneshellLedgerName,
                        e.target.checked
                      );
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </div>
              )
            )}
          </div>
        )}

      {tallymastersettingsData &&
        tallymastersettingsData.debitNoteMastersMapping &&
        tallymastersettingsData.debitNoteMastersMapping.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <Typography
              component="subtitle1"
              style={{
                margin: '12px',
                fontWeight: '800',
                textAlign: 'center'
              }}
            >
              PURCHASES RETURN
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

            {tallymastersettingsData.debitNoteMastersMapping.map(
              (option, index) => (
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.oneshellLedgerName}
                      type="text"
                      InputLabelProps={{
                        shrink: true
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
                          'debitNoteMastersMapping',
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
                          'debitNoteMastersMapping',
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.tallyParentGroup}
                      type="text"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </div>

                  {/* <InformationIcon
                    style={{ marginTop: '5px' }}
                    className={classes.deleteIcon}
                    /> */}
                  <Checkbox
                    checked={
                      mastersSelectionMap &&
                      mastersSelectionMap.get(option.oneshellLedgerName)
                    }
                    style={{ padding: '0px' }}
                    onChange={(e) => {
                      setMasterSelectionIndex(
                        option.oneshellLedgerName,
                        e.target.checked
                      );
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </div>
              )
            )}
          </div>
        )}

      {tallymastersettingsData &&
        tallymastersettingsData.expensesMastersMapping &&
        tallymastersettingsData.expensesMastersMapping.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <Typography
              component="subtitle1"
              style={{
                margin: '12px',
                fontWeight: '800',
                textAlign: 'center'
              }}
            >
              EXPENSES
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

            {tallymastersettingsData.expensesMastersMapping.map(
              (option, index) => (
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.oneshellLedgerName}
                      type="text"
                      InputLabelProps={{
                        shrink: true
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
                          'expensesMastersMapping',
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
                          'expensesMastersMapping',
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.tallyParentGroup}
                      type="text"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </div>

                  {/* <InformationIcon
                    style={{ marginTop: '5px' }}
                    className={classes.deleteIcon}
                    /> */}
                  <Checkbox
                    checked={
                      mastersSelectionMap &&
                      mastersSelectionMap.get(option.oneshellLedgerName)
                    }
                    style={{ padding: '0px' }}
                    onChange={(e) => {
                      setMasterSelectionIndex(
                        option.oneshellLedgerName,
                        e.target.checked
                      );
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </div>
              )
            )}
          </div>
        )}

      {tallymastersettingsData &&
        tallymastersettingsData.taxesMastersMapping &&
        tallymastersettingsData.taxesMastersMapping.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <Typography
              component="subtitle1"
              style={{
                margin: '12px',
                fontWeight: '800',
                textAlign: 'center'
              }}
            >
              TAXES
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

            {tallymastersettingsData.taxesMastersMapping.map(
              (option, index) => (
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.oneshellLedgerName}
                      type="text"
                      InputLabelProps={{
                        shrink: true
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
                          'taxesMastersMapping',
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
                          'taxesMastersMapping',
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.tallyParentGroup}
                      type="text"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </div>

                  {/* <InformationIcon
                    style={{ marginTop: '5px' }}
                    className={classes.deleteIcon}
                    /> */}
                  <Checkbox
                    checked={
                      mastersSelectionMap &&
                      mastersSelectionMap.get(option.oneshellLedgerName)
                    }
                    style={{ padding: '0px' }}
                    onChange={(e) => {
                      setMasterSelectionIndex(
                        option.oneshellLedgerName,
                        e.target.checked
                      );
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </div>
              )
            )}
          </div>
        )}

      {tallymastersettingsData &&
        tallymastersettingsData.roundOffMastersMapping &&
        tallymastersettingsData.roundOffMastersMapping.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <Typography
              component="subtitle1"
              style={{
                margin: '12px',
                fontWeight: '800',
                textAlign: 'center'
              }}
            >
              ROUND OFF
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

            {tallymastersettingsData.roundOffMastersMapping.map(
              (option, index) => (
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.oneshellLedgerName}
                      type="text"
                      InputLabelProps={{
                        shrink: true
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
                          'roundOffMastersMapping',
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
                          'roundOffMastersMapping',
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.tallyParentGroup}
                      type="text"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </div>

                  {/* <InformationIcon
                    style={{ marginTop: '5px' }}
                    className={classes.deleteIcon}
                    /> */}
                  <Checkbox
                    checked={
                      mastersSelectionMap &&
                      mastersSelectionMap.get(option.oneshellLedgerName)
                    }
                    style={{ padding: '0px' }}
                    onChange={(e) => {
                      setMasterSelectionIndex(
                        option.oneshellLedgerName,
                        e.target.checked
                      );
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </div>
              )
            )}
          </div>
        )}

      {tallymastersettingsData &&
        tallymastersettingsData.packingChargesMastersMapping &&
        tallymastersettingsData.packingChargesMastersMapping.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <Typography
              component="subtitle1"
              style={{
                margin: '12px',
                fontWeight: '800',
                textAlign: 'center'
              }}
            >
              PACKING CHARGES
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

            {tallymastersettingsData.packingChargesMastersMapping.map(
              (option, index) => (
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.oneshellLedgerName}
                      type="text"
                      InputLabelProps={{
                        shrink: true
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
                          'packingChargesMastersMapping',
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
                          'packingChargesMastersMapping',
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.tallyParentGroup}
                      type="text"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </div>

                  {/* <InformationIcon
                    style={{ marginTop: '5px' }}
                    className={classes.deleteIcon}
                    /> */}
                  <Checkbox
                    checked={
                      mastersSelectionMap &&
                      mastersSelectionMap.get(option.oneshellLedgerName)
                    }
                    style={{ padding: '0px' }}
                    onChange={(e) => {
                      setMasterSelectionIndex(
                        option.oneshellLedgerName,
                        e.target.checked
                      );
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </div>
              )
            )}
          </div>
        )}

      {tallymastersettingsData &&
        tallymastersettingsData.shippingChargesMastersMapping &&
        tallymastersettingsData.shippingChargesMastersMapping.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <Typography
              component="subtitle1"
              style={{
                margin: '12px',
                fontWeight: '800',
                textAlign: 'center'
              }}
            >
              SHIPPING CHARGES
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

            {tallymastersettingsData.shippingChargesMastersMapping.map(
              (option, index) => (
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.oneshellLedgerName}
                      type="text"
                      InputLabelProps={{
                        shrink: true
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
                          'shippingChargesMastersMapping',
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
                          'shippingChargesMastersMapping',
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.tallyParentGroup}
                      type="text"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </div>

                  {/* <InformationIcon
                    style={{ marginTop: '5px' }}
                    className={classes.deleteIcon}
                    /> */}
                  <Checkbox
                    checked={
                      mastersSelectionMap &&
                      mastersSelectionMap.get(option.oneshellLedgerName)
                    }
                    style={{ padding: '0px' }}
                    onChange={(e) => {
                      setMasterSelectionIndex(
                        option.oneshellLedgerName,
                        e.target.checked
                      );
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </div>
              )
            )}
          </div>
        )}

      {tallymastersettingsData &&
        tallymastersettingsData.discountMastersMapping &&
        tallymastersettingsData.discountMastersMapping.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <Typography
              component="subtitle1"
              style={{
                margin: '12px',
                fontWeight: '800',
                textAlign: 'center'
              }}
            >
              DISCOUNT
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

            {tallymastersettingsData.discountMastersMapping.map(
              (option, index) => (
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.oneshellLedgerName}
                      type="text"
                      InputLabelProps={{
                        shrink: true
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
                          'discountMastersMapping',
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
                          'discountMastersMapping',
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
                      disabled={true}
                      variant={'outlined'}
                      value={option.tallyParentGroup}
                      type="text"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </div>

                  {/* <InformationIcon
                    style={{ marginTop: '5px' }}
                    className={classes.deleteIcon}
                    /> */}
                  <Checkbox
                    checked={
                      mastersSelectionMap &&
                      mastersSelectionMap.get(option.oneshellLedgerName)
                    }
                    style={{ padding: '0px' }}
                    onChange={(e) => {
                      setMasterSelectionIndex(
                        option.oneshellLedgerName,
                        e.target.checked
                      );
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </div>
              )
            )}
          </div>
        )}
    </div>
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

export default InjectObserver(TallyMaster);