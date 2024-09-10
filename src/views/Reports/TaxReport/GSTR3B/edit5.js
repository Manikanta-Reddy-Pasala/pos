import React, { useState,useEffect } from 'react';
import {
  TextField,
  Button,
  Typography
} from '@material-ui/core';
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
    padding: '15px',
    width:'100%'
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
  },
  btn:{
    backgroundColor: '#185291',
    border: '1px solid #14375d',
    color: '#fff'
  },
  w_100: {
    width: '100%'
  }
}));

const Gstr5EditReport = () => {
  const classes = useStyles();
  const store = useStore();
  

  const { Section5Summary,Section5SummaryUpdated,Section5DummySummary,handleCloseEditGSTR3B,saveGSTR3B5 } = toJS(store.GSTR3BStore);
  const [data, setData] = useState(Section5Summary);
  const [updatedData, setUpdatedData] = useState(Section5SummaryUpdated);
  const [dummyData, setDummyData] = useState(Section5DummySummary);

  const preUpdateJSON = (index, value, name) => {
    const newData = JSON.parse(JSON.stringify(updatedData));
    newData[index][name] = value;
    setUpdatedData(newData);

    const diff = value - data[index][name];
    const dData = JSON.parse(JSON.stringify(dummyData));
    dData[index][name] = diff;
    setDummyData(dData);
  };
  
  

  return (
    <div className={classes.w_100}>
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
                  <Typography variant='h6'>Portal : {option.inter_state_supplies}</Typography>
                  <TextField
                    style={{width: '85%'}}
                    required
                    variant="outlined"
                    margin="dense"
                    type="text"
                    className="customTextField"
                    value={updatedData[index]?.inter_state_supplies}
                    onChange={(e)=>preUpdateJSON(index,e.target.value,'inter_state_supplies')}
                  />
                  {dummyData[index]?.inter_state_supplies != 0 && <Typography
                    style={{ color: dummyData[index]?.inter_state_supplies < 0 ? 'red' : 'green' }}
                    variant='h6'>
                    {dummyData[index]?.inter_state_supplies}
                  </Typography>}
                </Grid>
                <Grid item xs={3}>
                  <Typography variant='h6'>Portal : {option.intra_state_supplies}</Typography>
                  <TextField
                    style={{width: '85%'}}
                    required
                    variant="outlined"
                    margin="dense"
                    type="text"
                    className="customTextField"
                    value={updatedData[index]?.intra_state_supplies}
                    onChange={(e)=>preUpdateJSON(index,e.target.value,'intra_state_supplies')}
                  />
                  {dummyData[index]?.intra_state_supplies != 0 && <Typography
                    style={{ color: dummyData[index]?.intra_state_supplies < 0 ? 'red' : 'green' }}
                    variant='h6'>
                    {dummyData[index]?.intra_state_supplies}
                  </Typography>}
                </Grid>
               
              </Grid>
            ))}
            <Grid
              container
              style={{marginTop:'45px'}}
              className={classes.setPadding}
            >
              <Typography variant='h6'>Remarks</Typography>
              <TextField
                style={{ width: '100%' }}
                id="outlined-multiline-static"
                variant="outlined"
                margin="dense"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
              <Button
                  variant="outlined"
                  onClick={() => saveGSTR3B5(updatedData)}
                  className={classes.btn}
                  style={{float:'right',marginLeft: '10px',marginTop:'25px'}}
                >CONFIRM</Button> 
              <Button
                  variant="outlined"
                  className={classes.btn}
                  onClick={handleCloseEditGSTR3B}
                  style={{float:'right',marginTop:'25px'}}
                >CANCEL</Button> 
              
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InjectObserver(Gstr5EditReport);
