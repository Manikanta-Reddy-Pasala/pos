import React, { useEffect ,useState } from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from '../../../theme';
import SalesReturnList from './SalesReturnList';
import EmptySalesReturn from './EmptySalesReturn';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import BubbleLoader from "../../../components/loader";
import NoPermission from "../../noPermission";
import * as Bd from '../../../components/SelectedBusiness';

function SalesReturnCredit() {
  const store = useStore();
  const [isLoading, setLoadingShown] = useState(true);
  const { getSalesReturnCount } = store.ReturnsAddStore;
  const { isSalesReturnList } = toJS(store.ReturnsAddStore);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    getSalesReturnCount();
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
                  isSalesReturnList ? <SalesReturnList /> : <EmptySalesReturn />
                  :
                  <NoPermission />
                }
        </div>
        )}
      </div>
      <CssBaseline />
    </ThemeProvider>
  );
}

export default InjectObserver(SalesReturnCredit);
