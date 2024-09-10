import React, { useEffect, useState } from 'react';
import Page from 'src/components/Page';
import {
  Typography,
  makeStyles,
  Paper,
  Button,
  Grid,
  Container,
  IconButton,
  Switch,
  withStyles
} from '@material-ui/core';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { useStore } from '../../Mobx/Helpers/UseStore';
import NoPermission from '../noPermission';
import BubbleLoader from 'src/components/loader';
import * as Bd from 'src/components/SelectedBusiness';
import { toJS } from 'mobx';
import AddAddOnGroup from './AddAddOnGroup';
import AddAddOns from './AddAddOns';
// import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

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
  },
  addOnstyle: {
    backgroundColor: '#EF5350',
    color: 'white',
    fontWeight: 'bold',
    width: '100px',
    marginTop: '10px',
    marginBottom: '10px'
  },
  addOnlist: {
    padding: '0 10px 0 10px',
    border: '1px solid #80808036',
    marginBottom: '6px'
  }
});

const AddOns = () => {
  const classes = useStyles();
  const store = useStore();

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const {
    getAddOnsGroup,
    handleAddOnsGroupModalOpen,
    viewOrEditItem,
    deleteAddOnsGroupData
  } = store.AddOnsGroupStore;
  const { addOnsGroupDialogOpen, addOnsGroupList, isAddOnsGroupList } = toJS(
    store.AddOnsGroupStore
  );

  const {
    getAddOns,
    handleAddOnsModalOpen,
    viewOrEditAddon,
    deleteAddOnsData,
    updateOfflineAddOns
  } = store.AddOnsStore;
  const { addOnsDialogOpen, addOnsList } = toJS(store.AddOnsStore);

  useEffect(() => {
    async function fetchData() {
      await getAddOnsGroup();
      await getAddOns();
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (isAddOnsGroupList === true) {
        await getAddOnsGroup();
        await getAddOns();
      }
    }

    fetchData();
  }, [isAddOnsGroupList]);

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
      if (!businessData.posFeatures.includes('Product')) {
        setFeatureAvailable(false);
      }
    }
  };

  return (
    <Paper className={classes.root} title="Warehouse">
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div>
          {isFeatureAvailable ? (
            <div>
              <Grid className={classes.headerContain}>
                <div>
                  <Typography className={classes.header} variant="inherit">
                    Add Ons
                  </Typography>
                </div>
              </Grid>

              <Button
                onClick={handleAddOnsGroupModalOpen}
                style={{
                  backgroundColor: '#EF5350',
                  color: 'white',
                  fontWeight: 'bold',
                  width: '180px',
                  marginLeft: '20px',
                  marginTop: '20px'
                }}
              >
                + Add On Group
              </Button>
              <div style={{ padding: '20px' }}>
                <Grid container spacing={3}>
                  {addOnsGroupList && addOnsGroupList.length > 0 ? (
                    addOnsGroupList.map((option, index) => (
                      <Grid item xs={4}>
                        <Paper elevation={3} style={{ padding: '20px' }}>
                          <Grid
                            container
                            justify="space-between"
                            alignItems="center"
                          >
                            <Typography variant="h6">
                              {option.groupName}
                            </Typography>
                            <div>
                              <IconButton
                                onClick={() => viewOrEditItem(option)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => deleteAddOnsGroupData(option)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          </Grid>
                          <Button
                            onClick={() => handleAddOnsModalOpen(option)}
                            className={classes.addOnstyle}
                          >
                            + Add On
                          </Button>
                          {addOnsList && addOnsList.length > 0 ? (
                            addOnsList.map((childoption, index) => (
                              <div>
                                {childoption.groupName == option.groupName && (
                                  <Grid
                                    className={classes.addOnlist}
                                    container
                                    justify="space-between"
                                    alignItems="center"
                                  >
                                    <Typography variant="h6">
                                      {childoption.name}
                                    </Typography>
                                    <div>
                                      <IconButton
                                        onClick={() =>
                                          viewOrEditAddon(childoption)
                                        }
                                      >
                                        <EditIcon />
                                      </IconButton>
                                      <IconButton
                                        onClick={() =>
                                          deleteAddOnsData(childoption)
                                        }
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                      <FormControlLabel
                                        control={
                                          <Switch
                                            checked={!childoption.offline}
                                            onChange={(e) => {
                                              updateOfflineAddOns(
                                                childoption,
                                                e.target.checked
                                              );
                                            }}
                                          />
                                        }
                                      />
                                    </div>
                                  </Grid>
                                )}
                              </div>
                            ))
                          ) : (
                            <div
                              style={{ display: 'flex', flexDirection: 'row' }}
                            >
                              <div
                                style={{
                                  width: '100%',
                                  paddingLeft: '5px',
                                  textAlign: 'center'
                                }}
                              >
                                No Add Ons to display
                              </div>
                            </div>
                          )}
                        </Paper>
                      </Grid>
                    ))
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div
                        style={{
                          width: '100%',
                          paddingLeft: '5px',
                          textAlign: 'center'
                        }}
                      >
                        No Add On Groups to display
                      </div>
                    </div>
                  )}
                </Grid>
              </div>
            </div>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
      {addOnsGroupDialogOpen ? <AddAddOnGroup /> : null}
      {addOnsDialogOpen ? <AddAddOns /> : null}
    </Paper>
  );
};

export default InjectObserver(AddOns);