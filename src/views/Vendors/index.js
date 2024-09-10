import React, { useEffect ,useState} from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from '../../theme';
import EmptyVendors from './EmptyVendor';
import Vendors from './Vendors';
import * as Db from '../../RxDb/Database/Database';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import BubbleLoader from "../../components/loader";
import NoPermission from "src/views/noPermission";
import * as Bd from '../../components/SelectedBusiness';

import { toJS } from 'mobx';

const Vendor = () => {
  const store = useStore();
  const { getVendorCount, resetVendor } = store.VendorStore;
  const [isLoading, setLoadingShown] = useState(true);
  const { isVendorList } = toJS(store.VendorStore);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      await resetVendor();
    }

    fetchData();
    getVendorCount();
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (businessData && businessData.posFeatures && businessData.posFeatures.length > 0) {
      if(!businessData.posFeatures.includes('Vendors')) {
          setFeatureAvailable(false);
        }
      }
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
      {isLoading && (
          <BubbleLoader></BubbleLoader>
          )}
        {!isLoading && (
            <div>
        {isFeatureAvailable ? 
        isVendorList ? <Vendors /> : <EmptyVendors />
        :
        <NoPermission />
       }
        </div>
        )}
        </div>
      <CssBaseline />
    </ThemeProvider>
  );
};

export default InjectObserver(Vendor);
