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

const Gstr5Report = () => {
  const classes = useStyles();
  const store = useStore();
 const { Section5Summary } =  toJS(store.GSTR3BStore);

 

  return (
    <div>
      <div>
        <div className={classes.contPad}>
          <Grid container className={classes.headTab}>
            <Grid item xs={6}>
              <p className={classes.marl}>Nature of Supplies</p>
            </Grid>
            <Grid item xs={3} className={classes.textAlign}>
              <p className={classes.marr}>Inter-State supplies</p>
            </Grid>
            <Grid item xs={3} className={classes.textAlign}>
              <p className={classes.marr}>Intra-State supplies</p>
            </Grid>
          </Grid>
          <div>
            {Section5Summary.map((option, index) => (
              <Grid
                container
                className={classes.setPadding}
                style={{
                  backgroundColor: index % 2 === 0 ? '#fff' : '#ecf0f1'
                }}
              >
                <Grid item xs={6} style={{ textAlign: 'start' }}>
                  <p className={classes.marl}> {option.name}</p>
                </Grid>
                <Grid item xs={3}>
                  <p className={classes.marl}> {option.inter_state_supplies}</p>
                </Grid>
                <Grid item xs={3}>
                  <p className={classes.marl}> {option.intra_state_supplies}</p>
                </Grid>
               
              </Grid>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InjectObserver(Gstr5Report);
