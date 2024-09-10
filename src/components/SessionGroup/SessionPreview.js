import React, { useState } from 'react';
import { View } from '@react-pdf/renderer';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import SessionGroupRegularPrint from 'src/views/Printers/ComponentsToPrint/SessionGroupRegularPrint';

const styles = (theme) => ({
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
  buttonProgress: {
    color: '#ff7961',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h4">{children}</Typography>
      {/* {onClose ? ( */}
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
      {/* ) : null} */}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

export default function SessionPreview({
  open,
  onClose,
  id,
  invoiceData,
  onPrint,
}) {
  const store = useStore();
  const [openPrint, setOpenPrint]= useState(false);


  const closeDialog = () => {
    onClose();
  };

  const handleOpenPrint = () => {
    onPrint();
    onClose();
  }

  return (
    <div>
      <Dialog
        fullWidth={true}
        contentStyle={{ width: '50%', maxHeight: '80%' }}
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={onClose}>
          Preview
        </DialogTitle>
        <DialogContent dividers>
          <View>
          <SessionGroupRegularPrint
              data={invoiceData}
            />
          </View>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={handleOpenPrint}
            variant="outlined"
          >
            PRINT
          </Button>
          <Button
            onClick={() => {
              closeDialog();
            }}
            color="secondary"
            variant="outlined"
          >
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}