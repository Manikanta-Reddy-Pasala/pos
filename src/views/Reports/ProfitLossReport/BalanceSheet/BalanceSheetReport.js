import React, { useState, useEffect } from 'react';
import 'react-table/react-table.css';
import TextField from '@material-ui/core/TextField';
import '../../../Expenses/ExpenseTable.css';
import { Typography, Grid, Avatar, IconButton, Paper } from '@material-ui/core';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import Excel from '../../../../icons/Excel';
import * as moment from 'moment';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import { useStyles } from './BalanceSheetReportStyles';

const BalanceSheetReport = () => {
  const classes = useStyles();

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
  const sheetFormatDate = moment(todayDate).format('MMM DD YYYY');
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [onChange, setOnChange] = useState(false);

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      getBalanceSheetData(fromDate, toDate);
      setOnChange(false);
    }

    fetchData();

    setTimeout(() => setLoadingShown(false), 200);
  }, [onChange]);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('P&L Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  const [fromDate, setFromDate] = React.useState(formatDate(firstThisMonth));
  const [toDate, setToDate] = React.useState(formatDate(todayDate));
  const [sheetDate] = React.useState(sheetFormatDate);
  const store = useStore();

  const { getBalanceSheetData } = store.BalanceSheetStore;

  const {
    balanceSheetPayableAmount,
    balanceSheetReceivableAmount,

    balanceSheetTaxGstPayableAmount,
    balanceSheetTaxGstReceivableAmount,

    balanceSheetTaxTcsPayableAmount,
    balanceSheetTaxTcsReceivableAmount,

    balanceSheetOpeningCashInHand,
    balanceSheetOpeningBankBalance,
    balanceSheetOpeningPartyBalance,

    balanceSheetOpeningStockValue,
    balanceSheetClosingStockValue,

    balanceSheetBankAccountsData,
    balanceSheetAdvancesAmount
  } = toJS(store.BalanceSheetStore);

  return (
    <div>
      <div className={classes.root}>
        {isLoading && <BubbleLoader></BubbleLoader>}
        {!isLoading && (
          <div className={classes.root}>
            {isFeatureAvailable ? (
              <Paper className={classes.root}>
                <div className={classes.content}>
                  <div className={classes.contentLeft}>
                    <Typography gutterBottom variant="h4" component="h4">
                      BALANCE SHEET
                    </Typography>
                  </div>
                </div>

                <div>
                  <Grid container className={classes.categoryActionWrapper}>
                    <Grid item xs={8}>
                      <div>
                        <form className={classes.blockLine} noValidate>
                          <TextField
                            id="date"
                            label="From"
                            type="date"
                            value={fromDate}
                            onChange={(e) => {
                              setFromDate(formatDate(e.target.value));
                              setOnChange(true);
                            }}
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </form>
                        <form className={classes.blockLine} noValidate>
                          <TextField
                            id="date"
                            label="To"
                            type="date"
                            value={toDate}
                            onChange={(e) => {
                              setToDate(formatDate(e.target.value));

                              setOnChange(true);
                            }}
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </form>
                      </div>
                    </Grid>
                    <Grid item xs={4} style={{ marginTop: '14px' }}>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justify="flex-end"
                        className="category-actions-right"
                      >
                        <Avatar>
                          <IconButton>
                            <Excel fontSize="inherit" />
                          </IconButton>
                        </Avatar>
                        {/* <IconButton classes={{ label: classes.label }}>
              <Print fontSize="inherit" />
              <span className={classes.iconLabel}>Print</span>
                  </IconButton> */}
                      </Grid>
                    </Grid>
                  </Grid>
                </div>

                <div className={classes.title}>
                  <h6>Balance Sheet as on {sheetDate}</h6>
                </div>

                <div className={classes.setPadding}>
                  <Grid container className={classes.contPad}>
                    <Grid item xs={6} className={classes.gridContentRight}>
                      <Grid container className={classes.headrRight}>
                        <Grid item xs={6}>
                          Liablities
                        </Grid>
                        <Grid item xs={6} className={classes.textAlignEnd}>
                          Amount
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid item xs={12} className={classes.subHeaderRight}>
                          Current Liability
                        </Grid>
                      </Grid>

                      <Grid container className={classes.listItemsRight}>
                        <Grid item xs={6} className={classes.mrbtm}>
                          Accounts Payable / Sundry Creditors
                        </Grid>
                        <Grid item xs={6} className={classes.textAlignEnd}>
                          {balanceSheetPayableAmount
                            ? parseFloat(balanceSheetPayableAmount).toFixed(2)
                            : 0}
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          style={{ color: 'rgb(125 6 125)' }}
                          className={classes.mrbtm}
                        >
                          Loan Accounts
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          className={classes.textAlignEnd}
                          style={{ color: 'rgb(125 6 125)' }}
                        >
                          {0}
                        </Grid>

                        <Grid item xs={6} className={classes.mrbtm}>
                          Tax payable
                        </Grid>
                        <Grid item xs={6} className={classes.textAlignEnd}>
                          {balanceSheetTaxGstPayableAmount
                            ? parseFloat(
                                balanceSheetTaxGstPayableAmount
                              ).toFixed(2)
                            : 0}            
                        </Grid>

                        <Grid item xs={6} className={classes.mrbtm}>
                          Advance for sales order
                        </Grid>
                        <Grid item xs={6} className={classes.textAlignEnd}>
                          {balanceSheetAdvancesAmount
                            ? parseFloat(balanceSheetAdvancesAmount).toFixed(2)
                            : 0}
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid item xs={12} className={classes.subHeaderRight}>
                          Equity/Capital
                        </Grid>
                      </Grid>

                      <Grid container className={classes.listItemsRight}>
                        <Grid
                          item
                          xs={6}
                          className={classes.mrbtm}
                          style={{ color: 'rgb(125 6 125)' }}
                        >
                          Opening balance equity
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          className={classes.textAlignEnd}
                          style={{ color: 'rgb(125 6 125)' }}
                        >
                          {0}
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          style={{ color: 'rgb(125 6 125)' }}
                          className={classes.mrbtm}
                        >
                          Owner's equity
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          className={classes.textAlignEnd}
                          style={{ color: 'rgb(125 6 125)' }}
                        >
                          0
                        </Grid>

                        <Grid item xs={6} className={classes.mrbtm}>
                          Retained Earnings
                        </Grid>
                        <Grid item xs={6} className={classes.textAlignEnd}>
                          0
                        </Grid>

                        <Grid item xs={6} className={classes.mrbtm}>
                          Net Income (profit)
                        </Grid>
                        <Grid item xs={6} className={classes.textAlignEnd}>
                          0
                        </Grid>

                        <Grid item xs={12} style={{ height: 81.5 }}></Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={6} className={classes.gridContent}>
                      <Grid container className={classes.headTab}>
                        <Grid item xs={6}>
                          Assests
                        </Grid>
                        <Grid item xs={6} className={classes.textAlignEnd}>
                          Amount
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid item xs={12} className={classes.subHeadLeft}>
                          Current Assets
                        </Grid>
                      </Grid>

                      <Grid container className={classes.listItems}>
                        <Grid item xs={6} className={classes.mrbtm}>
                          Cash in hand
                        </Grid>
                        <Grid item xs={6} className={classes.textAlignEnd}>
                        {balanceSheetOpeningCashInHand
                            ? parseFloat(balanceSheetOpeningCashInHand).toFixed(
                                2
                              )
                            : 0}
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          style={{ color: 'rgb(125 6 125)' }}
                          className={classes.mrbtm}
                        >
                          Bank Accounts
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          className={classes.textAlignEnd}
                          style={{ color: 'rgb(125 6 125)' }}
                        >
                          0
                        </Grid>

                        <Grid item xs={6} className={classes.mrbtm}>
                          Accounts receivable/ Sundry Debtors
                        </Grid>
                        <Grid item xs={6} className={classes.textAlignEnd}>
                          {balanceSheetReceivableAmount
                            ? parseFloat(balanceSheetReceivableAmount).toFixed(
                                2
                              )
                            : 0}
                        </Grid>

                        <Grid item xs={6} className={classes.mrbtm}>
                          Inventory on hand/ Closing stock
                        </Grid>
                        <Grid item xs={6} className={classes.textAlignEnd}>
                          {balanceSheetClosingStockValue
                            ? parseFloat(balanceSheetClosingStockValue).toFixed(
                                2
                              )
                            : 0}
                        </Grid>

                        <Grid item xs={6} className={classes.mrbtm}>
                          Tax Receivable
                        </Grid>
                        <Grid item xs={6} className={classes.textAlignEnd}>
                          {balanceSheetTaxGstReceivableAmount
                            ? parseFloat(
                                balanceSheetTaxGstReceivableAmount
                              ).toFixed(2)
                            : 0}

                          {balanceSheetTaxTcsReceivableAmount
                            ? parseFloat(
                                balanceSheetTaxTcsReceivableAmount
                              ).toFixed(2)
                            : 0}
                        </Grid>
                        <Grid item xs={12} style={{ height: 225 }}></Grid>
                      </Grid>
                    </Grid>
                    <Grid container className={classes.bottomTab}>
                      <Grid item xs={3} className={classes.listItems}>
                        Liabilities Total
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        className={classes.textAlignEnd}
                        style={{ padding: 10 }}
                      >
                        0
                      </Grid>
                      <Grid item xs={3} className={classes.listItems}>
                        Assets Total
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        className={classes.textAlignEnd}
                        style={{
                          padding: 10,
                          borderRight: '1px solid #b0b0b0'
                        }}
                      >
                        0
                      </Grid>
                    </Grid>
                  </Grid>
                  <div></div>
                </div>
              </Paper>
            ) : (
              <NoPermission />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InjectObserver(BalanceSheetReport);
