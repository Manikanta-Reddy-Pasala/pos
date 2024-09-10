import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import classnames from 'classnames';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

let isJewellery = localStorage.getItem('isJewellery');

const accountsLists = [
  {
    label: 'Cash Book',
    key: 'cashbook'
  },
  {
    label: 'Bank Book',
    key: 'bankbook'
  },
  {
    label: 'Day Book',
    key: 'daybook'
  },
  {
    label: 'Cheque Book',
    key: 'chequebook'
  },
  {
    label: 'Custom Finance Book',
    key: 'customfinancebook'
  },
  {
    label: 'Gift Card/Scheme Book',
    key: 'giftcardbook'
  },
  {
    label: 'Exchange Book',
    key: 'exchangebook'
  },
  {
    label: 'Accounts Payable/Sundry Creditors',
    key: 'accountspayable'
  },
  // {
  //   label: 'Accounts Payable - Customer',
  //   key: 'accountspayablecustomer'
  // },
  // {
  //   label: 'Accounts Payable - Vendor',
  //   key: 'accountspayablevendor'
  // },
  {
    label: 'Accounts Receivable/Sundry Debtors',
    key: 'accountsreceivable'
  }

  // {
  //   label: 'Accounts Receivable - Customer',
  //   key: 'accountsreceivablecustomer'
  // },
  // {
  //   label: 'Accounts Receivable - Vendor',
  //   key: 'accountsreceivablevendor'
  // }
];

let workOrderLists = [
  {
    label: 'Job Work Order In',
    key: 'orderinreport'
  }
];

let serialItemLists = [
  {
    label: 'Serial Item - Sales',
    key: 'salesserialitem'
  },
  {
    label: 'Serial Item - Sales Return',
    key: 'salesreturnserialitem'
  },
  {
    label: 'Serial Item - Purchases',
    key: 'purchaseserialitem'
  },
  {
    label: 'Serial Item - Purchases Return',
    key: 'purchasereturnserialitem'
  },
  {
    label: 'Serial Item - Warranty',
    key: 'warranty'
  }
];

if (String(isJewellery).toLowerCase() === 'true') {
  workOrderLists.splice(
    1,
    0,
    {
      label: 'Job Work Order Out',
      key: 'orderoutreport'
    },
    {
      label: 'Work Loss Report',
      key: 'worklossreport'
    }
  );
}

const employeeReportList = [
  {
    label: 'Day Book - Employee',
    key: 'dayBookbyEmployee'
  },
  /* {
    label: 'Cash Book-Employee',
    key: 'cashBookByEmployee'
  },*/
  /* {
    label: 'Bank Book-Employee',
    key: 'bankbookByEmployee'
  }, */
  {
    label: 'Sales - Employee',
    key: 'salebyEmployee'
  },
  {
    label: 'Sales Quotation - Employee',
    key: 'saleQuotationByEmployee'
  },
  {
    label: 'Sale Orders - Employee',
    key: 'saleOrderByEmployee'
  },
  {
    label: 'Delivery Challan - Employee',
    key: 'deliveryChallanByEmployee'
  },
  {
    label: 'Sales Return - Employee',
    key: 'saleReturnbyEmployee'
  },
  {
    label: 'Purchases - Employee',
    key: 'purchasesbyEmployee'
  },
  {
    label: 'Purchase Orders - Employee',
    key: 'purchaseOrderByEmployee'
  },
  {
    label: 'Purchases Return - Employee',
    key: 'purchasesReturnbyEmployee'
  },

  {
    label: 'Payment Received - Employee',
    key: 'paymentReceivedbyEmployee'
  },
  {
    label: 'Payment Made - Employee',
    key: 'paymentMadebyEmployee'
  }
];

if (String(isJewellery).toLowerCase() === 'true') {
  employeeReportList.splice(
    11,
    0,
    {
      label: 'Approvals - Employee',
      key: 'approvalsByEmployee'
    },
    {
      label: 'Job Work In - Employee',
      key: 'jobWorkInByEmployee'
    },
    {
      label: 'Job Work Out - Employee',
      key: 'jobWorkOutByEmployee'
    },
    {
      label: 'Work Order Receipt - Employee',
      key: 'workOrderReceiptByEmployee'
    }
  );
}

const salesLists = [
  {
    label: 'All Sales',
    key: 'allsales'
  },
  {
    label: 'All Sales (HSN)',
    key: 'allsalestaxsplit'
  },
  {
    label: 'Yearly Sales',
    key: 'yearlySales'
  },
  {
    label: 'Sales-Customer',
    key: 'salebycustomer'
  },
  {
    label: 'Sales-Product',
    key: 'salebyitems'
  },
  {
    label: 'Sales-Product (Free)',
    key: 'salebyfreeitems'
  }
];

