import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { NavLink } from 'react-router-dom';
import { Divider } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import Svg from '../../components/svg';
import eventBus from '../../components/events/EventBus';

const styles = (theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'red'
  },

  // active: {
  //     backgroundColor: "#000000",
  //     color: "#FFFFFF",
  // },
  listItemTextparent: {
    color: '#BEBEBE',
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    fontSize: 13
  },
  listItemTextparentselected: {
    color: '#FFFFFF',
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    fontSize: 13
  },
  listItemClicked: {
    // backgroundColor:"#131419",
    textcolor: '#EF5350',
    color: '#EF5350',
    fontSize: 10,
    marginLeft: '25%',
    fontFamily: 'Nunito Sans, Roboto, sans-serif'
  },
  listItemNotClicked: {
    textcolor: '#BEBEBE',
    color: '#BEBEBE',
    fontSize: 10,
    marginLeft: '25%',
    fontFamily: 'Nunito Sans, Roboto, sans-serif'
  },

  childListItemClicked: {
    // backgroundColor:"#131419",
    textcolor: '#EF5350',
    color: '#4a83fb',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: '8%',
    fontFamily: 'Nunito Sans, Roboto, sans-serif'
  },
  childListpurchaseItemClicked: {
    // backgroundColor:"#131419",
    textcolor: '#9DCB6A',
    color: '#9DCB6A',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: '8%',
    fontFamily: 'Nunito Sans, Roboto, sans-serif'
  },
  childListItemNotClicked: {
    textcolor: '#BEBEBE',
    color: '#333333',
    fontSize: 10,
    marginLeft: '8%',
    fontFamily: 'Nunito Sans, Roboto, sans-serif'
  },
  popoverItemClicked: {
    textcolor: '#4a83fb',
    color: '#4a83fb',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: '5%',
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    '&:hover': {
      color: '#212121'
    }
  },
  popoverpurchaseItemClicked: {
    textcolor: '#9DCB6A',
    color: '#9DCB6A',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: '5%',
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    '&:hover': {
      color: '#212121'
    }
  },
  popoverItemNotClicked: {
    textcolor: '#1e1f26',
    color: '#BEBEBE',
    fontSize: 14,
    cursor: 'pointer',
    marginLeft: '5%',
    margin: 0,
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    '&:hover': {
      color: '#212121'
    }
  },

  listItem: {
    cursor: 'pointer',
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    '&:hover': {
      backgroundColor: '#f8f8f9'
    }
  },
  text: {
    backgroundColor: '#131419'
  },
  textData: {
    backgroundColor: '#BEBEBE'
  },
  popover: {
    pointerEvents: 'cursor'
  }
});

class NestedList extends React.Component {
  constructor() {
    super();
    this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
    this.handlePopoverClose = this.handlePopoverClose.bind(this);
  }

  state = {
    open: {},
    child: '',
    parent: 'dashboard',
    anchorEl: null,
    popoverItems: [],
    popoverTitle: ''
  };

  handleClick = (key) => () => {
    this.setState({
      parent: key,
      child:
        key === 'sales'
          ? 'salesinvoice'
          : key === 'purchases'
          ? 'purchaseBill'
          : key === 'jobWork'
          ? 'jobWorkIn'
          : key === 'product'
          ? 'createProduct'
          : key === 'dashboardProductsExcel'
          ? 'dashboardProductsExcel'
          : key === 'settings'
          ? 'printSettings'
          : key === 'accountingData'
          ? 'retrieveDeletedData'
          : key === 'stock'
          ? 'addStock'
          : key === 'tallyExport'
          ? 'tallyExport'
          : key === 'cash'
          ? 'cash'
          : key === 'manufacture'
          ? 'rawmaterials'
          : key === 'schememanagement'
          ? 'schemeTypes'
          : key === 'gst'
          ? 'gstr1OnlineData'
          : key === 'sessionGroup'
          ? String(localStorage.getItem('isAdmin')).toLowerCase() === 'true'
            ? 'sessionGroup'
            : 'doctorsSessions'
          : key === 'employees'
          ? 'employeeType'
          : ''
    });
  };

  handlePopoverOpen = (event, items, popoverTitle) => {
    console.log(event, items, popoverTitle);
    if (items && items.length > 0) {
      this.setState({ anchorEl: event.currentTarget });
      this.setState({ popoverItems: items });
      this.setState({ popoverTitle: popoverTitle });
    } else {
      this.setState({ anchorEl: null });
      this.setState({ popoverItems: [] });
      this.setState({ popoverTitle: '' });
    }
  };

  handlePopoverClose = () => {
    this.setState({ anchorEl: null });
  };

  handlechildclick(key) {
    this.setState({ child: key });
  }
  getColor = (label) => {
    switch (label) {
      case 'Dashboard' || 'GSTR Filings':
        return '#EF5350';

      case 'Sales' || 'Settings' || 'Manufacture':
        return '#4a83fb';

      case 'Purchases' || 'Products' || 'Scheme Management' || 'Session Mgmt':
        return '#9dcb6a';

      case 'Products' || 'Accounting & Audit':
        return '#9dcb6a';

      case 'Expenses' || 'Stock Management' || 'Cash' || 'Employee':
        return '#ffaf01';

      default:
        return '#EF5350';
    }
  };

  componentDidMount() {
    eventBus.on('navigateToBarcodePrint', (data) => {
      this.setState({
        parent: 'barcode',
        child: ''
      });
    });
  }

  componentWillUnmount() {
    eventBus.remove('navigateToBarcodePrint');
  }

