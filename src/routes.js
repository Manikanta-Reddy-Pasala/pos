import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';

import AccountView from '../src/views/account/AccountView';
import CustomerListView from '../src/views/customer/CustomerListView';
import DashboardView from '../src/views/dashboard';
import NotFoundView from '../src/views/errors/NotFoundView';
import ProductListView from '../src/views/product/ProductListView';

import Allinvoice from '../src/views/sales/SalesInvoices';
import PaymentIn from '../src/views/sales/PaymentIn/index';
import Login from './views/auth/login';
import BusinessList from './views/business/BusinessList';
import SalesReturnCredit from './views/sales/SalesReturn';
import Approval from '../src/views/sales/Approval';
import Expenses from './views/Expenses';
import Customers from './views/customers';
import Vendors from './views/Vendors';

import InvoicePrint from './views/Printers/Invoice';
import BarcodePrint from './views/Printers/Barcode';
import TransactionPrint from './views/Printers/Transaction';

import Purchases from '../src/views/purchases/PurchaseBill';
import PaymentOut from './views/purchases/PaymentOut/index';
import PurchaseReturn from '../src/views/purchases/PurchaseReturn';

import BackupAndRestore from './views/BackupAndRestore';

import Reports from './views/Reports/Reports';

import ExcelUpload from './views/product/ExcelUpload/ExcelUpload';

import Barcode from './views/BarcodePrinter/Barcode';
import KOT from './views/KOT';
import UpdateApp from './views/UpdateApp';

import AboutUs from './views/auth/aboutUs';
import FAQ from './views/auth/faq';
import TaxSettings from './views/Settings/Tax_gst_Settings/tax_setting';
import TransactionSettings from './views/Settings/Transaction/index';
import SalesSettings from 'src/views/Settings/Sales_Transaction/sales_settings';
import WhatsAppSettings from 'src/views/Settings/WhatsApp_Settings/WhatsAppSettings';
import EmployeeView from './views/Employee/index';
import SpecialDaysManagement from './views/TempleCustomizations/SpecialDaysManagement/SpecialDaysManagement';
import CustomerSpecialDaysReport from './views/TempleCustomizations/CustomerSpecialDaysReport/CustomerSpecialDaysReport';

import OrderInvoice from './views/JobWork/OrderInvoice';
import OrderReceipt from './views/JobWork/OrderReceipt';
import JobWorkIn from './views/JobWork/OrderIn';

