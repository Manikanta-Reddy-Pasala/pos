import {
  getSaleName,
  getCustomerName,
  getProductName
} from 'src/names/constants';
export default function getMenuList() {
  let lists = [];

  let isResturant = localStorage.getItem('isHotelOrRestaurant');
  let isJewellery = localStorage.getItem('isJewellery');
  let isAdmin = localStorage.getItem('isAdmin');
  let showAudit = localStorage.getItem('showAudit');
  let enableEway = localStorage.getItem('enableEway');
  let enableEinvoice = localStorage.getItem('enableEinvoice');
  let enableCustomer = localStorage.getItem('enableCustomer');
  let enableVendor = localStorage.getItem('enableVendor');
  let isManufacture = localStorage.getItem('isManufacture');
  let isClinic = localStorage.getItem('isClinic');

  lists = [
    {
      href: '/app/dashboard',
      icon: 'dashboard_grey',
      activeicon: 'dashboard_white',
      label: 'Dashboard',
      key: 'dashboard',
      active: 'true'
    },
    {
      href: '/app/purchases',
      icon: 'purchase_grey',
      activeicon: 'purchase_white',
      label: 'Purchases',
      key: 'purchases',

      items: [
        {
          label: 'Purchases Bill',
          href: '/app/purchases',
          key: 'purchaseBill'
        },
        {
          label: 'Payment Out',
          href: '/app/paymentOut',
          key: 'paymentOut'
        },
        {
          label: 'Purchases Return',
          href: '/app/purchaseReturn',
          key: 'purchaseReturn'
        },
        {
          label: 'Purchase Order',
          href: '/app/purchaseOrder',
          key: 'purchaseOrder'
        },
        {
          label: 'Procurement',
          href: '/app/backToBackPurchase',
          key: 'backToBackPurchase'
        }
      ]
    },
    {
      href: '/app/addStock',
      icon: 'purchase_grey',
      activeicon: 'purchase_white',
      label: 'Stock Mgmt',
      key: 'stock',
      items: [
        {
          label: 'Add Stock',
          href: '/app/addStock',
          key: 'addStock'
        },
        {
          label: 'Remove Stock',
          href: '/app/reduceStock',
          key: 'reduceStock'
        },
        {
          label: 'Damaged Stock',
          href: '/app/damagedStock',
          key: 'damagedStock'
        },
        {
          label: 'Stock Summary',
          href: '/app/stockDetails',
          key: 'stockDetails'
        },
        /*,
        {
          label: 'Move Stock',
          href: '/app/moveStock',
          key: 'moveStock'
        }*/
      ]
    },
    {
      href: '/app/Expense',
      icon: 'exp_grey',
      activeicon: 'exp_white',
      label: 'Expenses',
      key: 'expenses',
      divider: true,
      items: []
    },
    // {
    //   href: '/app/Contra',
    //   icon: 'exp_grey',
    //   activeicon: 'exp_white',
    //   label: 'Contra',
    //   key: 'contra',
    //   divider: true,
    //   items: []
    // },
    {
      href: '/app/Cash',
      icon: 'cash_grey',
      activeicon: 'cash_white',
      label: 'Cash and Bank',
      key: 'cash',
      items: [
        {
          label: 'Cash',
          href: '/app/Cash',
          key: 'cash'
        },
        {
          label: 'Bank',
          href: '/app/Bank',
          key: 'bank'
        },
        {
          label: 'Cheque',
          href: '/app/Cheque',
          key: 'cheque'
        }
      ]
    },
    // {
    //   href: '/app/BackupAndRestore',
    //   icon: 'backup_grey',
    //   activeicon: 'backup_white',
    //   label: 'Backup And Restore',
    //   key: 'backupAndRestore'
    // },
    {
      href: '/app/TallyExport',
      icon: 'tally_grey',
      activeicon: 'tally_white',
      label: 'Export to 3rd Party',
      key: 'tallyExport',
      items: [
        {
          label: 'Tally',
          href: '/app/TallyExport',
          key: 'tallyExport'
        }
      ]
    },
    {
      href: '/app/retrieveDeletedData',
      icon: 'tally_grey',
      activeicon: 'tally_white',
      label: 'Accounting & Audit',
      key: 'accountingData',

      items: [
        {
          label: 'Deleted Invoices',
          href: '/app/retrieveDeletedData',
          key: 'retrieveDeletedData'
        },
        {
          label: 'Cancelled Invoices',
          href: '/app/cancelledData',
          key: 'cancelledData'
        },
        {
          label: 'Amended Invoices',
          href: '/app/amendedData',
          key: 'amendedData'
        },
        {
          label: 'Audit Settings',
          href: '/app/auditSettings',
          key: 'auditSettings'
        },
        {
          label: 'Accounting Notes',
          href: '/app/accountingNotes',
          key: 'accountingNotes'
        },
        {
          label: 'Audit Trail',
          href: '/app/auditTrail',
          key: 'auditTrail'
        },
        {
          label: 'Reports',
          href: '/app/auditreports',
          key: 'auditreports'
        }
      ]
    },
    {
      href: '/app/Reports',
      icon: 'report_grey',
      activeicon: 'report_white',
      label: 'Reports',
      key: 'reports'
    },
    {
      href: '/app/gstr1OnlineData',
      icon: 'report_grey',
      activeicon: 'report_white',
      label: 'GSTR Filings',
      key: 'gst',
      items: [
        // {
        //   label: 'DASHBOARD',
        //   href: '/app/gstrDashboard',
        //   key: 'gstrDashboard'
        // },
        {
          label: 'GSTR1',
          href: '/app/gstr1OnlineData',
          key: 'gstr1OnlineData'
        },
        {
          label: 'GSTR2A',
          href: '/app/gstr2a',
          key: 'gstr2a'
        },
        {
          label: 'GSTR2B',
          href: '/app/gstr2b',
          key: 'gstr2b'
        },
        {
          label: 'BOOKS v/s 2A/2B',
          href: '/app/gstr2a2brec',
          key: 'gstr2a2brec'
        },
        {
          label: 'GSTR - 3B (Beta)',
          href: '/app/gstr3b',
          key: 'gstr3b'
        }
        // {
        //   label: 'Ledger Balance',
        //   href: '/app/ledgerBalance',
        //   key: 'ledgerBalance'
        // }
      ]
    },
    {
      href: '/app/dashboardProductsExcel',
      icon: 'import_grey',
      activeicon: 'import_white',
      label: 'Import and Export',
      key: 'dashboardProductsExcel',

      items: [
        {
          label: getProductName(),
          href: '/app/dashboardProductsExcel',
          key: 'dashboardProductsExcel'
        },
        {
          label: getCustomerName(),
          href: '/app/dashboardCustomersExcel',
          key: 'dashboardCustomersExcel'
        },
        {
          label: 'Vendors',
          href: '/app/dashboardVendorsExcel',
          key: 'dashboardVendorsExcel'
        }
      ]
    },
    {
      href: '/app/barcodePrinter',
      icon: 'barcode_grey',
      activeicon: 'barcode_white',
      label: 'Barcode and Label',
      key: 'barcode'
    },
    {
      href: '/app/settings',
      icon: 'settings_grey',
      activeicon: 'settings_white',
      label: 'Settings',
      key: 'settings',

      items: [
        {
          label: 'Print Settings',
          href: '/app/printSettings',
          key: 'printSettings'
        },
        {
          label: 'General Settings',
          href: '/app/generalSettings',
          key: 'generalSettings'
        },
        {
          label: 'Transaction Settings',
          href: '/app/transactionSettings',
          key: 'transactionSettings'
        },
        {
          label: 'Tax Settings',
          href: '/app/taxSettings',
          key: 'taxSettings'
        },
        {
          label: 'User Settings',
          href: '/app/userSettings',
          key: 'userSettings'
        },
        {
          label: 'Alert Settings',
          href: '/app/alertSettings',
          key: 'alertSettings'
        },
        {
          label: 'Payment Mode Settings',
          href: '/app/paymentModeSettings',
          key: 'paymentModeSettings'
        },
        {
          label: 'Reminder Settings',
          href: '/app/reminderSettings',
          key: 'reminderSettings'
        }
      ]
    },
    {
      href: '/app/loyaltymanagement',
      icon: 'employee',
      activeicon: 'employee_white',
      label: 'Loyalty Management',
      key: 'loyaltyManagement'
    },
    {
      href: '/app/closeFinancialYear',
      icon: 'tally_grey',
      activeicon: 'tally_white',
      label: 'Close Financial Year',
      key: 'closeFinancialYear'
    },
    {
      href: '/app/updateApp',
      icon: 'update_grey',
      activeicon: 'update_white',
      label: 'Whats New',
      key: 'updateApp'
    }
  ];

  if (String(isJewellery).toLowerCase() === 'true') {
    lists.splice(1, 0, {
      href: '/app/sales',
      icon: 'sale_grey',
      activeicon: 'sale_white',
      label: 'Sales',
      key: 'sales',

      items: [
        {
          label: 'Sales Invoices',
          href: '/app/sales',
          key: 'salesinvoice'
        },
        {
          label: 'Payment In',
          href: '/app/payment',
          key: 'paymentin'
        },
        {
          label: 'Sales Return',
          href: '/app/salesreturn',
          key: 'salesreturn'
        },
        {
          label: 'Sales Quotation',
          href: '/app/salesquotation',
          key: 'salesquotation'
        },
        {
          label: 'Sale Order',
          href: '/app/saleorder',
          key: 'saleorder'
        },
        {
          label: 'Delivery Challan',
          href: '/app/deliverychallan',
          key: 'deliverychallan'
        },
        {
          label: 'Approval',
          href: '/app/approval',
          key: 'approval'
        }
      ]
    });
  } else {
    lists.splice(1, 0, {
      href: '/app/sales',
      icon: 'sale_grey',
      activeicon: 'sale_white',
      label: 'Sales',
      key: 'sales',

      items: [
        {
          label: getSaleName(),
          href: '/app/sales',
          key: 'salesinvoice'
        },
        {
          label: 'Payment In',
          href: '/app/payment',
          key: 'paymentin'
        },
        {
          label: 'Sales Return',
          href: '/app/salesreturn',
          key: 'salesreturn'
        },
        {
          label: 'Sales Quotation',
          href: '/app/salesquotation',
          key: 'salesquotation'
        },
        {
          label: 'Sale Order',
          href: '/app/saleorder',
          key: 'saleorder'
        },
        {
          label: 'Delivery Challan',
          href: '/app/deliverychallan',
          key: 'deliverychallan'
        }
      ]
    });
  }

  if (String(isResturant).toLowerCase() === 'true') {
    lists.splice(3, 0, {
      href: '/app/products',
      icon: 'product_grey',
      activeicon: 'product_white',
      label: getProductName(),
      key: 'product',

      items: [
        {
          label: 'Create Product',
          href: '/app/products',
          key: 'createProduct'
        },
        {
          label: 'Create Product Groups',
          href: '/app/productGroups',
          key: 'productGroups'
        },
        {
          label: 'Add Ons',
          href: '/app/addOns',
          key: 'addOns'
        },
        {
          label: 'Warehouse',
          href: '/app/warehouse',
          key: 'warehouse'
        }
      ]
    });
  } else {
    lists.splice(3, 0, {
      href: '/app/products',
      icon: 'product_grey',
      activeicon: 'product_white',
      label: getProductName(),
      key: 'product',

      items: [
        {
          label: 'Create Product',
          href: '/app/products',
          key: 'createProduct'
        },
        {
          label: 'Create Product Groups',
          href: '/app/productGroups',
          key: 'productGroups'
        },
        {
          label: 'Create Serial Items',
          href: '/app/serialItem',
          key: 'serialItem'
        },
        {
          label: 'Add Ons',
          href: '/app/addOns',
          key: 'addOns'
        },
        {
          label: 'Warehouse',
          href: '/app/warehouse',
          key: 'warehouse'
        }
      ]
    });
  }

  if (String(isResturant).toLowerCase() === 'true') {
    lists.splice(5, 0, {
      href: '/app/kot',
      icon: 'kot_grey',
      activeicon: 'kot_white',
      label: 'KOT',
      key: 'kot',
      active: 'true'
    });
  }

  if (String(enableCustomer).toLowerCase() === 'true') {
    lists.splice(6, 0, {
      href: '/app/Customer',
      icon: 'customer_grey',
      activeicon: 'customer_white',
      label: getCustomerName(),
      key: 'customers'
    });
  }

  if (String(enableVendor).toLowerCase() === 'true') {
    lists.splice(7, 0, {
      href: '/app/Vendor',
      icon: 'vendor_grey',
      activeicon: 'vendor_white',
      label: 'Vendor',
      key: 'vendors'
    });
  }

  if (localStorage.getItem('isTemple') === 'true') {
    lists.splice(
      9,
      0,
      {
        href: '/app/special_days_management',
        icon: 'special_days_grey',
        activeicon: 'special_days_white',
        label: 'Special Days',
        key: 'special_days_management',
        active: 'true'
      },
      {
        href: '/app/customer_special_days_report',
        icon: 'customer_special_days_grey',
        activeicon: 'customer_special_days_white',
        label: 'Customer Special Days',
        key: 'customer_special_days_report',
        active: 'true'
      }
    );
  }

  if (String(isAdmin).toLowerCase() === 'true') {
    lists.splice(8, 0, {
      href: '/app/employeeType',
      icon: 'employee',
      activeicon: 'employee_white',
      label: 'Employee',
      key: 'employees',
      items: [
        {
          label: 'Employee Type',
          href: '/app/employeeType',
          key: 'employeeType'
        },
        {
          label: 'Create Employee',
          href: '/app/Employee',
          key: 'employee'
        }
      ]
    });
  }

  if (String(isClinic).toLowerCase() === 'true') {
    if (String(isAdmin).toLowerCase() === 'true') {
      lists.splice(8, 0, {
        href: '/app/sessionGroup',
        icon: 'dashboard_grey',
        activeicon: 'dashboard_white',
        label: 'Session Group',
        key: 'sessionGroup',
        items: [
          {
            label: 'Add Sessions',
            href: '/app/sessionGroup',
            key: 'sessionGroup'
          },
          {
            label: 'Sessions',
            href: '/app/doctorsSessions',
            key: 'doctorsSessions'
          }
        ]
      });
    } else {
      lists.splice(8, 0, {
        href: '/app/doctorsSessions',
        icon: 'dashboard_grey',
        activeicon: 'dashboard_white',
        label: 'Session Group',
        key: 'doctorsSessions',
        items: [
          {
            label: 'Sessions',
            href: '/app/doctorsSessions',
            key: 'doctorsSessions'
          }
        ]
      });
    }
  }

  if (
    String(enableEway).toLowerCase() === 'true' &&
    String(enableEway).toLowerCase() === 'true'
  ) {
    lists.splice(12, 0, {
      href: '/app/eway',
      icon: 'e_way_grey',
      activeicon: 'e_way_white',
      label: 'E-Way',
      key: 'eway'
    });
  }

  if (
    String(enableEinvoice).toLowerCase() === 'true' &&
    String(enableEinvoice).toLowerCase() === 'true'
  ) {
    lists.splice(13, 0, {
      href: '/app/einvoice',
      icon: 'e_invoice_grey',
      activeicon: 'e_invoice_white',
      label: 'E-Invoice',
      key: 'einvoice'
    });
  }

  if (
    String(isResturant).toLowerCase() === 'false' &&
    String(isJewellery).toLowerCase() === 'false' &&
    String(isClinic).toLowerCase() === 'false' &&
    String(localStorage.getItem('isTemple')).toLowerCase() === 'false'
  ) {
    lists.splice(5, 0, {
      href: '/app/rawmaterials',
      icon: 'product_grey',
      activeicon: 'product_white',
      label: 'Manufacture',
      key: 'manufacture',

      items: [
        {
          label: 'Raw Materials',
          href: '/app/rawmaterials',
          key: 'rawmaterials'
        },
        {
          label: 'BOM (Bill Of Materials)',
          href: '/app/billofmaterials',
          key: 'billofmaterials'
        },
        {
          href: '/app/manufacture',
          label: 'Manufacture',
          key: 'manufacture'
        },
        {
          href: '/app/manufacturedirectexpenses',
          label: 'Manufacture Direct Exp',
          key: 'manufacturedirectexpenses'
        }
      ]
    });
  }

  if (String(isJewellery).toLowerCase() === 'true') {
    lists.splice(
      6,
      0,
      {
        href: '/app/rates',
        icon: 'rate_icon_grey',
        activeicon: 'rate_icon_white',
        label: 'Rates',
        key: 'rates'
      },
      {
        href: '/app/jobWorkIn',
        icon: 'job_work_grey',
        activeicon: 'job_work_white',
        label: 'Job Work',
        key: 'jobWork',

        items: [
          {
            label: 'Job Work Order - In',
            href: '/app/jobWorkIn',
            key: 'jobWorkIn'
          },
          {
            label: 'Job Work Order - Out',
            href: '/app/jobwork',
            key: 'OrderInvoice'
          },
          {
            label: 'Work Order Receipt',
            href: '/app/OrderReceipt',
            key: 'OrderReceipt'
          }
        ]
      },
      {
        href: '/app/schemeTypes',
        icon: 'scheme_grey',
        activeicon: 'scheme_white',
        label: 'Scheme Mgmt',
        key: 'schememanagement',

        items: [
          {
            label: 'Scheme Types',
            href: '/app/schemeTypes',
            key: 'schemeTypes'
          },
          {
            label: 'Scheme Management',
            href: '/app/schememanagement',
            key: 'schememanagement'
          }
        ]
      }
    );
  } else if (
    String(isJewellery).toLowerCase() === 'false' &&
    String(isResturant).toLowerCase() === 'false' &&
    String(isClinic).toLowerCase() === 'false' &&
    String(localStorage.getItem('isTemple')).toLowerCase() === 'false'
  ) {
    lists.splice(6, 0, {
      href: '/app/jobWorkIn',
      icon: 'job_work_grey',
      activeicon: 'job_work_white',
      label: 'Job Work',
      key: 'jobWork',

      items: [
        {
          label: 'Job Work Order - In',
          href: '/app/jobWorkIn',
          key: 'jobWorkIn'
        }
      ]
    });
  }

  return lists;
}