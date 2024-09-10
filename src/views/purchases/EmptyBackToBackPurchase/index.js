import { makeStyles } from '@material-ui/core';
import React from 'react';
import Controls from 'src/components/controls/index';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import purchaseBill from 'src/icons/svg/Purchase_new.svg';
import ProductModal from 'src/components/modal/ProductModal';
import AddBackToBackPurchasesBill from 'src/views/purchases/BackToBackPurchase/BackToBackAddPurchase/index'
import { toJS } from 'mobx';

const useStyles = makeStyles((theme) => ({
  newButton: {
    position: 'relative',
    borderRadius: 25,
    marginTop: 25,
    minWidth: 200,
    fontWeight: 400,
    background: '#9DCB6A',
    '&:hover': {
      background: '#9DCB6A'
    }
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
const EmptyBackToBackPurchases = () => {
  const classes = useStyles();
  const store = useStore();
  const { openForNewBackToBackPurchase } = store.BackToBackPurchaseStore;
  const { OpenAddBackToBackPurchaseBill } = toJS(store.BackToBackPurchaseStore);
  const { productDialogOpen } = store.ProductStore;

  return (
    <div className={classes.divalign}>
      <img src={purchaseBill} className={classes.Applogo} alt="logo" />
      <p>
        <Controls.Button
          text="Add Procurement"
          size="small"
          variant="contained"
          className={classes.newButton}
          onClick={() => openForNewBackToBackPurchase()}
        />
        {OpenAddBackToBackPurchaseBill ? <AddBackToBackPurchasesBill /> : null}
        {productDialogOpen ? <ProductModal /> : null}
      </p>
    </div>
  );
};
export default InjectObserver(EmptyBackToBackPurchases);