import ApprovalTransactionSettings from './views/Settings/Approval_Transaction/ApprovalTransactions';
import SalesQuotation from './views/sales/SalesQuotation';
import UserManagement from './views/Settings/userManagement';
import SchemeManagement from './views/SchemeManagement';
import JobWorkInSettings from './views/Settings/JobWorkIn_Transaction/jobworkin_setting';
import PurchaseSettings from './views/Settings/Purchase_Transaction/purchase_settings';
import PurchaseOrderSettings from './views/Settings/Purchase_Order_Transaction/purchase_order_settings';
import DeliveryChallan from './views/sales/DeliveryChallan';
import DeliveryChallanSettings from './views/Settings/Delivery_Challan_Transaction/delivery_challan_setting';
import PurchaseOrder from './views/purchases/PurchaseOrder';
import SaleOrderSettings from './views/Settings/Sale_Order_Transaction/sale_order_settings';
import SaleOrder from './views/sales/SaleOrder';
import CustomerExcelUpload from './views/customers/ImportAndExport/CustomerExcelUpload';
import DashboardExcelUpload from './views/product/ExcelUpload/DashboardExcelUpload';
import DashboardCustomerExcelUpload from './views/customers/ImportAndExport/DashboardCustomerExcelUpload';
import DashboardVendorExcelUpload from './views/Vendors/ImportAndExport/DashboardVendorExcelUpload';
import VendorExcelUpload from './views/Vendors/ImportAndExport/VendorExcelUpload';
import SaleQuotationSettings from './views/Settings/Sale_Quotation_Transaction/sale_quotation_settings';
import CloseFinancialYear from './views/CloseFinancialYear';
import RetrieveDeletedData from './views/RetrieveDeletedData';
import Eway from './views/EWay';
import ExpenseSetting from './views/Settings/Expense_Transaction/expense_setting';
import Rate from './views/Rates';
import EInvoice from './views/EInvoice';
import Manufacture from './views/Manufacture';
import TCS from './views/Settings/TCS';
import Warehouse from './views/Warehouse';
import AddOns from './views/AddOns';
import CloudPrintSettings from './views/Settings/Cloud_Print_Settings/cloud_print_setting';
import GeneralTransaction from './views/Settings/General_Transaction/GeneralTransaction';
import ManufacturingDirectExpenses from './views/ManufacturingDirectExpenses';
import ProductSettings from './views/Settings/Product_Transaction/product_settings';
import TDS from './views/Settings/TDS';
import SplitPaymentSettings from './views/Settings/Split_Payment_Transaction/split_payment_settings';
import PaymentInSettings from './views/Settings/PaymentIn_Transaction/payment_in_settings';
import PaymentOutSettings from './views/Settings/PaymentOut_Transaction/payment_out_settings';
import FailedInvoices from './views/FailedInvoices';
import CancelledInvoices from './views/CancelledInvoices';
import KotSettings from './views/Settings/KOT_Transaction/kot_settings';
import MultiDeviceSettings from './views/Settings/Multi_device_Settings/multi_device_settings';
import AddStock from './views/StockManagement/AddStock';
import RemoveStock from './views/StockManagement/RemoveStock';
import DamagedStock from './views/StockManagement/DamagedStock';
import StockDetails from './views/StockManagement/StockDetails';
import Tally from './views/ThirdPartyExport/Tally';
import BankAccountView from './views/Cash&Bank/Bank';
import Cheque from './views/Cash&Bank/Cheque';
import BackToBackPurchase from './views/purchases/BackToBackPurchase';
import AuditSettings from './views/Settings/Audit/AuditSettings';
import RawMaterialList from './views/RawMaterials';
import AuditReports from './views/AuditReports/AuditReports';
import AccountingNotes from './views/AccountingNotes';
import ReminderSettings from './views/Settings/Reminder_Settings/ReminderSettings';
import SchemeManagementTypes from './views/SchemeManagementTypes';
import GSTR1 from './views/Reports/TaxReport/GSTR-1';
import GSTR3BOnline from './views/GSTROnline/3B/GSTR3BOnline';
import ProductGrouping from './views/product/ProductGrouping';
import SessionGroup from './views/SessionGroup/SessionGroup';
import EmployeeTypeList from './views/Employee/EmployeeTypes/EmployeeTypeList';
import DoctorSessionsList from './views/SessionGroup/doctorSessionsList';
import GSTR2BOnline from './views/GSTROnline/2B/GSTR2BOnline';
import GSTR2AOnline from './views/GSTROnline/2A/GSTR2AOnline';
import Purchase2A2BReconciliations from './views/GSTROnline/Purchase2A2BReconciliations';
import GSTRDashboard from './views/GSTROnline/GSTRDashboard/DashboardMain';
import GSTR1OnlineFiling from './views/GSTROnline/GSTR1/GSTR1OnlineFiling';
import AmendedInvoices from './views/AmendedInvoices';
import LoyaltyPoints from './views/LoyaltyPoints';
import BillOfMaterials from './views/BillOfMaterials';
import ReportSettings from './views/Settings/Report_Transaction/report_settings';
import ProductHistory from './views/StockManagement/ProductHistory';
import ProductSerial from './views/product/ProductSerial';
import AuditTrail from './views/AudiTrail/index';
import CashInHand from './views/Cash&Bank/CashInHand/CashInHand';
import Contra from './views/Contra';

