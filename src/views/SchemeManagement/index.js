import React, { useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider, Typography } from '@material-ui/core';
import theme from '../../theme';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import BubbleLoader from 'src/components/loader';
import NoPermission from '../noPermission';
import * as Bd from 'src/components/SelectedBusiness';
import { makeStyles } from '@material-ui/core';
import EmptySchemeManagement from './EmptySchemeManagement';
import SchemeManagementList from './SchemeManagementList';

const useStyles = makeStyles((theme) => ({
  newButton: {
    position: 'relative',
    borderRadius: 25,
    marginTop: 25,
    minWidth: 200,
    fontWeight: 400
  },
  Applogo: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '30%'
  },
  Appheader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  divalign: {
    width: '500px',
    height: '500px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto'
  }
}));

const SchemeManagement = (props) => {
  const classes = useStyles();
  const store = useStore();
  const [isLoading, setLoadingShown] = useState(false);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const { isSchemeManagementList } = toJS(store.SchemeManagementStore);
  const { getSchemeManagementCount } = store.SchemeManagementStore;

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    getSchemeManagementCount();
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Scheme Management')) {
        //setFeatureAvailable(false);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        {isLoading && <BubbleLoader></BubbleLoader>}
        {!isLoading && (
          <div>
            {isFeatureAvailable ? <SchemeManagementList /> : <NoPermission />}
          </div>
        )}
      </div>
      <CssBaseline />
    </ThemeProvider>
  );
};
export default injectWithObserver(SchemeManagement);