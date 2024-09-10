import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import { Box, Grid } from '@material-ui/core';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import useWindowDimensions from '../../../../components/windowDimension';
import { ExpandMore } from '@material-ui/icons';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core';
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
    fontWeight: 'bold',
    textAlign: 'center'
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
    fontSize: 'smaller',
    textAlign: 'center'
  },
  outlinedInput: {
    width: '80%',
    marginTop: '8px',
    marginBottom: '4px'
  },
  removeBtn: {
    marginTop: '13px',
    color: '#EF524F',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  addBtn: {
    position: 'relative',
    fontSize: 12,
    background: '#EF5350',
    color: 'white',
    padding: '5px 15px 5px 15px',
    '&:hover': {
      background: 'transparent',
      color: '#EF5350'
    }
  }
}));

const GSTR32Report = () => {
  const classes = useStyles();
  const store = useStore();
  const { height } = useWindowDimensions();
  const [expandedPanel, setExpandedPanel] = useState('panel1');

  const [unregisteredPersonData, SetUnregisteredPersonData] = useState([]);
  const [compData, setCompData] = useState([]);
  const [uinHoldersData ,setuinHoldersData] = useState([]);

  const { getSection3_2Data ,getSection32CompData,Section32Summary} = store.GSTR3BStore;

  useEffect(() => {
    async function fetchData() {
      let result = await getSection3_2Data();
      let compResult = await getSection32CompData();
      console.log(result)
      if (result) {
        if (result) {
          SetUnregisteredPersonData(result);
        }

        if (compResult) {
          setCompData(compResult);
        }
      }
    }

    fetchData();
  }, [getSection32CompData, getSection3_2Data]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    console.log({ event, isExpanded });
    setExpandedPanel(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root} style={{ minHeight: height - 255 }}>
      <div style={{ padding: '15px' }}>
        {/* ----------------------------------------- Supplies Made To Unregistered Person  ---------------------------------------- */}

        
        
        {Section32Summary.map((option, index) => (<Accordion
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
              {option.items.map((itemData, index) => (<Grid
                  container
                  className={classes.setPadding}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#fff' : '#ecf0f1'
                  }}
                >
                  <Grid item xs={4}>
                    <p className={classes.marl}> {itemData.pos}</p>
                  </Grid>
                  <Grid item xs={4}>
                    <p className={classes.marl}> {itemData.total_taxable_value}</p>
                  </Grid>
                  <Grid item xs={4}>
                    <p className={classes.marl}> {itemData.integrated_tax}</p>
                  </Grid>
                </Grid>))}
              </div>
            </div>
          </AccordionDetails>
        </Accordion>))}
      </div>
    </div>
  );
};

export default InjectObserver(GSTR32Report);
