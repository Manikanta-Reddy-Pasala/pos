import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { Typography } from '@material-ui/core';
import classnames from 'classnames';

let generalSettingsLists = [
  {
    href: '/app/settings/generaltransactionsetting',
    label: 'General',
    key: 'generaltransactionsetting'
  },
  {
    href: '/app/settings/transactionsetting',
    label: 'Prefix',
    key: 'transactionsetting'
  },
  {
    href: '/app/settings/multidevicesetting',
    label: 'Multi Device',
    key: 'multidevicesetting'
  },
  {
    href: '/app/settings/product_settings',
    label: 'Product',
    key: 'product_settings'
  },
  {
    href: '/app/settings/report_settings',
    label: 'Report',
    key: 'report_settings'
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

class GeneralSettingsNavigation extends React.Component {
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
          GENERAL
        </Typography>

        <List component="nav" style={{ padding: '10px', textAlign: 'start' }}>
          {generalSettingsLists.map(({ key, label, href }) => {
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

GeneralSettingsNavigation.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GeneralSettingsNavigation);