import { makeStyles, withStyles } from "@material-ui/core";
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
    productModalContent: {
      '& .grid-padding': {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
      }
    },
    marginSet: {
      marginTop: 'auto'
    },
    datecol: {
      width: '90%',
      marginLeft: '14px'
    },
    blockLine: {
      display: 'inline-block'
    },
    listbox: {
        minWidth: '30%',
        margin: 0,
        padding: 5,
        zIndex: 1,
        position: 'absolute',
        listStyle: 'none',
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        maxHeight: 200,
        textAlign: 'left',
        border: '1px solid rgba(0,0,0,.25)',
        '& li[data-focus="true"]': {
          backgroundColor: '#4a8df6',
          color: 'white',
          cursor: 'pointer'
        },
        '& li:active': {
          backgroundColor: '#2977f5',
          color: 'white'
        }
      },
      bootstrapInput: {
        borderRadius: 2,
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 12px',
        width: 'calc(100% - 30px)',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        fontFamily: ['Nunito Sans, Roboto, sans-serif'].join(','),
        '&:focus': {
          borderColor: '#ff7961'
          // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
        }
      },
      bootstrapFormLabel: {
        fontSize: 16
      },
      input: {
        width: '90%'
      },
    nameList: {
      marginTop: '10px'
    },
    liBtn: {
        width: '100%',
        padding: '7px 8px',
        textTransform: 'none',
        fontWeight: '300',
        fontSize: 'small',
        '&:focus': {
          background: '#ededed',
          outline: 0,
          border: 0,
          fontWeight: 'bold',
          cursor: 'pointer'
        },
        '&:hover': {
          background: '#ededed',
          outline: 0,
          border: 0,
          fontWeight: 'bold',
          cursor: 'pointer'
        }
      },
      inputNumber: {
        '& input[type=number]': {
          '-moz-appearance': 'textfield'
        },
        '& input[type=number]::-webkit-outer-spin-button': {
          '-webkit-appearance': 'none',
          margin: 0
        },
        '& input[type=number]::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
          margin: 0
        }
      },
      bootstrapNotesInput: {
        borderRadius: 2,
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        fontFamily: ['Nunito Sans, Roboto, sans-serif'].join(','),
        '&:focus': {
          borderColor: '#ff7961'
          // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
        }
      },
      paperRoot: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        borderRadius: 6
      },
      footerControl: {
        position: 'absolute', 
        bottom: '0px', 
        right: '0px', 
        borderTop: '1px solid #e4dddd', 
        width: '100%', 
        boxShadow: '0 0 0 1px rgba(63,63,68,0.05), 0 1px 2px 0 rgba(63,63,68,0.15)'
      },
      primaryImageButtonWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        cursor: 'pointer',
        '& #product-primary-upload': {
          display: 'none'
        },
        '& #product-secondary-upload': {
          display: 'none'
        },
        '& .uploadImageButton': {
          color: '#fff',
          bottom: '10px',
          backgroundColor: '#4a83fb',
          padding: '7px',
          fontSize: '14px',
          fontFamily: 'Roboto',
          fontWeight: 500,
          lineHeight: 1.75,
          borderRadius: '4px',
          marginRight: theme.spacing(2),
          '&.primaryImage': {
            margin: '5px',
            position: 'relative',
            top: '-20px'
          },
          '& i': {
            marginRight: '8px'
          }
        }
      },
  }));

  const DialogTitle = withStyles((theme) => ({
    root: {
      '& h2': {
        fontSize: '24px'
      },
      '& .closeButton': {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.success[500]
      }
    }
  }))(MuiDialogTitle);
  
  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3)
    }
  }))(MuiDialogActions);

  export default { useStyles, DialogActions, DialogTitle };