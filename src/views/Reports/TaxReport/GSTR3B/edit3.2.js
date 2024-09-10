import React, { useState, useEffect } from 'react';
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
import {
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
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
  btn: {
    backgroundColor: '#185291',
    border: '1px solid #14375d',
    color: '#fff'
  },
  w_100: {
    width: '100%'
  }
}));

const Gstr32EditReport = () => {
  const classes = useStyles();
  const store = useStore();
  const [expandedPanel, setExpandedPanel] = useState('panel1');


  const { Section32Summary, Section32DummySummary, handleCloseEditGSTR3B, saveGSTR3B32 } = toJS(store.GSTR3BStore);
  const [data, setData] = useState(Section32Summary);
  const [updatedData, setUpdatedData] = useState(Section32Summary);
  const [dummyData, setDummyData] = useState(Section32DummySummary);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const preUpdateJSON = (index, index1, value, name) => {
    const newData = JSON.parse(JSON.stringify(updatedData));
    newData[index].items[index1][name] = value;
    setUpdatedData(newData);

    // const diff = value - data[index].items[index1][name];
    // const dData = JSON.parse(JSON.stringify(dummyData));
    // dData[index].items[index1][name] = diff;
    // setDummyData(dData);
  };

  const addRow = (index) => {
    const newData = JSON.parse(JSON.stringify(updatedData));
    newData[index].items.push({
      pos: '',
      total_taxable_value: '0',
      integrated_tax: '0',
    });
    setUpdatedData(newData);
  };



  return (
    <div className={classes.w_100}>
      <div>
        <div className={classes.contPad}>
          {updatedData.map((option, index) => (<Accordion
            expanded={expandedPanel === index}
            onChange={handleAccordionChange(index)}
          >
            <AccordionSummary
              style={{ background: '#eee', fontWeight: 'bold' }}
              expandIcon={<ExpandMore />}
            >
              {option.name}
            </AccordionSummary>

            <AccordionDetails>
              <div className={classes.contPad}>
                <Grid container className={classes.headTab}>
                  <Grid item xs={4}>
                    <p className={classes.marl}>Place of Supply (State/UT)</p>
                  </Grid>

                  <Grid item xs={4}>
                    <p className={classes.marr}>Total Taxable Value (₹)</p>
                  </Grid>
                  <Grid item xs={4}>
                    <p className={classes.marr}>Amount of Integrated Tax (₹)</p>
                  </Grid>
                </Grid>
                <div>
                  {option.items.map((itemData, index1) => (<Grid
                    container
                    className={classes.setPadding}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#fff' : '#ecf0f1'
                    }}
                  >
                    <Grid item xs={4}>
                      <TextField
                        style={{ width: '70%', float: 'left' }}
                        required
                        variant="outlined"
                        margin="dense"
                        type="text"
                        className="customTextField"
                        value={itemData.pos}
                        onChange={(e) => preUpdateJSON(index, index1, e.target.value, 'pos')}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        style={{ width: '70%', float: 'left' }}
                        required
                        variant="outlined"
                        margin="dense"
                        type="text"
                        className="customTextField"
                        value={itemData.total_taxable_value}
                        onChange={(e) => preUpdateJSON(index, index1, e.target.value, 'total_taxable_value')}
                      />
                      {/* <Typography variant='h6'>Portal : {option.total_taxable_value}</Typography>
                        <TextField
                          style={{ width: '60%' }}
                          required
                          variant="outlined"
                          margin="dense"
                          type="text"
                          className="customTextField"
                          value={updatedData[index]?.items[index1]?.total_taxable_value}
                          onChange={(e)=>preUpdateJSON(index,index1,e.target.value,'total_taxable_value')}
                        />
                        {dummyData[index]?.items[index1]?.total_taxable_value != 0 && <Typography
                          style={{ color: dummyData[index]?.items[index1]?.total_taxable_value < 0 ? 'red' : 'green' }}
                          variant='h6'>
                          {dummyData[index]?.items[index1]?.total_taxable_value}
                        </Typography>} */}
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        style={{ width: '70%', float: 'left' }}
                        required
                        variant="outlined"
                        margin="dense"
                        type="text"
                        className="customTextField"
                        value={itemData.integrated_tax}
                        onChange={(e) => preUpdateJSON(index, index1, e.target.value, 'integrated_tax')}
                      />
                      {/* <Typography variant='h6'>Portal : {option.integrated_tax}</Typography>
                        <TextField
                          style={{ width: '60%' }}
                          required
                          variant="outlined"
                          margin="dense"
                          type="text"
                          className="customTextField"
                          value={updatedData[index]?.items[index1]?.integrated_tax}
                          onChange={(e)=>preUpdateJSON(index,index1,e.target.value,'integrated_tax')}
                        />
                        {dummyData[index]?.items[index1]?.integrated_tax != 0 && <Typography
                          style={{ color: dummyData[index]?.items[index1]?.integrated_tax < 0 ? 'red' : 'green' }}
                          variant='h6'>
                          {dummyData[index]?.items[index1]?.integrated_tax}
                        </Typography>} */}
                    </Grid>
                  </Grid>))}
                  <Button
                    variant="outlined"
                    onClick={() => addRow(index)}
                    className={classes.btn}
                    style={{ float: 'right', marginLeft: '10px', marginTop: '25px' }}
                  >Add Row</Button>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>))}

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
              onClick={() => saveGSTR3B32(updatedData)}
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
        </div>
      </div>
    </div>
  );
};

export default InjectObserver(Gstr32EditReport);
