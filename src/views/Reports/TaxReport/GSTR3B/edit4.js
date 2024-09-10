import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  IconButton,
  Typography
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import { Grid } from '@material-ui/core';
import { useStore } from '../../../../Mobx/Helpers/UseStore';

import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import PurchasesExpenses2B from 'src/views/GSTROnline/PurchasesExpenses2B';
import InfoIcon from '@material-ui/icons/Info';

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
  setPaddingBorder: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #80808070',
    textAlign: 'center',
    fontSize: 'smaller',
    paddingBottom: '8px',
  },
  btn: {
    backgroundColor: '#185291',
    border: '1px solid #14375d',
    color: '#fff'
  },
  w_100: {
    width: '100%'
  },
  matched:{
    background: '#00800038',
    border: '1px solid #00800038'
  },
  unMatched:{
    background: '#f4433663',
    border: '1px solid #f4433663'
  },
  portalValue : {
    textAlign: 'right',
    width: '87%',
    color: 'blue'
  }
}));

const Gstr4EditReport = () => {
  const classes = useStyles();
  const store = useStore();


  const { section4ASummary, section4BSummary, section4CSummary, section4DSummary, section4ASummaryUpdated, section4BSummaryUpdated, section4CSummaryUpdated, section4DSummaryUpdated, section4ADummySummary, section4BDummySummary, section4CDummySummary, section4DDummySummary, openPurchasesExpenses2B,itcTotal, handleCloseEditGSTR3B, saveGSTR3B4, setOpenPurchasesExpenses2B } = toJS(store.GSTR3BStore);

  const [dataA, setDataA] = useState(section4ASummary);
  const [dataB, setDataB] = useState(section4BSummary);
  const [dataC, setDataC] = useState(section4CSummary);
  const [dataD, setDataD] = useState(section4DSummary);

  const [updatedDataA, setUpdatedDataA] = useState(section4ASummaryUpdated);
  const [updatedDataB, setUpdatedDataB] = useState(section4BSummaryUpdated);
  const [updatedDataC, setUpdatedDataC] = useState(section4CSummaryUpdated);
  const [updatedDataD, setUpdatedDataD] = useState(section4DSummaryUpdated);

  const [dummyDataA, setDummyDataA] = useState(section4ADummySummary);
  const [dummyDataB, setDummyDataB] = useState(section4BDummySummary);
  const [dummyDataC, setDummyDataC] = useState(section4CDummySummary);
  const [dummyDataD, setDummyDataD] = useState(section4DDummySummary);

  const preUpdateJSONA = (index, value, name) => {
    const newData = JSON.parse(JSON.stringify(updatedDataA));
    newData[index][name] = value;
    setUpdatedDataA(newData);

    const diff = value - dataA[index][name];
    const dData = JSON.parse(JSON.stringify(dummyDataA));
    dData[index][name] = diff;
    setDummyDataA(dData);
  };
  const preUpdateJSONB = (index, value, name) => {
    const newData = JSON.parse(JSON.stringify(updatedDataB));
    newData[index][name] = value;
    setUpdatedDataB(newData);

    const diff = value - dataB[index][name];
    const dData = JSON.parse(JSON.stringify(dummyDataB));
    dData[index][name] = diff;
    setDummyDataB(dData);
  };
  const preUpdateJSONC = (value, name) => {
    const newData = JSON.parse(JSON.stringify(updatedDataC));
    newData[name] = value;
    setUpdatedDataC(newData);

    const diff = value - dataC[name];
    const dData = JSON.parse(JSON.stringify(dummyDataC));
    dData[name] = diff;
    setDummyDataC(dData);
  };
  const preUpdateJSOND = (index, value, name) => {
    const newData = JSON.parse(JSON.stringify(updatedDataD));
    newData[index][name] = value;
    setUpdatedDataD(newData);

    const diff = value - dataD[index][name];
    const dData = JSON.parse(JSON.stringify(dummyDataD));
    dData[index][name] = diff;
    setDummyDataD(dData);
  };



  return (
    <div className={classes.w_100}>
      <div>
        <div className={classes.contPad}>
          <Grid container className={classes.headTab}>
            <Grid item xs={4}>
              <p className={classes.mrgh}>Details</p>
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
            <Grid
              container
              className={classes.setPadding}
              style={{
                backgroundColor: '#fff'
              }}
            >
              <Grid item xs={4} style={{ textAlign: 'start' }}>
                <p className={classes.marl} style={{ fontWeight: 'bold' }}>A. ITC Available (whether in full or part)</p>
              </Grid>
            </Grid>
            {section4ASummary.map((option, index) => (
              <Grid
                container
                className={classes.setPaddingBorder}
              >
                <Grid item xs={4} style={{ textAlign: 'start', display: 'flex', alignItems: 'center' }}>
                  <p className={classes.marl}> {option.name}</p>
                  {option.name == 'All other ITC' &&
                    <IconButton
                      onClick={() => setOpenPurchasesExpenses2B(true)}
                    >
                      <InfoIcon />
                    </IconButton>}
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.portalValue} variant='h6'>{option.integrated_tax}</Typography>
                  <TextField
                    style={{ width: '85%' }}
                    required
                    variant="outlined"
                    InputProps={{
                      inputProps: {
                        style: { textAlign: 'right' }
                      }
                    }}
                    type="text"
                    className={(index == 4 && itcTotal.igst == updatedDataA[index]?.integrated_tax) ? classes.matched : (index == 4 && itcTotal.igst != updatedDataA[index]?.integrated_tax) ? classes.unMatched :''}
                    value={updatedDataA[index]?.integrated_tax}
                    onChange={(e) => preUpdateJSONA(index, e.target.value, 'integrated_tax')}
                  />
                  {dummyDataA[index]?.integrated_tax != 0 && <Typography
                    style={{ color: dummyDataA[index]?.integrated_tax < 0 ? 'red' : 'green' }}
                    variant='h6'>
                    {dummyDataA[index]?.integrated_tax}
                  </Typography>}
                </Grid>
                <Grid item xs={2} style={{ background: option.central_tax === '' ? '#E9E5E5' : 'none' }}>
                  <Typography className={classes.portalValue} variant='h6'>{option.central_tax}</Typography>
                  <TextField
                    style={{ width: '85%' }}
                    required
                    variant="outlined"
                    InputProps={{
                      inputProps: {
                        style: { textAlign: 'right' }
                      }
                    }}
                    type="text"
                    className={(index == 4 && itcTotal.cgst == updatedDataA[index]?.central_tax) ? classes.matched : (index == 4 && itcTotal.cgst != updatedDataA[index]?.central_tax) ? classes.unMatched :''}
                    value={updatedDataA[index]?.central_tax}
                    onChange={(e) => preUpdateJSONA(index, e.target.value, 'central_tax')}
                  />
                  {dummyDataA[index]?.central_tax != 0 && <Typography
                    style={{ color: dummyDataA[index]?.central_tax < 0 ? 'red' : 'green' }}
                    variant='h6'>
                    {dummyDataA[index]?.central_tax}
                  </Typography>}
                </Grid>
                <Grid item xs={2} style={{ background: option.state_ut_tax === '' ? '#E9E5E5' : 'none' }}>
                  <Typography className={classes.portalValue} variant='h6'>{option.state_ut_tax}</Typography>
                  <TextField
                    style={{ width: '85%' }}
                    required
                    variant="outlined"
                    InputProps={{
                      inputProps: {
                        style: { textAlign: 'right' }
                      }
                    }}
                    type="text"
                    className={(index == 4 && itcTotal.sgst == updatedDataA[index]?.state_ut_tax) ? classes.matched : (index == 4 && itcTotal.sgst != updatedDataA[index]?.state_ut_tax) ? classes.unMatched :''}
                    value={updatedDataA[index]?.state_ut_tax}
                    onChange={(e) => preUpdateJSONA(index, e.target.value, 'state_ut_tax')}
                  />
                  {dummyDataA[index]?.state_ut_tax != 0 && <Typography
                    style={{ color: dummyDataA[index]?.state_ut_tax < 0 ? 'red' : 'green' }}
                    variant='h6'>
                    {dummyDataA[index]?.state_ut_tax}
                  </Typography>}
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.portalValue} variant='h6'>{option.cess}</Typography>
                  <TextField
                    style={{ width: '85%' }}
                    required
                    variant="outlined"
                    InputProps={{
                      inputProps: {
                        style: { textAlign: 'right' }
                      }
                    }}
                    type="text"
                    className={(index == 4 && itcTotal.cess == updatedDataA[index]?.cess) ? classes.matched : (index == 4 && itcTotal.cess != updatedDataA[index]?.cess) ? classes.unMatched :''}
                    value={updatedDataA[index]?.cess}
                    onChange={(e) => preUpdateJSONA(index, e.target.value, 'cess')}
                  />
                  {dummyDataA[index]?.cess != 0 && <Typography
                    style={{ color: dummyDataA[index]?.cess < 0 ? 'red' : 'green' }}
                    variant='h6'>
                    {dummyDataA[index]?.cess}
                  </Typography>}
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
                <p className={classes.marl} style={{ fontWeight: 'bold' }}>B. ITC Reversed</p>
              </Grid>
            </Grid>
            {section4BSummary.map((option, index) => (
              <Grid
                container
                className={classes.setPaddingBorder}
              >
                <Grid item xs={4} style={{ textAlign: 'start' }}>
                  <p className={classes.marl}> {option.name}</p>
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.portalValue} variant='h6'>{option.integrated_tax}</Typography>
                  <TextField
                    style={{ width: '85%' }}
                    required
                    variant="outlined"
                    InputProps={{
                      inputProps: {
                        style: { textAlign: 'right' }
                      }
                    }}
                    type="text"
                    className="customTextField"
                    value={updatedDataB[index]?.integrated_tax}
                    onChange={(e) => preUpdateJSONB(index, e.target.value, 'integrated_tax')}
                  />
                  {dummyDataB[index]?.integrated_tax != 0 && <Typography
                    style={{ color: dummyDataB[index]?.integrated_tax < 0 ? 'red' : 'green' }}
                    variant='h6'>
                    {dummyDataB[index]?.integrated_tax}
                  </Typography>}
                </Grid>
                <Grid item xs={2} style={{ background: option.central_tax === '' ? '#E9E5E5' : 'none' }}>
                  <Typography className={classes.portalValue} variant='h6'>{option.central_tax}</Typography>
                  <TextField
                    style={{ width: '85%' }}
                    required
                    variant="outlined"
                    InputProps={{
                      inputProps: {
                        style: { textAlign: 'right' }
                      }
                    }}
                    type="text"
                    className="customTextField"
                    value={updatedDataB[index]?.central_tax}
                    onChange={(e) => preUpdateJSONB(index, e.target.value, 'central_tax')}
                  />
                  {dummyDataB[index]?.central_tax != 0 && <Typography
                    style={{ color: dummyDataB[index]?.central_tax < 0 ? 'red' : 'green' }}
                    variant='h6'>
                    {dummyDataB[index]?.central_tax}
                  </Typography>}
                </Grid>
                <Grid item xs={2} style={{ background: option.state_ut_tax === '' ? '#E9E5E5' : 'none' }}>
                  <Typography className={classes.portalValue} variant='h6'>{option.state_ut_tax}</Typography>
                  <TextField
                    style={{ width: '85%' }}
                    required
                    variant="outlined"
                    InputProps={{
                      inputProps: {
                        style: { textAlign: 'right' }
                      }
                    }}
                    type="text"
                    className="customTextField"
                    value={updatedDataB[index]?.state_ut_tax}
                    onChange={(e) => preUpdateJSONB(index, e.target.value, 'state_ut_tax')}
                  />
                  {dummyDataB[index]?.state_ut_tax != 0 && <Typography
                    style={{ color: dummyDataB[index]?.state_ut_tax < 0 ? 'red' : 'green' }}
                    variant='h6'>
                    {dummyDataB[index]?.state_ut_tax}
                  </Typography>}
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.portalValue} variant='h6'>{option.cess}</Typography>
                  <TextField
                    style={{ width: '85%' }}
                    required
                    variant="outlined"
                    InputProps={{
                      inputProps: {
                        style: { textAlign: 'right' }
                      }
                    }}
                    type="text"
                    className="customTextField"
                    value={updatedDataB[index]?.cess}
                    onChange={(e) => preUpdateJSONB(index, e.target.value, 'cess')}
                  />
                  {dummyDataB[index]?.cess != 0 && <Typography
                    style={{ color: dummyDataB[index]?.cess < 0 ? 'red' : 'green' }}
                    variant='h6'>
                    {dummyDataB[index]?.cess}
                  </Typography>}
                </Grid>
              </Grid>
            ))}

            <Grid
              container
              className={classes.setPaddingBorder}
            >
              <Grid item xs={4} style={{ textAlign: 'start' }}>
                <p className={classes.marl} style={{ fontWeight: 'bold' }}>C. Net ITC available (A-B)</p>
              </Grid>
              <Grid item xs={2}>
                <Typography className={classes.portalValue} variant='h6'>{dataC.integrated_tax}</Typography>
                <TextField
                  style={{ width: '85%' }}
                  required
                  variant="outlined"
                  InputProps={{
                      inputProps: {
                        style: { textAlign: 'right' }
                      }
                    }}
                  type="text"
                  className="customTextField"
                  value={updatedDataC.integrated_tax}
                  onChange={(e) => preUpdateJSONC(e.target.value, 'integrated_tax')}
                />
                {dummyDataC?.integrated_tax != 0 && <Typography
                  style={{ color: dummyDataC?.integrated_tax < 0 ? 'red' : 'green' }}
                  variant='h6'>
                  {dummyDataC?.integrated_tax}
                </Typography>}
              </Grid>
              <Grid item xs={2} style={{ background: dataC.central_tax === '' ? '#E9E5E5' : 'none' }}>
                <Typography className={classes.portalValue} variant='h6'>{dataC.central_tax}</Typography>
                <TextField
                  style={{ width: '85%' }}
                  required
                  variant="outlined"
                  InputProps={{
                      inputProps: {
                        style: { textAlign: 'right' }
                      }
                    }}
                  type="text"
                  className="customTextField"
                  value={updatedDataC.central_tax}
                  onChange={(e) => preUpdateJSONC(e.target.value, 'central_tax')}
                />
                {dummyDataC?.central_tax != 0 && <Typography
                  style={{ color: dummyDataC?.central_tax < 0 ? 'red' : 'green' }}
                  variant='h6'>
                  {dummyDataC?.central_tax}
                </Typography>}
              </Grid>
              <Grid item xs={2} style={{ background: dataC.state_ut_tax === '' ? '#E9E5E5' : 'none' }}>
                <Typography className={classes.portalValue} variant='h6'>{dataC.state_ut_tax}</Typography>
                <TextField
                  style={{ width: '85%' }}
                  required
                  variant="outlined"
                  InputProps={{
                      inputProps: {
                        style: { textAlign: 'right' }
                      }
                    }}
                  type="text"
                  className="customTextField"
                  value={updatedDataC.state_ut_tax}
                  onChange={(e) => preUpdateJSONC(e.target.value, 'state_ut_tax')}
                />
                {dummyDataC?.state_ut_tax != 0 && <Typography
                  style={{ color: dummyDataC?.state_ut_tax < 0 ? 'red' : 'green' }}
                  variant='h6'>
                  {dummyDataC?.state_ut_tax}
                </Typography>}
              </Grid>
              <Grid item xs={2}>
                <Typography className={classes.portalValue} variant='h6'>{dataC.cess}</Typography>
                <TextField
                  style={{ width: '85%' }}
                  required
                  variant="outlined"
                  InputProps={{
                      inputProps: {
                        style: { textAlign: 'right' }
                      }
                    }}
                  type="text"
                  className="customTextField"
                  value={updatedDataC.cess}
                  onChange={(e) => preUpdateJSONC(e.target.value, 'cess')}
                />
                {dummyDataC?.cess != 0 && <Typography
                  style={{ color: dummyDataC?.cess < 0 ? 'red' : 'green' }}
                  variant='h6'>
                  {dummyDataC?.cess}
                </Typography>}
              </Grid>
            </Grid>



            <Grid
              container
              className={classes.setPadding}
              style={{
                backgroundColor: '#fff'
              }}
            >
              <Grid item xs={4} style={{ textAlign: 'start' }}>
                <p className={classes.marl} style={{ fontWeight: 'bold' }}>(D) Other Details</p>
              </Grid>
            </Grid>
            {dataD.map((option, index) => (
              <Grid
                container
                className={classes.setPaddingBorder}
              >
                <Grid item xs={4} style={{ textAlign: 'start' }}>
                  <p className={classes.marl}> {option.name}</p>
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.portalValue} variant='h6'>{option.integrated_tax}</Typography>
                  <TextField
                    style={{ width: '85%' }}
                    required
                    variant="outlined"
                    InputProps={{
                      inputProps: {
                        style: { textAlign: 'right' }
                      }
                    }}
                    type="text"
                    className="customTextField"
                    value={updatedDataD[index]?.integrated_tax}
                    onChange={(e) => preUpdateJSOND(index, e.target.value, 'integrated_tax')}
                  />
                  {dummyDataD[index]?.integrated_tax != 0 && <Typography
                    style={{ color: dummyDataD[index]?.integrated_tax < 0 ? 'red' : 'green' }}
                    variant='h6'>
                    {dummyDataD[index]?.integrated_tax}
                  </Typography>}
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.portalValue} variant='h6'>{option.central_tax}</Typography>
                  <TextField
                    style={{ width: '85%' }}
                    required
                    variant="outlined"
                    InputProps={{
                      inputProps: {
                        style: { textAlign: 'right' }
                      }
                    }}
                    type="text"
                    className="customTextField"
                    value={updatedDataD[index]?.central_tax}
                    onChange={(e) => preUpdateJSOND(index, e.target.value, 'central_tax')}
                  />
                  {dummyDataD[index]?.central_tax != 0 && <Typography
                    style={{ color: dummyDataD[index]?.central_tax < 0 ? 'red' : 'green' }}
                    variant='h6'>
                    {dummyDataD[index]?.central_tax}
                  </Typography>}
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.portalValue} variant='h6'>{option.state_ut_tax}</Typography>
                  <TextField
                    style={{ width: '85%' }}
                    required
                    variant="outlined"
                    InputProps={{
                      inputProps: {
                        style: { textAlign: 'right' }
                      }
                    }}
                    type="text"
                    className="customTextField"
                    value={updatedDataD[index]?.state_ut_tax}
                    onChange={(e) => preUpdateJSOND(index, e.target.value, 'state_ut_tax')}
                  />
                  {dummyDataD[index]?.state_ut_tax != 0 && <Typography
                    style={{ color: dummyDataD[index]?.state_ut_tax < 0 ? 'red' : 'green' }}
                    variant='h6'>
                    {dummyDataD[index]?.state_ut_tax}
                  </Typography>}
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.portalValue} variant='h6'>{option.cess}</Typography>
                  <TextField
                    style={{ width: '85%' }}
                    required
                    variant="outlined"
                    InputProps={{
                      inputProps: {
                        style: { textAlign: 'right' }
                      }
                    }}
                    type="text"
                    className="customTextField"
                    value={updatedDataD[index]?.cess}
                    onChange={(e) => preUpdateJSOND(index, e.target.value, 'cess')}
                  />
                  {dummyDataD[index]?.cess != 0 && <Typography
                    style={{ color: dummyDataD[index]?.cess < 0 ? 'red' : 'green' }}
                    variant='h6'>
                    {dummyDataD[index]?.cess}
                  </Typography>}
                </Grid>
              </Grid>
            ))}
            <Grid
              container
              style={{ marginTop: '45px' }}
              className={classes.setPadding}
            >
              <Typography variant='h6'>Remarks</Typography>
              <TextField
                style={{ width: '100%' }}
                id="outlined-multiline-static"
                variant="outlined"
                
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
              <Button
                variant="outlined"
                onClick={() => saveGSTR3B4(updatedDataA, updatedDataB, updatedDataC, updatedDataD)}
                className={classes.btn}
                style={{ float: 'right', marginLeft: '10px', marginTop: '25px' }}
              >CONFIRM</Button>
              <Button
                variant="outlined"
                className={classes.btn}
                onClick={handleCloseEditGSTR3B}
                style={{ float: 'right', marginTop: '25px' }}
              >CANCEL</Button>

            </Grid>
            {openPurchasesExpenses2B && <PurchasesExpenses2B type="itc"  />}
          </div>
        </div>
      </div>
    </div>

  );
};

export default InjectObserver(Gstr4EditReport);
