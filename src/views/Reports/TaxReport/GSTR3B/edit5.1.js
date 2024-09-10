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
    width: '100%'
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

const Gstr51EditReport = () => {
  const classes = useStyles();
  const store = useStore();
  

  const { Section51Summary,Section51SummaryUpdated,Section51DummySummary,handleCloseEditGSTR3B,saveGSTR3B51 } = toJS(store.GSTR3BStore);
  const [data, setData] = useState(Section51Summary);
  const [updatedData, setUpdatedData] = useState(Section51SummaryUpdated);
  const [dummyData, setDummyData] = useState(Section51DummySummary);

  const preUpdateJSON = (index, value, name) => {
    const newData = [...data];
    newData[index][name] = value;
    console.log("newData",newData);
    setData(newData);
  };
  
  

  return (
    <div className={classes.w_100}>
      <div>
        <div className={classes.contPad}>
          <Grid container className={classes.headTab}>
            <Grid item xs={4}>
              <p className={classes.marl}>Details</p>
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
          {Section51Summary.map((option, index) => (
              <Grid
                container
                className={classes.setPadding}
                style={{
                  backgroundColor: index % 2 === 0 ? '#fff' : '#ecf0f1'
                }}
              >
                <Grid item xs={4} style={{ textAlign: 'start' }}>
                  <p className={classes.marl}> {option.name}</p>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='h6'>Portal : {option.integrated_tax}</Typography>
                  <TextField
                    style={{width: '85%'}}
                    required
                    variant="outlined"
                    margin="dense"
                    type="text"
                    className="customTextField"
                    value={updatedData[index]?.integrated_tax}
                    onChange={(e)=>preUpdateJSON(index,e.target.value,'integrated_tax')}
                  />
                  {dummyData[index]?.integrated_tax != 0 && <Typography
                    style={{ color: dummyData[index]?.integrated_tax < 0 ? 'red' : 'green' }}
                    variant='h6'>
                    {dummyData[index]?.integrated_tax}
                  </Typography>}
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='h6'>Portal : {option.central_tax}</Typography>
                  <TextField
                    style={{width: '85%'}}
                    required
                    variant="outlined"
                    margin="dense"
                    type="text"
                    className="customTextField"
                    value={updatedData[index]?.central_tax}
                    onChange={(e)=>preUpdateJSON(index,e.target.value,'central_tax')}
                  />
                  {dummyData[index]?.central_tax != 0 && <Typography
                    style={{ color: dummyData[index]?.central_tax < 0 ? 'red' : 'green' }}
                    variant='h6'>
                    {dummyData[index]?.central_tax}
                  </Typography>}
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='h6'>Portal : {option.state_ut_tax}</Typography>
                  <TextField
                    style={{width: '85%'}}
                    required
                    variant="outlined"
                    margin="dense"
                    type="text"
                    className="customTextField"
                    value={updatedData[index]?.state_ut_tax}
                    onChange={(e)=>preUpdateJSON(index,e.target.value,'state_ut_tax')}
                  />
                  {dummyData[index]?.state_ut_tax != 0 && <Typography
                    style={{ color: dummyData[index]?.state_ut_tax < 0 ? 'red' : 'green' }}
                    variant='h6'>
                    {dummyData[index]?.state_ut_tax}
                  </Typography>}
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='h6'>Portal : {option.cess}</Typography>
                  <TextField
                    style={{width: '85%'}}
                    required
                    variant="outlined"
                    margin="dense"
                    type="text"
                    className="customTextField"
                    value={updatedData[index]?.cess}
                    onChange={(e)=>preUpdateJSON(index,e.target.value,'cess')}
                  />
                  {dummyData[index]?.cess != 0 && <Typography
                    style={{ color: dummyData[index]?.cess < 0 ? 'red' : 'green' }}
                    variant='h6'>
                    {dummyData[index]?.cess}
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
                  onClick={() => saveGSTR3B51(updatedData)}
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

export default InjectObserver(Gstr51EditReport);
