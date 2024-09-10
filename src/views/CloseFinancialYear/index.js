import React, { useEffect, useState } from 'react';
import { Typography, makeStyles, Paper, Button, Grid } from '@material-ui/core';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import NoPermission from '../noPermission';
import BubbleLoader from 'src/components/loader';
import * as Bd from 'src/components/SelectedBusiness';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    margin: '10px',
    height: '97%'
  },

  paper: {
    padding: 2
  },

  uploadContainer: {
    border: '2px dashed blue',
    padding: '100px',
    borderRadius: '50%',
    display: 'block',
    textAlign: 'center',
    width: '400px'
  },

  dropzoneStyle: {
    '& .MuiDropzoneArea-icon': {
      color: 'blue'
    },
    '& .MuiDropzoneArea-root': {
      border: '2px dashed rgb(0, 0, 255) !important',
      borderRadius: '50% !important',
      display: 'block !important',
      textAlign: 'center !important',
      width: '400px !important',
      height: '370px !important',
      marginTop: '-3px !important'
    }
  },

  uploadText: {
    display: 'grid',
    marginTop: '60px'
  },
  textCenter: {
    textAlign: 'center',
    color: 'grey'
  },
  marginSpace: {
    margin: '0px 0 20px 0px'
  },
  jsonContainer: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    height: '70%'
  },
  jsontempContainer: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center'
  },

  headerContain: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 10px 40px 20px'
  },
  flexGrid: {
    display: 'grid'
  },
  flexCenter: {
    display: 'flex',
    justifyContent: 'center'
  },
  header: {
    fontWeight: 'bold',
    fontFamily: 'Roboto'
  },
  clickBtn: {
    color: 'blue',
    marginTop: '5px',
    cursor: 'pointer'
  },
  previewChip: {
    minWidth: 160,
    maxWidth: 210
  },
  subHeader: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    paddingLeft: '20px'
  },
  resetContain: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: '20px'
  }
});

const CloseFinancialYear = () => {
  const classes = useStyles();
  const store = useStore();

  const { resetData } = store.TransactionStore;
  const { resetMultiDeviceData } = store.MultiDeviceSettingsStore;
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
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Close Financial Year')) {
        setFeatureAvailable(false);
      }
    }
  };

  const resetTransactionAndMultiDeviceData = async () => {
    await resetData();
    await resetMultiDeviceData();
    toast.info('Reset Successful', {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: true, // Disables auto-closing
      closeButton: true
    });
  };

  return (
    <Paper className={classes.root} title="Close Financial Year">
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div>
          {isFeatureAvailable ? (
            <div>
              <Grid className={classes.headerContain}>
                <div>
                  <Typography className={classes.header} variant="inherit">
                    Close Financial Year
                  </Typography>
                </div>
              </Grid>

              <Grid item md={12} sm={12} className="grid-padding">
                <Typography className={classes.subHeader} variant="inherit">
                  Reset Prefixes
                </Typography>

                <Typography
                  variant="h6"
                  style={{ paddingLeft: '20px', marginTop: '10px' }}
                >
                  This option will allow you to reset the transaction prefixes
                  and start with fresh transaction sequence numbers in new
                  Financial Year.
                </Typography>

                <Button
                  onClick={() => resetTransactionAndMultiDeviceData()}
                  style={{
                    backgroundColor: 'rgb(0, 0, 255)',
                    color: 'white',
                    fontWeight: 'bold',
                    width: '180px',
                    marginLeft: '20px',
                    marginTop: '20px'
                  }}
                >
                  RESET
                </Button>
              </Grid>
            </div>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
    </Paper>
  );
};

export default InjectObserver(CloseFinancialYear);