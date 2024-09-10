import { makeStyles } from '@material-ui/core';
import React from 'react';
import Controls from '../../../../components/controls/index';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import saleInvoice from '../../../../icons/svg/sale_invoice.svg';
import AddSalesQuotation from '../AddSalesQuotation';
import ProductModal from '../../../../components/modal/ProductModal';

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
const EmptySalesQuotationInvoice = () => {
  const classes = useStyles();
  const store = useStore();
  const { openForNewSale } = store.SalesQuotationAddStore;
  const { productDialogOpen } = store.ProductStore;

  return (
    <div className={classes.divalign}>
      <img src={saleInvoice} className={classes.Applogo} alt="logo" />
      <p>
        <Controls.Button
          text="Add your first Sale Quotation"
          size="small"
          variant="contained"
          color="primary"
          autoFocus={true}
          className={classes.newButton}
          onClick={() => openForNewSale()}
        />
        <AddSalesQuotation />
        {productDialogOpen ? <ProductModal /> : null}
      </p>
    </div>
  );
};
export default InjectObserver(EmptySalesQuotationInvoice);
