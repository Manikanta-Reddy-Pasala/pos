import React, { useState } from 'react';
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  InputAdornment,
  IconButton,
  Grid,
  Typography
} from '@material-ui/core';
import { Search, Print } from '@material-ui/icons';
import AddnewPayment from '../../reportView/ReportComponents/addPayment/AddnewPayment';
import Forward from '../../../icons/Forward';
import useTable from '../../../components/CustomTable';
import Moreoptions from '../../../components/Moreoptions';
import Controls from '../../../components/controls/index';

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(1)
    // padding: theme.spacing(1)
  },
  searchInput: {
    width: '100%',
    [`& fieldset`]: {
      borderRadius: '30px'
    }
  },
  newButton: {
    position: 'relative',
    borderRadius: 25
  },
  bg: {
    backgroundColor: '#ccc'
  },
  grid: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  tableRightBorder: {}
}));

const headCells = [
  {
    id: 'date',
    label: 'DATE',
    filter: true,
    type: 'date',
    disableSorting: true
  },
  {
    id: 'invoicenum',
    label: 'INVOICE NO',
    filter: true,
    type: 'number',
    disableSorting: true
  },
  {
    id: 'partyname',
    label: 'PARTY NAME ',
    filter: true,
    type: 'string',
    disableSorting: true
  },
  {
    id: 'paymenttype',
    label: 'PAYMENT TYPE',
    filter: true,
    type: 'string',
    disableSorting: true
  },
  {
    id: 'amount',
    label: 'AMOUNT',
    filter: true,
    type: 'number',
    disableSorting: true
  },
  {
    id: 'balancedue',
    label: 'BALANCE DUE',
    filter: true,
    type: 'number',
    disableSorting: true
  },
  { id: 'actions', label: '', disableSorting: true },
  { id: 'more', label: '', disableSorting: true }
];

export default function DashBoardList() {
  const classes = useStyles();
  const [records] = useState([
    {
      id: '1',
      date: '08/12/2020',
      invoicenum: '794651',
      partyname: 'Anu',
      paymenttype: 'online',
      amount: '5452',
      balancedue: '7845'
    },
    {
      id: '2',
      date: '18/12/2020',
      invoicenum: '794651',
      partyname: 'Anu',
      paymenttype: 'online',
      amount: '5452',
      balancedue: '7845'
    },
    {
      id: '3',
      date: '20/12/2020',
      invoicenum: '794652',
      partyname: 'Banu',
      paymenttype: 'online',
      amount: '5452',
      balancedue: '7845'
    },
    {
      id: '4',
      date: '21/12/2020',
      invoicenum: '794653',
      partyname: 'Anu',
      paymenttype: 'online',
      amount: '5452',
      balancedue: '1135'
    }
  ]);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    }
  });
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        // console.log('itemsqwertyu', items);

        if (target.value === '') return items;
        else {
          return items.filter((x) =>
            x.customer_name.toLowerCase().includes(target.value)
          );
        }
      }
    });
  };

  return (
    <>
      {/* <PageHeader title='Recent Sale Transactions' /> */}
      <Paper className={classes.pageContent}>
        <Grid container spacing={3} className={classes.grid}>
          <Grid item xs={6}>
            <Typography variant="h4" component="h4">
              Recent Sale Transactions
            </Typography>
          </Grid>
          <Grid item xs={4}>
            {' '}
            <Controls.Input
              className={classes.searchInput}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
              onChange={handleSearch}
            />
          </Grid>
          <Grid item xs={2}>
            <AddnewPayment />
          </Grid>
        </Grid>

        <TblContainer>
          <TblHead className={classes.bg} disableSorting />
          <TableBody>
            {recordsAfterPagingAndSorting().map((item) => (
              <TableRow key={item.id}>
                <TableCell className={classes.tableRightBorder}>
                  {item.date}
                </TableCell>
                <TableCell className={classes.tableRightBorder}>
                  {item.invoicenum}
                </TableCell>
                <TableCell className={classes.tableRightBorder}>
                  {item.partyname}
                </TableCell>
                <TableCell className={classes.tableRightBorder}>
                  {item.paymenttype}
                </TableCell>
                <TableCell className={classes.tableRightBorder}>
                  {item.amount}
                </TableCell>
                <TableCell className={classes.tableRightBorder}>
                  {item.balancedue}
                </TableCell>
                <TableCell className={classes.tableRightBorder}>
                  <IconButton>
                    <Print fontSize="inherit" />{' '}
                  </IconButton>
                  <IconButton>
                    <Forward />
                  </IconButton>
                </TableCell>
                <TableCell className={classes.tableRightBorder}>
                  <Moreoptions
                    menu={[
                      'View/Edit',
                      'Payment In',
                      'Convert To Return ',
                      'Payment History',
                      // 'Open PDF',
                      'Preview',
                      'Print'
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
    </>
  );
}
