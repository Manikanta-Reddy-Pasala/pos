import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { Typography } from '@material-ui/core';
import classnames from 'classnames';

let purchaseSettingsLists = [
  {
    href: '/app/settings/purchase_settings',
    label: 'Purchase',
    key: 'purchase_settings'
  },
  {
    href: '/app/settings/payment_out_settings',
    label: 'Payment Out',
    key: 'payment_out_settings'
  },
  {
    href: '/app/settings/purchase_order_settings',
    label: 'Purchase Order',
    key: 'purchase_order_settings'
  },
  {
    href: '/app/settings/expense_settings',
    label: 'Expense',
    key: 'expense_settings'
  }
];

let approvalSettingsList = [
  {
    href: '/app/settings/approval_settings',
    label: 'Approval',
    key: 'approval_settings'
  }
];

let kotSettingsList = [
  {
    href: '/app/settings/kot_settings',
    label: 'KOT',
    key: 'kot_settings'
  }
];

let saleSettingsLists = [
  {
    href: '/app/settings/sales_settings',
    label: 'Sale',
    key: 'sales_settings'
  },
  {
    href: '/app/settings/payment_in_settings',
    label: 'Payment In',
    key: 'payment_in_settings'
  },
  {
    href: '/app/settings/sale_quotation_settings',
    label: 'Sale Quotation',
    key: 'sale_quotation_settings'
  },
  {
    href: '/app/settings/sale_order_settings',
    label: 'Sale Order',
    key: 'sale_order_settings'
  },
  {
    href: '/app/settings/delivery_challan_settings',
    label: 'Delivery Challan',
    key: 'delivery_challan_settings'
  },
  {
    href: '/app/settings/jobworkin_settings',
    label: 'Job Work In',
    key: 'jobworkin_settings'
  }
];

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

class TransactionSettingsNavigation extends React.Component {
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
          SALE
        </Typography>

        <List component="nav" style={{ padding: '10px', textAlign: 'start' }}>
          {saleSettingsLists.map(({ key, label, href }) => {
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

        {String(localStorage.getItem('isJewellery')).toLowerCase() ===
          'true' && (
          <>
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
            >
              APPROVAL
            </Typography>

            <List
              component="nav"
              style={{ padding: '10px', textAlign: 'start' }}
            >
              {approvalSettingsList.map(({ key, label, href }) => {
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

        {String(localStorage.getItem('isHotelOrRestaurant')).toLowerCase() ===
          'true' && (
          <>
            <Typography
              gutterBottom
              className={classes.topHeading}
              variant="h6"
              component="h6"
            >
              KOT
            </Typography>

            <List
              component="nav"
              style={{ padding: '10px', textAlign: 'start' }}
            >
              {kotSettingsList.map(({ key, label, href }) => {
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
          PURCHASE
        </Typography>

        <List component="nav" style={{ padding: '10px', textAlign: 'start' }}>
          {purchaseSettingsLists.map(({ key, label, href }) => {
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

TransactionSettingsNavigation.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TransactionSettingsNavigation);