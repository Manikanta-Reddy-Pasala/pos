import React, { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  
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
    backgroundColor: '#EF5350',
    color: 'white'
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

const GSTRITCAvailable = (props) => {
  const classes = useStyles();

  const [itcavl, setItcavl] = useState({});

  useEffect(() => {
    console.log(props.data);
    setItcavl(props.data);
  }, []);

  return (
    <>
      <table className={`${classes.batchTable}`}>
        <thead>
          <tr>
            <th className={`${classes.headstyle1} ${classes.rowstyle}`}>
              FORM SUMMARY - ITC Available
            </th>
          </tr>
        </thead>
      </table>
      <table className={`${classes.batchTable}`}>
        <thead>
          <tr>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              S.no
            </th>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              Heading
            </th>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              GSTR-3B table
            </th>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              Integrated Tax  (₹)
            </th>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              Central Tax (₹)
            </th>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              State/UT Tax (₹)
            </th>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              Cess  (₹)
            </th>
            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
              Advisory
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className={`${classes.headstyle2}`}>
            <td className={`${classes.rowstyle}`} colSpan='8'>
              Credit which may be availed under FORM GSTR-3B
            </td>
          </tr>
          <tr className={`${classes.headstyle3}`}>
            <td className={`${classes.rowstyle}`}>
              Part-A
            </td>
            <td className={`${classes.rowstyle}`} colSpan='8'>
              ITC Available - Credit may be claimed in relevant headings in GSTR-3B
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              <b>All other ITC - Supplies from registered persons other than reverse charge</b>
            </td>
            <td className={`${classes.rowstyle}`}>
              <b>4(A)(5)</b>
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
              Net input tax credit may be availed under Table 4(A)(5) of FORM GSTR-3B.
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              B2B - Invoices
            </td>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.b2b?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.b2b?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.b2b?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.b2b?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              B2B - Debit notes
            </td>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.b2ba?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.b2ba?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.b2ba?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.b2ba?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              ECO - Documents
            </td>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              0
            </td>
            <td className={`${classes.rowstyle}`}>
              0
            </td>
            <td className={`${classes.rowstyle}`}>
              0
            </td>
            <td className={`${classes.rowstyle}`}>
              0
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              B2B - Invoices (Amendment)
            </td>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.cdnr?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.cdnr?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.cdnr?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.cdnr?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              B2B - Debit notes (Amendment)
            </td>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.cdnra?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.cdnra?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.cdnra?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.nonrevsup?.cdnra?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>

          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              <b>Inward Supplies from ISD</b>
            </td>
            <td className={`${classes.rowstyle}`}>
              <b>4(A)(4)</b>
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.isdsup?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.isdsup?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.isdsup?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.isdsup?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
              Net input tax credit may be availed under Table 4(A)(4) of FORM GSTR-3B.
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              ISD - Invoices
            </td>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.isdsup?.isd?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.isdsup?.isd?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.isdsup?.isd?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.isdsup?.isd?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              ISD - Invoices (Amendment)
            </td>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.isdsup?.isda?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.isdsup?.isda?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.isdsup?.isda?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.isdsup?.isda?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>

          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              <b>Inward Supplies liable for reverse charge</b>
            </td>
            <td className={`${classes.rowstyle}`}>
              <b>3.1(d) <br /> 4(A)(3)</b>

            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
              These supplies shall be declared in Table 3.1(d) of FORM GSTR-3B for payment of tax.
              Net input tax credit may be availed under Table 4(A)(3) of FORM GSTR-3B on payment of tax.
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              B2B - Invoices
            </td>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.b2b?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.b2b?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.b2b?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.b2b?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              B2B - Debit notes
            </td>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.b2ba?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.b2ba?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.b2ba?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.b2ba?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              B2B - Invoices (Amendment)
            </td>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.cdnr?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.cdnr?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.cdnr?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.cdnr?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              B2B - Debit notes (Amendment)
            </td>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.cdnra?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.cdnra?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.cdnra?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.revsup?.cdnra?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>

          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              <b>Import of Goods</b>
            </td>
            <td className={`${classes.rowstyle}`}>
              <b>4(A)(1)</b>
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
              Net input tax credit may be availed under Table 4(A)(1) of FORM GSTR-3B.
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              IMPG - Import of goods from overseas
            </td>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.impg?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.impg?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.impg?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.impg?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              IMPG (Amendment)
            </td>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.impga?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.impga?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.impga?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.impga?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              IMPGSEZ - Import of goods from SEZ
            </td>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.impgsez?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.impgsez?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.impgsez?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.impgsez?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              IMPGSEZ (Amendment)
            </td>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.impgasez?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.impgasez?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.impgasez?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.imports?.impgasez?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>


          <tr className={`${classes.headstyle3}`}>
            <td className={`${classes.rowstyle}`}>
              Part-B
            </td>
            <td className={`${classes.rowstyle}`} colSpan='8'>
              ITC Available - Credit notes should be net off against relevant ITC available headings in GSTR-3B
            </td>
          </tr>

          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              <b>Others</b>
            </td>
            <td className={`${classes.rowstyle}`}>
              <b>4(A)</b>
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
              Credit Notes should be net-off against relevant ITC available tables [Table 4A(3,4,5)].
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              B2B - Credit notes
            </td>
            <td className={`${classes.rowstyle}`}>
              <b>4(A)(5)</b>
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.cdnr?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.cdnr?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.cdnr?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.cdnr?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              B2B - Credit notes (Amendment)
            </td>
            <td className={`${classes.rowstyle}`}>
              <b>4(A)(5)</b>
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.cdnra?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.cdnra?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.cdnra?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.cdnra?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              B2B - Credit notes (Reverse charge)
            </td>
            <td className={`${classes.rowstyle}`}>
              <b>4(A)(3)</b>
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.cdnrrev?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.cdnrrev?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.cdnrrev?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.cdnrrev?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              B2B - Credit notes (Reverse charge)(Amendment)
            </td>
            <td className={`${classes.rowstyle}`}>
              <b>4(A)(3)</b>
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.cdnrarev?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.cdnrarev?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.cdnrarev?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.cdnrarev?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              ISD - Credit notes
            </td>
            <td className={`${classes.rowstyle}`}>
              <b>4(A)(3)</b>
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.isd?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.isd?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.isd?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.isd?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>
          <tr>
            <td className={`${classes.rowstyle}`}>

            </td>
            <td className={`${classes.rowstyle}`}>
              ISD - Credit notes (Amendment)
            </td>
            <td className={`${classes.rowstyle}`}>
              <b>4(A)(4)</b>
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.isda?.igst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.isda?.cgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.isda?.sgst}
            </td>
            <td className={`${classes.rowstyle}`}>
              {itcavl?.othersup?.isda?.cess}
            </td>
            <td className={`${classes.rowstyle}`}>
            </td>
          </tr>


        </tbody>
      </table>
    </>
  );
};

export default injectWithObserver(GSTRITCAvailable);