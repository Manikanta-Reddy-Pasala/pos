import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { ListItemIcon } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

import { useStore } from '../Mobx/Helpers/UseStore';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 4
  },

  listitem: {
    paddingLeft: theme.spacing(1),
    backgroundColor: 'transparent',
    '&$selected': {
      backgroundColor: 'transparent'
    },
    '&$selected:hover': {
      backgroundColor: 'transparent'
    },
    '&:hover': {
      backgroundColor: 'transparent'
    }
  }
}));

export default function Periodicfilter() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const stores = useStore();

  const { setDateDropValue } = stores.PurchasesAddStore;

  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstYear = new Date(thisYear, 0, 1);
  const lastYear = new Date(thisYear, 11, 31);
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const lastThisMonth = new Date(thisYear, thisMonth + 1, 0);

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

  const options = [
    {
      id: 1,
      fromDate: null,
      toDate: null,
      label: 'All Invoices'
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
      fromDate: null,
      toDate: null,
      label: 'This Quter'
    },
    {
      id: 4,
      fromDate: formatDate(firstThisMonth),
      toDate: formatDate(lastThisMonth),
      label: 'This Year'
    }
  ];

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setDateDropValue(options[selectedIndex]);
  }, [selectedIndex]);

  return (
    <div className={classes.root}>
      <List aria-label="All invoices">
        <ListItem
          className={classes.listitem}
          disableRipple
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="All invoices"
          onClick={handleClickListItem}
        >
          <ListItemText primary={options[selectedIndex].label} />
          <ListItemIcon>
            <ExpandMore fontSize="small" />
          </ListItemIcon>
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            className={classes.listitem}
            key={index}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
