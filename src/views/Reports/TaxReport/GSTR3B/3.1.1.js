import React, { useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import { Grid } from '@material-ui/core';
import { useStore } from '../../../../Mobx/Helpers/UseStore';

import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';

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
    marginLeft: '5px',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  marr: {
    marginRight: '5px'
  },
  setPadding: {
    // paddingTop: '10px',
    // paddingBottom: '10px',
    textAlign: 'center',
    fontSize: 'smaller'
  }
}));

const Gstr311Report = () => {
  const classes = useStyles();
  const store = useStore();

  const { Section311Summary } = toJS(store.GSTR3BStore);
  

  return (
    <div>
      <div>
        <div className={classes.contPad}>
          <Grid container className={classes.headTab}>
            <Grid item xs={2}>
              <p className={classes.marl}>Nature of Supplies</p>
            </Grid>
            <Grid item xs={2} className={classes.textAlign}>
              <p className={classes.marr}>Total Taxable Value</p>
            </Grid>
            <Grid item xs={2} className={classes.textAlign}>
              <p className={classes.marr}>Integrated Tax</p>
            </Grid>
            <Grid item xs={2} className={classes.textAlign}>
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
            {Section311Summary.map((option, index) => (
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
                  <p className={classes.marl}> {option.total_taxable_value}</p>
                </Grid>
                <Grid item xs={2} style={{background : option.integrated_tax === '' ? '#E9E5E5' : 'none'}}>
                  <p className={classes.marl}> {option.integrated_tax}</p>
                </Grid>
                <Grid item xs={2} style={{background : option.central_tax === '' ? '#E9E5E5' : 'none'}}>
                  <p className={classes.marl}> {option.central_tax}</p>
                </Grid>
                <Grid item xs={2} style={{background : option.state_ut_tax === '' ? '#E9E5E5' : 'none'}}>
                  <p className={classes.marl}> {option.state_ut_tax}</p>
                </Grid>
                <Grid item xs={2} style={{background : option.cess === '' ? '#E9E5E5' : 'none'}}>
                  <p className={classes.marl}> {option.cess}</p>
                </Grid>
              </Grid>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InjectObserver(Gstr311Report);
