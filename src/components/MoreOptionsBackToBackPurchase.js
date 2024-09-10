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
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import * as Bd from './SelectedBusiness';
import * as Db from 'src/RxDb/Database/Database';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';

function MoreOptionsBackToBackPurchase(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialogName, setOpenDialog] = React.useState(null);
  const [isStartPrint, setIsStartPrint] = React.useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = React.useState(false);

  const store = useStore();
  const { getInvoiceSettings, handleOpenCustomPrintPopUp } =
    store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const {
    viewOrEditBackToBackPurchaseTxnItem,
    deleteBackToBackPurchaseTxnItem
  } = store.BackToBackPurchaseStore;

  const { raiseExpenseForProcurement, viewOrEditExpenseItem } =
    store.ExpensesStore;

  const [printerList, setPrinterList] = React.useState([]);
  const [openPrintSelectionAlert, setPrintSelectionAlert] =
    React.useState(false);

  const { getPurchaseTransSettingdetails } = store.PurchaseTransSettingsStore;

  const { purchaseTransSettingData } = toJS(store.PurchaseTransSettingsStore);
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
    getPurchaseTransSettingdetails();
  }, [getPurchaseTransSettingdetails]);

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
    // console.log('Thermal Printer is selected: ', invoiceThermal.boolDefault);
    if (!invoiceThermal.boolDefault) {
      setIsStartPrint(true);
      setPrintSelectionAlert(true);
      setTimeout(() => {
        handleAlertClose();
      }, 500);
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
      purchaseTransSettingData,
      'Back To Back Purchase'
    );
  };

  const deleteItem = () => {
    setIsOpenConfirmModal(true);
  };

  const confirmDeleteItem = (confirm) => {
    if (confirm) {
      deleteBackToBackPurchaseTxnItem(props.item);
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
      .get(`${API_SERVER}/pos/v1/download/backToBackPurchase`, {
        responseType: 'arraybuffer',
        params: {
          businessId: businessId,
          businessCity: businessCity,
          partnerProfileId: partnerProfileId,
          partnerCity: partnerCity,
          invoiceId: props.item.backToBackPurchaseNumber
        }
      })
      .then((res) => {
        const url = window.URL.createObjectURL(
          new Blob([res.data], { type: 'application/pdf' })
        );
        var link = document.createElement('a');
        link.href = url;
        let fileName =
          'Procurement_' + props.item.backToBackPurchaseNumber + '.pdf';
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

  const raiseExpense = async (item) => {
    const vendorAddnDetails = await getVendorDataOnConvertion(
      item.transporterVendorId
    );

    const vendor = {
      vendor_id: item.transporterVendorId,
      vendor_name: item.transporterVendorName,
      vendor_gst_number: item.transporterVendorGstNumber,
      vendor_gst_type: item.transporterVendorGstType,
      vendor_phone_number: item.transporterVendorPhoneNumber,
      vendorCity: item.transporterVendorCity,
      vendorPincode: item.transporterVendorPincode,
      vendorAddress: item.transporterVendorAddress,
      vendorState: item.transporterVendorState,
      vendorCountry: item.transporterVendorCountry,
      vendor_email_id: item.transporterVendorEmailId,
      vendorPanNumber: item.transporterVendorPanNumber,
      tdsName: vendorAddnDetails.tdsName,
      tdsRate: vendorAddnDetails.tdsRate,
      tdsCode: vendorAddnDetails.tdsCode
    };

    raiseExpenseForProcurement(
      vendor,
      'Freit Charge for ' + item.lrNumber,
      item.freightCharge,
      item.backToBackPurchaseNumber
    );
  };

  const getVendorDataOnConvertion = async (partyId) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let tradeName = '';
    let legalName = '';
    let registrationNumber = '';
    let panNumber = '';
    let tcsName = '';
    let tcsRate = 0;
    let tcsCode = '';
    let tdsName = '';
    let tdsRate = 0;
    let tdsCode = '';
    let aadharNumber = '';

    if (partyId) {
      await db.parties
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { id: { $eq: partyId } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          tradeName = data.tradeName;
          legalName = data.legalName;
          registrationNumber = data.registrationNumber;
          panNumber = data.panNumber;
          tcsName = data.tcsName;
          tcsRate = data.tcsRate;
          tcsCode = data.tcsCode;
          tdsName = data.tdsName;
          tdsRate = data.tdsRate;
          tdsCode = data.tdsCode;
          aadharNumber = data.aadharNumber;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    }

    var data = {
      tradeName: tradeName,
      legalName: legalName,
      registrationNumber: registrationNumber,
      panNumber: panNumber,
      tcsName: tcsName,
      tcsRate: tcsRate,
      tcsCode: tcsCode,
      tdsName: tdsName,
      tdsRate: tdsRate,
      tdsCode: tdsCode,
      aadharNumber: aadharNumber
    };

    return data;
  };

  const viewFreightChargeExpense = async (item) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.expenses.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { expenseId: { $eq: item.expenseIdForFreightCharge } }
        ]
      }
    });
    query
      .exec()
      .then(async (data) => {
        if (!data) {
          // No Sales data is not found so cannot update any information
          return;
        }

        let clone = JSON.parse(JSON.stringify(data));
        viewOrEditExpenseItem(clone);
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
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
          <MenuItem
            key={1}
            onClick={() => viewOrEditBackToBackPurchaseTxnItem(props.item)}
          >
            View/Edit{' '}
          </MenuItem>
          {localStorage.getItem('isAdmin') === 'true' && (
            <MenuItem key={2} onClick={() => deleteItem()}>
              {' '}
              Delete
            </MenuItem>
          )}
          {props.item.expenseIdForFreightCharge === '' ||
          props.item.expenseIdForFreightCharge === null ? (
            <MenuItem key={3} onClick={() => raiseExpense(props.item)}>
              Raise Freight Expense{' '}
            </MenuItem>
          ) : (
            <MenuItem
              key={3}
              onClick={() => viewFreightChargeExpense(props.item)}
            >
              View Freight Expense{' '}
            </MenuItem>
          )}

          <MenuItem key={4} onClick={downloadPDF}>
            {' '}
            Download PDF
          </MenuItem>

          <MenuItem key={5} onClick={openpreview}>
            {' '}
            Preview
          </MenuItem>

          <MenuItem key={6} onClick={checkForCustomPrintPopUp}>
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
            txnSettings={purchaseTransSettingData}
            screenName="Back To Back Purchase"
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

export default injectWithObserver(MoreOptionsBackToBackPurchase);