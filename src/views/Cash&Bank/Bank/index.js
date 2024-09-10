import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { Grid, makeStyles } from '@material-ui/core';
import BankAccounts from './BankAccounts';
import BankTransactions from './BankTransactions';
import NoPermission from 'src/views/noPermission';
import * as Bd from 'src/components/SelectedBusiness';
import BubbleLoader from 'src/components/loader';
import Controls from 'src/components/controls/index';
import { Add } from '@material-ui/icons';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import AddBankAccount from './modal/AddBankAccount';
import { toJS } from 'mobx';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  paper: {
    padding: 2
  },
  Table: {
    paddingTop: 10
  },
  sideList: {
    padding: theme.spacing(1),
    background: '#F6F8FA'
  },

  productHeader: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  gridControl: {},
  productCard: {
    height: '100%',
    backgroundColor: '#fff'
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: '12px'
  }
}));

const BankAccountView = () => {
  const classes = useStyles();
  const [isLoading, setLoadingShown] = useState(true);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

  const store = useStore();
  const { handleOpenDialog } = store.BankAccountsStore;
  const { bankDialogOpen } = toJS(store.BankAccountsStore);

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

  const openAddNewBankAccount = () => {
    handleOpenDialog();
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
                      text="Add Bank Account"
                      size="medium"
                      variant="contained"
                      startIcon={<Add />}
                      className={classes.newButton}
                      style={{ marginRight: '16px' }}
                      onClick={() => handleOpenDialog(false)}
                    />
                  </Grid>
                </Grid>
              </div>

              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
              >
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  className={classes.gridControl}
                >
                  <Paper className={classes.productCard}>
                    <BankAccounts />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Paper className={classes.productCard}>
                    <BankTransactions />
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
      <AddBankAccount />
    </div>
  );
};

export default BankAccountView;