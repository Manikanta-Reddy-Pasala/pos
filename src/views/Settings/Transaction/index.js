import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import useWindowDimensions from '../../../components/windowDimension';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import TransactionPrefixesSettings from './TransactionPrefixes';

import { makeStyles, Typography } from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import NoPermission from '../../noPermission';
import BubbleLoader from '../../../components/loader';
import * as Bd from '../../../components/SelectedBusiness';
import { Grid, Col } from 'react-flexbox-grid';
import '../style.css';
import GeneralSettingsNavigation from '../GeneralSettingsNavigation';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
    // backgroundColor: theme.palette.background.paper,
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  paper: {
    padding: 18
    // textAlign: 'center',
  },
  containerLeft: {
    width: '12%',
    minHeight: '590px'
  },
  containerRight: {
    width: '88%'
  },
  cardList: {
    display: 'block',
    textAlign: 'center',
    paddingTop: '10px',
    color: 'grey'
  },
  flex: {
    display: 'flex'
  },
  center: {
    alignSelf: 'center',
    textAlign: 'center'
  },
  p: {
    fontWeight: 'bold'
  },
  card: {
    height: '100%'
  }
}));

const TransactionSettings = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const stores = useStore();

  const { getTransactionData } = stores.TransactionStore;

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const { height } = useWindowDimensions();

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      await getTransactionData();
    }

    fetchData();
    setTimeout(() => setLoadingShown(false), 200);
  }, [getTransactionData]);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Settings')) {
        setFeatureAvailable(false);
      }
    }
  };

  return (
    <Grid fluid className="app-main" style={{ height: height - 50 }}>
      <Col className="nav-column" xs={12} sm={2}>
        <Card className={classes.card}>
          <Grid container className={classes.cardList}>
            <GeneralSettingsNavigation
              navigation={navigate}
              active="transactionsetting"
            />
          </Grid>
        </Card>
      </Col>
      <Col className="content-column" xs>
        {isLoading && <BubbleLoader></BubbleLoader>}
        {!isLoading && (
          <>
            {isFeatureAvailable && localStorage.getItem('isAdmin') === 'true' ? (
              <Paper
                className={classes.paper}
                style={{ height: height - 62 + 'px', overflowY: 'auto' }}
              >
                <Typography variant="h5" style={{ marginBottom: '10px' }}>
                  Prefix Transaction Settings
                </Typography>
                <Grid container>
                  <Grid item xs={12}>
                    <TransactionPrefixesSettings />
                  </Grid>
                </Grid>
              </Paper>
            ) : (
              <NoPermission />
            )}
          </>
        )}
      </Col>
    </Grid>
  );
};

export default injectWithObserver(TransactionSettings);