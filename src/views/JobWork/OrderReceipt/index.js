import React, { useEffect ,useState} from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from '../../../theme';
import EmptyPaymentOut from './EmptyOrderReceipt';
import PaymentOutList from './OrderReceiptList';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import BubbleLoader from "../../../components/loader";
import NoPermission from "../../noPermission";
import * as Bd from '../../../components/SelectedBusiness';
import OrderReceiptList from './OrderReceiptList';

const OrderReceipts = () => {
  const store = useStore();
  const [isLoading, setLoadingShown] = useState(true);
  const { getPaymentOutCount } = store.PaymentOutStore;
  const { isPaymentOutList } = toJS(store.PaymentOutStore);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    getPaymentOutCount();
    setTimeout(() => setLoadingShown(false), 200);
  });

  const checkPermissionAvailable = (businessData) => {
    if (businessData && businessData.posFeatures && businessData.posFeatures.length > 0) {
      if(!businessData.posFeatures.includes('Purchases')) {
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
              <OrderReceiptList />
        </div>
        )}
        </div>
      <CssBaseline />
    </ThemeProvider>
  );
};

export default InjectObserver(OrderReceipts);
