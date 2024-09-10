import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  withStyles,
  Grid,
  IconButton,
  Typography,
  Container,
  Button,
  DialogContentText
} from '@material-ui/core';
import Controls from '../../components/controls/index';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import injectWithObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import BarcodeGenerator from '../../components/BarcodeGenerator';

import { BarcodeRegularPrintContent } from '../Printers/ComponentsToPrint/BarcodeRegularPrintContent';
import { BarcodePrinter } from '../Printers/ComponentsToPrint/BarcodePrintContent';
import { printThermal } from '../Printers/ComponentsToPrint/barcodePrintThermalContent';
import { printNormal } from '../Printers/ComponentsToPrint/printContent';
import RegularWithoutBarcodePreview from './RegularWithoutBarcodePreview';
import LabelRegularPrintComponent from './Printers/LabelRegularPrinter';
import BarcodeRegularPrintComponent from './Printers/BarcodeRegularPrinter';
import QRCode from 'react-qr-code';

const useStyles = makeStyles((theme) => ({
  productModalContent: {
    '& .grid-padding': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      '& .secondary-images': {
        '& button': {
          marginRight: theme.spacing(2)
        }
      }
    }
  },
  '& .grid-select': {
    selectedOption: {
      color: 'red'
    },
    marginLeft: '15px',
    '& .MuiFormControl-root': {
      width: '100%'
    },
    fullWidth: {
      width: '100%'
    }
  },

  alignCenter: {
    marginTop: 'auto',
    marginBottom: 'auto',
    textAlign: 'center'
  },
  mainArray: {
    display: 'table'
  },
  subArray: {
    display: 'table-cell'
  },
  container: {
    border: '1px solid #e4e4e4',
    boxShadow: '0 0 3px #ccc',
    width: 'fit-content',
    minWidth: '500px',
    minHeight: '400px'
  },
  defaultContainer: {
    width: 'fit-content',
    minWidth: '500px',
    minHeight: '400px'
  },
  customContainer: {
    border: '1px solid #e4e4e4',
    boxShadow: '0 0 3px #ccc',
    overflow: 'hidden'
  },
  Header: {
    fontSize: 9,
    color: 'black'
  },
  aligndiv: {
    position: 'absolute'
  },
  a4sheet: {
    width: '210mm',
    height: '297mm',
    boxShadow: 'rgb(204 204 204) 0px 0px 10px'
  },
  centerAlignvertical: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  labelStyle: {
    width: '64mm',
    height: '34mm'
  },
  labelDivStyle: {
    margin: '15px',
    padding: '10px',
    width: '64mm',
    height: '34mm'
    //textAlign: 'left'
  }
}));
const DialogTitle = withStyles((theme) => ({
  root: {
    '& h2': {
      fontSize: '22px'
    },
    '& .closeButton': {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.success[500]
    }
  }
}))(MuiDialogTitle);

function isOdd(num) {
  return num % 2;
}

