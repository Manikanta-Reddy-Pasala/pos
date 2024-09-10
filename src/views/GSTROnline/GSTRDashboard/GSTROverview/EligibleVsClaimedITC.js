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
    minWidth: 700,
  },
});


// let id = 0;
function createData(particulars, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12) {
//   id += 1;
  return { particulars, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12 };
}


const rows = [
  createData('ITC by 3B', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ),
  createData('ITC by 2B',  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
  createData('Excess ITC',  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
];

function EligibleVsClaimedITC(props) {
  const { classes } = props;

  return (
    <Paper className={classes.root} elevation={4}>
        <div style={{marginLeft:"10px", marginTop:"5px"}}>
            <Typography variant="h5">
                Eligible ITC Vs Claimed ITC
            </Typography>
        </div>
        <div>
            <EligibleVsClaimedITCChart />
        </div>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Particulars</TableCell>
            <TableCell align="right">Apr 24</TableCell>
            <TableCell align="right">May 24</TableCell>
            <TableCell align="right">Jun 24</TableCell>
            <TableCell align="right">Jul 24</TableCell>
            <TableCell align="right">Aug 24</TableCell>
            <TableCell align="right">Sep 24</TableCell>
            <TableCell align="right">Oct 24</TableCell>
            <TableCell align="right">Nov 24</TableCell>
            <TableCell align="right">Dec 24</TableCell>
            <TableCell align="right">Jan 24</TableCell>
            <TableCell align="right">Feb 24</TableCell>
            <TableCell align="right">Mar 24</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.particulars}
              </TableCell>
              <TableCell align="right">{row.v1}</TableCell>
              <TableCell align="right">{row.v2}</TableCell>
              <TableCell align="right">{row.v3}</TableCell>
              <TableCell align="right">{row.v4}</TableCell>
              <TableCell align="right">{row.v5}</TableCell>
              <TableCell align="right">{row.v6}</TableCell>
              <TableCell align="right">{row.v7}</TableCell>
              <TableCell align="right">{row.v8}</TableCell>
              <TableCell align="right">{row.v9}</TableCell>
              <TableCell align="right">{row.v10}</TableCell>
              <TableCell align="right">{row.v11}</TableCell>
              <TableCell align="right">{row.v12}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

EligibleVsClaimedITC.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EligibleVsClaimedITC);