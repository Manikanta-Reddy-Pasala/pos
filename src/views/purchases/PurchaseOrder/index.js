import React, { useEffect ,useState} from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from '../../../theme';
import injectWithObserver from '../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import BubbleLoader from "../../../components/loader";
import NoPermission from "../../noPermission";
import * as Bd from '../../../components/SelectedBusiness';
import EmptyPurchaseOrder from './EmptyPurchaseOrder';
import PurchaseOrderList from './PurchaseOrderList';

const PurchaseOrder = (props) => {
  const store = useStore();
  const [isLoading, setLoadingShown] = useState(true);
  const { getPurchaseOrderCount } = store.PurchaseOrderStore;
  const { isPurchaseOrderList } = toJS(store.PurchaseOrderStore);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    getPurchaseOrderCount();
    setTimeout(() => setLoadingShown(false), 200);
  }, []);
  
  const checkPermissionAvailable = (businessData) => {
    if (businessData && businessData.posFeatures && businessData.posFeatures.length > 0) {
      if(!businessData.posFeatures.includes('Purchases')) {
          setFeatureAvailable(false);
        }
      }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <div style={{ backgroundColor: '#f6f8fa' }}>
      {isLoading && (
          <BubbleLoader></BubbleLoader>
          )}
          {!isLoading && (
            <div>
              {isFeatureAvailable ? 
                  isPurchaseOrderList ? <PurchaseOrderList /> : <EmptyPurchaseOrder />
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
export default injectWithObserver(PurchaseOrder);
