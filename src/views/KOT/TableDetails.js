import React, { useEffect } from 'react';
import './style.css';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import { useStore } from '../../Mobx/Helpers/UseStore';

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography
} from '@material-ui/core';
import useWindowDimensions from '../../components/windowDimension';
import ProductModal from 'src/components/modal/ProductModal';
import { printKOTThermal } from '../Printers/ComponentsToPrint/printKOTThermalContent';
import { KOTInvoiceThermalPrintContent } from '../Printers/ComponentsToPrint/kotInvoiceThermalPrintContent';
import { Skeleton } from '@material-ui/lab';
import * as deviceIdHelper from '../../components/Helpers/PrintHelper/CloudPrintHelper';
import Loader from 'react-js-loader';
import { getTodayDateInYYYYMMDD } from 'src/components/Helpers/DateHelper';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';

const TableDetails = () => {
  const store = useStore();
  const { height } = useWindowDimensions();
  const { productDialogOpen } = store.ProductStore;
  const {
    editOrAddItems,
    checkOrUncheckOrderItem,
    completeOrder,
    openForNewSale,
    selectAdditionalOrderDataByTable,
    setLastSelectedTableNo,
    setTableDetailLoader,
    handleCloseSequenceNumberFailureAlert,
    cancelKOTData,
    handleOpenKOTCompleteLoadingMessage,
    handleOpenKOTServeLoadingMessage,
    getItemTotalAmount
  } = store.KotStore;

  const {
    orderData,
    items,
    tableDetailsLoader,
    tablePropertiesData,
    saleTxnSettingsData,
    sequenceNumberFailureAlert,
    openKOTCompleteLoadingAlertMessage,
    kotTxnEnableFieldsMap,
    openKOTServeLoadingAlertMessage
  } = toJS(store.KotStore);
  const [openFinishOrderAlert, setOpenFinishOrderAlert] = React.useState(false);
  const { salesInvoiceThermal } = toJS(store.KotStore);
  const [openCancelOrderAlert, setOpenCancelOrderAlert] = React.useState(false);
  const [isPrint, setIsPrint] = React.useState(false);

  const [selectedDate, setSelectedDate] = React.useState(
    orderData.invoice_date || getTodayDateInYYYYMMDD()
  );

  useEffect(() => {
    async function fetchData() {
      const todayDate = getTodayDateInYYYYMMDD();
      // console.log('fetchData is being executed: ' + todayDate);
      setSelectedDate(orderData.invoice_date || todayDate);
    }

    // Call fetchData immediately
    fetchData().then((r) => {});

    // Then call fetchData every 15 seconds
    const intervalId = setInterval(fetchData, 1000 * 15);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setTableDetailLoader(false).then((r) => {});
  }, [tableDetailsLoader, setTableDetailLoader]);

  const checkPrinterAvailable = () => {
    let printerData;
    try {
      printerData = JSON.parse(window.localStorage.getItem('printers'));
    } catch (e) {
      console.error(' Error: ', e.message);
    }
    return printerData;
  };

  const handleFinishOrderAlertClose = () => {
    setOpenFinishOrderAlert(false);
  };

  const handleCancelOrderAlertClose = () => {
    setOpenCancelOrderAlert(false);
  };

  const checkFinishOrder = async (isPrint) => {
    const startTime = performance.now(); // Start timing

    setIsPrint(isPrint);
    let result = items.filter((ele) => ele.served);
    if (result.length === items.length) {
      await handleOpenKOTCompleteLoadingMessage();
      await completeOrder(isPrint);
    } else {
      setOpenFinishOrderAlert(true);
    }

    const endTime = performance.now(); // End timing
    console.log(
      `checkFinishOrder execution time: ${endTime - startTime} milliseconds`
    );
  };

  const onKOTPrintClicked = async () => {
    let cloudPrinterSettings =
      await deviceIdHelper.getCloudPrinterSettingsData();
    if (cloudPrinterSettings.enableMessageSend) {
      await deviceIdHelper.submitPrintCommandToServer(
        orderData.invoice_number,
        'Kot Kitchen'
      );
    }

    if (salesInvoiceThermal.boolDefault) {
      let data = orderData;
      data.items = items;
      const printContent = KOTInvoiceThermalPrintContent(
        salesInvoiceThermal,
        data
      );
      if (salesInvoiceThermal.boolCustomization) {
        printContent.customData = {
          pageSize: salesInvoiceThermal.boolPageSize,
          width: salesInvoiceThermal.customWidth,
          pageWidth: salesInvoiceThermal.pageSizeWidth,
          pageHeight: salesInvoiceThermal.pageSizeHeight,
          margin: salesInvoiceThermal.customMargin
        };
      }
      let copies =
        salesInvoiceThermal.printOriginalCopies > 0
          ? salesInvoiceThermal.printOriginalCopies
          : 1;
      for (let i = 0; i < copies; i++) {
        printKOTThermal(printContent);
      }
    }
  };

  const onKOTFullBillPrintClicked = async () => {
    let cloudPrinterSettings =
      await deviceIdHelper.getCloudPrinterSettingsData();
    if (cloudPrinterSettings.enableMessageSend) {
      await deviceIdHelper.submitPrintCommandToServer(
        orderData.invoice_number,
        'Kot'
      );
    }

    if (salesInvoiceThermal.boolDefault) {
      let data = orderData;
      data.items = items;
      sendContentForThermalPrinter(
        '',
        salesInvoiceThermal,
        data,
        saleTxnSettingsData,
        'Kot'
      );
    }
  };

  return (
    <div>
      {!tableDetailsLoader ? (
        <div>
          {tablePropertiesData.tableDetails ? (
            <div>
              {/* ----------------------------- Div Chairs Button ---------------------------------- */}
              {tablePropertiesData.tableDetails.ordersData &&
                (tablePropertiesData.tableDetails.ordersData.length > 1 ||
                  orderData.chairsAvailableInString) && (
                  <Grid container className="button-container">
                    {tablePropertiesData.tableDetails.ordersData &&
                    tablePropertiesData.tableDetails.ordersData.length > 1
                      ? tablePropertiesData.tableDetails.ordersData.map(
                          (tables, index) => (
                            <Grid
                              item
                              className="alignCenter"
                              style={{ margin: '8px 15px 0px 0px' }}
                            >
                              <Button
                                className="view_ch"
                                style={{
                                  background:
                                    orderData.invoice_number ===
                                      tables.invoice_number ||
                                    (orderData.total_amount === 0 &&
                                      index === 0)
                                      ? tablePropertiesData.tableDetails
                                          .selectedColor
                                      : tablePropertiesData.tableDetails
                                          .detail_background,
                                  color:
                                    orderData.invoice_number ===
                                      tables.invoice_number ||
                                    (orderData.total_amount === 0 &&
                                      index === 0)
                                      ? 'white'
                                      : 'black'
                                }}
                                onClick={() => {
                                  selectAdditionalOrderDataByTable(
                                    tables.invoice_number,
                                    index
                                  ).then((r) => {});
                                }}
                              >
                                View Ch:
                                {tables.chairsUsedInString}
                              </Button>
                            </Grid>
                          )
                        )
                      : null}

                    {orderData.chairsAvailableInString && (
                      <Grid
                        item
                        className="alignCenter"
                        style={{ margin: '8px 15px 0px 0px' }}
                      >
                        <Button
                          className="add_new_table"
                          onClick={() =>
                            openForNewSale(
                              tablePropertiesData.floorDetails,
                              tablePropertiesData.tableDetails,
                              tablePropertiesData.tableIndex
                            )
                          }
                        >
                          Add New :{orderData.chairsAvailableInString}
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                )}

              {/* -------------------------------- Table Details ------------------------------------- */}

              <div>
                <Grid container className="table_detail_container">
                  <Grid item xs={6}>
                    <Typography className="table_detail_text">
                      Customer : {orderData.customer_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} className="alignEnd">
                    <Typography className="table_detail_text">
                      Table no : {orderData.tableNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className="table_detail_text">
                      Waiter : {orderData.waiter_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} className="alignEnd">
                    <Typography className="table_detail_text">
                      Chair no : {orderData.chairsUsedInString}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className="table_detail_text">
                      Date : {selectedDate}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} className="alignEnd">
                    <Typography className="table_detail_text">
                      No of Pax : {orderData.numberOfPax}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}></Grid>
                  {/* <Grid item xs={8} className="alignEnd">
                    <Typography className="table_detail_text">
                      Invoice No : {orderData.invoice_number}
                    </Typography>
                  </Grid> */}
                </Grid>

                {/* ------------------------------------ Product Details -------------------------------------- */}

                <Grid container className="product_header_border">
                  {/*------- Header -------*/}
                  <Grid item xs={6}>
                    {' '}
                    <Typography className="table_detail_text">Item</Typography>
                  </Grid>
                  <Grid item xs={3} className="alignEnd">
                    {' '}
                    <Typography className="table_detail_text">Price</Typography>
                  </Grid>
                  <Grid item xs={3} className="alignEnd">
                    {' '}
                    <Typography className="table_detail_text ">
                      Total
                    </Typography>
                  </Grid>
                </Grid>
                {/* ------ Body ---------*/}
                <div
                  className="marginTop product_list"
                  style={{
                    height: `${
                      checkPrinterAvailable() &&
                      checkPrinterAvailable().length > 0
                        ? orderData.chairsAvailableInString
                          ? height - 485
                          : height - 430
                        : orderData.chairsAvailableInString
                        ? height - 435
                        : height - 380
                    }px`
                  }}
                >
                  {items
                    ? items.map(
                        (ele, index) =>
                          ele.qty > 0 && (
                            <div key={index}>
                              <Grid container className="content_text">
                                <Grid
                                  item
                                  xs={6}
                                  style={{
                                    color: ele.served ? 'black' : '#EF524F',
                                    display: 'flex'
                                  }}
                                >
                                  <Checkbox
                                    className="checkbox_table"
                                    checked={ele.served}
                                    onChange={async () => {
                                      await handleOpenKOTServeLoadingMessage();
                                      await checkOrUncheckOrderItem(ele);
                                    }}
                                  />
                                  <Typography>
                                    {ele.qty} x {ele.item_name}
                                  </Typography>
                                </Grid>
                                <Grid item xs={3} className="alignEnd">
                                  {ele.offer_price
                                    ? parseFloat(ele.offer_price).toFixed(2)
                                    : parseFloat(ele.mrp).toFixed(2)}
                                </Grid>
                                <Grid item xs={3} className="alignEnd">
                                  {getItemTotalAmount(ele)}
                                </Grid>
                              </Grid>
                              {ele.addOnProperties &&
                                ele.addOnProperties.map((data, index) => (
                                  <React.Fragment key={index}>
                                    {index === 0 && (
                                      <span style={{ fontSize: '12px' }}>
                                        {' '}
                                        Add Ons:{' '}
                                      </span>
                                    )}
                                    <span style={{ fontSize: '12px' }}>
                                      {data.name}
                                    </span>
                                    {index < ele.addOnProperties.length - 1 && (
                                      <span> , </span>
                                    )}
                                  </React.Fragment>
                                ))}
                            </div>
                          )
                      )
                    : null}
                </div>
                <div className="footerMrg">
                  <Typography className="table_detail_text">
                    No of Items: {orderData.numberOfItems}
                  </Typography>
                  <div>
                    <Grid container className="product_Total_border">
                      <Grid item xs={6}>
                        {' '}
                        <Typography className="total_txt">Total</Typography>
                      </Grid>
                      <Grid item xs={6} className="alignEnd">
                        <Typography className="total_txt">
                          {parseFloat(orderData.total_amount).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>

              {/* ----------------------------------- Footer --------------------------------------- */}

              <Grid container className="footer_button-container">
                {orderData.numberOfItems > 0 && (
                  <Grid item xs={6} className="alignCenter">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => editOrAddItems()}
                      className="footer_btn text_clr"
                    >
                      Edit KOT
                    </Button>
                  </Grid>
                )}
                {kotTxnEnableFieldsMap.get('enable_bill_cancel') &&
                  orderData.numberOfItems > 0 && (
                    <Grid item xs={6} className="alignCenter">
                      <Button
                        variant="outlined"
                        color="secondary"
                        className="footer_btn outliend_btn"
                        onClick={() => setOpenCancelOrderAlert(true)}
                      >
                        Cancel KOT
                      </Button>
                    </Grid>
                  )}
                {orderData.numberOfItems > 0 &&
                  checkPrinterAvailable() &&
                  checkPrinterAvailable().length > 0 && (
                    <Grid item xs={6} className="alignCenter">
                      <Button
                        variant="outlined"
                        color="secondary"
                        className="footer_btn outliend_btn"
                        onClick={() => onKOTPrintClicked()}
                      >
                        Print KOT
                      </Button>
                    </Grid>
                  )}
                {kotTxnEnableFieldsMap.get('enable_bill_full_bill_print') &&
                  orderData.numberOfItems > 0 &&
                  checkPrinterAvailable() &&
                  checkPrinterAvailable().length > 0 && (
                    <Grid item xs={6} className="alignCenter">
                      <Button
                        variant="outlined"
                        color="secondary"
                        className="footer_btn outliend_btn"
                        onClick={() => onKOTFullBillPrintClicked()}
                      >
                        Print KOT Full Bill
                      </Button>
                    </Grid>
                  )}
                {kotTxnEnableFieldsMap.get('enable_bill_finish') &&
                  orderData.numberOfItems > 0 && (
                    <Grid item xs={6} className="alignCenter">
                      <Button
                        variant="outlined"
                        color="secondary"
                        className="footer_btn outliend_btn"
                        onClick={() => checkFinishOrder(false)}
                      >
                        Finish
                      </Button>
                    </Grid>
                  )}
                {kotTxnEnableFieldsMap.get('enable_bill_finish_print') &&
                  orderData.numberOfItems > 0 &&
                  checkPrinterAvailable() &&
                  checkPrinterAvailable().length > 0 && (
                    <Grid item xs={6} className="alignCenter">
                      <Button
                        variant="outlined"
                        color="secondary"
                        className="footer_btn outliend_btn"
                        onClick={() => checkFinishOrder(true)}
                      >
                        Finish & Print
                      </Button>
                    </Grid>
                  )}
              </Grid>
            </div>
          ) : (
            <div style={{ height: height - 64, position: 'relative' }}>
              <Typography className="no_occupied">
                No Tables are Selected
              </Typography>
            </div>
          )}
        </div>
      ) : (
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <div style={{ marginTop: '10px', marginBottom: '20px' }}>
            <Grid container>
              <Grid item xs={6}>
                <Skeleton animation="wave" style={{ width: '90%' }} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton animation="wave" style={{ width: '100%' }} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton animation="wave" style={{ width: '90%' }} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton animation="wave" style={{ width: '100%' }} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton animation="wave" style={{ width: '90%' }} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton animation="wave" style={{ width: '100%' }} />
              </Grid>
            </Grid>
          </div>
          <div style={{ marginTop: '50px', marginBottom: '20px' }}>
            <Skeleton animation="wave" style={{ width: '100%' }} />
            <Skeleton animation="wave" style={{ width: '100%' }} />
            <Skeleton animation="wave" style={{ width: '100%' }} />
            <Skeleton animation="wave" style={{ width: '100%' }} />
            <Skeleton animation="wave" style={{ width: '100%' }} />
            <Skeleton animation="wave" style={{ width: '100%' }} />
            <Skeleton animation="wave" style={{ width: '100%' }} />
            <Skeleton animation="wave" style={{ width: '100%' }} />
            <Skeleton animation="wave" style={{ width: '100%' }} />
            <Skeleton animation="wave" style={{ width: '100%' }} />
            <Skeleton animation="wave" style={{ width: '100%' }} />
            <Skeleton animation="wave" style={{ width: '100%' }} />
            <Skeleton animation="wave" style={{ width: '100%' }} />
          </div>
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <Grid container>
              <Grid item xs={6}>
                <Skeleton animation="wave" style={{ width: '90%' }} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton animation="wave" style={{ width: '100%' }} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton animation="wave" style={{ width: '90%' }} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton animation="wave" style={{ width: '100%' }} />
              </Grid>
            </Grid>
          </div>
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <Grid container>
              <Grid item xs={6}>
                <Skeleton animation="wave" style={{ width: '90%' }} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton animation="wave" style={{ width: '100%' }} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton animation="wave" style={{ width: '90%' }} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton animation="wave" style={{ width: '100%' }} />
              </Grid>
            </Grid>
          </div>
        </div>
      )}
      {productDialogOpen ? <ProductModal /> : null}

      <Dialog
        open={openFinishOrderAlert}
        onClose={handleFinishOrderAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>
          <Typography variant="h4"> Alert!</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Few Items are yet to be Served, Do you Want to Complete Anyways?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleFinishOrderAlertClose}
            color="primary"
            autoFocus
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleOpenKOTCompleteLoadingMessage().then((r) => {});
              setLastSelectedTableNo(
                tablePropertiesData.tableDetails.tableId
              ).then((r) => {});
              handleFinishOrderAlertClose();
              completeOrder(isPrint).then((r) => {});
            }}
            color="primary"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openCancelOrderAlert}
        onClose={handleCancelOrderAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>
          <Typography variant="h4"> Alert!</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelOrderAlertClose}
            color="primary"
            autoFocus
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleCancelOrderAlertClose();
              cancelKOTData().then((r) => {});
            }}
            color="primary"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={sequenceNumberFailureAlert}
        onClose={handleCloseSequenceNumberFailureAlert}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            We are unable to reach our Server to get next sequence No. Please
            try again!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseSequenceNumberFailureAlert}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openKOTCompleteLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while the Invoice is being created!!!</p>
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
        open={openKOTServeLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>
                  Please wait while the item is marked as Served/Not served!!!
                </p>
              </div>
              <div>
                <br />
                <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InjectObserver(TableDetails);