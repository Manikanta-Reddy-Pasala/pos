import {
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  Typography,
  TextField
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';
import OpenPreview from './OpenPreview';
import SaleGemini from './SaleGemini';
import PaymentHistory from './PaymentHistory';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import ConfirmModal from './modal/ConfirmModal';

import ComponentToPrint from '../views/Printers/ComponentsToPrint/index';
import WHCompToPrint from 'src/views/Printers/ComponentsToPrint/WarehousePrint/WHCompToPrint';
import { toJS } from 'mobx';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import * as Bd from './SelectedBusiness';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as einvoice from '../components/Helpers/EinvoiceAPIHelper';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Loader from 'react-js-loader';
import PackageDetails from '../views/sales/SalesInvoices/PackageDetails';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';
import { getPrinterSettings } from 'src/components/Helpers/dbQueries/printersettings';
import { getSaleTransactionSettings } from 'src/components/Helpers/dbQueries/saletransactionsettings';
import {
  getPartyDataById,
  updateParty
} from 'src/components/Helpers/dbQueries/parties';

function Moreoptions(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialogName, setOpenDialog] = React.useState(null);
  const [isStartPrint, setIsStartPrint] = React.useState(false);
  const [isStartWHPrint, setStartWHPrint] = React.useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [invoiceThermal, setInvoiceThermal] = React.useState();
  const [invoiceRegular, setInvoiceRegular] = React.useState();
  const [salesTransSettingData, setSalesTransSettingData] = React.useState();
  const [emailId, setEmailId] = useState('');
  const [emailEmpty, setEmailEmpty] = useState(false);

  const store = useStore();

  const {
    viewOrEditItem,
    deleteSaleItem,
    updateEinvoiceDataToSales,
    isSaleLockedForDelete,
    handleOpenCancelDialog,
    duplicate,
    cloneSaleDetals
  } = store.SalesAddStore;
  const { handleOpenCustomPrintPopUp } = store.PrinterSettingsStore;
  const { createDeliveryChallanFromSale } = store.DeliveryChallanStore;
  const { handleOpenEWayGenerateModal, setIsComingFromSale } = store.EWayStore;

  const { getSalesPaymentHistory, resetPaymentHistory } =
    store.PaymentHistoryStore;

  const { transaction } = toJS(store.TransactionStore);

  const [openPrintSelectionAlert, setPrintSelectionAlert] =
    React.useState(false);

  const [openWHPrintSelectionAlert, setWHPrintSelectionAlert] =
    React.useState(false);

  const { receivePaymentOpen } = store.PaymentInStore;
  const { openSalesReturn } = store.ReturnsAddStore;

  const [printerList, setPrinterList] = React.useState([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = useState(false);

  const [openLoadingAlert, setOpenLoadingAlert] = useState(false);
  const [loadMenuData, setLoadMenuData] = useState(false);
  const [loadingAlertText, setLoadingAlertText] = useState('');

  const [openPackageDetails, setOpenPackageDetails] = useState(false);

  const [customPrintOptions, setCustomPrintOptions] = useState({
    printOriginal: false,
    printOriginalCopies: '0',
    printDuplicate: false,
    printDuplicateCopies: '0',
    printTriplicate: false,
    printTriplicateCopies: '0',
    printCustom: false,
    printCustomName: '',
    printCustomCopies: '0'
  });

  const handleOpenLoadingAlertClose = () => {
    setLoadingAlertText('');
    setOpenLoadingAlert(false);
  };

  const handleErrorAlertMessageClose = () => {
    setErrorAlertMessage(false);
    setErrorMessage('');
  };

  const handleAlertClose = () => {
    setPrintSelectionAlert(false);
  };

  const handleWHAlertClose = () => {
    setWHPrintSelectionAlert(false);
  };

  const handleClick = async (event) => {
    const currentTarget = await event.currentTarget;
    const printerObject = await getPrinterSettings();
    setInvoiceThermal(printerObject.invoiceThermal);
    setInvoiceRegular(printerObject.invoiceRegular);
    let printerData;
    try {
      printerData = JSON.parse(window.localStorage.getItem('printers'));
      setPrinterList(printerData);
    } catch (e) {
      console.error(' Error: ', e.message);
    }
    const quotationSettings = await getSaleTransactionSettings();
    setSalesTransSettingData(quotationSettings);

    setAnchorEl(currentTarget);
    setLoadMenuData(true);
  };

  const deleteItem = () => {
    setIsOpenConfirmModal(true);
  };

  const confirmDeleteItem = async (confirm) => {
    if (confirm) {
      let returnObj = await isSaleLockedForDelete(props.item);
      if (returnObj.isLocked === true) {
        setIsOpenConfirmModal(false);
        setAnchorEl(null);
        setErrorMessage(returnObj.saleLockMessage);
        setErrorAlertMessage(true);
      } else {
        deleteSaleItem(props.item);
        setIsOpenConfirmModal(false);
        setAnchorEl(null);
      }
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    resetPaymentHistory();
  };

  const openPaymentHistory = async (item) => {
    await getSalesPaymentHistory(item);
    setOpenDialog('paymenthistory');
  };

  useEffect(() => {
    // Add your listener here
    if (loadMenuData) {
      const listener = () => {
        let printData = window.localStorage.getItem('onCustomPrintPopupData');
        setCustomPrintOptions(JSON.parse(printData));
        openprint();
      };
      window.addEventListener('onCustomPrintPopupEvent', listener);

      // Clean up the listener when the component unmounts
      return () => {
        window.removeEventListener('onCustomPrintPopupEvent', listener);
      };
    }
  }, [loadMenuData]);

  const openpreview = () => {
    setOpenDialog('preview');
    handleClose();
  };
  const openSaleGemini = () => {
    setOpenDialog('gemini');
    handleClose();
  };

  const openprint = () => {
    let popupcloseinterval = 500;
    if (invoiceRegular.showCustomPrintPopUp === true) {
      popupcloseinterval = 3000;
    }
    if (!invoiceThermal.boolDefault) {
      setIsStartPrint(true);
      setPrintSelectionAlert(true);
      setTimeout(() => {
        setIsStartPrint(false);
        handleAlertClose();
      }, popupcloseinterval);
    } else {
      onIsStartPrint();
    }
    handleClose();
  };

  const checkForCustomPrintPopUp = () => {
    if (invoiceRegular.showCustomPrintPopUp === true) {
      handleOpenCustomPrintPopUp();
    } else {
      openprint();
    }
  };

  const onIsStartPrint = () => {
    sendContentForThermalPrinter(
      props.item.customer_id,
      invoiceThermal,
      props.item,
      salesTransSettingData,
      'Sales'
    );
  };

  const wareHousePrint = () => {
    if (!invoiceThermal.boolDefault) {
      setStartWHPrint(true);
      setWHPrintSelectionAlert(true);
      setTimeout(() => {
        handleWHAlertClose();
      }, 500);
    } else {
      onIsStartPrint();
    }
    handleClose();
  };

  const openRecievePayment = (item) => {
    receivePaymentOpen(item);
  };

  const convertToReturn = async (item) => {
    openSalesReturn(item);
  };

  const closeDialog = () => {
    setOpenDialog(null);
  };

  const downloadPDF = async () => {
    toast.info('Downloading Please Wait...', {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: true
    });

    const API_SERVER = window.REACT_APP_API_SERVER;

    const businessData = await Bd.getBusinessData();
    const businessId = businessData.businessId;
    const businessCity = businessData.businessCity;
    let partnerCity = localStorage.getItem('partnerCity')
      ? localStorage.getItem('partnerCity')
      : '';
    let partnerProfileId = localStorage.getItem('partnerProfileId')
      ? localStorage.getItem('partnerProfileId')
      : '';

    await axios
      .get(`${API_SERVER}/pos/v1/download/downloadCreateInvoice`, {
        responseType: 'arraybuffer',
        params: {
          businessId: businessId,
          businessCity: businessCity,
          partnerProfileId: partnerProfileId,
          partnerCity: partnerCity,
          invoiceId: props.item.invoice_number
        }
      })
      .then((res) => {
        const url = window.URL.createObjectURL(
          new Blob([res.data], { type: 'application/pdf' })
        );
        var link = document.createElement('a');
        link.href = url;
        let fileName = 'Invoice_' + props.item.invoice_number + '.pdf';
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        toast.error(
          'Something went wrong while Downloading. Please try again!',
          {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: true
          }
        );
        console.log(err);
        throw err;
      });
  };

  const isEWayGeneratePossible = () => {
    let planName = localStorage.getItem('planName');

    if ('Starter' === planName) {
      setErrorMessage(
        'Please upgrade your plan to proceed with E-Way generation'
      );
      setErrorAlertMessage(true);

      return;
    }

    let invoiceDetails = props.item;

    if (invoiceDetails.customer_id === '') {
      setErrorMessage(
        'Please provide Buyer details to proceed with E-Way generation'
      );
      setErrorAlertMessage(true);
    } else if (invoiceDetails.item_list.length === 0) {
      setErrorMessage(
        'Please add atleast one product to proceed with E-Way generation'
      );
      setErrorAlertMessage(true);
    } else {
      setIsComingFromSale(true);
      handleOpenEWayGenerateModal('Invoice', props.item);
    }
  };

  const isEInvoiceGeneratePossible = async () => {
    let planName = localStorage.getItem('planName');

    console.log('Plan Name: ' + planName);

    if ('Starter' === planName) {
      setErrorMessage(
        'Please upgrade your plan to proceed with E-Way generation'
      );
      setErrorAlertMessage(true);

      return;
    }

    let invoiceDetails = props.item;

    if (invoiceDetails.customer_id === '') {
      setErrorMessage(
        'Please provide Buyer details to proceed with E-Way generation'
      );
      setErrorAlertMessage(true);
    } else if (invoiceDetails.item_list.length === 0) {
      setErrorMessage(
        'Please add atleast one product to proceed with E-Way generation'
      );
      setErrorAlertMessage(true);
    } else {
      setLoadingAlertText(
        'Please wait while the E-Invoice is being created!!!'
      );
      setOpenLoadingAlert(true);
      const response = await einvoice.createEinvoice(props.item);

      if (response.success === true) {
        await updateEinvoiceDataToSales(props.item, response);
        setTimeout(() => {
          handleOpenLoadingAlertClose();
          setErrorMessage('E-Invoice is created successfully!!');
          setErrorAlertMessage(true);
        }, 4000);
      } else {
        handleOpenLoadingAlertClose();
        setErrorMessage(response.errorMessage);
        setErrorAlertMessage(true);
      }
    }
  };

  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3)
    }
  }))(MuiDialogActions);

  const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      width: '400px'
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(0),
      color: theme.palette.grey[500]
    }
  });

  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2)
    }
  }))(MuiDialogContent);

  const handleEmailInitiation = async () => {
    if (
      props.item.customer_emailId !== '' &&
      props.item.customer_emailId !== null
    ) {
      handleSendEmail();
    } else if (
      props.item.customer_id === '' ||
      props.item.customer_id === null
    ) {
      setErrorMessage('Please add customer to share invoice copy via E-mail!!');
      setErrorAlertMessage(true);
    } else {
      setEmailEmpty(true);
    }
  };

  const handleSendEmail = async () => {
    const API_SERVER = window.REACT_APP_API_SERVER;

    const businessData = await Bd.getBusinessData();
    const businessId = businessData.businessId;
    const businessCity = businessData.businessCity;
    let partnerCity = localStorage.getItem('partnerCity')
      ? localStorage.getItem('partnerCity')
      : '';
    let partnerProfileId = localStorage.getItem('partnerProfileId')
      ? localStorage.getItem('partnerProfileId')
      : '';

    const invoiceEmailReq = {
      businessId: businessId,
      businessCity: businessCity,
      partnerProfileId: partnerProfileId,
      partnerCity: partnerCity,
      invoiceId: props.item.invoice_number,
      invoiceType: 'Sale'
    };

    await axios
      .post(`${API_SERVER}/pos/v1/email/sendInvoice`, invoiceEmailReq)
      .then((response) => {
        if (response && response.data && response.data.success === true) {
          toast.info('Email sent successfully', {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: true
          });
        } else {
          toast.error(
            'Something went wrong while sharing email. Please try again!',
            {
              position: toast.POSITION.BOTTOM_CENTER,
              autoClose: true
            }
          );
        }
      })
      .catch((err) => {
        toast.error(
          'Something went wrong while sharing email. Please try again!',
          {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: true
          }
        );
        console.log(err);
        throw err;
      });
  };

  const handlePackageClose = () => {
    setOpenPackageDetails(false);
  };

  const handlePackageDetails = () => {
    setOpenPackageDetails(true);
    cloneSaleDetals(props.item);
  };

  const openPackagePreview = () => {
    setOpenDialog('packagePreview');
    handleClose();
  };

  const handleCloseemailEmptyModel = () => {
    setEmailEmpty(false);
  };

  const updateEmailID = async () => {
    if (emailId) {
      let updateDoc = await getPartyDataById(props.item.customer_id);
      let updateSelector = {
        $set: {
          name: updateDoc.name,
          balanceType: updateDoc.balanceType,
          balance: parseFloat(updateDoc.balance),
          asOfDate: updateDoc.asOfDate,
          address: updateDoc.address,
          pincode: updateDoc.pincode,
          gstType: updateDoc.gstType,
          city: updateDoc.city,
          emailId: emailId,
          isCustomer: updateDoc.isCustomer,
          isVendor: updateDoc.isVendor,
          updatedAt: Date.now(),
          gstNumber: updateDoc.gstNumber,
          vipCustomer: updateDoc.vipCustomer,
          place_of_supply: updateDoc.place_of_supply,
          phoneNo: updateDoc.phoneNo,
          gothra: updateDoc.gothra,
          rashi: updateDoc.rashi,
          star: updateDoc.star,
          shippingAddress: updateDoc.shippingAddress,
          shippingPincode: updateDoc.shippingPincode,
          shippingCity: updateDoc.shippingCity,
          state: updateDoc.state,
          country: updateDoc.country,
          shippingState: updateDoc.shippingState,
          shippingCountry: updateDoc.shippingCountry,
          registrationNumber: updateDoc.registrationNumber,
          tradeName: updateDoc.tradeName,
          legalName: updateDoc.legalName,
          panNumber: updateDoc.panNumber,
          tcsName: updateDoc.tcsName,
          tcsRate: updateDoc.tcsRate,
          tcsCode: updateDoc.tcsCode,
          tdsName: updateDoc.tdsName,
          tdsRate: updateDoc.tdsRate,
          tdsCode: updateDoc.tdsCode,
          additionalAddressList: updateDoc.additionalAddressList,
          isSyncedToServer: updateDoc.isSyncedToServer,
          tallySyncedStatus: updateDoc.tallySyncedStatus,
          tallySynced: updateDoc.tallySynced,
          aadharNumber: updateDoc.aadharNumber,
          creditLimit: updateDoc.creditLimit,
          msmeRegNo: updateDoc.msmeRegNo,
          companyStatus: updateDoc.companyStatus,
          tallyMappingName: updateDoc.tallyMappingName
        }
      };
      await updateParty(props.item.customer_id, updateSelector);
      setEmailEmpty(false);
      handleSendEmail();
    } else {
      toast.error('Email Id should not be empty!!!', {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: true
      });
    }
  };

  return (
    <div>
      <div>
        <IconButton onClick={handleClick}>
          <MoreVert fontSize="inherit" />
        </IconButton>

        {isOpenConfirmModal ? (
          <ConfirmModal
            open={isOpenConfirmModal}
            onConfirm={(isConfirm) => confirmDeleteItem(isConfirm)}
            onClose={() => setIsOpenConfirmModal(false)}
          />
        ) : (
          ''
        )}

        <Menu
          id="moremenu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem key={1} onClick={() => viewOrEditItem(props.item)}>
            View/Edit{' '}
          </MenuItem>

          <MenuItem key={2} onClick={() => duplicate(props.item)}>
            Duplicate{' '}
          </MenuItem>

          {!(
            props.item.isFullyReturned ||
            props.item.isPartiallyReturned ||
            props.item.isCancelled
          ) &&
            props.item.einvoiceBillStatus !== 'Cancelled' &&
            localStorage.getItem('isAdmin') === 'true' && (
              <MenuItem key={3} onClick={() => deleteItem()}>
                Delete{' '}
              </MenuItem>
            )}

          {!(
            props.item.isFullyReturned ||
            props.item.isPartiallyReturned ||
            props.item.isCancelled
          ) &&
            'Pending' === props.item.einvoiceBillStatus &&
            localStorage.getItem('isAdmin') === 'true' && (
              <MenuItem
                key={4}
                onClick={() => handleOpenCancelDialog(props.item, false)}
              >
                Cancel{' '}
              </MenuItem>
            )}

          {'Completed' === props.item.einvoiceBillStatus &&
            'Cancelled' !== props.item.einvoiceBillStatus && (
              <MenuItem
                key={5}
                onClick={() => handleOpenCancelDialog(props.item, true)}
              >
                Cancel E-Invoice{' '}
              </MenuItem>
            )}

          {props.item.balance_amount > 0 &&
            !props.item.isFullyReturned &&
            !props.item.isCancelled &&
            'Cancelled' !== props.item.einvoiceBillStatus && (
              <MenuItem key={6} onClick={() => openRecievePayment(props.item)}>
                {' '}
                Receive Payment
              </MenuItem>
            )}

          {props.item.linkedTxnList &&
            typeof props.item.linkedTxnList !== 'undefined' &&
            props.item.linkedTxnList.length > 0 && (
              <MenuItem key={7} onClick={() => openPaymentHistory(props.item)}>
                {' '}
                Payment History
              </MenuItem>
            )}
          {!props.item.isFullyReturned &&
            !props.item.isCancelled &&
            'Cancelled' !== props.item.einvoiceBillStatus && (
              <MenuItem key={8} onClick={() => convertToReturn(props.item)}>
                {' '}
                Convert To Return
              </MenuItem>
            )}
          {props.item.convertedToDC === false &&
            !props.item.isCancelled &&
            'Cancelled' !== props.item.einvoiceBillStatus && (
              <MenuItem
                key={9}
                onClick={() => createDeliveryChallanFromSale(props.item)}
              >
                {' '}
                Delivery Challan
              </MenuItem>
            )}

          {('Not Generated' === props.item.ewayBillStatus ||
            'Cancelled' === props.item.ewayBillStatus) &&
            transaction.enableEway &&
            !props.item.isCancelled && (
              <MenuItem key={10} onClick={isEWayGeneratePossible}>
                {' '}
                Generate E-Way
              </MenuItem>
            )}

          {('Pending' === props.item.einvoiceBillStatus ||
            'Failed' === props.item.einvoiceBillStatus) &&
            transaction.enableEinvoice &&
            !props.item.isCancelled && (
              <MenuItem key={11} onClick={isEInvoiceGeneratePossible}>
                {' '}
                Push E-Invoice
              </MenuItem>
            )}
          <MenuItem key={12} onClick={handlePackageDetails}>
            Package details
          </MenuItem>
          <MenuItem key={13} onClick={downloadPDF}>
            {' '}
            Download PDF
          </MenuItem>
          <MenuItem key={14} onClick={openSaleGemini}>
            {' '}
            Analyse Audit History
          </MenuItem>
          <MenuItem key={15} onClick={openpreview}>
            {' '}
            Preview
          </MenuItem>
          <MenuItem key={16} onClick={openPackagePreview}>
            Package Preview
          </MenuItem>
          <MenuItem key={17} onClick={checkForCustomPrintPopUp}>
            Print{' '}
          </MenuItem>
          <MenuItem key={18} onClick={wareHousePrint}>
            Warehouse Print
          </MenuItem>
          <MenuItem key={19} onClick={() => handleEmailInitiation()}>
            E-Mail{' '}
          </MenuItem>
        </Menu>

        {openDialogName === 'gemini' ? (
          <SaleGemini open={true} onClose={closeDialog} item={props.item} />
        ) : (
          ''
        )}

        {openDialogName === 'preview' || openDialogName === 'packagePreview' ? (
          <OpenPreview
            open={true}
            onClose={closeDialog}
            id={props.id}
            invoiceData={props.item}
            startPrint={isStartPrint}
            txnSettings={salesTransSettingData}
            screenName="Sales"
            isPackagePreivew={openDialogName === 'packagePreview'}
          />
        ) : (
          ''
        )}
        {openDialogName === 'printpreview' ? (
          <OpenPreview
            open={false}
            onClose={closeDialog}
            id={props.id}
            invoiceData={props.item}
            startPrint={isStartPrint}
            txnSettings={salesTransSettingData}
            screenName="Sales"
          />
        ) : (
          ''
        )}

        {openDialogName === 'paymenthistory' ? (
          <PaymentHistory
            open={true}
            onClose={closeDialog}
            index={props.index}
          />
        ) : (
          ''
        )}
      </div>
      {openPrintSelectionAlert === true && (
        <Dialog
          open={openPrintSelectionAlert}
          onClose={handleAlertClose}
          aria-labelledby="responsive-dialog-title"
          style={{ display: 'none' }}
        >
          <DialogContent>
            <DialogContentText>
              <ComponentToPrint
                data={props.item}
                printMe={isStartPrint}
                isThermal={invoiceThermal.boolDefault}
                customPrintOptions={customPrintOptions}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAlertClose} color="primary" autoFocus>
              PROCEED TO PRINT
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {openWHPrintSelectionAlert === true && (
        <Dialog
          open={openWHPrintSelectionAlert}
          onClose={handleWHAlertClose}
          aria-labelledby="responsive-dialog-title"
          style={{ display: 'none' }}
        >
          <DialogContent>
            <DialogContentText>
              <WHCompToPrint
                data={props.item}
                printMe={isStartWHPrint}
                isThermal={invoiceThermal.boolDefault}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleWHAlertClose} color="primary" autoFocus>
              PROCEED TO WAREHOUSE PRINT
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog
        fullScreen={fullScreen}
        open={openLoadingAlert}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>{loadingAlertText}</p>
              </div>
              <div>
                <br />
                <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openErrorAlertMessage}
        onClose={handleErrorAlertMessageClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorAlertMessageClose}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      {openPackageDetails && (
        <PackageDetails handlePackageClose={handlePackageClose} />
      )}
      <Dialog maxWidth="sm" open={emailEmpty}>
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>
                  Customer Email Address is empty. Please fill Email address to
                  proceed.
                </p>
              </div>
            </div>
            <FormControl fullWidth>
              <Typography variant="subtitle1">Email</Typography>
              <TextField
                fullWidth
                autoFocus
                variant="outlined"
                margin="dense"
                type="text"
                placeholder="Enter Email"
                className="customTextField"
                value={emailId}
                onChange={(event) => setEmailId(event.target.value)}
              />
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseemailEmptyModel} color="primary">
            CANCEL
          </Button>
          <Button onClick={(e) => updateEmailID()} color="primary">
            PROCEED TO SHARE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default injectWithObserver(Moreoptions);