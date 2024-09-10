import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React, { useEffect } from 'react';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import ConfirmModal from './modal/ConfirmModal';
import * as Db from '../RxDb/Database/Database';
import * as Bd from '../components/SelectedBusiness';
import * as dateHelper from '../components/Helpers/DateHelper';

function Moreoptions(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [restoreNotPossibleModal, setRestoreNotPossibleModal] =
    React.useState(false);

  const store = useStore();
  const { deleteDataPermanently } = store.RetrieveDeletedDataStore;

  const { viewAndRestoreSaleItem, restoreSaleItem } = store.SalesAddStore;
  const { viewAndRestoreSaleQuotationItem, restoreSaleQuotationItem } =
    store.SalesQuotationAddStore;
  const { viewAndRestoreSaleOrderItem, restoreSaleOrderItem } =
    store.SaleOrderStore;
  const { viewAndRestoreDeliveryChallanItem, restoreDeliveryChallanItem } =
    store.DeliveryChallanStore;
  const { viewAndRestoreApprovalItem, restoreApprovalItem } =
    store.ApprovalsStore;
  const { viewAndRestoreSaleReturnItem, restoreSaleReturnItem } =
    store.ReturnsAddStore;
  const { viewAndRestorePurchaseItem, restorePurchaseItem } =
    store.PurchasesAddStore;
  const { viewAndRestorePurchaseReturnItem, restorePurchaseReturnItem } =
    store.PurchasesReturnsAddStore;
  const { viewAndRestorePurchaseOrderItem, restorePurchaseOrderItem } =
    store.PurchaseOrderStore;
  const { viewAndRestoreJobWorkInItem, restoreJobWorkInItem } =
    store.JobWorkInStore;
  const { viewAndRestoreJobWorkOutItem, restoreJobWorkOutItem } =
    store.JobWorkStore;
  const { viewAndRestorePaymentIn, restorePaymentIn } = store.PaymentInStore;
  const { viewAndRestoreJobWorkReceiptItem, restoreJobWorkReceiptItem } =
    store.JobWorkReceiptStore;
  const { viewAndRestorePaymentOut, restorePaymentOut } = store.PaymentOutStore;
  const { viewAndRestoreExpenseItem, restoreExpenseItem } = store.ExpensesStore;
  const { viewAndRestoreProcurementItem, restoreProcurementItem } =
    store.BackToBackPurchaseStore;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlesetRestoreNotPossibleModalClose = () => {
    setRestoreNotPossibleModal(false);
  };

  const handlesetRestoreNotPossibleModalCloseWithSettingNewNo = async () => {
    setRestoreNotPossibleModal(false);
    switch (props.item.transactionType) {
      case 'Sales':
        try {
          restoreSaleItem(JSON.parse(props.item.data), true);
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Payment In':
        try {
          restorePaymentIn(JSON.parse(props.item.data), true);
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Sales Quotation':
        try {
          restoreSaleQuotationItem(JSON.parse(props.item.data), true);
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Sale Order':
        try {
          restoreSaleOrderItem(JSON.parse(props.item.data), true);
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Delivery Challan':
        try {
          restoreDeliveryChallanItem(JSON.parse(props.item.data), true);
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Approval':
        try {
          restoreApprovalItem(JSON.parse(props.item.data), true);
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Purchases':
        try {
          restorePurchaseItem(JSON.parse(props.item.data), true);
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Purchase Order':
        try {
          restorePurchaseOrderItem(JSON.parse(props.item.data), true);
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Payment Out':
        try {
          restorePaymentOut(JSON.parse(props.item.data), true);
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Purchases Return':
        try {
          restorePurchaseReturnItem(JSON.parse(props.item.data), true);
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Expenses':
        try {
          restoreExpenseItem(JSON.parse(props.item.data), true);
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Procurement':
      case 'Back To Back Purchase':
        try {
          restoreProcurementItem(JSON.parse(props.item.data), true);
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Job Work Order - In':
        try {
          restoreJobWorkInItem(JSON.parse(props.item.data), true);
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Job Work Order - Out':
        try {
          restoreJobWorkOutItem(JSON.parse(props.item.data), true);
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      case 'Work Order Receipt':
        try {
          restoreJobWorkReceiptItem(JSON.parse(props.item.data), true);
        } catch (e) {
          console.error(' Error: ', e.message);
        }
        break;
      default:
        return null;
    }
  };

  const deleteItem = () => {
    setIsOpenConfirmModal(true);
  };

  const confirmDeleteItem = async (confirm) => {
    if (confirm) {
      await deleteDataPermanently(props.item);
      setIsOpenConfirmModal(false);
      setAnchorEl(null);
    }
  };

  const restoreItem = async () => {
    let query;
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    switch (props.item.transactionType) {
      case 'Sales':
        let data = JSON.parse(props.item.data);
        query = db.sales.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $eq: props.item.sequenceNumber } },
              {
                invoice_date: {
                  $gte: dateHelper.getFinancialYearStartDateByGivenDate(
                    data.invoice_date
                  )
                }
              },
              {
                invoice_date: {
                  $lte: dateHelper.getFinancialYearEndDateByGivenDate(
                    data.invoice_date
                  )
                }
              }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (data) {
              setRestoreNotPossibleModal(true);
            } else {
              try {
                restoreSaleItem(JSON.parse(props.item.data), false);
              } catch (e) {
                console.error(' Error: ', e.message);
              }
            }
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
        break;
      case 'Payment In':
        query = db.paymentin.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $eq: props.item.sequenceNumber } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (data) {
              setRestoreNotPossibleModal(true);
            } else {
              try {
                restorePaymentIn(JSON.parse(props.item.data), false);
              } catch (e) {
                console.error(' Error: ', e.message);
              }
            }
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
        break;
      case 'Sales Return':
        query = db.salesreturn.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $eq: props.item.sequenceNumber } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (data) {
              // do nothing
              console.log(data);
            } else {
              try {
                restoreSaleReturnItem(JSON.parse(props.item.data), false);
              } catch (e) {
                console.error(' Error: ', e.message);
              }
            }
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
        break;
      case 'Sales Quotation':
        query = db.salesquotation.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $eq: props.item.sequenceNumber } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (data) {
              setRestoreNotPossibleModal(true);
            } else {
              try {
                restoreSaleQuotationItem(JSON.parse(props.item.data), false);
              } catch (e) {
                console.error(' Error: ', e.message);
              }
            }
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
        break;
      case 'Sale Order':
        query = db.saleorder.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $eq: props.item.sequenceNumber } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (data) {
              setRestoreNotPossibleModal(true);
            } else {
              try {
                restoreSaleOrderItem(JSON.parse(props.item.data), false);
              } catch (e) {
                console.error(' Error: ', e.message);
              }
            }
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
        break;
      case 'Delivery Challan':
        query = db.deliverychallan.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $eq: props.item.sequenceNumber } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (data) {
              setRestoreNotPossibleModal(true);
            } else {
              try {
                restoreDeliveryChallanItem(JSON.parse(props.item.data), false);
              } catch (e) {
                console.error(' Error: ', e.message);
              }
            }
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
        break;
      case 'Approval':
        query = db.approvals.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $eq: props.item.sequenceNumber } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (data) {
              setRestoreNotPossibleModal(true);
            } else {
              try {
                restoreApprovalItem(JSON.parse(props.item.data), false);
              } catch (e) {
                console.error(' Error: ', e.message);
              }
            }
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
        break;
      case 'Purchases':
        query = db.purchases.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { bill_number: { $eq: props.item.transactionId } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (data) {
              // Do nothing
            } else {
              try {
                restorePurchaseItem(JSON.parse(props.item.data), false);
              } catch (e) {
                console.error(' Error: ', e.message);
              }
            }
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
        break;
      case 'Purchase Order':
        query = db.purchaseorder.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $eq: props.item.sequenceNumber } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (data) {
              setRestoreNotPossibleModal(true);
            } else {
              try {
                restorePurchaseOrderItem(JSON.parse(props.item.data), false);
              } catch (e) {
                console.error(' Error: ', e.message);
              }
            }
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
        break;
      case 'Payment Out':
        query = db.paymentout.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { receiptNumber: { $eq: props.item.transactionId } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (data) {
              setRestoreNotPossibleModal(true);
            } else {
              try {
                restorePaymentOut(JSON.parse(props.item.data), false);
              } catch (e) {
                console.error(' Error: ', e.message);
              }
            }
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
        break;
      case 'Purchases Return':
        query = db.purchasesreturn.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { purchase_return_number: { $eq: props.item.transactionId } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (data) {
              // do nothing
            } else {
              try {
                restorePurchaseReturnItem(JSON.parse(props.item.data), false);
              } catch (e) {
                console.error(' Error: ', e.message);
              }
            }
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
        break;
      case 'Expenses':
        query = db.expenses.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { expenseId: { $eq: props.item.transactionId } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (data) {
              // Do nothing
            } else {
              try {
                restoreExpenseItem(JSON.parse(props.item.data), false);
              } catch (e) {
                console.error(' Error: ', e.message);
              }
            }
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
        break;
      case 'Procurement':
      case 'Back To Back Purchase':
        query = db.backtobackpurchases.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { backToBackPurchaseNumber: { $eq: props.item.transactionId } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (data) {
              // Do nothing
            } else {
              try {
                restoreProcurementItem(JSON.parse(props.item.data), false);
              } catch (e) {
                console.error(' Error: ', e.message);
              }
            }
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
        break;
      case 'Job Work Order - In':
        query = db.jobworkin.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $eq: props.item.sequenceNumber } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (data) {
              setRestoreNotPossibleModal(true);
            } else {
              try {
                restoreJobWorkInItem(JSON.parse(props.item.data), false);
              } catch (e) {
                console.error(' Error: ', e.message);
              }
            }
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
        break;
      case 'Job Work Order - Out':
        query = db.jobwork.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { invoiceSequenceNumber: { $eq: props.item.sequenceNumber } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (data) {
              setRestoreNotPossibleModal(true);
            } else {
              try {
                restoreJobWorkOutItem(JSON.parse(props.item.data), false);
              } catch (e) {
                console.error(' Error: ', e.message);
              }
            }
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
        break;
      case 'Work Order Receipt':
        query = db.jobworkreceipt.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { receiptSequenceNumber: { $eq: props.item.sequenceNumber } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (data) {
              setRestoreNotPossibleModal(true);
            } else {
              try {
                restoreJobWorkReceiptItem(JSON.parse(props.item.data), false);
              } catch (e) {
                console.error(' Error: ', e.message);
              }
            }
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
        break;
      default:
        return null;
    }
  };

  const viewAndRestore = async () => {
    console.log('view & restore clicked', JSON.parse(props.item.data));
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
      case 'Procurement':
      case 'Back To Back Purchase':
        try {
          viewAndRestoreProcurementItem(JSON.parse(props.item.data));
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

      {isOpenConfirmModal ? (
        <ConfirmModal
          open={isOpenConfirmModal}
          onConfirm={(isConfirm) => confirmDeleteItem(isConfirm)}
          onClose={() => setIsOpenConfirmModal(false)}
        />
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
        <MenuItem key={1} onClick={() => viewAndRestore()}>
          View & Restore{' '}
        </MenuItem>

        <MenuItem key={2} onClick={() => restoreItem(props.item)}>
          Restore{' '}
        </MenuItem>

        <MenuItem key={4} onClick={() => deleteItem()}>
          Delete Permanently{' '}
        </MenuItem>
      </Menu>

      <Dialog
        fullScreen={fullScreen}
        open={restoreNotPossibleModal}
        onClose={handlesetRestoreNotPossibleModalClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>Restore Alert!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sorry! Invoice cannot be restored because other invoice exists with
            same number. Please use Restore New option with available sequence
            number
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handlesetRestoreNotPossibleModalCloseWithSettingNewNo}
            color="primary"
            autoFocus
          >
            Restore with next sequence
          </Button>
          <Button
            onClick={handlesetRestoreNotPossibleModalClose}
            color="primary"
            autoFocus
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default injectWithObserver(Moreoptions);