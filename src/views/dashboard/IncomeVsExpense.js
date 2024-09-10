import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  makeStyles,
  colors,
  Select,
  MenuItem
} from '@material-ui/core';
import { getIncomeExpenseData } from 'src/components/Helpers/ChartDataHelper/ProfitLossHelper';

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

const IncomeVsExpense = ({ className, labelText, ...rest }) => {
  const classes = useStyles();
  const [barChartData, setbarChartData] = useState([]);

  useEffect(() => {
    getMonthlyData();
    return () => {
      setbarChartData(null);
    };
  }, []);

  const handleChange = (event) => {
    const selectedFilter = event.target.value;
      getMonthlyData(selectedFilter );
  };

  const getMonthlyData = async (selectedFilter) => {
    let currentDate = new Date();
    if (selectedFilter === 2)
    {
      currentDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
    }

    const plMap = await getIncomeExpenseData(currentDate);
    let labelsList = [];
    let incomeValues = [];
    let expenseValues = [];
    plMap.forEach((item, key) => {
      incomeValues.push(parseFloat(item.income).toFixed(2));
      expenseValues.push(parseFloat(item.expense).toFixed(2));
      labelsList.push(key);
    });

    setbarChartData({
      labels: labelsList,
      datasets: [
        {
          label: 'Income',
          data: incomeValues,
          backgroundColor: colors.blue[300]
        },
        {
          label: 'Expense',
          data: expenseValues,
          backgroundColor: '#ffaf01'
        }
      ]
    });
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader
        action={
          <Box>
            <Select
              disableUnderline={true}
              onChange={handleChange}
              defaultValue={1}
              className={classes.select}
            >
              <MenuItem value={1}>This Fiscal Year</MenuItem>
              <MenuItem value={2}>Previous Fiscal Year</MenuItem>
            </Select>
          </Box>
        }
        title={
          <Box className={classes.headerText}>
            Income Vs Expense
          </Box>
        }
      />
      <CardContent>
        <Box height={230} position="relative">
          <Bar
            data={barChartData}
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

IncomeVsExpense.propTypes = {
  className: PropTypes.string
};

export default IncomeVsExpense;