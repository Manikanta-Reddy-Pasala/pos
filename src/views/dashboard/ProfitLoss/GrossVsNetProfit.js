import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Select,
  MenuItem
} from '@material-ui/core';
import GrossVsNetProfitChart from './GrossVsNetProfitChart';
import { getMontlyPAndLData } from 'src/components/Helpers/ChartDataHelper/ProfitLossHelper';

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 1,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  }
});

function GrossVsNetProfit(props) {
  const { classes } = props;

  const [plLabelList, setPlLabelList] = React.useState([]);
  const [grossValues, setGrossValues] = React.useState([]);
  const [netValues, setNetValues] = React.useState([]);

  useEffect(() => {
    getMonthlyData();
  }, []);

  const getMonthlyData = async (selectedFilter) => {
    let currentDate = new Date();
    if (selectedFilter === 2) {
      currentDate = new Date(
        currentDate.setFullYear(currentDate.getFullYear() - 1)
      );
    }
    const plMap = await getMontlyPAndLData(currentDate);
    const labelList = [];
    const gValues = [];
    const nValues = [];
    plMap.forEach((item, key) => {
      gValues.push(parseFloat(item.grossProfit).toFixed(2));
      nValues.push(parseFloat(item.netProfit).toFixed(2));
      labelList.push(key);
    });

    setPlLabelList(labelList);
    setGrossValues(gValues);
    setNetValues(nValues);
  };

  const handleChange = (event) => {
    const selectedFilter = event.target.value;
    setPlLabelList([]);
    setGrossValues([]);
    setNetValues([]);
    getMonthlyData(selectedFilter);
  };

  return (
    <Card className={classes.root}>
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
            </Select>
          </Box>
        }
        title={<Box className={classes.headerText}>Gross V/s Net Profit</Box>}
      />
      <CardContent>
          <div>
            <GrossVsNetProfitChart
              plLabelList={plLabelList}
              grossValues={grossValues}
              netValues={netValues}
            />
          </div>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell style={{fontSize:'12px'}}>Particulars</TableCell>
                {plLabelList &&
                  plLabelList.length > 0 &&
                  plLabelList.map((option, index) => (
                    <TableCell align="right" style={{fontSize:'12px'}}>{option}</TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={1}>
                <TableCell component="th" scope="row" style={{fontSize:'12px'}}>
                  Gross Profit
                </TableCell>
                {grossValues &&
                  grossValues.length > 0 &&
                  grossValues.map((option, index) => (
                    <TableCell align="right" style={{fontSize:'12px'}}>{option}</TableCell>
                  ))}
              </TableRow>
              <TableRow key={1}>
                <TableCell component="th" scope="row" style={{fontSize:'12px'}}>
                  Net Profit
                </TableCell>
                {netValues &&
                  netValues.length > 0 &&
                  netValues.map((option, index) => (
                    <TableCell align="right" style={{fontSize:'12px'}}>{option}</TableCell>
                  ))}
              </TableRow>
            </TableBody>
          </Table>
      </CardContent>
    </Card>
  );
}

GrossVsNetProfit.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GrossVsNetProfit);