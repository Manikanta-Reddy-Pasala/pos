import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import BlockIcon from '@material-ui/icons/BlockRounded';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { Typography } from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import {
  isGSTRFiled
} from 'src/components/Helpers/GstrOnlineHelper';
import DataLoader from '../DataLoader';

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

let id = 0;
function createData(name, status) {
  id += 1;
  return { name, status };
}


const rows = [
  createData('GSTR 1', <BlockIcon />),
  createData('GSTR 3B', <BlockIcon />),
];

function RetrunFillingTable(props) {
  const { classes } = props;
  const stores = useStore();
  const [loading, setLoading] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const [initialRun, setInitialRun] = useState(true);
  const { setRetPeriod } = stores.GSTRDashboardStore;
  const { retPeriod } = stores.GSTRDashboardStore;
  const { getTaxSettingsDetails } = stores.TaxSettingsStore;

  // useEffect(() => {
  //   const checkAllRetPeriods = async () => {
  //     setLoading(true);
  //     const updatedPeriods = [];
  //     for (const period of retPeriod) { 
  //       if (period.enabled) {
  //         const isFiled = await checkIsFiledasync(period.retPeriod);
  //         updatedPeriods.push({
  //           ...period,
  //           isFiled: isFiled,
  //         });
  //       }else {
  //         updatedPeriods.push({
  //             ...period
  //         });
  //       }
  //       await new Promise(resolve => setTimeout(resolve, 1000));
  //     }
  //     setRetPeriod(updatedPeriods);
  //     setLoading(false);
  //   };
  //   if (initialRun && retPeriod.length > 0) {
  //     checkAllRetPeriods();
  //     setInitialRun(false);
  //   }
  // }, [retPeriod, initialRun]);

  const checkIsFiledasync = async (data) => {
    try {
      const taxData = await getTaxSettingsDetails();
      const apiResponse = await isGSTRFiled(taxData.gstin, data);

      if (apiResponse && apiResponse.status === 1) {
        const respData = apiResponse.message;

        if (respData?.EFiledlist && respData.EFiledlist.length > 0) {
          const gstr1Status = respData.EFiledlist.find(item => item.rtntype === 'GSTR1');

          if (gstr1Status) {
            return gstr1Status.status === 'Filed';
          }
        }
      }
      return false;
    } catch (error) {
      console.error("An error occurred:", error);
      return false;
    }
  };




  return (
    <>
      <Paper className={classes.root} elevation={4}>
        <div style={{ marginLeft: "10px", marginTop: "5px" }}>
          <Typography variant="h5">
            Return Filling Tracker
          </Typography>
        </div>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Return Type</TableCell>
              {retPeriod.map(row => (
                <TableCell align="right">{row.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row" style={{ borderBottom: 'none' }}>
                  {row.name}
                </TableCell>
                {retPeriod.map(rp => (
                  <TableCell align="center" style={{ borderBottom: 'none' }}>
                     {rp.isFiled ? <CheckCircleOutlineIcon style={{color:'green'}}/> : <BlockIcon />}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      {loading && <DataLoader />}
    </>
  );

}

RetrunFillingTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(injectWithObserver(RetrunFillingTable));