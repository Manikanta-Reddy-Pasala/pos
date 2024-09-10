import React from "react";
import { Grid } from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from "src/theme/typography";

const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 1,
      overflowX: 'auto',
    },
  });
  
  let id = 0;
  function createData(month) {
    id += 1;
    return { month };
  }

const rows = [
    createData('Jul 2024'),
    createData('Jun 2024'),
    createData('May 2024'),
    createData('Apr 2024'),
  ];

const DboardITC = (props) => {
    const { classes } = props;
    return (
        <div>
            <Grid
                container
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
            >
                <Grid item xs={12} sm={12}>
                    <Paper className={classes.root} elevation={4}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow style={{backgroundColor:'lightgrey'}}>
                                    <TableCell
                                        variant="head"
                                        rowSpan="2"
                                        align="center"
                                        style={{borderRight:'2px solid'}}
                                    >
                                        Month
                                    </TableCell>
                                    <TableCell
                                        variant="head"
                                        colSpan="2"
                                        align="center"
                                        style={{borderRight:'2px solid'}}
                                    >
                                        GSTR 2B
                                    </TableCell>
                                    <TableCell
                                        variant="head"
                                        colSpan="2"
                                        align="center"
                                        style={{borderRight:'2px solid'}}
                                    >
                                        Purchase Register
                                    </TableCell>
                                    <TableCell
                                        variant="head"
                                        colSpan="2"
                                        align="center"
                                    >
                                        As per Book
                                    </TableCell>
                                </TableRow>
                                <TableRow style={{backgroundColor:'lightgrey'}}>
                                    <TableCell variant="head"
                                        style={{borderRight:'1px outset'}}
                                    >
                                        <h5>Total Invoice</h5>
                                    </TableCell>
                                    <TableCell variant="head"
                                    style={{borderRight:'2px solid'}}>
                                        <h5>ITC Amount</h5>
                                    </TableCell>
                                    <TableCell variant="head"
                                        style={{borderRight:'1px outset'}}
                                    >
                                        <h5>Total Invoice</h5>
                                    </TableCell>
                                    <TableCell variant="head"
                                    style={{borderRight:'2px solid'}}>
                                        <h5>ITC Amount</h5>
                                    </TableCell>
                                    <TableCell variant="head"
                                        style={{borderRight:'1px outset'}}
                                    >
                                        <h5>Total Invoice</h5>
                                    </TableCell>
                                    <TableCell variant="head"
                                    style={{borderRight:'1px outset'}}>
                                        <h5>ITC Amount</h5>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {rows.map(row => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row" style={{borderRight:'2px solid'}}>
                                        {row.month}
                                    </TableCell>
                                    <TableCell component="th" scope="row"
                                        style={{borderRight:'1px outset'}}
                                    >
                                        25
                                    </TableCell>
                                    <TableCell component="th" scope="row"
                                        style={{borderRight:'2px solid'}}
                                    >
                                        35
                                    </TableCell>
                                    <TableCell component="th" scope="row"
                                        style={{borderRight:'1px outset'}}
                                    >
                                        5
                                    </TableCell>
                                    <TableCell component="th" scope="row"
                                        style={{borderRight:'2px solid'}}
                                    >
                                        5500
                                    </TableCell>

                                    <TableCell component="th" scope="row"
                                        style={{borderRight:'1px outset'}}
                                    >
                                        -5
                                    </TableCell>
                                    <TableCell component="th" scope="row"
                                        style={{borderRight:'1px outset'}}
                                    >
                                        -4500
                                    </TableCell>

                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </Paper>    
                </Grid>
            </Grid>
        </div>
)
};

DboardITC.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles) (DboardITC);