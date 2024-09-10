import React, { useState, useEffect } from 'react';
import { makeStyles, Paper, Grid } from '@material-ui/core';
import CashHeader from './CashHeader';
import CashTransactionTable from './CashTransation';
import NoPermission from 'src/views/noPermission';
import * as Bd from 'src/components/SelectedBusiness';
import BubbleLoader from 'src/components/loader';
import Controls from 'src/components/controls/index';
import { Add } from '@material-ui/icons';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import AddCash from './modal/AddCash';
import { toJS } from 'mobx';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5
  },
  paper: {
    padding: 2
    // textAlign: 'center',
  },
  sideList: {
    padding: theme.spacing(1)
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: '12px'
  }
}));

const Cash = () => {
  const classes = useStyles();

  const [isLoading, setLoadingShown] = useState(true);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

  const store = useStore();
  const { handleCashModalOpen } = store.CashStore;
  const { cashDialogOpen } = toJS(store.CashStore);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
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
      if (!businessData.posFeatures.includes('Cash & Bank')) {
        setFeatureAvailable(false);
      }
    }
  };

  return (
    <div className={classes.root}>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div>
          {isFeatureAvailable ? (
            <Paper className={classes.root}>
              <div className={classes.content}>
                <Grid container>
                  <Grid item xs={6}></Grid>
                  <Grid item xs={6} style={{ textAlign: 'end' }}>
                    <Controls.Button
                      text="Add Adjustment"
                      size="medium"
                      variant="contained"
                      startIcon={<Add />}
                      className={classes.newButton}
                      style={{ marginRight: '16px' }}
                      onClick={() => handleCashModalOpen()}
                    />
                  </Grid>
                </Grid>
              </div>

              <div></div>

              <div className={classes.sideList}>
                <CashHeader />
                <CashTransactionTable />
              </div>
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
      {/* {cashDialogOpen ? <AddCash /> : null} */}
    </div>
  );
};

export default Cash;