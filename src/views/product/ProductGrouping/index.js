import React, { useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from '../../../theme';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import BubbleLoader from 'src/components/loader';
import NoPermission from 'src/views/noPermission';
import * as Bd from 'src/components/SelectedBusiness';
import { toJS } from 'mobx';
import ProductGroupingListView from './ProductGroupingListView';

const ProductGroup = (props) => {
  const store = useStore();
  const [isLoading, setLoadingShown] = useState(true);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const { isProductGroupList } = toJS(store.ProductGroupStore);
  const { getProductGroupCount } = store.ProductGroupStore;

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await getProductGroupCount();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    setTimeout(() => setLoadingShown(false));
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Product')) {
        setFeatureAvailable(false);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ backgroundColor: '#f6f8fa' }}>
        {isLoading && <BubbleLoader></BubbleLoader>}
        {!isLoading && (
          <div>
            {isFeatureAvailable? (
              <ProductGroupingListView />
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
export default injectWithObserver(ProductGroup);
