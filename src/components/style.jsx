
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  label: {
    display: 'inline'
  },
  input: {
    width: '25%'
  },
  listitem: {
    alignSelf: 'flex-end',
    textAlign: 'center'
  },
  listitemGroup: {
    flex: 1,
    textAlign: 'left',
  },

  credit: {
    color: '#43A047',
    textAlign: 'center'

  },
  debit: {
    color: '#f44336',
    textAlign: 'cener'

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
    textAlign:'left',
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
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: theme.spacing(3)
  },

  bootstrapRoot: {
    padding: 5,
    'label + &': {
      marginTop: theme.spacing(3)
    }
  },
  bootstrapInput: {
    borderRadius: 2,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '5px 12px',
    width: 'calc(100% - 30px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: ['Nunito Sans, Roboto, sans-serif'].join(','),
    '&:focus': {
      borderColor: '#ff7961'
      // boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)"
    }
  },
  bootstrapFormLabel: {
    fontSize: 16
  },
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  outlineinputProps: {
    padding: '10px 6px'
  },
  tblroot: {
    width: "100%"
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  },
  tablerow: {
    '& tr:nth-child(even)': {
      backgroundColor: '#e6e6e6'
    },
  }
}));

export default { useStyles }