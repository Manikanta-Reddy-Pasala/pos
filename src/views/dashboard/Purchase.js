import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import * as dateHelper from 'src/components/Helpers/DateHelper';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  useTheme,
  makeStyles
} from '@material-ui/core';
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

const Purchase = ({ className, labelText, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [data, SetData] = React.useState([]);

  useEffect(() => {
    getDailyData();
    return () => {
      SetData(null);
    };
  }, []);

  const getDailyData = async () => {
    const dayMap = await getDataByDay('Purchases');

    let labelsList = [];
    let values = [];

    dayMap.forEach((item, key) => {
      values.push(parseFloat(item).toFixed(2));
      labelsList.push(key);
    });

    SetData({
      datasets: [
        {
          backgroundColor: '#9DCB6A',
          data: values
        }
      ],
      labels: labelsList
    });
  };

  const getMonthlyData = async () => {
    const startDate = dateHelper.getFinancialYearStartDate();
    const endDate = dateHelper.getFinancialYearEndDate();
    const dataMap = await getDataByMonth(startDate, endDate, 'Sales');

    const labelsList = [];
    const values = [];

    dataMap.forEach((item, key) => {
      values.push(parseFloat(item.taxableValue).toFixed(2));
      labelsList.push(key);
    });

    SetData({
      datasets: [
        {
          backgroundColor: '#9DCB6A',
          data: values
        }
      ],
      labels: labelsList
    });
  };

  const handleChange = async (type) => {
    if (type === 'daily') {
      await getDailyData();
    } else if (type === 'monthly') {
      getMonthlyData();
    }
  };

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          barThickness: 12,
          maxBarThickness: 10,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          ticks: {
            fontColor: theme.palette.text.secondary
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider
          }
        }
      ]
    },
    tooltips: {
      borderWidth: 1,
      enabled: true,
      intersect: false,
      mode: 'index'
    }
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
          <Line data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

Purchase.propTypes = {
  className: PropTypes.string
};

export default Purchase;