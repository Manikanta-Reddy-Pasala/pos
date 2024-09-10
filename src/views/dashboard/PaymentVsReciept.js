import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import * as dateHelper from 'src/components/Helpers/DateHelper';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  makeStyles
} from '@material-ui/core';
import { getPaymentAndReceiptData } from 'src/components/Helpers/ChartDataHelper/PaymentAndReceiptDataHelper';

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: '0px 0px 12px -3px #0000004a',
    borderRadius: '10px',
    padding: '10px'
  },
  btn: {
    color: '#888',
    textTransform: 'unset',
    fontSize: '16px'
  },
  headerText: {
    color: '#263238',
    fontWeight: 'bold',
    fontSize: '20px'
  }
}));

const PaymentVsReciept = ({ className, labelText, ...rest }) => {
  const classes = useStyles();
  const [receipt, setReceipt] = React.useState(0);
  const [payment, setPayment] = React.useState(0);

  useEffect(() => {
    getDataByType('today');
  }, []);

  const handleChange = async (type) => {
    await getDataByType(type);
  };

  const getDataByType = async (type) => {
    let startDate;
    let endDate;

    switch (type) {
      case 'today':
        startDate = dateHelper.getTodayDateInYYYYMMDD();
        endDate = dateHelper.getTodayDateInYYYYMMDD();
        break;
      case 'month':
        startDate = dateHelper.getMonthBeginningDate();
        endDate = dateHelper.getTodayDateInYYYYMMDD();
        break;
      case 'year':
        startDate = dateHelper.getFinancialYearStartDate();
        endDate = dateHelper.getFinancialYearEndDate();
        break;
      default:
        break;
    }

    const data = await getPaymentAndReceiptData(startDate, endDate);
    setReceipt(data.receipt);
    setPayment(data.payment);
  };

  const dataDoughnut = {
    labels: ['Payment - ₹ ' + payment, 'Receipt - ₹ ' + receipt],
    datasets: [
      {
        label: '',
        data: [payment, receipt],
        backgroundColor: ['rgba(255, 175, 1, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 175, 1, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1
      }
    ]
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader
        action={
          <Box>
            <Button
              variant="text"
              className={classes.btn}
              onClick={() => handleChange('today')}
            >
              Today
            </Button>
            <Button
              variant="text"
              className={classes.btn}
              onClick={() => handleChange('month')}
            >
              This Month
            </Button>
            <Button
              className={classes.btn}
              variant="text"
              onClick={() => handleChange('year')}
            >
              This Year
            </Button>
          </Box>
        }
        title={<Box className={classes.headerText}>{labelText}</Box>}
      />
      <CardContent>
        <Box height={205} position="relative">
          <Doughnut
            data={dataDoughnut}
            options={{
              responsive: true,
              maintainAspectRatio: false
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

PaymentVsReciept.propTypes = {
  className: PropTypes.string
};

export default PaymentVsReciept;