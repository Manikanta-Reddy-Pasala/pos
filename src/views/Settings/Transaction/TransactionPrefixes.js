import React, { useEffect } from 'react';
import { TextField, Button } from '@material-ui/core';
import Page from '../../../components/Page';
import { toJS } from 'mobx';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import AddPrefixesModal from './modal/addPrefixesModal';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Grid,
  makeStyles,
  Typography,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogContent,
  withStyles
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import AddBillTypeModal from './modal/addBillTypeModal';
import AddNoPrefixesModal from './modal/addNoPrefixesModal';
import * as Bd from 'src/components/SelectedBusiness';

const DialogTitle = withStyles((theme) => ({
  root: {
    '& h2': {
      fontSize: '22px'
    },
    '& .closeButton': {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.success[500]
    }
  }
}))(MuiDialogTitle);

const DialogActions = withStyles((theme) => ({
  root: {
    marginTop: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
    // backgroundColor: theme.palette.background.paper,
  },
  PlaceOfsupplyListbox: {
    minWidth: '18%',
    margin: 0,
    padding: 5,
    zIndex: 1,
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
  liBtn: {
    width: '40%',
    justifyContent: 'start',
    padding: '7px 8px',
    textTransform: 'none',
    fontWeight: '300',
    fontSize: 'small',
    '&:focus': {
      background: '#ededed',
      outline: 0,
      border: 0,
      fontWeight: 'bold'
    }
  },
  addPrefixbtn: {
    fontSize: 'small',
    color: '#EF5350'
  },
  subHeader: {
    color: '#4A83FB',
    textDecoration: 'underline',
    marginTop: '25px',
    marginBottom: '10px',
    fontWeight: 500
  },
  checkboxCenterAlign: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'end'
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: 20,
    float: 'right'
  }
}));

