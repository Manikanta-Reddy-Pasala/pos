import React, { useEffect ,useState} from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from '../../../theme';
import EmptyPurchases from './EmptyPurchase';
import injectWithObserver from '../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import PurchaseBillList from './PurchaseBillList';
import BubbleLoader from "../../../components/loader";
import NoPermission from "../../noPermission";
import * as Bd from '../../../components/SelectedBusiness';

const Purchases = (props) => {
  const store = useStore();
  const [isLoading, setLoadingShown] = useState(true);
  const { getPurchasescount } = store.PurchasesAddStore;
  const { isPurchasesList } = toJS(store.PurchasesAddStore);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    getPurchasescount();
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
                  isPurchasesList ? <PurchaseBillList /> : <EmptyPurchases />
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
export default injectWithObserver(Purchases);
