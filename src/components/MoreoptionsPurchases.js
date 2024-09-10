import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React, { useEffect } from 'react';
import PaymentHistory from './PaymentHistory';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import ConfirmModal from './modal/ConfirmModal';
import ComponentToPrint from '../views/Printers/ComponentsToPrint/index';
import { toJS } from 'mobx';
import OpenPreview from './OpenPreview';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import * as Bd from './SelectedBusiness';
import WHCompToPrint from 'src/views/Printers/ComponentsToPrint/WarehousePrint/WHCompToPrint';
import eventBus from '../components/events/EventBus';
import { useNavigate } from 'react-router-dom';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';

function Moreoptions(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialogName, setOpenDialog] = React.useState(null);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = React.useState(false);
  const [isStartPrint, setIsStartPrint] = React.useState(false);
  const [isStartWHPrint, setStartWHPrint] = React.useState(false);
  const navigate = useNavigate();

  const store = useStore();
  const { viewOrEditItem, deletePurchaseEntry, duplicate } =
    store.PurchasesAddStore;

  const { openPurchaseReturn } = store.PurchasesReturnsAddStore;

  const { paidPaymentOpen, makePaymentOpenVendor } = store.PaymentOutStore;

  const { getInvoiceSettings, handleOpenCustomPrintPopUp } =
    store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);

  const [printerList, setPrinterList] = React.useState([]);
  const [openPrintSelectionAlert, setPrintSelectionAlert] =
    React.useState(false);
  const [openWHPrintSelectionAlert, setWHPrintSelectionAlert] =
    React.useState(false);

  const { getPurchaseTransSettingdetails } = store.PurchaseTransSettingsStore;

  const { purchaseTransSettingData } = toJS(store.PurchaseTransSettingsStore);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [errorMessage, setErrorMessage] = React.useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = React.useState(false);

  const handleErrorAlertMessageClose = () => {
    setErrorAlertMessage(false);
    setErrorMessage('');
  };

  const { addBulkBarcodeDataFromPurchase } = store.BarcodeStore;
  const [customPrintOptions, setCustomPrintOptions] = React.useState({
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

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));

    let printerData;
    try {
      printerData = JSON.parse(window.localStorage.getItem('printers'));
      setPrinterList(printerData);
    } catch (e) {
      console.error(' Error: ', e.message);
    }
  }, []);

  useEffect(() => {
    // Add your listener here
    const listener = (event) => {
      let printData = window.localStorage.getItem('onCustomPrintPopupData');
      setCustomPrintOptions(JSON.parse(printData));
      console.log('JSON.parse(printData)', JSON.parse(printData));
      openprint();
    };
    window.addEventListener('onCustomPrintPopupEvent', listener);

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener('onCustomPrintPopupEvent', listener);
    };
  }, []);

  const checkForCustomPrintPopUp = () => {
    if (invoiceRegular.showCustomPrintPopUp === true) {
      handleOpenCustomPrintPopUp();
    } else {
      openprint();
    }
  };

  useEffect(() => {
    getPurchaseTransSettingdetails();
  }, [getPurchaseTransSettingdetails]);

  const deleteItem = () => {
    setIsOpenConfirmModal(true);
  };

  const confirmDeleteItem = async (confirm) => {
    if (confirm) {
      await deletePurchaseEntry(props.item);
      setIsOpenConfirmModal(false);
      setAnchorEl(null);
    }
  };

  const handleAlertClose = () => {
    setPrintSelectionAlert(false);
  };

  const { getPurchasePaymentHistory, resetPaymentHistory } =
    store.PaymentHistoryStore;

  const handleWHAlertClose = () => {
    setWHPrintSelectionAlert(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const openMakePayment = async (item) => {
    makePaymentOpenVendor(item);
  };

  const handleClose = () => {
    setAnchorEl(null);
    resetPaymentHistory();
  };

  const openPaymentHistory = async (item) => {
    await getPurchasePaymentHistory(item);
    setOpenDialog('paymenthistory');
  };

  const openpdf = () => {
    setOpenDialog('pdf');
    handleClose();
  };

  const openRecievePayment = (item) => {
    paidPaymentOpen(item);
    setOpenDialog('paidPayment');
    handleClose();
  };

  const openpreview = () => {
    setOpenDialog('preview');
    handleClose();
  };

  const openprint = () => {
    let popupcloseinterval = 500;
    if (invoiceRegular.showCustomPrintPopUp === true) {
      popupcloseinterval = 5000;
    }
    console.log('Thermal Printer is selected: ', invoiceThermal.boolDefault);
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

  const handleBarcodePrintClick = () => {
    if (props.item.item_list && props.item.item_list.length > 0) {
      let allProdsHaveBarcode = true;
      let itemListWithoutBarcode = '';

      props.item.item_list.forEach((item) => {
        if (
          item.barcode === '' ||
          item.barcode === null ||
          item.barcode === undefined
        ) {
          allProdsHaveBarcode = false;
          itemListWithoutBarcode += item.item_name + '<br/>';
        }
      });
      if (allProdsHaveBarcode) {
        navigate('/app/barcodePrinter', { replace: true });
        eventBus.dispatch('navigateToBarcodePrint', { message: '' });
        addBulkBarcodeDataFromPurchase(props.item.item_list);
      } else {
        setErrorMessage(
          'Please find products without barcode. Please fix them to proceed further:<br/>' +
            itemListWithoutBarcode
        );
        setErrorAlertMessage(true);
      }
    }
  };

  const onIsStartPrint = async () => {
    sendContentForThermalPrinter(
      props.item.vendor_id,
      invoiceThermal,
      props.item,
      purchaseTransSettingData,
      'Purchase'
    );
  };

  const wareHousePrint = () => {
    console.log('Thermal Printer is selected: ', invoiceThermal.boolDefault);
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

  const convertToReturn = (item) => {
    openPurchaseReturn(item);
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
      .get(`${API_SERVER}/pos/v1/download/purchase`, {
        responseType: 'arraybuffer',
        params: {
          businessId: businessId,
          businessCity: businessCity,
          partnerProfileId: partnerProfileId,
          partnerCity: partnerCity,
          purchaseId: props.item.bill_number
        }
      })
      .then((res) => {
        const url = window.URL.createObjectURL(
          new Blob([res.data], { type: 'application/pdf' })
        );
        var link = document.createElement('a');
        link.href = url;
        let fileName = 'Purchase_' + props.item.bill_number + '.pdf';
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

          {!(props.item.isFullyReturned || props.item.isPartiallyReturned) &&
            localStorage.getItem('isAdmin') === 'true' && (
              <MenuItem key={3} onClick={() => deleteItem()}>
                Delete{' '}
              </MenuItem>
            )}

          {props.item.balance_amount > 0 && !props.item.isFullyReturned && (
            <MenuItem key={4} onClick={() => openMakePayment(props.item)}>
              {' '}
              Make Payment
            </MenuItem>
          )}

          {!props.item.isFullyReturned && (
            <MenuItem key={5} onClick={() => convertToReturn(props.item)}>
              Convert To Return{' '}
            </MenuItem>
          )}
          {(!(
            typeof props.item.linkedTxnList !== 'undefined' &&
            props.item.linkedTxnList.length === 0
          ) ||
            props.item.paid_amount > 0) && (
            <MenuItem key={6} onClick={() => openPaymentHistory(props.item)}>
              {' '}
              Payment History
            </MenuItem>
          )}
          <MenuItem key={7} onClick={downloadPDF}>
            {' '}
            Download PDF
          </MenuItem>
          <MenuItem key={8} onClick={openpreview}>
            {' '}
            Preview
          </MenuItem>

          <MenuItem key={9} onClick={checkForCustomPrintPopUp}>
            Print{' '}
          </MenuItem>
          <MenuItem key={10} onClick={wareHousePrint}>
            Warehouse Print{' '}
          </MenuItem>
          <MenuItem key={11} onClick={() => handleBarcodePrintClick()}>
            Barcode Print{' '}
          </MenuItem>
        </Menu>

        {openDialogName === 'preview' ? (
          <OpenPreview
            open={true}
            onClose={closeDialog}
            id={props.id}
            invoiceData={props.item}
            startPrint={isStartPrint}
            txnSettings={purchaseTransSettingData}
            screenName="Purchase"
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
      <Dialog
        fullScreen={fullScreen}
        open={openErrorAlertMessage}
        onClose={handleErrorAlertMessageClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div dangerouslySetInnerHTML={{ __html: errorMessage }}></div>
          </DialogContentText>
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
    </div>
  );
}

export default injectWithObserver(Moreoptions);