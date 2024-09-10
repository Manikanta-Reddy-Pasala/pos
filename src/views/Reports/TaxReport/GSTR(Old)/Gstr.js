import React, { useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import { Grid } from '@material-ui/core';
import { useStore } from '../../../../Mobx/Helpers/UseStore';

import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import useWindowDimensions from '../../../../components/windowDimension';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .makeStyles-paper-31': {
      borderRadius: '12px'
    }
  },

  label: {
    flexDirection: 'column'
  },
  textAlign: {
    textAlign: 'center'
  },
  contPad: {
    padding: '15px'
  },
  headTab: {
    borderTop: '2px solid #cecdcd',
    paddingTop: '8px',
    paddingBottom: '10px',
    borderBottom: '1px solid #cecdcd',
    background: '#F4F4F4',
    fontSize: 'smaller',
    fontWeight: 'bold'
  },
  marl: {
    marginLeft: '5px'
  },
  marr: {
    marginRight: '5px'
  },
  setPadding: {
    paddingTop: '10px',
    paddingBottom: '10px',
    textAlign: 'center',
    fontSize: 'smaller'
  }
}));

const GstrReport = () => {
  const classes = useStyles();

  const store = useStore();
  const { GSTR1Summary } = store.SalesAddStore;

  return (
    <div>
      <div>
        <div className={classes.contPad}>
          <Grid container className={classes.headTab}>
            <Grid item xs={2}>
              <p className={classes.marl}>Section Name</p>
            </Grid>
            <Grid item xs={2} className={classes.textAlign}>
              <p className={classes.marr}>No of Records</p>
            </Grid>
            <Grid item xs={2} className={classes.textAlign}>
              <p className={classes.marr}>Integrated Tax</p>
            </Grid>
            <Grid item xs={1} className={classes.textAlign}>
              <p className={classes.marr}>Central Tax</p>
            </Grid>
            <Grid item xs={2} className={classes.textAlign}>
              <p className={classes.marr}>State/UT Tax</p>
            </Grid>
            <Grid item xs={2} className={classes.textAlign}>
              <p className={classes.marr}>Cess Amount</p>
            </Grid>
          </Grid>
          <div>
            {GSTR1Summary.map((option, index) => (
              <Grid
                container
                className={classes.setPadding}
                style={{
                  backgroundColor: index % 2 === 0 ? '#fff' : '#ecf0f1'
                }}
              >
                <Grid item xs={2} style={{ textAlign: 'start' }}>
                  <p className={classes.marl}> {option.name}</p>
                </Grid>
                <Grid item xs={2}>
                  <p className={classes.marl}> {option.no_records}</p>
                </Grid>
                <Grid item xs={2}>
                  <p className={classes.marl}> {option.integrated_tax}</p>
                </Grid>
                <Grid item xs={1}>
                  <p className={classes.marl}> {option.central_tax}</p>
                </Grid>
                <Grid item xs={2}>
                  <p className={classes.marl}> {option.state_ui_tax}</p>
                </Grid>
                <Grid item xs={2}>
                  <p className={classes.marl}> {option.cess_amount}</p>
                </Grid>
              </Grid>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InjectObserver(GstrReport);
