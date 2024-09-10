import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  makeStyles
} from '@material-ui/core';
import * as dateHelper from 'src/components/Helpers/DateHelper';
import {
  getDataByDay,
  getDataByMonth
} from 'src/components/Helpers/ChartDataHelper/DailyAndMonthlyDataHelper';

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

const PurchaseVsDebitNote = ({ className, labelText, ...rest }) => {
  const classes = useStyles();
  const [data, SetData] = React.useState([]);

  useEffect(() => {
    getDailyData();
    return () => {
      SetData(null);
    };
  }, []);

  const handleChange = async (type) => {
    if (type === 'daily') {
      await getDailyData();
    } else if (type === 'monthly') {
      getMonthlyData();
    }
  };

  const getDailyData = async () => {
    const purchasesDayMap = await getDataByDay('Purchases');

    let purchasesLabelsList = [];
    let purchasesValues = [];

    let purchasesReturnLabelsList = [];
    let purchasesReturnValues = [];

    purchasesDayMap.forEach((item, key) => {
      purchasesValues.push(parseFloat(item).toFixed(2));
      purchasesLabelsList.push(key);
    });

    const salesReturnMap = await getDataByDay('Purchases Return');

    salesReturnMap.forEach((item, key) => {
      purchasesReturnValues.push(parseFloat(item).toFixed(2));
      purchasesReturnLabelsList.push(key);
    });

    SetData({
      labels: purchasesReturnLabelsList,
      datasets: [
        {
          label: 'Purchase',
          data: purchasesValues,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Debit Note',
          data: purchasesReturnValues,
          fill: false,
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    });
  };

  const getMonthlyData = async () => {
    const startDate = dateHelper.getFinancialYearStartDate();
    const endDate = dateHelper.getFinancialYearEndDate();

    const purchasesMap = await getDataByMonth(startDate, endDate, 'Purchases');
    const purchasesLabelsList = [];
    const purchasesValues = [];
    purchasesMap.forEach((item, key) => {
      purchasesValues.push(parseFloat(item.taxableValue).toFixed(2));
      purchasesLabelsList.push(key);
    });

    const purchasesReturnMap = await getDataByMonth(
      startDate,
      endDate,
      'Purchases Return'
    );
    let purchasesReturnLabelsList = [];
    let purchasesReturnValues = [];
    purchasesReturnMap.forEach((item, key) => {
      purchasesReturnValues.push(parseFloat(item.taxableValue).toFixed(2));
      purchasesReturnLabelsList.push(key);
    });

    SetData({
      labels: purchasesReturnLabelsList,
      datasets: [
        {
          label: 'Purchase',
          data: purchasesValues,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Debit Note',
          data: purchasesReturnValues,
          fill: false,
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    });
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader
        action={
          <Box>
            <Button
              variant="text"
              className={classes.btn}
              onClick={() => handleChange('daily')}
            >
              Daily
            </Button>
            <Button
              className={classes.btn}
              variant="text"
              onClick={() => handleChange('monthly')}
            >
              Monthly
            </Button>
          </Box>
        }
        title={<Box className={classes.headerText}>{labelText}</Box>}
      />
      <CardContent>
        <Box height={200} position="relative">
          <Line
            data={data}
            options={{
              maintainAspectRatio: false,
              title: {
                display: true,
                text: ''
              },
              legend: {
                display: true,
                position: 'bottom'
              },
              layout: {
                padding: {
                  top: 0,
                  bottom: 0,
                  left: 5,
                  right: 0
                }
              },
              scales: {
                xAxes: [
                  {
                    gridLines: {
                      display: false
                    }
                  }
                ],
                yAxes: [
                  {
                    gridLines: {
                      display: false
                    },
                    ticks: {
                      beginAtZero: true,
                      callback: function (value) {
                        return value.toLocaleString();
                      }
                    }
                  }
                ]
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

PurchaseVsDebitNote.propTypes = {
  className: PropTypes.string
};

export default PurchaseVsDebitNote;