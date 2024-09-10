import React, { useEffect, useState } from 'react';
import {
  Dialog,
  Button,
  DialogContent,
  DialogContentText,
  withStyles,
  makeStyles,
  IconButton,
  Grid,
  TextField,
  Checkbox,
  Typography
} from '@material-ui/core';
import injectWithObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import MuiDialogActions from '@material-ui/core/DialogActions';
import styled from 'styled-components';
import axios from 'axios';
import Loader from 'react-js-loader';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { findParty } from 'src/components/Helpers/dbQueries/parties';
import { Cancel } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  batchTable: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: '14px'
  },
  rowstyle: {
    border: '1px solid #ddd',
    padding: '8px'
  },
  rowstyleBold: {
    border: '1px solid #ddd',
    padding: '8px',
    fontWeight: 'bold'
  },
  headstyle: {
    paddingTop: '12px',
    paddingBottom: '12px',
    textAlign: 'left',
    backgroundColor: 'white',
    color: 'black'
  },
  filterBtn: {
    backgroundColor: '#f44336',
    color: 'white',
    height: '30px',
    fontSize: '12px',
    margin: '10px',
    '&:hover': {
      backgroundColor: '#f443369e',
      color: 'white'
    },
    float: 'right'
  }
}));


const PurchasesExpenses2B = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState({});
  const { finalSave3BData, openPurchasesExpenses2B, itcTotal, rcmTotal, setOpenPurchasesExpenses2B } = toJS(stores.GSTR3BStore);

  useEffect(() => {
    if (props.type == 'itc') {
      setData(finalSave3BData?.gstr3bPosData?.editedData?.itcPurchases);
      setTotalData(itcTotal);
    } else if (props.type == 'rcm') {
      setData(finalSave3BData?.gstr3bPosData?.editedData?.rcmPurchases);
      setTotalData(rcmTotal);
    }
  }, []);



  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={openPurchasesExpenses2B}
        PaperProps={{
          style: {
            minWidth: '1200px'
          }
        }}
        onClose={() => setOpenPurchasesExpenses2B(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <Grid item xs="auto" style={{ textAlign: 'end' }}>
            <IconButton onClick={() => setOpenPurchasesExpenses2B(false)}>
              <Cancel fontSize="inherit" />
            </IconButton>
          </Grid>
          <div style={{ margin: '5px' }}>
            <table
              className={`${classes.batchTable}`}
              style={{ fontSize: '12px',marginBottom:'10%' }}
            >
              <thead>
                <tr>
                  <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                    Sl No
                  </th>
                  <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                    Trade/Legal Name
                  </th>
                  <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                    GSTIN
                  </th>
                  <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                    Invoice No
                  </th>
                  <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                    Type
                  </th>
                  <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                    IGST
                  </th>
                  <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                    CGST
                  </th>
                  <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                    SGST
                  </th>
                  <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                    CESS
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? data.map((item, index) => (
                  <>
                    <tr>
                      <td className={`${classes.rowstyle}`}>{index + 1}</td>
                      <td className={`${classes.rowstyle}`}>{item.vendorName}</td>
                      <td className={`${classes.rowstyle}`}>{item.vendorGstNumber}</td>
                      <td className={`${classes.rowstyle}`}>{''}</td>
                      <td className={`${classes.rowstyle}`}>{item.transactionType}</td>
                      <td className={`${classes.rowstyle}`}>{item.igst}</td>
                      <td className={`${classes.rowstyle}`}>{item.cgst}</td>
                      <td className={`${classes.rowstyle}`}>{item.sgst}</td>
                      <td className={`${classes.rowstyle}`}>{item.cess}</td>
                    </tr>
                  </>
                )) : (
                  // <tr>
                  //   <td colSpan={'9'} style={{ textAlign: 'center' }} className={`${classes.rowstyle}`}>No Data Found</td>
                  // </tr>
                  <></>
                )}

                <tr>
                  <td colSpan={'5'} className={`${classes.rowstyleBold}`}>Total</td>
                  <td className={`${classes.rowstyleBold}`}>{totalData.igst}</td>
                  <td className={`${classes.rowstyleBold}`}>{totalData.cgst}</td>
                  <td className={`${classes.rowstyleBold}`}>{totalData.sgst}</td>
                  <td className={`${classes.rowstyleBold}`}>{totalData.cess}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default injectWithObserver(PurchasesExpenses2B);