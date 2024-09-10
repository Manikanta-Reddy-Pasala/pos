import React, { useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from '../../theme';
import injectWithObserver from '../../Mobx/Helpers/injectWithObserver';
import ExpenseList from './ExpenseList';
import NoPermission from "src/views/noPermission";
import * as Bd from '../../components/SelectedBusiness';
import BubbleLoader from "../../components/loader";

const Expenses = (props) => {
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (businessData && businessData.posFeatures && businessData.posFeatures.length > 0) {
      if(!businessData.posFeatures.includes('Expenses')) {
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
        <ExpenseList />
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

export default injectWithObserver(Expenses);
