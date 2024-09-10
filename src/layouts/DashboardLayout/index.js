import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import TopBar from './TopBar';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import NestedList from './NestedList';
import getMenuList from './menu';
import { Box } from '@material-ui/core';
import Svg from '../../components/svg';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { toJS } from 'mobx';


const drawerWidth = '220px';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 40
    // [theme.breakpoints.up('lg')]: {
    //   paddingLeft: 256
    // }
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  hide: {
    display: 'none'
  },
  drawer: {
    marginTop: '37px',
    paddingTop: '40px',
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    backgroundColor: '#1E1F26',
    '& .MuiDrawer-paper': {
      overflowY: 'hidden'
    }
  },
  drawerOpen: {
    marginTop: '37px',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    backgroundColor: '#1E1F26'
    // backgroundColor: '#1c1c24'
  },
  drawerClose: {
    marginTop: '37px',
    // backgroundColor: '#1c1c24',
    backgroundColor: '#1E1F26',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(5) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(6)
    }
  },
  toolbar: {
    position: 'fixed',
    display: 'flex',
    textAlign: 'center',
    bottom: '-19px',
    left: 12,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  clps_toolbar: {
    borderTop: '1px solid #37394A',
    display: 'flex',
    textAlign: 'center',
    bottom: '-19px',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    position: 'fixed',
    minHeight: '60px',
    background: '#1E1F26'
  },
  clps_toolbar_close: {
    borderTop: '1px solid #37394A',
    display: 'flex',
    textAlign: 'center',
    bottom: '-19px',
    alignItems: 'center',
    justifyContent: 'flex-end',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(5) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(6)
    },
    position: 'fixed',
    minHeight: '60px'
  }
}));
const user = {
  avatar: '/static/images/avatars/avatar_6.png',
  joblabel: 'change Business',
  name: 'Business Name'
};
const DashboardLayout = () => {
  const classes = useStyles();
  const store = useStore();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [open, setOpen] = React.useState(true);
  const [businessName, setBusinessName] = React.useState();
  const [businessArea, setBusinessArea] = React.useState();

  const { getTriggerEvent } = store.BusinessListStore;

  const [menuList, setMenuList] = React.useState(getMenuList());

  

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setBusinessName(localStorage.getItem('businessName'));
    setBusinessArea(localStorage.getItem('businessArea'));
    
  }, []);

  

  useEffect(() => {
    if (getTriggerEvent()) {
      setMenuList(getMenuList());
    }
  }, [getTriggerEvent]);

  return (
    <div className={classes.root}>
      
      <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })
        }}
      >
        <div>
          {open ? (
            <Box display="flex" flexDirection="column" p={1} m={1}>
              <Tooltip title={''}>
                <Typography
                  className={classes.name}
                  variant="h5"
                  style={{ color: '#FFFFFF' }}
                >
                  {open ? (
                    businessName
                  ) : (
                    <span>{businessName.match(/\b(\w)/g).join('')}</span>
                  )}
                </Typography>
              </Tooltip>

              {open && (
                <Typography
                  color="textSecondary"
                  variant="caption"
                  style={{ color: '#BEBEBE' }}
                >
                  {businessArea}
                </Typography>
              )}

              {open && (
                <Typography
                  color="textSecondary"
                  variant="h6"
                  style={{ color: '#ffaf01' }}
                >
                  {'Plan: ' + localStorage.getItem('planName')}
                </Typography>
              )}

              {open && (
                <Typography
                  color="textSecondary"
                  variant="h6"
                  style={
                    localStorage.getItem('subscriptionDaysLeft') > 30
                      ? { color: '#9dcb6a' }
                      : { color: '#EF5350' }
                  }
                >
                  {'Subscription Days : ' +
                    localStorage.getItem('subscriptionDaysLeft')}
                </Typography>
              )}
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" p={0} m={1}>
              <Tooltip title={!open ? user.joblabel : ''}>
                <Typography
                  className={classes.name}
                  variant="h5"
                  style={{ color: '#FFFFFF' }}
                >
                  {businessName.match(/\b(\w)/g).join('')}
                </Typography>
              </Tooltip>

              {open && (
                <Typography
                  color="textSecondary"
                  variant="caption"
                  style={{ color: '#BEBEBE' }}
                >
                  {businessArea}
                </Typography>
              )}
            </Box>
          )}
        </div>
        <Divider style={{ backgroundColor: '#37394A' }} />

        <NestedList lists={menuList} drawerOpen={open} />

        <div
          className={clsx(classes.clps_toolbar, {
            [classes.clps_toolbar]: open,
            [classes.clps_toolbar_close]: !open
          })}
        >
          <div className={classes.toolbar}>
            {open ? (
              <Svg icon="collapse" onClick={handleDrawerOpen} />
            ) : (
              <Svg icon="expand" onClick={handleDrawerOpen} />
            )}
          </div>
        </div>
      </Drawer>

      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;