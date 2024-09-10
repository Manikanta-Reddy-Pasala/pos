import React, { useRef, useEffect, useState } from 'react';
import ReactToPrint from 'react-to-print';
import InvoiceRegularPrint from './invoiceRegular';
import ReceiptPrint from './receipt';
import { toJS } from 'mobx';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import ApprovalRegularPrintContent from './approval/ApprovalRegularPrintContent';
import OrderReceiptRegularPrint from './jobWorks/OrderReceiptRegularPrint';
import OrderInvoiceRegularPrint from './jobWorks/OrderInvoiceRegularPrint';
import InvoiceThermalPrintView from './invoiceThermalView';
import '../ComponentsToPrint/printerpage.css';
import * as Db from '../../../RxDb/Database/Database';
import * as Bd from '../../../components/SelectedBusiness';
import SchemeManagementRegularPrint from './scheme/SchemeManagementRegularPrint';
import SessionGroupRegularPrint from './SessionGroupRegularPrint';

const ComponentToPrint = (props) => {
  let componentRef = useRef();
  const store = useStore();
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { getSalesTransSettingdetails } = store.SalesTransSettingsStore;
  const { salesTransSettingData } = toJS(store.SalesTransSettingsStore);
  const { getApprovalTransSettingdetails } =
    store.ApprovalTransactionSettingsStore;

  const { approvalTransSettingData } = toJS(
    store.ApprovalTransactionSettingsStore
  );
  const { getJobWorkInTransSettingdetails } =
    store.JobWorkInTransactionSettingsStore;

  const { jobWorkInTransSettingData } = toJS(
    store.JobWorkInTransactionSettingsStore
  );

  const { getPurchaseTransSettingdetails } = store.PurchaseTransSettingsStore;

  const { purchaseTransSettingData } = toJS(store.PurchaseTransSettingsStore);

  const { getPurchaseOrderTransSettingdetails } =
    store.PurchaseOrderTransSettingsStore;

  const { purchaseOrderTransSettingData } = toJS(
    store.PurchaseOrderTransSettingsStore
  );

  const { getDeliveryChallanTransSettingdetails } =
    store.DeliveryChallanTransactionSettingsStore;

  const { deliveryChallanTransSettingData } = toJS(
    store.DeliveryChallanTransactionSettingsStore
  );

  const { getSaleOrderTransSettingdetails } =
    store.SaleOrderTransactionSettingsStore;

  const { saleOrderTransSettingData } = toJS(
    store.SaleOrderTransactionSettingsStore
  );

  const { getSaleQuotationTransSettingdetails } =
    store.SaleQuotationTransactionSettingsStore;

  const { saleQuotationTransSettingData } = toJS(
    store.SaleQuotationTransactionSettingsStore
  );

  const { getPaymentInTransSettingdetails } = store.PaymentInTransSettingsStore;

  const { paymentInTransSettingData } = toJS(store.PaymentInTransSettingsStore);

  const { getPaymentOutTransSettingdetails } =
    store.PaymentOutTransSettingsStore;

  const { paymentOutTransSettingData } = toJS(
    store.PaymentOutTransSettingsStore
  );

  const { auditSettings } = toJS(store.AuditSettingsStore);
  const { getAuditSettingsData } = store.AuditSettingsStore;

  const { taxSettingsData } = toJS(store.TaxSettingsStore);

  const [balance, setBalance] = useState();
  const [listOfPaymentInData, setListOfPaymentInData] = useState([]);

  useEffect(() => {
    getSalesTransSettingdetails();
  }, [getSalesTransSettingdetails]);

  useEffect(() => {
    getApprovalTransSettingdetails();
  }, [getApprovalTransSettingdetails]);

  useEffect(() => {
    getJobWorkInTransSettingdetails();
  }, [getJobWorkInTransSettingdetails]);

  useEffect(() => {
    getPurchaseTransSettingdetails();
  }, [getPurchaseTransSettingdetails]);

  useEffect(() => {
    getPurchaseOrderTransSettingdetails();
  }, [getPurchaseOrderTransSettingdetails]);

  useEffect(() => {
    getDeliveryChallanTransSettingdetails();
  }, [getDeliveryChallanTransSettingdetails]);

  useEffect(() => {
    getSaleOrderTransSettingdetails();
  }, [getSaleOrderTransSettingdetails]);

  useEffect(() => {
    getSaleQuotationTransSettingdetails();
  }, [getSaleQuotationTransSettingdetails]);

  useEffect(() => {
    getPaymentInTransSettingdetails();
  }, [getPaymentInTransSettingdetails]);

  useEffect(() => {
    getPaymentOutTransSettingdetails();
  }, [getPaymentOutTransSettingdetails]);

  useEffect(() => {
    getAuditSettingsData();
  }, [getAuditSettingsData]);

  useEffect(() => {
    console.log('props.customPrintOptions', props.customPrintOptions);
    const loadData = async () => {
      let partyId =
        props.data.customer_id ||
        props.data.vendor_id ||
        props.data.customerId ||
        props.data.vendorId;

      if (partyId !== undefined) {
        if (partyId !== undefined) {
          await getCustomerBalance(partyId);
        }

        setListOfPaymentInData([]);

        if (
          props.data.receiptNumber &&
          props.data.linkedTxnList &&
          props.data.linkedTxnList.length > 0
        ) {
          if (props.data.paymentOut === true) {
            let list = [];
            for (let linkedTxn of props.data.linkedTxnList) {
              let tableName = '';
              switch (linkedTxn.paymentType) {
                case 'Payment In':
                  tableName = 'paymentin';
                  break;
                case 'Sales Return':
                  tableName = 'salesreturn';
                  break;
                case 'Purchases':
                  tableName = 'purchases';
                  break;
                case 'Opening Payable Balance':
                  tableName = 'alltransactions';
                  break;
                default:
                  return null;
              }

              if (tableName !== null) {
                const response = await getLinkedData(
                  linkedTxn.linkedId,
                  tableName
                );
                linkedTxn.splitPaymentList = response.splitPaymentList;
                if ('Payment In' === linkedTxn.paymentType) {
                  linkedTxn.paymentType = response.paymentType;
                  linkedTxn.total = response.total;
                } else if ('Sales Return' === linkedTxn.paymentType) {
                  linkedTxn.paymentType = 'Sales Return';
                  linkedTxn.total = response.total_amount;
                } else if ('Purchases' === linkedTxn.paymentType) {
                  linkedTxn.paymentType = 'Purchases';
                  linkedTxn.total = response.total_amount;
                } else if (
                  'Opening Payable Balance' === linkedTxn.paymentType
                ) {
                  linkedTxn.paymentType = 'Opening Balance';
                  linkedTxn.total = response.amount;
                }

                list.push(linkedTxn);
              }
            }
            setListOfPaymentInData(list);
          } else if (props.data.paymentIn === true) {
            let list = [];
            for (let linkedTxn of props.data.linkedTxnList) {
              let tableName = '';
              switch (linkedTxn.paymentType) {
                case 'Payment Out':
                  tableName = 'paymentout';
                  break;
                case 'Sales':
                  tableName = 'sales';
                  break;
                case 'KOT':
                  tableName = 'sales';
                  break;
                case 'Purchases Return':
                  tableName = 'purchasesreturn';
                  break;
                case 'Opening Receivable Balance':
                  tableName = 'alltransactions';
                  break;
                default:
                  return null;
              }

              if (tableName !== null) {
                const response = await getLinkedData(
                  linkedTxn.linkedId,
                  tableName
                );
                linkedTxn.splitPaymentList = response.splitPaymentList;
                if ('Payment Out' === linkedTxn.paymentType) {
                  linkedTxn.paymentType = response.paymentType;
                  linkedTxn.total = response.total;
                } else if ('Sales' === linkedTxn.paymentType) {
                  linkedTxn.paymentType = 'Sales';
                  linkedTxn.total = response.total_amount;
                } else if ('Purchases Return' === linkedTxn.paymentType) {
                  linkedTxn.paymentType = 'Purchases Return';
                  linkedTxn.total = response.total_amount;
                } else if (
                  'Opening Receivable Balance' === linkedTxn.paymentType
                ) {
                  linkedTxn.paymentType = 'Opening Balance';
                  linkedTxn.total = response.amount;
                }

                list.push(linkedTxn);
              }
            }
            setListOfPaymentInData(list);
          }
        } else if (
          props.data.sales_return_number &&
          props.data.linkedTxnList &&
          props.data.linkedTxnList.length > 0
        ) {
          let list = [];
          for (let linkedTxn of props.data.linkedTxnList) {
            console.log('Sales Return linked transaction', linkedTxn);
            let tableName = '';
            switch (linkedTxn.paymentType) {
              case 'Payment Out':
                tableName = 'paymentout';
                break;
              case 'Sales':
                tableName = 'sales';
                break;
              case 'Purchases Return':
                tableName = 'purchasesreturn';
                break;
              case 'Opening Receivable Balance':
                tableName = 'alltransactions';
                break;
              default:
                return null;
            }

            if (tableName !== null) {
              const response = await getLinkedData(
                linkedTxn.linkedId,
                tableName
              );
              linkedTxn.splitPaymentList = response.splitPaymentList;
              if ('Payment Out' === linkedTxn.paymentType) {
                linkedTxn.paymentType = response.paymentType;
                linkedTxn.total = response.total;
              } else if ('Sales' === linkedTxn.paymentType) {
                linkedTxn.paymentType = 'Sales';
                linkedTxn.total = response.total_amount;
              } else if ('Purchases Return' === linkedTxn.paymentType) {
                linkedTxn.paymentType = 'Purchases Return';
                linkedTxn.total = response.total_amount;
              } else if (
                'Opening Receivable Balance' === linkedTxn.paymentType
              ) {
                linkedTxn.paymentType = 'Opening Balance';
                linkedTxn.total = response.amount;
              }

              list.push(linkedTxn);
            }
          }
          setListOfPaymentInData(list);
        } else if (
          props.data.purchase_return_number &&
          props.data.linkedTxnList &&
          props.data.linkedTxnList.length > 0
        ) {
          let list = [];
          for (const linkedTxn of props.data.linkedTxnList) {
            console.log('Purchase Return linked transaction', linkedTxn);
            let tableName = '';
            switch (linkedTxn.paymentType) {
              case 'Payment In':
                tableName = 'paymentin';
                break;
              case 'Sales Return':
                tableName = 'salesreturn';
                break;
              case 'Purchases':
                tableName = 'purchases';
                break;
              case 'Opening Payable Balance':
                tableName = 'alltransactions';
                break;
              default:
                return null;
            }

            if (tableName !== null) {
              const response = await getLinkedData(
                linkedTxn.linkedId,
                tableName
              );
              linkedTxn.splitPaymentList = response.splitPaymentList;
              if ('Payment In' === linkedTxn.paymentType) {
                linkedTxn.paymentType = response.paymentType;
                linkedTxn.total = response.total;
              } else if ('Sales Return' === linkedTxn.paymentType) {
                linkedTxn.paymentType = 'Sales Return';
                linkedTxn.total = response.total_amount;
              } else if ('Purchases' === linkedTxn.paymentType) {
                linkedTxn.paymentType = 'Purchases';
                linkedTxn.total = response.total_amount;
              } else if ('Opening Payable Balance' === linkedTxn.paymentType) {
                linkedTxn.paymentType = 'Opening Balance';
                linkedTxn.total = response.amount;
              }

              list.push(linkedTxn);
            }
          }
          setListOfPaymentInData(list);
        } else if (
          props.data.id &&
          props.isScheme === true &&
          props.data.linkedTxnList &&
          props.data.linkedTxnList.length > 0
        ) {
          let list = [];
          for (let linkedTxn of props.data.linkedTxnList) {
            let tableName = '';
            switch (linkedTxn.paymentType) {
              case 'Payment In':
                tableName = 'paymentin';
                break;
              case 'Sales Return':
                tableName = 'salesreturn';
                break;
              case 'Purchases':
                tableName = 'purchases';
                break;
              case 'Opening Payable Balance':
                tableName = 'alltransactions';
                break;
              default:
                return null;
            }

            if (tableName !== null) {
              const response = await getLinkedData(
                linkedTxn.linkedId,
                tableName
              );
              linkedTxn.splitPaymentList = response.splitPaymentList;
              if ('Payment In' === linkedTxn.paymentType) {
                linkedTxn.paymentType = response.paymentType;
                linkedTxn.total = response.total;
              } else if ('Sales Return' === linkedTxn.paymentType) {
                linkedTxn.paymentType = 'Sales Return';
                linkedTxn.total = response.total_amount;
              } else if ('Purchases' === linkedTxn.paymentType) {
                linkedTxn.paymentType = 'Purchases';
                linkedTxn.total = response.total_amount;
              } else if ('Opening Payable Balance' === linkedTxn.paymentType) {
                linkedTxn.paymentType = 'Opening Balance';
                linkedTxn.total = response.amount;
              }

              list.push(linkedTxn);
            }
          }
          setListOfPaymentInData(list);
        } else if (
          props.data.sequenceNumber &&
          props.data.linkedTxnList &&
          props.data.linkedTxnList.length > 0
        ) {
          let list = [];
          for (let linkedTxn of props.data.linkedTxnList) {
            let tableName = '';
            switch (linkedTxn.paymentType) {
              case 'Payment In':
                tableName = 'paymentin';
                break;
              case 'Sales Return':
                tableName = 'salesreturn';
                break;
              case 'Purchases':
                tableName = 'purchases';
                break;
              case 'Opening Payable Balance':
                tableName = 'alltransactions';
                break;
              default:
                return null;
            }

            if (tableName !== null) {
              const response = await getLinkedData(
                linkedTxn.linkedId,
                tableName
              );
              linkedTxn.splitPaymentList = response.splitPaymentList;
              if ('Payment In' === linkedTxn.paymentType) {
                linkedTxn.paymentType = response.paymentType;
                linkedTxn.total = response.total;
              } else if ('Sales Return' === linkedTxn.paymentType) {
                linkedTxn.paymentType = 'Sales Return';
                linkedTxn.total = response.total_amount;
              } else if ('Purchases' === linkedTxn.paymentType) {
                linkedTxn.paymentType = 'Purchases';
                linkedTxn.total = response.total_amount;
              } else if ('Opening Payable Balance' === linkedTxn.paymentType) {
                linkedTxn.paymentType = 'Opening Balance';
                linkedTxn.total = response.amount;
              }

              list.push(linkedTxn);
            }
          }
          setListOfPaymentInData(list);
        } else if (
          props.data.bill_number &&
          props.data.linkedTxnList &&
          props.data.linkedTxnList.length > 0
        ) {
          let list = [];
          for (let linkedTxn of props.data.linkedTxnList) {
            let tableName = '';
            switch (linkedTxn.paymentType) {
              case 'Payment Out':
                tableName = 'paymentout';
                break;
              case 'Sales':
                tableName = 'sales';
                break;
              case 'Purchases Return':
                tableName = 'purchasesreturn';
                break;
              case 'Opening Receivable Balance':
                tableName = 'alltransactions';
                break;
              default:
                return null;
            }

            if (tableName !== null) {
              const response = await getLinkedData(
                linkedTxn.linkedId,
                tableName
              );
              linkedTxn.splitPaymentList = response.splitPaymentList;
              if ('Payment Out' === linkedTxn.paymentType) {
                linkedTxn.paymentType = response.paymentType;
                linkedTxn.total = response.total;
              } else if ('Sales' === linkedTxn.paymentType) {
                linkedTxn.paymentType = 'Sales';
                linkedTxn.total = response.total_amount;
              } else if ('Purchases Return' === linkedTxn.paymentType) {
                linkedTxn.paymentType = 'Purchases Return';
                linkedTxn.total = response.total_amount;
              } else if (
                'Opening Receivable Balance' === linkedTxn.paymentType
              ) {
                linkedTxn.paymentType = 'Opening Balance';
                linkedTxn.total = response.amount;
              }

              list.push(linkedTxn);
            }
          }
          setListOfPaymentInData(list);
        }

        if (props.printMe) {
          if (document.getElementById('print-button')) {
            document.getElementById('print-button').click();
          }
        }
      } else {
        if (props.printMe) {
          setTimeout(() => {
            if (document.getElementById('print-button')) {
              document.getElementById('print-button').click();
            }
          }, 500);
        }
      }
    };
    loadData();
  }, []);

  const getCustomerBalance = async (partyId) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const balanceData = {
      totalBalance: 0,
      balanceType: ''
    };

    await db.parties
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: partyId } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          setBalance(balanceData);
          return;
        }

        balanceData.totalBalance = data.balance;
        balanceData.balanceType = data.balanceType;

        setBalance(balanceData);
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
        setBalance(balanceData);
      });
  };

  const getLinkedData = async (id, table) => {
    const db = await Db.get();
    const businessId = localStorage.getItem('businessId');

    let response = {};

    if (table === 'paymentin' || table === 'paymentout') {
      await db[table]
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessId } },
              { receiptNumber: { $eq: id } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    } else if (table === 'salesreturn') {
      await db[table]
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessId } },
              { sales_return_number: { $eq: id } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    } else if (table === 'sales') {
      await db[table]
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessId } },
              { invoice_number: { $eq: id } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    } else if (table === 'purchases') {
      await db[table]
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessId } },
              { bill_number: { $eq: id } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    } else if (table === 'purchasesreturn') {
      await db[table]
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessId } },
              { purchase_return_number: { $eq: id } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    } else if (table === 'alltransactions') {
      await db[table]
        .findOne({
          selector: {
            $and: [{ businessId: { $eq: businessId } }, { id: { $eq: id } }]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    }

    return response;
  };

  return (
    <div style={{ breakAfter: 'auto' }}>
      <ReactToPrint
        pageStyle={
          invoiceRegular.headerSpace || invoiceRegular.footerSpace
            ? '@page { size:' +
              invoiceRegular.ddlPageSize +
              '; margin-top:' +
              invoiceRegular.headerSize +
              invoiceRegular.headerUnit +
              '; margin-bottom: ' +
              invoiceRegular.footerSize +
              invoiceRegular.footerUnit +
              '}'
            : '@page { size:' + invoiceRegular.ddlPageSize + ' }'
        }
        trigger={() => (
          <button id="print-button" style={{ display: 'none' }}></button>
        )}
        content={() => componentRef.current}
      />

      {props.isThermal ? (
        <InvoiceThermalPrintView
          data={props.data}
          settings={invoiceThermal}
          auditSettings={auditSettings}
          balanceData={balance}
          ref={componentRef}
        />
      ) : (
        <>
          {props.isJobWork ? (
            props.isOrderInvoice ? (
              <OrderInvoiceRegularPrint
                data={props.data}
                customPrintOptions={props.customPrintOptions}
                settings={invoiceRegular}
                auditSettings={auditSettings}
                balanceData={balance}
                ref={componentRef}
              />
            ) : (
              <OrderReceiptRegularPrint
                data={props.data}
                settings={invoiceRegular}
                customPrintOptions={props.customPrintOptions}
                auditSettings={auditSettings}
                balanceData={balance}
                ref={componentRef}
              />
            )
          ) : props.data.receiptNumber ? (
            <ReceiptPrint
              data={props.data}
              settings={invoiceRegular}
              customPrintOptions={props.customPrintOptions}
              auditSettings={auditSettings}
              balanceData={balance}
              ref={componentRef}
              linkedPaymentsData={listOfPaymentInData}
              TxnSettings={
                props.data.paymentOut === true
                  ? paymentOutTransSettingData
                  : paymentInTransSettingData
              }
            />
          ) : props.data.approvalNumber ? (
            <ApprovalRegularPrintContent
              data={props.data}
              customPrintOptions={props.customPrintOptions}
              auditSettings={auditSettings}
              settings={invoiceRegular}
              balanceData={balance}
              ref={componentRef}
              approvalTxnSettings={approvalTransSettingData}
            />
          ) : props.isScheme ? (
            <SchemeManagementRegularPrint
              data={props.data}
              customPrintOptions={props.customPrintOptions}
              auditSettings={auditSettings}
              settings={invoiceRegular}
              balanceData={balance}
              linkedPaymentsData={listOfPaymentInData}
              ref={componentRef}
            />
          ) : props.isSession ? (
            <SessionGroupRegularPrint
              data={props.data}
              customPrintOptions={props.customPrintOptions}
              auditSettings={auditSettings}
              settings={invoiceRegular}
              balanceData={balance}
              linkedPaymentsData={listOfPaymentInData}
              ref={componentRef}
            />
          ) : (
            <InvoiceRegularPrint
              data={props.data}
              customPrintOptions={props.customPrintOptions}
              auditSettings={auditSettings}
              settings={invoiceRegular}
              balanceData={balance}
              linkedPaymentsData={listOfPaymentInData}
              ref={componentRef}
              isPackagePreivew={props?.isPackagePreivew}
              taxSettingsData={taxSettingsData}
              TxnSettings={
                props.data.job_work_in_invoice_number
                  ? jobWorkInTransSettingData
                  : props.data.bill_number ||
                    props.data.backToBackPurchaseNumber
                  ? purchaseTransSettingData
                  : props.data.purchase_order_invoice_number
                  ? purchaseOrderTransSettingData
                  : props.data.delivery_challan_invoice_number
                  ? deliveryChallanTransSettingData
                  : props.data.sale_order_invoice_number
                  ? saleOrderTransSettingData
                  : props.data.estimateType === 'open' ||
                    props.data.estimateType === 'close'
                  ? saleQuotationTransSettingData
                  : salesTransSettingData
              }
            />
          )}
        </>
      )}
    </div>
  );
};
export default InjectObserver(ComponentToPrint);
