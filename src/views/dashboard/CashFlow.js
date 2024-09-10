import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes, { string } from 'prop-types';
import { Line } from 'react-chartjs-2';
import * as dateHelper from 'src/components/Helpers/DateHelper';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  useTheme,
  makeStyles,
  colors,
  Typography,
  Container,
  Grid,
  Divider
} from '@material-ui/core';
import {
  getCashFlow,
  getOpeningCash
} from 'src/components/Helpers/ChartDataHelper/CashFlowDataHelper';

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

const CashFlow = ({ className, labelText, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [data, SetData] = React.useState([]);
  const [getCashIn, SetCashIn] = React.useState(0);
  const [getCashOut, SetCashOut] = React.useState(0);
  const [getStartDate, setStartDate] = React.useState('');
  const [getEndDate, setEndDate] = React.useState('');
  const [getStartDateCashIn, setStartDateCashIn] = React.useState(0);
  const [getStartDateCashOut, setStartDateCashOut] = React.useState(0);
  const [cashInHand, setCashInHand] = React.useState(0);

  useEffect(() => {
    getCashFlowData();
    return () => {
      SetData(null);
    };
  }, []);

  const getCashFlowData = async (selectedFilter) => {
    let startDate = new Date();
    let endDate = new Date();
    const currentDate = new Date();
    let startingMonth = new Date();
    let lastDayOfMonth = new Date();
    let startYear = currentDate.getFullYear();
    let endYear = currentDate.getFullYear() + 1;
    if (selectedFilter === 2) {
      //Previous Fiscal Year
      const previousYear = currentDate.getFullYear() - 1;
      startDate = previousYear + '-04-01';
      endDate = currentDate.getFullYear() + '-03-31';
      startYear = previousYear;
      endYear = currentDate.getFullYear();
    } else if (selectedFilter === 3) {
      //Last 12 Months
      startingMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 10,
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
      startYear = startingMonth.getFullYear();
      endYear = currentDate.getFullYear();
    } else if (selectedFilter === 4) {
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
      startYear = startingMonth.getFullYear();
      endYear = currentDate.getFullYear();
    } else {
      //startDate = dateHelper.getFinancialYearStartDate();
      //endDate = dateHelper.getFinancialYearEndDate();
      //as per the instruction changing the current fiscal year startdate to april 1
      //and endDate as today date
      if (currentDate.getMonth() <= 3)
        startDate = currentDate.getFullYear() - 1 + '-03-31';
      else startDate = currentDate.getFullYear() + '-03-31';
      console.log(currentDate.getMonth());
      endDate =
        currentDate.getFullYear() +
        '-' +
        (currentDate.getMonth() + 1) +
        '-' +
        currentDate.getDate();
    }

    const cashAsonStartDate = await getOpeningCash(startDate);

    setStartDateCashIn(cashAsonStartDate.cashIn);
    setStartDateCashOut(cashAsonStartDate.cashOut);

    const openingCash = parseFloat(
      cashAsonStartDate.cashIn - cashAsonStartDate.cashOut || 0
    );

    const cashFlowData = await getCashFlow(startDate, endDate);

    let labelsList = [];
    let values = [];

    cashFlowData.cashFlowList.forEach((item, key) => {
      let amount =
        key === 'APR'
          ? parseFloat(parseFloat(item.netFlow) + openingCash).toFixed(2)
          : parseFloat(item.netFlow).toFixed(2);
      values.push(amount);
      if (labelsList.length <= 8) {
        labelsList.push(key + " '" + startYear.toString().slice(-2));
      } else {
        labelsList.push(key + " '" + endYear.toString().slice(-2));
      }
    });

    SetData({
      datasets: [
        {
          backgroundColor:
            labelText === 'CashFlow' ? colors.blue[300] : '#ffaf01',
          data: values
        }
      ],
      labels: labelsList
    });

    SetCashIn(cashFlowData.cashIn);
    SetCashOut(cashFlowData.cashOut);
    setStartDate(startDate);
    setEndDate(endDate);
    setCashInHand(
      parseFloat(
        parseFloat(openingCash) +
          parseFloat(cashFlowData.cashIn) -
          parseFloat(cashFlowData.cashOut)
      ).toFixed(2)
    );
  };

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    height: 225,
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
            //min: 0
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
        title={
          <Box className={classes.headerText}>{/* labelText */} Cash Flow</Box>
        }
      />
      <CardContent>
        <Box height={220} position="relative">
          <Container>
            <Grid
              container
              spacing={1}
              direction="row"
              style={{ height: '225px' }}
            >
              <Grid item lg={8} md={8} xl={8} xs={12}>
                {console.log(data)}
                <Line data={data} options={options} />
              </Grid>
              <Grid item lg={1} md={1} xl={1} xs={12}>
                <Divider
                  orientation="vertical"
                  style={{ width: '2px', height: '100%' }}
                />
              </Grid>
              <Grid item lg={3} md={3} xl={3} xs={12}>
                <Container>
                  <Grid container spacing={1} direction="column">
                    <Grid style={{ textAlign: 'end', paddingBottom: '10px' }}>
                      <Typography variant="h6">
                        Cash as on {getStartDate}
                      </Typography>
                      <Typography variant="h4">
                        {parseFloat(parseFloat(getStartDateCashIn || 0) - parseFloat(getStartDateCashOut || 0)).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid style={{ textAlign: 'end', paddingBottom: '10px' }}>
                      <Typography variant="h6" style={{ color: 'blue' }}>
                        Cash as on {getEndDate}
                      </Typography>
                      <Typography variant="h4">{cashInHand} </Typography>
                    </Grid>
                    <Grid style={{ textAlign: 'end', paddingBottom: '10px' }}>
                      <Typography variant="h6" style={{ color: 'green' }}>
                        Incoming
                      </Typography>
                      <Typography variant="h4">{getCashIn} </Typography>
                    </Grid>
                    <Grid style={{ textAlign: 'end', paddingBottom: '10px' }}>
                      <Typography variant="h6" style={{ color: 'red' }}>
                        Outgoing
                      </Typography>
                      <Typography variant="h4">{getCashOut} </Typography>
                    </Grid>
                  </Grid>
                </Container>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </CardContent>
    </Card>
  );
};

CashFlow.propTypes = {
  className: PropTypes.string
};

export default CashFlow;