let purchaseLists = [
  {
    label: 'All Purchases',
    key: 'allpurchases'
  },
  {
    label: 'Today Purchases',
    key: 'todaypurchases'
  },
  {
    label: 'Purchases-Vendor',
    key: 'purchasebyvendor'
  },
  {
    label: 'Purchases-Product',
    key: 'purchasebyitem'
  },
  {
    label: 'Purchases-Product (Free)',
    key: 'purchasebyfreeitem'
  }
];

let stockLists = [
  {
    label: 'Stock Detail',
    key: 'stockdetail'
  },
  {
    label: 'Low Stock Summary',
    key: 'lowstock'
  },
  {
    label: 'Expiry Report',
    key: 'expiry'
  },
  {
    label: 'Product Report-Customer',
    key: 'customeritems'
  },
  {
    label: 'Product Report-Vendor',
    key: 'vendoritems'
  },
  {
    label: 'Raw Material Consumption Report',
    key: 'rawmaterialsreport'
  },
  {
    label: 'Add-Ons Report',
    key: 'addonsreport'
  }
];

let profitLossLists = [];

if (
  String(localStorage.getItem('isHotelOrRestaurant')).toLowerCase() === 'false'
) {
  profitLossLists = [
    {
      label: 'Profit and Loss',
      key: 'profitloss'
    },
    // {
    //   label: 'Balance Sheet (Horizontal)',
    //   key: 'balancesheet'
    // },
    // {
    //   label: 'Balance Sheet (Vertical)',
    //   key: 'balancesheetVertical'
    // },
    // {
    //   label: 'Profit and Loss-Product',
    //   key: 'profitlossbyitem'
    // },
    /* {
      label: 'Profit and Loss-Vendor',
      key: 'profitlossbyvendor'
    },*/
    {
      label: 'Profit by Transaction',
      key: 'profitlossbybill'
    },
    {
      label: 'Manufacturing Account',
      key: 'manufacturingAccount'
    }
  ];
} else {
  profitLossLists = [
    {
      label: 'Profit and Loss',
      key: 'profitloss'
    },
    // {
    //   label: 'Balance Sheet (Horizontal)',
    //   key: 'balancesheet'
    // },
    // {
    //   label: 'Profit and Loss-Product',
    //   key: 'profitlossbyitem'
    // },
    /* {
      label: 'Profit and Loss-Vendor',
      key: 'profitlossbyvendor'
    },*/
    {
      label: 'Profit by Transaction',
      key: 'profitlossbybill'
    }
  ];
}

const repairAndApprovalLists = [
  {
    label: 'All Approval Bills',
    key: 'totalapprovalbills'
  },
  {
    label: 'Today Approval Bills',
    key: 'todayapprovalbills'
  }
];

const expensesLists = [
  {
    label: 'All Expenses',
    key: 'allexpenses'
  }
];

const manufactureLists = [
  {
    label: 'Manufacturing Report',
    key: 'manufacturingreport'
  },
  {
    label: 'Procurement Report',
    key: 'procurementreport'
  }
];

const warehouseLists = [
  {
    label: 'Sales By Warehouse',
    key: 'salesbywarehouse'
  },
  {
    label: 'Purchases By Warehouse',
    key: 'purchasesbywarehouse'
  }
];

const agingLists = [
  {
    label: 'Sales Aging Details By Invoice Due Date',
    key: 'salesagingdetailsbyinvoice'
  },
  {
    label: 'Customer Accounts Receivable (Aging)',
    key: 'customersaleagingreceivablesummary'
  },
  {
    label: 'Customer Accounts Payable (Aging)',
    key: 'customersaleagingpayablesummary'
  },
  {
    label: 'Purchases Aging Details By Invoice Due Date',
    key: 'purchasesagingdetailsbyinvoice'
  },
  {
    label: 'Vendor Accounts Receivable (Aging)',
    key: 'vendorpurchaseagingreceivablesummary'
  },
  {
    label: 'Vendor Accounts Payable (Aging)',
    key: 'vendorpurchaseagingpayablesummary'
  }
];

const discountLists = [
  {
    label: 'Product Wise Discount (Sales)',
    key: 'itemwisediscountsales'
  },
  {
    label: 'Product Wise Discount (Purchases)',
    key: 'itemwisediscountpurchases'
  },
  {
    label: 'Product Wise Discount By Customer',
    key: 'itemwisediscountcustomer'
  },
  {
    label: 'Product Wise Discount By Vendor',
    key: 'itemwisediscountvendor'
  },
  {
    label: 'Bill Wise Discount (Sales)',
    key: 'billwisediscountsales'
  },
  {
    label: 'Bill Wise Discount (Purchases)',
    key: 'billwisediscountpurchases'
  },
  {
    label: 'Bill Wise Discount By Customer',
    key: 'billwisediscountcustomer'
  },
  {
    label: 'Bill Wise Discount By Vendor',
    key: 'billwisediscountvendor'
  }
];

