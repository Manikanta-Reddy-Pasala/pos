import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import EligibleVsClaimedITCChart from './EligibleVsClaimedITCChart';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 1,
    overflowX: 'auto',
  },
  table: {
    minWidth: 350,
  },
});


// let id = 0;
function createData(ledgers, v1, v2, tot) {
//   id += 1;
  return { ledgers, v1, v2, tot };
}


const rows = [
  createData('CGST', 0, 0, 0 ),
  createData('IGST',  0, 0, 0),
  createData('SGST',  0, 0, 0),
  createData('Total', 0, 0, 0)
];

function GSTRTaxLedger(props) {
  const { classes } = props;

  return (
    <Paper className={classes.root} elevation={4}>
        <div style={{marginLeft:"10px", marginTop:"5px"}}>
            <Typography variant="h5">
                Tax Ledger
            </Typography>
        </div>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Tax Ledger</TableCell>
            <TableCell align="right">Cash Ledger</TableCell>
            <TableCell align="right">Credit Ledger</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell >
                {row.ledgers}
              </TableCell>
              <TableCell align="right">{row.v1}</TableCell>
              <TableCell align="right">{row.v2}</TableCell>
              <TableCell align="right">{row.tot}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

GSTRTaxLedger.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GSTRTaxLedger);