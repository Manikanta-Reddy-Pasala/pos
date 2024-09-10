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
  p: {
    fontWeight: 'bold'
  },
  cardCol1: {
    width: '5%'
  },
  cardCol2: {
    width: '25%'
  },
  cardColOther: {
    width: '15%',
    textAlign: 'right'
  },
  cardColSale: {
    width: '9%',
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
  cardCol30percent: {
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
  taxDiv: {
    width: '100%',
    textAlign: 'start'
  },
  w_100: {
    width: '100%'
  },
  multilineStyle: {
    whiteSpace: 'break-spaces',
    backgroundColor: '#f5f2f2'
  }
});

class SchemeManagementRegularPrint extends React.PureComponent {
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
    let linkedPaymentsData = [];
    const data = {
      billTitle: '',
      billTo: '',
      invoiceNumber: '',
      date: '',
      subTotal: 0,
      totalAmount: '',
      totalDiscount: 0,
      strTotal: '',
      invoiceNoTitle: '',
      mainTitle: '',
      notes: ''
    };
    let settings = {};

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
      let name = _data.customerName ? _data.customerName : 'NA';
      let phNo = _data.customerPhoneNo ? _data.customerPhoneNo : '';
      let address = _data.customerAddress ? _data.customerAddress : '';
      let gstNo = _data.customerGSTNo ? 'GST: ' + _data.customerGSTNo : '';
      data.billTitle = '<strong>Bill From</strong>';
      data.invoiceNoTitle = 'Receipt No';
      data.mainTitle = 'Scheme Receipt';
      data.invoiceNumber = _data.sequenceNumber;

      data.billTo = name + '<br/>' + phNo + '<br/>' + address + '<br/>' + gstNo;

      data.date = _data.date;
      data.totalAmount = _data.total;
      data.notes = _data.notes;

      /****************Number to Rupees with Paise*********/

