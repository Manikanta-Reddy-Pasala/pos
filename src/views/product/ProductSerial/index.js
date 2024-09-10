import React, { useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from '../../../theme';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import BubbleLoader from 'src/components/loader';
import NoPermission from 'src/views/noPermission';
import * as Bd from 'src/components/SelectedBusiness';
import ProductSerialList from './ProductSerialList';
import AddProductSerial from './AddProductSerial';
import { useStore } from 'src/Mobx/Helpers/UseStore';

const ProductSerial = (props) => {
  const [isLoading, setLoadingShown] = useState(true);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const stores = useStore();
  const { serialModelOpen } = stores.ProductStore;

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
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
    <>
    <ThemeProvider theme={theme}>
      <div style={{ backgroundColor: '#f6f8fa' }}>
        {isLoading && <BubbleLoader></BubbleLoader>}
        {!isLoading && (
          <div>
            {isFeatureAvailable? (
              <ProductSerialList />
            ) : (
              <NoPermission />
            )}
          </div>
        )}
      </div>
      <CssBaseline />
    </ThemeProvider>
     {serialModelOpen ? <AddProductSerial /> : null}
     </>
  );
};
export default injectWithObserver(ProductSerial);