const routes = (isLoggedIn) => [
  {
    path: 'app',
    element:
      isLoggedIn === 'true' ? <DashboardLayout /> : <Navigate to="/login" />,
    children: [
      { path: 'account', element: <AccountView /> },
      { path: 'customers', element: <CustomerListView /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'products', element: <ProductListView /> },
      { path: 'settings', element: <InvoicePrint /> },
      { path: 'printSettings', element: <InvoicePrint /> },
      { path: 'transactionSettings', element: <SalesSettings /> },
      { path: 'taxSettings', element: <TaxSettings /> },
      { path: 'userSettings', element: <UserManagement /> },
      { path: 'alertSettings', element: <WhatsAppSettings /> },
      { path: 'paymentModeSettings', element: <SplitPaymentSettings /> },
      { path: 'generalSettings', element: <GeneralTransaction /> },
      { path: 'reminderSettings', element: <ReminderSettings /> },
      {
        path: 'settings',
        children: [
          { path: '', element: <InvoicePrint /> },
          { path: 'transaction', element: <TransactionPrint /> },
          { path: 'transactionsetting', element: <TransactionSettings /> },
          { path: 'sales_settings', element: <SalesSettings /> },
          {
            path: 'approval_settings',
            element: <ApprovalTransactionSettings />
          },
          { path: 'barcode', element: <BarcodePrint /> },
          { path: 'invoice', element: <InvoicePrint /> },
          { path: 'tax_gst', element: <TaxSettings /> },
          { path: 'whatsapp_settings', element: <WhatsAppSettings /> },
          { path: 'user_settings', element: <UserManagement /> },
          { path: 'jobworkin_settings', element: <JobWorkInSettings /> },
          { path: 'purchase_settings', element: <PurchaseSettings /> },
          {
            path: 'purchase_order_settings',
            element: <PurchaseOrderSettings />
          },
          {
            path: 'delivery_challan_settings',
            element: <DeliveryChallanSettings />
          },
          { path: 'sale_order_settings', element: <SaleOrderSettings /> },
          {
            path: 'sale_quotation_settings',
            element: <SaleQuotationSettings />
          },
          { path: 'expense_settings', element: <ExpenseSetting /> },

          { path: 'tcs_settings', element: <TCS /> },

          { path: 'cloud_print', element: <CloudPrintSettings /> },

          {
            path: 'generaltransactionsetting',
            element: <GeneralTransaction />
          },
          { path: 'product_settings', element: <ProductSettings /> },
          { path: 'tds_settings', element: <TDS /> },
          { path: 'payment_in_settings', element: <PaymentInSettings /> },
          { path: 'payment_out_settings', element: <PaymentOutSettings /> },
          { path: 'kot_settings', element: <KotSettings /> },
          { path: 'multidevicesetting', element: <MultiDeviceSettings /> },
          { path: 'report_settings', element: <ReportSettings /> }
        ]
      },
      { path: 'sales', element: <Allinvoice /> },
      { path: 'kot', element: <KOT /> },
      { path: 'payment', element: <PaymentIn /> },
      { path: 'expense', element: <Expenses /> },
      { path: 'salesquotation', element: <SalesQuotation /> },
      { path: 'schememanagement', element: <SchemeManagement /> },
      { path: 'deliverychallan', element: <DeliveryChallan /> },
      { path: 'schemeTypes', element: <SchemeManagementTypes /> },

      { path: 'jobwork', element: <OrderInvoice /> },
      { path: 'OrderReceipt', element: <OrderReceipt /> },
      { path: 'jobWorkIn', element: <JobWorkIn /> },

      { path: 'purchases', element: <Purchases /> },
      { path: 'PaymentOut', element: <PaymentOut /> },
      { path: 'purchaseReturn', element: <PurchaseReturn /> },
      { path: 'purchaseOrder', element: <PurchaseOrder /> },
      { path: 'saleorder', element: <SaleOrder /> },

      { path: 'Customer', element: <Customers /> },
      { path: 'Vendor', element: <Vendors /> },
      { path: 'Employee', element: <EmployeeView /> },
      { path: 'employeeType', element: <EmployeeTypeList /> },
      { path: 'salesreturn', element: <SalesReturnCredit /> },
      { path: 'approval', element: <Approval /> },
      { path: 'BackupAndRestore', element: <BackupAndRestore /> },
      { path: 'Reports', element: <Reports /> },
      { path: 'tallyExport', element: <Tally /> },
      { path: 'excelUpload', element: <ExcelUpload /> },
      { path: 'barcodePrinter', element: <Barcode /> },
      { path: 'Cash', element: <CashInHand /> },
      { path: 'Bank', element: <BankAccountView /> },
      { path: 'Cheque', element: <Cheque /> },
      { path: 'updateApp', element: <UpdateApp /> },
      { path: 'special_days_management', element: <SpecialDaysManagement /> },
      { path: 'customerExcelUpload', element: <CustomerExcelUpload /> },
      { path: 'vendorExcelUpload', element: <VendorExcelUpload /> },
      {
        path: 'customer_special_days_report',
        element: <CustomerSpecialDaysReport />
      },
      { path: 'dashboardProductsExcel', element: <DashboardExcelUpload /> },
      {
        path: 'dashboardCustomersExcel',
        element: <DashboardCustomerExcelUpload />
      },
      {
        path: 'dashboardVendorsExcel',
        element: <DashboardVendorExcelUpload />
      },
      { path: 'closeFinancialYear', element: <CloseFinancialYear /> },
      { path: 'retrieveDeletedData', element: <RetrieveDeletedData /> },
      { path: 'eway', element: <Eway /> },
      { path: 'einvoice', element: <EInvoice /> },
      { path: 'rates', element: <Rate /> },
      { path: 'manufacture', element: <Manufacture /> },
      { path: 'warehouse', element: <Warehouse /> },
      { path: 'addOns', element: <AddOns /> },
      {
        path: 'manufacturedirectexpenses',
        element: <ManufacturingDirectExpenses />
      },
      { path: 'failedData', element: <FailedInvoices /> },
      { path: 'cancelledData', element: <CancelledInvoices /> },
      { path: 'addStock', element: <AddStock /> },
      { path: 'reduceStock', element: <RemoveStock /> },
      { path: 'damagedStock', element: <DamagedStock /> },
      { path: 'stockDetails', element: <StockDetails /> },
      { path: 'backToBackPurchase', element: <BackToBackPurchase /> },
      { path: 'auditSettings', element: <AuditSettings /> },
      { path: 'rawmaterials', element: <RawMaterialList /> },
      { path: 'auditreports', element: <AuditReports /> },
      { path: 'accountingnotes', element: <AccountingNotes /> },
      { path: 'gstr1Offline', element: <GSTR1 /> },
      { path: 'gstrDashboard', element: <GSTRDashboard />},
      { path: 'gstr1OnlineData', element: <GSTR1OnlineFiling /> },
      { path: 'gstr3b', element: <GSTR3BOnline /> },
      { path: 'productGroups', element: <ProductGrouping /> },
      { path: 'sessionGroup', element: <SessionGroup /> },
      { path: 'doctorsSessions', element: <DoctorSessionsList /> },
      { path: 'gstr2b', element: <GSTR2BOnline /> },
      { path: 'gstr2a', element: <GSTR2AOnline /> },
      { path: 'gstr2a2brec', element: <Purchase2A2BReconciliations /> },
      { path: 'amendedData', element: <AmendedInvoices /> },
      { path: 'loyaltyManagement', element: <LoyaltyPoints />},
      { path: 'billofmaterials', element: <BillOfMaterials /> },
      { path: 'productHistory', element: <ProductHistory /> },
      { path: 'serialItem', element: <ProductSerial /> },
      { path: 'auditTrail', element: <AuditTrail />},
      { path: 'Contra', element: <Contra /> },
      // {
      //   path: 'Reports',
      //   children: [{ path: '/', element: <Reports /> }]
      // },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    children: [
      { path: 'login', element: <Login /> },
      { path: 'aboutUs', element: <AboutUs /> },
      { path: 'faq', element: <FAQ /> },
      {
        path: 'selectBusiness',
        element:
          isLoggedIn === 'true' ? <BusinessList /> : <Navigate to="/login" />
      },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/login" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;