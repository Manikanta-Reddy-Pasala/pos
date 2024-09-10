import React, { useEffect ,useState} from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from '../../../theme';
import injectWithObserver from '../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import BubbleLoader from "../../../components/loader";
import NoPermission from "../../noPermission";
import * as Bd from '../../../components/SelectedBusiness';
import EmptyBackToBackPurchase from '../EmptyBackToBackPurchase';
import BackToBackPurchaseBillList from '../BackToBackPurchaseBillList';

const BackToBackPurchase = (props) => {
  const store = useStore();
  const [isLoading, setLoadingShown] = useState(true);
  const { getBackToBackPurchasesCount } = store.BackToBackPurchaseStore;
  const { isBackToBackPurchasesList } = toJS(store.BackToBackPurchaseStore);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    getBackToBackPurchasesCount();
    setTimeout(() => setLoadingShown(false), 200);
  }, []);
  
  const checkPermissionAvailable = (businessData) => {
    if (businessData && businessData.posFeatures && businessData.posFeatures.length > 0) {
      if(!businessData.posFeatures.includes('Manufacture')) {
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
                  isBackToBackPurchasesList ? <BackToBackPurchaseBillList /> : <EmptyBackToBackPurchase />
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
export default injectWithObserver(BackToBackPurchase);
