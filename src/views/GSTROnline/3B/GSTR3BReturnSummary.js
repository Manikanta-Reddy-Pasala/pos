import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../Expenses/ExpenseTable.css';
import { Grid, Dialog, DialogContent } from '@material-ui/core';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import Loader from 'react-js-loader';
import DialogContentText from '@material-ui/core/DialogContentText';
import { validateSession } from 'src/components/Helpers/GstrOnlineHelper';
import GSTAuth from '../GSTAuth';
import GSTError from '../GSTError';
import { getSelectedDateMonthAndYearMMYYYY } from 'src/components/Helpers/DateHelper';
import { get3BRetSumData } from 'src/components/Helpers/GstrOnlineHelper';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .makeStyles-paper-31': {
      borderRadius: '12px'
    }
  },

  label: {
    flexDirection: 'column'
  },
  textAlign: {
    textAlign: 'center'
  },
  contPad: {
    padding: '15px'
  },
  headTab: {
    borderTop: '2px solid #cecdcd',
    paddingTop: '8px',
    paddingBottom: '10px',
    borderBottom: '1px solid #cecdcd',
    background: '#F4F4F4',
    fontSize: 'smaller',
    fontWeight: 'bold'
  },
  marl: {
    marginLeft: '5px',
    paddingTop: '10px',
    paddingBottom: '10px'
  },
  marr: {
    marginRight: '5px'
  },
  setPadding: {
    // paddingTop: '10px',
    // paddingBottom: '10px',
    textAlign: 'center',
    fontSize: 'smaller'
  },
  header: {
    padding: '10px',
    backgroundColor: '#ee6f0f26'
  }
}));

