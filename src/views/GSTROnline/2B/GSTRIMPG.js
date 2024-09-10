import React, { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  Grid,
} from '@material-ui/core';
import injectWithObserver from '../../../Mobx/Helpers/injectWithObserver';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  productModalContent: {
    padding: 'inherit',
    '& .grid-padding': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      '& .secondary-images': {
        '& button': {
          marginRight: theme.spacing(2)
        }
      }
    }
  },
  '& .grid-select': {
    selectedOption: {
      color: 'red'
    },
    marginLeft: '15px',
    '& .MuiFormControl-root': {
      width: '100%'
    },
    fullWidth: {
      width: '100%'
    }
  },

  itemTable: {
    width: '100%'
  },
  agGridclass: {
    '& .ag-paging-panel': {
      fontSize: '10px',
      '& .ag-paging-row-summary-panel': {
        width: '52px'
      }
    }
  },
  listli: {
    borderBottom: '1px solid #c5c4c4',
    paddingBottom: 10,
    marginBottom: 12,
    background: 'none'
  },
  listHeaderBox: {
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    padding: '10px 30px 0px 30px'
  },
  listbox: {
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    padding: '10px 30px 30px 30px',

    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    }
  },
  activeClass: {
    backgroundColor: '#2977f5',
    color: 'white'
  },
  content: {
    cursor: 'pointer'
  },
  w_30: {
    width: '30%',
    display: 'inline-flex'
  },
  step1: {
    width: '65%',
    margin: 'auto',
    backgroundColor: '#d8cac01f',
    marginBottom: '2%'
  },
  step2: {
    width: '99%',
    margin: 'auto',
    backgroundColor: '#d8cac01f'
  },
  fGroup: {
    width: '50%',
    margin: 'auto'
  },
  CenterStartEnd: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'grey'
  },
  CenterStartEndWc: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  batchTable: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: '14px'
  },
  rowstyle: {
    border: '1px solid #ddd',
    padding: '8px'
  },
  headstyle: {
    paddingTop: '12px',
    paddingBottom: '12px',
    textAlign: 'left',
    backgroundColor: 'white',
    color: 'black'
  },
  mb_20: {
    marginBottom: '20px'
  },
  pointer: {
    cursor: 'pointer'
  },
  mb_10: {
    marginBottom: '10px'
  },
  wAuto: {
    width: '80%',
    margin: 'auto',
    textAlign: 'center'
  },
  dHead: {
    height: '100px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgb(239, 83, 80)',
    color: '#fff'
  },
  cardList: {
    display: 'block',
    textAlign: 'center',
    color: 'grey'
  },
  card: {
    display: 'block',
    transitionDuration: '0.3s',
    height: '100%',
    borderRadius: 1,
    paddingTop: 10,
    overflowY: 'auto',
    overflowX: 'hidden',
    background: 'white'
  },
  invGrid: {
    backgroundColor: '#3a3a811f',
    margin: '20px 0px 20px 0px'
  },
  itemGrid: {
    backgroundColor: '#3a3a811f',
    margin: '20px 0px 20px 0px'
  }
}));

const GSTRIMPG = (props) => {
  const classes = useStyles();

  const theme = useTheme();

  const [b2b, setB2B] = useState([]);

  useEffect(() => {
    setB2B(props.data);
  }, []);

  const [openIndex, setOpenIndex] = useState(null);

  const handleViewClick = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <>
      <table className={`${classes.batchTable}`} style={{ fontSize: '12px' }}>
        <thead>
          <tr>

            <th rowspan="2" className={`${classes.headstyle} ${classes.rowstyle}`}>
              Icegate Reference Date
            </th>
            <th rowspan="2" className={`${classes.headstyle} ${classes.rowstyle}`}>
              Port Code
            </th>

            <th colspan="3" className={`${classes.headstyle} ${classes.rowstyle}`}>
              Bill of Entry Details
            </th>
            <th colspan="2" className={`${classes.headstyle} ${classes.rowstyle}`}>
              Amount of tax (₹)
            </th>
            <th rowspan="2" className={`${classes.headstyle} ${classes.rowstyle}`}>
              Amended (Yes)
            </th>

          </tr>
          <tr>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              Number
            </th>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              Date
            </th>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              Taxable Value
            </th>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              Integrated Tax(₹)
            </th>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              Cess(₹)
            </th>


          </tr>
        </thead>
        <tbody>
          {b2b.map((item, index) => (
            <tr>
              <td className={`${classes.rowstyle}`}>
                {item.refdt}
              </td>
              <td className={`${classes.rowstyle}`}>
                {item.portcode}
              </td>
              <td className={`${classes.rowstyle}`}>
                {item.boenum}
              </td>
              <td className={`${classes.rowstyle}`}>
                {item.boedt}
              </td>
              <td className={`${classes.rowstyle}`}>
                {item.txval}
              </td>
              <td className={`${classes.rowstyle}`}>
                {item.igst}
              </td>
              <td className={`${classes.rowstyle}`}>
                {item.cess}
              </td>
              <td className={`${classes.rowstyle}`}>
                {item.isamd}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default injectWithObserver(GSTRIMPG);