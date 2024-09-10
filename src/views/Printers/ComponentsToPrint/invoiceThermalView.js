import React, { Fragment } from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { inWords } from '../../../components/NumbertoWord';
import { Box } from '@material-ui/core';
import QRCode from 'react-qr-code';
const numberToText = require('number-to-text');
require('number-to-text/converters/en-us'); // load converter

let isTemple = localStorage.getItem('isTemple')
  ? localStorage.getItem('isTemple') === 'true'
  : false;

const styles = (theme) => ({
  flex: {
    display: 'flex'
  },
  center: {
    alignSelf: 'center',
    textAlign: 'center'
  },
  alignRight: {
    textAlign: 'right'
  },
  paperBox: {
    fontSize: '9px',
    height: '200px',
    padding: '6px',
    width: '200px',
    wordBreak: 'break-word'
  },
  p: {
    fontWeight: 'bold'
  },
  cardCol1: {
    width: '5%'
  },
  cardCol2: {
    width: '32%'
  },
  cardColOther: {
    width: '12%',
    textAlign: 'right'
  },
  cardColFlex: {
    flex: 1,
    wordBreak: 'keep-all'
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  cardCol40percent: {
    width: '40%'
  },
  strong: {
    fontWeight: 600
  },
  separator: {
    height: '5px',
    width: '100%'
  },
  greyBackground: {
    backgroundColor: '#f5f2f2'
  },

  containerInput: {
    flexGrow: 1,
    paddingRight: '24px'
  },
  containerField: {
    marginTop: '12px'
  },
  flex: {
    display: 'flex'
  },
  center: {
    alignSelf: 'center',
    textAlign: 'center'
  },
  paperBox: {
    fontSize: '8px',
    height: 'auto',
    padding: '6px',
    width: '200px',
    wordBreak: 'break-word'
  },
  paperContainer: {
    background: '#8080801a',
    padding: '30px'
  },
  checkBoxContainer: {
    paddingTop: '30px',
    paddingBottom: '30px'
  },
  p: {
    fontWeight: 'bold'
  },
  newButton: {
    color: 'white'
  },
  card: {
    height: '100%'
  },
  formLabel: {
    paddingLeft: '30px',
    color: '#263238'
  },
  formMultiLabel: {
    marginRight: '0px'
  },
  link: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    color: '#ef5350',
    marginRight: '30px'
  },
  flexOne: {
    flex: 1
  },
  cardCol1: {
    width: '15%'
  },
  cardCol2: {
    width: '25%'
  },
  cardCol3: {
    width: '15%'
  },
  cardCol4: {
    width: '20%'
  },
  cardCol5: {
    width: '25%',
    textAlign: 'right'
  },
  cardColFlex: {
    flex: 1,
    wordBreak: 'keep-all'
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  cardCol60percent: {
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'right',
    width: '60%',
    maxWidth: '128px'
  },
  strong: {
    fontWeight: 600
  },
  separator: {
    height: '5px',
    width: '100%'
  },
  taxDiv: {
    width: '100%',
    textAlign: 'start'
  },
  w_100: {
    width: '100%'
  }
});

class InvoiceThermalPrintView extends React.PureComponent {
  getSeparator = (rows, separator) => {
    const separators = [];
    for (let i = 0; i <= rows; i++) {
      separators.push(<div key={i} className={separator}></div>);
    }
    return separators;
  };

  render() {
    const { classes } = this.props;
    let _data = {};
    const data = {
      billTo: '',
      invoiceNumber: '',
      date: '',
      subTotal: 0,
      totalAmount: '',
      totalDiscount: 0,
      strTotal: '',
      receivedAmount: '',
      balanceAmount: '',
      paymentMode: '',
      paidReceivedTitle: '',
      invoiceNoTitle: '',
      mainTitle: '',
      astrologyDetails: '',
      additionalTempleDetails: '',
      qrCodestr:''
    };
    let settings = {};
    let totalqty = 0;
    let totaltax_gst = 0;
    const gstMap = new Map();

    const getFloatWithTwoDecimal = (val) => {
      return parseFloat(val).toFixed(2);
    };

    const mapPrintableData = () => {
      let name = '';
      let phNo = '';
      if (_data.sales_return_number) {
        data.invoiceNumber = _data.sequenceNumber;
        data.billTitle = 'Return From';
        data.paidReceivedTitle = 'Paid';
        data.receivedAmount = _data.paid_amount || _data.linked_amount;
        name = _data.customer_name ? _data.customer_name : 'NA';
        phNo = _data.customer_phoneNo;
        data.invoiceNoTitle = 'Return No : ';
        data.mainTitle = 'Credit Note - Sales Return';
      } else if (_data.invoice_number) {
        data.invoiceNumber = _data.sequenceNumber;
        data.billTitle = 'Bill To';
        data.paidReceivedTitle = 'Received';
        data.receivedAmount = _data.received_amount;
        name = _data.customer_name ? _data.customer_name : 'NA';
        phNo = _data.customer_phoneNo;
        data.invoiceNoTitle = 'Invoice No : ';
        data.mainTitle = 'Invoice';
      } else if (_data.purchase_return_number) {
        data.invoiceNumber = _data.vendor_bill_number;
        data.billTitle = 'Return To';
        data.paidReceivedTitle = 'Received';
        data.receivedAmount = _data.received_amount || _data.linked_amount;
        name = _data.vendor_name ? _data.vendor_name : 'NA';
        phNo = _data.vendor_phone_number;
        data.invoiceNoTitle = 'Return No : ';
        data.mainTitle = 'Debit Note - Purchase Return';
      } else if (_data.bill_number) {
        data.invoiceNumber = _data.vendor_bill_number;
        data.billTitle = 'Bill From';
        data.paidReceivedTitle = 'Paid';
        name = _data.vendor_name ? _data.vendor_name : 'NA';
        data.receivedAmount = _data.paid_amount;
        phNo = _data.vendor_phone_number;
        data.invoiceNoTitle = 'Bill No : ';
        data.mainTitle = 'Purchase Bill';
      }

      data.customer_name = name;
      data.customer_phoneNo = phNo;
      data.date = _data.invoice_date || _data.date || _data.bill_date;
      data.totalAmount = _data.total_amount;
      data.strTotal = numberToText.convertToText(_data.total_amount);
      data.balanceAmount = _data.balance_amount;
      data.paymentMode = _data.payment_type;
      data.totalDiscount = _data.discount_amount;
      data.billTo =
        '<strong>' +
        _data.customer_name +
        '</strong><br/>' +
        (_data.customer_address ? _data.customer_address + '<br/>' : '') +
        (_data.customer_phoneNo ? _data.customer_phoneNo + '<br/>' : '') +
        (_data.cusstomer_pincode ? _data.cusstomer_pincode + '<br/>' : '') +
        (_data.customer_city ? _data.customer_city + '<br/>' : '') +
        (_data.customer_emailId ? _data.customer_emailId : '');
      data.invoiceNumber = _data.invoice_number;
      data.date = _data.invoice_date || _data.date;
      data.totalAmount = _data.total_amount;
      data.strTotal = inWords(_data.total_amount);
      data.receivedAmount = _data.received_amount;
      data.balanceAmount = _data.balance_amount;
      data.paymentMode = _data.payment_type;

      if (
        isTemple &&
        _data.star !== '' &&
        _data.gothra !== '' &&
        _data.rashi !== '' &&
        _data.star !== undefined &&
        _data.gothra !== undefined &&
        +data.rashi !== undefined
      ) {
        data.astrologyDetails =
          '<strong>' +
          'Astrology Details:' +
          '</strong><br/>' +
          ('Gothra: ' + _data.gothra + '<br/>') +
          ('Rashi: ' + _data.rashi + '<br/>') +
          ('Star: ' + _data.star);
      }

      if (isTemple) {
        data.additionalTempleDetails =
          '<strong>' +
          '<br />For:' +
          '</strong><br/>' +
          (_data.templeSpecialDayName
            ? _data.templeSpecialDayName + '<br/>'
            : '') +
          (_data.templeSpecialDayStartDate !== '' &&
          _data.templeSpecialDayEndDate !== ''
            ? _data.templeSpecialDayStartDate +
              ' - ' +
              _data.templeSpecialDayEndDate +
              '<br/>'
            : '') +
          (_data.templeSpecialDayTimings
            ? _data.templeSpecialDayTimings + '<br/>'
            : '') +
          (_data.templeCustomTypeComments
            ? _data.templeCustomTypeComments + '<br/>'
            : '');
      }
    };

    const getInvoiceRows = () => {
      return _data.item_list.map((item, index) => {
        let mrp = 0;
        if (_data.sales_return_number || _data.invoice_number) {
          mrp = parseFloat(item.mrp).toFixed(2);
        } else if (_data.purchase_return_number || _data.bill_number) {
          mrp = parseFloat(item.purchased_price).toFixed(2);
        }
        let offerPrice = parseFloat(item.offer_price).toFixed(2);

        let itemDiscount = 0;

        if (item.discount_amount > 0) {
          itemDiscount = parseFloat(item.discount_amount);
        }

        const cgstPercent = parseFloat(item.cgst);
        const sgstPercent = parseFloat(item.sgst);
        const igstPercent = parseFloat(item.igst);
        const cessPercent = parseFloat(item.cess);
        const qty = parseFloat(item.qty);
        let tempMrp = mrp;
        let totalGST = 0;
        if (_data.sales_return_number || _data.invoice_number) {
          if (offerPrice < mrp && offerPrice !== 0) {
            tempMrp = offerPrice;
          }
        }
        data.subTotal += item.amount;
        if (cgstPercent) {
          totalGST += parseFloat(item.cgst_amount);
        }
        if (sgstPercent) {
          totalGST += parseFloat(item.sgst_amount);
        }

        if (igstPercent) {
          totalGST += parseFloat(item.igst_amount);
        }

        totalqty += parseFloat(item.qty);
        totaltax_gst += totalGST;
        const offer_price =
          item.offer_price === '' || isNaN(item.offer_price)
            ? item.mrp
            : item.offer_price;
        var finalMRP =
          offer_price !== 0
            ? item.mrp > offer_price
              ? offer_price
              : item.mrp
            : item.mrp;
        const discountUnitPrice = item.mrp - offer_price;
        const discount = qty * (item.mrp - offer_price);
        data.totalDiscount += discount;
        const itemTotal = finalMRP * item.qty;

        return (
          <Grid className={classes.flexRow} key={`${index}value`}>
            <p className={classes.cardCol1}>{index + 1}</p>
            <p className={classes.cardCol2}>{item.item_name}</p>
            <p className={classes.cardCol3}>{item.qty}</p>
            <p className={classes.cardCol4}>₹ {mrp}</p>
            <p className={classes.cardCol5}>
              ₹ {getFloatWithTwoDecimal(itemTotal)}
            </p>
          </Grid>
        );
      });
    };

    const getGSTRows = () => {
      if (_data.item_list) {
        _data.item_list.forEach((item) => {
          if (!item) {
            return;
          }
          let mrp = 0;
          if (_data.sales_return_number || _data.invoice_number) {
            mrp = parseFloat(item.mrp).toFixed(2);
          } else if (_data.purchase_return_number || _data.bill_number) {
            mrp = parseFloat(item.purchased_price).toFixed(2);
          }
          const offerPrice = parseFloat(item.offer_price).toFixed(2);
          const qty = parseFloat(item.qty);
          let tempMRP = mrp;
          if (_data.sales_return_number || _data.invoice_number) {
            if (offerPrice < mrp && offerPrice !== 0) {
              tempMRP = offerPrice;
            }
          }
          if (item.cgst && item.cgst > 0) {
            const cgstKey = `CGST@${item.cgst}%`;
            if (gstMap.has(cgstKey)) {
              gstMap.set(cgstKey, gstMap.get(cgstKey) + item.cgst_amount);
            } else {
              gstMap.set(cgstKey, item.cgst_amount);
            }
          }
          if (item.sgst && item.sgst > 0) {
            const sgstKey = `SGST@${item.sgst}%`;
            if (gstMap.has(sgstKey)) {
              gstMap.set(sgstKey, gstMap.get(sgstKey) + item.sgst_amount);
            } else {
              gstMap.set(sgstKey, item.sgst_amount);
            }
          }
          if (item.igst && item.igst > 0) {
            const igstKey = `IGST@${item.igst}%`;
            if (gstMap.has(igstKey)) {
              gstMap.set(igstKey, gstMap.get(igstKey) + item.igst_amount);
            } else {
              gstMap.set(igstKey, item.igst_amount);
            }
          }
        });
      }
    };

    if (this.props && this.props.data) {
      _data = this.props.data;
      settings = this.props.settings;
      mapPrintableData();
      getGSTRows();
      if (settings.strqrcode)
      {
        if(settings.qrCodeValueOptn === 'upi'){
        let beforeAt = settings.strqrcode.split('@');
        let QRCode = "upi://pay?pa="+ settings.strqrcode +"&pn="+ beforeAt[0] +"&am="+ data.balanceAmount +"&tn=" + settings.strCompanyName;
        data.qrCodestr = QRCode;
        }
        else{
          data.qrCodestr = settings.strqrcode;
        }
      }
    }

    return (
      <div style={{ width: 'auto', height: 'auto', margin: 'auto' }}>
        {this.props && this.props.data ? (
          <div className={classes.paperBox}>
            <Grid className={classes.flexRow}>
              <Grid className={classes.cardColFlex}>
                <p>
                  <center>
                    {settings.boolCompanyLogo && (
                      <Box
                        component="img"
                        style={{width: '40px', height: '40px'}}
                        sx={{
                          height: 40,
                          width: 40,
                          maxHeight: { xs: 40, md: 40 },
                          maxWidth: { xs: 40, md: 40 }
                        }}
                        src={settings.fileCompanyLogo}
                      />
                    )}
                    {settings.boolCompanyName ? (
                      <Fragment>
                        <br />
                        <h1>
                          {' '}
                          <strong>{settings.strCompanyName}</strong>{' '}
                        </h1>
                      </Fragment>
                    ) : (
                      ''
                    )}
                    {settings.boolAddress ? (
                      <Fragment>
                        <br />
                        {settings.strAddress}
                      </Fragment>
                    ) : (
                      ''
                    )}
                    {settings.boolEmail ? (
                      <Fragment>
                        <br />
                        Email: {settings.strEmail}
                      </Fragment>
                    ) : (
                      ''
                    )}
                    {settings.boolPhone ? (
                      <Fragment>
                        <br />
                        Ph. no: {settings.strPhone}
                      </Fragment>
                    ) : (
                      ''
                    )}
                    {settings.boolGSTIN ? (
                      <Fragment>
                        <br />
                        GSTIN: {settings.strGSTIN}
                      </Fragment>
                    ) : (
                      ''
                    )}
                  </center>
                </p>
              </Grid>
            </Grid>

            <Grid>
              <h2>
                <center>{data.mainTitle}</center>
              </h2>
            </Grid>

            {this.getSeparator(1, classes.separator)}

            <Grid>
              <Grid style={{ display: 'flex', flexDirection: 'row' }}>
                <div
                  className={classes.strong}
                  dangerouslySetInnerHTML={{
                    __html: 'Bill to:<br />' + data.billTo
                  }}
                ></div>
              </Grid>

              <Grid style={{ display: 'flex', flexDirection: 'row' }}>
                <p
                  className={classnames([
                    classes.cardColFlex,
                    classes.alignRight,
                    classes.strong
                  ])}
                >
                  {data.invoiceNoTitle} {data.invoiceNumber}
                  <br />
                  Date: {data.date}
                </p>
              </Grid>
              <Grid style={{ display: 'flex', flexDirection: 'row' }}>
                <p
                  className={classnames([
                    classes.cardColFlex,
                    classes.alignRight,
                    classes.strong
                  ])}
                >
                  {isTemple && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data.astrologyDetails + '<br />'
                      }}
                    ></div>
                  )}
                </p>
              </Grid>
            </Grid>

            {this.getSeparator(1, classes.separator)}

            <Grid>
              <Grid className={classnames([classes.flexRow, classes.strong])}>
                <p className={classes.cardCol1}>SR</p>
                <p className={classes.cardCol2}>Name</p>
                <p className={classes.cardCol3}>Qty</p>
                <p className={classes.cardCol4}>Price</p>
                <p className={classes.cardCol5}>Amount</p>
              </Grid>
              <hr />
              {_data.item_list && _data.item_list.length > 0
                ? getInvoiceRows()
                : ''}

              {this.getSeparator(1, classes.separator)}

              <hr />
              <Grid className={classnames([classes.flexRow, classes.strong])}>
                <p className={classes.cardCol1}>Total:</p>
                <p className={classes.cardCol2}>{totalqty}</p>
                <p className={classes.cardCol3}></p>
                <p className={classes.cardCol4}></p>
                <p className={classes.cardCol5}>
                  ₹ {getFloatWithTwoDecimal(data.subTotal)}
                </p>
              </Grid>

              {this.getSeparator(1, classes.separator)}

              <Grid className={classes.flexRow}>
                <p className={classes.cardColFlex}></p>

                <Grid className={classes.cardCol60percent} style={{ flexDirection: 'column' }}                >
                  {/* <Grid className={classnames([classes.flexRow, classes.alignRight])}>
                      <p>Sub Total</p>
                      <p className={classes.cardColFlex}>₹ {getFloatWithTwoDecimal(data.subTotal)}</p>
                    </Grid> */}
                  <Grid
                    className={classnames([
                      classes.flexRow,
                      classes.alignRight
                    ])}
                  >
                    <p>Discount</p>
                    <p className={classes.cardColFlex}>
                      ₹ {getFloatWithTwoDecimal(data.totalDiscount)}
                    </p>
                  </Grid>
                  <Grid
                    className={classnames([
                      classes.flexRow,
                      classes.alignRight
                    ])}
                  >
                    <p>Package Charge</p>
                    <p className={classes.cardColFlex}>
                      ₹ {getFloatWithTwoDecimal(10)}
                    </p>
                  </Grid>
                  <Grid
                    className={classnames([
                      classes.flexRow,
                      classes.alignRight
                    ])}
                  >
                    <p>Shipping Charge</p>
                    <p className={classes.cardColFlex}>
                      ₹ {getFloatWithTwoDecimal(20)}
                    </p>
                  </Grid>
                  {settings.boolTaxDetails ? (
                    <Grid
                      className={classnames([
                        classes.flexRow,
                        classes.alignRight
                      ])}
                    >
                      <p className={classes.cardColFlex}>
                        {Array.from(gstMap.keys()).map((key) => {
                          return (
                            <div
                              className={classnames([
                                classes.flexRow,
                                classes.alignRight
                              ])}
                            >
                              <div className={classes.taxDiv}>
                                {' '}
                                <p>{key}</p>
                              </div>
                              <div className={classes.w_100}>
                                {' '}
                                <p
                                  className={classnames([
                                    classes.cardColFlex,
                                    classes.strong
                                  ])}
                                >
                                  ₹ {getFloatWithTwoDecimal(gstMap.get(key))}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </p>
                    </Grid>
                  ) : (
                    ''
                  )}
                  <Grid
                    className={classnames([
                      classes.flexRow,
                      classes.alignRight
                    ])}
                  >
                    <p className={classes.strong}>Total</p>
                    <p
                      className={classnames([
                        classes.cardColFlex,
                        classes.strong
                      ])}
                    >
                      ₹ {getFloatWithTwoDecimal(data.totalAmount)}
                    </p>
                  </Grid>
                  <Grid
                    className={classnames([
                      classes.flexRow,
                      classes.alignRight
                    ])}
                  >
                    <p>Received</p>
                    <p className={classes.cardColFlex}>
                      ₹ {getFloatWithTwoDecimal(data.receivedAmount)}
                    </p>
                  </Grid>
                  <Grid
                    className={classnames([
                      classes.flexRow,
                      classes.alignRight
                    ])}
                  >
                    <p>Balance</p>
                    <p className={classes.cardColFlex}>
                      ₹ {getFloatWithTwoDecimal(data.balanceAmount)}
                    </p>
                  </Grid>
                  {settings.boolPaymentMode ? (
                    <Grid
                      className={classnames([
                        classes.flexRow,
                        classes.alignRight
                      ])}
                    >
                      <p>Payment Mode</p>
                      <p className={classes.cardColFlex}>{data.paymentMode}</p>
                    </Grid>
                  ) : (
                    ''
                  )}
                  {settings.boolBankDetail ? (
                    <>
                      {settings.boolBankDetailsOnCreditSaleOnly &&
                      data.balanceAmount > 0 ? (
                        <>
                          <Grid
                            className={classnames([
                              classes.flexRow,
                              classes.alignRight
                            ])}
                          >
                            <p
                              style={{ marginTop: '12px', textAlign: 'center' }}
                              className={classes.cardColFlex}
                            >
                              BANK DETAILS:{' '}
                            </p>
                          </Grid>
                          <Grid
                            className={classnames([
                              classes.flexRow,
                              classes.alignRight
                            ])}
                          >
                            <p>Bank Name</p>
                            <p className={classes.cardColFlex}>
                              {settings.bankName}
                            </p>
                          </Grid>
                          <Grid
                            className={classnames([
                              classes.flexRow,
                              classes.alignRight
                            ])}
                          >
                            <p>Acc No</p>
                            <p className={classes.cardColFlex}>
                              {settings.bankAccountNumber}
                            </p>
                          </Grid>
                          <Grid
                            className={classnames([
                              classes.flexRow,
                              classes.alignRight
                            ])}
                          >
                            <p>IFSC Code</p>
                            <p className={classes.cardColFlex}>
                              {settings.bankIfscCode}
                            </p>
                          </Grid>
                        </>
                      ) : (
                        <div>
                          {!settings.boolBankDetailsOnCreditSaleOnly ? (
                            <>
                              <Grid
                                className={classnames([
                                  classes.flexRow,
                                  classes.alignRight
                                ])}
                              >
                                <p
                                  style={{
                                    marginTop: '12px',
                                    textAlign: 'center'
                                  }}
                                  className={classes.cardColFlex}
                                >
                                  BANK DETAILS:{' '}
                                </p>
                              </Grid>
                              <Grid
                                className={classnames([
                                  classes.flexRow,
                                  classes.alignRight
                                ])}
                              >
                                <p>Bank Name</p>
                                <p className={classes.cardColFlex}>
                                  {settings.bankName}
                                </p>
                              </Grid>
                              <Grid
                                className={classnames([
                                  classes.flexRow,
                                  classes.alignRight
                                ])}
                              >
                                <p>Acc No</p>
                                <p className={classes.cardColFlex}>
                                  {settings.bankAccountNumber}
                                </p>
                              </Grid>
                              <Grid
                                className={classnames([
                                  classes.flexRow,
                                  classes.alignRight
                                ])}
                              >
                                <p>IFSC Code</p>
                                <p className={classes.cardColFlex}>
                                  {settings.bankIfscCode}
                                </p>
                              </Grid>
                            </>
                          ) : (
                            ''
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    ''
                  )}
                 
                </Grid>
              </Grid>
              <Grid className={classes.flexRow}>
                <div className={classes.cardColFlex} style={{marginTop:'-10px'}}>
                {settings.boolQrCode ? (
                  <>
                        <Fragment>
                          {this.getSeparator(1, classes.separator)}
                          {data.qrCodestr && (
                          <QRCode value={data.qrCodestr ? data.qrCodestr : ''} size={50} />
                          )}
                        </Fragment>
                        </>
                      ) : (
                        ''
                      )}
                </div>
                <Grid className={classes.cardCol60percent} style={{flexDirection: 'column'}}>
                
                   {settings.boolSignature && settings.strSignature ? (
                      <div>
                        <Box
                          component="img"
                          style={{width: '40px', height: '40px'}}
                          sx={{
                            height: 50,
                            width: 70,
                            maxHeight: { xs: 40, md: 50 },
                            maxWidth: { xs: 50, md: 70 }
                          }}
                          src={settings.strSignature}
                        />
                        <p>Authorised signature</p>
                      </div>
                    ) : (
                      ''
                    )}
                  
                </Grid>

              </Grid>


              <Grid className={classes.cardColFlex}>
                <p>
                  <center>
                    {settings.boolTerms ? (
                      <Fragment>
                        {this.getSeparator(1, classes.separator)}
                        <div style={{ whiteSpace: 'break-spaces' }}>
                          {settings.strTerms}
                        </div>
                      </Fragment>
                    ) : (
                      ''
                    )}
                  </center>
                </p>
              </Grid>
            </Grid>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
export default withStyles(styles)(InvoiceThermalPrintView);
