import React, { useState } from 'react';
import ReportsList from './ReportsList';
import CashFlow from './SalesReport/CashFlow/CashFlow';
import { Grid, Col } from 'react-flexbox-grid';
import './style.css';
import useWindowDimensions from '../../components/windowDimension';
import Sales from './SalesReport/Sales/Sales';
import SalesByVendor from './SalesReport/SaleByVendor/SalesByVendor';
import SalesByCustomer from './SalesReport/SaleByCustomer/SalesByCustomer';
import SaleByItem from './SalesReport/SaleByItem/SaleByItem';
import Purchase from './PurchaseReport/Purchase/Purchase';
import TodayPurchase from './PurchaseReport/TodayPurchases/TodayPurchase';
import PurchaseByVendor from './PurchaseReport/PurchaseByVendor/PurchaseByVendor';
import PurchaseByItems from './PurchaseReport/PurchaseByItems/PurchaseByItems';
import StockSummary from './ItemStockReport/Stock/StockSummary';
import StockSummaryV2 from './ItemStockReport/Stock/StockSummaryV2';
import LowStockSummary from './ItemStockReport/LowStockSummary/LowStockSummary';
import StockDetail from './ItemStockReport/StockDetail/StockDetails';
import ExpiryReport from './ItemStockReport/Expiry/Expiry';
import CustomerItemReport from './ItemStockReport/CustomerItem/Customer';
import VendorItemReport from './ItemStockReport/VendorItems/Vendor';
import ProfitLoss from './ProfitLossReport/ProfitLoss/Profit&Loss';
import ProfitLossByItem from './ProfitLossReport/ProfitLossByItem/ProfitLossByItem';
import ProfitAndLossByVendor from './ProfitLossReport/ProfitLossByVendor/ProfitAndLossByVendor';
import ProfitAndLossByBill from './ProfitLossReport/ProfitLossByBill/ProfitAndLossByBill';
import Tax from './TaxReport/Tax/Tax';
import GSTR1ReportsView from './TaxReport/GSTR-1/index';
import BalanceSheetReport from './ProfitLossReport/BalanceSheet/BalanceSheetReport';
import SalesReturnReport from './ReturnReport/SalesReturnReport';
import TodaySalesReturn from './ReturnReport/TodaySalesReturn';
import SalesReturnByCustomer from './ReturnReport/SalesReturnbyCustomer';
import PurchaseReturn from './ReturnReport/PurchaseReturn';
import TodayPurchaseReturn from './ReturnReport/TodayPurchaseReturn';
import PurchaseReturnByVendor from './ReturnReport/PurchaseReturnbyVendor';
import RetrunReportbyProduct from './ReturnReport/ReturnReportByProduct';
import SalewithHSNGstReport from './TaxReport/HSN/Sales_HSN';
import PurchasewithHSNGstReport from './TaxReport/HSN/Purchase_with_HSN';
import HSNWiseSalesSummaryReport from './TaxReport/HSN/salesSummary';
import GSTR9ReportsView from './TaxReport/GSTR-9/index';
import GSTR9AReportsView from './TaxReport/GSTR-9A/index';
import GSTR4ReportsView from './TaxReport/GSTR-4/index';
import GSTR2ReportsView from './TaxReport/GSTR-2/index';
import { toJS } from 'mobx';
import { useStore } from '../../Mobx/Helpers/UseStore';
import GSTR3BReports from './TaxReport/GSTR3B/index';
import CashBookReport from './AccountsReport/CashBook/index';
import BankBookReport from './AccountsReport/BankBook/index';
import DayBookReport from './AccountsReport/DayBook/index';
import AccountsPayableReport from './AccountsReport/AccountsPayable/AccountsPayable';
import AccountsReceivableReport from './AccountsReport/AccountsReceivable/AccountsReceivable';
import AccountsPayableCustomerReport from './AccountsReport/AccountsPayablebyCustomer/index';
import AccountsReceivableCustomerReport from './AccountsReport/AccountsReceivableCustomer/index';
import AccountsPayableVendorReport from './AccountsReport/AccountsPayableVendor/index';
import AccountsReceivableVendorReport from './AccountsReport/AccountsReceivableByVendor';
import DayBookbyEmployeeReport from './EmployeeReport/DayBook/index';
import CashBookbyEmployeeReport from './EmployeeReport/CashBook/index';
import BankBookbyEmployeeReport from './EmployeeReport/BankBook/index';
import SalesbyEmployeeReport from './EmployeeReport/SalesByEmployee/index';
import PurchasesbyEmployeeReport from './EmployeeReport/PurchasesByEmployee/index';
import SalesReturnbyEmployeeReport from './EmployeeReport/SalesReturnByEmployee/index';
import PurchaseReturnsbyEmployeeReport from './EmployeeReport/PurchasesReturnByEmployee/index';
import PaymentReceivedbyEmployeeReport from './EmployeeReport/PaymentReceivedByEmployee/index';
import PaymentMadebyEmployeeReport from './EmployeeReport/PaymentMadeByEmployee/index';
import InventorybyEmployeeReport from './EmployeeReport/InventoryByEmployee/index';
import TotalDonationBills from './DonationAndSevaReport/TotalDonations/TotalDonationBills';
import TodayDonationBills from './DonationAndSevaReport/TodayDonations/TodayDonationBills';
import TotalSevaBills from './DonationAndSevaReport/TotalSevaBills/TotalSevaBills';
import TodaySevaBills from './DonationAndSevaReport/TodaySevaBills/TodaySevaBills';
import TodayApprovalBills from './RepairAndApprovalReport/TodayApprovalBills/TodayApprovalBills';
import TotalApprovalBills from './RepairAndApprovalReport/TotalApprovalBills/TotalApprovalBills';
import TodayRepairBills from './RepairAndApprovalReport/TodayRepairBills/TodayRepairBills';
import TotalRepairBills from './RepairAndApprovalReport/TotalRepairBills/TotalRepairBills';
import ChequeBook from './AccountsReport/ChequeBook';
import SaleQuotationByEmployee from './EmployeeReport/SaleQuotationByEmployee';
import SaleOrderByEmployee from './EmployeeReport/SaleOrderByEmployee';
import DeliveryChallanByEmployee from './EmployeeReport/DeliveryChallanByEmployee';
import PurchaseOrderByEmployee from './EmployeeReport/PurchaseOrderByEmployee';
import ApprovalsByEmployee from './EmployeeReport/ApprovalsByEmployee';
import JobWorkInByEmployee from './EmployeeReport/JobWorkInByEmployee';
import JobWorkOutByEmployee from './EmployeeReport/JobWorkOutByEmployee';
import WorkOrderReceiptByEmployee from './EmployeeReport/WorkOrderReceiptByEmployee';
import AllSalesTaxSplit from './SalesReport/AllSales/AllSalesTaxSplit';
import YearlySales from './SalesReport/YearlySales/YearlySales';

