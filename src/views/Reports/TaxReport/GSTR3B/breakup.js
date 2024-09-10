import React, { useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import { Grid } from '@material-ui/core';
import { useStore } from '../../../../Mobx/Helpers/UseStore';

import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import useWindowDimensions from '../../../../components/windowDimension';
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

const BreakupReport = () => {
  const classes = useStyles();
  const store = useStore();
 const { sectionBreakupSummary } =  toJS(store.GSTR3BStore);

 

  return (
    <div>
      <div>
        <div className={classes.contPad}>
          <Grid container className={classes.headTab}>
            <Grid item xs={4}>
              <p className={classes.marl}>Period</p>
            </Grid>
            <Grid item xs={2} className={classes.textAlign}>
              <p className={classes.marr}>Integrated tax </p>
            </Grid>
            <Grid item xs={2} className={classes.textAlign}>
              <p className={classes.marr}>Central tax</p>
            </Grid>
            <Grid item xs={2} className={classes.textAlign}>
              <p className={classes.marr}>State/UT tax</p>
            </Grid>
            <Grid item xs={2} className={classes.textAlign}>
              <p className={classes.marr}>Cess</p>
            </Grid>
          </Grid>
          <div>
            
              <Grid
                container
                className={classes.setPadding}
                style={{
                  backgroundColor: '#ecf0f1'
                }}
              >
                <Grid item xs={4} style={{ textAlign: 'start' }}>
                  <p className={classes.marl}> {sectionBreakupSummary.period}</p>
                </Grid>
                <Grid item xs={2}>
                  <p className={classes.marl}> {sectionBreakupSummary.integrated_tax}</p>
                </Grid>
                <Grid item xs={2}>
                  <p className={classes.marl}> {sectionBreakupSummary.central_tax}</p>
                </Grid>
                <Grid item xs={2}>
                  <p className={classes.marl}> {sectionBreakupSummary.state_ut_tax}</p>
                </Grid>
                <Grid item xs={2}>
                  <p className={classes.marl}> {sectionBreakupSummary.cess}</p>
                </Grid>
               
              </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InjectObserver(BreakupReport);