      const strTotInt = numberToText.convertToText(Math.trunc(_data.total));
      const decimalStr = _data.total.toString().split('.')[1];
      if (decimalStr) {
        data.strTotal =
          decimalStr !== '00'
            ? strTotInt +
              ' Rupees And ' +
              numberToText.convertToText(decimalStr) +
              ' Paise Only'
            : strTotInt + ' Rupees Only';
      } else {
        data.strTotal = strTotInt + ' Rupees Only';
      }
    };

    if (this.props && this.props.data) {
      _data = this.props.data;
      settings = this.props.settings;
      mapPrintableData();
    }

    if (this.props && this.props.linkedPaymentsData) {
      linkedPaymentsData = this.props.linkedPaymentsData;
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

    const getAmountPaid = () => {
      let data = _data;
      let amount = 0;
      if (data.linkedTxnList && data.linkedTxnList.length > 0) {
        for (let p of data.linkedTxnList) {
          amount += parseFloat(p.linkedAmount || 0);
        }
      }
      return parseFloat(amount.toFixed(2));
    };

    const getPaymentHistory = () => {
      return linkedPaymentsData.map((item, index) => {
        let paymentType = '';
        if (item.paymentType === 'Split') {
          let bankMap = new Map();
          for (let payment of item.splitPaymentList) {
            if (payment.amount > 0 && payment.paymentType === 'Cash') {
              paymentType += '<b>CASH: </b>₹' + payment.amount + '<br/>';
            }
            if (payment.amount > 0 && payment.paymentType === 'Gift Card') {
              paymentType +=
                '<b>' +
                payment.paymentMode +
                '</b>: ₹' +
                payment.amount +
                '<br/>';
            }
            if (
              payment.amount > 0 &&
              payment.paymentType === 'Custom Finance'
            ) {
              paymentType +=
                '<b>' +
                payment.paymentMode +
                '</b>: ₹' +
                payment.amount +
                '<br/>';
            }
            if (payment.amount > 0 && payment.paymentType === 'Exchange') {
              paymentType +=
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
              if (value !== 0) {
                paymentType += '<b>' + key + '</b>: ₹' + value + '<br/>';
              }
            }
          }
        } else if (item.paymentType === 'cash' || item.paymentType === 'Cash') {
          paymentType = '<b>CASH: </b>₹' + item.linkedAmount + '<br/>';
        } else if (item.paymentType === 'upi') {
          paymentType = '<b>UPI: </b>₹' + item.linkedAmount + '<br/>';
        } else if (item.paymentType === 'internetbanking') {
          paymentType = '<b>NEFT/RTGS: </b>₹' + item.linkedAmount + '<br/>';
        } else if (item.paymentType === 'cheque') {
          paymentType = '<b>CHEQUE: </b>₹' + item.linkedAmount + '<br/>';
        } else if (
          item.paymentType === 'creditcard' ||
          item.paymentType === 'debitcard'
        ) {
          paymentType = '<b>CARD: </b>₹' + item.linkedAmount + '<br/>';
        }

        return (
          <div
            style={{
              width: '100%',
              borderLeft: '1px solid',
              borderRight: '1px solid',
              display: 'flex',
              flexDirection: 'row',
              textAlign: 'center',
              borderBottom: '1px solid',
              fontSize: '16px'
            }}
          >
            <div style={{ borderRight: '1px solid', width: '25%' }}>
              <p>{dateFormatter(item.date)}</p>
            </div>
            <div style={{ borderRight: '1px solid', width: '25%' }}>
              <p>{item.sequenceNumber}</p>
            </div>
            <div style={{ borderRight: '1px solid', width: '25%' }}>
              <p>₹ {getFloatWithTwoDecimal(item.linkedAmount)}</p>
            </div>
            <div style={{ borderRight: '1px solid', width: '25%' }}>
              <p
                style={{
                  textTransform: 'capitalize',
                  flex: 1,
                  wordBreak: 'keep-all'
                }}
                dangerouslySetInnerHTML={{
                  __html: paymentType
                }}
              ></p>
            </div>
          </div>
        );
      });
    };

    return (
      <div>
        {this.props && this.props.data
          ? format.map((item, index) => (
              <div
                style={{
                  pageBreakAfter: 'always',
                  width: '100%',
                  padding: '5px',
                  fontFamily: 'Roboto',
                  wordBreak: 'break-word'
                }}
              >
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
                            {item.name !== '' && (
                              <p
                                style={{
                                  float: 'right',
                                  marginRight: '2px',
                                  padding: '5px',
                                  border: '1px solid #8080807a',
                                  color: '#808080bf',
                                  fontWeight: 'bold',
                                  fontSize: '11px',
                                  height: '25px',
                                  marginTop: '-29px'
                                }}
                              >
                                {item.name}
                              </p>
                            )}
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
                        {settings.boolGSTIN ? (
                          <Fragment>
                            <br />
                            GSTIN: {settings.strGSTIN}
                          </Fragment>
                        ) : (
                          ''
                        )}
                      </p>
                    </Grid>
                  </Grid>
                </div>

                {this.getSeparator(1, classes.separator)}

                <Grid>
                  <h2>
                    <center>{data.mainTitle}</center>
                  </h2>
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
                      <b>
                        {data.invoiceNoTitle}
                        {': '}
                        {data.invoiceNumber}
                      </b>
                      <br />
                      Receipt Date: {dateFormatter(data.date)}
                    </p>
                  </Grid>
                </Grid>

                {this.getSeparator(1, classes.separator)}

                <Grid>
                  <p style={{ textAlign: 'left' }}>
                    <h3>SCHEME DETAILS: </h3>
                  </p>
                  <p style={{ textAlign: 'left' }}>
                    <b>Period: </b> {_data.period} months
                  </p>
                  <p style={{ textAlign: 'left' }}>
                    <b>Total Deposit Amount: </b>₹ {_data.depositAmount}
                  </p>
                  <p style={{ textAlign: 'left' }}>
                    <b>Discount/Contribution: </b>₹ {_data.discountContribution}
                  </p>
                  <p style={{ textAlign: 'left' }}>
                    <b>Monthly Installment: </b>₹{' '}
                    {_data.depositAmount / _data.period}
                  </p>
                </Grid>

                <Grid>
                  <Grid>
                    <Grid className={classnames([classes.alignRight])}>
                      <h2>
                        Total: ₹{getFloatWithTwoDecimal(data.totalAmount)}
                      </h2>
                    </Grid>
                  </Grid>
                  <Grid className={classes.flexRow}>
                    <Grid className={classes.cardColFlex}>
                      <Grid className={classes.flexColumn}>
                        <p className={classes.strong}>AMOUNT IN WORDS</p>
                        <p
                          className={classes.greyBackground}
                          style={{ textTransform: 'capitalize' }}
                        >
                          {data.strTotal}
                        </p>
                        {this.getSeparator(1, classes.separator)}
                        {data.notes && (
                          <Fragment>
                            <p className={classes.strong}>Notes</p>
                            <p className={classes.greyBackground}>
                              {data.notes}
                            </p>
                          </Fragment>
                        )}

                        {linkedPaymentsData &&
                          linkedPaymentsData.length > 0 && (
                            <>
                              {this.getSeparator(1, classes.separator)}
                              <p style={{ textAlign: 'left' }}>
                                <h3>PAYMENT HISTORY </h3>
                              </p>
                              <div
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  border: '1px solid',
                                  flexDirection: 'row',
                                  textAlign: 'center',
                                  fontWeight: 'bold',
                                  fontSize: '16px'
                                }}
                              >
                                <div
                                  style={{
                                    borderRight: '1px solid',
                                    width: '25%'
                                  }}
                                >
                                  <p>DATE</p>
                                </div>
                                <div
                                  style={{
                                    borderRight: '1px solid',
                                    width: '25%'
                                  }}
                                >
                                  <p>NUMBER</p>
                                </div>
                                <div
                                  style={{
                                    borderRight: '1px solid',
                                    width: '25%'
                                  }}
                                >
                                  <p>AMOUNT</p>
                                </div>
                                <div
                                  style={{
                                    borderRight: '1px solid',
                                    width: '25%'
                                  }}
                                >
                                  <p>PAYMENT</p>
                                </div>
                              </div>
                            </>
                          )}

                        {linkedPaymentsData && linkedPaymentsData.length > 0
                          ? getPaymentHistory()
                          : ''}

                        <Grid
                          className={classnames([classes.alignRight])}
                          style={{ marginTop: '16px' }}
                        >
                          <h4>Total Amount Paid: ₹{getAmountPaid()}</h4>
                        </Grid>
                        <Grid className={classnames([classes.alignRight])}>
                          <h4>
                            Balance: ₹
                            {getFloatWithTwoDecimal(
                              _data.depositAmount - getAmountPaid()
                            )}
                          </h4>
                        </Grid>

                        {settings.schemeStrTerms !== '' &&
                        settings.schemeStrTerms !== undefined &&
                        settings.schemeStrTerms !== null ? (
                          <Fragment>
                            {this.getSeparator(1, classes.separator)}
                            <div style={{ whiteSpace: 'break-spaces' }}>
                              <p
                                style={{
                                  fontWeight: 600,
                                  paddingTop: '0px',
                                  paddingBottom: '0px',
                                  marginTop: '0px',
                                  marginBottom: '0px'
                                }}
                              >
                                TERMS AND CONDITIONS
                              </p>
                              {settings.schemeStrTerms !== '' &&
                              settings.schemeStrTerms !== undefined &&
                              settings.schemeStrTerms !== null
                                ? settings.schemeStrTerms
                                : ''}
                            </div>
                          </Fragment>
                        ) : (
                          ''
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  {this.getSeparator(1, classes.separator)}
                  {this.getSeparator(1, classes.separator)}
                </Grid>
              </div>
            ))
          : ''}
      </div>
    );
  }
}
export default withStyles(styles)(SchemeManagementRegularPrint);