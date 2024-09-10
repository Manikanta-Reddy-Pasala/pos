import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useStyles } from '@material-ui/pickers/views/Calendar/SlideTransition';
import dateFormat from 'dateformat';
import { useStore } from '../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  table: {
    // minWidth: 700
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
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

export default function PaymentHistory(props) {
  const classes = useStyles();
  const stores = useStore();

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  const { paymentHistory, paymentHistoryTotal } = toJS(
    stores.PaymentHistoryStore
  );

  const ccyFormat = (num) => {
    return num.toFixed(0) || 0;
  };

  useEffect(() => {
    setOpen(props.open);
  }, []);

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Payment History
      </DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table className={classes.table} aria-label="spanning table">
            <TableHead>
              <TableRow>
                <TableCell>Transaction Date</TableCell>
                <TableCell align="right">Ref No</TableCell>
                <TableCell align="right">Transaction Type</TableCell>
                <TableCell align="right">Linked Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentHistory.map((row) => {
                return (
                  <TableRow key={row.transactionNumber}>
                    <TableCell>{dateFormat(row.date, 'yyyy-mm-dd')}</TableCell>
                    <TableCell align="right">{row.sequenceNumber}</TableCell>
                    <TableCell align="right">{row.paymentType}</TableCell>
                    <TableCell align="right">{row.linkedAmount}</TableCell>
                  </TableRow>
                );
              })}

              <TableRow>
                <TableCell colSpan={3} align="right">
                  Total
                </TableCell>
                <TableCell align="right">
                  {ccyFormat(paymentHistoryTotal)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
