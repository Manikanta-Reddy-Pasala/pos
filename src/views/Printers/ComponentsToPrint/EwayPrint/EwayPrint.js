import React, { Fragment } from 'react';
import { Grid, Box, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import './ewayPrint.css';
import QRCode from 'react-qr-code';
import Barcode from 'react-barcode';
import * as ewayHelper from 'src/components/Helpers/EWayHelper';

const numberToText = require('number-to-text');
require('number-to-text/converters/en-in'); // load converter

const styles = (theme) => ({
  paperBox: {
    fontSize: '12px',
    width: '500px',
    padding: '10px',
    border: '1px solid'
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

class EwayPrint extends React.PureComponent {
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
      qrCodeGSTIN: '',
      ewayBillNo: '',
      ewayBillDate: '',
      generatedBy: '',
      validFrom: '',
      validUntill: '',
      gstnSupplier: '',
      placeOfDispatch: '',
      gstnRecipient: '',
      placeOfDelivery: '',
      valueOfGoods: '',
      hsnCode: '',
      reasonForTransp: '',
      modeOfTransp: '',
      vehicleNo: '',
      docNo: '',
      docDate: '',
      fromPlace: '',
      enteredDate: '',
      enteredBy: '',
      docType: ''
    };

    if (this.props && this.props.data) {
      _data = this.props.data;
    }

    console.log(_data);

    data.ewayBillNo = _data.ewayBillNo;
    data.ewayBillDate = _data.ewayBillGeneratedDate;
    data.enteredDate = _data.ewayBillGeneratedDate;
    
    if (_data.ewayBillDetails) {
      data.qrCodeGSTIN = _data.ewayBillDetails.fromGstin;
      data.generatedBy = _data.ewayBillDetails.fromTrdName;
      data.validFrom = data.ewayBillDate;
      /* data.validUntill = _data.ewayBillValidDate; */
      data.validUntill = _data.ewayBillDetails.ewayBillValidDate;
      data.gstnSupplier = _data.ewayBillDetails.fromGstin;
      data.placeOfDispatch = _data.ewayBillDetails.fromPlace;
      data.gstnRecipient = _data.ewayBillDetails.toGstin;
      data.placeOfDelivery = _data.ewayBillDetails.toAddr1;
      data.docNo = _data.ewayBillDetails.docNo;
      data.docDate = _data.ewayBillDetails.docDate;
      data.docType = _data.ewayBillDetails.docType;
      data.valueOfGoods = _data.ewayBillDetails.totInvValue;
      data.vehicleNo = _data.ewayBillDetails.vehicleNo;
      data.fromPlace = _data.ewayBillDetails.from_place;
      data.enteredBy = _data.ewayBillDetails.fromTrdName;

      let subSupply = _data.ewayBillDetails
        ? ewayHelper
            .getEWaySubSupplyTypes()
            .find((e) => e.val === _data.ewayBillDetails.subSupplyType)
        : 'NA';

      let subSupplyTypeVal = '';

      if (subSupply) {
        subSupplyTypeVal = subSupply ? subSupply.name : 'NA';
      }

      let supplyTypeVal = '';

      let supply = _data.ewayBillDetails
        ? ewayHelper
            .getEWaySupplyTypes()
            .find((e) => e.val === _data.ewayBillDetails.supplyType)
        : 'NA';

      if (supply) {
        supplyTypeVal = supply ? supply.name : 'NA';
      }

      data.reasonForTransp = supplyTypeVal + ' - ' + subSupplyTypeVal;

      let transMode = ewayHelper
        .getTransportationModes()
        .find((e) => e.val === _data.ewayBillDetails.transMode);

      let transModeVal = '';

      if (transMode === 'NA') {
        transModeVal = transMode;
      } else {
        transModeVal = transMode ? transMode.name : 'NA';
      }

      data.modeOfTransp = transModeVal;
    } else if (_data.einvoiceDetails) {
      data.qrCodeGSTIN = _data.einvoiceDetails.sellerDtls
        ? _data.einvoiceDetails.sellerDtls.gstin
        : 'NA';
      data.generatedBy = _data.einvoiceDetails.sellerDtls
      ? _data.einvoiceDetails.sellerDtls.lglNm
      : 'NA';
      data.validFrom = _data.einvoiceDetails.ewbDt;
      data.validUntill = _data.einvoiceDetails.ewbValidTill;
      data.gstnSupplier = _data.einvoiceDetails.sellerDtls
        ? _data.einvoiceDetails.sellerDtls.gstin
        : 'NA';
      data.placeOfDispatch = _data.einvoiceDetails.sellerDtls
        ? _data.einvoiceDetails.sellerDtls.loc
        : 'NA';
      data.gstnRecipient = _data.einvoiceDetails.buyerDtls
        ? _data.einvoiceDetails.buyerDtls.gstin
        : 'NA';
      data.placeOfDelivery = _data.einvoiceDetails.buyerDtls
        ? _data.einvoiceDetails.buyerDtls.addr1
        : 'NA';
      data.docNo = _data.einvoiceDetails.docDtls
        ? _data.einvoiceDetails.docDtls.no
        : 'NA';
      data.docDate = _data.einvoiceDetails.docDtls
        ? _data.einvoiceDetails.docDtls.dt
        : 'NA';
      data.valueOfGoods = _data.einvoiceDetails.valDtls
        ? _data.einvoiceDetails.valDtls.totInvVal
        : 'NA';
      data.vehicleNo = _data.einvoiceDetails.ewbDtls
        ? _data.einvoiceDetails.ewbDtls.vehNo
        : 'NA';
      data.fromPlace = _data.einvoiceDetails.sellerDtls
        ? _data.einvoiceDetails.sellerDtls.loc
        : 'NA';
      data.enteredBy = _data.einvoiceDetails.sellerDtls
        ? _data.einvoiceDetails.sellerDtls.lglNm
        : 'NA';

      if (
        _data.einvoiceDetails.docDtls &&
        'INV' === _data.einvoiceDetails.docDtls.typ
      ) {
        data.reasonForTransp = 'Outward - Supply';
      }

      let transMode = _data.einvoiceDetails.ewbDtls
        ? ewayHelper
          .getTransportationModes()
          .find((e) => e.val === parseInt(_data.einvoiceDetails.ewbDtls.transMode)
        ) : 'NA';

      let transModeVal = '';

      if (transMode === 'NA') {
        transModeVal = transMode;
      } else {
        transModeVal = transMode ? transMode.name : 'NA';
      }

      data.modeOfTransp = transModeVal;
    }

    data.hsnCode = 'NA';

    if (
      _data.ewayBillDetails &&
      _data.ewayBillDetails.itemList &&
      _data.ewayBillDetails.itemList.length > 0
    ) {
      let maxQty = 0;
      for (let item of _data.ewayBillDetails.itemList) {
        if (maxQty === 0) {
          maxQty = item.quantity;
          data.hsnCode = item.hsnCode;
        } else if (item.quantity > maxQty) {
          maxQty = item.quantity;
          data.hsnCode = item.hsnCode;
        }
      }
    }

    if (
      _data.einvoiceDetails &&
      _data.einvoiceDetails.itemList &&
      _data.einvoiceDetails.itemList.length > 0
    ) {
      let maxQty = 0;
      for (let item of _data.einvoiceDetails.itemList) {
        if (maxQty === 0) {
          maxQty = item.qty;
          data.hsnCode = item.hsnCd;
        } else if (item.quantity > maxQty) {
          maxQty = item.qty;
          data.hsnCode = item.hsnCd;
        }
      }
    }

    const getHeaderRow = () => {
      return (
        <>
          <div className="headerRow">
            <div style={{ width: '20%', textAlign: 'left' }}>
              <b>Mode</b>
            </div>
            <div style={{ width: '20%', textAlign: 'left' }}>
              <b>Vehicle No</b>
              <br />
              <b>Doc No. & Date</b>
            </div>
            <div style={{ width: '20%', textAlign: 'left' }}>
              <b>From</b>
            </div>
            <div style={{ width: '20%', textAlign: 'left' }}>
              <b>Entered Date</b>
            </div>
            <div style={{ width: '20%', textAlign: 'left' }}>
              <b>Entered By</b>
            </div>
          </div>
        </>
      );
    };

    const getDetailRows = () => {
      /*  return _data.item_list.map((item, index) => {*/
      return (
        <>
          <div className="detailRow">
            <div style={{ width: '20%', textAlign: 'left' }}>
              <b>{data.modeOfTransp}</b>
            </div>
            <div style={{ width: '20%', textAlign: 'left' }}>
              <b>{data.vehicleNo}</b>
              <br />
              <b>
                {data.docNo} - {data.docDate}
              </b>
            </div>
            <div style={{ width: '20%', textAlign: 'left' }}>
              <b>{data.fromPlace}</b>
            </div>
            <div style={{ width: '20%', textAlign: 'left' }}>
              <b>{data.enteredDate}</b>
            </div>
            <div style={{ width: '20%', textAlign: 'left' }}>
              {/* <b>{_data.ewayBillDetails ? _data.ewayBillDetails.fromTrdName : 'NA'}</b> */}
              <b>{data.enteredBy}</b>
            </div>
          </div>
        </>
      );
      /* }); */
    };

    return (
      
        <div className={classes.paperBox} style={{ color: 'black' }}>
          <div style={{ textAlign: 'center', border: '1px solid' }}>
            {this.getSeparator(1, classes.separator)}
            <b>E-Way Bill / Slip</b>
            {this.getSeparator(1, classes.separator)}
          </div>
          
              <div
                style={{
                  marginBottom: '15px',
                  textAlign: 'center',
                  border: '1px solid'
                }}
              >
                {this.getSeparator(1, classes.separator)}
                <QRCode
                  value={
                    'EWBNo: ' +
                    data.ewayBillNo +
                    '<br/>' +
                    'UserGstin: ' +
                    data.qrCodeGSTIN +
                    '<br/>' +
                    'GenDate: ' +
                    data.ewayBillDate
                  }
                  size={100}
                />
              </div>
           
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <div style={{ width: '40%' }}>E-way Bill No.:</div>
            <div>
              <b>{data.ewayBillNo}</b>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <div style={{ width: '40%' }}>E-way Bill Date:</div>
            <div>
              <b>{data.ewayBillDate}</b>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <div style={{ width: '40%' }}>Generated By:</div>
            <div>
              <b>{data.generatedBy}</b>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <div style={{ width: '40%' }}>Valid From:</div>
            <div>
              <b>{data.validFrom}</b>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <div style={{ width: '40%' }}>Valid Until:</div>
            <div>
              <b>{data.validUntill}</b>
            </div>
          </div>
          <div
            style={{
              textAlign: 'center',
              width: '100%',
              marginTop: '15px',
              marginBottom: '15px',
              border: '1px solid'
            }}
          >
            <b>Part A</b>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <div style={{ width: '40%' }}>GSTIN of Supplier:</div>
            <div>
              <b>{data.gstnSupplier}</b>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <div style={{ width: '40%' }}>Place of Dispatch:</div>
            <div>
              <b>{data.placeOfDispatch}</b>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <div style={{ width: '40%' }}>GSTIN of Recipient:</div>
            <div>
              <b>{data.gstnRecipient}</b>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <div style={{ width: '40%' }}>Place of Delivery:</div>
            <div>
              <b>{data.placeOfDelivery}</b>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <div style={{ width: '40%' }}>Document No.:</div>
            <div>
              <b>{data.docNo}</b>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <div style={{ width: '40%' }}>Document Date:</div>
            <div>
              <b>{data.docDate}</b>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <div style={{ width: '40%' }}>Value of Goods:</div>
            <div>
              <b>{data.valueOfGoods}</b>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <div style={{ width: '40%' }}>HSN Code:</div>
            <div>
              <b>{data.hsnCode}</b>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <div style={{ width: '40%' }}>Reason for Transportation:</div>
            <div>
              <b>{data.reasonForTransp}</b>
            </div>
          </div>

          <div
            style={{
              textAlign: 'center',
              width: '100%',
              marginTop: '15px',
              marginBottom: '15px',
              border: '1px solid'
            }}
          >
            <b>Part B</b>
          </div>
          {getHeaderRow()}
          {getDetailRows()}
          <div style={{ textAlign: 'center', border: '1px solid' }}>
            <>
              {this.getSeparator(1, classes.separator)}
              <Barcode value={data.ewayBillNo} size={50} />
            </>
          </div>
        </div>
      
    );
  }
}
export default withStyles(styles)(EwayPrint);