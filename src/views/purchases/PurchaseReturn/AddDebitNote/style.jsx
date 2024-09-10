import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  tableCellHeaderRoot: {
    border: '1px solid #e0e0e0',
    padding: 0
  },
  linkpayment: {
    backgroundColor: '#9dcb6a',
    marginLeft: 20,
    '&:focus': {
      backgroundColor: '#9dcb6a'
    },
    '&$focusVisible': {
      backgroundColor: '#9dcb6a'
    },
    '&:hover': {
      backgroundColor: '#9dcb6a'
    }
  },
  footercontrols: {
    marginRight: 20
  },
  tableCellBodyRoot: {
    border: '1px solid #e0e0e0',
    padding: 2
  },
  outlineinputProps: {
    padding: '2px 6px'
  },
  wrapper: {
    display: 'flex'
  },
  paymentTypeWrap: {
    color: '#999'
  },
  roundofftext: {
    '& .MuiOutlinedInput-root': {
      borderColor: 'purple'
    }
  },
  underline: {
    '&&&:before': {
      borderBottom: 'none'
    },
    '&&:after': {
      borderBottom: 'none'
    }
  },
  items: {
    display: 'flexDirection',
    justifyContent: 'space-between'
  },
  paper: {
    height: 140,
    width: 100
  },
  root: {
    margin: '0px 0',
    padding: '5px 15px',
    height: '55px',
    background: '#EBEBEB',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    paddingBottom: 20
  },
  selectMaterial: {
    width: '120px'
  },
  inputMaterial: {
    padding: '3px 6px'
  },
  outlineCessinputProps: {
    width: '60px',
    padding: '2px 6px'
  },
  payment_display: {
    display: 'inline-block',
    marginRight: '10px'
  },
  payment_op_display: {
    display: 'inline-block'
  },
  selectData: {
    color: '#EF5350',
    width: '150px',
    height: '45px',
    // backgroundColor: 'white'
  },
  selectDataPayment : {
    color: '#EF5350',
    width: '150px',
    height: '45px',
    backgroundColor: 'white'
  },
}));
export default { useStyles };
