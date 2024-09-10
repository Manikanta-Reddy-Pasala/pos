import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, Grid, Dialog, DialogContent } from '@material-ui/core';
import injectWithObserver from '../../../Mobx/Helpers/injectWithObserver';
import { useTheme } from '@material-ui/core/styles';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import DialogContentText from '@material-ui/core/DialogContentText';
import { get2AData } from 'src/components/Helpers/GstrOnlineHelper';
import Loader from 'react-js-loader';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { toJS } from 'mobx';
import { getSelectedDateMonthAndYearMMYYYY } from 'src/components/Helpers/DateHelper';

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

const GSTRIMPGSEZ = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const theme = useTheme();
  const [b2b, setB2B] = useState([]);

  const [loading, setLoading] = useState(false);
  const { getTaxSettingsDetails } = stores.TaxSettingsStore;
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { impsezg2AData, updateIMPGSEZData } = stores.GSTR2AStore;
  const { GSTRDateRange } = toJS(stores.GSTR2AStore);

  useEffect(() => {
    // fetchData();
  }, []);

  const [openIndex, setOpenIndex] = useState(null);

  const handleViewClick = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };
  const fetchData = async () => {
    const tData = await getTaxSettingsDetails();
    let reqData = {};
    reqData = {
      gstin: tData?.gstin,
      ret_period: getSelectedDateMonthAndYearMMYYYY(GSTRDateRange.fromDate)
    };
    const apiResponse = await get2AData(reqData, 'impgsez');
    setLoading(false);
    if (apiResponse && apiResponse.status === 1) {
      updateIMPGSEZData(apiResponse.message?.impgsez);
    }
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
              Books
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Taxpayer GSTIN
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Filing Period
            </th>
            <th
              rowspan="2"
              style={{ textAlign: 'center' }}
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Reference Date
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Bill of Entry Number
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Bill of Entry Date
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Port Code
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Supplier GSTIN
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Trade Name
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Amendment
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Taxable Amount
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              IGST Amount
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Cess Amount
            </th>
            <th
              rowspan="2"
              className={`${classes.headstyle} ${classes.rowstyle}`}
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {impsezg2AData.map((item, index) => (
            <tr>
              <td className={`${classes.rowstyle}`}></td>
              <td className={`${classes.rowstyle}`}></td>
              <td className={`${classes.rowstyle}`}></td>
              <td className={`${classes.rowstyle}`}>{item.refdt}</td>
              <td className={`${classes.rowstyle}`}>{item.benum}</td>
              <td className={`${classes.rowstyle}`}>{item.bedt}</td>
              <td className={`${classes.rowstyle}`}>{item.portcd}</td>
              <td className={`${classes.rowstyle}`}>{item.sgstin}</td>
              <td className={`${classes.rowstyle}`}>{item.tdname}</td>
              <td className={`${classes.rowstyle}`}>{item.amd}</td>
              <td className={`${classes.rowstyle}`}>{item.txval}</td>
              <td className={`${classes.rowstyle}`}>{item.iamt}</td>
              <td className={`${classes.rowstyle}`}>{item.csamt}</td>
              <td className={`${classes.rowstyle}`}></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog
        fullScreen={fullScreen}
        open={loading}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>
                <br />
                <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default injectWithObserver(GSTRIMPGSEZ);
