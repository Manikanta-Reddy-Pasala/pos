import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React from 'react';
import OpenPreview from './OpenPreview';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import ConfirmModal from './modal/ConfirmModal';
import { toJS } from 'mobx';
import AddSalesInvoice from '../views/sales/SalesInvoices/AddInvoice/index';
import AddnewPayment from '../views/sales/PaymentIn/AddPayment/index';
import AddSalesReturn from '../views/sales/SalesReturn/AddCreditNote/index';

import AddPurchasesBill from '../views/purchases/PurchaseBill/AddPurchase/index';
import AddnewPaymentOut from '../views/purchases/PaymentOut/AddPaymentOut/index';
import AddPurchaseReturn from '../views/purchases/PurchaseReturn/AddDebitNote/index';

function Moreoptions(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialogName, setOpenDialog] = React.useState(null);
  const [isStartPrint, setIsStartPrint] = React.useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = React.useState(false);

  const store = useStore();

  const { getVendorTransactionList } = store.VendorStore;

  const { viewOrEditSaleTxnItem, deleteSaleTxnItem } = store.SalesAddStore;
  const { openAddSalesInvoice } = toJS(store.SalesAddStore);

  const { viewOrEditPaymentInTxnItem, deletePaymentInTxnItem } =
    store.PaymentInStore;
  const { OpenAddPaymentIn } = toJS(store.PaymentInStore);

  const { viewOrEditSaleReturnTxnItem, deleteSaleReturnTxnItem } =
    store.ReturnsAddStore;
  const { openAddSalesReturn } = toJS(store.ReturnsAddStore);

  const { viewOrEditPurchaseTxnItem, deletePurchaseTxnItem } =
    store.PurchasesAddStore;
  const { OpenAddPurchaseBill } = toJS(store.PurchasesAddStore);

  const { viewOrEditPaymentOutTxnItem, deletePaymentOutTxnItem } =
    store.PaymentOutStore;
  const { OpenAddPaymentOut } = toJS(store.PaymentOutStore);

  const { viewOrEditPurchaseReturnTxnItem, deletePurchaseReturnTxnItem } =
    store.PurchasesReturnsAddStore;
  const { OpenAddPurchasesReturn } = toJS(store.PurchasesReturnsAddStore);

  const viewOrEditTxnItem = (item) => {
    console.log('viewOrEditTxnItem::', item);
    if (item.txnType === 'Sales') {
      viewOrEditSaleTxnItem(props.item);
    } else if (item.txnType === 'Payment In') {
      viewOrEditPaymentInTxnItem(props.item);
    } else if (item.txnType === 'Sales Return') {
      viewOrEditSaleReturnTxnItem(props.item);
    } else if (item.txnType === 'Purchases') {
      viewOrEditPurchaseTxnItem(props.item);
    } else if (item.txnType === 'Payment Out') {
      viewOrEditPaymentOutTxnItem(props.item);
    } else if (item.txnType === 'Purchases Return') {
      viewOrEditPurchaseReturnTxnItem(props.item);
    }

    let id = '';
    if (item.customer_id) {
      id = item.customer_id;
    } else if (item.customerId) {
      id = item.customerId;
    } else if (item.vendor_id) {
      id = item.vendor_id;
    } else if (item.vendorId) {
      id = item.vendorId;
    }
    getVendorTransactionList(id);
  };

  const deleteItem = () => {
    setIsOpenConfirmModal(true);
  };

  const confirmDeleteItem = async (confirm) => {
    if (confirm) {
      if (props.item.txnType === 'Sales') {
        await deleteSaleTxnItem(props.item);
      } else if (props.item.txnType === 'Payment In') {
        await deletePaymentInTxnItem(props.item);
      } else if (props.item.txnType === 'Sales Return') {
        await deleteSaleReturnTxnItem(props.item);
      } else if (props.item.txnType === 'Purchases') {
        await deletePurchaseTxnItem(props.item);
      } else if (props.item.txnType === 'Payment Out') {
        await deletePaymentOutTxnItem(props.item);
      } else if (props.item.txnType === 'Purchases Return') {
        await deletePurchaseReturnTxnItem(props.item);
      }

      let id = '';
      if (props.item.customer_id) {
        id = props.item.customer_id;
      } else if (props.item.customerId) {
        id = props.item.customerId;
      } else if (props.item.vendor_id) {
        id = props.item.vendor_id;
      } else if (props.item.vendorId) {
        id = props.item.vendorId;
      }
      getVendorTransactionList(id);

      setIsOpenConfirmModal(false);
      setAnchorEl(null);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openpdf = () => {
    setOpenDialog('pdf');
    handleClose();
  };
  const openpreview = () => {
    setOpenDialog('preview');
    handleClose();
  };
  const openprint = () => {
    setIsStartPrint(true);
    openpreview();
  };

  const closeDialog = () => {
    setOpenDialog(null);
  };
  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreVert fontSize="inherit" />
      </IconButton>
      {isOpenConfirmModal ? (
        <ConfirmModal
          open={isOpenConfirmModal}
          onConfirm={(isConfirm) => confirmDeleteItem(isConfirm)}
          onClose={() => setIsOpenConfirmModal(false)}
        />
      ) : (
        ''
      )}
      {openAddSalesInvoice ? (
        <AddSalesInvoice open={openAddSalesInvoice} />
      ) : (
        ''
      )}
      {OpenAddPaymentIn ? <AddnewPayment open={OpenAddPaymentIn} /> : ''}
      {OpenAddPurchaseBill ? (
        <AddPurchasesBill open={OpenAddPurchaseBill} />
      ) : (
        ''
      )}
      {openAddSalesReturn ? <AddSalesReturn open={openAddSalesReturn} /> : ''}
      {OpenAddPaymentOut ? <AddnewPaymentOut open={OpenAddPaymentOut} /> : ''}
      {OpenAddPurchasesReturn ? (
        <AddPurchaseReturn open={OpenAddPurchasesReturn} />
      ) : (
        ''
      )}

      <Menu
        id="moremenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem key={1} onClick={() => viewOrEditTxnItem(props.item)}>
          View{' '}
        </MenuItem>
        {/* <MenuItem key={2} onClick={() => deleteItem()}>
          Delete{' '}
        </MenuItem> */}
      </Menu>
      {openDialogName === 'preview' ? (
        <OpenPreview
          open={openDialogName === 'preview'}
          onClose={closeDialog}
          id={props.id}
          SalesData={props.item}
          startPrint={isStartPrint}
        />
      ) : (
        ''
      )}
    </div>
  );
}

export default injectWithObserver(Moreoptions);
