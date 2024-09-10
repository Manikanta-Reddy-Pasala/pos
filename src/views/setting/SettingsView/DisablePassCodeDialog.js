import React from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import { toJS } from 'mobx';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import {
  Container,
  Grid,
  makeStyles,useTheme,Typography,TextField,Checkbox,RadioGroup,Radio,FormLabel 
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  paper: { maxWidth: '400px' },
  inputBox: {
    '& .MuiFormControl-root': {
      borderRadius: 0,
      width: '50px'
    },
    '& .MuiOutlinedInput-root':{
      borderRadius: 0

    },
    '& .MuiInputBase-input': {
      background: 'white',
      // padding: '10px'
    }
  },
  inputNumber : {
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
  removeArrow:{
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0
    }
  }
}));

const styles = (theme) => ({
    
    
  });

const DisablePassCodeModal = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const setMaxLength = (e) => {
    e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,1)
   };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle id="confirm-modal-title"></DialogTitle>
      <DialogContent className={classes.productModalContent}>
        <DialogContentText id="alert-dialog-description">
          Password to Disable Delete Transaction is sent to your registered Email Id. Please enter it below.
        </DialogContentText>
      </DialogContent>
      
      <Typography gutterBottom style={{paddingTop:'20px', marginLeft: "30px"}}>
              Password
          </Typography>

          <Grid xs={12}   style={{display: 'flex', marginLeft: "30px"}}>
          <div className={classes.inputBox}>
          <TextField
           className={classes.removeArrow}
                   onInput={(e) => setMaxLength(e)}
                    onKeyDown={blockInvalidChar}
                    id="outlined-size-normal"
                    defaultValue=""
                    variant="outlined"
                    type="number"
                    inputProps={{ maxLength: 1, className: classes.inputNumber }}
                    
          />
           <TextField
            className={classes.removeArrow}
                   onInput={(e) => setMaxLength(e)}
                    onKeyDown={blockInvalidChar}
                    id="outlined-size-normal"
                    defaultValue=""
                    variant="outlined"
                    type="number"
                    inputProps={{ maxLength: 1, className: classes.inputNumber }}
          />
           <TextField
            className={classes.removeArrow}
                   onInput={(e) => setMaxLength(e)}
                    onKeyDown={blockInvalidChar}
                    id="outlined-size-normal"
                    defaultValue=""
                    variant="outlined"
                    type="number"
                    inputProps={{ maxLength: 1, className: classes.inputNumber }}
          />
          <TextField
           className={classes.removeArrow}
                   onInput={(e) => setMaxLength(e)}
                    onKeyDown={blockInvalidChar}
                    id="outlined-size-normal"
                    defaultValue=""
                    variant="outlined"
                    type="number"
                    inputProps={{ maxLength: 1, className: classes.inputNumber }}
          />
          <TextField
           className={classes.removeArrow}
                   onInput={(e) => setMaxLength(e)}
                    onKeyDown={blockInvalidChar}
                    id="outlined-size-normal"
                    defaultValue=""
                    variant="outlined"
                    type="number"
                    inputProps={{ maxLength: 1, className: classes.inputNumber }}
          />
          <TextField
           className={classes.removeArrow}
                   onInput={(e) => setMaxLength(e)}
                    onKeyDown={blockInvalidChar}
                    id="outlined-size-normal"
                    defaultValue=""
                    variant="outlined"
                    type="number"
                    inputProps={{ maxLength: 1, className: classes.inputNumber }}
          />
      </div>
          </Grid>
      
      <DialogActions>
      <Button
          color="secondary"
          variant="outlined"
          onClick={() => {
            handleClickOpen()
          }}
        >
          CANCEL
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => {
            handleClose()
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InjectObserver(DisablePassCodeModal);
