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
import { useStore } from 'src/Mobx/Helpers/UseStore';
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

export default function SchemePaymentHistory() {
  const classes = useStyles();
  const stores = useStore();

  const { openSchemePaymentHistory, paymentHistory, paymentHistoryTotal } =
    toJS(stores.SchemeManagementStore);
  const { handleSchemePaymentHistoryModalClose } = stores.SchemeManagementStore;

  const ccyFormat = (num) => {
    return num.toFixed(0) || 0;
  };

  const getPaymentTypes = (data) => {
    let paymentType = '';
    if (data && data.paymentDetails) {
      for (let [key, value] of data.paymentDetails) {
        if (value !== 0) {
          paymentType += '<b>' + key + '</b>: ₹' + value + '<br/>';
        }
      }
    }
    return paymentType;
  };

  return (
    <Dialog
      onClose={handleSchemePaymentHistoryModalClose}
      aria-labelledby="customized-dialog-title"
      open={openSchemePaymentHistory}
    >
      <DialogTitle
        id="customized-dialog-title"
        onClose={handleSchemePaymentHistoryModalClose}
      >
        Payment History
      </DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table className={classes.table} aria-label="spanning table">
            <TableHead>
              <TableRow>
                <TableCell>Transaction Date</TableCell>
                <TableCell align="right">No</TableCell>
                <TableCell align="right">Linked Amount</TableCell>
                <TableCell align="right">Payment Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentHistory.map((row) => {
                return (
                  <TableRow key={row.transactionNumber}>
                    <TableCell>{dateFormat(row.date, 'yyyy-mm-dd')}</TableCell>
                    <TableCell align="right">{row.sequenceNumber}</TableCell>
                    <TableCell align="right">{row.total}</TableCell>
                    <TableCell align="right">
                      <p
                        style={{
                          textTransform: 'capitalize'
                        }}
                        dangerouslySetInnerHTML={{
                          __html: getPaymentTypes(row)
                        }}
                      ></p>
                    </TableCell>
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
        <Button onClick={handleSchemePaymentHistoryModalClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}