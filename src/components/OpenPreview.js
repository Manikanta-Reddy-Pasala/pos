import React, { useState, useEffect } from 'react';
import { View } from '@react-pdf/renderer';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { useStore } from '../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import ComponentToPrint from '../views/Printers/ComponentsToPrint/index';
import DialogContentText from '@material-ui/core/DialogContentText';
import CustomPrintPopUp from 'src/views/Printers/Invoice/CustomPrintPopUp';
import CustomPreviewPrintPopUp from 'src/views/Printers/Invoice/CustomPreviewPrintPopUp';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  buttonProgress: {
    color: '#ff7961',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h4">{children}</Typography>
      {/* {onClose ? ( */}
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
      {/* ) : null} */}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

export default function OpenPreview({
  open,
  onClose,
  id,
  invoiceData,
  startPrint,
  isJobWork,
  isOrderInvoice,
  txnSettings,
  screenName,
  isEWayPrint,
  isScheme,
  isSession,
  isPackagePreivew
}) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [openDialogName, setOpenDialog] = React.useState(null);
  const [isStartPrint, setIsStartPrint] = React.useState(false);

  const store = useStore();
  const { getInvoiceSettings, handleOpenCustomPreviewPrintPopUp } =
    store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal, openCustomPreviewPrintPopUp } = toJS(
    store.PrinterSettingsStore
  );
  const { resetPrintData } = store.SalesAddStore;
  const { resetSaleReturnPrintData } = store.ReturnsAddStore;
  const { resetApprovalPrintData } = store.ApprovalsStore;
  const { resetPaymentInPrintData } = store.PaymentInStore;
  const { resetPaymentOutPrintData } = store.PaymentOutStore;
  const { resetSaleQuotationPrintData } = store.SalesQuotationAddStore;
  const { resetSaleOrderPrintData } = store.SaleOrderStore;
  const { resetDCPrintData } = store.DeliveryChallanStore;
  const { resetPurchaseReturnPrintData } = store.PurchasesReturnsAddStore;
  const { resetPurchaseOrderPrintData } = store.PurchaseOrderStore;
  const { resetJobWorkOutPrintData } = store.JobWorkStore;
  const { resetJobWorkReceiptPrintData } = store.JobWorkReceiptStore;
  const { resetJobWorkInPrintData } = store.JobWorkInStore;
  const { resetEWayPrintData } = store.EWayStore;
  const { resetBackToBackPurchasePrintData } = store.BackToBackPurchaseStore;
  const [customPrintOptions, SetCustomPrintOptions] = useState({
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

  const [isThermal, setIsThermal] = React.useState(false);
  const [printerList, setPrinterList] = React.useState([]);

  useEffect(() => {
    if (!open) {
      handleOpenCustomPreviewPrintPopUp();
    }

    getInvoiceSettings(localStorage.getItem('businessId'));

    let printerData;
    try {
      printerData = JSON.parse(window.localStorage.getItem('printers'));
      setPrinterList(printerData);
    } catch (e) {
      console.error(' Error: ', e.message);
    }
  }, []);

  const checkForCustomPrintPopUp = () => {
    if (invoiceRegular.showCustomPrintPopUp === true) {
      handleOpenCustomPreviewPrintPopUp();
    } else {
      openprint();
    }
  };

  const openprint = () => {
    if (!invoiceThermal.boolDefault) {
      setIsStartPrint(true);
      setOpenDialog('print');

      setTimeout(() => {
        setIsStartPrint(false);
        onClose();
        if (
          invoiceData.estimateType === 'open' ||
          invoiceData.estimateType === 'close'
        ) {
          resetSaleQuotationPrintData();
        } else if (isEWayPrint) {
          resetEWayPrintData();
        } else if (invoiceData.sale_order_invoice_number) {
          resetSaleOrderPrintData();
        } else if (invoiceData.delivery_challan_invoice_number) {
          resetDCPrintData();
        } else if (invoiceData.job_work_in_invoice_number) {
          resetJobWorkInPrintData();
        } else if (invoiceData.sales_return_number) {
          resetSaleReturnPrintData();
        } else if (invoiceData.purchase_return_number) {
          resetPurchaseReturnPrintData();
        } else if (invoiceData.approvalNumber) {
          resetApprovalPrintData();
        } else if (invoiceData.purchase_order_invoice_number) {
          resetPurchaseOrderPrintData();
        } else if (invoiceData.sequenceNumber) {
          resetPrintData();
        } else if (invoiceData.receiptSequenceNumber) {
          resetJobWorkReceiptPrintData();
        } else if (invoiceData.invoiceSequenceNumber) {
          resetJobWorkOutPrintData();
        } else if (invoiceData.receiptNumber) {
          resetPaymentInPrintData();
          resetPaymentOutPrintData();
        } else if (invoiceData.backToBackPurchaseNumber) {
          resetBackToBackPurchasePrintData();
        }
      }, 3000);
    } else {
      onIsStartPrint();
    }
  };

  const onIsStartPrint = () => {
    sendContentForThermalPrinter(
      '',
      invoiceThermal,
      invoiceData,
      txnSettings,
      screenName
    );
  };

  const closeDialog = () => {
    onClose();
    if (
      invoiceData.estimateType === 'open' ||
      invoiceData.estimateType === 'close'
    ) {
      resetSaleQuotationPrintData();
    } else if (isEWayPrint) {
      resetEWayPrintData();
    } else if (invoiceData.sale_order_invoice_number) {
      resetSaleOrderPrintData();
    } else if (invoiceData.delivery_challan_invoice_number) {
      resetDCPrintData();
    } else if (invoiceData.job_work_in_invoice_number) {
      resetJobWorkInPrintData();
    } else if (invoiceData.sales_return_number) {
      resetSaleReturnPrintData();
    } else if (invoiceData.purchase_return_number) {
      resetPurchaseReturnPrintData();
    } else if (invoiceData.approvalNumber) {
      resetApprovalPrintData();
    } else if (invoiceData.purchase_order_invoice_number) {
      resetPurchaseOrderPrintData();
    } else if (invoiceData.sequenceNumber) {
      resetPrintData();
    } else if (invoiceData.receiptSequenceNumber) {
      resetJobWorkReceiptPrintData();
    } else if (invoiceData.invoiceSequenceNumber) {
      resetJobWorkOutPrintData();
    } else if (invoiceData.backToBackPurchaseNumber) {
      resetBackToBackPurchasePrintData();
    } else if (invoiceData.receiptNumber) {
      resetPaymentInPrintData();
      resetPaymentOutPrintData();
    }
  };
  const receiveDataFromPrintPopup = (data) => {
    SetCustomPrintOptions(data);
    openprint();
    console.log('JSON data', customPrintOptions);
  };

  return (
    <div>
      <Dialog
        fullWidth={isThermal ? '' : fullWidth}
        // maxWidth={isThermal?'xs':maxWidth}
        contentStyle={{ width: isThermal ? 'auto' : '50%', maxHeight: '80%' }}
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={onClose}>
          Preview
        </DialogTitle>
        <DialogContent dividers>
          <View>
            {invoiceData ? (
              <ComponentToPrint
                data={invoiceData}
                customPrintOptions={customPrintOptions}
                printMe={false}
                isThermal={false}
                isJobWork={isJobWork}
                isOrderInvoice={isOrderInvoice}
                isScheme={isScheme}
                isSession={isSession}
                isPackagePreivew={isPackagePreivew}
              />
            ) : (
              ''
            )}
          </View>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              checkForCustomPrintPopUp();
            }}
            color="secondary"
            variant="outlined"
          >
            PRINT
          </Button>
          <Button
            onClick={() => {
              closeDialog();
            }}
            color="secondary"
            variant="outlined"
          >
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialogName === 'print'}
        aria-labelledby="responsive-dialog-title"
        style={{ display: 'none' }}
      >
        <DialogContent>
          <DialogContentText>
            <ComponentToPrint
              data={invoiceData}
              customPrintOptions={customPrintOptions}
              printMe={isStartPrint}
              isThermal={invoiceThermal.boolDefault}
              isJobWork={isJobWork}
              isOrderInvoice={isOrderInvoice}
              isScheme={isScheme}
              isSession={isSession}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      {openCustomPreviewPrintPopUp ? (
        <CustomPreviewPrintPopUp
          isComingFromPrint={false}
          sendDataToPrintPopup={receiveDataFromPrintPopup}
        />
      ) : null}
    </div>
  );
}
