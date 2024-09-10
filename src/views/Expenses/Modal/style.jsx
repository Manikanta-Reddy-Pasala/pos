import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  tableCellHeaderRoot: {
    border: '1px solid #e0e0e0',
    padding: 0,
    lineHeight: '1.25rem',
    textAlign: 'center',
    fontWeight: 400,
    fontSize: '0.87rem',
    color: '#999'
  },
  addRowWrapper: {
    backgroundColor: '#ffffff',
    '& td': {
      padding: '10px'
    }
  },
  addtablehead: {
    backgroundColor: '#ffffff'
  },
  linkpayment: {
    backgroundColor: '#9dcb6a',
    marginLeft: 20,
    color: '#fff',
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
  saveButton: {
    color: '#fff'
  },
  footercontrols: {
    marginRight: 20,
    padding: '15px 40px'
  },
  paymentTypeWrap: {
    color: '#999'
  },
  tableCellBodyRoot: {
    color: '#999',
    border: '1px solid #e0e0e0',
    padding: '5px',
    lineHeight: '1.25rem',
    textAlign: 'center',
    fontWeight: 400,
    fontSize: '0.8rem'
  },
  outlineinputProps: {
    padding: '2px 6px',
    fontSize: '0.875rem'
  },
  wrapper: {
    display: 'flex'
  },

  roundofftext: {
    '& .MuiOutlinedInput-root': {
      borderColor: 'purple'
    }
  },
  roundOffMarginTop: {
    marginTop: theme.spacing(3)
  },
  backgroundWhite: {
    backgroundColor: '#ffffff'
  },
  colorBlack: {
    color: '#263238'
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
    height: '135px',
    background: '#EBEBEB',
  },
  footer: {
    position: 'absolute',
    bottom: '0px',
    height: '213px',
    left: '0px',
    right: '0px',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  selectMaterial: {
    width: '120px'
  },
  inputMaterial: {
    padding: '3px 6px'
  },
  footer_fst : {
    height: '55px',
    margin: '0px 0px 4px 0px',
    padding: '12px 15px',
    background: '#EBEBEB',
    color : '#a2a2a2',
  },
  appBar: {
    position: 'relative',
    backgroundColor: '#ffffff'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  newButton: {
    position: 'relative',
    borderRadius: 25
  },

  pageHeader: {
    display: 'flex',
    overflowX: 'hidden'
  },
  pageIcon: {
    display: 'inline-block',
    padding: theme.spacing(2),
    color: '#3c44b1'
  },
  pageTitle: {
    paddingLeft: theme.spacing(4),
    '& .MuiTypography-subtitle2': {
      opacity: '0.6'
    }
  },
  mySvgStyle: {
    fillColor: theme.palette.primary.main
  },
  card: {
    padding: theme.spacing(4),
    display: 'flex',
    marginBottom: theme.spacing(2),
    alignItems: 'center',
    flexDirection: 'row'
  },
  menubutton: {
    fontWeight: 'bold',
    textTransform: 'none'
  },
  menubutton1: {
    textTransform: 'none'
  },
  customizeToolbar: {
    maxHeight: 20
  },
  selectData: {
    color: '#EF5350',
    width: '150px',
    height: '45px',
    backgroundColor: 'white'
  },
  payment_display: {
    display : 'inline-block',
    marginRight : '10px',
  },
  payment_op_display : {
    display : 'inline-block',
  },
  notesOption : {
  
    padding: '10px',
    background: 'white',
    width: '85%',
    
      },
  notesop:{
    width : '100%'
  }

}));
export default { useStyles };