import SaleByFreeItem from './SalesReport/SaleByFreeItem/SaleByFreeItem';
import PurchaseByFreeItems from './PurchaseReport/PurchaseByFreeItems/PurchaseByFreeItems';
import TransactionByItem from './ItemStockReport/TransactionByItem/TransactionByItem';
import TransactionByItemV2 from './ItemStockReport/TransactionByItem/TransactionByItemV2';
import ExpensesReport from './ExpensesReport';
import ManufactureReport from './ManufactureReport/ManufactureReport';
import RawMaterialsByItem from './ItemStockReport/RawMaterials/RawMaterialsByItem';
import ItemWiseDiscountSales from './DiscountReport/ItemWiseDiscountSales';
import ItemWiseDiscountPurchases from './DiscountReport/ItemWiseDiscountPurchases';
import ItemWiseDiscountByCustomer from './DiscountReport/ItemWiseDiscountByCustomer';
import ItemWiseDiscountByVendor from './DiscountReport/ItemWiseDiscountByVendor';
import BillWiseDiscountPurchases from './DiscountReport/BillWiseDiscountPurchases';
import BillWiseDiscountVendor from './DiscountReport/BillWiseDiscountVendor';
import BillWiseDiscountCustomer from './DiscountReport/BillWiseDiscountCustomer';
import BillWiseDiscountSales from './DiscountReport/BillWiseDiscountSales';
import TCSReceivable from './TaxReport/TCSReceivable';
import FormNo27EQ from './TaxReport/FormNo27EQ';
import SalesByWarehouse from './WarehouseReport/SalesByWarehouse';
import PurchasesByWarehouse from './WarehouseReport/PurchasesByWarehouse';
import SaleAgingDetails from './AgingReport/SaleAgingDetails/SaleAgingDetails';
import PurchaseAgingDetails from './AgingReport/PurchaseAgingDetails/PurchaseAgingDetails';
import CustomerSaleAgingReceivableSummary from './AgingReport/CustomerSaleAgingReceivableSummary/CustomerSaleAgingReceivableSummary';
import CustomerSaleAgingPayableSummary from './AgingReport/CustomerSaleAgingPayableSummary/CustomerSaleAgingPayableSummary';
import VendorPurchaseAgingPayableSummary from './AgingReport/VendorPurchaseAgingPayableSummary/VendorPurchaseAgingPayableSummary';
import VendorPurchaseAgingReceivableSummary from './AgingReport/VendorPurchaseAgingReceivableSummary/VendorPurchaseAgingReceivableSummary';
import ManufacturingAccount from './ProfitLossReport/ManufacturingAccount/ManufacturingAccount';
import Form26Q from './TaxReport/Form26Q';
import TDSReceivable from './TaxReport/TDSReceivable';
import CustomFinanceBook from './AccountsReport/CustomFinanceBook';
import GiftCardBook from './AccountsReport/GiftCardBook';
import OrderInReport from './WorkOrderReport/OrderInReport/OrderInReport';
import OrderOutReport from './WorkOrderReport/OrderOutReport/OrderOutReport';
import WorkLossReport from './WorkOrderReport/WorkLossReport/WorkLossReport';
import SalesByModelNo from './ModelNoReport/SalesByModelNo';
import PurchasesByModelNo from './ModelNoReport/PurchasesByModelNo';
import SaleEmployeePerformance from './EmployeePerformanceReport/SaleEmployeePerformance';
import SaleReturnEmployeePerformance from './EmployeePerformanceReport/SaleReturnEmployeePerformance';
import EmployeePerformance from './EmployeePerformanceReport/EmployeePerformance';
import ProcurementReport from './ManufactureReport/ProcurementReport';
import ExchangeBook from './AccountsReport/ExchangeBook';
import AddOnsByItem from './ItemStockReport/AddOns/AddOnsByItem';
import SalesByItemSerialReport from './ItemSerialReport/SalesByItemSerialReport';
import PurchasesByItemSerialReport from './ItemSerialReport/PurchasesByItemSerialReport';
import SalesReturnByItemSerialNo from './ItemSerialReport/SalesReturnByItemSerialReport';
import PurchasesReturnByItemSerialReport from './ItemSerialReport/PurchasesReturnByItemSerialReport';
import WarrantyReport from './ItemSerialReport/WarrantyReport';

