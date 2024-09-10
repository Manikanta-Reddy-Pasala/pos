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
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import * as Bd from './SelectedBusiness';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';
import {
  getPartyDataById,
  updateParty
} from 'src/components/Helpers/dbQueries/parties';

function MoreOptionsSaleOrder(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialogName, setOpenDialog] = React.useState(null);
  const [isStartPrint, setIsStartPrint] = React.useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = React.useState(false);

  const store = useStore();
  const { getInvoiceSettings, handleOpenCustomPrintPopUp } =
    store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { viewOrEditItem, deleteSaleItem, duplicate } = store.SaleOrderStore;
  const { convertSaleOrderToSale } = store.SalesAddStore;

  const { getSaleOrderTransSettingdetails } =
    store.SaleOrderTransactionSettingsStore;

  const { saleOrderTransSettingData } = toJS(
    store.SaleOrderTransactionSettingsStore
  );
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

  const [printerList, setPrinterList] = React.useState([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openPrintSelectionAlert, setPrintSelectionAlert] =
    React.useState(false);
  const [emailId, setEmailId] = useState('');
  const [emailEmpty, setEmailEmpty] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = useState(false);

  const handleErrorAlertMessageClose = () => {
    setErrorAlertMessage(false);
    setErrorMessage('');
  };

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
    getSaleOrderTransSettingdetails();
  }, [getSaleOrderTransSettingdetails]);

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
      popupcloseinterval = 3000;
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
      saleOrderTransSettingData,
      'Sales Order'
    );
  };

  const deleteItem = () => {
    setIsOpenConfirmModal(true);
  };

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
      invoiceId: props.item.sale_order_invoice_number,
      invoiceType: 'Sale Order'
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

  const confirmDeleteItem = (confirm) => {
    if (confirm) {
      deleteSaleItem(props.item);
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
      .get(`${API_SERVER}/pos/v1/download/saleOrder`, {
        responseType: 'arraybuffer',
        params: {
          businessId: businessId,
          businessCity: businessCity,
          partnerProfileId: partnerProfileId,
          partnerCity: partnerCity,
          invoiceId: props.item.sale_order_invoice_number
        }
      })
      .then((res) => {
        const url = window.URL.createObjectURL(
          new Blob([res.data], { type: 'application/pdf' })
        );
        var link = document.createElement('a');
        link.href = url;
        let fileName =
          'Sale_Order_' + props.item.sale_order_invoice_number + '.pdf';
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
          {props.item.saleOrderType === 'open' ? (
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
          {props.item.saleOrderType === 'open' && (
            <MenuItem
              key={4}
              onClick={() => convertSaleOrderToSale(props.item)}
            >
              {' '}
              Convert To Sale
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

          <MenuItem key={8} onClick={() => handleEmailInitiation()}>
            E-Mail{' '}
          </MenuItem>
        </Menu>

        {openDialogName === 'preview' ? (
          <OpenPreview
            open={openDialogName === 'preview'}
            onClose={closeDialog}
            id={props.id}
            invoiceData={props.item}
            startPrint={isStartPrint}
            txnSettings={saleOrderTransSettingData}
            screenName="Sales Order"
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

export default injectWithObserver(MoreOptionsSaleOrder);