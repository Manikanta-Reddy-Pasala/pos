import React from 'react';

import { Dialog, DialogContent, makeStyles } from '@material-ui/core';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { Link } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import { toJS } from 'mobx';
import { useStore } from '../../Mobx/Helpers/UseStore';

const useStyles = makeStyles(() => ({
  paper: { maxWidth: '600px' }
}));

const LowAndExpiryStockAlertModal = (props) => {
  const classes = useStyles();

  const handleClose = () => {
    closeExpiryAndLowStockReport();
  };

  const store = useStore();

  const {
    openExpiryAndLowStockReport,
    lowStockProductsCount,
    expiredProductsCount
  } = toJS(store.ReportsStore);

  const { closeExpiryAndLowStockReport, setReportRouterData } =
    store.ReportsStore;

  return (
    <Dialog
      open={openExpiryAndLowStockReport}
      onClose={handleClose}
      maxWidth="sm"
      classes={{ paper: classes.paper }}
    >
      <DialogTitle id="product-modal-title">
        <Grid container alignItems="center">
          <Typography component={'div'} variant="h4">Stock Alert!</Typography>

          <IconButton
            aria-label="close"
            className="closeButton"
            onClick={handleClose}
            style={{ marginLeft: 'auto' }}
          >
            <CancelRoundedIcon />
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Grid container alignItems="center">
            <Typography component={'div'} style={{ marginRight: '40px' }}>
              Products running Out Of Stock: {lowStockProductsCount}
            </Typography>

            <Link
              to="/app/Reports"
              onClick={() => setReportRouterData('lowstock')}
              style={{
                color: '#EF5350',
                marginLeft: 'auto',
                textDecorationLine: 'underline',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              View Low Stock Report
            </Link>
          </Grid>
          <Grid
            container
            alignItems="center"
            style={{ marginTop: '30px', marginBottom: '20px' }}
          >
            <Typography component={'div'} style={{ marginRight: '40px' }}>
              Products nearing Expiry: {expiredProductsCount}
            </Typography>

            <Link
              to="/app/Reports"
              onClick={() => setReportRouterData('expiry')}
              style={{
                color: '#EF5350',
                marginLeft: 'auto',
                textDecorationLine: 'underline',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              View Expiry Report
            </Link>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default InjectObserver(LowAndExpiryStockAlertModal);
