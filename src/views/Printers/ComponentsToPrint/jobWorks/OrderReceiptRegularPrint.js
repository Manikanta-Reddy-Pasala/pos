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

class OrderReceiptRegularPrint extends React.PureComponent {
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
      notes: '',
      purity: '',
      grossWeight: '',
      netWeight: ''
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
      let name = _data.vendorName ? _data.vendorName : 'NA';
      let phNo = _data.vendorPhoneNo ? _data.vendorPhoneNo : '';
      let address = _data.vendorAddress ? _data.vendorAddress : '';
      let gstNo = _data.vendorGstNumber ? 'GST: ' + _data.vendorGstNumber : '';
      data.billTitle = '<strong>Bill From</strong>';
      data.invoiceNoTitle = 'Receipt No';
      data.mainTitle = 'Work Order Receipt';
      data.invoiceNumber = _data.receiptSequenceNumber;

      data.billTo = name + '<br/>' + phNo + '<br/>' + address + '<br/>' + gstNo;

      data.date = _data.receiptDate;
      data.totalAmount = _data.totalAmount;
      data.notes = _data.receiptNotes;

      data.purity = _data.purity;
      data.grossWeight = _data.grossWeight;
      data.netWeight = _data.netWeight;

      /****************Number to Rupees with Paise*********/

      const strTotInt = numberToText.convertToText(
        Math.trunc(_data.totalAmount)
      );
      const decimalStr = _data.totalAmount.toString().split('.')[1];
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
      console.log('Data rendered: ' + _data.receiptNumber);
      mapPrintableData();
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
    console.log('customPrintOptions_5', format);

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
                            {item.name != '' && (
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
                        <p className={classes.strong}>
                          INVOICE AMOUNT IN WORDS
                        </p>
                        <p
                          className={classes.greyBackground}
                          style={{ textTransform: 'capitalize' }}
                        >
                          {data.strTotal}
                        </p>
                        {this.getSeparator(1, classes.separator)}
                        {data.notes && (
                          <Fragment>
                            <p className={classes.strong}>Receipt Notes</p>
                            <p className={classes.greyBackground}>
                              {data.notes}
                            </p>
                          </Fragment>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  {this.getSeparator(1, classes.separator)}
                  {this.getSeparator(1, classes.separator)}
                  <Grid container>
                    <Grid item xs={4} style={{ textAlign: 'left' }}>
                      <p className={classes.strong}>
                        Purity : <u>{data.purity}</u>
                      </p>
                    </Grid>
                    <Grid item xs={4} style={{ textAlign: 'center' }}>
                      <p className={classes.strong}>
                        Gross in gms: <u>{data.grossWeight}</u>
                      </p>
                    </Grid>
                    <Grid item xs={4} style={{ textAlign: 'right' }}>
                      <p className={classes.strong}>
                        Net. Wt. in gms: <u>{data.netWeight}</u>
                      </p>
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
export default withStyles(styles)(OrderReceiptRegularPrint);