const DialogActions = withStyles((theme) => ({
  root: {
    marginTop: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const PreviewModal = (props) => {
  const classes = useStyles();
  const stores = useStore();

  const [content, setContent] = useState('');
  const [labelRegularPrintEnable, setLabelRegularPrintEnable] = useState(false);
  const [barcodeRegularPrintEnable, setBarcodeRegularPrintEnable] =
    useState(false);

  const [message, setMessage] = React.useState('');
  const [openMessageDialog, setOpenMessageDialog] = React.useState(false);

  const {
    barcodeDataList,
    previewBarcodeDialog,
    BarcodeFinalArrayList,
    withoutBarcodeFinalArray
  } = toJS(stores.BarcodeStore);

  const { handelPreviewBarcodeClose } = stores.BarcodeStore;

  const handleCloseMessageDialog = () => {
    setMessage('');
    setOpenMessageDialog(false);
  };

  const printBarcode = () => {
    let printContent = '';
    setLabelRegularPrintEnable(false);
    setBarcodeRegularPrintEnable(false);
    if (props.labelType === 'withoutbarcode') {
      setLabelRegularPrintEnable(true);
    } else {
      if (props.printType === 'regular' && props.labelType === 'withbarcode') {
        setBarcodeRegularPrintEnable(true);

        setTimeout(() => {
          setBarcodeRegularPrintEnable(false);
        }, 1000);
      } else if (
        props.printType === 'regular' /* &&
        props.labelType === 'withbarcode' */
      ) {
        printContent = BarcodeRegularPrintContent(BarcodeFinalArrayList);
        setContent(printContent);
        printNormal(printContent);
      } else {
        printContent = BarcodePrinter(
          BarcodeFinalArrayList,
          props.size,
          props.sizeType,
          props.customData
        );
        printThermal(printContent);
      }
    }
  };

  useEffect(() => {
    if (props.customData) {
      if (props.customData.unit === 'mm') {
        props.customData.paperWidth = Number(
          props.customData.paperWidthDisplay * 3.77952
        ).toFixed();
        props.customData.paperHeight = Number(
          props.customData.paperHeightDisplay * 3.77952
        ).toFixed();
        props.customData.customWidth = Number(
          3.77952 * props.customData.customWidthDisplay
        ).toFixed();
        props.customData.customHeight = Number(
          3.77952 * props.customData.customHeightDisplay
        ).toFixed();
      }
      if (props.customData.unit === 'cm') {
        props.customData.paperWidth = Number(
          37.7952 * props.customData.paperWidthDisplay
        ).toFixed();
        props.customData.paperHeight = Number(
          37.7952 * props.customData.paperHeightDisplay
        ).toFixed();
        props.customData.customWidth = Number(
          37.7952 * props.customData.customWidthDisplay
        ).toFixed();
        props.customData.customHeight = Number(
          37.7952 * props.customData.customHeightDisplay
        ).toFixed();
      }
      if (props.customData.unit === 'px') {
        props.customData.paperWidth = Number(
          props.customData.paperWidthDisplay
        ).toFixed();
        props.customData.paperHeight = Number(
          props.customData.paperHeightDisplay
        ).toFixed();
        props.customData.customWidth = Number(
          props.customData.customWidthDisplay
        ).toFixed();

        props.customData.customHeight = Number(
          props.customData.customHeightDisplay
        ).toFixed();
      }
    }
  }, [props]);

  return (
    <>
      <Dialog
        open={previewBarcodeDialog}
        fullWidth={true}
        fullScreen={props.labelType === 'withoutbarcode' ? true : false}
        maxWidth={'lg'}
        // contentStyle={{ width : '50%', maxHeight: '80%' }}
        onClose={handelPreviewBarcodeClose}
      >
        <DialogTitle id="product-modal-title">
          Preview{' '}
          {props.labelType === 'withoutbarcode' ? (
            <span style={{ fontSize: 'small' }}>
              [{withoutBarcodeFinalArray.length} page(s)]
            </span>
          ) : (
            ''
          )}
          <IconButton
            aria-label="close"
            className="closeButton"
            onClick={handelPreviewBarcodeClose}
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        {props.labelType !== 'withoutbarcode' ? (
          <DialogContent className={classes.productModalContent}>
            <>
              {content === '' ? (
                <div>
                  {/* ---------------------------------- DEFAULT PREVIEW --------------------------------------- */}
                  {props.sizeType === 'default' &&
                    props.printType === 'label' && (
                      <Container className={classes.defaultContainer}>
                        {BarcodeFinalArrayList.map((option, index) => (
                          <div>
                            {index === 0 && (
                              <div>
                                {props.size !== 2 &&
                                props.size !== 1 &&
                                props.size !== 2.1 &&
                                props.size !== 1.1 &&
                                props.size !== 2.2 ? (
                                  <div className={classes.mainArray}>
                                    {option.map((subOption, subIndex) => (
                                      <div className={classes.subArray}>
                                        <div
                                          style={{
                                            width:
                                              props.size === 48
                                                ? '182.4px'
                                                : props.size === 65
                                                ? '144.4px'
                                                : props.size === 24
                                                ? '243.2px'
                                                : props.size === 12
                                                ? '380px'
                                                : 'auto',
                                            height:
                                              props.size === 48 ||
                                              props.size === 24
                                                ? '91.4px'
                                                : props.size === 65
                                                ? '79.8px'
                                                : props.size === 12
                                                ? '167.2px'
                                                : 'auto',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            margin:
                                              props.size === 48
                                                ? '0px'
                                                : props.size === 65
                                                ? '20px 30px 0px 30px'
                                                : props.size === 24
                                                ? '10px'
                                                : 'auto',
                                            overflow: 'hidden'
                                          }}
                                        >
                                          {(props.size === 48 ||
                                            props.size === 65) && (
                                            <div
                                              className={classes.alignCenter}
                                            >
                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.header.length <=
                                                    20
                                                      ? '11px'
                                                      : subOption.header
                                                          .length > 20
                                                      ? '8px'
                                                      : '5px'
                                                }}
                                              >
                                                {subOption.header
                                                  ? subOption.header
                                                  : ''}
                                              </Typography>

                                              <div
                                                style={{
                                                  width: '100%',
                                                  textAlign: 'center'
                                                }}
                                              >
                                                <BarcodeGenerator
                                                  barcode={subOption.barcode}
                                                  size={props.size}
                                                  type={props.sizeType}
                                                  customData={props.customData}
                                                />
                                              </div>

                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.line.length <= 20
                                                      ? '11px'
                                                      : subOption.line.length >
                                                        20
                                                      ? '8px'
                                                      : '3'
                                                }}
                                              >
                                                {subOption.line
                                                  ? subOption.line
                                                  : ''}
                                              </Typography>

                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.footer.length <=
                                                    20
                                                      ? '11px'
                                                      : subOption.footer
                                                          .length > 20
                                                      ? '8px'
                                                      : '3',
                                                  marginTop: '-4px'
                                                }}
                                                className={classes.Header}
                                              >
                                                {subOption.footer
                                                  ? subOption.footer
                                                  : ''}
                                              </Typography>
                                            </div>
                                          )}

                                          {props.size === 24 && (
                                            <div
                                              className={classes.alignCenter}
                                            >
                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.header.length <=
                                                    20
                                                      ? '14px'
                                                      : subOption.header
                                                          .length > 20
                                                      ? '12px'
                                                      : '11px'
                                                }}
                                              >
                                                {subOption.header
                                                  ? subOption.header
                                                  : ''}
                                              </Typography>

                                              <div
                                                style={{
                                                  width: '100%',
                                                  textAlign: 'center'
                                                }}
                                              >
                                                <BarcodeGenerator
                                                  barcode={subOption.barcode}
                                                  size={props.size}
                                                  type={props.sizeType}
                                                  customData={props.customData}
                                                />
                                              </div>

                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.line.length <= 20
                                                      ? '14px'
                                                      : subOption.line.length >
                                                        20
                                                      ? '12px'
                                                      : '11'
                                                }}
                                              >
                                                {subOption.line
                                                  ? subOption.line
                                                  : ''}
                                              </Typography>

                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.footer.length <=
                                                    20
                                                      ? '14px'
                                                      : subOption.footer
                                                          .length > 20
                                                      ? '12px'
                                                      : '11',
                                                  marginTop: '-4px'
                                                }}
                                                className={classes.Header}
                                              >
                                                {subOption.footer
                                                  ? subOption.footer
                                                  : ''}
                                              </Typography>
                                            </div>
                                          )}

                                          {props.size === 12 && (
                                            <div
                                              className={classes.alignCenter}
                                            >
                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.header.length <=
                                                    20
                                                      ? '19px'
                                                      : subOption.header
                                                          .length > 20
                                                      ? '16px'
                                                      : '13px',
                                                  fontWeight: 'bold',
                                                  color: 'black'
                                                }}
                                              >
                                                {subOption.header
                                                  ? subOption.header
                                                  : ''}
                                              </Typography>

                                              <div
                                                style={{
                                                  width: '100%',
                                                  textAlign: 'center'
                                                }}
                                              >
                                                <BarcodeGenerator
                                                  barcode={subOption.barcode}
                                                  size={props.size}
                                                  type={props.sizeType}
                                                  customData={props.customData}
                                                />
                                              </div>

                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.line.length <= 20
                                                      ? '19px'
                                                      : subOption.line.length >
                                                        20
                                                      ? '16px'
                                                      : '13',
                                                  fontWeight: 'bold',
                                                  color: 'black'
                                                }}
                                              >
                                                {subOption.line
                                                  ? subOption.line
                                                  : ''}
                                              </Typography>

                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.footer.length <=
                                                    20
                                                      ? '19px'
                                                      : subOption.footer
                                                          .length > 20
                                                      ? '16px'
                                                      : '13',
                                                  marginTop: '-4px',
                                                  color: 'black'
                                                }}
                                                className={classes.Header}
                                              >
                                                {subOption.footer
                                                  ? subOption.footer
                                                  : ''}
                                              </Typography>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div
                                    className={classes.aligndiv}
                                    style={{
                                      left:
                                        (option.length === 2 &&
                                          (props.size === 2 ||
                                            props.size === 2.2)) ||
                                        props.size === 1
                                          ? '19%'
                                          : props.size === 1.1
                                          ? '43%'
                                          : '35%',
                                      top:
                                        props.size === 2 ||
                                        props.size === 2.1 ||
                                        props.size === 2.2 ||
                                        props.size === 1.1
                                          ? '45%'
                                          : '34%'
                                    }}
                                  >
                                    {option.map((subOption, subIndex) => (
                                      <div className={classes.subArray}>
                                        <div
                                          style={{
                                            width:
                                              props.size === 2 ||
                                              props.size === 2.2
                                                ? '190px'
                                                : props.size === 1
                                                ? '380px'
                                                : props.size === 2.1 ||
                                                  props.size === 1.1
                                                ? '94px'
                                                : 'auto',
                                            height:
                                              props.size === 2
                                                ? '83.6px'
                                                : props.size === 1
                                                ? '190px'
                                                : props.size === 2.1 ||
                                                  props.size === 1.1
                                                ? '56.6px'
                                                : props.size === 2.2
                                                ? '190px'
                                                : 'auto',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            marginRight: 3,
                                            borderRadius: 6,
                                            boxShadow: '0 0 10px #ccc',
                                            overflow: 'hidden'
                                          }}
                                        >
                                          {(props.size === 2 ||
                                            props.size === 2.2) && (
                                            <div
                                              className={classes.alignCenter}
                                            >
                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.header.length <=
                                                    20
                                                      ? '11px'
                                                      : subOption.header
                                                          .length > 20
                                                      ? '8px'
                                                      : '5px',
                                                  minHeight: 20
                                                }}
                                              >
                                                {subOption.header
                                                  ? subOption.header
                                                  : ''}
                                              </Typography>

                                              <hr />

                                              <div
                                                style={{
                                                  width: '100%',
                                                  textAlign: 'center'
                                                }}
                                              >
                                                <BarcodeGenerator
                                                  barcode={subOption.barcode}
                                                  size={props.size}
                                                  type={props.sizeType}
                                                  customData={props.customData}
                                                />
                                              </div>

                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.line.length <= 20
                                                      ? '11px'
                                                      : subOption.line.length >
                                                        20
                                                      ? '8px'
                                                      : '3',
                                                  minHeight: 20
                                                }}
                                              >
                                                {subOption.line
                                                  ? subOption.line
                                                  : ''}
                                              </Typography>

                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.footer.length <=
                                                    20
                                                      ? '11px'
                                                      : subOption.footer
                                                          .length > 20
                                                      ? '8px'
                                                      : '3',
                                                  marginTop: '-4px',
                                                  minHeight: 20
                                                }}
                                                className={classes.Header}
                                              >
                                                {subOption.footer
                                                  ? subOption.footer
                                                  : ''}
                                              </Typography>

                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.description
                                                      .length <= 20
                                                      ? '11px'
                                                      : subOption.description
                                                          .length > 20
                                                      ? '8px'
                                                      : '3',
                                                  minHeight: 20
                                                }}
                                              >
                                                {subOption.description
                                                  ? subOption.description
                                                  : ''}
                                              </Typography>
                                            </div>
                                          )}

                                          {(props.size === 2.1 ||
                                            props.size === 1.1) && (
                                            <div
                                              className={classes.alignCenter}
                                            >
                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.header.length <=
                                                    20
                                                      ? '7px'
                                                      : subOption.header
                                                          .length > 20
                                                      ? '5px'
                                                      : '4px',
                                                  color: '#000000',
                                                  minHeight:
                                                    props.size === 2.1 ? 12 : 0
                                                }}
                                              >
                                                {subOption.header
                                                  ? subOption.header
                                                  : ''}
                                              </Typography>

                                              <div
                                                style={{
                                                  width: '100%',
                                                  textAlign: 'center'
                                                }}
                                              >
                                                <BarcodeGenerator
                                                  barcode={subOption.barcode}
                                                  size={props.size}
                                                  type={props.sizeType}
                                                  customData={props.customData}
                                                />
                                              </div>

                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.line.length <= 20
                                                      ? '7px'
                                                      : subOption.line.length >
                                                        20
                                                      ? '5px'
                                                      : '3px',
                                                  marginTop: '-4px',
                                                  color: '#000000',
                                                  minHeight:
                                                    props.size === 2.1 ? 12 : 0
                                                }}
                                              >
                                                {subOption.line
                                                  ? subOption.line
                                                  : ''}
                                              </Typography>

                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.footer.length <=
                                                    20
                                                      ? '7px'
                                                      : subOption.footer
                                                          .length > 20
                                                      ? '5px'
                                                      : '3px',
                                                  marginTop: '-3px',
                                                  color: '#000000',
                                                  minHeight:
                                                    props.size === 2.1 ? 12 : 0
                                                }}
                                                className={classes.Header}
                                              >
                                                {subOption.footer
                                                  ? subOption.footer
                                                  : ''}
                                              </Typography>
                                            </div>
                                          )}

                                          {props.size === 1 && (
                                            <div
                                              className={classes.alignCenter}
                                            >
                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.header.length <=
                                                    20
                                                      ? '19px'
                                                      : subOption.header
                                                          .length > 20
                                                      ? '17px'
                                                      : '5px',
                                                  fontWeight: 'bold',
                                                  color: 'black'
                                                }}
                                              >
                                                {subOption.header
                                                  ? subOption.header
                                                  : ''}
                                              </Typography>

                                              <div
                                                style={{
                                                  width: '100%',
                                                  textAlign: 'center'
                                                }}
                                              >
                                                <BarcodeGenerator
                                                  barcode={subOption.barcode}
                                                  size={props.size}
                                                  type={props.sizeType}
                                                  customData={props.customData}
                                                />
                                              </div>

                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.line.length <= 20
                                                      ? '19px'
                                                      : subOption.line.length >
                                                        20
                                                      ? '17px'
                                                      : '3px',
                                                  fontWeight: 'bold',
                                                  color: 'black'
                                                }}
                                              >
                                                {subOption.line
                                                  ? subOption.line
                                                  : ''}
                                              </Typography>

                                              <Typography
                                                style={{
                                                  fontSize:
                                                    subOption.footer.length <=
                                                    20
                                                      ? '19px'
                                                      : subOption.footer
                                                          .length > 20
                                                      ? '17px'
                                                      : '3px',
                                                  marginTop: '-4px'
                                                }}
                                                className={classes.Header}
                                              >
                                                {subOption.footer
                                                  ? subOption.footer
                                                  : ''}
                                              </Typography>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </Container>
                    )}

                  {props.sizeType === 'default' &&
                    props.printType === 'label' &&
                    props.size === 2.3 && (
                      <Container className={classes.defaultContainer}>
                        {BarcodeFinalArrayList.map((option, index) => (
                          <div style={{ border: '2px', borderColor: 'black' }}>
                            <div className={classes.mainArray}>
                              {option.map((subOption, subIndex) => (
                                <div className={classes.subArray}>
                                  <div
                                    className={classes.aligndiv}
                                    style={{
                                      left: '15%',
                                      top: '34%',
                                      width: '400px',
                                      height: '200px'
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        display: 'flex'
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: '40%',
                                          textAlign: 'center',
                                          marginTop: '30px'
                                        }}
                                      >
                                        {subOption.description
                                          ? subOption.description
                                          : ''}
                                      </div>

                                      <div
                                        style={{
                                          width: '60%',
                                          textAlign: 'center',
                                          display: 'flex'
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: '40%',
                                            textAlign: 'center'
                                          }}
                                        >
                                          <p>
                                            {subOption.grossWeight
                                              ? 'G. WT: ' +
                                                subOption.grossWeight
                                              : ''}
                                          </p>
                                          <p>
                                            {subOption.stoneWeight
                                              ? 'L WT: ' + subOption.stoneWeight
                                              : ''}
                                          </p>
                                          <p>
                                            {subOption.netWeight
                                              ? 'N WT: ' + subOption.netWeight
                                              : ''}
                                          </p>
                                          <p>
                                            {subOption.purity
                                              ? 'Purity: ' + subOption.purity
                                              : ''}
                                          </p>
                                          <p>
                                            {subOption.hallmarkUniqueId
                                              ? 'HUID: ' +
                                                subOption.hallmarkUniqueId
                                              : ''}
                                          </p>
                                        </div>
                                        <div
                                          style={{
                                            width: '20%',
                                            textAlign: 'center',
                                            marginTop: '20px'
                                          }}
                                        >
                                          <QRCode
                                            value={
                                              subOption.barcode
                                                ? subOption.barcode
                                                : 'Item code'
                                            }
                                            size={45}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </Container>
                    )}

                  {props.sizeType === 'default' &&
                    props.printType === 'label' &&
                    props.size === 2.4 && (
                      <Container className={classes.defaultContainer}>
                        {BarcodeFinalArrayList.map((option, index) => (
                          <div style={{ border: '2px', borderColor: 'black' }}>
                            <div className={classes.mainArray}>
                              {option.map((subOption, subIndex) => (
                                <div className={classes.subArray}>
                                  <div
                                    className={classes.aligndiv}
                                    style={{
                                      left: '15%',
                                      top: '34%',
                                      width: '400px',
                                      height: '200px'
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '100%',
                                        textAlign: 'center'
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontSize: 12,
                                          textAlign: 'center'
                                        }}
                                      >
                                        {subOption.header
                                          ? subOption.header
                                          : ''}
                                      </div>

                                      <div
                                        style={{
                                          width: '100%',
                                          textAlign: 'center'
                                        }}
                                      >
                                        {subOption.barcode !== 'Item Code' &&
                                          subOption.barcode !== '' && (
                                            <div style={{ fontSize: 12 }}>
                                              <BarcodeGenerator
                                                barcode={subOption.barcode}
                                                size={props.size}
                                                type={props.sizeType}
                                                customData={props.customData}
                                              />
                                            </div>
                                          )}
                                        <div style={{ fontSize: 10 }}>
                                          {subOption.line}
                                        </div>
                                      </div>

                                      <div
                                        style={{
                                          width: '100%',
                                          textAlign: 'center'
                                        }}
                                      >
                                        <p style={{ fontSize: 10 }}>
                                          {subOption.grossWeight
                                            ? 'G. WT: ' + subOption.grossWeight
                                            : ''}
                                        </p>
                                        <p style={{ fontSize: 10 }}>
                                          {subOption.stoneWeight
                                            ? 'L WT: ' + subOption.stoneWeight
                                            : ''}
                                        </p>
                                        <p style={{ fontSize: 10 }}>
                                          {subOption.netWeight
                                            ? 'N WT: ' + subOption.netWeight
                                            : ''}
                                        </p>
                                        <p style={{ fontSize: 10 }}>
                                          {subOption.purity
                                            ? 'Purity: ' + subOption.purity
                                            : ''}
                                        </p>
                                        <p style={{ fontSize: 10 }}>
                                          {subOption.hallmarkUniqueId
                                            ? 'HUID: ' +
                                              subOption.hallmarkUniqueId
                                            : ''}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </Container>
                    )}

                  {/* Regular Print with Barcode Preview (as per ticket 2386) -- Yunus  */}
                  {props.labelType === 'withbarcode' &&
                    props.printType === 'regular' && (
                      <Container className={classes.container}>
                        <div>
                          <>
                            {BarcodeFinalArrayList.map((subArray, index) => (
                              <>
                                <Grid container>
                                  {subArray.map((ele, index) => (
                                    <>
                                      <Grid
                                        item
                                        xs={4}
                                        key={index}
                                        className={classes.labelStyle}
                                        style={{
                                          marginLeft: '0px',
                                          breakInside: 'avoid'
                                        }}
                                      >
                                        <div
                                          className={classes.labelDivStyle}
                                          style={{
                                            paddingBottom: '4px',
                                            marginLeft:
                                              index % 3 === 0 && '0px',
                                            paddingLeft:
                                              index % 3 === 0 && '0px',
                                            marginRight:
                                              index % 3 === 0 && '20px'
                                          }}
                                        >
                                          <div
                                            style={{
                                              fontSize: 10,
                                              textAlign: 'left'
                                            }}
                                          >
                                            {ele.enablePurchasePriceCode
                                              ? ele.purchasePriceCode
                                              : ''}
                                          </div>
                                          <div
                                            style={{
                                              fontSize: 12,
                                              textAlign: 'center'
                                            }}
                                          >
                                            {ele.header ? ele.header : ''}
                                          </div>
                                          {ele.header ? <hr /> : ''}
                                          <div
                                            style={{
                                              width: '100%',
                                              textAlign: 'center'
                                            }}
                                          >
                                            <div style={{ fontSize: 10 }}>
                                              {ele.line}
                                            </div>
                                            {ele.barcode !== 'Item Code' &&
                                              ele.barcode !== '' && (
                                                <div style={{ fontSize: 12 }}>
                                                  <BarcodeGenerator
                                                    barcode={ele.barcode}
                                                    size={props.size}
                                                    type={props.sizeType}
                                                    customData={
                                                      props.customData
                                                    }
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
                                            <div
                                              style={{
                                                width: '50%',
                                                textAlign: 'left'
                                              }}
                                            >
                                              {ele.enableMrp &&
                                              ele.mrpValue !== ''
                                                ? 'MRP: ₹' + ele.mrpValue
                                                : ''}
                                            </div>
                                            <div
                                              style={{
                                                width: '50%',
                                                textAlign: 'right'
                                              }}
                                            >
                                              {ele.enableOfferPrice &&
                                              ele.offerPriceValue !== ''
                                                ? 'OFFER PRICE: ₹' +
                                                  ele.offerPriceValue
                                                : ''}
                                            </div>
                                          </div>
                                          {ele.barcode !== 'Item Code' ? (
                                            <hr />
                                          ) : (
                                            ''
                                          )}
                                          <div
                                            style={{
                                              fontSize: 10,
                                              width: '100%',
                                              textAlign: 'center'
                                            }}
                                          >
                                            {ele.description
                                              ? ele.description
                                              : ''}
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
                        {barcodeRegularPrintEnable && (
                          <div style={{ display: 'none' }}>
                            <BarcodeRegularPrintComponent
                              printMe={true}
                              detailData={props}
                            />
                          </div>
                        )}
                      </Container>
                    )}

                  {/* ---------------------------------- CUSTOM PREVIEW ----------------------------------------- */}

                  {props.sizeType === 'custom' &&
                    props.printType !== 'regular' && (
                      <Container
                        className={classes.customContainer}
                        style={{
                          width:
                            props.customData.paperWidth > 0
                              ? `${Number(props.customData.paperWidth) + 60}px`
                              : '100%',
                          height:
                            props.customData.paperHeight > 0
                              ? `${props.customData.paperHeight}px`
                              : '100%',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ textAlign: 'initial' }}>
                          {BarcodeFinalArrayList.map((option, index) => (
                            <div>
                              {option.map((subOption, subIndex) => (
                                <div
                                  key={index}
                                  style={{
                                    display: 'inline-block',
                                    width: `${props.customData.customWidth}px`,
                                    // minHeight     : `${props.customData.customHeight}px`,
                                    // background : 'grey',
                                    margin: 10,
                                    // padding       : 5,
                                    height: `${props.customData.customHeight}px`,
                                    position: 'relative',
                                    borderRadius: 6,
                                    boxShadow: '0 0 10px #ccc',
                                    overflow: 'hidden'
                                  }}
                                >
                                  <div className="customDiv">
                                    <div
                                      style={{
                                        marginLeft: `${props.customData.marginLeft}px`,
                                        marginRight: `${props.customData.marginRight}px`,
                                        marginTop: `${props.customData.marginTop}px`,
                                        marginBottom: `${props.customData.marginBottom}px`
                                      }}
                                    >
                                      <Typography
                                        style={{
                                          fontSize: props.customData.headerFont
                                            ? `${props.customData.headerFont}px`
                                            : '14px',
                                          // lineHeight : '18px',
                                          fontWeight: props.customData
                                            .headerWeight
                                            ? 'bold'
                                            : 'unset',
                                          color: 'black'
                                        }}
                                      >
                                        {subOption.header
                                          ? props.customData.customWidth <=
                                              300 &&
                                            subOption.header.length > 12 &&
                                            subOption.headerVal ===
                                              'business_name'
                                            ? `${subOption.header.substring(
                                                0,
                                                12
                                              )}...`
                                            : subOption.header
                                          : ''}
                                      </Typography>

                                      <div
                                        style={{
                                          width: '100%',
                                          textAlign: 'center',
                                          marginBottom: '3px'
                                        }}
                                      >
                                        <BarcodeGenerator
                                          barcode={subOption.barcode}
                                          size={props.size}
                                          type={props.sizeType}
                                          customData={props.customData}
                                        />
                                      </div>

                                      <Typography
                                        style={{
                                          fontSize: props.customData
                                            .additionalFont
                                            ? `${props.customData.additionalFont}px`
                                            : '14px',
                                          marginTop: '-6px',
                                          fontWeight: props.customData
                                            .additionalWeight
                                            ? 'bold'
                                            : 'unset',
                                          color: 'black'
                                        }}
                                      >
                                        {subOption.line ? subOption.line : ''}
                                      </Typography>

                                      <Typography
                                        className={classes.Header}
                                        style={{
                                          fontSize: props.customData.footerFont
                                            ? `${props.customData.footerFont}px`
                                            : '14px',
                                          marginTop: '-4px',
                                          fontWeight: props.customData
                                            .footerWeight
                                            ? 'bold'
                                            : 'unset',
                                          color: 'black'
                                        }}
                                      >
                                        {subOption.footer
                                          ? subOption.footer
                                          : ''}
                                      </Typography>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </Container>
                    )}
                </div>
              ) : (
                <div dangerouslySetInnerHTML={content}></div>
              )}
            </>
          </DialogContent>
        ) : (
          // A4 size paper
          <DialogContent className={classes.centerAlignvertical}>
            <RegularWithoutBarcodePreview />
            {labelRegularPrintEnable && (
              <div style={{ display: 'none' }}>
                <LabelRegularPrintComponent printMe={true} />
              </div>
            )}
          </DialogContent>
        )}
        <DialogActions>
          <Controls.Button
            text="Print"
            size="small"
            variant="contained"
            color="secondary"
            style={{ color: 'white' }}
            onClick={printBarcode}
          />
        </DialogActions>
      </Dialog>
      <Dialog
        open={openMessageDialog}
        onClose={handleCloseMessageDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMessageDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default injectWithObserver(PreviewModal);