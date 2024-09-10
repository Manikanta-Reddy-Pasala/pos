import React, { useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from '../../theme';
import EmptyEmployee from './EmptyEmployee';
import Employee from './Employee';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import BubbleLoader from '../../components/loader';
import NoPermission from 'src/views/noPermission';
import * as Bd from '../../components/SelectedBusiness';

const EmployeeView = () => {
  const store = useStore();
  const { getEmployeeCount } = store.EmployeeStore;
  const [isLoading, setLoadingShown] = useState(true);
  const { isEmployeeList, employeeDialogOpen } = toJS(store.EmployeeStore);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await getEmployeeCount();
      await checkPermissionAvailable(businessData);
    }

    fetchData();

    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  useEffect(() => {
    async function fetchData() {
      await getEmployeeCount();
    }

    fetchData();

  }, [employeeDialogOpen])

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if(localStorage.getItem('isAdmin') === 'true') {
          setFeatureAvailable(true);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        {isLoading && <BubbleLoader></BubbleLoader>}
        {!isLoading && (
          <div>
            {isFeatureAvailable ? (
              isEmployeeList ? (
                <Employee />
              ) : (
                <EmptyEmployee />
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

export default InjectObserver(EmployeeView);
