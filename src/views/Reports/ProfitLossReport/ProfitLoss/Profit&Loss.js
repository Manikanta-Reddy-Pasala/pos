import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import TextField from '@material-ui/core/TextField';
import '../../../Expenses/ExpenseTable.css';
import {
  Typography,
  Grid,
  Paper,
  Box
} from '@material-ui/core';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import NoPermission from '../../../noPermission';
import * as Bd from 'src/components/SelectedBusiness';
import BubbleLoader from 'src/components/loader';
import IndividualReport from './IndividualReport';
import { getProfitAndLossDataByDateRange } from 'src/components/Helpers/ProfitLossDataHelper';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    minHeight: '100%'
  },
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
    minHeight: '90vh',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
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
  greenText: {
    color: '#339900'
  },
  redText: {
    color: '#EF5350'
  },
  topBorder: {
    borderTop: '2px solid #cecdcd'
  },
  bottomcontPad: {
    padding: '15px',
    marginTop: '50px'
  },
  item: {
    padding: '0 10px'
  },
  itemlist: {
    cursor: 'pointer',
    padding: '0 10px',
    borderRadius: '3px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#eaeaea',
      transition: 'all 0.2s ease'
    }
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
  }
}));

const ProfitLoss = () => {
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

  const [expenseCategory, setExpenseCategory] = useState(null);

  const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  const [totalSaleReturnAmount, setTotalSaleReturnAmount] = useState(0);
  const [totalClosingStockValue, setTotalClosingStockValue] = useState(0);
  const [totalOpeningStockValue, setTotalOpeningStockValue] = useState(0);
  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
  const [totalPurchaseReturnAmount, setTotalPurchaseReturnAmount] = useState(0);
  const [totalExpensesAmount, setTotalExpensesAmount] = useState(0);
  const [totalIndirectExpensesAmount, setTotalIndirectExpensesAmount] =
    useState(0);
  const [directExp, setDirectExp] = useState([]);
  const [indirectExp, setInDirectExp] = useState([]);
  const [totalMfgAmount, setTotalMfgAmount] = useState(0);
  const [mfgExpenses, setMfgExpenses] = useState([]);

  const directExpList = [...directExp].map((item) => ({
    label: item.categoryName,
    value: item.total,
    catId: item.categoryId,
    businessId: item.businessId,
    id: 'expense'
  }));

  let groupedDirectExpList = [];

  directExpList.forEach((item) => {
    const cat = groupedDirectExpList.find((i) => i.catId === item.catId);
    if (!cat) {
      groupedDirectExpList.push(item);
    } else {
      groupedDirectExpList = groupedDirectExpList.map((i) =>
        i.catId !== item.catId
          ? { ...i }
          : { ...i, value: parseFloat(i.value) + parseFloat(item.value) }
      );
    }
  });

  const indirectExpList = indirectExp.map((item) => ({
    label: item.categoryName,
    value: item.total,
    catId: item.categoryId,
    businessId: item.businessId,
    id: 'expense'
  }));

  let groupedInDirectExpList = [];

  indirectExpList.forEach((item) => {
    const cat = groupedInDirectExpList.find((i) => i.catId === item.catId);
    if (!cat) {
      groupedInDirectExpList.push(item);
    } else {
      groupedInDirectExpList = groupedInDirectExpList.map((i) =>
        i.catId !== item.catId
          ? { ...i }
          : { ...i, value: parseFloat(i.value) + parseFloat(item.value) }
      );
    }
  });

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

  const [plType, setPlType] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (onChange) {
        const businessData = await Bd.getBusinessData();
        resetData();
        await checkPermissionAvailable(businessData);
        const plObject = await getProfitAndLossDataByDateRange(
          fromDate,
          toDate
        );
        setTotalSaleAmount(plObject.totalSaleAmount);
        setTotalSaleReturnAmount(plObject.totalSaleReturnAmount);
        setTotalClosingStockValue(plObject.totalClosingStockValue);
        setTotalOpeningStockValue(plObject.totalOpeningStockValue);
        setTotalPurchaseAmount(plObject.totalPurchaseAmount);
        setTotalPurchaseReturnAmount(plObject.totalPurchaseReturnAmount);
        setTotalExpensesAmount(plObject.totalDirectExpensesAmount);
        setTotalIndirectExpensesAmount(plObject.totalIndirectExpensesAmount);
        setDirectExp(plObject.directExpenses);
        setInDirectExp(plObject.indirectExpenses);
        setTotalMfgAmount(plObject.totalMfgAmount);
        setMfgExpenses(plObject.mfgExpenses);

        setOnChange(false);
        setTimeout(() => setLoadingShown(false), 200);
      }
    }

    fetchData();
  }, [onChange]);

  const resetData = () => {
    setTotalSaleAmount(0);
    setTotalSaleReturnAmount(0);
    setTotalClosingStockValue(0);
    setTotalOpeningStockValue(0);
    setTotalPurchaseAmount(0);
    setTotalPurchaseReturnAmount(0);
    setTotalExpensesAmount(0);
    setTotalIndirectExpensesAmount(0);
    setTotalMfgAmount(0);
    setDirectExp([]);
    setInDirectExp([]);
    setMfgExpenses([]);
  };

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

  const isNetProfit = () => {
    let amt =
      parseFloat(totalSaleAmount || 0) -
      parseFloat(totalSaleReturnAmount || 0) -
      parseFloat(totalPurchaseAmount || 0) +
      parseFloat(totalPurchaseReturnAmount || 0) -
      parseFloat(totalExpensesAmount || 0) -
      parseFloat(totalIndirectExpensesAmount || 0) -
      parseFloat(totalMfgAmount || 0) -
      parseFloat(totalOpeningStockValue || 0) +
      parseFloat(totalClosingStockValue || 0);

    if (amt < 0) {
      return false;
    } else {
      return true;
    }
  };

  const calculateNetLossOrProfit = () => {
    let res =
      parseFloat(totalSaleAmount || 0) -
      parseFloat(totalSaleReturnAmount || 0) -
      parseFloat(totalPurchaseAmount || 0) +
      parseFloat(totalPurchaseReturnAmount || 0) -
      parseFloat(totalExpensesAmount || 0) -
      parseFloat(totalIndirectExpensesAmount || 0) -
      parseFloat(totalMfgAmount || 0) -
      parseFloat(totalOpeningStockValue || 0) +
      parseFloat(totalClosingStockValue || 0);
    return parseFloat(res).toFixed(2);
  };

  const profitObj = {
    label: isNetProfit() ? 'Net Profit' : 'Net Loss',
    value: calculateNetLossOrProfit(),
    isPositiveValue: isNetProfit
  };

  const profitSec = isNetProfit() ? [profitObj] : [];
  const lossSec = isNetProfit() ? [] : [profitObj];

  const salesSection = [
    {
      label: 'Opening Stock',
      value: totalOpeningStockValue,
      id: 'openningStock'
    },
    {
      label: 'Purchase',
      value: totalPurchaseAmount
        ? parseFloat(totalPurchaseAmount).toFixed(2)
        : 0,
      id: 'purchase'
    },
    {
      label: 'Purchase Return',
      value: totalPurchaseReturnAmount
        ? -parseFloat(totalPurchaseReturnAmount).toFixed(2)
        : 0,
      isPositiveValue: true,
      id: 'purchaseReturn'
    },
    {
      label: 'Direct Expenses',
      // id: 'directExpense',
      value: totalExpensesAmount
        ? parseFloat(totalExpensesAmount).toFixed(2)
        : 0,

      subList: [...groupedDirectExpList]
    },
    {
      label: 'Direct Manufacture Expenses',
      value: totalMfgAmount ? parseFloat(totalMfgAmount).toFixed(2) : 0,
      subList: [...mfgExpenses]
    },
    {
      label: 'Indirect Expenses',
      value: totalIndirectExpensesAmount
        ? parseFloat(totalIndirectExpensesAmount).toFixed(2)
        : 0,
      // id: 'indirectExpense',
      subList: [...groupedInDirectExpList]
    },
    ...profitSec
  ];

  const purchaseSection = [
    {
      label: 'Sale',
      value: totalSaleAmount ? parseFloat(totalSaleAmount).toFixed(2) : 0,
      isPositiveValue: true,
      id: 'sale'
    },
    {
      label: 'Sales Return',
      value: totalSaleReturnAmount
        ? -parseFloat(totalSaleReturnAmount).toFixed(2)
        : 0,
      id: 'saleReturn'
    },
    {
      label: 'Other Income',
      value: 0
    },
    {
      label: 'Closing Stock',
      value: totalClosingStockValue,
      isPositiveValue: true,
      id: 'closingStock'
    },

    ...lossSec
  ];

  const getTotals = (data) => {
    const subListitems = [];
    const numberArr = [...data, ...subListitems]
      .map((item) => parseFloat(item.value ? item.value : null))
      ?.filter(Boolean);

    return numberArr
      .reduce((final, val) => {
        return final + val;
      }, 0)
      ?.toFixed(2);
  };

  const purchaseTotal = getTotals(purchaseSection);
  const saleTotal = getTotals(salesSection);

  const generateSubList = (data) => {
    return data?.map((section) => (
      <Grid
        container
        key={section.label}
        onClick={() => {
          setPlType(section.id);
          setExpenseCategory(section.catId);
        }}
        className={section.subList ? classes.item : classes.itemlist}
        style={{ position: 'relative', left: 10 }}
      >
        <Grid item xs={6} key={section.label + 'item'}>
          <Box py={1.5} pl={2}>
            {section.label}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box textAlign={'right'} py={1.5}>
            &#8377;{' '}
            {section.value > -1 ? section.value : `(${section.value * -1})`}
          </Box>
        </Grid>
      </Grid>
    ));
  };

  if (plType) {
    return (
      <IndividualReport
        plType={plType}
        date={{ fromDate, toDate }}
        expenseCategory={expenseCategory}
        clear={() => setPlType(null)}
      />
    );
  }

  return (
    <div className={classes.wrapper}>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div className={classes.root} style={{ minHeight: '100%' }}>
          {isFeatureAvailable ? (
            <Paper className={classes.root}>
              <div className={classes.content}>
                <div className={classes.contentLeft}>
                  <Typography gutterBottom variant="h4" component="h4">
                    PROFIT AND LOSS
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
                      justifyContent="flex-end"
                      className="category-actions-right"
                    >
                      {/* <Avatar>
                        <IconButton
                          onClick={() => getDataFromProfitLossReport()}
                        >
                          <Excel fontSize="inherit" />
                        </IconButton>
                      </Avatar> */}
                    </Grid>
                  </Grid>
                </Grid>
              </div>
              <Box
                pt={2.75}
                flexGrow={1}
                display={'flex'}
                flexDirection={'column'}
              >
                <Grid container component={Box} flexGrow={1}>
                  <Grid
                    item
                    xs={6}
                    component={Box}
                    borderRight={`1px solid #cacaca`}
                    borderColor={'#cacaca'}
                    pb={0}
                    px={1}
                  >
                    {salesSection.map((section) => (
                      <Grid
                        container
                        key={section.label}
                        {...(!section.subList && {
                          onClick: () => {
                            setPlType(section.id);
                            setExpenseCategory(section.catId);
                          }
                        })}
                        className={
                          section.subList ? classes.item : classes.itemlist
                        }
                      >
                        <Grid item xs={6}>
                          <Box py={1.5} fontWeight={600}>
                            {section.label}
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          {section.value !== null && (
                            <Box textAlign={'right'} py={1.5}>
                              &#8377;{' '}
                              {section.value > -1
                                ? section.value
                                : `(${section.value * -1})`}
                            </Box>
                          )}
                        </Grid>
                        {section?.subList && generateSubList(section.subList)}
                      </Grid>
                    ))}
                  </Grid>
                  <Grid item xs={6} component={Box} pb={0} px={1}>
                    {purchaseSection.map((section) => (
                      <Grid
                        container
                        {...(!section.subList && {
                          onClick: () => {
                            setPlType(section.id);
                            setExpenseCategory(section.catId);
                          }
                        })}
                        className={
                          section.subList ? classes.item : classes.itemlist
                        }
                      >
                        <Grid
                          item
                          xs={6}
                          key={section.label}
                          style={{ cursor: 'pointer' }}
                        >
                          <Box py={1.5} fontWeight={600}>
                            {section.label}
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          {section.value !== null && (
                            <Box textAlign={'right'} py={1.5}>
                              &#8377;{' '}
                              {section.value > -1
                                ? section.value
                                : `(${section.value * -1})`}
                            </Box>
                          )}
                        </Grid>
                        {section?.subList && generateSubList(section.subList)}
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid
                  position={'sticky'}
                  bottom={0}
                  bgcolor={'white'}
                  container
                  component={Box}
                  px={1}
                  style={{
                    boxShadow:
                      '0px 0px 0px rgb(0 0 0 / 5%), 0px -2px 13px rgba(0, 0, 0, 0.05)',
                    borderBottomLeftRadius: '12px',
                    borderBottomRightRadius: '12px'
                  }}
                >
                  <Grid
                    item
                    xs={6}
                    component={Box}
                    borderRight={`1px solid #cacaca`}
                    borderColor={'#cacaca'}
                    px={1}
                    py={0.5}
                  >
                    <Grid container>
                      <Grid item xs={6}>
                        <Box py={1.5} fontWeight={600}>
                          Total
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box textAlign={'right'} py={1.5} fontWeight={600}>
                          &#8377; {saleTotal}
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6} component={Box} px={1} py={0.5}>
                    <Grid container>
                      <Grid item xs={6}>
                        <Box py={1.5} fontWeight={600}>
                          Total
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box textAlign={'right'} py={1.5} fontWeight={600}>
                          &#8377; {purchaseTotal}
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
    </div>
  );
};

export default InjectObserver(ProfitLoss);
