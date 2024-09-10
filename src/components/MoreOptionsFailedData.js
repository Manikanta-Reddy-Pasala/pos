import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React from 'react';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';

function Moreoptions(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const store = useStore();

  const { viewAndRestoreSaleItem } = store.SalesAddStore;
  const { viewAndRestoreSaleQuotationItem } = store.SalesQuotationAddStore;
  const { viewAndRestoreSaleOrderItem } = store.SaleOrderStore;
  const { viewAndRestoreDeliveryChallanItem } = store.DeliveryChallanStore;
  const { viewAndRestoreApprovalItem } = store.ApprovalsStore;
  const { viewAndRestoreSaleReturnItem } = store.ReturnsAddStore;
  const { viewAndRestorePurchaseItem } = store.PurchasesAddStore;
  const { viewAndRestorePurchaseReturnItem } = store.PurchasesReturnsAddStore;
  const { viewAndRestorePurchaseOrderItem } = store.PurchaseOrderStore;
  const { viewAndRestoreJobWorkInItem } = store.JobWorkInStore;
  const { viewAndRestoreJobWorkOutItem } = store.JobWorkStore;
  const { viewAndRestorePaymentIn } = store.PaymentInStore;
  const { viewAndRestoreJobWorkReceiptItem } = store.JobWorkReceiptStore;
  const { viewAndRestorePaymentOut } = store.PaymentOutStore;
  const { viewAndRestoreExpenseItem } = store.ExpensesStore;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const viewAndRestore = async () => {
    // console.log('view & restore clicked', JSON.parse(props.item.data));
    switch (props.item.transactionType) {
      case 'Sales':
        try {
          viewAndRestoreSaleItem(JSON.parse(props.item.data));
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Payment In':
        try {
          viewAndRestorePaymentIn(JSON.parse(props.item.data));
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Sales Quotation':
        try {
          viewAndRestoreSaleQuotationItem(JSON.parse(props.item.data));
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Sale Order':
        try {
          viewAndRestoreSaleOrderItem(JSON.parse(props.item.data));
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Delivery Challan':
        try {
          viewAndRestoreDeliveryChallanItem(JSON.parse(props.item.data));
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Sales Return':
        try {
          viewAndRestoreSaleReturnItem(JSON.parse(props.item.data));
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Approval':
        try {
          viewAndRestoreApprovalItem(JSON.parse(props.item.data));
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Purchases':
        try {
          viewAndRestorePurchaseItem(JSON.parse(props.item.data));
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Purchase Order':
        try {
          viewAndRestorePurchaseOrderItem(JSON.parse(props.item.data));
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Payment Out':
        try {
          viewAndRestorePaymentOut(JSON.parse(props.item.data));
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Purchases Return':
        try {
          viewAndRestorePurchaseReturnItem(JSON.parse(props.item.data));
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Expenses':
        try {
          viewAndRestoreExpenseItem(JSON.parse(props.item.data));
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Job Work Order - In':
        try {
          viewAndRestoreJobWorkInItem(JSON.parse(props.item.data));
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Job Work Order - Out':
        try {
          viewAndRestoreJobWorkOutItem(JSON.parse(props.item.data));
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Work Order Receipt':
        try {
          viewAndRestoreJobWorkReceiptItem(JSON.parse(props.item.data));
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      default:
        return null;
    }
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreVert fontSize="inherit" />
      </IconButton>

      <Menu
        id="moremenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem key={1} onClick={() => viewAndRestore()}>
          View & Restore{' '}
        </MenuItem>
      </Menu>
    </div>
  );
}

export default injectWithObserver(Moreoptions);