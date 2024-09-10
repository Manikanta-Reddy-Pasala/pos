import React, { useEffect, useState } from 'react';
import { Paper, Box, Typography, Grid, colors } from '@material-ui/core';
import * as dateHelper from 'src/components/Helpers/DateHelper';
import Controls from 'src/components/controls/index';
import { Add } from '@material-ui/icons';

import { Line } from 'react-chartjs-2';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';

import { options } from './chart.config';
import { useStyles } from './style';
import {
  getCashFlow,
  getOpeningCash
} from 'src/components/Helpers/ChartDataHelper/CashFlowDataHelper';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import AddCash from './modal/AddCash';
import { toJS } from 'mobx';
import CashTransation from './CashTransation';
import BubbleLoader from 'src/components/loader';

const CashInHand = () => {
  const store = useStore();
  const { handleCashModalOpen } = store.CashStore;
  const { cashDialogOpen } = toJS(store.CashStore);

  const classes = useStyles();
  const [totalCashInHand, setTotalCashInHand] = React.useState(0);
  const [totalInflow, setTotalInflow] = React.useState(0);
  const [totalOutflow, setTotalOutflow] = React.useState(0);
  const [totalNetflow, setTotalNetflow] = React.useState(0);
  const [tableData, setTableData] = React.useState([]);
  const [data, setData] = React.useState([]);

  const [reportDate, setReportDate] = useState({});
  const [isLoading, setLoadingShown] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const monthMapper = (year) => ({
    APR: { startDate: `${year}-04-01`, endDate: `${year}-04-30` },
    MAY: { startDate: `${year}-05-01`, endDate: `${year}-05-31` },
    JUN: { startDate: `${year}-06-01`, endDate: `${year}-06-30` },
    JULY: { startDate: `${year}-07-01`, endDate: `${year}-07-31` },
    AUG: { startDate: `${year}-08-01`, endDate: `${year}-08-31` },
    SEP: { startDate: `${year}-09-01`, endDate: `${year}-09-30` },
    OCT: { startDate: `${year}-10-01`, endDate: `${year}-10-31` },
    NOV: { startDate: `${year}-11-01`, endDate: `${year}-11-30` },
    DEC: { startDate: `${year}-12-01`, endDate: `${year}-12-31` },
    JAN: { startDate: `${year + 1}-01-01`, endDate: `${year + 1}-01-31` },
    FEB: {
      startDate: `${year + 1}-02-01`,
      endDate: `${year + 1}-02-${(year + 1) % 4 === 0 ? '29' : '28'}`
    },
    MAR: { startDate: `${year + 1}-03-01`, endDate: `${year + 1}-03-31` }
  });

  const getData = async () => {
    const startDate = dateHelper.getFinancialYearStartDate();
    const endDate = dateHelper.getFinancialYearEndDate();
    setLoadingShown(true);
    const year = new Date(startDate).getFullYear();

    const [cashAsonStartDate, cashFlowData] = await Promise.all([
      getOpeningCash(startDate),
      getCashFlow(startDate, endDate)
    ]);

    const openingCash = parseFloat(
      cashAsonStartDate.cashIn - cashAsonStartDate.cashOut || 0
    );

    let labelsList = [];
    let values = [];
    let tableValues = [];
    let totalInflow = 0;
    let totalOutflow = 0;
    let totalNetflow = 0;

    totalInflow += cashAsonStartDate.cashIn;
    totalOutflow += cashAsonStartDate.cashOut;
    totalNetflow += openingCash;

    tableValues.push({
      month: 'Opening Cash',
      cashIn: cashAsonStartDate.cashIn,
      cashOut: cashAsonStartDate.cashOut,
      netFlow: openingCash,
      cashList: cashAsonStartDate.cashList,
      startDate,
      endDate
    });

    const monthMap = monthMapper(year);

    cashFlowData.cashFlowList.forEach((item, key) => {
      let amount =
        key === 'APR'
          ? parseFloat(parseFloat(item.netFlow) + openingCash).toFixed(2)
          : parseFloat(item.netFlow).toFixed(2);
      values.push(amount);
      tableValues.push({
        month: key,
        cashIn: item.cashIn,
        cashOut: item.cashOut,
        netFlow: item.netFlow,
        cashList: item.cashList,
        ...monthMap[key]
      });
      totalInflow = parseFloat(totalInflow || 0) + parseFloat(item.cashIn || 0);
      totalOutflow =
        parseFloat(totalOutflow || 0) + parseFloat(item.cashOut || 0);
      totalNetflow =
        parseFloat(totalNetflow || 0) + parseFloat(item.netFlow || 0);
      if (labelsList.length <= 8) {
        labelsList.push(key);
      } else {
        labelsList.push(key);
      }
    });
    setLoadingShown(false);

    setTableData(tableValues);
    setTotalInflow(totalInflow);
    setTotalOutflow(totalOutflow);
    setTotalNetflow(totalNetflow);

    setTotalCashInHand(totalNetflow);

    setData({
      datasets: [
        {
          label: 'Cash Flow',
          backgroundColor: colors.blue[300],
          data: values
        }
      ],
      labels: labelsList
    });
  };

  const formatCurrency = (value) => {
    let { format } = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    });
    return format(value);
  };

  const clearReport = () => {
    setReportDate({});
  };

  if (isLoading) {
    return <BubbleLoader />;
  }

  return (
    <div>
      <Box
        component={Paper}
        minHeight={'100%'}
        p={2}
        fontFamily={['Nunito Sans, Roboto, sans-serif'].join(',')}
      >
        {!(reportDate.startDate || reportDate.endDate) && (
          <Grid container>
            <Grid item xs={6}>
              <Box fontWeight={600} fontSize={'1.5rem'} mb={1} display={'flex'}>
                Cash
              </Box>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'end' }}>
              <Controls.Button
                text="Add Adjustment"
                size="medium"
                variant="contained"
                startIcon={<Add />}
                className={classes.newButton}
                style={{ marginRight: '16px' }}
                onClick={() => handleCashModalOpen()}
              />
            </Grid>
          </Grid>
        )}

        {!(reportDate.startDate || reportDate.endDate) && (
          <>
            <Box py={2}>
              <Typography gutterBottom variant="h4" component="h4">
                Cash In Hand:{' '}
                {totalCashInHand >= 0 ? (
                  <span style={{ color: '#339900' }}>
                    {formatCurrency(totalCashInHand)}
                  </span>
                ) : (
                  <span style={{ color: '#EF5350' }}>
                    {formatCurrency(totalCashInHand)}
                  </span>
                )}
              </Typography>
            </Box>

            <Box maxWidth={'100%'} height={'25rem'} px={2} mb={4}>
              <Line data={data} options={options} />
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
                      className={`${classes.thead} ${classes.rightAlign} ${classes.minWidthCell}`}
                    >
                      Inflow
                    </TableCell>
                    <TableCell
                      className={`${classes.thead} ${classes.rightAlign} ${classes.minWidthCell}`}
                    >
                      Outflow
                    </TableCell>
                    <TableCell
                      className={`${classes.thead} ${classes.rightAlign}  ${classes.minWidthCell}`}
                    >
                      Netflow
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((item, index) => (
                    <TableRow
                      key={tableData[index].month}
                      onClick={() => {
                        setReportDate({
                          startDate: item.startDate,
                          endDate: item.endDate,
                          type: item.month,
                          cashInHand: item.netFlow,
                          cashList: item.cashList
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell className={classes.cell}>
                        {item.month}
                      </TableCell>
                      <TableCell
                        className={`${classes.cell} ${classes.rightAlign}`}
                      >
                        {formatCurrency(item.cashIn)}
                      </TableCell>
                      <TableCell
                        className={`${classes.cell} ${classes.rightAlign}`}
                      >
                        {formatCurrency(item.cashOut)}
                      </TableCell>
                      <TableCell
                        className={`${classes.cell} ${classes.rightAlign}`}
                      >
                        {formatCurrency(item.netFlow)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableHead>
                  <TableCell className={`${classes.thead}`}>
                    <b>TOTAL</b>
                  </TableCell>
                  <TableCell
                    className={`${classes.thead} ${classes.rightAlign}`}
                  >
                    {formatCurrency(totalInflow)}
                  </TableCell>
                  <TableCell
                    className={`${classes.thead} ${classes.rightAlign}`}
                  >
                    {formatCurrency(totalOutflow)}
                  </TableCell>
                  <TableCell
                    className={`${classes.thead} ${classes.rightAlign}`}
                  >
                    {formatCurrency(totalNetflow)}
                  </TableCell>
                </TableHead>
              </Table>
            </TableContainer>
          </>
        )}
        {reportDate.startDate && reportDate.endDate && (
          <CashTransation
            key={reportDate.startDate}
            reportDate={reportDate}
            clearReport={clearReport}
            formatCurrency={formatCurrency}
          />
        )}
      </Box>
      <AddCash />
    </div>
  );
};

export default CashInHand;
