import React, { useEffect ,useState } from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from '../../../theme';
import EmptyPaymentIn from './Emptypaymentin';
import PaymentInList from './PaymentInList';
import { toJS } from 'mobx';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import BubbleLoader from "../../../components/loader";
import NoPermission from "../../noPermission";
import * as Bd from '../../../components/SelectedBusiness';

const PaymentIn = () => {
  const store = useStore();
  const [isLoading, setLoadingShown] = useState(true);
  const { getPaymentInCount } = store.PaymentInStore;
  const { isPaymentInList } = toJS(store.PaymentInStore);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    getPaymentInCount();
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (businessData && businessData.posFeatures && businessData.posFeatures.length > 0) {
      if(!businessData.posFeatures.includes('Sales')) {
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
                  isPaymentInList ? <PaymentInList /> : <EmptyPaymentIn />
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

export default InjectObserver(PaymentIn);
