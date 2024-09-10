import React from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import BarcodeGenerator from 'src/components/BarcodeGenerator';
import { type } from 'process';

const styles = (theme) => ({
  labelStyle: {
    width: '65mm',
    height: '34mm'
  },
  labelDivStyle: {
    margin: '10px',
    padding: '10px',
    
    // width: '65mm',
    // height: '34mm',
  },
  address: {
    whiteSpace: 'break-spaces',
    maxHeight: '60px',
    overflow: 'hidden'
  }
});

class BarcodeRegularPrinterComponent extends React.PureComponent {
  render() {
    const { classes } = this.props;
    let _data = [];
    let _detailData = [];
    if (this.props && this.props.data) {
      _data = this.props.data;
      _detailData = this.props.detailData;
    }
    console.log(this.props.detailData);

    return (
      <>
        <div>
          <>
            {_data.map((subArray, index) => (
              <>
                <Grid container>
                  {subArray.map((ele, index) => (
                    <>
                      <Grid
                        item
                        xs={4}
                        key={index}
                        className={classes.labelStyle}
                        style={{ marginLeft: '0px', breakInside: 'avoid' }}
                      >
                        <div
                          className={classes.labelDivStyle}
                          style={{
                            paddingBottom: '4px',
                            marginLeft: index % 3 === 0 && '0px',
                            paddingLeft: index % 3 === 0 && '0px',
                            marginRight: index % 3 === 0 && '20px',
                            marginTop: '10px'
                          }}
                        >
                          <div style={{ fontSize: 10, textAlign: 'left' }}>
                            {ele.enablePurchasePriceCode
                              ? ele.purchasePriceCode
                              : ''}
                          </div>
                          <div style={{ fontSize: 12, textAlign: 'center' }}>
                            {ele.header ? ele.header : ''}
                          </div>
                          {ele.header ? <hr /> : ''}
                          <div style={{ width: '100%', textAlign: 'center' }}>
                            <div style={{ fontSize: 10 }}>{ele.line}</div>
                            {ele.barcode !== 'Item Code' && ele.barcode !=='' && (
                              <div style={{ fontSize: 10 }}>
                                <BarcodeGenerator
                                  barcode={ele.barcode}
                                  size={_detailData.size}
                                  type={_detailData.sizeType}
                                  customData={_detailData.customData}
                                />
                              </div>
                            )}
                          </div>

                          <div
                            style={{
                              fontSize: 10,
                              width: '100%',
                              display: 'flex',
                              flexDirection: 'row'
                            }}
                          >
                            <div style={{width: '50%', textAlign: 'left' }}>
                              {ele.enableMrp && ele.mrpValue !== ''
                                ? 'MRP: ₹' + ele.mrpValue
                                : ''}
                            </div>
                            <div style={{width: '50%', textAlign: 'right' }}>
                              {ele.enableOfferPrice &&
                              ele.offerPriceValue !== ''
                                ? 'OFFER PRICE: ₹' + ele.offerPriceValue
                                : ''}
                            </div>
                          </div>
                          {ele.barcode !== 'Item Code' ? <hr /> : ''}
                          <div
                            style={{
                              fontSize: 8,
                              width: '100%',
                              textAlign: 'center'
                            }}
                          >
                            {ele.description ? ele.description : ''}
                          </div>
                        </div>
                      </Grid>
                    </>
                  ))}
                </Grid>
              </>
            ))}
          </>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(BarcodeRegularPrinterComponent);