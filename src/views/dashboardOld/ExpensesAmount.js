import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

import { FormControl, MenuItem, Select } from '@material-ui/core';
import {
  Avatar,
  Card,
  Typography,
  colors,
  makeStyles,
  Box
} from '@material-ui/core';
import Svg from '../../components/svg';

const useStyles = makeStyles((theme) => ({
  root: {
    // height: '100%',
    boxShadow: '0px 0px 12px -3px #0000004a',
    borderRadius: '10px',
    display: 'flex'
  },
  avatar: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ffaf01',
    height: '100px',
    width: '95px',
    borderRadius: '25px 0px 0px 25px',
    position: 'relative',
    right: '-20px'
  },
  differenceIcon: {
    color: colors.red[900]
  },
  differenceValue: {
    color: colors.red[900],
    marginRight: theme.spacing(1)
  },
  formControl: {
    position: 'relative',
    minWidth: '80%'
  },
  dFlex: {
    display: 'flex'
  },
  justifyContentBetween: {
    justifyContent: 'space-between'
  },
  cardContent: {
    padding: '20px',
    minHeight: '140px'
  },
  select: {
    fontSize: '18px',
    color: '#888'
  },
  icon: {
    width: '50px',
    height: '50px',
    margin: '0 !important',
    objectFit: 'contain'
  }
}));

const today = new Date().getDate();
const thisYear = new Date().getFullYear();
const thisMonth = new Date().getMonth();
const firstThisMonth = new Date(thisYear, thisMonth, 1);
const lastThisMonth = new Date(thisYear, thisMonth + 1, 0);

const firstThisYear = new Date(thisYear, 0, 1);

const todayDate = new Date(thisYear, thisMonth, today);

let pastMonthDate = new Date();
pastMonthDate.setDate(1);
pastMonthDate.setMonth(pastMonthDate.getMonth() - 1);
const pastMonthYear = pastMonthDate.getFullYear();
const pastMonth = pastMonthDate.getMonth();
const firstPastMonth = new Date(pastMonthYear, pastMonth, 1);
const lastPastMonth = new Date(pastMonthYear, pastMonth + 1, 0);

const formatDate = (date) => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

function getThisQuaterStartingDate() {
  const today = new Date();
  const quarter = Math.floor((today.getMonth() + 3) / 3);

  const quaterStartingMonth = parseFloat((quarter - 1) * 3);

  const lastThisMonth = new Date(thisYear, quaterStartingMonth, 1);

  console.log(lastThisMonth, 'lastThisMonth');

  return lastThisMonth;
}

const options = [
  {
    id: 1,
    fromDate: formatDate(todayDate),
    toDate: formatDate(todayDate),
    label: 'Today'
  },
  {
    id: 2,
    fromDate: formatDate(firstThisMonth),
    toDate: formatDate(lastThisMonth),
    label: 'This month'
  },
  {
    id: 3,
    fromDate: formatDate(firstPastMonth),
    toDate: formatDate(lastPastMonth),
    label: 'Last month'
  },
  {
    id: 4,
    fromDate: formatDate(getThisQuaterStartingDate()),
    toDate: formatDate(todayDate),
    label: 'This Quter'
  },
  {
    id: 5,
    fromDate: formatDate(firstThisYear),
    toDate: formatDate(todayDate),
    label: 'This Year'
  }
];

const ExpensesAmount = ({ className, ...rest }) => {
  const classes = useStyles();
  const [amount, setAmount] = useState();

  let dateDropValue = {};

  const getAmount = async () => {
    const db = await Db.get();

    var query;

    if (
      !dateDropValue ||
      !dateDropValue ||
      !dateDropValue.fromDate ||
      !dateDropValue.toDate
    ) {
      dateDropValue = options[0];
    }

    const businessData = await Bd.getBusinessData();

    query = db.expenses.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            date: {
              $gte: dateDropValue.fromDate
            }
          },
          {
            date: {
              $lte: dateDropValue.toDate
            }
          }
        ]
      }
    });
    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          return;
        }
        if (!data) {
          console.log('Internal Server Error');
          return;
        }
        let response = data.map((item) => {
          let output = {};
          output.total = item.total;
          return output;
        });

        let amount = 0;
        response.forEach((element) => {
          amount = parseFloat(amount) + parseFloat(element.total);
        });
        setAmount(parseFloat(amount).toFixed(2));
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  useEffect(() => {
    const initDB = async () => {
      getAmount();
    };
    initDB();
  }, []);

  const handleChange = (event) => {
    dateDropValue = options[event.target.value - 1];
    console.log(dateDropValue);
    getAmount();
  };
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Box className={classes.cardContent} display="flex" flexGrow={1}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          flexGrow={1}
        >
          <Box>
            <FormControl className={classes.formControl}>
              <Select
                disableUnderline={true}
                onChange={handleChange}
                defaultValue={1}
                className={classes.select}
              >
                <MenuItem value={1}>Today</MenuItem>
                <MenuItem value={2}>This Month</MenuItem>
                <MenuItem value={3}>Last Month</MenuItem>
                <MenuItem value={4}>This Quarter</MenuItem>
                <MenuItem value={5}>This Year</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Typography
              variant="h3"
              style={{ color: '#ffaf01', fontWeight: 'bold', fontSize: '18px' }}
            >
              {amount}
            </Typography>
          </Box>
          <Box>
            <Typography
              color="textPrimary"
              variant="h6"
              style={{ fontWeight: 'bold', fontSize: '16px' }}
            >
              Expenses
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Avatar className={classes.avatar}>
            <Svg icon="exp_white" className={classes.icon} />
          </Avatar>
        </Box>
      </Box>
    </Card>
  );
};

ExpensesAmount.propTypes = {
  className: PropTypes.string
};

export default ExpensesAmount;
