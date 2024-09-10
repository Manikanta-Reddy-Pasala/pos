import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React, { useEffect } from 'react';
import OpenPreview from './OpenPreview';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import ConfirmModal from './modal/ConfirmModal';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { toJS } from 'mobx';
import ComponentToPrint from '../views/Printers/ComponentsToPrint/index';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import * as Bd from './SelectedBusiness';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';

function Moreoptions(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialogName, setOpenDialog] = React.useState(null);
  const [isStartPrint, setIsStartPrint] = React.useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = React.useState(false);

  const [openPrintSelectionAlert, setPrintSelectionAlert] =
    React.useState(false);
  const [printerList, setPrinterList] = React.useState([]);

  const store = useStore();
  const { viewOrEditItem, deleteApproval } = store.ApprovalsStore;

  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { getInvoiceSettings, handleOpenCustomPrintPopUp } =
    store.PrinterSettingsStore;

  const { getApprovalTransSettingdetails } =
    store.ApprovalTransactionSettingsStore;

  const { approvalTransSettingData } = toJS(
    store.ApprovalTransactionSettingsStore
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
  }, []);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    getApprovalTransSettingdetails();
  }, [getApprovalTransSettingdetails]);

  const handleAlertClose = () => {
    setPrintSelectionAlert(false);
  };

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

  const onIsStartPrint = () => {
    sendContentForThermalPrinter(
      '',
      invoiceThermal,
      props.item,
      approvalTransSettingData,
      'Approval'
    );
  };

  const closeDialog = () => {
    setOpenDialog(null);
  };

  const deleteItem = () => {
    setIsOpenConfirmModal(true);
  };

  const confirmDeleteItem = (confirm) => {
    if (confirm) {
      deleteApproval(props.item);
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
      .get(`${API_SERVER}/pos/v1/download/approval`, {
        responseType: 'arraybuffer',
        params: {
          businessId: businessId,
          businessCity: businessCity,
          partnerProfileId: partnerProfileId,
          partnerCity: partnerCity,
          invoiceId: props.item.approvalNumber
        }
      })
      .then((res) => {
        const url = window.URL.createObjectURL(
          new Blob([res.data], { type: 'application/pdf' })
        );
        var link = document.createElement('a');
        link.href = url;
        let fileName = 'Approval_' + props.item.approvalNumber + '.pdf';
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
          <MenuItem key={1} onClick={() => viewOrEditItem(props.item)}>
            View/Edit{' '}
          </MenuItem>
          {localStorage.getItem('isAdmin') === 'true' && (
            <MenuItem key={2} onClick={() => deleteItem(props.item)}>
              Delete{' '}
            </MenuItem>
          )}
          <MenuItem key={3} onClick={downloadPDF}>
            {' '}
            Download PDF
          </MenuItem>
          <MenuItem key={4} onClick={openpreview}>
            {' '}
            Preview
          </MenuItem>
          <MenuItem key={5} onClick={checkForCustomPrintPopUp}>
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
            txnSettings={approvalTransSettingData}
            screenName="Approval"
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
              customPrintOptions={customPrintOptions}
              isThermal={invoiceThermal.boolDefault}
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

export default injectWithObserver(Moreoptions);