const Reports = () => {
  const store = useStore();

  const { reportRouterData } = toJS(store.ReportsStore);
  const { height } = useWindowDimensions();
  let [returnData, setReturnData] = useState(reportRouterData);

  return (
    <Grid
      fluid
      className="app-main"
      s={returnData}
      style={{ height: height - 50 }}
    >
      <Col className="nav-column" xs={12} sm={2}>
        <ReportsList returnData={setReturnData} />
      </Col>

      <Col className="content-column" xs>
        {returnData === 'cashflow' && (
          <div>
            <CashFlow />
          </div>
        )}
        {returnData === 'allsales' && (
          <div>
            <Sales />
          </div>
        )}
        {returnData === 'salebyvendor' && (
          <div>
            <SalesByVendor />
          </div>
        )}
        {returnData === 'salebycustomer' && (
          <div>
            <SalesByCustomer />
          </div>
        )}
        {returnData === 'salebyitems' && (
          <div>
            <SaleByItem />
          </div>
        )}
        {returnData === 'allpurchases' && (
          <div>
            <Purchase />
          </div>
        )}
        {returnData === 'todaypurchases' && (
          <div>
            <TodayPurchase />
          </div>
        )}
        {returnData === 'purchasebyvendor' && (
          <div>
            <PurchaseByVendor />
          </div>
        )}
        {returnData === 'purchasebyitem' && (
          <div>
            <PurchaseByItems />
          </div>
        )}
        {returnData === 'stock' && (
          <div>
            {/* <StockSummary /> */}
            <StockSummaryV2 />
          </div>
        )}
        {returnData === 'lowstock' && (
          <div>
            <LowStockSummary />
          </div>
        )}
        {returnData === 'stockdetail' && (
          <div>
            <StockDetail />
          </div>
        )}
        {returnData === 'expiry' && (
          <div>
            <ExpiryReport />
          </div>
        )}
        {returnData === 'customeritems' && (
          <div>
            <CustomerItemReport />
          </div>
        )}
        {returnData === 'vendoritems' && (
          <div>
            <VendorItemReport />
          </div>
        )}
        {returnData === 'profitloss' && (
          <div>
            <ProfitLoss />
          </div>
        )}
        {returnData === 'profitlossbyitem' && (
          <div>
            <ProfitLossByItem />
          </div>
        )}
        {returnData === 'profitlossbyvendor' && (
          <div>
            <ProfitAndLossByVendor />
          </div>
        )}
        {returnData === 'profitlossbybill' && (
          <div>
            <ProfitAndLossByBill />
          </div>
        )}
        {returnData === 'taxcredits' && (
          <div>
            <Tax />
          </div>
        )}
        {returnData === 'gstrreports' && (
          <div>
            <GSTR1ReportsView />
          </div>
        )}
        {returnData === 'balancesheet' && (
          <div>
            <BalanceSheetReport />
          </div>
        )}
        {returnData === 'salesreturn' && (
          <div>
            <SalesReturnReport />
          </div>
        )}
        {returnData === 'todaysalesreturn' && (
          <div>
            <TodaySalesReturn />
          </div>
        )}
        {returnData === 'salesreturnbycustomer' && (
          <div>
            <SalesReturnByCustomer />
          </div>
        )}
        {returnData === 'purchasereturn' && (
          <div>
            <PurchaseReturn />
          </div>
        )}
        {returnData === 'todaypurchasereturn' && (
          <div>
            <TodayPurchaseReturn />
          </div>
        )}
        {returnData === 'purchasereturnbyvendor' && (
          <div>
            <PurchaseReturnByVendor />
          </div>
        )}
        {returnData === 'returnbyproduct' && (
          <div>
            <RetrunReportbyProduct />
          </div>
        )}
        {returnData === 'gstr3b' && (
          <div>
            <GSTR3BReports />
          </div>
        )}
        {returnData === 'gstrsalewithhsn' && (
          <div>
            <SalewithHSNGstReport />
          </div>
        )}
        {returnData === 'gstpurchasewithhsn' && (
          <div>
            <PurchasewithHSNGstReport />
          </div>
        )}
        {returnData === 'gstr2' && (
          <div>
            <GSTR2ReportsView />
          </div>
        )}
        {returnData === 'hsnsalessummary' && (
          <div>
            <HSNWiseSalesSummaryReport />
          </div>
        )}
        {returnData === 'gstr4' && (
          <div>
            <GSTR4ReportsView />
          </div>
        )}
        {returnData === 'gstr9' && (
          <div>
            <GSTR9ReportsView />
          </div>
        )}
        {returnData === 'gstr9a' && (
          <div>
            <GSTR9AReportsView />
          </div>
        )}
        {returnData === 'cashbook' && (
          <div>
            <CashBookReport />
          </div>
        )}
        {returnData === 'bankbook' && (
          <div>
            <BankBookReport />
          </div>
        )}
        {returnData === 'daybook' && (
          <div>
            <DayBookReport />
          </div>
        )}
        {returnData === 'accountspayable' && (
          <div>
            <AccountsPayableReport />
          </div>
        )}
        {returnData === 'accountsreceivable' && (
          <div>
            <AccountsReceivableReport />
          </div>
        )}
        {returnData === 'accountspayablecustomer' && (
          <div>
            <AccountsPayableCustomerReport />
          </div>
        )}
        {returnData === 'accountsreceivablecustomer' && (
          <div>
            <AccountsReceivableCustomerReport />
          </div>
        )}
        {returnData === 'accountspayablevendor' && (
          <div>
            <AccountsPayableVendorReport />
          </div>
        )}
        {returnData === 'accountsreceivablevendor' && (
          <div>
            <AccountsReceivableVendorReport />
          </div>
        )}
        {returnData === 'dayBookbyEmployee' && (
          <div>
            <DayBookbyEmployeeReport />
          </div>
        )}
        {returnData === 'cashBookByEmployee' && (
          <div>
            <CashBookbyEmployeeReport />
          </div>
        )}
        {returnData === 'bankbookByEmployee' && (
          <div>
            <BankBookbyEmployeeReport />
          </div>
        )}
        {returnData === 'salebyEmployee' && (
          <div>
            <SalesbyEmployeeReport />
          </div>
        )}

        {returnData === 'purchasesbyEmployee' && (
          <div>
            <PurchasesbyEmployeeReport />
          </div>
        )}

        {returnData === 'saleReturnbyEmployee' && (
          <div>
            <SalesReturnbyEmployeeReport />
          </div>
        )}

        {returnData === 'purchasesReturnbyEmployee' && (
          <div>
            <PurchaseReturnsbyEmployeeReport />
          </div>
        )}

        {returnData === 'paymentReceivedbyEmployee' && (
          <div>
            <PaymentReceivedbyEmployeeReport />
          </div>
        )}

        {returnData === 'paymentMadebyEmployee' && (
          <div>
            <PaymentMadebyEmployeeReport />
          </div>
        )}
        {returnData === 'inventorybyEmployee' && (
          <div>
            <InventorybyEmployeeReport />
          </div>
        )}
        {returnData === 'totaldonationsbills' && (
          <div>
            <TotalDonationBills />
          </div>
        )}
        {returnData === 'todaydonationsbills' && (
          <div>
            <TodayDonationBills />
          </div>
        )}
        {returnData === 'totalsevabills' && (
          <div>
            <TotalSevaBills />
          </div>
        )}
        {returnData === 'todaysevabills' && (
          <div>
            <TodaySevaBills />
          </div>
        )}
        {returnData === 'totalrepairbills' && (
          <div>
            <TotalRepairBills />
          </div>
        )}
        {returnData === 'todayrepairbills' && (
          <div>
            <TodayRepairBills />
          </div>
        )}
        {returnData === 'totalapprovalbills' && (
          <div>
            <TotalApprovalBills />
          </div>
        )}
        {returnData === 'todayapprovalbills' && (
          <div>
            <TodayApprovalBills />
          </div>
        )}
        {returnData === 'chequebook' && (
          <div>
            <ChequeBook />
          </div>
        )}
        {returnData === 'saleQuotationByEmployee' && (
          <div>
            <SaleQuotationByEmployee />
          </div>
        )}
        {returnData === 'saleOrderByEmployee' && (
          <div>
            <SaleOrderByEmployee />
          </div>
        )}
        {returnData === 'deliveryChallanByEmployee' && (
          <div>
            <DeliveryChallanByEmployee />
          </div>
        )}
        {returnData === 'purchaseOrderByEmployee' && (
          <div>
            <PurchaseOrderByEmployee />
          </div>
        )}
        {returnData === 'approvalsByEmployee' && (
          <div>
            <ApprovalsByEmployee />
          </div>
        )}
        {returnData === 'jobWorkInByEmployee' && (
          <div>
            <JobWorkInByEmployee />
          </div>
        )}
        {returnData === 'jobWorkOutByEmployee' && (
          <div>
            <JobWorkOutByEmployee />
          </div>
        )}
        {returnData === 'workOrderReceiptByEmployee' && (
          <div>
            <WorkOrderReceiptByEmployee />
          </div>
        )}
        {returnData === 'allsalestaxsplit' && (
          <div>
            <AllSalesTaxSplit />
          </div>
        )}
        {returnData === 'yearlySales' && <YearlySales />}
        {returnData === 'salebyfreeitems' && (
          <div>
            <SaleByFreeItem />
          </div>
        )}
        {returnData === 'purchasebyfreeitem' && (
          <div>
            <PurchaseByFreeItems />
          </div>
        )}
        {returnData === 'transactionbyitem' && (
          <div>
            <TransactionByItem />
            {/* <TransactionByItemV2 /> */}
          </div>
        )}
        {returnData === 'allexpenses' && (
          <div>
            <ExpensesReport />
          </div>
        )}
        {returnData === 'manufacturingreport' && (
          <div>
            <ManufactureReport />
          </div>
        )}
        {returnData === 'rawmaterialsreport' && (
          <div>
            <RawMaterialsByItem />
          </div>
        )}
        {returnData === 'itemwisediscountsales' && (
          <div>
            <ItemWiseDiscountSales />
          </div>
        )}
        {returnData === 'itemwisediscountpurchases' && (
          <div>
            <ItemWiseDiscountPurchases />
          </div>
        )}
        {returnData === 'itemwisediscountcustomer' && (
          <div>
            <ItemWiseDiscountByCustomer />
          </div>
        )}
        {returnData === 'itemwisediscountvendor' && (
          <div>
            <ItemWiseDiscountByVendor />
          </div>
        )}
        {returnData === 'billwisediscountsales' && (
          <div>
            <BillWiseDiscountSales />
          </div>
        )}
        {returnData === 'billwisediscountpurchases' && (
          <div>
            <BillWiseDiscountPurchases />
          </div>
        )}
        {returnData === 'billwisediscountvendor' && (
          <div>
            <BillWiseDiscountVendor />
          </div>
        )}
        {returnData === 'billwisediscountcustomer' && (
          <div>
            <BillWiseDiscountCustomer />
          </div>
        )}
        {returnData === 'tcsreceivable' && (
          <div>
            <TCSReceivable />
          </div>
        )}
        {returnData === 'formno27eq' && (
          <div>
            <FormNo27EQ />
          </div>
        )}
        {returnData === 'salesbywarehouse' && (
          <div>
            <SalesByWarehouse />
          </div>
        )}
        {returnData === 'purchasesbywarehouse' && (
          <div>
            <PurchasesByWarehouse />
          </div>
        )}
        {returnData === 'salesagingdetailsbyinvoice' && (
          <div>
            <SaleAgingDetails />
          </div>
        )}
        {returnData === 'purchasesagingdetailsbyinvoice' && (
          <div>
            <PurchaseAgingDetails />
          </div>
        )}
        {returnData === 'customersaleagingreceivablesummary' && (
          <div>
            <CustomerSaleAgingReceivableSummary />
          </div>
        )}
        {returnData === 'customersaleagingpayablesummary' && (
          <div>
            <CustomerSaleAgingPayableSummary />
          </div>
        )}
        {returnData === 'vendorpurchaseagingreceivablesummary' && (
          <div>
            <VendorPurchaseAgingReceivableSummary />
          </div>
        )}
        {returnData === 'vendorpurchaseagingpayablesummary' && (
          <div>
            <VendorPurchaseAgingPayableSummary />
          </div>
        )}
        {returnData === 'manufacturingAccount' && (
          <div>
            <ManufacturingAccount />
          </div>
        )}
        {returnData === 'formno26q' && (
          <div>
            <Form26Q />
          </div>
        )}
        {returnData === 'tdsreceivable' && (
          <div>
            <TDSReceivable />
          </div>
        )}
        {returnData === 'customfinancebook' && (
          <div>
            <CustomFinanceBook />
          </div>
        )}
        {returnData === 'giftcardbook' && (
          <div>
            <GiftCardBook />
          </div>
        )}
        {returnData === 'orderinreport' && (
          <div>
            <OrderInReport />
          </div>
        )}
        {returnData === 'orderoutreport' && (
          <div>
            <OrderOutReport />
          </div>
        )}
        {returnData === 'worklossreport' && (
          <div>
            <WorkLossReport />
          </div>
        )}
        {returnData === 'salesbymodelno' && (
          <div>
            <SalesByModelNo />
          </div>
        )}
        {returnData === 'purchasesbymodelno' && (
          <div>
            <PurchasesByModelNo />
          </div>
        )}
        {returnData === 'salesemployeeperformance' && (
          <div>
            <SaleEmployeePerformance />
          </div>
        )}
        {returnData === 'salesreturnemployeeperformance' && (
          <div>
            <SaleReturnEmployeePerformance />
          </div>
        )}
        {returnData === 'employeeperformance' && (
          <div>
            <EmployeePerformance />
          </div>
        )}
        {returnData === 'procurementreport' && (
          <div>
            <ProcurementReport />
          </div>
        )}
        {returnData === 'exchangebook' && (
          <div>
            <ExchangeBook />
          </div>
        )}
        {returnData === 'addonsreport' && (
          <div>
            <AddOnsByItem />
          </div>
        )}
        {returnData === 'salesserialitem' && (
          <div>
            <SalesByItemSerialReport />
          </div>
        )}
        {returnData === 'purchaseserialitem' && (
          <div>
            <PurchasesByItemSerialReport />
          </div>
        )}
        {returnData === 'salesreturnserialitem' && (
          <div>
            <SalesReturnByItemSerialNo />
          </div>
        )}
        {returnData === 'purchasereturnserialitem' && (
          <div>
            <PurchasesReturnByItemSerialReport />
          </div>
        )
        }
        {returnData === 'warranty' && (
          <div>
            <WarrantyReport />
          </div>
        )}
      </Col>
    </Grid>
  );
};

export default Reports;
