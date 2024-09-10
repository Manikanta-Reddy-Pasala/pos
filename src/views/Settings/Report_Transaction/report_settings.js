import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import useWindowDimensions from '../../../components/windowDimension';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';

import {
  makeStyles,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import NoPermission from '../../noPermission';
import BubbleLoader from '../../../components/loader';
import * as Bd from '../../../components/SelectedBusiness';
import { createTheme } from '@material-ui/core/styles';
import GeneralSettingsNavigation from '../GeneralSettingsNavigation';
import { Grid, Col } from 'react-flexbox-grid';
import '../style.css';

const useStyles = makeStyles((theme) => ({
  gridpad: {
    margin: '0px',
    padding: '0px'
  },
  tickSize: {
    transform: 'scale(.8)'
  },
  root: {
    flexGrow: 1
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  paper: {
    padding: 18
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
  containerInput: {
    flexGrow: 1
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
  },
  formLabel: {
    paddingLeft: '30px',
    color: '#263238',
    fontWeight: 'bold'
  },
  formMultiLabel: {
    marginRight: '0px'
  },
  containerField: {
    marginTop: '16px'
  }
}));

const theme = createTheme({
  overrides: {
    MuiOutlinedInput: {
      root: {
        '& $notchedOutline': {
          padding: '0 !important'
        },
        '&:hover $notchedOutline': {
          padding: '0 !important'
        },
        '&$focused $notchedOutline': {
          padding: '0 !important',
          borderColor: '#2196f3'
        }
      }
    }
  }
});

const ReportSettings = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const stores = useStore();

  const { setReportSettingProperty, getReportSettingdetails } =
    stores.ReportSettingsStore;

  const { reportSettingsData } = toJS(stores.ReportSettingsStore);

  const { height } = useWindowDimensions();

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      getReportSettingdetails();
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
              active="report_settings"
            />
          </Grid>
        </Card>
      </Col>
      <Col className="content-column" xs>
        {isLoading && <BubbleLoader></BubbleLoader>}
        {!isLoading && (
          <>
            {isFeatureAvailable ? (
              <Paper
                className={classes.paper}
                style={{
                  height: height - 69 + 'px',
                  overflowX: 'hidden',
                  overflowY: 'auto'
                }}
              >
                <Grid
                  container
                  direction="row"
                  spacing={1}
                  style={{ margin: '0px', padding: '0px' }}
                >
                  <Grid item xs={12} sm={12}>
                    <Typography variant="h5" style={{ marginBottom: '16px' }}>
                      Report Settings
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    style={{ margin: '0px', padding: '0px', display: 'flex' }}
                  >
                    <Grid item xs={12} sm={3}>
                      <Divider variant="li" />
                      {reportSettingsData &&
                        reportSettingsData.reportsList &&
                        reportSettingsData.reportsList.map((prodEle, index) => (
                          <div>
                            <FormControl variant="standard">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={prodEle.enabled}
                                    name={prodEle.name}
                                    className={classes.tickSize}
                                    onChange={(e) =>
                                      setReportSettingProperty(
                                        index,
                                        e.target.checked
                                      )
                                    }
                                  />
                                }
                                label={prodEle.displayName}
                              />
                            </FormControl>
                          </div>
                        ))}
                    </Grid>
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

export default injectWithObserver(ReportSettings);