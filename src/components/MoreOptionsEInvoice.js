import {
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Dialog
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React, { useState } from 'react';
import EwayCompToPrint from 'src/views/Printers/ComponentsToPrint/EwayPrint/EwayCompToPrint';
import ComponentToPrint from '../views/Printers/ComponentsToPrint/index';
import { toJS } from 'mobx';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import * as einvoice from '../components/Helpers/EinvoiceAPIHelper';
import axios from 'axios';
import * as Bd from './SelectedBusiness';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OpenPreview from './OpenPreview';
import Loader from 'react-js-loader';

function Moreoptions(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialogName, setOpenDialog] = React.useState(null);
  const store = useStore();
  const { viewOrEditItem, updateEinvoiceDataToSales } = store.SalesAddStore;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = useState(false);
  const [openEwayPrintSelectionAlert, setEwayPrintSelectionAlert] =
    React.useState(false);
  const [isStartPrint, setIsStartPrint] = React.useState(false);
  const [isStartEwayPrint, setIsStartEwayPrint] = React.useState(false);
  const [openPrintSelectionAlert, setPrintSelectionAlert] =
    React.useState(false);
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);

  const [openLoadingAlert, setOpenLoadingAlert] = useState(false);

  const handleOpenLoadingAlertClose = () => {
    setOpenLoadingAlert(false);
  };

  const handleEwayAlertClose = () => {
    setEwayPrintSelectionAlert(false);
  };

  const handleErrorAlertMessageClose = () => {
    setErrorAlertMessage(false);
    setErrorMessage('');
  };

  const handleOpenEditDetails = () => {
    if ('Invoice' === props.type) {
      viewOrEditItem(props.item);
    }
  };

  const handlePushEInvoice = async () => {
    if ('Invoice' === props.type) {
      const response = await einvoice.createEinvoice(props.item);

      if (response.success) {
        await updateEinvoiceDataToSales(props.item, response);
        setTimeout(() => {
          handleOpenLoadingAlertClose();
          setErrorMessage('E-Invoice is created successfully!!');
        }, 4000);
      } else {
        handleOpenLoadingAlertClose();
        setErrorMessage(response.errorMessage);
      }
      setErrorAlertMessage(true);
    }
  };

  const handleCancelEInvoice = async () => {
    if ('Invoice' === props.type) {
      const response = await einvoice.cancelEinvoice(props.item);

      if (response.success) {
        setErrorMessage('E-Invoice is cancelled successfully!!');
      } else {
        setErrorMessage(response.errorMessage);
      }

      setErrorAlertMessage(true);
    }
  };

  const handleCancelEway = async () => {
    if ('Invoice' === props.type) {
      const response = await einvoice.cancelEway(props.item);

      if (response.success) {
        setErrorMessage('E-Way is cancelled successfully!!');
      } else {
        setErrorMessage(response.errorMessage);
      }

      setErrorAlertMessage(true);
    }
  };

  const handlePushEWay = async () => {
    if ('Invoice' === props.type) {
      const response = await einvoice.createEinvoicewithEway(props.item);

      if (response.success) {
        setErrorMessage('E-Way is created successfully!!');
      } else {
        setErrorMessage(response.errorMessage);
      }

      setErrorAlertMessage(true);
    }
  };

  const closeDialog = () => {
    setOpenDialog(null);
  };

  const downloadEwayPDF = async () => {
    toast.info('Downloading Please Wait...', {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: true
    });

    const API_SERVER = window.REACT_APP_API_SERVER;

    const businessData = await Bd.getBusinessData();
    const businessId = businessData.businessId;
    const businessCity = businessData.businessCity;
    const eWayBillNo = props.item.ewayBillNo;
    let type = '';
    if ('Invoice' === props.type) {
      type = 'INV';
    }

    // console.log(props);
    await axios
      .get(`${API_SERVER}/pos/v1/business/invoice/eway/download`, {
        responseType: 'arraybuffer',
        params: {
          businessId: businessId,
          businessCity: businessCity,
          eWayBillNo: eWayBillNo,
          type: type
        }
      })
      .then((res) => {
        const url = window.URL.createObjectURL(
          new Blob([res.data], { type: 'application/pdf' })
        );
        var link = document.createElement('a');
        link.href = url;
        let fileName = 'Eway_' + props.item.ewayBillNo + '.pdf';
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
        console.log(err.response.data);
        throw err;
      });
  };

  const downloadSalesPDF = async () => {
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

  const openSalesPreview = () => {
    setIsStartPrint(false);
    setOpenDialog('previewSales');
    handleClose();
  };

  const handleAlertClose = () => {
    setPrintSelectionAlert(false);
  };

  const openSalesPrint = () => {
    /* console.log('Thermal Printer is selected: ', invoiceThermal.boolDefault);
    if (!invoiceThermal.boolDefault) {
      setIsStartPrint(true);
      setPrintSelectionAlert(true);
      setTimeout(() => {
        handleAlertClose();
      }, 500);
    } else {
      onIsStartPrint();
    }
    handleClose(); */
    if (!invoiceThermal.boolDefault) {
      console.log('Inside Invoice Thermal');
      setIsStartPrint(true);
      setOpenDialog('printSales');
      setPrintSelectionAlert(true);
    }
    handleClose();
  };

  const previewEway = () => {
    setEwayPrintSelectionAlert(true);
    setIsStartEwayPrint(false);
    setOpenDialog('preview');
    handleClose();
  };

  const printEway = () => {
    /* setEwayPrintSelectionAlert(true); */
    setIsStartEwayPrint(true);
    setOpenDialog('printEway');
    handleClose();
    /* alert('Print E-way'); */
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isEInvoiceGeneratePossible = () => {
    let planName = localStorage.getItem('planName');

    if ('Starter' === planName) {
      setErrorMessage(
        'Please upgrade your plan to proceed with E-Invoice generation'
      );
      setErrorAlertMessage(true);

      return;
    }

    let invoiceDetails = props.item;

    if (invoiceDetails.customer_id === '') {
      setErrorMessage(
        'Please provide Buyer details to proceed with E-Invoice generation'
      );
      setErrorAlertMessage(true);
    } else if (invoiceDetails.item_list.length === 0) {
      setErrorMessage(
        'Please add atleast one product to proceed with E-Invoice generation'
      );
      setErrorAlertMessage(true);
    } else {
      handlePushEInvoice();
    }
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreVert fontSize="inherit" />
      </IconButton>

      <Menu
        id="moremenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {('Pending' === props.item.einvoiceBillStatus ||
          'Failed' === props.item.einvoiceBillStatus) && (
          <>
            <MenuItem key={1} onClick={() => handleOpenEditDetails()}>
              Edit Details{' '}
            </MenuItem>

            <MenuItem key={2} onClick={() => isEInvoiceGeneratePossible()}>
              Push E-Invoice{' '}
            </MenuItem>
          </>
        )}
        {'Completed' === props.item.einvoiceBillStatus && (
          <>
            {props.item.einvoiceDetails &&
            props.item.einvoiceDetails.ewbDtls ? (
              <>
                {'Cancelled' === props.item.ewayBillStatus ? (
                  <></>
                ) : (
                  <MenuItem key={3} onClick={() => handleCancelEway()}>
                    Cancel E-Way{' '}
                  </MenuItem>
                )}
              </>
            ) : (
              <>
                <MenuItem key={4} onClick={() => handleOpenEditDetails()}>
                  Edit Details{' '}
                </MenuItem>
                <MenuItem key={5} onClick={() => handlePushEWay()}>
                  Generate E-Way{' '}
                </MenuItem>
              </>
            )}
          </>
        )}

        {'Completed' === props.item.einvoiceBillStatus && (
          <>
            <MenuItem key={6} onClick={() => handleCancelEInvoice()}>
              Cancel E-Invoice{' '}
            </MenuItem>
            <MenuItem key={7} onClick={downloadSalesPDF}>
              {' '}
              Download PDF
            </MenuItem>
            <MenuItem key={8} onClick={openSalesPreview}>
              {' '}
              Preview
            </MenuItem>
            <MenuItem key={9} onClick={openSalesPrint}>
              Print{' '}
            </MenuItem>
          </>
        )}

        {'Generated' === props.item.ewayBillStatus && (
          <>
            <MenuItem key={10} onClick={downloadEwayPDF}>
              Download E-Way PDF{' '}
            </MenuItem>
            <MenuItem key={11} onClick={previewEway}>
              Preview E-Way{' '}
            </MenuItem>
            <MenuItem key={12} onClick={printEway}>
              Print E-Way{' '}
            </MenuItem>
          </>
        )}
      </Menu>

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

      <Dialog
        fullScreen={fullScreen}
        open={openEwayPrintSelectionAlert}
        onClose={handleEwayAlertClose}
        aria-labelledby="responsive-dialog-title"
        /* style={{ display: 'none' }} */
      >
        <DialogContent>
          <DialogContentText>
            <EwayCompToPrint
              data={props.item}
              printMe={isStartEwayPrint}
              isThermal={invoiceThermal.boolDefault}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={printEway} color="secondary" variant="outlined">
            PRINT
          </Button>
          <Button
            onClick={handleEwayAlertClose}
            color="secondary"
            variant="outlined"
          >
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>

      {openDialogName === 'printEway' ? (
        <EwayCompToPrint
          data={props.item}
          printMe={isStartEwayPrint}
          isThermal={invoiceThermal.boolDefault}
        />
      ) : (
        ''
      )}

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
        fullScreen={fullScreen}
        open={openLoadingAlert}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while the E-Invoice is being created!!!</p>
              </div>
              <div>
                <br />
                <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {openDialogName === 'previewSales' ? (
        <OpenPreview
          open={true}
          onClose={closeDialog}
          id={props.id}
          invoiceData={props.item}
          startPrint={isStartPrint}
        />
      ) : (
        ''
      )}
    </div>
  );
}

export default injectWithObserver(Moreoptions);