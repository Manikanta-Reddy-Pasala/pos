import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { Typography } from '@material-ui/core';
import classnames from 'classnames';

const printSettingsLists = [
  {
    href: '/app/settings/invoice',
    label: 'Invoice Print',
    key: 'invoice'
  },
  {
    href: '/app/settings/cloud_print',
    label: 'Cloud Print',
    key: 'cloud_print'
  }
];

const taxAndGstSettingsLists = [
  {
    href: '/app/settings/tax_gst',
    label: 'Taxes & GST',
    key: 'tax_gst'
  },
  {
    href: '/app/settings/tcs_settings',
    label: 'TCS',
    key: 'tcs_settings'
  },
  {
    href: '/app/settings/tds_settings',
    label: 'TDS',
    key: 'tds_settings'
  }
];

const alertSettingsLists = [
  {
    href: '/app/settings/whatsapp_settings',
    label: 'WhatsApp Settings',
    key: 'whatsapp_settings'
  }
];

const userSettingsLists = [
  {
    href: '/app/settings/user_settings',
    label: 'User Settings',
    key: 'user_settings'
  }
];

const transactionSettingsLists = [
  {
    href: '/app/settings/generaltransactionsetting',
    label: 'General Transactions',
    key: 'generaltransactionsetting'
  },
  {
    href: '/app/settings/transactionsetting',
    label: 'Prefix Transactions',
    key: 'transactionsetting'
  },
  {
    href: '/app/settings/sales_settings',
    label: 'Sale Transactions',
    key: 'sales_settings'
  },
  {
    href: '/app/settings/sale_quotation_settings',
    label: 'Sale Quotation Transactions',
    key: 'sale_quotation_settings'
  },
  {
    href: '/app/settings/purchase_settings',
    label: 'Purchase Transactions',
    key: 'purchase_settings'
  },
  {
    href: '/app/settings/purchase_order_settings',
    label: 'Purchase Order Transactions',
    key: 'purchase_order_settings'
  },
  {
    href: '/app/settings/delivery_challan_settings',
    label: 'Delivery Challan Transactions',
    key: 'delivery_challan_settings'
  },
  {
    href: '/app/settings/sale_order_settings',
    label: 'Sale Order Transactions',
    key: 'sale_order_settings'
  },
  {
    href: '/app/settings/jobworkin_settings',
    label: 'Job Work In Transactions',
    key: 'jobworkin_settings'
  },
  {
    href: '/app/settings/expense_settings',
    label: 'Expense Transactions',
    key: 'expense_settings'
  },
  {
    href: '/app/settings/product_settings',
    label: 'Product',
    key: 'product_settings'
  }
];

if (String(localStorage.getItem('isJewellery')).toLowerCase() === 'true') {
  transactionSettingsLists.splice(2, 0, {
    href: '/app/settings/approval_settings',
    label: 'Approval Transactions',
    key: 'approval_settings'
  });
}

const styles = (theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#303030'
  },
  default: {
    backgroundColor: 'red',
    color: 'grey'
  },
  active: {
    backgroundColor: '#000000',
    color: '#FFFFFF'
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
  topHeading: {
    padding: '10px',
    fontSize: '12px',
    fontWeight: 'bold',
    background: '#F7F8FA',
    color: 'black',
    textAlign: 'start'
  }
});

class PrinterNavigation extends React.Component {
  state = { open: {} };

  render() {
    const { classes, active } = this.props;

    return (
      <div className={classes.card}>
        <Typography
          gutterBottom
          className={classes.topHeading}
          variant="h6"
          component="h6"
        >
          PRINT SETTINGS
        </Typography>

        <List component="nav" style={{ padding: '10px', textAlign: 'start' }}>
          {printSettingsLists.map(({ key, label, href }) => {
            return (
              <Typography
                key={key}
                onClick={() => {
                  this.props.navigation(href, { replace: true });
                }}
                gutterBottom
                className={classnames([
                  classes.cardLists,
                  'menu-item',
                  active === key ? 'menu-active' : 'menu-default'
                ])}
                variant="h6"
                component="h6"
              >
                {label}
              </Typography>
            );
          })}
        </List>

        <Typography
          gutterBottom
          className={classes.topHeading}
          variant="h6"
          component="h6"
        >
          TRANSACTION SETTINGS
        </Typography>

        <List component="nav" style={{ padding: '10px', textAlign: 'start' }}>
          {transactionSettingsLists.map(({ key, label, href }) => {
            return (
              <Typography
                key={key}
                onClick={() => {
                  this.props.navigation(href, { replace: true });
                }}
                gutterBottom
                className={classnames([
                  classes.cardLists,
                  'menu-item',
                  active === key ? 'menu-active' : 'menu-default'
                ])}
                variant="h6"
                component="h6"
              >
                {label}
              </Typography>
            );
          })}
        </List>

        <Typography
          gutterBottom
          className={classes.topHeading}
          variant="h6"
          component="h6"
        >
          TAX & GST SETTINGS
        </Typography>

        <List component="nav" style={{ padding: '10px', textAlign: 'start' }}>
          {taxAndGstSettingsLists.map(({ key, label, href }) => {
            return (
              <Typography
                key={key}
                onClick={() => {
                  this.props.navigation(href, { replace: true });
                }}
                gutterBottom
                className={classnames([
                  classes.cardLists,
                  'menu-item',
                  active === key ? 'menu-active' : 'menu-default'
                ])}
                variant="h6"
                component="h6"
              >
                {label}
              </Typography>
            );
          })}
        </List>

        {localStorage.getItem('isAdmin') === 'true' && (
          <>
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
            >
              USER SETTINGS
            </Typography>

            <List
              component="nav"
              style={{ padding: '10px', textAlign: 'start' }}
            >
              {userSettingsLists.map(({ key, label, href }) => {
                return (
                  <Typography
                    key={key}
                    onClick={() => {
                      this.props.navigation(href, { replace: true });
                    }}
                    gutterBottom
                    className={classnames([
                      classes.cardLists,
                      'menu-item',
                      active === key ? 'menu-active' : 'menu-default'
                    ])}
                    variant="h6"
                    component="h6"
                  >
                    {label}
                  </Typography>
                );
              })}
            </List>
          </>
        )}

        <Typography
          gutterBottom
          className={classes.topHeading}
          variant="h6"
          component="h6"
        >
          ALERT SETTINGS
        </Typography>

        <List component="nav" style={{ padding: '10px', textAlign: 'start' }}>
          {alertSettingsLists.map(({ key, label, href }) => {
            return (
              <Typography
                key={key}
                onClick={() => {
                  this.props.navigation(href, { replace: true });
                }}
                gutterBottom
                className={classnames([
                  classes.cardLists,
                  'menu-item',
                  active === key ? 'menu-active' : 'menu-default'
                ])}
                variant="h6"
                component="h6"
              >
                {label}
              </Typography>
            );
          })}
        </List>
      </div>
    );
  }
}

PrinterNavigation.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PrinterNavigation);