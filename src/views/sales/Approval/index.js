import React, { useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from '../../../theme';
import EmptyApprovalInvoice from './EmptyApproval';
import injectWithObserver from '../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import ApprovalList from './ApprovalList';
import BubbleLoader from '../../../components/loader';
import NoPermission from '../../noPermission';
import * as Bd from '../../../components/SelectedBusiness';

const Approval = (props) => {
  const store = useStore();
  const [isLoading, setLoadingShown] = useState(true);
  const { getApprovalsCount } = store.ApprovalsStore;
  const { isApprovalsList } = toJS(store.ApprovalsStore);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await getApprovalsCount();
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
      if(!businessData.posFeatures.includes('Sales')) {
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
            {isFeatureAvailable ? (
              isApprovalsList ? (
                <ApprovalList />
              ) : (
                <EmptyApprovalInvoice />
              )
            ) : (
              <NoPermission />
            )}
          </div>
        )}
      </div>
      <CssBaseline />
    </ThemeProvider>
  );
};
export default injectWithObserver(Approval);
