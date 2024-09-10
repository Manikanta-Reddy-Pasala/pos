import React, { useEffect, useState } from 'react';
import { Paper, Box, Button } from '@material-ui/core';

import { getAllSalesByDateRangeSorted } from 'src/components/Helpers/dbQueries/sales';
import * as dateHelper from 'src/components/Helpers/DateHelper';
import { getDataByMonth } from '../Helper/SalesDataHelper';

import { Bar } from 'react-chartjs-2';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';

import { TextField, MenuItem } from '@material-ui/core';
import { options } from './chart.config';
import { useStyles } from './style';

import SalesInfoGrid from '../SalesInfoGrid/SalesInfo';

const YearlySales = () => {
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);

  const classes = useStyles();

  const currentYear = new Date().getFullYear();

  const newYears = Array.from({ length: 2 }, (v, i) => currentYear + i + 1);
  const recentYears = Array.from({ length: 3 }, (v, i) => currentYear - i);

  const [financialYear, setFinancialYear] = useState(recentYears[0]);
  const [salesReport, setSalesReport] = useState({});

  useEffect(() => {
    getData();
  }, [financialYear]);

  const chartDataSet = {
    labels,
    datasets: [
      {
        label: 'Year',
        data: data.map((item) => item.invoiceValue),
        backgroundColor: 'green',
        barThickness: 30
      }
    ]
  };

  const getData = async () => {
    const startDate = financialYear
      ? `${financialYear}-04-01`
      : dateHelper.getFinancialYearStartDate();
    const endDate = financialYear
      ? `${financialYear + 1}-03-31`
      : dateHelper.getFinancialYearEndDate();

    const salesData = await getAllSalesByDateRangeSorted(startDate, endDate);

    const salesMap = await getDataByMonth(salesData);

    const chartLabel = [];
    const chartData = [];

    salesMap.forEach((item, key) => {
      chartData.push(item);
      chartLabel.push(key);
    });

    setLabels(chartLabel);
    setData(chartData);
  };

  const handleInputChange = (e) => {
    const { value } = e?.target || {};
    setFinancialYear(value);
  };

  const getReport = (index) => {
    const year = index > 2 ? financialYear : financialYear + 1;

    const month = index + 1 > 9 ? index + 1 : `0${index + 1}`;

    const reportStartDate = `${year}-${month}-01`;
    const reportEndDate = `${year}-${month}-30`;

    setSalesReport({ reportStartDate, reportEndDate });
  };

  const cleearReport = () => setSalesReport({});

  const formatCurrency = (value) => {
    let { format } = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    });
    return format(value);
  };

  return (
    <Box
      component={Paper}
      minHeight={'100%'}
      p={2}
      fontFamily={['Nunito Sans, Roboto, sans-serif'].join(',')}
    >
      <Box fontWeight={600} fontSize={'1.5rem'} mb={1} display={'flex'}>
        Yearly Sales
      </Box>
      {!salesReport?.reportStartDate && (
        <>
          <Box py={2}>
            <TextField
              id="outlined-basic"
              InputLabelProps={{
                shrink: true
              }}
              select={true}
              className={classes.select}
              value={financialYear || ''}
              variant="outlined"
              onChange={handleInputChange}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value="">Select Financial Year</MenuItem>
              {[...newYears, ...recentYears]?.map((item) => (
                <MenuItem value={item}>
                  F.Y. {item}-{item + 1}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box maxWidth={'100%'} height={'25rem'} px={2} mb={4}>
            <Bar options={options} data={chartDataSet} />
          </Box>

          <TableContainer
            className={classes.tableContainer}
            component={Paper}
            variant="outlined"
            size="small"
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell className={`${classes.thead}`}>Month</TableCell>
                  <TableCell
                    className={`${classes.thead}  ${classes.rightAlign}`}
                  >
                    Inv Count
                  </TableCell>
                  <TableCell
                    className={`${classes.thead} ${classes.rightAlign}`}
                  >
                    Value
                  </TableCell>
                  <TableCell
                    className={`${classes.thead}  ${classes.rightAlign}`}
                  >
                    Paid
                  </TableCell>
                  <TableCell
                    className={`${classes.thead}  ${classes.rightAlign}`}
                  >
                    UnPaid
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow
                    key={labels[index]}
                    onClick={() => getReport(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>{labels[index]}</TableCell>
                    <TableCell className={classes.cell}>
                      {item?.invoiceCount}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {formatCurrency(item?.invoiceValue)}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {formatCurrency(item?.paid)}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {formatCurrency(item?.unpaid)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      {salesReport?.reportStartDate && (
        <SalesInfoGrid salesReport={salesReport} cleearReport={cleearReport} />
      )}
    </Box>
  );
};

export default YearlySales;
