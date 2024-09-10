import { makeStyles } from "@material-ui/core";

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
      backgroundColor: "#9dcb6a"
    },
    "&:hover": {
      backgroundColor: "#9dcb6a"
    },

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

  roundofftext: {
    "& .MuiOutlinedInput-root": {
      borderColor: "purple"
    },
  },
  underline: {
    "&&&:before": {
      borderBottom: "none"
    },
    "&&:after": {
      borderBottom: "none"
    }
  },
  items: {
    display: 'flexDirection',
    justifyContent: 'space-between'
  },
  paper: {
    height: 140,
    width: 100,
  },
  root: {
    marginTop: 50,
    padding: theme.spacing(2)
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    paddingBottom: 20,
  },
  selectMaterial: {
    width: "120px"
  },
  inputMaterial: {
    padding: "3px 6px"
  }

}));
export default { useStyles }