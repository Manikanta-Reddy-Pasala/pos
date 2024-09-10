import React, { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Card
} from '@material-ui/core';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import Loader from 'react-js-loader';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Col } from 'react-flexbox-grid';
import useWindowDimensions from 'src/components/windowDimension';
import { toJS } from 'mobx';
import { getSelectedDateMonthAndYearMMYYYY,getSelectedMonthAndYearMMYYYY } from 'src/components/Helpers/DateHelper';
import GSTAuth from './GSTR1Auth';
import GSTError from 'src/views/GSTROnline/GSTError';
import {
  validateSession,
  downloadGSTR1API,
  isGSTRFiled,
  generateOTP,
  filedSummaryTotal
} from 'src/components/Helpers/GstrOnlineHelper';

const useStyles = makeStyles((theme) => ({
  productModalContent: {
    padding: 'inherit',
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

  itemTable: {
    width: '100%'
  },
  agGridclass: {
    '& .ag-paging-panel': {
      fontSize: '10px',
      '& .ag-paging-row-summary-panel': {
        width: '52px'
      }
    }
  },
  listli: {
    borderBottom: '1px solid #c5c4c4',
    paddingBottom: 10,
    marginBottom: 12,
    background: 'none'
  },
  listHeaderBox: {
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    padding: '10px 30px 0px 30px'
  },
  listbox: {
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    padding: '10px 30px 30px 30px',

    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    }
  },
  activeClass: {
    backgroundColor: '#2977f5',
    color: 'white'
  },
  content: {
    cursor: 'pointer'
  },
  w_30: {
    width: '30%',
    display: 'inline-flex'
  },
  step1: {
    width: '78%',
    margin: 'auto',
    backgroundColor: 'white',
    marginBottom: '2%'
  },
  step2: {
    width: '95%',
    margin: 'auto',
    // backgroundColor: '#d8cac01f',
    marginBottom: '2%'
  },
  fGroup: {
    width: '50%',
    margin: 'auto'
  },
  CenterStartEnd: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'grey'
  },
  CenterStartEndWc: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  batchTable: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: '12px'
  },
  rowstyle: {
    border: '1px solid #ddd',
    padding: '8px'
  },
  headstyle: {
    paddingTop: '12px',
    paddingBottom: '12px',
    textAlign: 'left',
    backgroundColor: '#EF5350',
    color: 'white'
  },
  mb_20: {
    marginBottom: '20px'
  },
  mb_10: {
    marginBottom: '10px'
  },
  wAuto: {
    width: '80%',
    margin: 'auto',
    textAlign: 'center'
  },
  cardList: {
    display: 'block',
    textAlign: 'center',
    paddingTop: '10px',
    color: 'grey'
  },
  card: {
    display: 'block',
    transitionDuration: '0.3s',
    height: '100%',
    borderRadius: 1,
    paddingTop: 10,
    overflowY: 'auto',
    overflowX: 'hidden',
    background: 'white'
  },
  sticky: {
    bottom: '0',
    color: '#fff',
    overflowX: 'hidden',
    position: 'sticky',
    textAlign: 'center',
    zIndex: '99999',
    padding: '10px'
  },
  retFont: {
    fontSize: '14px',
    color: 'darkblue',
    fontWeight: 'bold'
  }
}));

