import React, { useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from '../../theme';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import BubbleLoader from 'src/components/loader';
import NoPermission from '../noPermission';
import * as Bd from 'src/components/SelectedBusiness';
import BillOfMaterialsList from './BillOfMaterialsList';

const BillOfMaterials = (props) => {
  const [isLoading, setLoadingShown] = useState(true);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

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
      if (!businessData.posFeatures.includes('Manufacture')) {
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
            {isFeatureAvailable ? <BillOfMaterialsList /> : <NoPermission />}
          </div>
        )}
      </div>
      <CssBaseline />
    </ThemeProvider>
  );
};
export default injectWithObserver(BillOfMaterials);
