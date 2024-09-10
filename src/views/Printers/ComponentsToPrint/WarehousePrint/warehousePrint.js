import React, { Fragment } from 'react';
import { Grid, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import './warehouse.css';

const numberToText = require('number-to-text');
require('number-to-text/converters/en-in'); // load converter

const styles = (theme) => ({
  paperBox: {
    fontSize: '9px',
    width: 'auto',
    padding: '10px',
    wordBreak: 'break-word'
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column'
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
  }
});

class WareHousePrint extends React.PureComponent {
  getSeparator = (rows, separator) => {
    const separators = [];
    for (let i = 0; i <= rows; i++) {
      separators.push(<div key={i} className={separator}></div>);
    }
    return separators;
  };

  render() {
    const { classes } = this.props;
    const data = {
      invoiceNumber: '',
      partyName: '',
      date: ''
    };
    let settings = {};
    let _data = {};

    const mapPrintableData = () => {
      if (_data.sequenceNumber) {
        data.invoiceNumber = _data.sequenceNumber;
        data.partyName = _data.customer_name;
        data.date = _data.invoice_date;
      } else if (_data.bill_number) {
        data.invoiceNumber = _data.vendor_bill_number;
        data.partyName = _data.vendor_name;
        data.date = _data.bill_date;
      }
    };

    if (this.props && this.props.data) {
      _data = this.props.data;
      settings = this.props.settings;
      mapPrintableData();
    }

    function dateFormatter(date) {
      var dateParts = date.split('-');
      if (dateParts.length >= 3) {
        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    }

    const getCompanyDetails = () => {
      return (
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
              </p>
            </Grid>
          </Grid>
        </div>
      );
    };

    const getWarehouseDetails = () => {
      return (
        <>
          <div>
            <h1>
              <center>
                <b>Warehouse Receipt</b>
              </center>
            </h1>
          </div>
          {this.getSeparator(2, classes.separator)}
          <div
            style={{
              border: '1px solid',
              width: '100%',
              display: 'flex',
              flexDirection: 'row'
            }}
          >
            <div style={{ width: '30%', paddingLeft: '10px' }}>
              <p>
                <b>Invoice No: {data.invoiceNumber}</b>
              </p>
            </div>
            <div style={{ width: '30%' }}>
              <p>
                <b>Party Name: {data.partyName}</b>
              </p>
            </div>
            <div
              style={{ width: '40%', paddingRight: '10px', textAlign: 'end' }}
            >
              <p>
                <b>Date: {dateFormatter(data.date)}</b>
              </p>
            </div>
          </div>
        </>
      );
    };

    const getHeaderRow = () => {
      return (
        <>
          <div className="headerRow">
            <div
              style={{
                width: '20%',
                textAlign: 'center',
                borderRight: '1px solid'
              }}
            >
              <b>No.</b>
            </div>
            <div
              style={{
                width: '50%',
                textAlign: 'center',
                borderRight: '1px solid'
              }}
            >
              <b>Item Name</b>
            </div>
            <div style={{ width: '15%', textAlign: 'center' }}>
              <b>HSN</b>
            </div>
            <div
              style={{
                width: '15%',
                textAlign: 'center',
                borderRight: '1px solid'
              }}
            >
              <b>Qty</b>
            </div>
          </div>
        </>
      );
    };

    let totQty = 0;
    const getDetailRows = () => {
      totQty = 0;
      return _data.item_list.map((item, index) => {
        totQty += item.qty;
        return (
          <>
            <div key={index} className="detailRow">
              <div
                style={{
                  width: '20%',
                  textAlign: 'center',
                  borderRight: '1px solid'
                }}
              >
                <p>{index + 1}</p>
              </div>
              <div
                style={{
                  width: '50%',
                  paddingLeft: '5px',
                  borderRight: '1px solid'
                }}
              >
                <p>{item.item_name}</p>
              </div>
              <div
                style={{
                  width: '15%',
                  textAlign: 'center',
                  borderRight: '1px solid'
                }}
              >
                <p>{item.hsn}</p>
              </div>
              <div style={{ width: '15%', textAlign: 'center' }}>
                <p>{item.qty}</p>
              </div>
            </div>
          </>
        );
      });
    };

    const getFooterRow = () => {
      return (
        <>
          <div className="footerRow">
            <div style={{ width: '15%', textAlign: 'center' }}></div>
            <div
              style={{
                width: '70%',
                textAlign: 'right',
                paddingTop: '5px',
                paddingRight: '5px',
                borderRight: '1px solid',
                verticalAlign: 'middle'
              }}
            >
              <b>Total</b>
            </div>
            <div
              style={{
                width: '15%',
                textAlign: 'center',
                borderRight: '1px solid'
              }}
            >
              <p>{totQty}</p>
            </div>
          </div>
        </>
      );
    };

    return (
      <div>
        {this.props && this.props.data ? (
          <div className={classes.paperBox}>
            <div>
              {getCompanyDetails()}
              {this.getSeparator(2, classes.separator)}
              {getWarehouseDetails()}
              {getHeaderRow()}
              {getDetailRows()}
              {getFooterRow()}
              {this.getSeparator(5, classes.separator)}
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
export default withStyles(styles)(WareHousePrint);
