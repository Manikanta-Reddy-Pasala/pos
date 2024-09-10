import React, { useEffect ,useState} from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from '../../../theme';
import injectWithObserver from '../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import OrderInList from './OrderInList';
import BubbleLoader from "../../../components/loader";
import NoPermission from "../../noPermission";
import * as Bd from '../../../components/SelectedBusiness';
import EmptyOrderIn from './EmptyOrderIn';

const JobWorkIn = (props) => {
  const store = useStore();
  const [isLoading, setLoadingShown] = useState(true);
  const { getJobWorkInCount } = store.JobWorkInStore;
  const { isSalesList } = toJS(store.JobWorkInStore);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    getJobWorkInCount();
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
      <div style={{ backgroundColor: '#f6f8fa' }}>
      {isLoading && (
          <BubbleLoader></BubbleLoader>
          )}
          {!isLoading && (
           <div>
           {isFeatureAvailable ? 
              isSalesList ? <OrderInList /> : <EmptyOrderIn />
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
export default injectWithObserver(JobWorkIn);
