import React, { useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from '../../theme';
import EmptyCustomer from './EmptyCustomer';
import Customers from './customers';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import BubbleLoader from '../../components/loader';
import NoPermission from 'src/views/noPermission';
import * as Bd from '../../components/SelectedBusiness';

const Customer = () => {
  const store = useStore();
  const { getCustomerCount, resetCustomer } = store.CustomerStore;
  const [isLoading, setLoadingShown] = useState(true);
  const { isCustomerList } = toJS(store.CustomerStore);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      await resetCustomer();
    }

    fetchData();
    getCustomerCount();
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if(!businessData.posFeatures.includes('Customers')) {
          setFeatureAvailable(false);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        {isLoading && <BubbleLoader></BubbleLoader>}
        {!isLoading && (
          <div>
            {isFeatureAvailable ? (
              isCustomerList ? (
                <Customers />
              ) : (
                <EmptyCustomer />
              )
            ) : (
              <NoPermission />
            )}
          </div>
        )}
      </div>
      <CssBaseline />
    </ThemeProvider>
  );
};

export default InjectObserver(Customer);
