import { makeStyles } from '@material-ui/core';
import React from 'react';
import Controls from '../../../../components/controls/index';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import saleInvoice from '../../../../icons/svg/sale_invoice.svg';
import AddDeliveryChallan from '../AddDeliveryChallan';
import ProductModal from '../../../../components/modal/ProductModal';
import { toJS } from 'mobx';

const useStyles = makeStyles((theme) => ({
  newButton: {
    position: 'relative',
    borderRadius: 25,
    marginTop: 25,
    minWidth: 200,
    fontWeight: 400
  },
  Applogo: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '30%'
  },
  Appheader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  divalign: {
    width: '500px',
    height: '500px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto'
  }
}));
const EmptyDeliveryChallanInvoice = () => {
  const classes = useStyles();
  const store = useStore();
  const { openForNewDeliveryChallan } = store.DeliveryChallanStore;
  const { OpenAddDeliveryChallanInvoice } = toJS(store.DeliveryChallanStore);
  const { productDialogOpen } = toJS(store.ProductStore);

  return (
    <div className={classes.divalign}>
      <img src={saleInvoice} className={classes.Applogo} alt="logo" />
      <p>
        <Controls.Button
          text="Add your first Delivery Challan"
          size="small"
          variant="contained"
          color="primary"
          autoFocus={true}
          className={classes.newButton}
          onClick={() => openForNewDeliveryChallan()}
        />
        {OpenAddDeliveryChallanInvoice ? <AddDeliveryChallan /> : null}
        {productDialogOpen ? <ProductModal /> : null}
      </p>
    </div>
  );
};
export default InjectObserver(EmptyDeliveryChallanInvoice);