const TransactionPrefixesSettings = () => {
  const classes = useStyles();
  const stores = useStore();

  const {
    setTransactionProperty,
    handlePrefixesModalOpen,
    handleRemovePrefix,
    setBillType,
    removeBillType,
    handleBillTypeModalOpen,
    saveSinglePrefix,
    getTransactionData,
    handleNoPrefixesModalOpen
  } = stores.TransactionStore;

  const { transaction } = toJS(stores.TransactionStore);

  const [billTypesMenuOpenStatus, setBillTypesMenuOpenStatus] =
    React.useState(false);
  const [SalesPrefixesMenuOpenStatus, setSalesPrefixeMenuOpenStatus] =
    React.useState(false);
  const [SalesSubPrefixesMenuOpenStatus, setSalesSubPrefixeMenuOpenStatus] =
    React.useState(false);
  const [modalTitle, setModalTitle] = React.useState('');
  const [property, setProperty] = React.useState('');
  const [subProperty, setSubProperty] = React.useState();
  const [currentYear, setCurrentYear] = React.useState('');
  const [salesPreCumSeq, setSalesPreCumSeq] = React.useState('');
  const [salesRPreCumSeq, setSalesRPreCumSeq] = React.useState('');
  const [paymentInPreCumSeq, setPaymentInPreCumSeq] = React.useState('');
  const [paymentOutPreCumSeq, setPaymentOutPreCumSeq] = React.useState('');
  const [removeTitle, setRemoveTitle] = React.useState('');
  const [removeMsg, setRemoveMsg] = React.useState('');
  const [openDeleteAlert, setOpenDeleteAlert] = React.useState(false);
  const [isDeleteAlertYes, setIsDeleteAlertYes] = React.useState(false);
  const [removeIndex, setRemoveIndex] = React.useState(0);
  const [currentNo, setCurrentNo] = React.useState('');

  const [
    salesReturnSubPrefixesMenuOpenStatus,
    setsalesReturnSubPrefixeMenuOpenStatus
  ] = React.useState(false);
  const [
    salesReturnPrefixesMenuOpenStatus,
    setsalesReturnPrefixeMenuOpenStatus
  ] = React.useState(false);

  const [paymentInPrefixesMenuOpenStatus, setpaymentInPrefixeMenuOpenStatus] =
    React.useState(false);

  const [
    paymentInSubPrefixesMenuOpenStatus,
    setpaymentInSubPrefixeMenuOpenStatus
  ] = React.useState(false);

  const [paymentOutPrefixesMenuOpenStatus, setpaymentOutPrefixeMenuOpenStatus] =
    React.useState(false);

  const [
    paymentOutSubPrefixesMenuOpenStatus,
    setpaymentOutSubPrefixeMenuOpenStatus
  ] = React.useState(false);

  const inputRef = React.useRef([]);

  const [salesQuotationPrefixesVal, setSalesQuotationPrefixesVal] =
    React.useState('');
  const [salesQuotationSequenceNoVal, setSalesQuotationSequenceNoVal] =
    React.useState(1);

  const [approvalPrefixesVal, setApprovalPrefixesVal] = React.useState('');
  const [approvalSequenceNoVal, setApprovalSequenceNoVal] = React.useState(1);

  const [jobWorkOrderInPrefixesVal, setJobWorkOrderInPrefixesVal] =
    React.useState('');
  const [jobWorkOrderInSequenceNoVal, setJobWorkOrderInSequenceNoVal] =
    React.useState(1);

  const [jobWorkOrderOutPrefixesVal, setJobWorkOrderOutPrefixesVal] =
    React.useState('');
  const [jobWorkOrderOutSequenceNoVal, setJobWorkOrderOutSequenceNoVal] =
    React.useState(1);

  const [workOrderReceiptPrefixesVal, setWorkOrderReceiptPrefixesVal] =
    React.useState('');
  const [workOrderReceiptSequenceNoVal, setWorkOrderReceiptSequenceNoVal] =
    React.useState(1);

  const [deliveryChallanPrefixesVal, setDeliveryChallanPrefixesVal] =
    React.useState('');
  const [deliveryChallanSequenceNoVal, setDeliveryChallanSequenceNoVal] =
    React.useState(1);

  const [purchaseOrderPrefixesVal, setPurchaseOrderPrefixesVal] =
    React.useState('');
  const [purchaseOrderSequenceNoVal, setPurchaseOrderSequenceNoVal] =
    React.useState(1);

  const [saleOrderPrefixesVal, setSaleOrderPrefixesVal] = React.useState('');
  const [saleOrderSequenceNoVal, setSaleOrderSequenceNoVal] = React.useState(1);

  const [manufacturePrefixesVal, setManufacturePrefixesVal] =
    React.useState('');
  const [manufactureSequenceNoVal, setManufactureSequenceNoVal] =
    React.useState(1);

  const [expensePrefixesVal, setExpensePrefixesVal] = React.useState('');
  const [expenseSequenceNoVal, setExpenseSequenceNoVal] = React.useState(1);

  const [stockPrefixesVal, setStockPrefixesVal] = React.useState('');
  const [stockSequenceNoVal, setStockSequenceNoVal] = React.useState(1);

  const [tallyReceiptPrefixesVal, setTallyReceiptPrefixesVal] =
    React.useState('');
  const [tallyReceiptSequenceNoVal, setTallyReceiptSequenceNoVal] =
    React.useState(1);

  const [saleDefaultPrefix, setSaleDefaultPrefix] = React.useState('');
  const [saleDefaultSubPrefix, setSaleDefaultSubPrefix] = React.useState('');

  const [saleReturnDefaultPrefix, setSaleReturnDefaultPrefix] =
    React.useState('');
  const [saleReturnDefaultSubPrefix, setSaleReturnDefaultSubPrefix] =
    React.useState('');

  const [paymentInDefaultPrefix, setPaymentInDefaultPrefix] =
    React.useState('');
  const [paymentInDefaultSubPrefix, setPaymentInDefaultSubPrefix] =
    React.useState('');

  const [paymentOutDefaultPrefix, setPaymentOutDefaultPrefix] =
    React.useState('');
  const [paymentOutDefaultSubPrefix, setPaymentOutDefaultSubPrefix] =
    React.useState('');

  const [schemePrefixesVal, setSchemePrefixesVal] = React.useState('');
  const [schemeSequenceNoVal, setSchemeSequenceNoVal] = React.useState(1);
  const [businessId, setBusinessId] = React.useState('');

  const [tallyPaymentPrefixesVal, setTallyPaymentPrefixesVal] =
    React.useState('');
  const [tallyPaymentSequenceNoVal, setTallyPaymentSequenceNoVal] =
    React.useState(1);

  const {
    handleSalesSearchWithPrefix,
    handleSalesSearchWithSubPrefix,
    handleSalesSearchWithBillType
  } = stores.SalesAddStore;
  const {
    handleSalesReturnSearchWithPrefix,
    handleSalesReturnSearchWithSubPrefix
  } = stores.ReturnsAddStore;
  const {
    handlePaymentInSearchWithPrefix,
    handlePaymentInSearchWithSubPrefix
  } = stores.PaymentInStore;
  const {
    handlePaymentOutSearchWithPrefix,
    handlePaymentOutSearchWithSubPrefix
  } = stores.PaymentOutStore;
  const [deleteTransactionsData, setDeleteTransactionsData] = React.useState();

  const handleKeyDown = (e, TopIndex, RightIndex, BottomIndex, LeftIndex) => {
    let next = '';

    if (e.keyCode === 37) {
      next = inputRef.current[LeftIndex];
    }
    if (e.keyCode === 38) {
      next = inputRef.current[TopIndex];
    }
    if (e.keyCode === 39) {
      next = inputRef.current[RightIndex];
    }
    if (e.keyCode === 40) {
      next = inputRef.current[BottomIndex];
    }

    if (next) {
      setTimeout(() => {
        next.focus();
      }, 50);
    }
  };

  useEffect(() => {
    async function fetchData() {
      await getTransactionData();
      const businessData = await Bd.getBusinessData();
      const businessId = businessData.businessId;

      setBusinessId(businessId);
      // Sale
      if (
        localStorage.getItem(businessId + '_saleDefaultPrefix') !== '' &&
        localStorage.getItem(businessId + '_saleDefaultPrefix') !== undefined &&
        localStorage.getItem(businessId + '_saleDefaultPrefix') !== null
      ) {
        setSaleDefaultPrefix(
          localStorage.getItem(businessId + '_saleDefaultPrefix')
        );
      }

      if (
        localStorage.getItem(businessId + '_saleDefaultSubPrefix') !== '' &&
        localStorage.getItem(businessId + '_saleDefaultSubPrefix') !==
          undefined &&
        localStorage.getItem(businessId + '_saleDefaultSubPrefix') !== null
      ) {
        setSaleDefaultSubPrefix(
          localStorage.getItem(businessId + '_saleDefaultSubPrefix')
        );
      }

      // Sale Return
      if (
        localStorage.getItem(businessId + '_saleReturnDefaultPrefix') !== '' &&
        localStorage.getItem(businessId + '_saleReturnDefaultPrefix') !==
          undefined &&
        localStorage.getItem(businessId + '_saleReturnDefaultPrefix') !== null
      ) {
        setSaleReturnDefaultPrefix(
          localStorage.getItem(businessId + '_saleReturnDefaultPrefix')
        );
      }

      if (
        localStorage.getItem(businessId + '_saleReturnDefaultSubPrefix') !==
          '' &&
        localStorage.getItem(businessId + '_saleReturnDefaultSubPrefix') !==
          undefined &&
        localStorage.getItem(businessId + '_saleReturnDefaultSubPrefix') !==
          null
      ) {
        setSaleReturnDefaultSubPrefix(
          localStorage.getItem(businessId + '_saleReturnDefaultSubPrefix')
        );
      }

      // Payment In
      if (
        localStorage.getItem(businessId + '_paymentInDefaultPrefix') !== '' &&
        localStorage.getItem(businessId + '_paymentInDefaultPrefix') !==
          undefined &&
        localStorage.getItem(businessId + '_paymentInDefaultPrefix') !== null
      ) {
        setPaymentInDefaultPrefix(
          localStorage.getItem(businessId + '_paymentInDefaultPrefix')
        );
      }

      if (
        localStorage.getItem(businessId + '_paymentInDefaultSubPrefix') !==
          '' &&
        localStorage.getItem(businessId + '_paymentInDefaultSubPrefix') !==
          undefined &&
        localStorage.getItem(businessId + '_paymentInDefaultSubPrefix') !== null
      ) {
        setPaymentInDefaultSubPrefix(
          localStorage.getItem(businessId + '_paymentInDefaultSubPrefix')
        );
      }

      // Payment Out
      if (
        localStorage.getItem(businessId + '_paymentOutDefaultPrefix') !== '' &&
        localStorage.getItem(businessId + '_paymentOutDefaultPrefix') !==
          undefined &&
        localStorage.getItem(businessId + '_paymentOutDefaultPrefix') !== null
      ) {
        setPaymentOutDefaultPrefix(
          localStorage.getItem(businessId + '_paymentOutDefaultPrefix')
        );
      }

      if (
        localStorage.getItem(businessId + '_paymentOutDefaultSubPrefix') !==
          '' &&
        localStorage.getItem(businessId + '_paymentOutDefaultSubPrefix') !==
          undefined &&
        localStorage.getItem(businessId + '_paymentOutDefaultSubPrefix') !==
          null
      ) {
        setPaymentOutDefaultSubPrefix(
          localStorage.getItem(businessId + '_paymentOutDefaultSubPrefix')
        );
      }
    }

    fetchData();
  }, [getTransactionData]);

  const handlePrefixesDialogOpen = (title, property, subProperty) => {
    handlePrefixesModalOpen();
    setModalTitle(title);
    setProperty(property);
    setSubProperty(subProperty);
  };

  const handleNoPrefixesDialogOpen = (property) => {
    handleNoPrefixesModalOpen();
    setProperty(property);
    setCurrentNo(transaction[property].noPrefixSequenceNo);
  };

  useEffect(() => {
    let finalYear = 0;
    let current_year = new Date().getFullYear().toString().substr(-2);
    let month = new Date().getMonth() + 1;
    if (month > 3) {
      finalYear = `${current_year}-${Number(current_year) - 1}`;
    }

    if (month < 3) {
      finalYear = `${Number(current_year) - 1}-${current_year}`;
    }
    setCurrentYear(finalYear);
  }, []);

  const handleCloseDeleteAlert = () => {
    setOpenDeleteAlert(false);
  };

  const handleDeleteAlertYes = () => {
    if (removeTitle == 'Bill Type') {
      removeBillType(removeIndex);
    } else if (removeTitle === 'Sales Prefix') {
      handleRemovePrefix('sales', 'prefixSequence', removeIndex);
    } else if (removeTitle === 'Sales Suffix') {
      handleRemovePrefix('sales', 'subPrefixesList', removeIndex);
    } else if (removeTitle === 'Sales Return Prefix') {
      handleRemovePrefix('salesReturn', 'prefixSequence', removeIndex);
    } else if (removeTitle === 'Sales Return Suffix') {
      handleRemovePrefix('salesReturn', 'subPrefixesList', removeIndex);
    } else if (removeTitle === 'Payment-In Prefix') {
      handleRemovePrefix('paymentIn', 'prefixSequence', removeIndex);
    } else if (removeTitle === 'Payment-In Suffix') {
      handleRemovePrefix('paymentIn', 'subPrefixesList', removeIndex);
    } else if (removeTitle === 'Payment-Out Prefix') {
      handleRemovePrefix('paymentOut', 'prefixSequence', removeIndex);
    } else if (removeTitle === 'Payment-Out Suffix') {
      handleRemovePrefix('paymentOut', 'subPrefixesList', removeIndex);
    }

    setDeleteTransactionsData([]);
    setOpenDeleteAlert(false);
  };

  const checkForBillTypeData = async (index) => {
    setBillTypesMenuOpenStatus(false);
    setRemoveTitle('Bill Type');
    setRemoveMsg(
      'This Bill Type has transactions, Do u still want to delete ?'
    );
    setRemoveIndex(index);

    setDeleteTransactionsData(
      await handleSalesSearchWithBillType(transaction.billTypes[index])
    );
  };

  const checkForSalePrefixData = async (index) => {
    setRemoveTitle('Sales Prefix');
    setRemoveMsg(
      'This Sales Prefix has transactions, Do u still want to delete ?'
    );
    setRemoveIndex(index);

    setDeleteTransactionsData(
      await handleSalesSearchWithPrefix(
        transaction['sales']['prefixSequence'][index].prefix
      )
    );
  };

  const checkForSaleSuffixData = async (index) => {
    setRemoveTitle('Sales Suffix');
    setRemoveMsg(
      'This Sales Suffix has transactions, Do u still want to delete ?'
    );
    setRemoveIndex(index);

    setDeleteTransactionsData(
      await handleSalesSearchWithSubPrefix(
        transaction['sales']['subPrefixesList'][index]
      )
    );
  };

  const checkForSalesReturnPrefixData = async (index) => {
    setRemoveTitle('Sales Return Prefix');
    setRemoveMsg(
      'This Sales Return Prefix has transactions, Do u still want to delete ?'
    );
    setRemoveIndex(index);

    setDeleteTransactionsData(
      await handleSalesReturnSearchWithPrefix(
        transaction['salesReturn']['prefixSequence'][index].prefix
      )
    );
  };

  const checkForSalesReturnSuffixData = async (index) => {
    setRemoveTitle('Sales Return Suffix');
    setRemoveMsg(
      'This Sales Return Suffix has transactions, Do u still want to delete ?'
    );
    setRemoveIndex(index);

    setDeleteTransactionsData(
      await handleSalesReturnSearchWithSubPrefix(
        transaction['salesReturn']['subPrefixesList'][index]
      )
    );
  };

  const checkForPaymentInPrefixData = async (index) => {
    setRemoveTitle('Payment-In Prefix');
    setRemoveMsg(
      'This Payment-In Prefix has transactions, Do u still want to delete ?'
    );
    setRemoveIndex(index);

    setDeleteTransactionsData(
      await handlePaymentInSearchWithPrefix(
        transaction['paymentIn']['prefixSequence'][index].prefix
      )
    );
  };

  const checkForPaymentInSuffixData = async (index) => {
    setRemoveTitle('Payment-In Suffix');
    setRemoveMsg(
      'This Payment-In Suffix has transactions, Do u still want to delete ?'
    );
    setRemoveIndex(index);

    setDeleteTransactionsData(
      await handlePaymentInSearchWithSubPrefix(
        transaction['paymentIn']['subPrefixesList'][index]
      )
    );
  };

  const checkForPaymentOutPrefixData = async (index) => {
    setRemoveTitle('Payment-Out Prefix');
    setRemoveMsg(
      'This Payment-Out Prefix has transactions, Do u still want to delete ?'
    );
    setRemoveIndex(index);

    setDeleteTransactionsData(
      await handlePaymentOutSearchWithPrefix(
        transaction['paymentOut']['prefixSequence'][index].prefix
      )
    );
  };

  const checkForPaymentOutSuffixData = async (index) => {
    setRemoveTitle('Payment-Out Suffix');
    setRemoveMsg(
      'This Payment-Out Suffix has transactions, Do u still want to delete ?'
    );
    setRemoveIndex(index);

    setDeleteTransactionsData(
      await handlePaymentOutSearchWithSubPrefix(
        transaction['paymentOut']['subPrefixesList'][index]
      )
    );
  };

  useEffect(() => {
    if (deleteTransactionsData && deleteTransactionsData.length > 0) {
      showDeleteAlert();
    } else {
      if (removeTitle === 'Bill Type') {
        removeBillType(removeIndex);
      } else if (removeTitle === 'Sales Prefix') {
        handleRemovePrefix('sales', 'prefixSequence', removeIndex);
      } else if (removeTitle === 'Sales Suffix') {
        handleRemovePrefix('sales', 'subPrefixesList', removeIndex);
      } else if (removeTitle === 'Sales Return Prefix') {
        handleRemovePrefix('salesReturn', 'prefixSequence', removeIndex);
      } else if (removeTitle === 'Sales Return Suffix') {
        handleRemovePrefix('salesReturn', 'subPrefixesList', removeIndex);
      } else if (removeTitle === 'Payment-In Prefix') {
        handleRemovePrefix('paymentIn', 'prefixSequence', removeIndex);
      } else if (removeTitle === 'Payment-In Suffix') {
        handleRemovePrefix('paymentIn', 'subPrefixesList', removeIndex);
      } else if (removeTitle === 'Payment-Out Prefix') {
        handleRemovePrefix('paymentOut', 'prefixSequence', removeIndex);
      } else if (removeTitle === 'Payment-Out Suffix') {
        handleRemovePrefix('paymentOut', 'subPrefixesList', removeIndex);
      }
    }
  }, [deleteTransactionsData]);

  const handleDeleteAlertNo = () => {
    setIsDeleteAlertYes(false);
    setOpenDeleteAlert(false);
  };

  const showDeleteAlert = () => {
    setOpenDeleteAlert(true);
  };

  return (
    <Page className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            style={{ marginTop: '30px', marginBottom: '10px' }}
          >
            Bill Types
          </Typography>

          <Grid container>
            <Grid
              item
              xs={4}
              onClick={(e) => {
                setSalesSubPrefixeMenuOpenStatus(false);
                setsalesReturnPrefixeMenuOpenStatus(false);
                setsalesReturnSubPrefixeMenuOpenStatus(false);
                setpaymentInPrefixeMenuOpenStatus(false);
                setpaymentInSubPrefixeMenuOpenStatus(false);
                setSalesPrefixeMenuOpenStatus(false);
                setpaymentOutPrefixeMenuOpenStatus(false);
                setpaymentOutSubPrefixeMenuOpenStatus(false);
              }}
            >
              <div>
                <Button
                  variant={'outlined'}
                  style={{ width: '80%' }}
                  value={''}
                  margin="dense"
                  inputRef={(el) => (inputRef.current[1] = el)}
                  onClick={(e) => {
                    billTypesMenuOpenStatus
                      ? setBillTypesMenuOpenStatus(false)
                      : setBillTypesMenuOpenStatus(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setBillTypesMenuOpenStatus(false);
                    }
                    if (e.key === 'Enter') {
                      setBillTypesMenuOpenStatus(true);
                    } else {
                      handleKeyDown(e, 0, 0, 10001, 0);
                    }
                  }}
                >
                  {' '}
                  Add Bill Type
                </Button>
                {billTypesMenuOpenStatus ? (
                  <>
                    <ul className={classes.PlaceOfsupplyListbox}>
                      <div>
                        <Button
                          ref={(el) => (inputRef.current[Number('10001')] = el)}
                          className={classes.addPrefixbtn}
                          onClick={(e) => {
                            handleBillTypeModalOpen();
                            setBillTypesMenuOpenStatus(false);
                          }}
                        >
                          + Add Bill Type
                        </Button>
                        {transaction.billTypes
                          ? transaction.billTypes.map((option, index) => (
                              <li
                                style={{ cursor: 'pointer' }}
                                key={`${index}prefix`}
                              >
                                <Button
                                  className={classes.liBtn}
                                  disableRipple
                                  onClick={(e) => {
                                    setBillTypesMenuOpenStatus(false);
                                  }}
                                  ref={(el) =>
                                    (inputRef.current[
                                      Number('1' + index + '0')
                                    ] = el)
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                      setBillTypesMenuOpenStatus(false);
                                    }
                                    handleKeyDown(
                                      e,
                                      Number('1' + (index - 1) + '0'),
                                      0,
                                      Number('1' + (index + 1) + '0'),
                                      0
                                    );
                                    if (e.key === 'Enter') {
                                      setBillTypesMenuOpenStatus(false);
                                    }
                                  }}
                                >
                                  {option}
                                </Button>
                                <DeleteIcon
                                  onClick={(e) => {
                                    checkForBillTypeData(index);
                                  }}
                                  className={classes.icon}
                                />
                              </li>
                            ))
                          : ''}
                      </div>
                    </ul>
                  </>
                ) : null}
              </div>
            </Grid>
          </Grid>

          <Typography
            variant="h5"
            style={{ marginTop: '50px', marginBottom: '10px' }}
          >
            Transaction Prefixes and Sequence No
          </Typography>

          <Typography variant="h6" className={classes.subHeader}>
            Sales
          </Typography>

          <Grid container>
            <Grid
              item
              xs={3}
              onClick={(e) => {
                setSalesSubPrefixeMenuOpenStatus(false);
                setsalesReturnPrefixeMenuOpenStatus(false);
                setsalesReturnSubPrefixeMenuOpenStatus(false);
                setpaymentInPrefixeMenuOpenStatus(false);
                setpaymentInSubPrefixeMenuOpenStatus(false);
                setpaymentOutPrefixeMenuOpenStatus(false);
                setpaymentOutSubPrefixeMenuOpenStatus(false);
                setBillTypesMenuOpenStatus(false);
              }}
            >
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  No Prefix Sequence No
                </Typography>
                <Button
                  variant={'outlined'}
                  style={{ width: '80%' }}
                  margin="dense"
                  inputRef={(el) => (inputRef.current[1] = el)}
                  onClick={(e) => {
                    handleNoPrefixesDialogOpen('sales');
                  }}
                >
                  Add No Prefix Sequence No
                </Button>
              </div>
            </Grid>

            <Grid
              item
              xs={3}
              onClick={(e) => {
                setSalesSubPrefixeMenuOpenStatus(false);
                setsalesReturnPrefixeMenuOpenStatus(false);
                setsalesReturnSubPrefixeMenuOpenStatus(false);
                setpaymentInPrefixeMenuOpenStatus(false);
                setpaymentInSubPrefixeMenuOpenStatus(false);
                setpaymentOutPrefixeMenuOpenStatus(false);
                setpaymentOutSubPrefixeMenuOpenStatus(false);
                setBillTypesMenuOpenStatus(false);
              }}
            >
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  Prefix and Sequence No
                </Typography>
                <Button
                  variant={'outlined'}
                  style={{ width: '80%' }}
                  value={salesPreCumSeq}
                  margin="dense"
                  inputRef={(el) => (inputRef.current[1] = el)}
                  onClick={(e) => {
                    SalesPrefixesMenuOpenStatus
                      ? setSalesPrefixeMenuOpenStatus(false)
                      : setSalesPrefixeMenuOpenStatus(true);
                  }}
                  // onChange={(e) => setPlaceOfSupplyValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSalesPrefixeMenuOpenStatus(false);
                    }
                    if (e.key === 'Enter') {
                      setSalesPrefixeMenuOpenStatus(true);
                    } else {
                      handleKeyDown(e, 0, 0, 10001, 0);
                    }
                  }}
                >
                  Add Prefix and Sequence No
                </Button>
                {SalesPrefixesMenuOpenStatus ? (
                  <>
                    <ul className={classes.PlaceOfsupplyListbox}>
                      <div>
                        <Button
                          ref={(el) => (inputRef.current[Number('10001')] = el)}
                          className={classes.addPrefixbtn}
                          onClick={(e) => {
                            handlePrefixesDialogOpen(
                              'Prefix',
                              'sales',
                              'prefixSequence'
                            );

                            setSalesPrefixeMenuOpenStatus(false);
                          }}
                        >
                          + Add Prefix and Sequence No
                        </Button>
                        {transaction.sales.prefixSequence
                          ? transaction.sales.prefixSequence.map(
                              (option, index) => (
                                <li
                                  style={{ cursor: 'pointer' }}
                                  key={`${index}prefix`}
                                >
                                  <Button
                                    className={classes.liBtn}
                                    disableRipple
                                    onClick={(e) => {
                                      setSalesPrefixeMenuOpenStatus(false);
                                      setSalesPreCumSeq(
                                        option.prefix + option.sequenceNumber
                                      );
                                      setTransactionProperty(
                                        'sales',
                                        'prefixes',
                                        option.prefix
                                      );
                                    }}
                                    ref={(el) =>
                                      (inputRef.current[
                                        Number('1' + index + '0')
                                      ] = el)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Escape') {
                                        setSalesPrefixeMenuOpenStatus(false);
                                      }
                                      handleKeyDown(
                                        e,
                                        Number('1' + (index - 1) + '0'),
                                        0,
                                        Number('1' + (index + 1) + '0'),
                                        0
                                      );
                                      if (e.key === 'Enter') {
                                        setTransactionProperty(
                                          'sales',
                                          'prefixes',
                                          option.prefix
                                        );
                                        setSalesPreCumSeq(
                                          option.prefix + option.sequenceNumber
                                        );
                                        setSalesPrefixeMenuOpenStatus(false);
                                      }
                                    }}
                                  >
                                    {option.prefix} - {option.sequenceNumber}
                                  </Button>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={
                                          saleDefaultPrefix === option.prefix
                                            ? true
                                            : false
                                        }
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSaleDefaultPrefix(option.prefix);
                                            localStorage.setItem(
                                              businessId + '_saleDefaultPrefix',
                                              option.prefix
                                            );
                                          } else {
                                            setSaleDefaultPrefix('');
                                            localStorage.setItem(
                                              businessId + '_saleDefaultPrefix',
                                              ''
                                            );
                                          }
                                        }}
                                      />
                                    }
                                    label="Default"
                                  />
                                  <DeleteIcon
                                    onClick={(e) => {
                                      setBillTypesMenuOpenStatus(false);
                                      checkForSalePrefixData(index);
                                      if (
                                        transaction.sales.prefixSequence
                                          .prefix === option.prefix
                                      ) {
                                        setTransactionProperty(
                                          'sales',
                                          'prefixes',
                                          ''
                                        );
                                      }
                                    }}
                                    className={classes.icon}
                                  />
                                </li>
                              )
                            )
                          : ''}
                      </div>
                    </ul>
                  </>
                ) : null}
              </div>
            </Grid>

            <Grid
              item
              xs={3}
              onClick={(e) => {
                setSalesPrefixeMenuOpenStatus(false);
                setsalesReturnPrefixeMenuOpenStatus(false);
                setsalesReturnSubPrefixeMenuOpenStatus(false);
                setpaymentInPrefixeMenuOpenStatus(false);
                setpaymentInSubPrefixeMenuOpenStatus(false);
                setpaymentOutPrefixeMenuOpenStatus(false);
                setpaymentOutSubPrefixeMenuOpenStatus(false);
                setBillTypesMenuOpenStatus(false);
              }}
            >
              <div>
                <Typography style={{ fontSize: '13px' }}>Suffix</Typography>
                <Button
                  variant={'outlined'}
                  style={{ width: '80%' }}
                  value={transaction.sales.subPrefixes}
                  margin="dense"
                  inputRef={(el) => (inputRef.current[1] = el)}
                  onClick={(e) => {
                    SalesSubPrefixesMenuOpenStatus
                      ? setSalesSubPrefixeMenuOpenStatus(false)
                      : setSalesSubPrefixeMenuOpenStatus(true);
                  }}
                  // onChange={(e) => setPlaceOfSupplyValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSalesSubPrefixeMenuOpenStatus(false);
                    }
                    if (e.key === 'Enter') {
                      setSalesSubPrefixeMenuOpenStatus(true);
                    } else {
                      handleKeyDown(e, 0, 0, 10001, 0);
                    }
                  }}
                >
                  Add Suffix
                </Button>
                {SalesSubPrefixesMenuOpenStatus ? (
                  <>
                    <ul className={classes.PlaceOfsupplyListbox}>
                      <div>
                        <Button
                          ref={(el) => (inputRef.current[Number('10001')] = el)}
                          className={classes.addPrefixbtn}
                          onClick={(e) => {
                            handlePrefixesDialogOpen(
                              'Sub Prefix',
                              'sales',
                              'subPrefixesList'
                            );
                            setSalesSubPrefixeMenuOpenStatus(false);
                          }}
                        >
                          + Add Suffix
                        </Button>
                        {transaction.sales.subPrefixesList
                          ? transaction.sales.subPrefixesList.map(
                              (option, index) => (
                                <li
                                  style={{ cursor: 'pointer' }}
                                  key={`${index}prefix`}
                                >
                                  <Button
                                    className={classes.liBtn}
                                    disableRipple
                                    onClick={(e) => {
                                      setTransactionProperty(
                                        'sales',
                                        'subPrefixes',
                                        option
                                      );
                                      setSalesSubPrefixeMenuOpenStatus(false);
                                    }}
                                    ref={(el) =>
                                      (inputRef.current[
                                        Number('1' + index + '0')
                                      ] = el)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Escape') {
                                        setSalesSubPrefixeMenuOpenStatus(false);
                                      }
                                      handleKeyDown(
                                        e,
                                        Number('1' + (index - 1) + '0'),
                                        0,
                                        Number('1' + (index + 1) + '0'),
                                        0
                                      );
                                      if (e.key === 'Enter') {
                                        setTransactionProperty(
                                          'sales',
                                          'subPrefixes',
                                          option
                                        );
                                        setSalesSubPrefixeMenuOpenStatus(false);
                                      }
                                    }}
                                  >
                                    {option}
                                  </Button>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={
                                          saleDefaultSubPrefix === option
                                            ? true
                                            : false
                                        }
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSaleDefaultSubPrefix(option);
                                            localStorage.setItem(
                                              businessId +
                                                '_saleDefaultSubPrefix',
                                              option
                                            );
                                          } else {
                                            setSaleDefaultSubPrefix('');
                                            localStorage.setItem(
                                              businessId +
                                                '_saleDefaultSubPrefix',
                                              ''
                                            );
                                          }
                                        }}
                                      />
                                    }
                                    label="Default"
                                  />
                                  <DeleteIcon
                                    onClick={(e) => {
                                      setBillTypesMenuOpenStatus(false);
                                      checkForSaleSuffixData(index);
                                      if (
                                        transaction.sales.subPrefixes === option
                                      ) {
                                        setTransactionProperty(
                                          'sales',
                                          'subPrefixes',
                                          ''
                                        );
                                      }
                                    }}
                                    className={classes.icon}
                                  />
                                </li>
                              )
                            )
                          : ''}
                      </div>
                    </ul>
                  </>
                ) : null}
              </div>
            </Grid>
            <Grid
              item
              xs={3}
              className={classes.checkboxCenterAlign}
              onClick={(e) => {
                setSalesPrefixeMenuOpenStatus(false);
                setSalesSubPrefixeMenuOpenStatus(false);
                setsalesReturnPrefixeMenuOpenStatus(false);
                setsalesReturnSubPrefixeMenuOpenStatus(false);
                setpaymentInPrefixeMenuOpenStatus(false);
                setpaymentInSubPrefixeMenuOpenStatus(false);
                setpaymentOutPrefixeMenuOpenStatus(false);
                setpaymentOutSubPrefixeMenuOpenStatus(false);
                setBillTypesMenuOpenStatus(false);
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={transaction.sales.appendYear}
                    onChange={(e) => {
                      setTransactionProperty(
                        'sales',
                        'appendYear',
                        e.target.checked
                      );
                    }}
                    value={transaction.sales.appendYear}
                    color="secondary"
                  />
                }
                label="Append Year to Invoice No"
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '10px' }}>
              <Typography>
                Sample Output : &nbsp;
                {/* {transaction.sales.prefixSequence
                  ? transaction.sales.prefixSequence + '/'
                  : ''} */}
                {salesPreCumSeq && salesPreCumSeq + '/'}
                {transaction.sales.subPrefixes
                  ? transaction.sales.subPrefixes + '/'
                  : ''}
                {transaction.sales.appendYear ? currentYear + '/' : ''}1
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" className={classes.subHeader}>
            Sales Return
          </Typography>

          <Grid container>
            <Grid
              item
              xs={3}
              onClick={(e) => {
                setSalesPrefixeMenuOpenStatus(false);
                setSalesSubPrefixeMenuOpenStatus(false);
                setsalesReturnSubPrefixeMenuOpenStatus(false);
                setpaymentInPrefixeMenuOpenStatus(false);
                setpaymentInSubPrefixeMenuOpenStatus(false);
                setpaymentOutPrefixeMenuOpenStatus(false);
                setpaymentOutSubPrefixeMenuOpenStatus(false);
                setBillTypesMenuOpenStatus(false);
              }}
            >
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  No Prefix Sequence No
                </Typography>
                <Button
                  variant={'outlined'}
                  style={{ width: '80%' }}
                  margin="dense"
                  inputRef={(el) => (inputRef.current[1] = el)}
                  onClick={(e) => {
                    handleNoPrefixesDialogOpen('salesReturn');
                  }}
                >
                  Add No Prefix Sequence No
                </Button>
              </div>
            </Grid>
            <Grid
              item
              xs={3}
              onClick={(e) => {
                setSalesPrefixeMenuOpenStatus(false);
                setSalesSubPrefixeMenuOpenStatus(false);
                setsalesReturnSubPrefixeMenuOpenStatus(false);
                setpaymentInPrefixeMenuOpenStatus(false);
                setpaymentInSubPrefixeMenuOpenStatus(false);
                setpaymentOutPrefixeMenuOpenStatus(false);
                setpaymentOutSubPrefixeMenuOpenStatus(false);
                setBillTypesMenuOpenStatus(false);
              }}
            >
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  Prefix and Sequence No
                </Typography>
                <Button
                  variant={'outlined'}
                  style={{ width: '80%' }}
                  value={salesRPreCumSeq}
                  margin="dense"
                  inputRef={(el) => (inputRef.current[1] = el)}
                  onClick={(e) => {
                    salesReturnPrefixesMenuOpenStatus
                      ? setsalesReturnPrefixeMenuOpenStatus(false)
                      : setsalesReturnPrefixeMenuOpenStatus(true);
                  }}
                  // onChange={(e) => setPlaceOfSupplyValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setsalesReturnPrefixeMenuOpenStatus(false);
                    }
                    if (e.key === 'Enter') {
                      setsalesReturnPrefixeMenuOpenStatus(true);
                    } else {
                      handleKeyDown(e, 0, 0, 10001, 0);
                    }
                  }}
                >
                  Add Prefix and Sequence No
                </Button>
                {salesReturnPrefixesMenuOpenStatus ? (
                  <>
                    <ul className={classes.PlaceOfsupplyListbox}>
                      <div>
                        <Button
                          ref={(el) => (inputRef.current[Number('10001')] = el)}
                          className={classes.addPrefixbtn}
                          onClick={(e) => {
                            handlePrefixesDialogOpen(
                              'Prefix',
                              'salesReturn',
                              'prefixSequence'
                            );
                            setsalesReturnPrefixeMenuOpenStatus(false);
                          }}
                        >
                          + Add Prefix and Sequence No
                        </Button>
                        {transaction.salesReturn.prefixSequence
                          ? transaction.salesReturn.prefixSequence.map(
                              (option, index) => (
                                <li
                                  style={{ cursor: 'pointer' }}
                                  key={`${index}prefix`}
                                >
                                  <Button
                                    className={classes.liBtn}
                                    disableRipple
                                    ref={(el) =>
                                      (inputRef.current[
                                        Number('1' + index + '0')
                                      ] = el)
                                    }
                                    onClick={(e) => {
                                      setTransactionProperty(
                                        'salesReturn',
                                        'prefixes',
                                        option.prefix
                                      );
                                      /* alert(transaction.salesReturn.prefixes); */
                                      setsalesReturnPrefixeMenuOpenStatus(
                                        false
                                      );
                                      setSalesRPreCumSeq(
                                        option.prefix + option.sequenceNumber
                                      );
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Escape') {
                                        setsalesReturnPrefixeMenuOpenStatus(
                                          false
                                        );
                                      }
                                      handleKeyDown(
                                        e,
                                        Number('1' + (index - 1) + '0'),
                                        0,
                                        Number('1' + (index + 1) + '0'),
                                        0
                                      );
                                      if (e.key === 'Enter') {
                                        setTransactionProperty(
                                          'salesReturn',
                                          'prefixes',
                                          option
                                        );
                                        setSalesRPreCumSeq(
                                          option.prefix + option.sequenceNumber
                                        );
                                        setsalesReturnPrefixeMenuOpenStatus(
                                          false
                                        );
                                      }
                                    }}
                                  >
                                    {option.prefix} - {option.sequenceNumber}
                                  </Button>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={
                                          saleReturnDefaultPrefix ===
                                          option.prefix
                                            ? true
                                            : false
                                        }
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSaleReturnDefaultPrefix(
                                              option.prefix
                                            );
                                            localStorage.setItem(
                                              businessId +
                                                '_saleReturnDefaultPrefix',
                                              option.prefix
                                            );
                                          } else {
                                            setSaleReturnDefaultPrefix('');
                                            localStorage.setItem(
                                              businessId +
                                                '_saleReturnDefaultPrefix',
                                              ''
                                            );
                                          }
                                        }}
                                      />
                                    }
                                    label="Default"
                                  />
                                  <DeleteIcon
                                    onClick={(e) => {
                                      setBillTypesMenuOpenStatus(false);
                                      checkForSalesReturnPrefixData(index);
                                      if (
                                        transaction.salesReturn.prefixSequence
                                          .prefix === option.prefix
                                      ) {
                                        setTransactionProperty(
                                          'salesReturn',
                                          'prefixes',
                                          ''
                                        );
                                      }
                                    }}
                                    className={classes.icon}
                                  />
                                </li>
                              )
                            )
                          : ''}
                      </div>
                    </ul>
                  </>
                ) : null}
              </div>
            </Grid>
            <Grid
              item
              xs={3}
              onClick={(e) => {
                setSalesPrefixeMenuOpenStatus(false);
                setSalesSubPrefixeMenuOpenStatus(false);
                setsalesReturnPrefixeMenuOpenStatus(false);
                setBillTypesMenuOpenStatus(false);
                setpaymentInPrefixeMenuOpenStatus(false);
                setpaymentOutPrefixeMenuOpenStatus(false);
                setpaymentOutSubPrefixeMenuOpenStatus(false);
                setpaymentInSubPrefixeMenuOpenStatus(false);
              }}
            >
              <div>
                <Typography style={{ fontSize: '13px' }}>Suffix</Typography>
                <Button
                  variant={'outlined'}
                  style={{ width: '80%' }}
                  value={transaction.salesReturn.subPrefixes}
                  margin="dense"
                  inputRef={(el) => (inputRef.current[1] = el)}
                  onClick={(e) => {
                    salesReturnSubPrefixesMenuOpenStatus
                      ? setsalesReturnSubPrefixeMenuOpenStatus(false)
                      : setsalesReturnSubPrefixeMenuOpenStatus(true);
                  }}
                  // onChange={(e) => setPlaceOfSupplyValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setsalesReturnSubPrefixeMenuOpenStatus(false);
                    }
                    if (e.key === 'Enter') {
                      setsalesReturnSubPrefixeMenuOpenStatus(true);
                    } else {
                      handleKeyDown(e, 0, 0, 10001, 0);
                    }
                  }}
                >
                  Add Suffix
                </Button>
                {salesReturnSubPrefixesMenuOpenStatus ? (
                  <>
                    <ul className={classes.PlaceOfsupplyListbox}>
                      <div>
                        <Button
                          ref={(el) => (inputRef.current[Number('10001')] = el)}
                          className={classes.addPrefixbtn}
                          onClick={(e) => {
                            handlePrefixesDialogOpen(
                              'Sub Prefix',
                              'salesReturn',
                              'subPrefixesList'
                            );
                            setsalesReturnSubPrefixeMenuOpenStatus(false);
                          }}
                        >
                          + Add Suffix
                        </Button>
                        {transaction.salesReturn.subPrefixesList
                          ? transaction.salesReturn.subPrefixesList.map(
                              (option, index) => (
                                <li
                                  style={{ cursor: 'pointer' }}
                                  key={`${index}prefix`}
                                >
                                  <Button
                                    className={classes.liBtn}
                                    disableRipple
                                    onClick={(e) => {
                                      setTransactionProperty(
                                        'salesReturn',
                                        'subPrefixes',
                                        option
                                      );
                                      setsalesReturnSubPrefixeMenuOpenStatus(
                                        false
                                      );
                                    }}
                                    ref={(el) =>
                                      (inputRef.current[
                                        Number('1' + index + '0')
                                      ] = el)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Escape') {
                                        setsalesReturnSubPrefixeMenuOpenStatus(
                                          false
                                        );
                                      }
                                      handleKeyDown(
                                        e,
                                        Number('1' + (index - 1) + '0'),
                                        0,
                                        Number('1' + (index + 1) + '0'),
                                        0
                                      );
                                      if (e.key === 'Enter') {
                                        setTransactionProperty(
                                          'salesReturn',
                                          'subPrefixes',
                                          option
                                        );
                                        setsalesReturnSubPrefixeMenuOpenStatus(
                                          false
                                        );
                                      }
                                    }}
                                  >
                                    {option}
                                  </Button>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={
                                          saleReturnDefaultSubPrefix === option
                                            ? true
                                            : false
                                        }
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSaleReturnDefaultSubPrefix(
                                              option
                                            );
                                            localStorage.setItem(
                                              businessId +
                                                '_saleReturnDefaultSubPrefix',
                                              option
                                            );
                                          } else {
                                            setSaleReturnDefaultSubPrefix('');
                                            localStorage.setItem(
                                              businessId +
                                                '_saleReturnDefaultSubPrefix',
                                              ''
                                            );
                                          }
                                        }}
                                      />
                                    }
                                    label="Default"
                                  />
                                  <DeleteIcon
                                    onClick={(e) => {
                                      setBillTypesMenuOpenStatus(false);

                                      checkForSalesReturnSuffixData(index);
                                      if (
                                        transaction.salesReturn.subPrefixes ===
                                        option
                                      ) {
                                        setTransactionProperty(
                                          'salesReturn',
                                          'subPrefixes',
                                          ''
                                        );
                                      }
                                    }}
                                    className={classes.icon}
                                  />
                                </li>
                              )
                            )
                          : ''}
                      </div>
                    </ul>
                  </>
                ) : null}
              </div>
            </Grid>
            <Grid
              item
              xs={3}
              className={classes.checkboxCenterAlign}
              onClick={(e) => {
                setSalesPrefixeMenuOpenStatus(false);
                setSalesSubPrefixeMenuOpenStatus(false);
                setsalesReturnPrefixeMenuOpenStatus(false);
                setsalesReturnSubPrefixeMenuOpenStatus(false);
                setpaymentInPrefixeMenuOpenStatus(false);
                setpaymentInSubPrefixeMenuOpenStatus(false);
                setpaymentOutPrefixeMenuOpenStatus(false);
                setpaymentOutSubPrefixeMenuOpenStatus(false);
                setBillTypesMenuOpenStatus(false);
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={transaction.salesReturn.appendYear}
                    onChange={(e) => {
                      setTransactionProperty(
                        'salesReturn',
                        'appendYear',
                        e.target.checked
                      );
                    }}
                    value={transaction.salesReturn.appendYear}
                    color="secondary"
                  />
                }
                label="Append Year to Invoice No"
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '10px' }}>
              <Typography>
                Sample Output : &nbsp;
                {salesRPreCumSeq && salesRPreCumSeq + '/'}
                {/* {transaction.salesReturn.prefixSequence
                  ? transaction.salesReturn.prefixSequence + '/'
                  : ''} */}
                {transaction.salesReturn.subPrefixes
                  ? transaction.salesReturn.subPrefixes + '/'
                  : ''}
                {transaction.salesReturn.appendYear ? currentYear + '/' : ''}1
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" className={classes.subHeader}>
            Payment In
          </Typography>

          <Grid container>
            <Grid
              item
              xs={3}
              onClick={(e) => {
                setSalesPrefixeMenuOpenStatus(false);
                setSalesSubPrefixeMenuOpenStatus(false);
                setsalesReturnPrefixeMenuOpenStatus(false);
                setsalesReturnSubPrefixeMenuOpenStatus(false);
                setpaymentInSubPrefixeMenuOpenStatus(false);
                setpaymentOutPrefixeMenuOpenStatus(false);
                setpaymentOutSubPrefixeMenuOpenStatus(false);
                setBillTypesMenuOpenStatus(false);
              }}
            >
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  No Prefix Sequence No
                </Typography>
                <Button
                  variant={'outlined'}
                  style={{ width: '80%' }}
                  margin="dense"
                  inputRef={(el) => (inputRef.current[1] = el)}
                  onClick={(e) => {
                    handleNoPrefixesDialogOpen('paymentIn');
                  }}
                >
                  Add No Prefix Sequence No
                </Button>
              </div>
            </Grid>
            <Grid
              item
              xs={3}
              onClick={(e) => {
                setSalesPrefixeMenuOpenStatus(false);
                setSalesSubPrefixeMenuOpenStatus(false);
                setsalesReturnPrefixeMenuOpenStatus(false);
                setsalesReturnSubPrefixeMenuOpenStatus(false);
                setpaymentInSubPrefixeMenuOpenStatus(false);
                setpaymentOutPrefixeMenuOpenStatus(false);
                setpaymentOutSubPrefixeMenuOpenStatus(false);
                setBillTypesMenuOpenStatus(false);
              }}
            >
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  Prefix and Sequence No
                </Typography>
                <Button
                  variant={'outlined'}
                  style={{ width: '80%' }}
                  value={paymentInPreCumSeq}
                  /* value={transaction.paymentIn.prefixSequence[0]} */
                  margin="dense"
                  inputRef={(el) => (inputRef.current[1] = el)}
                  onClick={(e) => {
                    paymentInPrefixesMenuOpenStatus
                      ? setpaymentInPrefixeMenuOpenStatus(false)
                      : setpaymentInPrefixeMenuOpenStatus(true);
                  }}
                  // onChange={(e) => setPlaceOfSupplyValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setpaymentInPrefixeMenuOpenStatus(false);
                    }
                    if (e.key === 'Enter') {
                      setpaymentInPrefixeMenuOpenStatus(true);
                    } else {
                      handleKeyDown(e, 0, 0, 10001, 0);
                    }
                  }}
                >
                  Add Prefix and Sequence No
                </Button>
                {paymentInPrefixesMenuOpenStatus ? (
                  <>
                    <ul className={classes.PlaceOfsupplyListbox}>
                      <div>
                        <Button
                          ref={(el) => (inputRef.current[Number('10001')] = el)}
                          className={classes.addPrefixbtn}
                          onClick={(e) => {
                            handlePrefixesDialogOpen(
                              'Prefix',
                              'paymentIn',
                              'prefixSequence'
                            );
                            setpaymentInPrefixeMenuOpenStatus(false);
                          }}
                        >
                          + Add Prefix and Sequence No
                        </Button>
                        {transaction.paymentIn.prefixSequence
                          ? transaction.paymentIn.prefixSequence.map(
                              (option, index) => (
                                <li
                                  style={{ cursor: 'pointer' }}
                                  key={`${index}prefix`}
                                >
                                  <Button
                                    className={classes.liBtn}
                                    disableRipple
                                    ref={(el) =>
                                      (inputRef.current[
                                        Number('1' + index + '0')
                                      ] = el)
                                    }
                                    onClick={(e) => {
                                      setTransactionProperty(
                                        'paymentIn',
                                        'prefixes',
                                        option
                                      );
                                      /* alert(transaction.paymentIn.prefixSequence[0].prefix);
                                      alert(transaction.paymentIn.prefixSequence[0].sequenceNumber); */
                                      setpaymentInPrefixeMenuOpenStatus(false);
                                      setPaymentInPreCumSeq(
                                        option.prefix + option.sequenceNumber
                                      );
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Escape') {
                                        setpaymentInPrefixeMenuOpenStatus(
                                          false
                                        );
                                      }
                                      handleKeyDown(
                                        e,
                                        Number('1' + (index - 1) + '0'),
                                        0,
                                        Number('1' + (index + 1) + '0'),
                                        0
                                      );
                                      if (e.key === 'Enter') {
                                        setTransactionProperty(
                                          'paymentIn',
                                          'prefixes',
                                          option
                                        );
                                        setPaymentInPreCumSeq(
                                          option.prefix + option.sequenceNumber
                                        );
                                        setpaymentInPrefixeMenuOpenStatus(
                                          false
                                        );
                                      }
                                    }}
                                  >
                                    {option.prefix} - {option.sequenceNumber}
                                  </Button>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={
                                          paymentInDefaultPrefix ===
                                          option.prefix
                                            ? true
                                            : false
                                        }
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setPaymentInDefaultPrefix(
                                              option.prefix
                                            );
                                            localStorage.setItem(
                                              businessId +
                                                '_paymentInDefaultPrefix',
                                              option.prefix
                                            );
                                          } else {
                                            setPaymentInDefaultPrefix('');
                                            localStorage.setItem(
                                              businessId +
                                                '_paymentInDefaultPrefix',
                                              ''
                                            );
                                          }
                                        }}
                                      />
                                    }
                                    label="Default"
                                  />
                                  <DeleteIcon
                                    onClick={(e) => {
                                      setBillTypesMenuOpenStatus(false);
                                      checkForPaymentInPrefixData(index);
                                      if (
                                        transaction.paymentIn.prefixSequence
                                          .prefix === option.prefix
                                      ) {
                                        setTransactionProperty(
                                          'paymentIn',
                                          'prefixes',
                                          ''
                                        );
                                      }
                                    }}
                                    className={classes.icon}
                                  />
                                </li>
                              )
                            )
                          : ''}
                      </div>
                    </ul>
                  </>
                ) : null}
              </div>
            </Grid>
            <Grid
              item
              xs={3}
              onClick={(e) => {
                setSalesPrefixeMenuOpenStatus(false);
                setSalesSubPrefixeMenuOpenStatus(false);
                setsalesReturnPrefixeMenuOpenStatus(false);
                setsalesReturnSubPrefixeMenuOpenStatus(false);
                setpaymentInPrefixeMenuOpenStatus(false);
                setpaymentOutPrefixeMenuOpenStatus(false);
                setpaymentOutSubPrefixeMenuOpenStatus(false);
                setBillTypesMenuOpenStatus(false);
              }}
            >
              <div>
                <Typography style={{ fontSize: '13px' }}>Suffix</Typography>
                <Button
                  variant={'outlined'}
                  style={{ width: '80%' }}
                  value={transaction.paymentIn.subPrefixes}
                  margin="dense"
                  inputRef={(el) => (inputRef.current[1] = el)}
                  onClick={(e) => {
                    paymentInSubPrefixesMenuOpenStatus
                      ? setpaymentInSubPrefixeMenuOpenStatus(false)
                      : setpaymentInSubPrefixeMenuOpenStatus(true);
                  }}
                  // onChange={(e) => setPlaceOfSupplyValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setpaymentInSubPrefixeMenuOpenStatus(false);
                    }
                    if (e.key === 'Enter') {
                      setpaymentInSubPrefixeMenuOpenStatus(true);
                    } else {
                      handleKeyDown(e, 0, 0, 10001, 0);
                    }
                  }}
                >
                  Add Suffix
                </Button>
                {paymentInSubPrefixesMenuOpenStatus ? (
                  <>
                    <ul className={classes.PlaceOfsupplyListbox}>
                      <div>
                        <Button
                          ref={(el) => (inputRef.current[Number('10001')] = el)}
                          className={classes.addPrefixbtn}
                          onClick={(e) => {
                            handlePrefixesDialogOpen(
                              'Sub Prefix',
                              'paymentIn',
                              'subPrefixesList'
                            );
                            setpaymentInSubPrefixeMenuOpenStatus(false);
                          }}
                        >
                          + Add Suffix
                        </Button>
                        {transaction.paymentIn.subPrefixesList
                          ? transaction.paymentIn.subPrefixesList.map(
                              (option, index) => (
                                <li
                                  style={{ cursor: 'pointer' }}
                                  key={`${index}prefix`}
                                >
                                  <Button
                                    className={classes.liBtn}
                                    disableRipple
                                    onClick={(e) => {
                                      setTransactionProperty(
                                        'paymentIn',
                                        'subPrefixes',
                                        option
                                      );

                                      setpaymentInSubPrefixeMenuOpenStatus(
                                        false
                                      );
                                    }}
                                    ref={(el) =>
                                      (inputRef.current[
                                        Number('1' + index + '0')
                                      ] = el)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Escape') {
                                        setpaymentInSubPrefixeMenuOpenStatus(
                                          false
                                        );
                                      }
                                      handleKeyDown(
                                        e,
                                        Number('1' + (index - 1) + '0'),
                                        0,
                                        Number('1' + (index + 1) + '0'),
                                        0
                                      );
                                      if (e.key === 'Enter') {
                                        setTransactionProperty(
                                          'paymentIn',
                                          'subPrefixes',
                                          option
                                        );
                                        setpaymentInSubPrefixeMenuOpenStatus(
                                          false
                                        );
                                      }
                                    }}
                                  >
                                    {option}
                                  </Button>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={
                                          paymentInDefaultSubPrefix === option
                                            ? true
                                            : false
                                        }
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setPaymentInDefaultSubPrefix(
                                              option
                                            );
                                            localStorage.setItem(
                                              businessId +
                                                '_paymentInDefaultSubPrefix',
                                              option
                                            );
                                          } else {
                                            setPaymentInDefaultSubPrefix('');
                                            localStorage.setItem(
                                              businessId +
                                                '_paymentInDefaultSubPrefix',
                                              ''
                                            );
                                          }
                                        }}
                                      />
                                    }
                                    label="Default"
                                  />
                                  <DeleteIcon
                                    onClick={(e) => {
                                      setBillTypesMenuOpenStatus(false);
                                      checkForPaymentInSuffixData(index);
                                      if (
                                        transaction.paymentIn.subPrefixes ===
                                        option
                                      ) {
                                        setTransactionProperty(
                                          'paymentIn',
                                          'subPrefixes',
                                          ''
                                        );
                                      }
                                    }}
                                    className={classes.icon}
                                  />
                                </li>
                              )
                            )
                          : ''}
                      </div>
                    </ul>
                  </>
                ) : null}
              </div>
            </Grid>
            <Grid
              item
              xs={3}
              className={classes.checkboxCenterAlign}
              onClick={(e) => {
                setSalesPrefixeMenuOpenStatus(false);
                setSalesSubPrefixeMenuOpenStatus(false);
                setsalesReturnPrefixeMenuOpenStatus(false);
                setsalesReturnSubPrefixeMenuOpenStatus(false);
                setpaymentInPrefixeMenuOpenStatus(false);
                setpaymentInSubPrefixeMenuOpenStatus(false);
                setpaymentOutPrefixeMenuOpenStatus(false);
                setpaymentOutSubPrefixeMenuOpenStatus(false);
                setBillTypesMenuOpenStatus(false);
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={transaction.paymentIn.appendYear}
                    onChange={(e) => {
                      setTransactionProperty(
                        'paymentIn',
                        'appendYear',
                        e.target.checked
                      );
                    }}
                    value={transaction.paymentIn.appendYear}
                    color="secondary"
                  />
                }
                label="Append Year to Invoice No"
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '10px' }}>
              <Typography>
                Sample Output : &nbsp;
                {/* {transaction.paymentIn.prefixes
                  ? transaction.paymentIn.prefixes + '/'
                  : ''} */}
                {paymentInPreCumSeq && paymentInPreCumSeq + '/'}
                {transaction.paymentIn.subPrefixes
                  ? transaction.paymentIn.subPrefixes + '/'
                  : ''}
                {transaction.paymentIn.appendYear ? currentYear + '/' : ''}1
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" className={classes.subHeader}>
            Payment Out
          </Typography>

          <Grid container>
            <Grid
              item
              xs={3}
              onClick={(e) => {
                setSalesPrefixeMenuOpenStatus(false);
                setSalesSubPrefixeMenuOpenStatus(false);
                setsalesReturnPrefixeMenuOpenStatus(false);
                setsalesReturnSubPrefixeMenuOpenStatus(false);
                setpaymentInPrefixeMenuOpenStatus(false);
                setpaymentInSubPrefixeMenuOpenStatus(false);
                setpaymentOutSubPrefixeMenuOpenStatus(false);
                setBillTypesMenuOpenStatus(false);
              }}
            >
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  No Prefix Sequence No
                </Typography>
                <Button
                  variant={'outlined'}
                  style={{ width: '80%' }}
                  margin="dense"
                  inputRef={(el) => (inputRef.current[1] = el)}
                  onClick={(e) => {
                    handleNoPrefixesDialogOpen('paymentOut');
                  }}
                >
                  Add No Prefix Sequence No
                </Button>
              </div>
            </Grid>
            <Grid
              item
              xs={3}
              onClick={(e) => {
                setSalesPrefixeMenuOpenStatus(false);
                setSalesSubPrefixeMenuOpenStatus(false);
                setsalesReturnPrefixeMenuOpenStatus(false);
                setsalesReturnSubPrefixeMenuOpenStatus(false);
                setpaymentInPrefixeMenuOpenStatus(false);
                setpaymentInSubPrefixeMenuOpenStatus(false);
                setpaymentOutSubPrefixeMenuOpenStatus(false);
                setBillTypesMenuOpenStatus(false);
              }}
            >
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  Prefix and Sequence No
                </Typography>
                <Button
                  variant={'outlined'}
                  style={{ width: '80%' }}
                  value={''}
                  margin="dense"
                  inputRef={(el) => (inputRef.current[1] = el)}
                  onClick={(e) => {
                    paymentOutPrefixesMenuOpenStatus
                      ? setpaymentOutPrefixeMenuOpenStatus(false)
                      : setpaymentOutPrefixeMenuOpenStatus(true);
                  }}
                  // onChange={(e) => setPlaceOfSupplyValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setpaymentOutPrefixeMenuOpenStatus(false);
                    }
                    if (e.key === 'Enter') {
                      setpaymentOutPrefixeMenuOpenStatus(true);
                    } else {
                      handleKeyDown(e, 0, 0, 10001, 0);
                    }
                  }}
                >
                  Add Prefix and Sequence No
                </Button>
                {paymentOutPrefixesMenuOpenStatus ? (
                  <>
                    <ul className={classes.PlaceOfsupplyListbox}>
                      <div>
                        <Button
                          ref={(el) => (inputRef.current[Number('10001')] = el)}
                          className={classes.addPrefixbtn}
                          onClick={(e) => {
                            handlePrefixesDialogOpen(
                              'Prefix',
                              'paymentOut',
                              'prefixSequence'
                            );
                            setpaymentOutPrefixeMenuOpenStatus(false);
                          }}
                        >
                          + Add Prefix and Sequence No
                        </Button>
                        {transaction.paymentOut.prefixSequence
                          ? transaction.paymentOut.prefixSequence.map(
                              (option, index) => (
                                <li
                                  style={{ cursor: 'pointer' }}
                                  key={`${index}prefix`}
                                >
                                  <Button
                                    className={classes.liBtn}
                                    disableRipple
                                    ref={(el) =>
                                      (inputRef.current[
                                        Number('1' + index + '0')
                                      ] = el)
                                    }
                                    onClick={(e) => {
                                      setPaymentOutPreCumSeq(
                                        option.prefix + option.sequenceNumber
                                      );
                                      setpaymentOutPrefixeMenuOpenStatus(false);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Escape') {
                                        setpaymentOutPrefixeMenuOpenStatus(
                                          false
                                        );
                                      }
                                      handleKeyDown(
                                        e,
                                        Number('1' + (index - 1) + '0'),
                                        0,
                                        Number('1' + (index + 1) + '0'),
                                        0
                                      );
                                      if (e.key === 'Enter') {
                                        setTransactionProperty(
                                          'paymentOut',
                                          'prefixes',
                                          option
                                        );
                                        setPaymentOutPreCumSeq(
                                          option.prefix + option.sequenceNumber
                                        );
                                        setpaymentOutPrefixeMenuOpenStatus(
                                          false
                                        );
                                      }
                                    }}
                                  >
                                    {option.prefix} - {option.sequenceNumber}
                                  </Button>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={
                                          paymentOutDefaultPrefix ===
                                          option.prefix
                                            ? true
                                            : false
                                        }
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setPaymentOutDefaultPrefix(
                                              option.prefix
                                            );
                                            localStorage.setItem(
                                              businessId +
                                                '_paymentOutDefaultPrefix',
                                              option.prefix
                                            );
                                          } else {
                                            setPaymentOutDefaultPrefix('');
                                            localStorage.setItem(
                                              businessId +
                                                '_paymentOutDefaultPrefix',
                                              ''
                                            );
                                          }
                                        }}
                                      />
                                    }
                                    label="Default"
                                  />
                                  <DeleteIcon
                                    onClick={(e) => {
                                      setBillTypesMenuOpenStatus(false);
                                      checkForPaymentOutPrefixData(index);
                                      if (
                                        transaction.paymentOut.prefixSequence
                                          .prefix === option.prefix
                                      ) {
                                        setTransactionProperty(
                                          'paymentOut',
                                          'prefixes',
                                          ''
                                        );
                                      }
                                    }}
                                    className={classes.icon}
                                  />
                                </li>
                              )
                            )
                          : ''}
                      </div>
                    </ul>
                  </>
                ) : null}
              </div>
            </Grid>
            <Grid
              item
              xs={3}
              onClick={(e) => {
                setSalesPrefixeMenuOpenStatus(false);
                setSalesSubPrefixeMenuOpenStatus(false);
                setsalesReturnPrefixeMenuOpenStatus(false);
                setsalesReturnSubPrefixeMenuOpenStatus(false);
                setpaymentInPrefixeMenuOpenStatus(false);
                setpaymentInSubPrefixeMenuOpenStatus(false);
                setpaymentOutPrefixeMenuOpenStatus(false);
                setBillTypesMenuOpenStatus(false);
              }}
            >
              <div>
                <Typography style={{ fontSize: '13px' }}>Suffix</Typography>
                <Button
                  variant={'outlined'}
                  style={{ width: '80%' }}
                  value={transaction.paymentOut.subPrefixes}
                  margin="dense"
                  inputRef={(el) => (inputRef.current[1] = el)}
                  onClick={(e) => {
                    paymentOutSubPrefixesMenuOpenStatus
                      ? setpaymentOutSubPrefixeMenuOpenStatus(false)
                      : setpaymentOutSubPrefixeMenuOpenStatus(true);
                  }}
                  // onChange={(e) => setPlaceOfSupplyValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setpaymentOutSubPrefixeMenuOpenStatus(false);
                    }
                    if (e.key === 'Enter') {
                      setpaymentOutSubPrefixeMenuOpenStatus(true);
                    } else {
                      handleKeyDown(e, 0, 0, 10001, 0);
                    }
                  }}
                >
                  Add Suffix
                </Button>
                {paymentOutSubPrefixesMenuOpenStatus ? (
                  <>
                    <ul className={classes.PlaceOfsupplyListbox}>
                      <div>
                        <Button
                          ref={(el) => (inputRef.current[Number('10001')] = el)}
                          className={classes.addPrefixbtn}
                          onClick={(e) => {
                            handlePrefixesDialogOpen(
                              'Sub Prefix',
                              'paymentOut',
                              'subPrefixesList'
                            );
                            setpaymentOutSubPrefixeMenuOpenStatus(false);
                          }}
                        >
                          + Add Suffix
                        </Button>
                        {transaction.paymentOut.subPrefixesList
                          ? transaction.paymentOut.subPrefixesList.map(
                              (option, index) => (
                                <li
                                  style={{ cursor: 'pointer' }}
                                  key={`${index}prefix`}
                                >
                                  <Button
                                    className={classes.liBtn}
                                    disableRipple
                                    onClick={(e) => {
                                      setTransactionProperty(
                                        'paymentOut',
                                        'subPrefixes',
                                        option
                                      );
                                      setpaymentOutSubPrefixeMenuOpenStatus(
                                        false
                                      );
                                    }}
                                    ref={(el) =>
                                      (inputRef.current[
                                        Number('1' + index + '0')
                                      ] = el)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Escape') {
                                        setpaymentOutSubPrefixeMenuOpenStatus(
                                          false
                                        );
                                      }
                                      handleKeyDown(
                                        e,
                                        Number('1' + (index - 1) + '0'),
                                        0,
                                        Number('1' + (index + 1) + '0'),
                                        0
                                      );
                                      if (e.key === 'Enter') {
                                        setTransactionProperty(
                                          'paymentOut',
                                          'subPrefixes',
                                          option
                                        );
                                        setpaymentOutSubPrefixeMenuOpenStatus(
                                          false
                                        );
                                      }
                                    }}
                                  >
                                    {option}
                                  </Button>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={
                                          paymentOutDefaultSubPrefix === option
                                            ? true
                                            : false
                                        }
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setPaymentOutDefaultSubPrefix(
                                              option
                                            );
                                            localStorage.setItem(
                                              businessId +
                                                '_paymentOutDefaultSubPrefix',
                                              option
                                            );
                                          } else {
                                            setPaymentOutDefaultSubPrefix('');
                                            localStorage.setItem(
                                              businessId +
                                                '_paymentOutDefaultSubPrefix',
                                              ''
                                            );
                                          }
                                        }}
                                      />
                                    }
                                    label="Default"
                                  />
                                  <DeleteIcon
                                    onClick={(e) => {
                                      setBillTypesMenuOpenStatus(false);
                                      checkForPaymentOutSuffixData(index);
                                      if (
                                        transaction.paymentOut.subPrefixes ===
                                        option
                                      ) {
                                        setTransactionProperty(
                                          'paymentOut',
                                          'subPrefixes',
                                          ''
                                        );
                                      }
                                    }}
                                    className={classes.icon}
                                  />
                                </li>
                              )
                            )
                          : ''}
                      </div>
                    </ul>
                  </>
                ) : null}
              </div>
            </Grid>
            <Grid
              item
              xs={3}
              className={classes.checkboxCenterAlign}
              onClick={(e) => {
                setpaymentInPrefixeMenuOpenStatus(false);
                setpaymentInSubPrefixeMenuOpenStatus(false);
                setSalesPrefixeMenuOpenStatus(false);
                setSalesSubPrefixeMenuOpenStatus(false);
                setsalesReturnPrefixeMenuOpenStatus(false);
                setsalesReturnSubPrefixeMenuOpenStatus(false);

                setBillTypesMenuOpenStatus(false);
                setpaymentOutPrefixeMenuOpenStatus(false);
                setpaymentOutSubPrefixeMenuOpenStatus(false);
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={transaction.paymentOut.appendYear}
                    onChange={(e) => {
                      setTransactionProperty(
                        'paymentOut',
                        'appendYear',
                        e.target.checked
                      );
                    }}
                    value={transaction.paymentOut.appendYear}
                    color="secondary"
                  />
                }
                label="Append Year to Invoice No"
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '10px' }}>
              <Typography>
                Sample Output : &nbsp;
                {/* {transaction.paymentOut.prefixes
                  ? transaction.paymentOut.prefixes + '/'
                  : ''} */}
                {paymentOutPreCumSeq && paymentOutPreCumSeq + '/'}
                {transaction.paymentOut.subPrefixes
                  ? transaction.paymentOut.subPrefixes + '/'
                  : ''}
                {transaction.paymentOut.appendYear ? currentYear + '/' : ''}1
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" className={classes.subHeader}>
            Sales Quotation/Estimate
          </Typography>

          <Grid container>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>Prefix</Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  placeholder="Add Prefix"
                  value={
                    transaction.salesQuotation.prefixSequence &&
                    transaction.salesQuotation.prefixSequence.length > 0 &&
                    transaction.salesQuotation.prefixSequence[0].prefix !== ''
                      ? transaction.salesQuotation.prefixSequence[0].prefix
                      : salesQuotationPrefixesVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== salesQuotationPrefixesVal) {
                      if (
                        transaction.salesQuotation.prefixSequence &&
                        transaction.salesQuotation.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'salesQuotation',
                          'prefixSequence',
                          e.target.value,
                          transaction.salesQuotation.prefixSequence[0]
                            .sequenceNumber
                        );
                      } else {
                        saveSinglePrefix(
                          'salesQuotation',
                          'prefixSequence',
                          e.target.value,
                          1
                        );
                      }
                    }
                    setSalesQuotationPrefixesVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  To Start With
                </Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  type="number"
                  placeholder="Add Sequence No"
                  value={
                    transaction.salesQuotation.prefixSequence &&
                    transaction.salesQuotation.prefixSequence.length > 0 &&
                    transaction.salesQuotation.prefixSequence[0]
                      .sequenceNumber !== 1
                      ? transaction.salesQuotation.prefixSequence[0]
                          .sequenceNumber
                      : salesQuotationSequenceNoVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== salesQuotationSequenceNoVal) {
                      if (
                        transaction.salesQuotation.prefixSequence &&
                        transaction.salesQuotation.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'salesQuotation',
                          'prefixSequence',
                          transaction.salesQuotation.prefixSequence[0].prefix,
                          e.target.value
                        );
                      } else {
                        saveSinglePrefix(
                          'salesQuotation',
                          'prefixSequence',
                          salesQuotationPrefixesVal,
                          e.target.value
                        );
                      }
                    }
                    setSalesQuotationSequenceNoVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
          </Grid>

          <Typography variant="h6" className={classes.subHeader}>
            Approval
          </Typography>

          <Grid container>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>Prefix</Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  placeholder="Add Prefix"
                  value={
                    transaction.approval.prefixSequence &&
                    transaction.approval.prefixSequence.length > 0 &&
                    transaction.approval.prefixSequence[0].prefix !== ''
                      ? transaction.approval.prefixSequence[0].prefix
                      : approvalPrefixesVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== approvalPrefixesVal) {
                      if (
                        transaction.approval.prefixSequence &&
                        transaction.approval.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'approval',
                          'prefixSequence',
                          e.target.value,
                          transaction.approval.prefixSequence[0].sequenceNumber
                        );
                      } else {
                        saveSinglePrefix(
                          'approval',
                          'prefixSequence',
                          e.target.value,
                          1
                        );
                      }
                    }
                    setApprovalPrefixesVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  To Start With
                </Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  type="number"
                  placeholder="Add Sequence No"
                  value={
                    transaction.approval.prefixSequence &&
                    transaction.approval.prefixSequence.length > 0 &&
                    transaction.approval.prefixSequence[0].sequenceNumber !== 1
                      ? transaction.approval.prefixSequence[0].sequenceNumber
                      : approvalSequenceNoVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== approvalSequenceNoVal) {
                      if (
                        transaction.approval.prefixSequence &&
                        transaction.approval.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'approval',
                          'prefixSequence',
                          transaction.approval.prefixSequence[0].prefix,
                          e.target.value
                        );
                      } else {
                        saveSinglePrefix(
                          'approval',
                          'prefixSequence',
                          approvalPrefixesVal,
                          e.target.value
                        );
                      }
                    }
                    setApprovalSequenceNoVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
          </Grid>

          <Typography variant="h6" className={classes.subHeader}>
            Job Work Order - In
          </Typography>

          <Grid container>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>Prefix</Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  placeholder="Add Prefix"
                  value={
                    transaction.jobWorkOrderIn.prefixSequence &&
                    transaction.jobWorkOrderIn.prefixSequence.length > 0 &&
                    transaction.jobWorkOrderIn.prefixSequence[0].prefix !== ''
                      ? transaction.jobWorkOrderIn.prefixSequence[0].prefix
                      : jobWorkOrderInPrefixesVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== jobWorkOrderInPrefixesVal) {
                      if (
                        transaction.jobWorkOrderIn.prefixSequence &&
                        transaction.jobWorkOrderIn.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'jobWorkOrderIn',
                          'prefixSequence',
                          e.target.value,
                          transaction.jobWorkOrderIn.prefixSequence[0]
                            .sequenceNumber
                        );
                      } else {
                        saveSinglePrefix(
                          'jobWorkOrderIn',
                          'prefixSequence',
                          e.target.value,
                          1
                        );
                      }
                    }
                    setJobWorkOrderInPrefixesVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  To Start With
                </Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  type="number"
                  placeholder="Add Sequence No"
                  value={
                    transaction.jobWorkOrderIn.prefixSequence &&
                    transaction.jobWorkOrderIn.prefixSequence.length > 0 &&
                    transaction.jobWorkOrderIn.prefixSequence[0]
                      .sequenceNumber !== 1
                      ? transaction.jobWorkOrderIn.prefixSequence[0]
                          .sequenceNumber
                      : jobWorkOrderInSequenceNoVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== jobWorkOrderInSequenceNoVal) {
                      if (
                        transaction.jobWorkOrderIn.prefixSequence &&
                        transaction.jobWorkOrderIn.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'jobWorkOrderIn',
                          'prefixSequence',
                          transaction.jobWorkOrderIn.prefixSequence[0].prefix,
                          e.target.value
                        );
                      } else {
                        saveSinglePrefix(
                          'jobWorkOrderIn',
                          'prefixSequence',
                          jobWorkOrderInPrefixesVal,
                          e.target.value
                        );
                      }
                    }
                    setJobWorkOrderInSequenceNoVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
          </Grid>

          <Typography variant="h6" className={classes.subHeader}>
            Job Work Order - Out
          </Typography>

          <Grid container>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>Prefix</Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  placeholder="Add Prefix"
                  value={
                    transaction.jobWorkOrderOut.prefixSequence &&
                    transaction.jobWorkOrderOut.prefixSequence.length > 0 &&
                    transaction.jobWorkOrderOut.prefixSequence[0].prefix !== ''
                      ? transaction.jobWorkOrderOut.prefixSequence[0].prefix
                      : jobWorkOrderOutPrefixesVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== jobWorkOrderOutPrefixesVal) {
                      if (
                        transaction.jobWorkOrderOut.prefixSequence &&
                        transaction.jobWorkOrderOut.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'jobWorkOrderOut',
                          'prefixSequence',
                          e.target.value,
                          transaction.jobWorkOrderOut.prefixSequence[0]
                            .sequenceNumber
                        );
                      } else {
                        saveSinglePrefix(
                          'jobWorkOrderOut',
                          'prefixSequence',
                          e.target.value,
                          1
                        );
                      }
                    }
                    setJobWorkOrderOutPrefixesVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  To Start With
                </Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  type="number"
                  placeholder="Add Sequence No"
                  value={
                    transaction.jobWorkOrderOut.prefixSequence &&
                    transaction.jobWorkOrderOut.prefixSequence.length > 0 &&
                    transaction.jobWorkOrderOut.prefixSequence[0]
                      .sequenceNumber !== 1
                      ? transaction.jobWorkOrderOut.prefixSequence[0]
                          .sequenceNumber
                      : jobWorkOrderOutSequenceNoVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== jobWorkOrderOutSequenceNoVal) {
                      if (
                        transaction.jobWorkOrderOut.prefixSequence &&
                        transaction.jobWorkOrderOut.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'jobWorkOrderOut',
                          'prefixSequence',
                          transaction.jobWorkOrderOut.prefixSequence[0].prefix,
                          e.target.value
                        );
                      } else {
                        saveSinglePrefix(
                          'jobWorkOrderOut',
                          'prefixSequence',
                          jobWorkOrderOutPrefixesVal,
                          e.target.value
                        );
                      }
                    }
                    setJobWorkOrderOutSequenceNoVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
          </Grid>

          <Typography variant="h6" className={classes.subHeader}>
            Work Order Receipt
          </Typography>

          <Grid container>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>Prefix</Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  placeholder="Add Prefix"
                  value={
                    transaction.workOrderReceipt.prefixSequence &&
                    transaction.workOrderReceipt.prefixSequence.length > 0 &&
                    transaction.workOrderReceipt.prefixSequence[0].prefix !== ''
                      ? transaction.workOrderReceipt.prefixSequence[0].prefix
                      : workOrderReceiptPrefixesVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== workOrderReceiptPrefixesVal) {
                      if (
                        transaction.workOrderReceipt.prefixSequence &&
                        transaction.workOrderReceipt.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'workOrderReceipt',
                          'prefixSequence',
                          e.target.value,
                          transaction.workOrderReceipt.prefixSequence[0]
                            .sequenceNumber
                        );
                      } else {
                        saveSinglePrefix(
                          'workOrderReceipt',
                          'prefixSequence',
                          e.target.value,
                          1
                        );
                      }
                    }
                    setWorkOrderReceiptPrefixesVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  To Start With
                </Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  type="number"
                  placeholder="Add Sequence No"
                  value={
                    transaction.workOrderReceipt.prefixSequence &&
                    transaction.workOrderReceipt.prefixSequence.length > 0 &&
                    transaction.workOrderReceipt.prefixSequence[0]
                      .sequenceNumber !== 1
                      ? transaction.workOrderReceipt.prefixSequence[0]
                          .sequenceNumber
                      : workOrderReceiptSequenceNoVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== workOrderReceiptSequenceNoVal) {
                      if (
                        transaction.workOrderReceipt.prefixSequence &&
                        transaction.workOrderReceipt.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'workOrderReceipt',
                          'prefixSequence',
                          transaction.workOrderReceipt.prefixSequence[0].prefix,
                          e.target.value
                        );
                      } else {
                        saveSinglePrefix(
                          'workOrderReceipt',
                          'prefixSequence',
                          workOrderReceiptPrefixesVal,
                          e.target.value
                        );
                      }
                    }
                    setWorkOrderReceiptSequenceNoVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
          </Grid>

          <Typography variant="h6" className={classes.subHeader}>
            Delivery Challan
          </Typography>

          <Grid container>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>Prefix</Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  placeholder="Add Prefix"
                  value={
                    transaction.deliveryChallan.prefixSequence &&
                    transaction.deliveryChallan.prefixSequence.length > 0 &&
                    transaction.deliveryChallan.prefixSequence[0].prefix !== ''
                      ? transaction.deliveryChallan.prefixSequence[0].prefix
                      : deliveryChallanPrefixesVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== deliveryChallanPrefixesVal) {
                      if (
                        transaction.deliveryChallan.prefixSequence &&
                        transaction.deliveryChallan.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'deliveryChallan',
                          'prefixSequence',
                          e.target.value,
                          transaction.deliveryChallan.prefixSequence[0]
                            .sequenceNumber
                        );
                      } else {
                        saveSinglePrefix(
                          'deliveryChallan',
                          'prefixSequence',
                          e.target.value,
                          1
                        );
                      }
                    }
                    setDeliveryChallanPrefixesVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  To Start With
                </Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  type="number"
                  placeholder="Add Sequence No"
                  value={
                    transaction.deliveryChallan.prefixSequence &&
                    transaction.deliveryChallan.prefixSequence.length > 0 &&
                    transaction.deliveryChallan.prefixSequence[0]
                      .sequenceNumber !== 1
                      ? transaction.deliveryChallan.prefixSequence[0]
                          .sequenceNumber
                      : deliveryChallanSequenceNoVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== deliveryChallanSequenceNoVal) {
                      if (
                        transaction.deliveryChallan.prefixSequence &&
                        transaction.deliveryChallan.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'deliveryChallan',
                          'prefixSequence',
                          transaction.deliveryChallan.prefixSequence[0].prefix,
                          e.target.value
                        );
                      } else {
                        saveSinglePrefix(
                          'deliveryChallan',
                          'prefixSequence',
                          deliveryChallanPrefixesVal,
                          e.target.value
                        );
                      }
                    }
                    setDeliveryChallanSequenceNoVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
          </Grid>

          <Typography variant="h6" className={classes.subHeader}>
            Purchase Order
          </Typography>

          <Grid container>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>Prefix</Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  placeholder="Add Prefix"
                  value={
                    transaction.purchaseOrder.prefixSequence &&
                    transaction.purchaseOrder.prefixSequence.length > 0 &&
                    transaction.purchaseOrder.prefixSequence[0].prefix !== ''
                      ? transaction.purchaseOrder.prefixSequence[0].prefix
                      : purchaseOrderPrefixesVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== purchaseOrderPrefixesVal) {
                      if (
                        transaction.purchaseOrder.prefixSequence &&
                        transaction.purchaseOrder.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'purchaseOrder',
                          'prefixSequence',
                          e.target.value,
                          transaction.purchaseOrder.prefixSequence[0]
                            .sequenceNumber
                        );
                      } else {
                        saveSinglePrefix(
                          'purchaseOrder',
                          'prefixSequence',
                          e.target.value,
                          1
                        );
                      }
                    }
                    setPurchaseOrderPrefixesVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  To Start With
                </Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  type="number"
                  placeholder="Add Sequence No"
                  value={
                    transaction.purchaseOrder.prefixSequence &&
                    transaction.purchaseOrder.prefixSequence.length > 0 &&
                    transaction.purchaseOrder.prefixSequence[0]
                      .sequenceNumber !== 1
                      ? transaction.purchaseOrder.prefixSequence[0]
                          .sequenceNumber
                      : purchaseOrderSequenceNoVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== purchaseOrderSequenceNoVal) {
                      if (
                        transaction.purchaseOrder.prefixSequence &&
                        transaction.purchaseOrder.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'purchaseOrder',
                          'prefixSequence',
                          transaction.purchaseOrder.prefixSequence[0].prefix,
                          e.target.value
                        );
                      } else {
                        saveSinglePrefix(
                          'purchaseOrder',
                          'prefixSequence',
                          purchaseOrderPrefixesVal,
                          e.target.value
                        );
                      }
                    }
                    setPurchaseOrderSequenceNoVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
          </Grid>

          <Typography variant="h6" className={classes.subHeader}>
            Sale Order
          </Typography>

          <Grid container>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>Prefix</Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  placeholder="Add Prefix"
                  value={
                    transaction.saleOrder.prefixSequence &&
                    transaction.saleOrder.prefixSequence.length > 0 &&
                    transaction.saleOrder.prefixSequence[0].prefix !== ''
                      ? transaction.saleOrder.prefixSequence[0].prefix
                      : saleOrderPrefixesVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== saleOrderPrefixesVal) {
                      if (
                        transaction.saleOrder.prefixSequence &&
                        transaction.saleOrder.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'saleOrder',
                          'prefixSequence',
                          e.target.value,
                          transaction.saleOrder.prefixSequence[0].sequenceNumber
                        );
                      } else {
                        saveSinglePrefix(
                          'saleOrder',
                          'prefixSequence',
                          e.target.value,
                          1
                        );
                      }
                    }
                    setSaleOrderPrefixesVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  To Start With
                </Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  type="number"
                  placeholder="Add Sequence No"
                  value={
                    transaction.saleOrder.prefixSequence &&
                    transaction.saleOrder.prefixSequence.length > 0 &&
                    transaction.saleOrder.prefixSequence[0].sequenceNumber !== 1
                      ? transaction.saleOrder.prefixSequence[0].sequenceNumber
                      : saleOrderSequenceNoVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== saleOrderSequenceNoVal) {
                      if (
                        transaction.saleOrder.prefixSequence &&
                        transaction.saleOrder.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'saleOrder',
                          'prefixSequence',
                          transaction.saleOrder.prefixSequence[0].prefix,
                          e.target.value
                        );
                      } else {
                        saveSinglePrefix(
                          'saleOrder',
                          'prefixSequence',
                          saleOrderPrefixesVal,
                          e.target.value
                        );
                      }
                    }
                    setSaleOrderSequenceNoVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
          </Grid>

          <Typography variant="h6" className={classes.subHeader}>
            Manufacture
          </Typography>

          <Grid container>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>Prefix</Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  placeholder="Add Prefix"
                  value={
                    transaction.manufacture.prefixSequence &&
                    transaction.manufacture.prefixSequence.length > 0 &&
                    transaction.manufacture.prefixSequence[0].prefix !== ''
                      ? transaction.manufacture.prefixSequence[0].prefix
                      : manufacturePrefixesVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== manufacturePrefixesVal) {
                      if (
                        transaction.manufacture.prefixSequence &&
                        transaction.manufacture.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'manufacture',
                          'prefixSequence',
                          e.target.value,
                          transaction.manufacture.prefixSequence[0]
                            .sequenceNumber
                        );
                      } else {
                        saveSinglePrefix(
                          'manufacture',
                          'prefixSequence',
                          e.target.value,
                          1
                        );
                      }
                    }
                    setManufacturePrefixesVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  To Start With
                </Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  type="number"
                  placeholder="Add Sequence No"
                  value={
                    transaction.manufacture.prefixSequence &&
                    transaction.manufacture.prefixSequence.length > 0 &&
                    transaction.manufacture.prefixSequence[0].sequenceNumber !==
                      1
                      ? transaction.manufacture.prefixSequence[0].sequenceNumber
                      : manufactureSequenceNoVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== manufactureSequenceNoVal) {
                      if (
                        transaction.manufacture.prefixSequence &&
                        transaction.manufacture.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'manufacture',
                          'prefixSequence',
                          transaction.manufacture.prefixSequence[0].prefix,
                          e.target.value
                        );
                      } else {
                        saveSinglePrefix(
                          'manufacture',
                          'prefixSequence',
                          manufacturePrefixesVal,
                          e.target.value
                        );
                      }
                    }
                    setManufactureSequenceNoVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
          </Grid>

          <Typography variant="h6" className={classes.subHeader}>
            Expense
          </Typography>

          <Grid container>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>Prefix</Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  placeholder="Add Prefix"
                  value={
                    transaction.expense.prefixSequence &&
                    transaction.expense.prefixSequence.length > 0 &&
                    transaction.expense.prefixSequence[0].prefix !== ''
                      ? transaction.expense.prefixSequence[0].prefix
                      : expensePrefixesVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== expensePrefixesVal) {
                      if (
                        transaction.expense.prefixSequence &&
                        transaction.expense.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'expense',
                          'prefixSequence',
                          e.target.value,
                          transaction.expense.prefixSequence[0].sequenceNumber
                        );
                      } else {
                        saveSinglePrefix(
                          'expense',
                          'prefixSequence',
                          e.target.value,
                          1
                        );
                      }
                    }
                    setExpensePrefixesVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  To Start With
                </Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  type="number"
                  placeholder="Add Sequence No"
                  value={
                    transaction.expense.prefixSequence &&
                    transaction.expense.prefixSequence.length > 0 &&
                    transaction.expense.prefixSequence[0].sequenceNumber !== 1
                      ? transaction.expense.prefixSequence[0].sequenceNumber
                      : expenseSequenceNoVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== expenseSequenceNoVal) {
                      if (
                        transaction.expense.prefixSequence &&
                        transaction.expense.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'expense',
                          'prefixSequence',
                          transaction.expense.prefixSequence[0].prefix,
                          e.target.value
                        );
                      } else {
                        saveSinglePrefix(
                          'expense',
                          'prefixSequence',
                          expensePrefixesVal,
                          e.target.value
                        );
                      }
                    }
                    setExpenseSequenceNoVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
          </Grid>

          <Typography variant="h6" className={classes.subHeader}>
            Stock
          </Typography>

          <Grid container>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>Prefix</Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  placeholder="Add Prefix"
                  value={
                    transaction.stock.prefixSequence &&
                    transaction.stock.prefixSequence.length > 0 &&
                    transaction.stock.prefixSequence[0].prefix !== ''
                      ? transaction.stock.prefixSequence[0].prefix
                      : stockPrefixesVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== stockPrefixesVal) {
                      if (
                        transaction.stock.prefixSequence &&
                        transaction.stock.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'stock',
                          'prefixSequence',
                          e.target.value,
                          transaction.stock.prefixSequence[0].sequenceNumber
                        );
                      } else {
                        saveSinglePrefix(
                          'stock',
                          'prefixSequence',
                          e.target.value,
                          1
                        );
                      }
                    }
                    setStockPrefixesVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  To Start With
                </Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  type="number"
                  placeholder="Add Sequence No"
                  value={
                    transaction.stock.prefixSequence &&
                    transaction.stock.prefixSequence.length > 0 &&
                    transaction.stock.prefixSequence[0].sequenceNumber !== 1
                      ? transaction.stock.prefixSequence[0].sequenceNumber
                      : stockSequenceNoVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== stockSequenceNoVal) {
                      if (
                        transaction.stock.prefixSequence &&
                        transaction.stock.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'stock',
                          'prefixSequence',
                          transaction.stock.prefixSequence[0].prefix,
                          e.target.value
                        );
                      } else {
                        saveSinglePrefix(
                          'stock',
                          'prefixSequence',
                          stockPrefixesVal,
                          e.target.value
                        );
                      }
                    }
                    setStockSequenceNoVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
          </Grid>

          <Typography variant="h6" className={classes.subHeader}>
            Receipt
          </Typography>

          <Grid container>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>Prefix</Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  placeholder="Add Prefix"
                  value={
                    transaction.tallyReceipt.prefixSequence &&
                    transaction.tallyReceipt.prefixSequence.length > 0 &&
                    transaction.tallyReceipt.prefixSequence[0].prefix !== ''
                      ? transaction.tallyReceipt.prefixSequence[0].prefix
                      : tallyReceiptPrefixesVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== tallyReceiptPrefixesVal) {
                      if (
                        transaction.tallyReceipt.prefixSequence &&
                        transaction.tallyReceipt.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'tallyReceipt',
                          'prefixSequence',
                          e.target.value,
                          transaction.tallyReceipt.prefixSequence[0]
                            .sequenceNumber
                        );
                      } else {
                        saveSinglePrefix(
                          'tallyReceipt',
                          'prefixSequence',
                          e.target.value,
                          1
                        );
                      }
                    }
                    setTallyReceiptPrefixesVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  To Start With
                </Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  type="number"
                  placeholder="Add Sequence No"
                  value={
                    transaction.tallyReceipt.prefixSequence &&
                    transaction.tallyReceipt.prefixSequence.length > 0 &&
                    transaction.tallyReceipt.prefixSequence[0]
                      .sequenceNumber !== 1
                      ? transaction.tallyReceipt.prefixSequence[0]
                          .sequenceNumber
                      : tallyReceiptSequenceNoVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== tallyReceiptSequenceNoVal) {
                      if (
                        transaction.tallyReceipt.prefixSequence &&
                        transaction.tallyReceipt.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'tallyReceipt',
                          'prefixSequence',
                          transaction.tallyReceipt.prefixSequence[0].prefix,
                          e.target.value
                        );
                      } else {
                        saveSinglePrefix(
                          'tallyReceipt',
                          'prefixSequence',
                          tallyReceiptPrefixesVal,
                          e.target.value
                        );
                      }
                    }
                    setTallyReceiptSequenceNoVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
          </Grid>

          <Typography variant="h6" className={classes.subHeader}>
            Payment
          </Typography>

          <Grid container>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>Prefix</Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  placeholder="Add Prefix"
                  value={
                    transaction.tallyPayment.prefixSequence &&
                    transaction.tallyPayment.prefixSequence.length > 0 &&
                    transaction.tallyPayment.prefixSequence[0].prefix !== ''
                      ? transaction.tallyPayment.prefixSequence[0].prefix
                      : tallyPaymentPrefixesVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== tallyPaymentPrefixesVal) {
                      if (
                        transaction.tallyPayment.prefixSequence &&
                        transaction.tallyPayment.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'tallyPayment',
                          'prefixSequence',
                          e.target.value,
                          transaction.tallyPayment.prefixSequence[0]
                            .sequenceNumber
                        );
                      } else {
                        saveSinglePrefix(
                          'tallyPayment',
                          'prefixSequence',
                          e.target.value,
                          1
                        );
                      }
                    }
                    setTallyPaymentPrefixesVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  To Start With
                </Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  type="number"
                  placeholder="Add Sequence No"
                  value={
                    transaction.tallyPayment.prefixSequence &&
                    transaction.tallyPayment.prefixSequence.length > 0 &&
                    transaction.tallyPayment.prefixSequence[0]
                      .sequenceNumber !== 1
                      ? transaction.tallyPayment.prefixSequence[0]
                          .sequenceNumber
                      : tallyPaymentSequenceNoVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== tallyPaymentSequenceNoVal) {
                      if (
                        transaction.tallyPayment.prefixSequence &&
                        transaction.tallyPayment.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'tallyPayment',
                          'prefixSequence',
                          transaction.tallyPayment.prefixSequence[0].prefix,
                          e.target.value
                        );
                      } else {
                        saveSinglePrefix(
                          'tallyPayment',
                          'prefixSequence',
                          tallyPaymentPrefixesVal,
                          e.target.value
                        );
                      }
                    }
                    setTallyPaymentSequenceNoVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
          </Grid>

          <Typography variant="h6" className={classes.subHeader}>
            Scheme
          </Typography>

          <Grid container>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>Prefix</Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  placeholder="Add Prefix"
                  value={
                    transaction.scheme.prefixSequence &&
                    transaction.scheme.prefixSequence.length > 0 &&
                    transaction.scheme.prefixSequence[0].prefix !== ''
                      ? transaction.scheme.prefixSequence[0].prefix
                      : schemePrefixesVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== schemePrefixesVal) {
                      if (
                        transaction.scheme.prefixSequence &&
                        transaction.scheme.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'scheme',
                          'prefixSequence',
                          e.target.value,
                          transaction.scheme.prefixSequence[0].sequenceNumber
                        );
                      } else {
                        saveSinglePrefix(
                          'scheme',
                          'prefixSequence',
                          e.target.value,
                          1
                        );
                      }
                    }
                    setSchemePrefixesVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  To Start With
                </Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  type="number"
                  placeholder="Add Sequence No"
                  value={
                    transaction.scheme.prefixSequence &&
                    transaction.scheme.prefixSequence.length > 0 &&
                    transaction.scheme.prefixSequence[0].sequenceNumber !== 1
                      ? transaction.scheme.prefixSequence[0].sequenceNumber
                      : schemeSequenceNoVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== schemeSequenceNoVal) {
                      if (
                        transaction.scheme.prefixSequence &&
                        transaction.scheme.prefixSequence.length > 0
                      ) {
                        saveSinglePrefix(
                          'scheme',
                          'prefixSequence',
                          transaction.scheme.prefixSequence[0].prefix,
                          e.target.value
                        );
                      } else {
                        saveSinglePrefix(
                          'scheme',
                          'prefixSequence',
                          schemePrefixesVal,
                          e.target.value
                        );
                      }
                    }
                    setSchemeSequenceNoVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <AddPrefixesModal
        title={modalTitle}
        property={property}
        subProperty={subProperty}
      />

      <AddBillTypeModal />

      <AddNoPrefixesModal property={property} currentNo={currentNo} />

      {/******Delete BillType Prefix Suffix Alert Message ****/}

      <Dialog
        open={openDeleteAlert}
        onClose={handleCloseDeleteAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ color: 'red' }}>
          {removeTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {removeMsg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteAlertYes}>Yes</Button>
          <Button onClick={handleDeleteAlertNo} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default injectWithObserver(TransactionPrefixesSettings);