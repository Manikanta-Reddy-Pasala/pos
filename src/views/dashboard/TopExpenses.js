import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';
import * as dateHelper from 'src/components/Helpers/DateHelper';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  makeStyles,
  Select,
  MenuItem
} from '@material-ui/core';
import { getExpensesDataByCategory } from 'src/components/Helpers/ChartDataHelper/ExpensesByCategoryDataHelper';
import { Bold } from 'react-feather';

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

const TopExpenses = ({ className, labelText, ...rest }) => {
  const classes = useStyles();
  const [labels, setLabels] = React.useState([]);
  const [data, setData] = React.useState([]);

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (event) => {
    const selectedFilter = event.target.value;
    getData(selectedFilter);
  };

  const getData = async (selectedFilter) => {
    let startDate = new Date();
    let endDate = new Date();
    const currentDate = new Date();
    let startingMonth = new Date();
    let lastDayOfMonth = new Date();
    let labels = [];
    let values = [];

    if (selectedFilter === 2) {
      //Previous Fiscal Year
      const previousYear = currentDate.getFullYear() - 1;
      startDate = previousYear + '-04-01';
      endDate = currentDate.getFullYear() + '-03-31';
    } else if (selectedFilter === 3) {
      //Today
      startDate =
        currentDate.getFullYear() +
        '-' +
        (currentDate.getMonth() + 1) +
        '-' +
        currentDate.getDate();
      endDate =
        currentDate.getFullYear() +
        '-' +
        (currentDate.getMonth() + 1) +
        '-' +
        currentDate.getDate();
    } else if (selectedFilter === 4) {
      //This Months
      startDate =
        currentDate.getFullYear() +
        '-' +
        (currentDate.getMonth() + 1) +
        '-' +
        '01';
      endDate =
        currentDate.getFullYear() +
        '-' +
        (currentDate.getMonth() + 1) +
        '-' +
        currentDate.getDate();
    } else if (selectedFilter === 5) {
      //Last Quarter
      startingMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 2,
        1
      );
      startDate =
        startingMonth.getFullYear() +
        '-' +
        startingMonth.getMonth() +
        '-' +
        '01';
      lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      endDate =
        lastDayOfMonth.getFullYear() +
        '-' +
        lastDayOfMonth.getMonth() +
        '-' +
        lastDayOfMonth.getDate();
    } else if (selectedFilter === 6) {
      //Last 6 Months
      startingMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 5,
        1
      );
      startDate =
        startingMonth.getFullYear() +
        '-' +
        startingMonth.getMonth() +
        '-' +
        '01';
      lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      endDate =
        lastDayOfMonth.getFullYear() +
        '-' +
        lastDayOfMonth.getMonth() +
        '-' +
        lastDayOfMonth.getDate();
      console.log(startDate + 'fromtodate' + endDate);
    } else {
      startDate = dateHelper.getFinancialYearStartDate();
      endDate = dateHelper.getFinancialYearEndDate();
    }

    const output = await getExpensesDataByCategory(startDate, endDate);

    for (let item of output) {
      labels.push(
        item.category.toUpperCase() +
          ' - ₹ ' +
          parseFloat(item.amount).toFixed(2)
      );
      values.push(parseFloat(item.amount).toFixed(2));
    }
    setLabels(labels);
    setData(values);
  };

  const dataPie = {
    labels: labels,
    datasets: [
      {
        label: '',
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 201, 140, 0.5)',
          'rgba(75, 162, 215, 0.5)',
          'rgba(255, 116, 90, 0.5)',
          'rgba(75, 220, 190, 0.5)',
          'rgba(153, 65, 200, 0.5)',
          'rgba(255, 100, 70, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 201, 140, 1)',
          'rgba(75, 162, 215, 1)',
          'rgba(255, 116, 90, 1)',
          'rgba(75, 220, 190, 1)',
          'rgba(153, 65, 200, 1)',
          'rgba(255, 100, 70, 1)'
        ],
        borderWidth: 1
      }
    ]
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
              <MenuItem value={3}>Today</MenuItem>
              <MenuItem value={4}>This month</MenuItem>
              <MenuItem value={5}>Last Quarter</MenuItem>
              <MenuItem value={6}>Last 6 Months</MenuItem>
            </Select>
          </Box>
        }
        title={
          <Box className={classes.headerText}>
            {/* {labelText} */} Top Expenses
          </Box>
        }
      />
      <CardContent>
        <Box height={230} position="relative">
          <Pie
            data={dataPie}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                position: 'right',
                onHover: '',
                labels: {
                  boxWidth: 10,
                  boxHeight: 10,
                  borderRadius: 5,
                  fontSize: 6,
                  fontStyle: Bold,
                  fontWeight: Bold
                }
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

TopExpenses.propTypes = {
  className: PropTypes.string
};

export default TopExpenses;