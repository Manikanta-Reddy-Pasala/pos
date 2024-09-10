import React, { Fragment } from 'react';
import { Grid, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const numberToText = require('number-to-text');
require('number-to-text/converters/en-in'); // load converter

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
    height: '95%',
    padding: '6px',
    width: '95%',
    wordBreak: 'break-word'
  },
  p: {
    fontWeight: 'bold'
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
  multilineStyle: {
    whiteSpace: 'break-spaces'
    /* backgroundColor: '#f5f2f2' */
  }
});

class ReceiptPrint extends React.PureComponent {
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
      receiptNumber: '',
      date: '',
      subTotal: 0,
      totalAmount: '',
      totalDiscount: 0,
      strTotal: '',
      receivedAmount: '',
      paymentMode: '',
      billTitle: '',
      paymentType: ''
    };
    let settings = {};
    let outStandingType = '';
    let outStandingBalance = 0;
    let TxnSettings = {};
    let listOfPaymentInData = [];

    const getFloatWithTwoDecimal = (val) => {
      return parseFloat(val).toFixed(2);
    };

    function dateFormatter(date) {
      var dateParts = date.split('-');
      if (dateParts.length >= 3) {
        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    }

    const mapPrintableData = () => {
      var name = '';
      var phNo = '';
      if (_data.customerName) {
        name = _data.customerName ? _data.customerName : '';
        phNo = _data.customer_phoneNo ? _data.customer_phoneNo : '';
        data.billTitle = '<strong>Received From</strong>';
        data.receiptNumber = _data.sequenceNumber;
      } else if (_data.vendorName) {
        name = _data.vendorName ? _data.vendorName : '';
        phNo = _data.vendorPhoneNo ? _data.vendorPhoneNo : '';
        data.billTitle = '<strong>Paid To</strong>';
        data.receiptNumber = _data.sequenceNumber;
      }

      data.billTo = name + '<br/>' + phNo + '<br/>';

      data.date = _data.date;
      data.totalAmount = _data.total;
      data.strTotal = _data.customerName ? _data.received : _data.paid;
      /* data.strTotal = numberToText.convertToText(_data.customerName ? _data.received : _data.paid,{language : 'en-in', separator : '', case:"upperCase"}); */
      data.receivedAmount = _data.customerName ? _data.received : _data.paid;

      if (listOfPaymentInData && listOfPaymentInData.length > 0) {
        let paymentsMap = new Map();
        for (let pI of listOfPaymentInData) {
          let amountToConsider = pI.linkedAmount;
          if (pI.paymentType === 'Split') {
            data.paymentType = '';
            for (let payment of pI.splitPaymentList) {
              let amount = 0;
              if (amountToConsider >= payment.amount) {
                amount = payment.amount;
                amountToConsider = amountToConsider - payment.amount;
              } else {
                amount = amountToConsider;
                amountToConsider = 0;
              }
              if (payment.amount > 0 && payment.paymentType === 'Cash') {
                if (paymentsMap.has('CASH')) {
                  paymentsMap.set('CASH', paymentsMap.get('CASH') + amount);
                } else {
                  paymentsMap.set('CASH', amount);
                }
              }
              if (payment.amount > 0 && payment.paymentType === 'Gift Card') {
                if (paymentsMap.has(payment.paymentMode)) {
                  paymentsMap.set(
                    payment.paymentMode,
                    paymentsMap.get(payment.paymentMode) + amount
                  );
                } else {
                  paymentsMap.set(payment.paymentMode, amount);
                }
              }
              if (
                payment.amount > 0 &&
                payment.paymentType === 'Custom Finance'
              ) {
                if (paymentsMap.has(payment.paymentMode)) {
                  paymentsMap.set(
                    payment.paymentMode,
                    paymentsMap.get(payment.paymentMode) + amount
                  );
                } else {
                  paymentsMap.set(payment.paymentMode, amount);
                }
              }

              if (
                payment.paymentMode === 'UPI' ||
                payment.paymentMode === 'Internet Banking' ||
                payment.paymentMode === 'Credit Card' ||
                payment.paymentMode === 'Debit Card' ||
                payment.paymentMode === 'Cheque'
              ) {
                let mode = '';
                switch (payment.paymentMode) {
                  case 'UPI':
                    mode = 'UPI';
                    break;
                  case 'Internet Banking':
                    mode = 'NEFT/RTGS';
                    break;
                  case 'Credit Card':
                    mode = 'CARD';
                    break;
                  case 'Debit Card':
                    mode = 'CARD';
                    break;
                  case 'Cheque':
                    mode = 'CHEQUE';
                    break;
                  default:
                    return '';
                }
                if (paymentsMap.has(mode)) {
                  paymentsMap.set(mode, paymentsMap.get(mode) + amount);
                } else {
                  paymentsMap.set(mode, amount);
                }
              }

              if (amountToConsider === 0) {
                continue;
              }
            }
          } else if (pI.paymentType === 'cash' || pI.paymentType === 'Cash') {
            let amount = 0;
            if (amountToConsider >= pI.total) {
              amount = pI.total;
              amountToConsider = amountToConsider - pI.total;
            } else {
              amount = amountToConsider;
              amountToConsider = 0;
            }
            if (paymentsMap.has('CASH')) {
              paymentsMap.set('CASH', paymentsMap.get('CASH') + amount);
            } else {
              paymentsMap.set('CASH', amount);
            }

            if (amountToConsider === 0) {
              continue;
            }
          } else if (pI.paymentType === 'upi') {
            let amount = 0;
            if (amountToConsider >= pI.total) {
              amount = pI.total;
              amountToConsider = amountToConsider - pI.total;
            } else {
              amount = amountToConsider;
              amountToConsider = 0;
            }
            if (paymentsMap.has('UPI')) {
              paymentsMap.set('UPI', paymentsMap.get('UPI') + amount);
            } else {
              paymentsMap.set('UPI', amount);
            }

            if (amountToConsider === 0) {
              continue;
            }
          } else if (pI.paymentType === 'internetbanking') {
            let amount = 0;
            if (amountToConsider >= pI.total) {
              amount = pI.total;
              amountToConsider = amountToConsider - pI.total;
            } else {
              amount = amountToConsider;
              amountToConsider = 0;
            }
            if (paymentsMap.has('NEFT/RTGS')) {
              paymentsMap.set(
                'NEFT/RTGS',
                paymentsMap.get('NEFT/RTGS') + amount
              );
            } else {
              paymentsMap.set('NEFT/RTGS', amount);
            }

            if (amountToConsider === 0) {
              continue;
            }
          } else if (pI.paymentType === 'cheque') {
            let amount = 0;
            if (amountToConsider >= pI.total) {
              amount = pI.total;
              amountToConsider = amountToConsider - pI.total;
            } else {
              amount = amountToConsider;
              amountToConsider = 0;
            }
            if (paymentsMap.has('CHEQUE')) {
              paymentsMap.set('CHEQUE', paymentsMap.get('CHEQUE') + amount);
            } else {
              paymentsMap.set('CHEQUE', amount);
            }

            if (amountToConsider === 0) {
              continue;
            }
          } else if (
            pI.paymentType === 'creditcard' ||
            pI.paymentType === 'debitcard'
          ) {
            let amount = 0;
            if (amountToConsider >= pI.total) {
              amount = pI.total;
              amountToConsider = amountToConsider - pI.total;
            } else {
              amount = amountToConsider;
              amountToConsider = 0;
            }
            if (paymentsMap.has('CARD')) {
              paymentsMap.set('CARD', paymentsMap.get('CARD') + amount);
            } else {
              paymentsMap.set('CARD', amount);
            }

            if (amountToConsider === 0) {
              continue;
            }
          } else if (
            pI.paymentType === 'Sales Return' ||
            pI.paymentType === 'Purchases' ||
            pI.paymentType === 'Sales' ||
            pI.paymentType === 'Opening Balance' ||
            pI.paymentType === 'Purchases Return'
          ) {
            let amount = 0;
            if (amountToConsider >= pI.total) {
              amount = pI.total;
              amountToConsider = amountToConsider - pI.total;
            } else {
              amount = amountToConsider;
              amountToConsider = 0;
            }
            let type = '';
            switch (pI.paymentType) {
              case 'Sales Return':
                type = 'RETURNED SALE';
                break;
              case 'Sales':
                type = 'CREDIT SALE';
                break;
              case 'Purchases':
                type = 'CREDIT PURCHASE';
                break;
              case 'Purchases Return':
                type = 'RETURNED PURCHASE';
                break;
              case 'Opening Balance':
                type = 'OPENING BALANCE';
                break;
              default:
                return null;
            }
            if (paymentsMap.has(type)) {
              paymentsMap.set(type, paymentsMap.get(type) + amount);
            } else {
              paymentsMap.set(type, amount);
            }

            if (amountToConsider === 0) {
              continue;
            }
          }
        }

        if (paymentsMap) {
          for (let [key, value] of paymentsMap) {
            if (value !== 0) {
              data.paymentType += '<b>' + key + '</b>: ₹' + value + '<br/>';
            }
          }
          console.log('Payment Type ', data.paymentType);
        }
      } else if (_data.paymentType === 'Split') {
        data.paymentType = '';
        let bankMap = new Map();
        for (let payment of _data.splitPaymentList) {
          if (payment.amount > 0 && payment.paymentType === 'Cash') {
            data.paymentType += '<b>CASH: </b>₹' + payment.amount + '<br/>';
          }
          if (payment.amount > 0 && payment.paymentType === 'Gift Card') {
            data.paymentType +=
              '<b>' +
              payment.paymentMode +
              '</b>: ₹' +
              payment.amount +
              '<br/>';
          }
          if (payment.amount > 0 && payment.paymentType === 'Custom Finance') {
            data.paymentType +=
              '<b>' +
              payment.paymentMode +
              '</b>: ₹' +
              payment.amount +
              '<br/>';
          }

          if (
            payment.paymentMode === 'UPI' ||
            payment.paymentMode === 'Internet Banking' ||
            payment.paymentMode === 'Credit Card' ||
            payment.paymentMode === 'Debit Card' ||
            payment.paymentMode === 'Cheque'
          ) {
            let mode = '';
            switch (payment.paymentMode) {
              case 'UPI':
                mode = 'UPI';
                break;
              case 'Internet Banking':
                mode = 'NEFT/RTGS';
                break;
              case 'Credit Card':
                mode = 'CARD';
                break;
              case 'Debit Card':
                mode = 'CARD';
                break;
              case 'Cheque':
                mode = 'CHEQUE';
                break;
              default:
                return '';
            }

            if (bankMap.has(mode)) {
              bankMap.set(mode, bankMap.get(mode) + payment.amount);
            } else {
              bankMap.set(mode, payment.amount);
            }
          }
        }

        if (bankMap) {
          for (let [key, value] of bankMap) {
            data.paymentType += '<b>' + key + '</b>: ₹' + value + '<br/>';
          }
        }
      } else if (_data.paymentType === 'cash' || _data.paymentType === 'Cash') {
        data.paymentType = '<b>CASH: <b>₹' + data.totalAmount + '<br/>';
      } else if (_data.paymentType === 'upi') {
        data.paymentType = '<b>UPI: <b>₹' + data.totalAmount + '<br/>';
      } else if (_data.paymentType === 'internetbanking') {
        data.paymentType = '<b>NEFT/RTGS: <b>₹' + data.totalAmount + '<br/>';
      } else if (_data.paymentType === 'cheque') {
        data.paymentType = '<b>CHEQUE: <b>₹' + data.totalAmount + '<br/>';
      } else if (
        _data.paymentType === 'creditcard' ||
        _data.paymentType === 'debitcard'
      ) {
        data.paymentType = '<b>CARD: <b>₹' + data.totalAmount + '<br/>';
      }
    };

    if (this.props && this.props.data) {
      _data = this.props.data;
      settings = this.props.settings;
      mapPrintableData();
    }

    if (this.props && this.props.TxnSettings) {
      TxnSettings = this.props.TxnSettings;
    }

    //linkedPaymentsData
    if (this.props && this.props.linkedPaymentsData) {
      listOfPaymentInData = this.props.linkedPaymentsData;
    }

    if (this.props && this.props.balanceData) {
      outStandingType = this.props.balanceData.balanceType;
      outStandingBalance = this.props.balanceData.totalBalance;
    }

    let format = [];
    const addNewObject = (type) => {
      const newObject = {
        name: type
      };
      format.push(newObject);
    };

    let json = this.props.customPrintOptions;
    if (json) {
      if (json.printOriginal) {
        for (let i = 0; i < json.printOriginalCopies; i++) {
          addNewObject('Original Copy');
        }
      }
      if (json.printDuplicate) {
        for (let i = 0; i < json.printDuplicateCopies; i++) {
          addNewObject('Duplicate Copy');
        }
      }
      if (json.printTriplicate) {
        for (let i = 0; i < json.printTriplicateCopies; i++) {
          addNewObject('Triplicate Copy');
        }
      }
      if (json.printCustom) {
        for (let i = 0; i < json.printCustomCopies; i++) {
          addNewObject(json.printCustomName);
        }
      }
      if (
        !json.printOriginal &&
        !json.printDuplicate &&
        !json.printTriplicate &&
        !json.printCustom
      ) {
        addNewObject('');
      }
    } else {
      addNewObject('');
    }
    console.log("customPrintOptions_2", format);

    return (
      <div
        className={classes.paperBox}
      /* style={{ width: '98%', height: '99%' }} */
      >
        {this.props && this.props.data ? format.map((item, index) => (
          <div style={{ margin: 10, pageBreakAfter: 'always' }}>
            <div style={{ textAlign: 'center' }}>
              <Grid alignItems="center" justifyContent="center">
                <Grid>
                  {settings.boolCompanyLogo && (
                    <Box
                      component="img"
                      sx={{
                        height: 40,
                        width: 40,
                        maxHeight: { xs: 40, md: 40 },
                        maxWidth: { xs: 40, md: 40 }
                      }}
                      src={settings.fileCompanyLogo}
                    />
                  )}
                </Grid>
                <Grid>
                  <p>
                    {settings.boolCompanyName ? (
                      <Fragment>
                        <h1>
                          <strong>{settings.strCompanyName}</strong>
                        </h1>
                        {item.name != '' && <p style={{
                          float: 'right',
                          marginRight: '2px',
                          padding: '5px',
                          border: '1px solid #8080807a',
                          color: '#808080bf',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          height: '25px',
                          marginTop: '-29px'
                        }}>{item.name}</p>}
                      </Fragment>
                    ) : (
                      ''
                    )}
                    {settings.boolAddress ? (
                      <Fragment>{settings.strAddress}</Fragment>
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
                    {settings.boolWebsite ? (
                      <Fragment>
                        <br />
                        Website: {settings.strWebsite}
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
                    {settings.boolPAN ? (
                      <Fragment>
                        <br />
                        PAN: {settings.strPAN}
                      </Fragment>
                    ) : (
                      ''
                    )}
                  </p>
                </Grid>
              </Grid>
            </div>

            {this.getSeparator(2, classes.separator)}

            <Grid>
              <h1>
                <center>Payment Receipt</center>
              </h1>
            </Grid>

            {this.getSeparator(2, classes.separator)}

            <Grid>
              <Grid style={{ display: 'flex', flexDirection: 'row' }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: data.billTitle + '<br />' + data.billTo
                  }}
                ></div>
                <p
                  className={classnames([
                    classes.cardColFlex,
                    classes.alignRight
                  ])}
                >
                  <b>Receipt No: {data.receiptNumber}</b>
                  <br />
                  Date: {dateFormatter(data.date)}
                </p>
              </Grid>
            </Grid>

            {this.getSeparator(1, classes.separator)}

            <Grid>
              <Grid className={classes.flexRow}>
                <Grid className={classes.cardColFlex}>
                  <Grid className={classes.flexColumn}>
                    <p className={classes.strong}>AMOUNT IN WORDS</p>

                    <p className={classes.greyBackground}>
                      {numberToText.convertToText(
                        Math.round(data.receivedAmount),
                        {
                          language: 'en-in',
                          separator: '',
                          case: 'upperCase'
                        }
                      )}
                    </p>
                    {TxnSettings.terms !== '' &&
                      TxnSettings.terms !== undefined &&
                      TxnSettings.terms !== null ? (
                      <Fragment>
                        {this.getSeparator(1, classes.separator)}
                        <div className={classes.multilineStyle}>
                          <p className={classes.strong}>TERMS AND CONDITIONS</p>
                          {TxnSettings.terms !== '' &&
                            TxnSettings.terms !== undefined &&
                            TxnSettings.terms !== null
                            ? TxnSettings.terms
                            : settings.strTerms}
                        </div>
                      </Fragment>
                    ) : (
                      ''
                    )}
                  </Grid>
                </Grid>
                <Grid className={classes.cardCol40percent}>
                  <Grid
                    className={classnames([
                      classes.flexRow,
                      classes.alignRight,
                      classes.strong
                    ])}
                  >
                    {_data.customerName ? <p>Received</p> : <p>Paid</p>}
                    <p className={classes.cardColFlex}>
                      ₹{' '}
                      {
                        Intl.NumberFormat('en-IN').format(data.receivedAmount)
                        /* getFloatWithTwoDecimal(data.receivedAmount) */
                      }
                    </p>
                  </Grid>
                  {settings.boolPreviousBalance && outStandingBalance > 0 && (
                    <Grid
                      className={classnames([
                        classes.flexRow,
                        classes.alignRight,
                        classes.strong
                      ])}
                    >
                      <p>Outstanding-{outStandingType}</p>
                      <p className={classes.cardColFlex}>
                        ₹{' '}
                        {
                          Intl.NumberFormat('en-IN').format(outStandingBalance)
                          /* getFloatWithTwoDecimal(data.receivedAmount) */
                        }
                      </p>
                    </Grid>
                  )}
                  {settings.boolPaymentMode ? (
                    <Grid
                      className={classnames([
                        classes.flexRow,
                        classes.alignRight
                      ])}
                    >
                      <p>Payment Type</p>

                      <p
                        className={classes.cardColFlex}
                        style={{ textTransform: 'capitalize' }}
                        dangerouslySetInnerHTML={{
                          __html: data.paymentType
                        }}
                      ></p>
                    </Grid>
                  ) : (
                    ''
                  )}
                  <Grid
                    className={classnames([classes.flexRow, classes.alignRight])}
                  >
                    <Grid
                      className={classes.flexColumn}
                      style={{ width: '100%' }}
                    >
                      <hr />
                      {this.getSeparator(2, classes.separator)}
                      {settings.boolSignature && settings.fileSignature ? (
                        <center>
                          <p>
                            For,{' '}
                            {settings.boolCompanyName
                              ? settings.strCompanyName
                              : ''}
                            <br />
                            {/* <img
                                src={settings.fileSignature}
                                alt=""
                                style={{ maxHeight: '56px', maxWidth: '126px' }}
                              /> */}
                            <br />
                            {settings.strSignature}
                          </p>
                        </center>
                      ) : (
                        ''
                      )}
                    </Grid>
                  </Grid>
                  <Grid
                    className={classnames([classes.flexRow, classes.alignRight])}
                  ></Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        ))
          : ''}
      </div>
    );
  }
}
export default withStyles(styles)(ReceiptPrint);