const GSTR1ReturnSummaryPage = () => {
  const classes = useStyles();
  const store = useStore();

  const { getTaxSettingsDetails } = store.TaxSettingsStore;
  // const [taxData, setTaxData] = useState('');
  const [loader, setLoader] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState('');
  const [ackNo, setAckNo] = useState('');
  const [ackDate, setAckDate] = useState('');
  const [totalData, setTotalData] = useState({});
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { height } = useWindowDimensions();

  const retSumTitles = {
    B2B_4A:
      '4A - Taxable outward supplies made to registered persons (other than reverse charge supplies) including supplies made through e-commerce operator attracting TCS - B2B Regular',
    B2B_4B:
      '4B - Taxable outward supplies made to registered persons attracting tax on reverse charge - B2B Reverse charge',
    B2CL: '5 - Taxable outward inter-state supplies made to unregistered persons (where invoice value is more than Rs.2.5 lakh) including supplies made through e-commerce operator, rate wise - B2CL (Large)',
    EXP: '6A - Exports',
    B2B_SEZWOP: '6B - Supplies made to SEZ unit or SEZ developer - SEZWOP',
    B2B_SEZWP: '6B - Supplies made to SEZ unit or SEZ developer - SEZWP',
    B2B_6C: '6C - Deemed Exports - DE',
    B2CS: '7- Taxable supplies (Net of debit and credit notes) to unregistered persons (other than the supplies covered in Table 5) including supplies made through e-commerce operator attracting TCS - B2CS (Others)',
    NIL: '8 - Nil rated, exempted and non GST outward supplies',
    B2BA_4A:
      '9A - Amendment to taxable outward supplies made to registered person in returns of earlier tax periods in table 4 - B2B Regular',
    B2BA_4B:
      '9A - Amendment to taxableoutward supplies made to registered person in returns of earlier tax periods in table 4 - B2B Reverse charge',
    EXPA: '9A - Amendment to Export supplies in returns of earlier tax periods in table 6A (EXPWP/EXPWOP)',
    B2BA_SEZWP:
      '9A - Amendment to supplies made to SEZ unit or SEZ developer in returns of earlier tax periods in table 6B (SEZWP)',
    B2BA_SEZWOP:
      '9A - Amendment to supplies made to SEZ unit or SEZ developer in returns of earlier tax periods in table 6B (SEZWOP)',
    CDNR: '9B - Credit/Debit Notes (Registered) - CDNR',
    CDNUR: '9B - Credit/Debit Notes (Unregistered) - CDNUR',
    CDNRA: '9C - Amended Credit/Debit Notes (Registered) - CDNRA',
    CDNURA: '9C - Amended Credit/Debit Notes (Unregistered) - CDNURA',
    B2CSA:
      '10 - Amendment to taxable outward supplies made to unregistered person in returns for earlier tax periods in table 7 including supplies made through e-commerce operator attracting TCS - B2C (Others)',
    AT: '11A(1), 11A(2) - Advances received for which invoice has not been issued (tax amount to be added to the output tax liability) (Net of refund vouchers, if any)',
    TXPD: '11B(1), 11B(2) - Advance amount received in earlier tax period and adjusted against the supplies being shown in this tax period in Table Nos. 4, 5, 6 and 7 (Net of refund vouchers, if any)',
    ATA: '11A - Amendment to advances received in returns for earlier tax periods in table 11A(1), 11A(2) (Net of refund vouchers, if any)',
    TXPDA:
      '11B - Amendment to advances adjusted in returns for earlier tax periods in table 11B(1), 11B(2) (Net of refund vouchers, if any)',
    HSN: '12 - HSN-wise summary of outward supplies',
    DOC_ISSUE: '13 - Documents issued'
  };

  const [downloadData, setDownloadData] = useState();
  const {
    GSTRDateRange,
    reviewStep,
    openErrorMesssageDialog,
    gstAuth,
    financialYear,
    financialMonth,
    taxData
  } = toJS(store.GSTR1Store);
  const {
    handleErrorAlertOpen,
    updateReviewStep,
    setLoginStep,
    updateGSTAuth
  } = store.GSTR1Store;

  useEffect(() => {
    if (!gstAuth) {
      checkSession();
    } else {
      checkIsFiledasync();
    }
  }, [gstAuth]);

  const errorMessageCall = (message) => {
    handleErrorAlertOpen(message);
  };

  // useEffect(() => {
  //   const fetchDataAsync = async () => {
  //     let taxData = await getTaxSettingsDetails();
  //     setTaxData(taxData);
  //   };

  //   fetchDataAsync();
  // }, []);

  const checkSession = async (data) => {
    // let taxData = await getTaxSettingsDetails();
    await validateSessionCall(taxData);
  };

  const validateSessionCall = async () => {
    setLoaderMsg('Please wait while validating session!!!');
    setLoader(true);
    const apiResponse = await validateSession(taxData.gstin);
    if (apiResponse.code == 200) {
      if (apiResponse && apiResponse.status === 1) {
        updateGSTAuth(true);
        setLoader(false);
      } else {
        updateGSTAuth(false);
        errorMessageCall(apiResponse.message);
        setLoader(false);
        setOpenAuth(true);
      }
    } else {
      updateGSTAuth(false);
      if (taxData.gstPortalUserName != '') {
        setLoginStep(2);
      }
      // errorMessageCall(apiResponse.message);
      setLoader(false);
      setOpenAuth(true);
    }
  };

  const checkIsFiledasync = async () => {
    setLoaderMsg('Please wait!!!');
    setLoader(true);
    let taxData = await getTaxSettingsDetails();
    let apiResponse = await isGSTRFiled(
      taxData.gstin,
      getSelectedMonthAndYearMMYYYY(financialYear, financialMonth)
    );

    if (apiResponse && apiResponse.status === 1) {
      const respData = apiResponse.message;
      if (respData?.EFiledlist && respData.EFiledlist.length > 0) {
        respData.EFiledlist.forEach((item, index) => {
          if (item.rtntype == 'GSTR1') {
            if (item.status == 'Filed') {
              setAckNo(item.arn);
              setAckDate(item.dof);
              downloadGSTRData();
            } else {
              errorMessageCall('Invalid Finacial Year / Month');
            }
          }
        });
      } else {
        errorMessageCall('Invalid Finacial Year / Month');
      }
    } else {
      errorMessageCall('Invalid Finacial Year / Month');
    }

    setLoader(false);
  };

  const downloadGSTRData = async () => {
    setLoaderMsg('Please wait!!!');
    setLoader(true);
    let taxData = await getTaxSettingsDetails();
    let reqData = {};
    reqData = {
      gstin: taxData.gstin,
      ret_period: getSelectedDateMonthAndYearMMYYYY(GSTRDateRange.fromDate),
      api_name: 'retsum'
    };
    const apiResponse = await downloadGSTR1API(reqData);

    if (apiResponse && apiResponse.status === 1 && apiResponse.message) {
      setLoader(false);
      let response = JSON.parse(apiResponse.message.data_json_string);
      const sortedData = sortDataByRetSumTitles(response.sec_sum);
      setDownloadData(sortedData);

      const totalVal = await filedSummaryTotal(sortedData);
      setTotalData(totalVal);
    } else {
      errorMessageCall(apiResponse.message);
      setLoader(false);
    }
  };

  const sortDataByRetSumTitles = (data) => {
    const orderedKeys = Object.keys(retSumTitles);
    return data.sort((a, b) => {
      return orderedKeys.indexOf(a.sec_nm) - orderedKeys.indexOf(b.sec_nm);
    });
  };

  return (
    <>
      <div className={classes.step2}>
        <Typography style={{ padding: '10px' }} variant="h3">
          Filed Summary
        </Typography>

        {!gstAuth && openAuth ? (
          <GSTAuth type={'GSTR2A'} />
        ) : (
          <Grid fluid className="app-main" style={{ height: height - 110 }}>
            <Col className="content-column" xs>
              <Card className={classes.card}>
                {reviewStep == '1' && (
                  <>
                    <Typography style={{ paddingLeft: '10px' }} variant="h6">
                      GSTIN : {taxData ? taxData.gstin : ''}
                    </Typography>
                    <Typography
                      style={{ paddingLeft: '10px', paddingTop: '10px' }}
                      variant="h6"
                    >
                      FP :{' '}
                      {getSelectedDateMonthAndYearMMYYYY(
                        GSTRDateRange.fromDate
                      )}
                    </Typography>
                    <Typography style={{ paddingLeft: '10px', paddingTop: '10px' }} variant="h6">
                      Acknowledgement No : {ackNo}
                    </Typography>
                    <Typography style={{ paddingLeft: '10px', paddingTop: '10px' }} variant="h6">
                      Acknowledgement Date : {ackDate}
                    </Typography>
                    <Grid
                      container
                      direction="row"
                      style={{ padding: '20px' }}
                      alignItems="stretch"
                    >
                      <div style={{ marginTop: '10px', width: '100%' }}>
                        <table className={`${classes.batchTable}`}>
                          <thead>
                            <tr>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Description
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                No. of records
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Document Type
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Value (₹)
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Integrated tax (₹)
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Central tax (₹)
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                State/UT tax (₹)
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Cess (₹)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {downloadData?.map(
                              (item, index) =>
                                retSumTitles[item.sec_nm] && (
                                  <>
                                    <tr>
                                      <td
                                        colSpan="8"
                                        className={`${classes.rowstyle} ${classes.retFont}`}
                                      >
                                        {retSumTitles[item.sec_nm]}
                                      </td>
                                    </tr>
                                    <tr style={{ fontWeight: 'bold' }}>
                                      <td className={`${classes.rowstyle}`}>
                                        Total
                                      </td>
                                      <td className={`${classes.rowstyle}`}>
                                        {item.ttl_rec}
                                      </td>
                                      <td className={`${classes.rowstyle}`}>
                                        Invoice
                                      </td>
                                      <td className={`${classes.rowstyle}`}>
                                        {item.ttl_tax}
                                      </td>
                                      <td className={`${classes.rowstyle}`}>
                                        {item.ttl_igst}
                                      </td>
                                      <td className={`${classes.rowstyle}`}>
                                        {item.ttl_cgst}
                                      </td>
                                      <td className={`${classes.rowstyle}`}>
                                        {item.ttl_sgst}
                                      </td>
                                      <td className={`${classes.rowstyle}`}>
                                        {item.ttl_cess}
                                      </td>
                                    </tr>
                                    {item.sec_nm == 'NIL' && (
                                      <>
                                        <tr style={{ fontWeight: 'bold' }}>
                                          <td className={`${classes.rowstyle}`}>
                                            - Nil
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            {item.ttl_nilsup_amt}
                                          </td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                          ></td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                          ></td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                          ></td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                          ></td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                          ></td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                          ></td>
                                        </tr>
                                        <tr style={{ fontWeight: 'bold' }}>
                                          <td className={`${classes.rowstyle}`}>
                                            - Exempted
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            {item.ttl_expt_amt}
                                          </td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                          ></td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                          ></td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                          ></td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                          ></td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                          ></td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                          ></td>
                                        </tr>
                                        <tr style={{ fontWeight: 'bold' }}>
                                          <td className={`${classes.rowstyle}`}>
                                            - Non-GST
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            {item.ttl_ngsup_amt}
                                          </td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                          ></td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                          ></td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                          ></td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                          ></td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                          ></td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                          ></td>
                                        </tr>
                                      </>
                                    )}

                                    {item?.sub_sections?.map(
                                      (itemsub, index1) => (
                                        <tr>
                                          <td className={`${classes.rowstyle}`}>
                                            {itemsub.typ}
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            {itemsub.ttl_rec}
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            Invoice
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            {itemsub.ttl_tax}
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            {itemsub.ttl_igst}
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            {itemsub.ttl_cgst}
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            {itemsub.ttl_sgst}
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            {itemsub.ttl_cess}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </>
                                )
                            )}
                          </tbody>
                          <thead>
                            <tr>
                              
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>TOTAL</b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {totalData?.vouchersTotal || 0}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    totalData?.taxableTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    totalData?.igstTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    totalData?.cgstTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    totalData?.sgstTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    totalData?.cessTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                    </Grid>
                  </>
                )}
              </Card>
            </Col>
          </Grid>
        )}
      </div>

      <Dialog
        fullScreen={fullScreen}
        open={loader}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>{loaderMsg}</p>
              </div>
              <div>
                <br />
                <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      {openErrorMesssageDialog && <GSTError />}
    </>
  );
};

export default injectWithObserver(GSTR1ReturnSummaryPage);