  render() {
    const { lists, classes, drawerOpen } = this.props;

    return (
      <List
        component="nav"
        style={{ overflowY: 'auto', marginBottom: 90, overflowX: 'hidden' }}
      >
        {lists.map(
          ({ key, label, icon, activeicon, items, divider, href, active }) => {
            const open = this.state.parent === key || false;
            return (
              <div key={key}>
                {open && (
                  <Divider
                    orientation="vertical"
                    flexItem
                    style={{ backgroundColor: '#37394A', width: '5px' }}
                  />
                )}
                <ListItem
                  key={key}
                  component={NavLink}
                  onMouseEnter={(e) => this.handlePopoverOpen(e, items, label)}
                  to={href}
                  button
                  style={{
                    backgroundColor:
                      (this.state.child === 'paymentOut' ||
                        this.state.child === 'purchaseReturn') &&
                      label === 'Purchases'
                        ? '#9DCB6A'
                        : this.state.child === 'paymentin' && label === 'Sales'
                        ? '#4a83fb'
                        : key === this.state.parent
                        ? this.getColor(label)
                        : ''
                  }}
                  onClick={this.handleClick(key)}
                >
                  {open ? (
                    <div>
                      <Svg icon={activeicon} />
                    </div>
                  ) : (
                    <div>
                      <Svg icon={icon} />
                    </div>
                  )}
                  <ListItemText
                    classes={{
                      primary: open
                        ? classes.listItemTextparentselected
                        : classes.listItemTextparent
                    }}
                    primary={label}
                  />
                  {/* {key === 'updateApp' ? <div style={{marginRight:'30%'}}><Svg icon={'newIcon'} /></div> : null } */}
                  {items && items.length > 0 ? (
                    open ? (
                      <ExpandLess style={{ color: 'white' }} />
                    ) : (
                      <ExpandMore style={{ color: '#BEBEBE' }} />
                    )
                  ) : (
                    ''
                  )}
                </ListItem>
                {items && items.length > 0 ? (
                  <Collapse
                    style={{ display: !drawerOpen ? 'none' : 'block' }}
                    in={open}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {items.map(
                        ({ key: childKey, label: childLabel, href }) => (
                          <ListItem
                            key={childKey}
                            button
                            component={NavLink}
                            style={{
                              backgroundColor: 'white',

                              borderRadius: '27px',
                              width: '157px',
                              marginLeft: '25px',
                              marginTop: '12px'
                            }}
                            onClick={() => this.handlechildclick(childKey)}
                            to={href}
                          >
                            <Add
                              fontSize="small"
                              style={{
                                color:
                                  this.state.child === childKey
                                    ? this.state.child === 'purchaseBill' ||
                                      this.state.child === 'paymentOut' ||
                                      this.state.child === 'purchaseReturn'
                                      ? '#9DCB6A'
                                      : '#4a83fb'
                                    : '#333333'
                              }}
                            />
                            <ListItemText
                              primary={
                                <Typography
                                  className={
                                    this.state.child === childKey
                                      ? this.state.child === 'purchaseBill' ||
                                        this.state.child === 'paymentOut' ||
                                        this.state.child === 'purchaseReturn'
                                        ? classes.childListpurchaseItemClicked
                                        : classes.childListItemClicked
                                      : classes.childListItemNotClicked
                                  }
                                >
                                  {childLabel}
                                </Typography>
                              }
                            />
                          </ListItem>
                        )
                      )}
                    </List>

                    <Popover
                      className={classes.popover}
                      style={{ marginLeft: '30px', zIndex: 0 }}
                      open={
                        this.state.anchorEl != null && !drawerOpen
                          ? true
                          : false
                      }
                      anchorEl={this.state.anchorEl}
                      onClose={this.handlePopoverClose}
                      disableRestoreFocus
                    >
                      <ListItem>
                        <ListItemText
                          over
                          primary={
                            <Typography
                              style={{
                                fontWeight: 'bold',
                                color: this.getColor(this.state.popoverTitle)
                              }}
                            >
                              {this.state.popoverTitle}
                            </Typography>
                          }
                        />
                      </ListItem>
                      <hr style={{ border: '1px solid #f8f8f9' }}></hr>

                      <List component="nav">
                        {this.state.popoverItems.map(
                          ({ key: childKey, label: childLabel, href }) => (
                            <ListItem
                              key={childKey}
                              className={classes.listItem}
                              button
                              component={NavLink}
                              onClick={() => this.handlechildclick(childKey)}
                              to={href}
                            >
                              <ListItemText
                                primary={
                                  <Typography
                                    style={{
                                      color:
                                        this.state.child === childKey
                                          ? this.getColor(
                                              this.state.popoverTitle
                                            )
                                          : ''
                                    }}
                                    className={
                                      this.state.child === childKey
                                        ? this.state.child === 'purchaseBill' ||
                                          this.state.child === 'paymentOut' ||
                                          this.state.child === 'purchaseReturn'
                                          ? classes.popoverpurchaseItemClicked
                                          : classes.popoverItemClicked
                                        : classes.popoverItemNotClicked
                                    }
                                  >
                                    {childLabel}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          )
                        )}
                      </List>
                    </Popover>
                  </Collapse>
                ) : (
                  ''
                )}
                {/* {divider ? (
                <Divider style={{ backgroundColor: '#37394A' }} />
              ) : (
                ''
              )} */}
              </div>
            );
          }
        )}
      </List>
    );
  }
}

NestedList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NestedList);