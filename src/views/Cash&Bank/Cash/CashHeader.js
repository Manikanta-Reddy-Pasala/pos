import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';

const useStyles = makeStyles(() => ({
  root: {
    display: 'block',
    padding: 2
  }
}));

function CashHeader() {
  const classes = useStyles();

  const store = useStore();
  const { getTotalCashInHand } = store.ReportsStore;

  const [totalCashInHand, setTotalCashInHand] = React.useState(0);

  const { cashFlowList } = toJS(store.ReportsStore);

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const todayDate = new Date(thisYear, thisMonth, today);
  const firstYear = new Date(thisYear, 0, 1);

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };
  const [fromDate] = React.useState(formatDate(firstYear));
  const [toDate] = React.useState(formatDate(todayDate));

  useEffect(() => {
    async function fetchData() {
      setTotalCashInHand(await getTotalCashInHand(fromDate, toDate));
    }

    fetchData();
  }, [cashFlowList]);

  return (
    <div className={classes.root}>
      <Typography gutterBottom variant="h4" component="h4">
        Cash In Hand:{' '}
        {totalCashInHand >= 0 ? (
          <span style={{ color: '#339900' }}>
            &#8377; {parseFloat(totalCashInHand).toFixed(2)}
          </span>
        ) : (
          <span style={{ color: '#EF5350' }}>
            &#8377; {parseFloat(totalCashInHand).toFixed(2)}
          </span>
        )}
      </Typography>
    </div>
  );
}
export default InjectObserver(CashHeader);
