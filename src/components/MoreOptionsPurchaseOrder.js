import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React, { useEffect } from 'react';
import OpenPreview from './OpenPreview';
import ConfirmModal from './modal/ConfirmModal';
import { toJS } from 'mobx';
import ComponentToPrint from '../views/Printers/ComponentsToPrint/index';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import * as Bd from './SelectedBusiness';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';

function MoreOptionsPurchaseOrder(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialogName, setOpenDialog] = React.useState(null);
  const [isStartPrint, setIsStartPrint] = React.useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = React.useState(false);

  const store = useStore();
  const { getInvoiceSettings, handleOpenCustomPrintPopUp } =
    store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { viewOrEditItem, deletePurchaseOrderTxnItem, duplicate } =
    store.PurchaseOrderStore;

  const { convertPurchaseOrderToPurchase } = store.PurchasesAddStore;

  const [printerList, setPrinterList] = React.useState([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openPrintSelectionAlert, setPrintSelectionAlert] =
    React.useState(false);

  const { getPurchaseOrderTransSettingdetails } =
    store.PurchaseOrderTransSettingsStore;

  const { purchaseOrderTransSettingData } = toJS(
    store.PurchaseOrderTransSettingsStore
  );
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
      openprint();
    };
    window.addEventListener('onCustomPrintPopupEvent', listener);

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener('onCustomPrintPopupEvent', listener);
    };
  }, []);

  useEffect(() => {
    getPurchaseOrderTransSettingdetails();
  }, [getPurchaseOrderTransSettingdetails]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openpdf = () => {
    setOpenDialog('pdf');
    handleClose();
  };

  const openpreview = () => {
    setOpenDialog('preview');
    handleClose();
  };

  const handleAlertClose = () => {
    setPrintSelectionAlert(false);
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

  const onIsStartPrint = () => {
    sendContentForThermalPrinter(
      props.item.vendor_id,
      invoiceThermal,
      props.item,
      purchaseOrderTransSettingData,
      'Purchase Order'
    );
  };

  const deleteItem = () => {
    setIsOpenConfirmModal(true);
  };

  const confirmDeleteItem = (confirm) => {
    if (confirm) {
      deletePurchaseOrderTxnItem(props.item);
      setIsOpenConfirmModal(false);
      setAnchorEl(null);
    }
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
      .get(`${API_SERVER}/pos/v1/download/purchaseOrder`, {
        responseType: 'arraybuffer',
        params: {
          businessId: businessId,
          businessCity: businessCity,
          partnerProfileId: partnerProfileId,
          partnerCity: partnerCity,
          invoiceId: props.item.purchase_order_invoice_number
        }
      })
      .then((res) => {
        const url = window.URL.createObjectURL(
          new Blob([res.data], { type: 'application/pdf' })
        );
        var link = document.createElement('a');
        link.href = url;
        let fileName =
          'Purchase_Order_' + props.item.purchase_order_invoice_number + '.pdf';
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

  const checkForCustomPrintPopUp = () => {
    if (invoiceRegular.showCustomPrintPopUp === true) {
      handleOpenCustomPrintPopUp();
    } else {
      openprint();
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
          {props.item.status === 'open' ? (
            <MenuItem key={1} onClick={() => viewOrEditItem(props.item)}>
              View/Edit{' '}
            </MenuItem>
          ) : (
            <MenuItem key={1} onClick={() => viewOrEditItem(props.item)}>
              View{' '}
            </MenuItem>
          )}
          <MenuItem key={2} onClick={() => duplicate(props.item)}>
            Duplicate{' '}
          </MenuItem>
          {localStorage.getItem('isAdmin') === 'true' && (
            <MenuItem key={3} onClick={() => deleteItem()}>
              {' '}
              Delete
            </MenuItem>
          )}
          {props.item.status !== 'close' && (
            <MenuItem
              key={4}
              onClick={() => convertPurchaseOrderToPurchase(props.item)}
            >
              {' '}
              Convert To Purchase
            </MenuItem>
          )}

          <MenuItem key={5} onClick={downloadPDF}>
            {' '}
            Download PDF
          </MenuItem>

          <MenuItem key={6} onClick={openpreview}>
            {' '}
            Preview
          </MenuItem>

          <MenuItem key={7} onClick={checkForCustomPrintPopUp}>
            Print{' '}
          </MenuItem>
        </Menu>

        {openDialogName === 'preview' ? (
          <OpenPreview
            open={openDialogName === 'preview'}
            onClose={closeDialog}
            id={props.id}
            invoiceData={props.item}
            startPrint={isStartPrint}
            txnSettings={purchaseOrderTransSettingData}
            screenName="Purchase Order"
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
    </div>
  );
}

export default injectWithObserver(MoreOptionsPurchaseOrder);