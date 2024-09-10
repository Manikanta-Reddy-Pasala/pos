import React, { useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from '../../theme';
import injectWithObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import BubbleLoader from '../../components/loader';
import NoPermission from 'src/views/noPermission';
import * as Bd from '../../components/SelectedBusiness';
import RateList from './RateList';
import EmptyRate from './EmptyRate';
import * as Db from '../../RxDb/Database/Database';

const Rate = (props) => {
  const store = useStore();
  const [isLoading, setLoadingShown] = useState(true);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isRateList, setIsRateList] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await getRatesCount();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    setTimeout(() => setLoadingShown(false));
  }, []);

  const getRatesCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.rates.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query
      .exec()
      .then((data) => {
        setIsRateList(data.length > 0 ? true : false);
      })
      .catch((err) => {
        console.log('Rate Count Internal Server Error', err);
      });
  };

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Sales')) {
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
              isRateList ? (
                <RateList />
              ) : (
                <EmptyRate />
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
export default injectWithObserver(Rate);