let returnList = [
  {
    label: 'Sales Return',
    key: 'salesreturn'
  },
  {
    label: 'Today Sales Return',
    key: 'todaysalesreturn'
  },
  {
    label: 'Sales Return-Customer',
    key: 'salesreturnbycustomer'
  },
  {
    label: 'Purchases Return',
    key: 'purchasereturn'
  },
  {
    label: 'Today Purchase Return',
    key: 'todaypurchasereturn'
  },
  {
    label: 'Purchase Return - Vendor',
    key: 'purchasereturnbyvendor'
  },
  {
    label: 'Return - Product',
    key: 'returnbyproduct'
  }
];

let modelNoList = [
  {
    label: 'Sales By Model No',
    key: 'salesbymodelno'
  },
  {
    label: 'Purchases By Model No',
    key: 'purchasesbymodelno'
  }
];

const employeePerformanceLists = [
  {
    label: 'Employee Performance',
    key: 'employeeperformance'
  },
  {
    label: 'Sales-Employee Performance',
    key: 'salesemployeeperformance'
  },
  {
    label: 'Sales Return-Employee Performance',
    key: 'salesreturnemployeeperformance'
  }
];

const useStyles = makeStyles({
  root: {
    width: '100%',
    padding: 10
  },
  list: {
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#f6f8fa',
      color: '#ef5350'
    }
  },
  card: {
    display: 'block',
    transitionDuration: '0.3s',
    height: '100%',
    borderRadius: 8,
    paddingTop: 10,
    overflowY: 'auto',
    overflowX: 'hidden',
    background: 'white'
  },
  heading: {
    padding: '18px',
    fontSize: '15px',
    marginBottom: '-5px'
  },
  listH: {
    padding: '2px',
    '&:hover': {
      background: '#F7F8FA',
      borderLeft: '5px solid #EF5350'
    },
    '&:focus': {
      background: '#F7F8FA',
      borderLeft: '5px solid #EF5350'
    }
  },
  topHeading: {
    paddingLeft: '12px',
    fontSize: '12px',
    marginBottom: '-5px',
    fontWeight: 'bold'
  },
  activeList: {
    padding: '2px',
    background: '#F7F8FA',
    borderLeft: '5px solid #EF5350',
    '&:focus': {
      background: '#F7F8FA',
      borderLeft: '5px solid #EF5350'
    }
  },
  detailRoot: {
    padding: '0px !important'
  },
  hedersummaryRoot: {
    padding: '0px !important',
    minHeight: '48px !important'
  },
  accordionStyle: {
    borderBottom: '1px solid #d2d1d1'
  },
  accordionExpanded: {
    margin: '0px !important'
  }
});

