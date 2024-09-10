import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import injectWithObserver from '../../../Mobx/Helpers/injectWithObserver';
import { useTheme } from '@material-ui/core/styles';
import { useStore } from '../../../Mobx/Helpers/UseStore';

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
  headstyle1: {
    paddingTop: '12px',
    paddingBottom: '12px',
    textAlign: 'left',
    backgroundColor: '#ef5350c4',
    color: 'white'
  },
  headstyle2: {
    textAlign: 'left',
    backgroundColor: 'orange',
    color: 'white'
  },
  headstyle3: {
    textAlign: 'left',
    backgroundColor: '#e0691791',
    color: 'white'
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

const GSTRB2B = (props) => {
  const classes = useStyles();
  const [b2b, setB2B] = useState([]);

  useEffect(() => {
    if (props.data) {
      setB2B(props.data);
    }
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
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              GSTIN of supplier
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Trade/Legal name
            </th>
            <th
              colspan="4"
              style={{ textAlign: 'center' }}
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Invoice Details
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Place of supply
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Supply Attract Reverse Charge
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Item Details
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              GSTR-1/IFF/GSTR-5 Period
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              GSTR-1/IFF/GSTR-5 Filing Date
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              ITC Availability
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Reason
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Applicable % of Tax Rate
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Source
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              IRN
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              IRN Date
            </th>
          </tr>
          <tr>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              Invoice number
            </th>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              Invoice type
            </th>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              Invoice Date
            </th>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              Invoice Value(₹)
            </th>
          </tr>
        </thead>
        <tbody>
          {b2b.map((item, index) => (
            <React.Fragment key={index}>
              {item?.inv?.map((itemb, indexb) => (
                <React.Fragment key={indexb}>
                  <tr>
                    <td className={`${classes.rowstyle}`}>{item.ctin}</td>
                    <td className={`${classes.rowstyle}`}>{item.trdnm}</td>
                    <td className={`${classes.rowstyle}`}>{itemb.inum}</td>
                    <td className={`${classes.rowstyle}`}>{itemb.typ}</td>
                    <td className={`${classes.rowstyle}`}>{itemb.dt}</td>
                    <td className={`${classes.rowstyle}`}>{itemb.val}</td>
                    <td className={`${classes.rowstyle}`}>{itemb.pos}</td>
                    <td className={`${classes.rowstyle}`}>{itemb.rev}</td>
                    <td className={`${classes.rowstyle}`}>
                      <p
                        style={{ color: 'blue' }}
                        onClick={() => handleViewClick(itemb.inum)}
                      >
                        View
                      </p>
                    </td>
                    <td className={`${classes.rowstyle}`}>{item.supfildt}</td>
                    <td className={`${classes.rowstyle}`}>{item.supprd}</td>
                    <td className={`${classes.rowstyle}`}>{itemb.itcavl}</td>
                    <td className={`${classes.rowstyle}`}>{itemb.rsn}</td>
                    <td className={`${classes.rowstyle}`}>{itemb.diffprcnt}</td>
                    <td className={`${classes.rowstyle}`}>{itemb.srctyp}</td>
                    <td className={`${classes.rowstyle}`}>{itemb.irn}</td>
                    <td className={`${classes.rowstyle}`}>
                      {itemb.irngendate}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="15">
                      {openIndex === itemb.inum && (
                        <div className={classes.invGrid}>
                          {itemb.items.map((itemi, i) => (
                            <Grid container spacing={2}>
                              <Grid
                                item
                                xs={3}
                                className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                              >
                                Item Number : {itemi.num}
                              </Grid>
                              <Grid
                                item
                                xs={3}
                                className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                              >
                                Tax Rate : {itemi.rt}
                              </Grid>
                              <Grid
                                item
                                xs={3}
                                className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                              >
                                Total Taxable value : {itemi.txval}
                              </Grid>
                              <Grid
                                item
                                xs={3}
                                className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                              >
                                IGST Amount as per invoice : {itemi.igst}
                              </Grid>
                              <Grid
                                item
                                xs={3}
                                className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                              >
                                CGST Amount as per invoice : {itemi.cgst}
                              </Grid>
                              <Grid
                                item
                                xs={3}
                                className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                              >
                                SGST Amount as per invoice : {itemi.sgst}
                              </Grid>
                              <Grid
                                item
                                xs={3}
                                className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                              >
                                CESS Amount as per invoice : {itemi.cess}
                              </Grid>
                            </Grid>
                          ))}
                        </div>
                      )}
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

export default injectWithObserver(GSTRB2B);
