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
    /* height: '200px',
    padding: '15px',
    width: '200px', */
    width: '95%',
    height: '95%',
    margin: '2%',
    padding: '2%',
    wordBreak: 'break-word'
  },
  p: {
    fontWeight: 'bold'
  },
  cardCol1: {
    width: '5%'
  },
  cardCol2: {
    width: '30%'
  },
  cardColHSN: {
    width: '20%',
    textAlign: 'right'
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
  },
  itemImageSize: {
    height: '50px',
    width: '50px',
    paddingBottom: '2px'
  }
});

class ApprovalRegularPrintContent extends React.PureComponent {
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
      notes: ''
    };
    let settings = {};
    let approvalTxnSettings = {};

    let totalqty = 0;
    let totaltax_gst = 0;
    let totalGrossWt = 0.0;
    let totalNetWt = 0.0;

    const gstMap = new Map();
    const approvalTxnEnableFieldsMap = new Map();

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
      let name = _data.employeeName ? _data.employeeName : 'NA';
      let phNo = _data.employeePhoneNumber ? _data.employeePhoneNumber : '';
      data.billTitle = '<strong>Approval To</strong>';
      data.invoiceNoTitle = 'Approval No';
      data.mainTitle = 'Approval Bill';
      data.invoiceNumber = _data.sequenceNumber;

      data.billTo = name + '<br/>' + phNo;

      data.date = _data.approvalDate;
      data.totalAmount = _data.totalAmount;
      data.notes = _data.notes;

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

    const getInvoiceRows = () => {
      totalGrossWt = 0.0;
      totalNetWt = 0.0;
      return _data.itemList.map((item, index) => {
        let mrp = parseFloat(item.mrp).toFixed(2);
        let offerPrice = parseFloat(item.offer_price).toFixed(2);

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

        if (item.grossWeight > 0) {
          totalGrossWt += parseFloat(item.grossWeight);
        }

        if (item.netWeight > 0) {
          totalNetWt += parseFloat(item.netWeight);
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
        let discountUnitPrice = 0;

        if (item.discount_amount > 0) {
          discountUnitPrice = parseFloat(item.discount_amount);
        }

        const discount = qty * (item.mrp - offer_price);
        data.totalDiscount += discount;
        const itemTotal = finalMRP * item.qty;

        return (
          <Grid className={classes.flexRow} key={`${index}value`}>
            <p className={classes.cardCol1}>{index + 1}</p>
            <div
              className={classes.cardCol2}
              style={{
                paddingLeft: '3px',
                display: 'flex',
                flexDirection: 'row'
              }}
            >
              <div
                style={{
                  paddingBottom: '3px',
                  paddingRight: '3px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div>
                  <p style={{ marginTop: '0px' }}>{item.item_name}</p>
                </div>
                {approvalTxnEnableFieldsMap.get('display_product_image') && (
                  <div style={{ paddingTop: '2px' }}>
                    <Box
                      component="img"
                      className={classes.itemImageSize}
                      src={item.imageUrl}
                    />
                  </div>
                )}
                {approvalTxnEnableFieldsMap.get(
                  'display_product_description'
                ) && (
                  <div style={{ paddingTop: '2px' }}>
                    <p>{item.description}</p>
                  </div>
                )}
              </div>
            </div>
            {/* <p className={classes.cardCol2}>{item.item_name}</p> */}

            {approvalTxnEnableFieldsMap.get('display_hsn') ? (
              <p className={classes.cardColHSN}>{item.hsn}</p>
            ) : (
              <p className={classes.cardColHSN}></p>
            )}

            {/* Batch Number */}
            {approvalTxnEnableFieldsMap.get('display_product_batch_number') && (
              <p className={classes.cardColOther}>{item.batch_id}</p>
            )}

            {/* Manufacturing Date */}
            {approvalTxnEnableFieldsMap.get(
              'display_product_manufacturing_date'
            ) && <p className={classes.cardColOther}>{item.mfgDate}</p>}

            {/* Expirty Date */}
            {approvalTxnEnableFieldsMap.get('display_product_expiry_date') && (
              <p className={classes.cardColOther}>{item.expiryDate}</p>
            )}

            <p className={classes.cardColOther}>{item.amount}</p>

            {approvalTxnSettings &&
              approvalTxnEnableFieldsMap.get('display_product_qty') && (
                <p className={classes.cardColOther}>{item.qty}</p>
              )}

            {approvalTxnSettings &&
              approvalTxnEnableFieldsMap.get(
                'display_product_gross_weight'
              ) && <p className={classes.cardColOther}>{item.grossWeight}</p>}

            {approvalTxnSettings &&
              approvalTxnEnableFieldsMap.get('display_product_wastage') && (
                <>
                  <p className={classes.cardColOther}>
                    {item.wastagePercentage
                      ? item.wastagePercentage + '%'
                      : item.wastageGrams
                      ? item.wastageGrams + 'g'
                      : '0g'}
                  </p>
                </>
              )}

            {approvalTxnSettings &&
            approvalTxnEnableFieldsMap.get('display_product_net_weight') ? (
              <p className={classes.cardColOther}>{item.netWeight}</p>
            ) : (
              <p className={classes.cardColOther}></p>
            )}

            {approvalTxnSettings &&
            approvalTxnEnableFieldsMap.get('display_product_purity') ? (
              <p className={classes.cardColSale}>{item.purity}</p>
            ) : (
              <p className={classes.cardColSale}></p>
            )}

            {approvalTxnSettings &&
              approvalTxnEnableFieldsMap.get(
                'display_product_making_charge'
              ) && (
                <p className={classes.cardColOther}>
                  {item.makingChargeAmount}
                </p>
              )}

            {approvalTxnSettings &&
              approvalTxnEnableFieldsMap.get(
                'display_product_making_charge_per_gram'
              ) && (
                <p className={classes.cardColOther}>
                  {item.makingChargePerGramAmount}
                </p>
              )}

            {approvalTxnSettings &&
              approvalTxnEnableFieldsMap.get('display_product_gst') && (
                <p className={classes.cardColOther}>
                  ₹ {getFloatWithTwoDecimal(totalGST)}
                </p>
              )}

            <p className={classes.cardColOther}>
              ₹ {getFloatWithTwoDecimal(item.amount)}
            </p>
          </Grid>
        );
      });
    };

    const getGSTRows = () => {
      if (_data.itemList) {
        _data.itemList.forEach((item) => {
          if (!item) {
            return;
          }
          let mrp = parseFloat(item.mrp).toFixed(2);
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

    if (this.props && this.props.approvalTxnSettings) {
      approvalTxnSettings = this.props.approvalTxnSettings;

      this.approvalTxnEnableFieldsMap = new Map();
      if (approvalTxnSettings) {
        const productLevel = approvalTxnSettings.displayOnBill.productLevel;
        productLevel.map((item) => {
          if (approvalTxnEnableFieldsMap.has(item.name)) {
            approvalTxnEnableFieldsMap.set(item.name, item.enabled);
          } else {
            approvalTxnEnableFieldsMap.set(item.name, item.enabled);
          }
        });

        const billLevel = approvalTxnSettings.displayOnBill.billLevel;
        billLevel.map((item) => {
          if (approvalTxnEnableFieldsMap.has(item.name)) {
            approvalTxnEnableFieldsMap.set(item.name, item.enabled);
          } else {
            approvalTxnEnableFieldsMap.set(item.name, item.enabled);
          }
        });
      }
    }

    if (this.props && this.props.data) {
      _data = this.props.data;
      settings = this.props.settings;
      console.log('Data rendered: ' + _data.sequenceNumber);
      console.log('Data rendered: ' + _data.notes);
      console.log('Data rendered: ' + _data.itemList);
      mapPrintableData();
      getGSTRows();
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
    console.log("customPrintOptions_3", format);

    return (
      <div>
        {this.props && this.props.data ? format.map((item, index) => (
          <div
            className={classes.paperBox} style={{pageBreakAfter: 'always' }}
            /* style={{ width: '98%', height: '99%' }} */
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
                    {data.invoiceNumber}{' '}
                  </b>
                  <br />
                  Date: {dateFormatter(data.date)}
                </p>
              </Grid>
            </Grid>

            {this.getSeparator(1, classes.separator)}

            <Grid>
              <Grid className={classnames([classes.flexRow, classes.strong])}>
                <p className={classes.cardCol1}>#</p>
                <p className={classes.cardCol2}>Item name</p>

                {approvalTxnSettings &&
                approvalTxnEnableFieldsMap.get('display_hsn') ? (
                  <p className={classes.cardColHSN}>HSN</p>
                ) : (
                  <p className={classes.cardColHSN}></p>
                )}

                {/* Batch Number */}
                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get(
                    'display_product_batch_number'
                  ) && <p className={classes.cardColOther}>Batch No.</p>}

                {/* Manufacturing Date */}
                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get(
                    'display_product_manufacturing_date'
                  ) && <p className={classes.cardColOther}>MFG Dt.</p>}

                {/* Expiry Date */}
                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get(
                    'display_product_expiry_date'
                  ) && <p className={classes.cardColOther}>EXP Dt.</p>}

                <p className={classes.cardColOther}>Price</p>

                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get('display_product_qty') && (
                    <p className={classes.cardColOther}>Qty</p>
                  )}

                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get(
                    'display_product_gross_weight'
                  ) && <p className={classes.cardColOther}>G. Wt(g)</p>}

                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get('display_product_wastage') && (
                    <p className={classes.cardColOther}>Wastage</p>
                  )}

                {approvalTxnSettings &&
                approvalTxnEnableFieldsMap.get('display_product_net_weight') ? (
                  <p className={classes.cardColOther}>N. Wt(g)</p>
                ) : (
                  <p className={classes.cardColOther}></p>
                )}

                {approvalTxnSettings &&
                approvalTxnEnableFieldsMap.get('display_product_purity') ? (
                  <p className={classes.cardColSale}>Purity</p>
                ) : (
                  <p className={classes.cardColSale}></p>
                )}

                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get(
                    'display_product_making_charge'
                  ) && <p className={classes.cardColOther}>MC</p>}

                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get(
                    'display_product_making_charge_per_gram'
                  ) && <p className={classes.cardColOther}>MC/g</p>}

                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get('display_product_gst') && (
                    <p className={classes.cardColOther}>GST</p>
                  )}

                <p className={classes.cardColOther}>Value</p>
              </Grid>
              <hr />
              {_data.itemList && _data.itemList.length > 0 && getInvoiceRows()}

              {this.getSeparator(3, classes.separator)}
              <hr />
              <Grid className={classnames([classes.flexRow, classes.strong])}>
                <p className={classes.cardCol1}></p>
                <p className={classes.cardCol2}>Total</p>

                {/* HSN */}
                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get('display_hsn') && (
                    <p className={classes.cardColHSN}></p>
                  )}

                {/* Batch Number */}
                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get(
                    'display_product_batch_number'
                  ) && <p className={classes.cardColOther}></p>}

                {/* Manufacturing Date */}
                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get(
                    'display_product_manufacturing_date'
                  ) && <p className={classes.cardColOther}></p>}

                {/* Expiry Date */}
                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get(
                    'display_product_expiry_date'
                  ) && <p className={classes.cardColOther}></p>}

                {/* for Price */}
                <p className={classes.cardColOther}></p>

                {/* for Quanity */}
                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get('display_product_qty') && (
                    <p className={classes.cardColOther}>{totalqty}</p>
                  )}

                {/* for Gross Weight */}
                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get(
                    'display_product_gross_weight'
                  ) && <p className={classes.cardColOther}>{totalGrossWt}</p>}

                {/* for Wastage*/}
                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get('display_product_wastage') && (
                    <p className={classes.cardColOther}></p>
                  )}

                {/* for Net Weight*/}
                {approvalTxnSettings &&
                approvalTxnEnableFieldsMap.get('display_product_net_weight') ? (
                  <p className={classes.cardColOther}>{totalNetWt}</p>
                ) : (
                  <p className={classes.cardColOther}></p>
                )}

                {/* for Purity*/}
                {approvalTxnSettings &&
                approvalTxnEnableFieldsMap.get('display_product_purity') ? (
                  <p className={classes.cardColSale}></p>
                ) : (
                  <p className={classes.cardColSale}></p>
                )}

                {/* for Making Charges*/}
                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get(
                    'display_product_making_charge'
                  ) && <p className={classes.cardColOther}></p>}

                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get(
                    'display_product_making_charge_per_gram'
                  ) && <p className={classes.cardColOther}></p>}

                {approvalTxnSettings &&
                  approvalTxnEnableFieldsMap.get('display_product_gst') && (
                    <p className={classes.cardColOther}></p>
                  )}

                <p className={classes.cardColOther}>
                  ₹ {getFloatWithTwoDecimal(data.subTotal)}
                </p>
              </Grid>
              <hr />

              {this.getSeparator(2, classes.separator)}

              <Grid className={classes.flexRow}>
                <Grid className={classes.cardColFlex}>
                  <Grid className={classes.flexColumn}>
                    {approvalTxnEnableFieldsMap.get('enable_bill_notes') &&
                      data.notes && (
                        <Fragment>
                          <p className={classes.strong}>Notes</p>
                          <p className={classes.greyBackground}>{data.notes}</p>
                        </Fragment>
                      )}
                    {this.getSeparator(1, classes.separator)}
                    <p className={classes.strong}>INVOICE AMOUNT IN WORDS</p>
                    <p
                      className={classes.greyBackground}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {data.strTotal}
                    </p>
                  </Grid>
                </Grid>
                <Grid className={classes.cardCol40percent}>
                  <Grid
                    className={classnames([
                      classes.flexRow,
                      classes.alignRight
                    ])}
                  >
                    <p>Sub Total</p>
                    <p className={classes.cardColFlex}>
                      ₹ {getFloatWithTwoDecimal(data.subTotal)}
                    </p>
                  </Grid>

                  {settings.boolTaxDetails && (
                    <Grid
                    // className={classnames([
                    //   classes.flexRow,
                    //   classes.alignRight
                    // ])}
                    >
                      <p>
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
                  )}
                  {String(_data.is_roundoff).toLowerCase() === 'true' && (
                    <Grid
                      className={classnames([
                        classes.flexRow,
                        classes.alignRight
                      ])}
                    >
                      <p className={classes.strong}>Round off</p>
                      <p
                        className={classnames([
                          classes.cardColFlex,
                          classes.strong
                        ])}
                      >
                        ₹ {getFloatWithTwoDecimal(_data.round_amount)}
                      </p>
                    </Grid>
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
export default withStyles(styles)(ApprovalRegularPrintContent);