const GSTR3BReturnSummary = () => {
  const classes = useStyles();
  const stores = useStore();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const {
    updateGSTAuth,
    handleErrorAlertOpen,
    setLoginStep,
    gstAuth,
    openErrorMesssageDialog,
    taxData
  } = stores.GSTR1Store;

  const { getTaxSettingsDetails } = stores.TaxSettingsStore;
  const { setRetSumData } = stores.GSTR3BStore;

  const {
    Section31Summary,
    Section311Summary,
    Section32Summary,
    section4DSummary,
    section4ASummary,
    section4BSummary,
    section4CSummary,
    Section51Summary,
    section6ASummary,
    section6BSummary,
    summary31KeyValue,
    summary311KeyValue,
    summary32KeyValue,
    summary4AKeyValue,
    summary4BKeyValue,
    summary4DKeyValue,
    summary51KeyValue,
    retSumData,
    financialYear,
    financialMonth
  } = toJS(stores.GSTR3BStore);

  useEffect(() => {
    validateSessionCall();
  }, []);

  const errorMessageCall = (message) => {
    handleErrorAlertOpen(message);
  };

  const validateSessionCall = async () => {
    setLoadingMsg('Please wait while validating session!!!');
    setLoading(true);
    const apiResponse = await validateSession(taxData.gstin);
    if (apiResponse.code === 200) {
      if (apiResponse && apiResponse.status === 1) {
        updateGSTAuth(true);
        fetchData(financialYear, financialMonth);
        // setFData(1);
      } else {
        errorMessageCall(apiResponse.message);
        setLoading(false);
      }
    } else {
      updateGSTAuth(false);
      setLoginStep(1);
      errorMessageCall(apiResponse.message);
      setLoading(false);
    }
  };

  const fetchData = async (yearData, monthData) => {
    const tData = await getTaxSettingsDetails();
    let GSTRPeriod = '';
    if (monthData > '03') {
      GSTRPeriod = monthData + yearData;
    } else {
      GSTRPeriod = monthData + (parseInt(yearData) + 1);
    }
    const year = GSTRPeriod.substring(2, 6);
    const month = GSTRPeriod.substring(0, 2);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    const fDate = `${start.getFullYear()}-${(start.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}`;
    console.log('fDate', fDate);
    let reqData = {};
    reqData = {
      gstin: tData?.gstin,
      ret_period: getSelectedDateMonthAndYearMMYYYY(fDate)
    };
    const apiResponse = await get3BRetSumData(reqData);

    if (apiResponse && apiResponse.status === 1) {
      const respData = apiResponse.message.data;
      console.log('respData', respData);
      setRetSumData(respData);
      setLoading(false);
    } else {
      errorMessageCall(apiResponse.message);
      setLoading(false);
    }
  };

  return (
    <>
      {!gstAuth ? (
        <GSTAuth type={'GSTR3B'} />
      ) : (
        !loading && (
          <>
            <div>
              <div>
                <div className={classes.contPad}>
                  <div className={classes.header}>
                    3.1 Details of Outward supplies and inward supplies liable
                    to reverse charge (other than those covered by Table 3.1.1)
                  </div>
                  <Grid container className={classes.headTab}>
                    <Grid item xs={2}>
                      <p className={classes.marl}>Nature of Supplies</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>Total Taxable Value</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>Integrated Tax</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>Central Tax</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>State/UT Tax</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>Cess Amount</p>
                    </Grid>
                  </Grid>
                  <div>
                    {Section31Summary.map((option, index) => (
                      <Grid
                        container
                        className={classes.setPadding}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#fff' : '#ecf0f1'
                        }}
                      >
                        <Grid item xs={2} style={{ textAlign: 'start' }}>
                          <p className={classes.marl}> {option.name}</p>
                        </Grid>
                        <Grid item xs={2}>
                          <p className={classes.marl}>
                            {
                              retSumData?.sup_details[summary31KeyValue[index]]
                                ?.txval
                            }
                          </p>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          style={{
                            background:
                              option.integrated_tax === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          <p className={classes.marl}>
                            {' '}
                            {
                              retSumData?.sup_details[summary31KeyValue[index]]
                                ?.iamt
                            }
                          </p>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          style={{
                            background:
                              option.central_tax === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          <p className={classes.marl}>
                            {' '}
                            {
                              retSumData?.sup_details[summary31KeyValue[index]]
                                ?.camt
                            }
                          </p>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          style={{
                            background:
                              option.state_ut_tax === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          <p className={classes.marl}>
                            {' '}
                            {
                              retSumData?.sup_details[summary31KeyValue[index]]
                                ?.samt
                            }
                          </p>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          style={{
                            background: option.cess === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          <p className={classes.marl}>
                            {' '}
                            {
                              retSumData?.sup_details[summary31KeyValue[index]]
                                ?.csamt
                            }
                          </p>
                        </Grid>
                      </Grid>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className={classes.contPad}>
                  <div className={classes.header}>
                    3.1.1 Details of Supplies notifed under section 9(5) of the
                    CGST Act, 2017 and corresponding provisions in
                    IGST/UTGST/SGST Acts
                  </div>
                  <Grid container className={classes.headTab}>
                    <Grid item xs={2}>
                      <p className={classes.marl}>Nature of Supplies</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>Total Taxable Value</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>Integrated Tax</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>Central Tax</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>State/UT Tax</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>Cess Amount</p>
                    </Grid>
                  </Grid>
                  <div>
                    {Section311Summary.map((option, index) => (
                      <Grid
                        container
                        className={classes.setPadding}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#fff' : '#ecf0f1'
                        }}
                      >
                        <Grid item xs={2} style={{ textAlign: 'start' }}>
                          <p className={classes.marl}> {option.name}</p>
                        </Grid>
                        <Grid item xs={2}>
                          <p className={classes.marl}>
                            {' '}
                            {
                              retSumData?.eco_dtls?.[summary311KeyValue[index]]
                                ?.txval
                            }
                          </p>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          style={{
                            background:
                              option.integrated_tax === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          <p className={classes.marl}>
                            {' '}
                            {
                              retSumData?.eco_dtls?.[summary311KeyValue[index]]
                                ?.iamt
                            }
                          </p>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          style={{
                            background:
                              option.central_tax === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          <p className={classes.marl}>
                            {' '}
                            {
                              retSumData?.eco_dtls?.[summary311KeyValue[index]]
                                ?.camt
                            }
                          </p>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          style={{
                            background:
                              option.state_ut_tax === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          <p className={classes.marl}>
                            {' '}
                            {
                              retSumData?.eco_dtls?.[summary311KeyValue[index]]
                                ?.samt
                            }
                          </p>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          style={{
                            background: option.cess === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          <p className={classes.marl}>
                            {' '}
                            {
                              retSumData?.eco_dtls?.[summary311KeyValue[index]]
                                ?.csamt
                            }
                          </p>
                        </Grid>
                      </Grid>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className={classes.contPad}>
                  <div className={classes.header}>
                    3.2 Out of supplies made in 3.1 (a) and 3.1.1 (i), details
                    of inter-state supplies made
                  </div>
                  <Grid container className={classes.headTab}>
                    <Grid item xs={2}>
                      <p className={classes.marl}>Nature of Supplies</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>Total Taxable Value</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>Integrated Tax</p>
                    </Grid>
                  </Grid>
                  <div>
                    {Section32Summary.map((option, index) => (
                      <Grid
                        container
                        className={classes.setPadding}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#fff' : '#ecf0f1'
                        }}
                      >
                        <Grid item xs={2} style={{ textAlign: 'start' }}>
                          <p className={classes.marl}> {option.name}</p>
                        </Grid>
                        <Grid item xs={2}>
                          <p className={classes.marl}>
                            {' '}
                            {retSumData?.inter_sup?.[
                              summary32KeyValue[index]
                            ]?.reduce((acc, detail) => acc + detail.txval, 0)}
                          </p>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          style={{
                            background:
                              option.integrated_tax === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          <p className={classes.marl}>
                            {' '}
                            {retSumData?.inter_sup?.[
                              summary32KeyValue[index]
                            ]?.reduce((acc, detail) => acc + detail.iamt, 0)}
                          </p>
                        </Grid>
                      </Grid>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className={classes.contPad}>
                  <div className={classes.header}>4. Eligible ITC</div>
                  <Grid container className={classes.headTab}>
                    <Grid item xs={4}>
                      <p className={classes.mrgh}>Details</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>Integrated Tax</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>Central Tax</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>State/UT Tax</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>Cess Amount</p>
                    </Grid>
                  </Grid>
                  <div>
                    <Grid
                      container
                      className={classes.setPadding}
                      style={{
                        backgroundColor: '#fff'
                      }}
                    >
                      <Grid item xs={4} style={{ textAlign: 'start' }}>
                        <p
                          className={classes.marl}
                          style={{ fontWeight: 'bold' }}
                        >
                          A. ITC Available (whether in full or part)
                        </p>
                      </Grid>
                    </Grid>
                    {section4ASummary.map((option, index) => (
                      <Grid
                        container
                        className={classes.setPadding}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#ecf0f1' : '#fff'
                        }}
                      >
                        <Grid item xs={4} style={{ textAlign: 'start' }}>
                          <p className={classes.marl}> {option.name}</p>
                        </Grid>
                        <Grid item xs={2}>
                          {retSumData?.itc_elg?.itc_avl.map((item, index1) => {
                            if (item.ty == summary4AKeyValue[index]) {
                              return (
                                <p key={index} className={classes.marl}>
                                  {item.iamt}
                                </p>
                              );
                            }
                            return null; // If the condition is not met, return null (no rendering)
                          })}
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          style={{
                            background:
                              option.central_tax === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          {retSumData?.itc_elg?.itc_avl.map((item, index1) => {
                            if (item.ty == summary4AKeyValue[index]) {
                              return (
                                <p key={index} className={classes.marl}>
                                  {item.camt}
                                </p>
                              );
                            }
                            return null; // If the condition is not met, return null (no rendering)
                          })}
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          style={{
                            background:
                              option.state_ut_tax === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          {retSumData?.itc_elg?.itc_avl.map((item, index1) => {
                            if (item.ty == summary4AKeyValue[index]) {
                              return (
                                <p key={index} className={classes.marl}>
                                  {item.samt}
                                </p>
                              );
                            }
                            return null; // If the condition is not met, return null (no rendering)
                          })}
                        </Grid>
                        <Grid item xs={2}>
                          {retSumData?.itc_elg?.itc_avl.map((item, index1) => {
                            if (item.ty == summary4AKeyValue[index]) {
                              return (
                                <p key={index} className={classes.marl}>
                                  {item.csamt}
                                </p>
                              );
                            }
                            return null; // If the condition is not met, return null (no rendering)
                          })}
                        </Grid>
                      </Grid>
                    ))}

                    <Grid
                      container
                      className={classes.setPadding}
                      style={{
                        backgroundColor: '#fff'
                      }}
                    >
                      <Grid item xs={4} style={{ textAlign: 'start' }}>
                        <p
                          className={classes.marl}
                          style={{ fontWeight: 'bold' }}
                        >
                          B. ITC Reversed
                        </p>
                      </Grid>
                    </Grid>
                    {section4BSummary.map((option, index) => (
                      <Grid
                        container
                        className={classes.setPadding}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#ecf0f1' : '#fff'
                        }}
                      >
                        <Grid item xs={4} style={{ textAlign: 'start' }}>
                          <p className={classes.marl}> {option.name}</p>
                        </Grid>
                        <Grid item xs={2}>
                          {retSumData?.itc_elg?.itc_rev.map((item, index1) => {
                            if (item.ty == summary4BKeyValue[index]) {
                              return (
                                <p key={index} className={classes.marl}>
                                  {item.iamt}
                                </p>
                              );
                            }
                            return null; // If the condition is not met, return null (no rendering)
                          })}
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          style={{
                            background:
                              option.central_tax === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          {retSumData?.itc_elg?.itc_rev.map((item, index1) => {
                            if (item.ty == summary4BKeyValue[index]) {
                              return (
                                <p key={index} className={classes.marl}>
                                  {item.camt}
                                </p>
                              );
                            }
                            return null; // If the condition is not met, return null (no rendering)
                          })}
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          style={{
                            background:
                              option.state_ut_tax === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          {retSumData?.itc_elg?.itc_rev.map((item, index1) => {
                            if (item.ty == summary4BKeyValue[index]) {
                              return (
                                <p key={index} className={classes.marl}>
                                  {item.samt}
                                </p>
                              );
                            }
                            return null; // If the condition is not met, return null (no rendering)
                          })}
                        </Grid>
                        <Grid item xs={2}>
                          {retSumData?.itc_elg?.itc_rev.map((item, index1) => {
                            if (item.ty == summary4BKeyValue[index]) {
                              return (
                                <p key={index} className={classes.marl}>
                                  {item.csamt}
                                </p>
                              );
                            }
                            return null; // If the condition is not met, return null (no rendering)
                          })}
                        </Grid>
                      </Grid>
                    ))}

                    <Grid
                      container
                      className={classes.setPadding}
                      style={{
                        backgroundColor: '#fff'
                      }}
                    >
                      <Grid item xs={4} style={{ textAlign: 'start' }}>
                        <p
                          className={classes.marl}
                          style={{ fontWeight: 'bold' }}
                        >
                          C. Net ITC available (A-B)
                        </p>
                      </Grid>
                      <Grid item xs={2}>
                        <p className={classes.marl}>
                          {' '}
                          {retSumData?.itc_elg?.itc_net.iamt}
                        </p>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        style={{
                          background:
                            section4CSummary.central_tax === ''
                              ? '#E9E5E5'
                              : 'none'
                        }}
                      >
                        <p className={classes.marl}>
                          {' '}
                          {retSumData?.itc_elg?.itc_net.camt}
                        </p>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        style={{
                          background:
                            section4CSummary.state_ut_tax === ''
                              ? '#E9E5E5'
                              : 'none'
                        }}
                      >
                        <p className={classes.marl}>
                          {' '}
                          {retSumData?.itc_elg?.itc_net.samt}
                        </p>
                      </Grid>
                      <Grid item xs={2}>
                        <p className={classes.marl}>
                          {' '}
                          {retSumData?.itc_elg?.itc_net.csamt}
                        </p>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      className={classes.setPadding}
                      style={{
                        backgroundColor: '#fff'
                      }}
                    >
                      <Grid item xs={4} style={{ textAlign: 'start' }}>
                        <p
                          className={classes.marl}
                          style={{ fontWeight: 'bold' }}
                        >
                          (D) Other Details
                        </p>
                      </Grid>
                    </Grid>
                    {section4DSummary.map((option, index) => (
                      <Grid
                        container
                        className={classes.setPadding}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#ecf0f1' : '#fff'
                        }}
                      >
                        <Grid item xs={4} style={{ textAlign: 'start' }}>
                          <p className={classes.marl}> {option.name}</p>
                        </Grid>
                        <Grid item xs={2}>
                          {retSumData?.itc_elg?.itc_inelg.map(
                            (item, index1) => {
                              if (item.ty == summary4DKeyValue[index]) {
                                return (
                                  <p key={index} className={classes.marl}>
                                    {item.iamt}
                                  </p>
                                );
                              }
                              return null; // If the condition is not met, return null (no rendering)
                            }
                          )}
                        </Grid>
                        <Grid item xs={2}>
                          {retSumData?.itc_elg?.itc_inelg.map(
                            (item, index1) => {
                              if (item.ty == summary4DKeyValue[index]) {
                                return (
                                  <p key={index} className={classes.marl}>
                                    {item.camt}
                                  </p>
                                );
                              }
                              return null; // If the condition is not met, return null (no rendering)
                            }
                          )}
                        </Grid>
                        <Grid item xs={2}>
                          {retSumData?.itc_elg?.itc_inelg.map(
                            (item, index1) => {
                              if (item.ty == summary4DKeyValue[index]) {
                                return (
                                  <p key={index} className={classes.marl}>
                                    {item.samt}
                                  </p>
                                );
                              }
                              return null; // If the condition is not met, return null (no rendering)
                            }
                          )}
                        </Grid>
                        <Grid item xs={2}>
                          {retSumData?.itc_elg?.itc_inelg.map(
                            (item, index1) => {
                              if (item.ty == summary4DKeyValue[index]) {
                                return (
                                  <p key={index} className={classes.marl}>
                                    {item.csamt}
                                  </p>
                                );
                              }
                              return null; // If the condition is not met, return null (no rendering)
                            }
                          )}
                        </Grid>
                      </Grid>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className={classes.contPad}>
                  <div className={classes.header}>
                    5.1 Interest and Late fee for previous tax period
                  </div>
                  <Grid container className={classes.headTab}>
                    <Grid item xs={4}>
                      <p className={classes.marl}>Details</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>Integrated Tax</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>Central Tax</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>State/UT Tax</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>Cess Amount</p>
                    </Grid>
                  </Grid>
                  <div>
                    {Section51Summary.map((option, index) => (
                      <Grid
                        container
                        className={classes.setPadding}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#fff' : '#ecf0f1'
                        }}
                      >
                        <Grid item xs={4} style={{ textAlign: 'start' }}>
                          <p className={classes.marl}> {option.name}</p>
                        </Grid>
                        <Grid item xs={2}>
                          <p className={classes.marl}>
                            {' '}
                            {
                              retSumData?.intr_ltfee[summary51KeyValue[index]]
                                ?.iamt
                            }
                          </p>
                        </Grid>
                        <Grid item xs={2}>
                          <p className={classes.marl}>
                            {' '}
                            {
                              retSumData?.intr_ltfee[summary51KeyValue[index]]
                                ?.camt
                            }
                          </p>
                        </Grid>
                        <Grid item xs={2}>
                          <p className={classes.marl}>
                            {' '}
                            {
                              retSumData?.intr_ltfee[summary51KeyValue[index]]
                                ?.samt
                            }
                          </p>
                        </Grid>
                        <Grid item xs={2}>
                          <p className={classes.marl}>
                            {' '}
                            {
                              retSumData?.intr_ltfee[summary51KeyValue[index]]
                                ?.csamt
                            }
                          </p>
                        </Grid>
                      </Grid>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className={classes.contPad}>
                  <div className={classes.header}>6.1 Payment of tax</div>
                  <Grid container className={classes.headTab}>
                    <Grid item xs={2}>
                      <p className={classes.mrgh}>Description</p>
                    </Grid>
                    <Grid item xs={1}>
                      <p className={classes.mrgh}>Total tax payable</p>
                    </Grid>
                    <Grid item xs={4} className={classes.textAlign}>
                      <Grid item xs={12} className={classes.textAlign}>
                        <p className={classes.marr}>Tax paid through ITC</p>
                      </Grid>
                      <Grid container>
                        <Grid item xs={3} className={classes.textAlign}>
                          <p className={classes.marr}>Integrated Tax</p>
                        </Grid>
                        <Grid item xs={3} className={classes.textAlign}>
                          <p className={classes.marr}>Central Tax</p>
                        </Grid>
                        <Grid item xs={3} className={classes.textAlign}>
                          <p className={classes.marr}>State/UT Tax</p>
                        </Grid>
                        <Grid item xs={3} className={classes.textAlign}>
                          <p className={classes.marr}>Cess</p>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={1} className={classes.textAlign}>
                      <p className={classes.marr}>Tax paid in cash</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>Interest paid in cash</p>
                    </Grid>
                    <Grid item xs={2} className={classes.textAlign}>
                      <p className={classes.marr}>Late fee paid in cash</p>
                    </Grid>
                  </Grid>
                  <div>
                    <Grid
                      container
                      className={classes.setPadding}
                      style={{
                        backgroundColor: '#fff'
                      }}
                    >
                      <Grid item xs={4} style={{ textAlign: 'start' }}>
                        <p
                          className={classes.marl}
                          style={{ fontWeight: 'bold' }}
                        >
                          A. Other than reverse charge
                        </p>
                      </Grid>
                    </Grid>
                    {section6ASummary.map((option, index) => (
                      <Grid
                        container
                        className={classes.setPadding}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#ecf0f1' : '#fff'
                        }}
                      >
                        <Grid item xs={2} style={{ textAlign: 'start' }}>
                          <p className={classes.marl}> {option.name}</p>
                        </Grid>
                        <Grid item xs={1}>
                          <p className={classes.marl}>
                            {' '}
                            {option.total_taxable_value}
                          </p>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          style={{
                            background:
                              option.integrated_tax === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          <p className={classes.marl}>
                            {' '}
                            {option.integrated_tax}
                          </p>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          style={{
                            background:
                              option.central_tax === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          <p className={classes.marl}> {option.central_tax}</p>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          style={{
                            background:
                              option.state_ut_tax === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          <p className={classes.marl}> {option.state_ut_tax}</p>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          style={{
                            background: option.cess === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          <p className={classes.marl}> {option.cess}</p>
                        </Grid>
                        <Grid item xs={1}>
                          <p className={classes.marl}>
                            {' '}
                            {option.tax_paid_in_cash}
                          </p>
                        </Grid>
                        <Grid item xs={2}>
                          <p className={classes.marl}>
                            {' '}
                            {option.interest_paid_in_cash}
                          </p>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          style={{
                            background:
                              option.latefee_paid_in_cash === ''
                                ? '#E9E5E5'
                                : 'none'
                          }}
                        >
                          <p className={classes.marl}>
                            {' '}
                            {option.latefee_paid_in_cash}
                          </p>
                        </Grid>
                      </Grid>
                    ))}

                    <Grid
                      container
                      className={classes.setPadding}
                      style={{
                        backgroundColor: '#fff'
                      }}
                    >
                      <Grid item xs={4} style={{ textAlign: 'start' }}>
                        <p
                          className={classes.marl}
                          style={{ fontWeight: 'bold' }}
                        >
                          (B) Reverse charge
                        </p>
                      </Grid>
                    </Grid>
                    {section6BSummary.map((option, index) => (
                      <Grid
                        container
                        className={classes.setPadding}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#ecf0f1' : '#fff'
                        }}
                      >
                        <Grid item xs={2} style={{ textAlign: 'start' }}>
                          <p className={classes.marl}> {option.name}</p>
                        </Grid>
                        <Grid item xs={1}>
                          <p className={classes.marl}>
                            {' '}
                            {option.total_taxable_value}
                          </p>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          style={{
                            background:
                              option.integrated_tax === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          <p className={classes.marl}>
                            {' '}
                            {option.integrated_tax}
                          </p>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          style={{
                            background:
                              option.central_tax === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          <p className={classes.marl}> {option.central_tax}</p>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          style={{
                            background:
                              option.state_ut_tax === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          <p className={classes.marl}> {option.state_ut_tax}</p>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          style={{
                            background: option.cess === '' ? '#E9E5E5' : 'none'
                          }}
                        >
                          <p className={classes.marl}> {option.cess}</p>
                        </Grid>
                        <Grid item xs={1}>
                          <p className={classes.marl}>
                            {' '}
                            {option.tax_paid_in_cash}
                          </p>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          style={{
                            background:
                              option.interest_paid_in_cash === ''
                                ? '#E9E5E5'
                                : 'none'
                          }}
                        >
                          <p className={classes.marl}>
                            {' '}
                            {option.interest_paid_in_cash}
                          </p>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          style={{
                            background:
                              option.latefee_paid_in_cash === ''
                                ? '#E9E5E5'
                                : 'none'
                          }}
                        >
                          <p className={classes.marl}>
                            {' '}
                            {option.latefee_paid_in_cash}
                          </p>
                        </Grid>
                      </Grid>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      )}

      <Dialog
        fullScreen={fullScreen}
        open={loading}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>{loadingMsg}</p>
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

export default InjectObserver(GSTR3BReturnSummary);