const ReportsList = (props) => {
  const classes = useStyles();
  const store = useStore();
  const [expanded, setExpanded] = React.useState('accountsReport');
  const { reportRouterData } = toJS(store.ReportsStore);
  const { setReportRouterData } = store.ReportsStore;
  const [active, setActive] = React.useState(reportRouterData);
  const [taxList, setTaxList] = React.useState([]);
  const { taxSettingsData } = toJS(store.TaxSettingsStore);
  const { getTaxSettingsData } = store.TaxSettingsStore;
  const [compositeScheme, setCompositeScheme] = React.useState(false);

  const salesRef = useRef(null);
  const donationSevaRef = useRef(null);
  const repairApprovalRef = useRef(null);
  const stockRef = useRef(null);
  const purchaseRef = useRef(null);
  const returnRef = useRef(null);
  const profitLossRef = useRef(null);
  const taxRef = useRef(null);
  const accountRef = useRef(null);
  const employeeRef = useRef(null);
  const expensesRef = useRef(null);
  const manufacturingRef = useRef(null);
  const discountRef = useRef(null);
  const warehouseRef = useRef(null);
  const agingRef = useRef(null);
  const workOrderRef = useRef(null);
  const modelNoRef = useRef(null);
  const employeePerformanceRef = useRef(null);
  const serialNoRef = useRef(null);

  const [isTemple, setIsTemple] = React.useState(false);
  const [isJewellery, setIsJewellery] = React.useState(false);

  const { setReportTxnEnableFieldsMap, getReportSettingdetails } =
    store.ReportSettingsStore;

  const { reportTxnEnableFieldsMap } = toJS(store.ReportSettingsStore);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    async function fetchData() {
      await getTaxSettingsData();
    }

    fetchData();

    setCompositeScheme(taxSettingsData?.compositeScheme);
    setIsTemple(localStorage.getItem('isTemple'));
    setIsJewellery(localStorage.getItem('isJewellery'));
  }, [getTaxSettingsData, taxSettingsData]);

  useEffect(() => {
    async function fetchData() {
      setReportTxnEnableFieldsMap(toJS(await getReportSettingdetails()));
    }

    fetchData();
  }, []);

  useEffect(() => {
    let list;

    if (compositeScheme) {
      list = [
        {
          label: 'Input and Output Tax Credits',
          key: 'taxcredits'
        },
        {
          label: 'GSTR-3B',
          key: 'gstr3b'
        },
        {
          label: 'GSTR-4',
          key: 'gstr4'
        },
        {
          label: 'GSTR-9A',
          key: 'gstr9a'
        },
        {
          label: 'GST Sales(with HSN)',
          key: 'gstrsalewithhsn'
        },
        {
          label: 'GST Purchase(with HSN)',
          key: 'gstpurchasewithhsn'
        },
        {
          label: 'HSN Wise Sales Summary',
          key: 'hsnsalessummary'
        }
      ];
    } else {
      if (compositeScheme) {
        list = [
          {
            label: 'Input and Output Tax Credits',
            key: 'taxcredits'
          },

          {
            label: 'GSTR-3B',
            key: 'gstr3b'
          },
          {
            label: 'GSTR-4',
            key: 'gstr4'
          },
          {
            label: 'GSTR-9A',
            key: 'gstr9a'
          },
          {
            label: 'GST Sales(with HSN)',
            key: 'gstrsalewithhsn'
          },
          {
            label: 'GST Purchase(with HSN)',
            key: 'gstpurchasewithhsn'
          },
          {
            label: 'HSN Wise Sales Summary',
            key: 'hsnsalessummary'
          } /*,
        {
          label: 'Balance Sheet',
          key: 'balancesheet'
        }*/
        ];
      } else {
        list = [
          {
            label: 'Input and Output Tax Credits',
            key: 'taxcredits'
          },
          {
            label: 'GSTR-1',
            key: 'gstrreports'
          },
          {
            label: 'GSTR-2',
            key: 'gstr2'
          },
          {
            label: 'GSTR-3B',
            key: 'gstr3b'
          },
          {
            label: 'GSTR-9',
            key: 'gstr9'
          },
          {
            label: 'GST Sales(with HSN)',
            key: 'gstrsalewithhsn'
          },
          {
            label: 'GST Purchase(with HSN)',
            key: 'gstpurchasewithhsn'
          },
          {
            label: 'HSN Wise Sales Summary',
            key: 'hsnsalessummary'
          },
          {
            label: 'Form No. 27EQ',
            key: 'formno27eq'
          },
          {
            label: 'TCS Receivable',
            key: 'tcsreceivable'
          },
          {
            label: 'Form No. 26Q',
            key: 'formno26q'
          },
          {
            label: 'TDS Receivable',
            key: 'tdsreceivable'
          }
          /*{
            label: 'Balance Sheet',
            key: 'balancesheet'
          }*/
        ];
      }
    }
    setTaxList(list);
  }, [compositeScheme]);

  useEffect(() => {
    salesLists.forEach((ele) => {
      if (ele.key === reportRouterData) {
        setExpanded('salesReport');
        if (salesRef && salesRef.current) {
          salesRef.current.scrollIntoView();
        }
      }
    });

    repairAndApprovalLists.forEach((ele) => {
      if (ele.key === reportRouterData) {
        setExpanded('repairApprovalReport');
        if (repairApprovalRef && repairApprovalRef.current) {
          repairApprovalRef.current.scrollIntoView();
        }
      }
    });

    purchaseLists.forEach((ele) => {
      if (ele.key === reportRouterData) {
        setExpanded('purchasesReport');
        if (purchaseRef && purchaseRef.current) {
          purchaseRef.current.scrollIntoView();
        }
      }
    });

    returnList.forEach((ele) => {
      if (ele.key === reportRouterData) {
        setExpanded('returnReport');
        if (returnRef && returnRef.current) {
          returnRef.current.scrollIntoView();
        }
      }
    });

    stockLists.forEach((ele) => {
      if (ele.key === reportRouterData) {
        setExpanded('itemStockReport');
        if (stockRef && stockRef.current) {
          stockRef.current.scrollIntoView();
        }
      }
    });

    expensesLists.forEach((ele) => {
      if (ele.key === reportRouterData) {
        setExpanded('expensesReport');
        if (expensesRef && expensesRef.current) {
          expensesRef.current.scrollIntoView();
        }
      }
    });

    workOrderLists.forEach((ele) => {
      if (ele.key === reportRouterData) {
        setExpanded('workOrderReport');
        if (workOrderRef && workOrderRef.current) {
          workOrderRef.current.scrollIntoView();
        }
      }
    });

    manufactureLists.forEach((ele) => {
      if (ele.key === reportRouterData) {
        setExpanded('manufacturingReport');
        if (manufacturingRef && manufacturingRef.current) {
          manufacturingRef.current.scrollIntoView();
        }
      }
    });

    discountLists.forEach((ele) => {
      if (ele.key === reportRouterData) {
        setExpanded('discountReport');
        if (discountRef && discountRef.current) {
          discountRef.current.scrollIntoView();
        }
      }
    });

    warehouseLists.forEach((ele) => {
      if (ele.key === reportRouterData) {
        setExpanded('warehouseReport');
        if (warehouseRef && warehouseRef.current) {
          warehouseRef.current.scrollIntoView();
        }
      }
    });

    profitLossLists.forEach((ele) => {
      if (ele.key === reportRouterData) {
        setExpanded('profitLossReport');
        if (profitLossRef && profitLossRef.current) {
          profitLossRef.current.scrollIntoView();
        }
      }
    });

    taxList.forEach((ele) => {
      if (ele.key === reportRouterData) {
        setExpanded('taxReport');
        if (taxRef && taxRef.current) {
          taxRef.current.scrollIntoView();
        }
      }
    });

    accountsLists.forEach((ele) => {
      if (ele.key === reportRouterData) {
        setExpanded('accountsReport');
        if (accountRef && accountRef.current) {
          accountRef.current.scrollIntoView();
        }
      }
    });

    if (localStorage.getItem('isAdmin') === 'true') {
      employeeReportList.forEach((ele) => {
        if (ele.key === reportRouterData) {
          setExpanded('employeeReport');
          if (employeeRef && employeeRef.current) {
            employeeRef.current.scrollIntoView();
          }
        }
      });
    }
  }, [reportRouterData, taxList]);

  agingLists.forEach((ele) => {
    if (ele.key === reportRouterData) {
      setExpanded('agingReport');
      if (agingRef && agingRef.current) {
        agingRef.current.scrollIntoView();
      }
    }
  });

  modelNoList.forEach((ele) => {
    if (ele.key === reportRouterData) {
      setExpanded('modelNoReport');
      if (modelNoRef && modelNoRef.current) {
        modelNoRef.current.scrollIntoView();
      }
    }
  });

  serialItemLists.forEach((ele) => {
    if (ele.key === reportRouterData) {
      setExpanded('serialNoReport');
      if (serialNoRef && serialNoRef.current) {
        serialNoRef.current.scrollIntoView();
      }
    }
  });

  employeeReportList.forEach((ele) => {
    if (ele.key === reportRouterData) {
      setExpanded('employeePerformanceReport');
      if (employeePerformanceRef && employeePerformanceRef.current) {
        employeePerformanceRef.current.scrollIntoView();
      }
    }
  });

  return (
    <div className={classes.card}>
      {reportTxnEnableFieldsMap.get('accounts') && (
        <Accordion
          classes={{
            root: classes.accordionStyle,
            expanded: classes.accordionExpanded
          }}
          expanded={expanded === 'accountsReport'}
          onChange={handleChange('accountsReport')}
          elevation={0}
        >
          <AccordionSummary
            classes={{ root: classes.hedersummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
              ref={accountRef}
            >
              ACCOUNTS REPORT
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.detailRoot }}>
            <List classes={{ root: classes.detailRoot }}>
              {accountsLists.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      props.returnData(key);
                      // setReportRouterData(key);
                      setActive(key);
                    }}
                    gutterBottom
                    className={classnames([
                      classes.listH,
                      'menu-item',
                      active === key ? classes.activeList : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    <p className={classes.list}>{label}</p>
                  </Typography>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {reportTxnEnableFieldsMap.get('aging') && (
        <Accordion
          classes={{
            root: classes.accordionStyle,
            expanded: classes.accordionExpanded
          }}
          expanded={expanded === 'agingReport'}
          onChange={handleChange('agingReport')}
          elevation={0}
        >
          <AccordionSummary
            classes={{ root: classes.hedersummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
              ref={agingRef}
            >
              AGING REPORT
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.detailRoot }}>
            <List component="nav" style={{ padding: '0px' }}>
              {agingLists.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      // this.props.navigation(href, { replace: true });
                      props.returnData(key);
                      // setReportRouterData(key);
                      setActive(key);
                    }}
                    gutterBottom
                    className={classnames([
                      classes.listH,
                      'menu-item',
                      active === key ? classes.activeList : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    <p className={classes.list}>{label}</p>
                  </Typography>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {reportTxnEnableFieldsMap.get('sales') && (
        <Accordion
          classes={{
            root: classes.accordionStyle,
            expanded: classes.accordionExpanded
          }}
          expanded={expanded === 'salesReport'}
          onChange={handleChange('salesReport')}
          elevation={0}
        >
          <AccordionSummary
            classes={{ root: classes.hedersummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
              ref={salesRef}
            >
              SALES REPORT
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.detailRoot }}>
            <List component="nav" style={{ padding: '0px' }}>
              {salesLists.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      // this.props.navigation(href, { replace: true });
                      props.returnData(key);
                      // setReportRouterData(key);
                      setActive(key);
                    }}
                    gutterBottom
                    className={classnames([
                      classes.listH,
                      'menu-item',
                      active === key ? classes.activeList : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    <p className={classes.list}>{label}</p>
                  </Typography>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {localStorage.getItem('isAdmin') === 'true' &&
        reportTxnEnableFieldsMap.get('employee') && (
          <Accordion
            classes={{
              root: classes.accordionStyle,
              expanded: classes.accordionExpanded
            }}
            expanded={expanded === 'employeePerformanceReport'}
            onChange={handleChange('employeePerformanceReport')}
            elevation={0}
          >
            <AccordionSummary
              classes={{ root: classes.hedersummaryRoot }}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography
                gutterBottom
                className={classes.topHeading}
                variant="h6"
                component="h6"
                ref={employeePerformanceRef}
              >
                EMPLOYEE PERFORMANCE REPORT
              </Typography>
            </AccordionSummary>
            <AccordionDetails classes={{ root: classes.detailRoot }}>
              <List component="nav">
                {employeePerformanceLists.map(({ key, label, href }) => {
                  return (
                    <Typography
                      key={key}
                      onClick={() => {
                        props.returnData(key);
                        setActive(key);
                      }}
                      gutterBottom
                      className={classnames([
                        classes.listH,
                        'menu-item',
                        active === key ? classes.activeList : 'menu-default'
                      ])}
                      variant="h6"
                      component="h6"
                    >
                      <p className={classes.list}>{label}</p>
                    </Typography>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

      {/* {String(isJewellery).toLowerCase() === 'true' ? (
        <Accordion
          classes={{
            root: classes.accordionStyle,
            expanded: classes.accordionExpanded
          }}
          expanded={expanded === 'repairApprovalReport'}
          onChange={handleChange('repairApprovalReport')}
          elevation={0}
        >
          <AccordionSummary
            classes={{ root: classes.hedersummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
              ref={donationSevaRef}
            >
              APPROVAL REPORT
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.detailRoot }}>
            <List component="nav" style={{ padding: '0px' }}>
              {repairAndApprovalLists.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      // this.props.navigation(href, { replace: true });
                      props.returnData(key);
                      // setReportRouterData(key);
                      setActive(key);
                    }}
                    gutterBottom
                    className={classnames([
                      classes.listH,
                      'menu-item',
                      active === key ? classes.activeList : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    <p className={classes.list}>{label}</p>
                  </Typography>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ) : null} */}

      {reportTxnEnableFieldsMap.get('purchases') && (
        <Accordion
          classes={{
            root: classes.accordionStyle,
            expanded: classes.accordionExpanded
          }}
          expanded={expanded === 'purchasesReport'}
          onChange={handleChange('purchasesReport')}
          elevation={0}
        >
          <AccordionSummary
            classes={{ root: classes.hedersummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
              ref={purchaseRef}
            >
              PURCHASES REPORT
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.detailRoot }}>
            <List component="nav">
              {purchaseLists.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      props.returnData(key);
                      // setReportRouterData(key);
                      setActive(key);
                    }}
                    gutterBottom
                    className={classnames([
                      classes.listH,
                      'menu-item',
                      active === key ? classes.activeList : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    <p className={classes.list}>{label}</p>
                  </Typography>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {reportTxnEnableFieldsMap.get('returns') && (
        <Accordion
          classes={{
            root: classes.accordionStyle,
            expanded: classes.accordionExpanded
          }}
          expanded={expanded === 'returnReport'}
          onChange={handleChange('returnReport')}
          elevation={0}
        >
          <AccordionSummary
            classes={{ root: classes.hedersummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
              ref={returnRef}
            >
              RETURN REPORT
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.detailRoot }}>
            <List component="nav">
              {returnList.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      props.returnData(key);
                      // setReportRouterData(key);
                      setActive(key);
                    }}
                    gutterBottom
                    className={classnames([
                      classes.listH,
                      'menu-item',
                      active === key ? classes.activeList : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    <p className={classes.list}>{label}</p>
                  </Typography>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {reportTxnEnableFieldsMap.get('stock') && (
        <Accordion
          classes={{
            root: classes.accordionStyle,
            expanded: classes.accordionExpanded
          }}
          expanded={expanded === 'itemStockReport'}
          onChange={handleChange('itemStockReport')}
          elevation={0}
        >
          <AccordionSummary
            classes={{ root: classes.hedersummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
              ref={stockRef}
            >
              ITEM STOCK REPORT
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.detailRoot }}>
            <List component="nav">
              {stockLists.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      props.returnData(key);
                      // setReportRouterData(key);
                      setActive(key);
                    }}
                    gutterBottom
                    className={classnames([
                      classes.listH,
                      'menu-item',
                      active === key ? classes.activeList : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    <p className={classes.list}>{label}</p>
                  </Typography>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {reportTxnEnableFieldsMap.get('warehouse') && (
        <Accordion
          classes={{
            root: classes.accordionStyle,
            expanded: classes.accordionExpanded
          }}
          expanded={expanded === 'warehouseReport'}
          onChange={handleChange('warehouseReport')}
          elevation={0}
        >
          <AccordionSummary
            classes={{ root: classes.hedersummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
              ref={warehouseRef}
            >
              WAREHOUSE REPORT
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.detailRoot }}>
            <List component="nav">
              {warehouseLists.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      props.returnData(key);
                      // setReportRouterData(key);
                      setActive(key);
                    }}
                    gutterBottom
                    className={classnames([
                      classes.listH,
                      'menu-item',
                      active === key ? classes.activeList : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    <p className={classes.list}>{label}</p>
                  </Typography>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {reportTxnEnableFieldsMap.get('modelno') && (
        <Accordion
          classes={{
            root: classes.accordionStyle,
            expanded: classes.accordionExpanded
          }}
          expanded={expanded === 'modelNoReport'}
          onChange={handleChange('modelNoReport')}
          elevation={0}
        >
          <AccordionSummary
            classes={{ root: classes.hedersummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
              ref={modelNoRef}
            >
              MODEL NO REPORT
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.detailRoot }}>
            <List component="nav">
              {modelNoList.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      props.returnData(key);
                      setActive(key);
                    }}
                    gutterBottom
                    className={classnames([
                      classes.listH,
                      'menu-item',
                      active === key ? classes.activeList : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    <p className={classes.list}>{label}</p>
                  </Typography>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {reportTxnEnableFieldsMap.get('itemserial') && (
        <Accordion
          classes={{
            root: classes.accordionStyle,
            expanded: classes.accordionExpanded
          }}
          expanded={expanded === 'serialNoReport'}
          onChange={handleChange('serialNoReport')}
          elevation={0}
        >
          <AccordionSummary
            classes={{ root: classes.hedersummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
              ref={serialNoRef}
            >
              ITEM SERIAL REPORT
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.detailRoot }}>
            <List component="nav">
              {serialItemLists.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      props.returnData(key);
                      setActive(key);
                    }}
                    gutterBottom
                    className={classnames([
                      classes.listH,
                      'menu-item',
                      active === key ? classes.activeList : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    <p className={classes.list}>{label}</p>
                  </Typography>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {reportTxnEnableFieldsMap.get('discount') && (
        <Accordion
          classes={{
            root: classes.accordionStyle,
            expanded: classes.accordionExpanded
          }}
          expanded={expanded === 'discountReport'}
          onChange={handleChange('discountReport')}
          elevation={0}
        >
          <AccordionSummary
            classes={{ root: classes.hedersummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
              ref={discountRef}
            >
              DISCOUNT REPORT
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.detailRoot }}>
            <List component="nav">
              {discountLists.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      props.returnData(key);
                      // setReportRouterData(key);
                      setActive(key);
                    }}
                    gutterBottom
                    className={classnames([
                      classes.listH,
                      'menu-item',
                      active === key ? classes.activeList : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    <p className={classes.list}>{label}</p>
                  </Typography>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {reportTxnEnableFieldsMap.get('expenses') && (
        <Accordion
          classes={{
            root: classes.accordionStyle,
            expanded: classes.accordionExpanded
          }}
          expanded={expanded === 'expensesReport'}
          onChange={handleChange('expensesReport')}
          elevation={0}
        >
          <AccordionSummary
            classes={{ root: classes.hedersummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
              ref={expensesRef}
            >
              EXPENSES REPORT
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.detailRoot }}>
            <List component="nav">
              {expensesLists.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      props.returnData(key);
                      // setReportRouterData(key);
                      setActive(key);
                    }}
                    gutterBottom
                    className={classnames([
                      classes.listH,
                      'menu-item',
                      active === key ? classes.activeList : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    <p className={classes.list}>{label}</p>
                  </Typography>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {reportTxnEnableFieldsMap.get('workorder') && (
        <Accordion
          classes={{
            root: classes.accordionStyle,
            expanded: classes.accordionExpanded
          }}
          expanded={expanded === 'workOrderReport'}
          onChange={handleChange('workOrderReport')}
          elevation={0}
        >
          <AccordionSummary
            classes={{ root: classes.hedersummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
              ref={expensesRef}
            >
              WORK ORDER REPORT
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.detailRoot }}>
            <List component="nav">
              {workOrderLists.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      props.returnData(key);
                      // setReportRouterData(key);
                      setActive(key);
                    }}
                    gutterBottom
                    className={classnames([
                      classes.listH,
                      'menu-item',
                      active === key ? classes.activeList : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    <p className={classes.list}>{label}</p>
                  </Typography>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {reportTxnEnableFieldsMap.get('manufacturing') &&
      String(localStorage.getItem('isHotelOrRestaurant')).toLowerCase() ===
        'false' ? (
        <Accordion
          classes={{
            root: classes.accordionStyle,
            expanded: classes.accordionExpanded
          }}
          expanded={expanded === 'manufacturingReport'}
          onChange={handleChange('manufacturingReport')}
          elevation={0}
        >
          <AccordionSummary
            classes={{ root: classes.hedersummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
              ref={expensesRef}
            >
              MANUFACTURING REPORT
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.detailRoot }}>
            <List component="nav">
              {manufactureLists.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      props.returnData(key);
                      // setReportRouterData(key);
                      setActive(key);
                    }}
                    gutterBottom
                    className={classnames([
                      classes.listH,
                      'menu-item',
                      active === key ? classes.activeList : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    <p className={classes.list}>{label}</p>
                  </Typography>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ) : null}

      {reportTxnEnableFieldsMap.get('pandl') && (
        <Accordion
          classes={{
            root: classes.accordionStyle,
            expanded: classes.accordionExpanded
          }}
          expanded={expanded === 'profitLossReport'}
          onChange={handleChange('profitLossReport')}
          elevation={0}
        >
          <AccordionSummary
            classes={{ root: classes.hedersummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
              ref={profitLossRef}
            >
              PROFIT AND LOSS REPORT
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.detailRoot }}>
            <List component="nav">
              {profitLossLists.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      props.returnData(key);
                      // setReportRouterData(key);
                      setActive(key);
                    }}
                    gutterBottom
                    className={classnames([
                      classes.listH,
                      'menu-item',
                      active === key ? classes.activeList : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    <p className={classes.list}>{label}</p>
                  </Typography>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {reportTxnEnableFieldsMap.get('tax') && (
        <Accordion
          classes={{
            root: classes.accordionStyle,
            expanded: classes.accordionExpanded
          }}
          expanded={expanded === 'taxReport'}
          onChange={handleChange('taxReport')}
          elevation={0}
        >
          <AccordionSummary
            classes={{ root: classes.hedersummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
              ref={taxRef}
            >
              TAX REPORT
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.detailRoot }}>
            <List component="nav">
              {taxList.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      props.returnData(key);
                      // setReportRouterData(key);
                      setActive(key);
                    }}
                    gutterBottom
                    className={classnames([
                      classes.listH,
                      'menu-item',
                      active === key ? classes.activeList : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    <p className={classes.list}>{label}</p>
                  </Typography>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {localStorage.getItem('isAdmin') === 'true' &&
      localStorage.getItem('planName') !== 'Starter' &&
      reportTxnEnableFieldsMap.get('employee') ? (
        <Accordion
          classes={{
            root: classes.accordionStyle,
            expanded: classes.accordionExpanded
          }}
          expanded={expanded === 'employeeReport'}
          onChange={handleChange('employeeReport')}
          elevation={0}
        >
          <AccordionSummary
            classes={{ root: classes.hedersummaryRoot }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
              ref={employeeRef}
            >
              EMPLOYEE REPORT
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.detailRoot }}>
            <List component="nav">
              {employeeReportList.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      props.returnData(key);
                      // setReportRouterData(key);
                      setActive(key);
                    }}
                    gutterBottom
                    className={classnames([
                      classes.listH,
                      'menu-item',
                      active === key ? classes.activeList : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    <p className={classes.list}>{label}</p>
                  </Typography>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ) : null}
    </div>
  );
};

export default InjectObserver(ReportsList);
