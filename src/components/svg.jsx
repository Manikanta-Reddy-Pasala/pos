import React from 'react';
import expensesGrey from '../icons/svg/exp_grey.svg'
import expensesWhite from '../icons/svg/exp_white.svg';
import dashboardGrey from '../icons/svg/dashboard_grey.svg';
import dashboardWhite from '../icons/svg/dashboard_white.svg';
import purchaseGrey from '../icons/svg/purchase_grey.svg';
import purchaseWhite from '../icons/svg/purchase_white.svg';
import vendorGrey from '../icons/svg/vendor_grey.svg';
import vendorWhite from '../icons/svg/vendor_white.svg';
import saleGrey from '../icons/svg/sale_grey.svg';
import saleWhite from '../icons/svg/sale_white.svg';
import productGrey from '../icons/svg/product_grey.svg';
import productWhite from '../icons/svg/product_white.svg';
import customerGrey from '../icons/svg/customer_grey.svg';
import customerWhite from '../icons/svg/customer_white.svg';
import backup_white from '../icons/svg/backup_white.svg';
import backup_grey from '../icons/svg/backup_grey.svg';
import reportGrey from '../icons/svg/report.svg';
import reportWhite from '../icons/svg/report_white.svg';
import tallyGrey from '../icons/svg/tally_grey.svg';
import tallyWhite from '../icons/svg/tally_white.svg';
import settingGrey from '../icons/svg/settings_grey.svg';
import settingWhite from '../icons/svg/settings_whie.svg';
import collapseGrey from '../icons/svg/Collapse.svg';
import expanGrey from '../icons/svg/expand.svg';
import payableWhite from '../icons/svg/to_pay.svg';
import receiveWhite from '../icons/svg/receive.svg';
import saleInvoice from '../icons/svg/sale_invoice.svg';
import cashGrey from '../icons/svg/cash_grey.svg';
import cashWhite from '../icons/svg/cash_white.svg';
import barcode from '../icons/svg/barcode.svg';
import kotGrey from '../icons/svg/kot_grey.svg';
import kotWhite from '../icons/svg/kot_white.svg';
import updateGrey from '../icons/svg/alert_grey.svg';
import updateWhite from '../icons/svg/alert_white.svg';
import newIcon from '../icons/svg/New.svg';
import employee from '../icons/svg/employee.svg';
import employeeWhite from '../icons/svg/employee_white.svg';
import specialDaysGrey from '../icons/svg/grey_special_days.svg';
import specialDaysWhite from '../icons/svg/white_special_days.svg';
import customerSpecialDaysGrey from '../icons/svg/customer_special_grey.svg';
import customerSpecialDaysWhite from '../icons/svg/customer_special_white.svg';
import barcodeGrey from '../icons/svg/barcode_grey_lable.svg';
import barcodeWhite from '../icons/svg/barcode_white_lable.svg';
import jobWorkGrey from '../icons/svg/job_work_grey.svg';
import jobWorkWhite from '../icons/svg/job_work_white.svg';
import schemeManagementGrey from '../icons/svg/scheme_grey.svg';
import schemeManagementWhite from '../icons/svg/scheme_white.svg';
import importGrey from '../icons/svg/import_grey.svg';
import importWhite from '../icons/svg/import_white.svg';
import ewayGrey from '../icons/svg/e_way_grey.svg';
import ewayWhite from '../icons/svg/e_way_white.svg';
import rateWhite from '../icons/svg/rate_icon_white.svg';
import rateGrey from '../icons/svg/rate_icon_grey.svg';
import einvoiceGrey from '../icons/svg/e_invoice_grey.svg';
import einvoiceWhite from '../icons/svg/e_invoice_white.svg';

const iconTypes = {
    sale_invoice                 : saleInvoice,
    receive_white                : receiveWhite,
    payable_white                : payableWhite,
    collapse                     : collapseGrey,
    expand                       : expanGrey,
    settings_grey                : settingGrey,
    settings_white               : settingWhite,
    exp_grey                     : expensesGrey,
    exp_white                    : expensesWhite,
    vendor_grey                  : vendorGrey,
    vendor_white                 : vendorWhite,
    dashboard_grey               : dashboardGrey,
    dashboard_white              : dashboardWhite,
    sale_grey                    : saleGrey,
    sale_white                   : saleWhite,
    purchase_grey                : purchaseGrey,
    purchase_white               : purchaseWhite,
    product_grey                 : productGrey,
    product_white                : productWhite,
    customer_grey                : customerGrey,
    customer_white               : customerWhite,
    backup_white                 : backup_white,
    backup_grey                  : backup_grey,
    report_grey                  : reportGrey,
    report_white                 : reportWhite,
    tally_grey                   : tallyGrey,
    tally_white                  : tallyWhite,
    cash_grey                    : cashGrey,
    cash_white                   : cashWhite,
    barcode                      : barcode,
    kot_grey                     : kotGrey,
    kot_white                    : kotWhite,
    update_grey                  : updateGrey,
    update_white                 : updateWhite,
    newIcon                      : newIcon,
    employee                     : employee,
    employee_white               : employeeWhite,
    special_days_grey            : specialDaysGrey,
    special_days_white           : specialDaysWhite,
    customer_special_days_grey   : customerSpecialDaysGrey,
    customer_special_days_white  : customerSpecialDaysWhite,
    barcode_grey                 : barcodeGrey,
    barcode_white                : barcodeWhite,
    job_work_grey                : jobWorkGrey,
    job_work_white               : jobWorkWhite,
    scheme_grey                  : schemeManagementGrey,
    scheme_white                 : schemeManagementWhite,
    import_grey                  : importGrey,
    import_white                 : importWhite,
    e_way_grey                   : ewayGrey,
    e_way_white                  : ewayWhite,
    rate_icon_grey               : rateGrey,
    rate_icon_white              : rateWhite,
    e_invoice_grey               : einvoiceGrey,
    e_invoice_white              : einvoiceWhite
};

const Icons = (props) =>
{
    let Icon = iconTypes[props.icon];
  return (
    <img
      alt='icon'
      src={Icon}
      width='20px'
      height='20px'
      style={{ marginRight: '18px' }}
      {...props}
    />
  );
};
export default Icons;