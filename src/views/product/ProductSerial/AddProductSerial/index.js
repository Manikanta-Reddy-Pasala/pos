import React, { useState } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  DialogContentText,
  Button,
  withStyles,
  Grid,
  IconButton,
  Typography,
  FormControl,
  Tabs,
  Tab,
  AppBar,
  TextField
} from '@material-ui/core';
import { Col } from 'react-flexbox-grid';
import DialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { toJS } from 'mobx';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { getCompleteProductDataAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import Controls from 'src/components/controls/index';
import SerialData from 'src/Mobx/Stores/classes/SerialData';

const useStyles = makeStyles((theme) => ({
  tableCellHeaderRoot: {
    border: '1px solid #e0e0e0',
    padding: 0,
    lineHeight: '1.25rem',
    textAlign: 'center',
    fontWeight: 400,
    fontSize: '0.87rem',
    color: '#999'
  },
  outlineinputProps: {
    padding: '2px 6px',
    fontSize: '0.875rem'
  },
  wrapper: {
    display: 'flex'
  },
  roundofftext: {
    '& .MuiOutlinedInput-root': {
      borderColor: 'purple'
    }
  },
  backgroundWhite: {
    backgroundColor: '#ffffff'
  },
  colorBlack: {
    color: '#263238'
  },
  underline: {
    '&&&:before': {
      borderBottom: 'none'
    },
    '&&:after': {
      borderBottom: 'none'
    }
  },
  items: {
    display: 'flexDirection',
    justifyContent: 'space-between'
  },
  paper: {
    height: 140,
    width: 100
  },
  root: {
    margin: '0px 0',
    padding: '5px 15px',
    height: '55px',
    background: '#EBEBEB'
  },
  footer: {
    position: 'absolute',
    bottom: '0px',
    height: '130px',
    left: '0px',
    right: '0px',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF'
  },
  selectMaterial: {
    width: '120px'
  },
  inputMaterial: {
    padding: '3px 6px'
  },
  appBar: {
    position: 'sticky',
    backgroundColor: '#ffffff'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  newButton: {
    position: 'relative',
    borderRadius: 25
  },

  pageHeader: {
    display: 'flex',
    overflowX: 'hidden'
  },
  pageIcon: {
    display: 'inline-block',
    padding: theme.spacing(2),
    color: '#3c44b1'
  },
  pageTitle: {
    paddingLeft: theme.spacing(4),
    '& .MuiTypography-subtitle2': {
      opacity: '0.6'
    }
  },
  mySvgStyle: {
    fillColor: theme.palette.primary.main
  },
  card: {
    padding: theme.spacing(4),
    display: 'flex',
    marginBottom: theme.spacing(2),
    alignItems: 'center',
    flexDirection: 'row'
  },
  customizeToolbar: {
    maxHeight: 20
  },
  selectData: {
    color: '#EF5350',
    width: '120px'
    // height: '45px',
    // backgroundColor: 'white'
  },
  header: {
    fontWeight: 'bold',
    fontFamily: 'Roboto'
  },
  bootstrapInput: {
    borderRadius: 2,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '5px 12px',
    width: 'calc(100% - 30px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: ['Nunito Sans, Roboto, sans-serif'].join(','),
    '&:focus': {
      borderColor: '#ff7961'
      // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  mainlistbox: {
    minWidth: '30%',
    margin: 0,
    padding: 5,
    zIndex: 99,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    textAlign: 'left',
    border: '1px solid rgba(0,0,0,.25)',
    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    },
    '& li:active': {
      backgroundColor: '#2977f5',
      color: 'white'
    }
  },
  leftCol: {
    fontFamily: 'Helvetica',
    fontSize: '18px',
    padding: 'initial'
  },
  leftpanelscroll: {
    fontFamily: 'Helvetica',
    fontSize: '18px',
    padding: 'initial'
    //overflowY: 'auto',
    /* '&::-webkit-scrollbar': {
      width: '0.5em',
      borderRadius: 12
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)'
      // outline: '1px solid slategrey'
    } */
  },
  contentCol: {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '0.5em',
      borderRadius: 12
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)'
      // outline: '1px solid slategrey'
    }
  },
  inputNumber: {
    '& input[type=number]': {
      '-moz-appearance': 'textfield'
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
  },
  tabs: {
    display: 'flex'
  },
  tab: {
    flex: 1
  }
}));

const DialogTitle = withStyles((theme) => ({
  root: {
    '& h2': {
      fontSize: '17px'
    },
    '& .closeButton': {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.success[500]
    }
  }
}))(MuiDialogTitle);

const AddProductSerial = (props) => {
  const classes = useStyles();
  const store = useStore();
  const { serialModelOpen, isSerialEdit, productDetail } = toJS(
    store.ProductStore
  );

  const {
    updateProduct,
    handleCloseSerialModel,
    addSerialIMEIList,
    removeSerialIMEIList,
    setSerialIMEIList,
    setProductDetailsForSerialData,
    resetProductDetailsForSerialData
  } = store.ProductStore;

  const [openCloseDialog, setopenCloseDialog] = React.useState(false);

  const [mainProductlist, setMainProductlist] = useState([]);

  const [errorAlertProductMessage, setErrorAlertProductMessage] = useState('');
  const [openErrorAlertProduct, setErrorAlertProduct] = useState(false);

  const [productNameWhileEditing, setProductNameWhileEditing] =
    React.useState();
  const [mainProductName, setMainProductName] = React.useState('');
  const [Tabvalue, setTabValue] = React.useState(0);

  const handleErrorAlertProductClose = () => {
    setErrorAlertProduct(false);
    setErrorAlertProductMessage('');
  };

  const handleCloseDialogClose = () => {
    setopenCloseDialog(false);
  };

  const handleCloseDialogOpen = () => {
    setopenCloseDialog(true);
  };

  const handleSerialSaveClick = async () => {
    
    const duplicates = await findDuplicates(
      productDetail.serialData,
      'serialImeiNo'
    );
    if (duplicates && duplicates.length > 0) {
      setErrorAlertProductMessage(
        'Serial Number should be unique. Please find duplicates added: ' +
          duplicates.join(', ')
      );
      setErrorAlertProduct(true);
      return;
    }

    const serialNoValidate = productDetail.serialData?.map((value, index) => {
      if (value.serialImeiNo === '') {
        return false;
      } else {
        return true;
      }
    });

    if (!serialNoValidate.every(Boolean)) {
      setErrorAlertProductMessage('Serial Number cannot be empty');
      setErrorAlertProduct(true);
      return;
    }

    updateProduct(productDetail);
    handleCloseSerialModel();
  };

  const addSerialNumber = () => {
    let newSerialData = new SerialData().defaultValues();
    addSerialIMEIList(newSerialData);
  };

  const getMainProductList = async (value) => {
    setMainProductlist(await getCompleteProductDataAutoCompleteList(value));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`
    };
  }

  const findDuplicates = async (arr, key) => {
    const seen = new Set();
    const duplicates = new Set();
    arr.forEach((item) => {
      const value = item[key];
      if (seen.has(value)) {
        duplicates.add(value);
      } else {
        seen.add(value);
      }
    });

    return Array.from(duplicates);
  };

  return (
    <>
      <Dialog
        open={serialModelOpen}
        onClose={handleCloseSerialModel}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          style: {
            maxHeight: '95%',
            height: '95%',
            width: '60%'
          }
        }}
      >
        <DialogTitle id="product-modal-title">
          <span style={{ textAlign: 'left' }}>Add Serial Items</span>
          <IconButton
            aria-label="close"
            className="closeButton"
            onClick={handleCloseDialogOpen}
            style={{ textAlign: 'end' }}
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row'
                }}
              >
                <div
                  style={{ width: '100%', textAlign: 'left', margin: '5px' }}
                >
                  {!isSerialEdit ? (
                    <div>
                      <TextField
                        fullWidth
                        className={classes.input}
                        placeholder="Select Product"
                        value={
                          mainProductName === ''
                            ? productNameWhileEditing
                            : mainProductName
                        }
                        InputProps={{
                          disableUnderline: true,
                          classes: {
                            root: classes.bootstrapRoot,
                            input: classes.bootstrapInput
                          }
                        }}
                        InputLabelProps={{
                          shrink: true,
                          className: classes.bootstrapFormLabel
                        }}
                        onChange={(e) => {
                          if (e.target.value !== productNameWhileEditing) {
                            setMainProductName('');
                            resetProductDetailsForSerialData();
                          }

                          setProductNameWhileEditing(e.target.value);
                          getMainProductList(e.target.value);
                        }}
                      />{' '}
                      {mainProductlist.length > 0 ? (
                        <>
                          <ul
                            className={classes.mainlistbox}
                            style={{ width: '80%', zIndex: '5' }}
                          >
                            {mainProductlist.map((option, index) => (
                              <li
                                style={{ padding: 10, cursor: 'pointer' }}
                                onClick={() => {
                                  setMainProductlist([]);
                                  setProductNameWhileEditing('');
                                  setMainProductName(option.name);
                                  setProductDetailsForSerialData(option);
                                }}
                              >
                                <Grid
                                  container
                                  // justify="space-between"
                                  style={{ display: 'flex' }}
                                >
                                  <Grid item xs={12}>
                                    <p>{option.name}</p>
                                  </Grid>
                                </Grid>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : null}
                    </div>
                  ) : (
                    <TextField
                      variant={'standard'}
                      fullWidth
                      value={'Product Name: ' + productDetail.name}
                      InputProps={{
                        disableUnderline: true
                      }}
                    />
                  )}
                </div>
              </div>
              <div>
                {(mainProductName !== '' || productDetail.name) && (
                  <AppBar position="static" style={{ marginTop: '2%' }}>
                    <Tabs
                      value={Tabvalue}
                      onChange={handleTabChange}
                      aria-label=""
                      className={classes.tabs}
                    >
                      <Tab
                        label="UnSold"
                        {...a11yProps(0)}
                        className={classes.tab}
                      />
                      <Tab
                        label="Sold"
                        {...a11yProps(1)}
                        className={classes.tab}
                      />
                    </Tabs>
                  </AppBar>
                )}
                {productDetail.serialData &&
                  productDetail.serialData?.map((d, IMEIIndex) =>
                    Tabvalue === 0 ? (
                      <>
                        {!d.soldStatus && (
                          <Grid fluid className="app-main" index={IMEIIndex}>
                            <Col xs={12} sm={6}>
                              <FormControl style={{ width: '100%' }}>
                                <TextField
                                  required
                                  autoFocus
                                  variant="outlined"
                                  margin="dense"
                                  value={d.serialImeiNo}
                                  className="customTextField"                         
                                  onChange={(event) =>
                                    setSerialIMEIList(
                                      'serialImeiNo',
                                      IMEIIndex,
                                      event.target.value
                                    )
                                  }
                                />
                              </FormControl>
                            </Col>

                            <Col className={classes.leftCol} xs={12} sm={2}>
                              <Typography style={{ marginTop: '12px' }}>
                                {d.soldStatus === true ? '(Sold)' : '(Unsold)'}
                              </Typography>
                            </Col>

                            <Col className={classes.leftCol} xs={12} sm={2}>
                              <Typography style={{ marginTop: '12px' }}>
                                {d.purchased === true
                                  ? '(Purchased)'
                                  : '(Not Purchased)'}
                              </Typography>
                            </Col>

                            <Col className={classes.leftCol} xs={12} sm={2}>
                              <IconButton
                                aria-label="close"
                                style={{ marginTop: '2px' }}
                                onClick={(e) => {
                                  if (!d.soldStatus) {
                                    removeSerialIMEIList(IMEIIndex);
                                  } else {
                                    setErrorAlertProductMessage(
                                      'Sold Serial Number cannot be removed'
                                    );
                                    setErrorAlertProduct(true);
                                  }
                                }}
                                className="closeButton"
                              >
                                <CancelRoundedIcon />
                              </IconButton>
                            </Col>
                          </Grid>
                        )}
                      </>
                    ) : (
                      <>
                        {d.soldStatus && (
                          <Grid fluid className="app-main" index={IMEIIndex}>
                            <Col xs={12} sm={6}>
                              <FormControl style={{ width: '100%' }}>
                                <TextField
                                  required
                                  autoFocus
                                  variant="outlined"
                                  margin="dense"
                                  value={d.serialImeiNo}
                                  className="customTextField"                         
                                  onChange={(event) =>
                                    setSerialIMEIList(
                                      'serialImeiNo',
                                      IMEIIndex,
                                      event.target.value
                                    )
                                  }
                                />
                              </FormControl>
                            </Col>

                            <Col className={classes.leftCol} xs={12} sm={2}>
                              <Typography style={{ marginTop: '12px' }}>
                                {d.soldStatus === true ? '(Sold)' : '(Unsold)'}
                              </Typography>
                            </Col>

                            <Col className={classes.leftCol} xs={12} sm={2}>
                              <Typography style={{ marginTop: '12px' }}>
                                {d.purchased === true
                                  ? '(Purchased)'
                                  : '(Not Purchased)'}
                              </Typography>
                            </Col>

                            <Col className={classes.leftCol} xs={12} sm={2}>
                              <IconButton
                                aria-label="close"
                                style={{ marginTop: '2px' }}
                                onClick={(e) => {
                                  if (d.soldStatus === false) {
                                    removeSerialIMEIList(IMEIIndex);
                                  } else {
                                    setErrorAlertProductMessage(
                                      'Sold Serial Number cannot be removed'
                                    );
                                    setErrorAlertProduct(true);
                                  }
                                }}
                                className="closeButton"
                              >
                                <CancelRoundedIcon />
                              </IconButton>
                            </Col>
                          </Grid>
                        )}
                      </>
                    )
                  )}

                {Tabvalue === 0 && (
                  <Controls.Button
                    text="+ Add Manually"
                    size="medium"
                    variant="contained"
                    color="primary"
                    style={{
                      marginBottom: '50px',
                      marginTop: '16px',
                      marginLeft: '16px'
                    }}
                    onClick={addSerialNumber}
                  />
                )}
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div>
            <Button
              color="secondary"
              variant="outlined"
              onClick={(e) => {
                handleSerialSaveClick();
              }}
              style={{ color: 'white', backgroundColor: '#ef5251' }}
            >
              Save
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        open={openCloseDialog}
        onClose={handleCloseDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Serial Data will not be saved, Do you want to close?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={(e) => {
              handleCloseDialogClose();
              handleCloseSerialModel();
            }}
            color="primary"
          >
            Yes
          </Button>
          <Button onClick={handleCloseDialogClose} color="primary" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={openErrorAlertProduct}
        onClose={handleErrorAlertProductClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div
              dangerouslySetInnerHTML={{ __html: errorAlertProductMessage }}
            ></div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorAlertProductClose}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default injectWithObserver(AddProductSerial);