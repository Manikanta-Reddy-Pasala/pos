import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import TextField from '@material-ui/core/TextField';
import '../../../Expenses/ExpenseTable.css';
import { Typography, Grid, IconButton, Avatar, Paper } from '@material-ui/core';
import clsx from 'clsx';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
const useStyles = makeStyles((theme) => ({
  selectFont: {
    fontSize: '13px'
  },
  noLabel: {
    marginTop: theme.spacing(3)
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    borderRadius: '12px'
  },
  contentRight: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  root: {
    padding: 2,
    borderRadius: '12px',
    '& .makeStyles-paper-31': {
      borderRadius: '12px'
    }
  },
  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
    border: '1px solid grey',
    padding: '6px',
    background: 'white'
  },
  label: {
    flexDirection: 'column'
  },
  iconLabel: {
    fontSize: 'x-small'
  },
  iconAlign: {
    textAlign: 'end',
    padding: '14px'
  },
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  },
  textAlign: {
    textAlign: 'end'
  },
  contPad: {
    padding: '15px'
  },
  headTab: {
    borderTop: '2px solid #cecdcd',
    paddingTop: '8px',
    paddingBottom: '10px',
    borderBottom: '1px solid #cecdcd',
    background: '#F4F4F4'
  },
  marl: {
    marginLeft: '5px'
  },
  marr: {
    marginRight: '5px'
  },
  setPadding: {
    paddingTop: '10px',
    paddingBottom: '10px'
  },
  bgColor: {
    background: '#F7F7F7'
  },
  marll: {
    marginLeft: '30px'
  },
  borderSet: {
    borderBottom: '2px solid #cecdcd',
    borderTop: '2px solid #cecdcd'
  },
  topBorder: {
    borderTop: '2px solid #cecdcd'
  },
  bottomcontPad: {
    padding: '15px'
  },
  categoryActionWrapper: {
    paddingRight: '10px',
    '& .category-actions-left': {
      '& > *': {
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    },
    '& .category-actions-right': {
      '& > *': {
        marginLeft: theme.spacing(2),
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    }
  },
  header: {
    fontWeight: 'bold',
    fontFamily: 'Roboto'
  }
}));

