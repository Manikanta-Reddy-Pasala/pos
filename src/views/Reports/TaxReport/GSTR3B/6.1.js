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
    marginLeft: '5px',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  mrgh:{
    marginLeft: '5px',
  },
  marr: {
    marginRight: '5px'
  },
  setPadding: {
   
    textAlign: 'center',
    fontSize: 'smaller'
  }
}));

const Gstr61Report = () => {
  const classes = useStyles();

  const store = useStore();
 const { section6ASummary,section6BSummary} =  toJS(store.GSTR3BStore);
 

  return (
    <div>
      <div>
        <div className={classes.contPad}>
          <Grid container className={classes.headTab}>
            <Grid item xs={2}>
              <p className={classes.mrgh}>Description</p>
            </Grid>
            <Grid item xs={1}>
              <p className={classes.mrgh}>Total tax payable</p>
            </Grid>
            <Grid item xs={4} className={classes.textAlign}>
              <Grid item xs={12} className={classes.textAlign}>
                <p className={classes.marr}>Tax paid through ITC</p>
              </Grid>
              <Grid container>
                <Grid item xs={3} className={classes.textAlign}>
                  <p className={classes.marr}>Integrated Tax</p>
                </Grid>
                <Grid item xs={3} className={classes.textAlign}>
                  <p className={classes.marr}>Central Tax</p>
                </Grid>
                <Grid item xs={3} className={classes.textAlign}>
                  <p className={classes.marr}>State/UT Tax</p>
                </Grid>
                <Grid item xs={3} className={classes.textAlign}>
                  <p className={classes.marr}>Cess</p>
                </Grid>
              </Grid>
              
            </Grid>
            <Grid item xs={1} className={classes.textAlign}>
              <p className={classes.marr}>Tax paid in cash</p>
            </Grid>
            <Grid item xs={2} className={classes.textAlign}>
              <p className={classes.marr}>Interest paid in cash</p>
            </Grid>
            <Grid item xs={2} className={classes.textAlign}>
              <p className={classes.marr}>Late fee paid in cash</p>
            </Grid>
          </Grid>
          <div>
            <Grid
              container
              className={classes.setPadding}
              style={{
                backgroundColor: '#fff'
              }}
            >
              <Grid item xs={4} style={{ textAlign: 'start' }}>
                <p className={classes.marl} style={{fontWeight:'bold'}}>A. ITC Available (whether in full or part)</p>
              </Grid>
            </Grid>
            {section6ASummary.map((option, index) => (
              <Grid
                container
                className={classes.setPadding}
                style={{
                  backgroundColor: index % 2 === 0 ? '#ecf0f1' : '#fff' 
                }}
              >
                <Grid item xs={2} style={{ textAlign: 'start' }}>
                  <p className={classes.marl}> {option.name}</p>
                </Grid>
                <Grid item xs={1}>
                  <p className={classes.marl}> {option.total_taxable_value}</p>
                </Grid>
                <Grid item xs={1} style={{background : option.integrated_tax === '' ? '#E9E5E5' : 'none'}}>
                  <p className={classes.marl}> {option.integrated_tax}</p>
                </Grid>
                <Grid item xs={1} style={{background : option.central_tax === '' ? '#E9E5E5' : 'none'}}>
                  <p className={classes.marl}> {option.central_tax}</p>
                </Grid>
                <Grid item xs={1} style={{background : option.state_ut_tax === '' ? '#E9E5E5' : 'none'}}>
                  <p className={classes.marl}> {option.state_ut_tax}</p>
                </Grid>
                <Grid item xs={1} style={{background : option.cess === '' ? '#E9E5E5' : 'none'}}>
                  <p className={classes.marl}> {option.cess}</p>
                </Grid>
                <Grid item xs={1}>
                  <p className={classes.marl}> {option.tax_paid_in_cash}</p>
                </Grid>
                <Grid item xs={2}>
                  <p className={classes.marl}> {option.interest_paid_in_cash}</p>
                </Grid>
                <Grid item xs={2} style={{background : option.latefee_paid_in_cash === '' ? '#E9E5E5' : 'none'}}>
                  <p className={classes.marl}> {option.latefee_paid_in_cash}</p>
                </Grid>
              </Grid>
            ))}

            <Grid
              container
              className={classes.setPadding}
              style={{
                backgroundColor: '#fff'
              }}
            >
              <Grid item xs={4} style={{ textAlign: 'start' }}>
                <p className={classes.marl} style={{fontWeight:'bold'}}>(B) Reverse charge</p>
              </Grid>
            </Grid>
            {section6BSummary.map((option, index) => (
              <Grid
                container
                className={classes.setPadding}
                style={{
                  backgroundColor: index % 2 === 0 ? '#ecf0f1' : '#fff' 
                }}
              >
                <Grid item xs={2} style={{ textAlign: 'start' }}>
                  <p className={classes.marl}> {option.name}</p>
                </Grid>
                <Grid item xs={1}>
                  <p className={classes.marl}> {option.total_taxable_value}</p>
                </Grid>
                <Grid item xs={1} style={{background : option.integrated_tax === '' ? '#E9E5E5' : 'none'}}>
                  <p className={classes.marl}> {option.integrated_tax}</p>
                </Grid>
                <Grid item xs={1} style={{background : option.central_tax === '' ? '#E9E5E5' : 'none'}}>
                  <p className={classes.marl}> {option.central_tax}</p>
                </Grid>
                <Grid item xs={1} style={{background : option.state_ut_tax === '' ? '#E9E5E5' : 'none'}}>
                  <p className={classes.marl}> {option.state_ut_tax}</p>
                </Grid>
                <Grid item xs={1} style={{background : option.cess === '' ? '#E9E5E5' : 'none'}}>
                  <p className={classes.marl}> {option.cess}</p>
                </Grid>
                <Grid item xs={1}>
                  <p className={classes.marl}> {option.tax_paid_in_cash}</p>
                </Grid>
                <Grid item xs={2} style={{background : option.interest_paid_in_cash === '' ? '#E9E5E5' : 'none'}}>
                  <p className={classes.marl}> {option.interest_paid_in_cash}</p>
                </Grid>
                <Grid item xs={2} style={{background : option.latefee_paid_in_cash === '' ? '#E9E5E5' : 'none'}}>
                  <p className={classes.marl}> {option.latefee_paid_in_cash}</p>
                </Grid>
              </Grid>
            ))}
          </div>
        </div>  
      </div>
    </div>
  );
};

export default InjectObserver(Gstr61Report);
