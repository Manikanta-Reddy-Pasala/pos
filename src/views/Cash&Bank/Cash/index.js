import React, { useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from '../../../theme';
import EmptyCash from './EmptyCash';
import Cash from './Cash';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import BubbleLoader from 'src/components/loader';
import NoPermission from 'src/views/noPermission';
import * as Bd from 'src/components/SelectedBusiness';

import { toJS } from 'mobx';

const CashAdjustments = () => {
  const store = useStore();

  const [isLoading, setLoadingShown] = useState(true);

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

  const { isCashFlowList } = toJS(store.ReportsStore);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if(!businessData.posFeatures.includes('Cash & Bank')) {
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
              isCashFlowList ? (
                <Cash />
              ) : (
                <EmptyCash />
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

export default InjectObserver(CashAdjustments);
