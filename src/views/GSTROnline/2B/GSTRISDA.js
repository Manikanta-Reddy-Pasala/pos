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

const GSTRISDA = (props) => {
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
              ISD Document type
            </th>
            <th rowspan="2" className={`${classes.headstyle} ${classes.rowstyle}`}>
              Document Number
            </th>
            <th rowspan="2" className={`${classes.headstyle} ${classes.rowstyle}`}>
              Document date
            </th>
            <th rowspan="2" className={`${classes.headstyle} ${classes.rowstyle}`}>
              GSTIN of ISD
            </th>
            <th rowspan="2" className={`${classes.headstyle} ${classes.rowstyle}`}>
              Trade/Legal name
            </th>
            <th rowspan="2" className={`${classes.headstyle} ${classes.rowstyle}`}>
              ISD Document type
            </th>
            <th rowspan="2" className={`${classes.headstyle} ${classes.rowstyle}`}>
              ISD Document number
            </th>
            <th rowspan="2" className={`${classes.headstyle} ${classes.rowstyle}`}>
              ISD Document date
            </th>
            <th rowspan="2" className={`${classes.headstyle} ${classes.rowstyle}`}>
              Original Invoice Number
            </th>
            <th rowspan="2" className={`${classes.headstyle} ${classes.rowstyle}`}>
              Original invoice date
            </th>
            <th colspan="4" className={`${classes.headstyle} ${classes.rowstyle}`}>
              Input tax distribution by ISD
            </th>
            <th rowspan="2" className={`${classes.headstyle} ${classes.rowstyle}`}>
              ISD GSTR-6 Period
            </th>
            <th rowspan="2" className={`${classes.headstyle} ${classes.rowstyle}`}>
              ISD GSTR-6 Filing Date
            </th>
            <th rowspan="2" className={`${classes.headstyle} ${classes.rowstyle}`}>
              Eligibility of ITC
            </th>


          </tr>
          <tr>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              Integrated Tax(₹)
            </th>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              Central Tax(₹)
            </th>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              State/UT Tax(₹)
            </th>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              Cess(₹)
            </th>


          </tr>
        </thead>
        <tbody>
          {b2b.map((item, index) => (
            <React.Fragment key={index}>
              {item?.doclist?.map((itemb, indexb) => (
                <React.Fragment key={indexb}>
                  <tr>

                    <td className={`${classes.rowstyle}`}>
                      {itemb.odoctyp}
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      {itemb.odocnum}
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      {itemb.odocdt}
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      {item.ctin}
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      {item.trdnm}
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      {itemb.doctyp}
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      {itemb.docnum}
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      {itemb.docdt}
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      {itemb.oinvnum}
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      {itemb.oinvdt}
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      {itemb.igst}
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      {itemb.cgst}
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      {itemb.sgst}
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      {itemb.cess}
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      {item.supprd}
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      {item.supfildt}
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      {itemb.itcelg}
                    </td>

                  </tr>

                </React.Fragment>
              ))}

            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default injectWithObserver(GSTRISDA);