const ManufacturingAccount = () => {
  const classes = useStyles();
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
  const [onChange, setOnChange] = useState(true);

  const [isLoading, setLoadingShown] = useState(true);

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const [fromDate, setFromDate] = React.useState(formatDate(firstThisMonth));
  const [toDate, setToDate] = React.useState(formatDate(todayDate));
  const store = useStore();
  const { getMfgProfitAndLossData } = store.ReportsStore;
  const {
    totalMfgOpeningStockRawMaterial,
    totalMfgPurchaseRawMaterialAmount,
    totalMfgPurchaseReturnRawMaterialAmount,
    totalMfgClosingStockRawMaterial,
    totalMfgExpenses,
    totalMfgAmount,
    totalMfgExpensesList,
    totalMfgRawMaterialConsumptionAmount
  } = toJS(store.ReportsStore);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (onChange) {
        const businessData = await Bd.getBusinessData();
        await checkPermissionAvailable(businessData);
        getMfgProfitAndLossData(fromDate, toDate);
        setOnChange(false);
      }
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

  const calculateCostOfRawMaterialsConsumed = () => {
    let total =
      parseFloat(totalMfgOpeningStockRawMaterial) +
      parseFloat(totalMfgPurchaseRawMaterialAmount) -
      parseFloat(totalMfgPurchaseReturnRawMaterialAmount) -
      parseFloat(totalMfgClosingStockRawMaterial);
    return parseFloat(total).toFixed(2);
  };

  const calculateProductionCost = () => {
    console.log('Total Mfg Amount : ', totalMfgAmount);
    let total =
      parseFloat(totalMfgOpeningStockRawMaterial) +
      parseFloat(totalMfgPurchaseRawMaterialAmount) -
      parseFloat(totalMfgPurchaseReturnRawMaterialAmount) -
      parseFloat(totalMfgClosingStockRawMaterial) +
      parseFloat(totalMfgAmount);
    return parseFloat(total).toFixed(2);
  };

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataForMfgAccountExcel = () => {
    const wb = new Workbook();

    let data = [];

    const record = {
      Particulars: '',
      Amount: ''
    };
    data.push(record);

    const openingStockRecord = {
      Particulars: 'Opening Stock of Raw Materials(+)',
      Amount: parseFloat(totalMfgOpeningStockRawMaterial).toFixed(2)
    };
    data.push(openingStockRecord);

    const purchaseRecord = {
      Particulars: 'Raw Material Purchase(+)',
      Amount: parseFloat(totalMfgPurchaseRawMaterialAmount).toFixed(2)
    };
    data.push(purchaseRecord);

    const carriageInwardRecord = {
      Particulars: 'Carriage Inwards(+)',
      Amount: 0
    };
    data.push(carriageInwardRecord);

    const purchaseReturnRecord = {
      Particulars: 'Purchase Return Raw Material(-)',
      Amount: parseFloat(totalMfgPurchaseReturnRawMaterialAmount).toFixed(2)
    };
    data.push(purchaseReturnRecord);

    const closingStockRecord = {
      Particulars: 'Closing Stock of Raw Materials(+)',
      Amount: parseFloat(totalMfgClosingStockRawMaterial).toFixed(2)
    };
    data.push(closingStockRecord);

    const emptyRecord = {};
    data.push(emptyRecord);

    const costOfRawMaterialConsumed = {
      Particulars: 'Cost Of Raw Materials Consumed',
      Amount: calculateCostOfRawMaterialsConsumed()
    };
    data.push(costOfRawMaterialConsumed);

    data.push(emptyRecord);

    if (totalMfgExpensesList && totalMfgExpensesList.length > 0) {
      for (let exp of totalMfgExpensesList) {
        const mfgRecord = {
          Particulars: 'Mfg ' + exp.expName,
          Amount: parseFloat(exp.expValue).toFixed(2)
        };
        data.push(mfgRecord);
      }
    }

    data.push(emptyRecord);

    const calculateProductionStockBeforeWorkInProgress = {
      Particulars: '',
      Amount: calculateProductionCost()
    };
    data.push(calculateProductionStockBeforeWorkInProgress);

    data.push(emptyRecord);

    const openingwork = {
      Particulars: 'Opening Work In Progress(+)',
      Amount: 0
    };
    data.push(openingwork);

    const closingwork = {
      Particulars: 'Closing Work In Progress(-)',
      Amount: 0
    };
    data.push(closingwork);

    data.push(emptyRecord);
    data.push(emptyRecord);

    const totalProductionCost = {
      Particulars: 'Production Cost of Goods Produced',
      Amount: calculateProductionCost()
    };
    data.push(totalProductionCost);

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Manufacturing Account Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Manufacturing Account Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Manufacturing_Account_Report';

    download(url, fileName + '.xlsx');
  };

  const download = (url, name) => {
    let a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);

    const view = new Uint8Array(buf);

    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;

    return buf;
  }

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div className={classes.root}>
          {isFeatureAvailable ? (
            <Paper className={classes.root}>
              <div className={classes.content}>
                <div className={classes.contentLeft}>
                  <Typography gutterBottom variant="h4" component="h4">
                    MANUFACTURING ACCOUNT
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
                        <IconButton onClick={() => getDataForMfgAccountExcel()}>
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
              <div>
                <div className={classes.contPad}>
                  <Grid container className={classes.headTab}>
                    <Grid item xs={6}>
                      <p className={classes.marl}>Particulars</p>
                    </Grid>
                    <Grid item xs={6} className={classes.textAlign}>
                      <p className={classes.marr}>Amount</p>
                    </Grid>
                  </Grid>
                  <Grid container className={classes.setPadding}>
                    <Grid item xs={6} justify="flex-start">
                      <p className={classes.marl}>
                        {' '}
                        Opening Stock of Raw Materials(+)
                      </p>
                    </Grid>
                    <Grid item xs={6} className={classes.textAlign}>
                      <p className={classes.marr}>
                        &#8377;{' '}
                        {totalMfgOpeningStockRawMaterial
                          ? parseFloat(totalMfgOpeningStockRawMaterial).toFixed(
                              2
                            )
                          : 0}
                      </p>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    className={clsx(classes.setPadding, classes.bgColor)}
                  >
                    <Grid item xs={6} justify="flex-start">
                      <p className={classes.marl}> Raw Material Consumption(-)</p>
                    </Grid>
                    <Grid item xs={6} className={classes.textAlign}>
                      <p className={classes.marr}>
                        &#8377;{' '}
                        {totalMfgRawMaterialConsumptionAmount
                          ? parseFloat(
                            totalMfgRawMaterialConsumptionAmount
                            ).toFixed(2)
                          : 0}
                      </p>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    className={clsx(classes.setPadding, classes.bgColor)}
                  >
                    <Grid item xs={6} justify="flex-start">
                      <p className={classes.marl}> Raw Material Purchase(+)</p>
                    </Grid>
                    <Grid item xs={6} className={classes.textAlign}>
                      <p className={classes.marr}>
                        &#8377;{' '}
                        {totalMfgPurchaseRawMaterialAmount
                          ? parseFloat(
                              totalMfgPurchaseRawMaterialAmount
                            ).toFixed(2)
                          : 0}
                      </p>
                    </Grid>
                  </Grid>
                  <Grid container className={classes.setPadding}>
                    <Grid item xs={6} justify="flex-start">
                      <p className={classes.marl}> Carriage Inwards(+)</p>
                    </Grid>
                    <Grid item xs={6} className={classes.textAlign}>
                      <p className={classes.marr}>&#8377; {0}</p>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    className={clsx(classes.setPadding, classes.bgColor)}
                  >
                    <Grid item xs={6} justify="flex-start">
                      <p className={classes.marl}>
                        {' '}
                        Purchase Return Raw Material(-)
                      </p>
                    </Grid>
                    <Grid item xs={6} className={classes.textAlign}>
                      <p className={classes.marr}>
                        &#8377;{' '}
                        {totalMfgPurchaseReturnRawMaterialAmount
                          ? parseFloat(
                              totalMfgPurchaseReturnRawMaterialAmount
                            ).toFixed(2)
                          : 0}
                      </p>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    className={clsx(classes.setPadding, classes.bgColor)}
                  ></Grid>
                  <Grid container className={clsx(classes.setPadding)}>
                    <Grid item xs={6} justify="flex-start">
                      <p className={classes.marl}>
                        {' '}
                        Closing Stock of Raw Materials(-)
                      </p>
                    </Grid>
                    <Grid item xs={6} className={classes.textAlign}>
                      <p className={classes.marr}>
                        &#8377; {totalMfgClosingStockRawMaterial}
                      </p>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    className={clsx(classes.setPadding, classes.topBorder)}
                  >
                    <Grid item xs={6} justify="flex-start">
                      <p className={clsx(classes.marl, classes.header)}>
                        Cost of Raw Materials Consumed
                      </p>
                    </Grid>
                    <Grid item xs={6} className={classes.textAlign}>
                      <p className={classes.marr}>
                        &#8377; {calculateCostOfRawMaterialsConsumed()}
                      </p>
                    </Grid>
                  </Grid>

                  {totalMfgExpenses
                    ? Array.from(totalMfgExpenses.keys()).map((key) => {
                        return (
                          <>
                            <Grid
                              container
                              className={clsx(
                                classes.setPadding,
                                classes.bgColor
                              )}
                            >
                              <Grid item xs={6} justify="flex-start">
                                <p className={classes.marl}>Mfg {key}</p>
                              </Grid>
                              <Grid item xs={6} className={classes.textAlign}>
                                <p
                                  className={clsx(
                                    classes.marr,
                                    classes.redText
                                  )}
                                >
                                  &#8377;{' '}
                                  {parseFloat(
                                    totalMfgExpenses.get(key)
                                  ).toFixed(2)}
                                </p>
                              </Grid>
                            </Grid>
                          </>
                        );
                      })
                    : null}

                  <Grid
                    container
                    className={clsx(classes.setPadding, classes.topBorder)}
                  >
                    <Grid item xs={6} justify="flex-start">
                      <p className={clsx(classes.marl)}> </p>
                    </Grid>
                    <Grid item xs={6} className={classes.textAlign}>
                      <p className={classes.marr}>
                        &#8377; {calculateProductionCost()}
                      </p>
                    </Grid>
                  </Grid>

                  <Grid container className={clsx(classes.setPadding)}>
                    <Grid item xs={6} justify="flex-start">
                      <p className={classes.marl}>
                        Opening Work In Progress(+)
                      </p>
                    </Grid>
                    <Grid item xs={6} className={classes.textAlign}>
                      <p className={classes.marr}>&#8377; {0}</p>
                    </Grid>
                  </Grid>

                  <Grid container className={clsx(classes.setPadding)}>
                    <Grid item xs={6} justify="flex-start">
                      <p className={classes.marl}>
                        Closing Work In Progress(-)
                      </p>
                    </Grid>
                    <Grid item xs={6} className={classes.textAlign}>
                      <p className={classes.marr}>&#8377; {0}</p>
                    </Grid>
                  </Grid>
                </div>
              </div>

              <div className={classes.bottomcontPad}>
                <Grid
                  container
                  className={clsx(classes.setPadding, classes.topBorder)}
                >
                  <Grid item xs={6}>
                    <p
                      className={clsx(classes.marl, classes.header)}
                      style={{ fontWeight: 500 }}
                    >
                      {' '}
                      Production Cost of Goods Produced
                    </p>
                  </Grid>
                  <Grid item xs={6} className={classes.textAlign}>
                    <p className={classes.marr} style={{ fontWeight: 500 }}>
                      &#8377; {calculateProductionCost()}
                    </p>
                  </Grid>
                </Grid>
              </div>
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
    </div>
  );
};

export default InjectObserver(ManufacturingAccount);