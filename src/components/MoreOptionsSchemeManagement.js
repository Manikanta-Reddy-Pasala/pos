import { IconButton, Menu, MenuItem, Button } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import ConfirmModal from './modal/ConfirmModal';
import { toJS } from 'mobx';
import ComponentToPrint from 'src/views/Printers/ComponentsToPrint/index';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';
import OpenPreview from './OpenPreview';
import { toast } from 'react-toastify';
import axios from 'axios';
import * as Bd from './SelectedBusiness';

function MoreOptionsSchemeManagement(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = React.useState(false);
  const [openDialogName, setOpenDialog] = React.useState(null);
  const [isStartPrint, setIsStartPrint] = React.useState(false);
  const [printerList, setPrinterList] = React.useState([]);

  const store = useStore();
  const {
    viewOrEditItem,
    deleteSchemeManagementData,
    handleSchemePaymentHistoryModalOpen
  } = store.SchemeManagementStore;
  const { getInvoiceSettings, handleOpenCustomPrintPopUp } =
    store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { receivePaymentOpenForSchemeAndSession } = store.PaymentInStore;
  const { convertSchemeToSale } = store.SalesAddStore;

  const [openPrintSelectionAlert, setPrintSelectionAlert] =
    React.useState(false);

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

  const handleAlertClose = () => {
    setPrintSelectionAlert(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteItem = () => {
    setIsOpenConfirmModal(true);
  };

  const confirmDeleteItem = async (confirm) => {
    if (confirm) {
      await deleteSchemeManagementData(props.item);
      setIsOpenConfirmModal(false);
      setAnchorEl(null);
    }
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
      .get(`${API_SERVER}/pos/v1/download/schemeManagement`, {
        responseType: 'arraybuffer',
        params: {
          businessId: businessId,
          businessCity: businessCity,
          partnerProfileId: partnerProfileId,
          partnerCity: partnerCity,
          invoiceId: props.item.id
        }
      })
      .then((res) => {
        const url = window.URL.createObjectURL(
          new Blob([res.data], { type: 'application/pdf' })
        );
        var link = document.createElement('a');
        link.href = url;
        let fileName = 'Scheme_' + props.item.id + '.pdf';
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

  const openpreview = () => {
    setOpenDialog('preview');
    handleClose();
  };

  const checkForCustomPrintPopUp = () => {
    if (invoiceRegular.showCustomPrintPopUp === true) {
      handleOpenCustomPrintPopUp();
    } else {
      openprint();
    }
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

  const onIsStartPrint = async () => {
    // No Thermal print supported
  };

  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3)
    }
  }))(MuiDialogActions);

  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2)
    }
  }))(MuiDialogContent);

  const closeDialog = () => {
    setOpenDialog(null);
  };

  const getPaidData = () => {
    let amount = 0;
    if (props.item.linkedTxnList && props.item.linkedTxnList.length > 0) {
      for (let p of props.item.linkedTxnList) {
        amount += parseFloat(p.linkedAmount || 0);
      }
    }
    return parseFloat(amount.toFixed(2));
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

          {props.item.schemeOrderType === 'open' &&
            props.item.depositAmount !== getPaidData() && (
              <MenuItem
                key={2}
                onClick={() => receivePaymentOpenForSchemeAndSession(props.item, 'scheme')}
              >
                Receive Payment{' '}
              </MenuItem>
            )}

          <MenuItem
            key={3}
            onClick={() => handleSchemePaymentHistoryModalOpen(props.item)}
          >
            Payment History{' '}
          </MenuItem>
          {props.item.schemeOrderType === 'open' && (
            <MenuItem key={4} onClick={() => deleteItem()}>
              Delete{' '}
            </MenuItem>
          )}
          {props.item.schemeOrderType === 'open' && (
            <MenuItem key={5} onClick={() => convertSchemeToSale(props.item)}>
              {' '}
              Convert To Sale
            </MenuItem>
          )}
          <MenuItem key={6} onClick={downloadPDF}>
            {' '}
            Download PDF
          </MenuItem>
          <MenuItem key={7} onClick={openpreview}>
            {' '}
            Preview
          </MenuItem>
          <MenuItem key={8} onClick={checkForCustomPrintPopUp}>
            Print{' '}
          </MenuItem>
        </Menu>

        {openDialogName === 'preview' ? (
          <OpenPreview
            open={true}
            onClose={closeDialog}
            id={props.id}
            invoiceData={props.item}
            startPrint={isStartPrint}
            screenName="Sales"
            isScheme={true}
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
              isJobWork={false}
              isOrderInvoice={false}
              isScheme={true}
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

export default injectWithObserver(MoreOptionsSchemeManagement);