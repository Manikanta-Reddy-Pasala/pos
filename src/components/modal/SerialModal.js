import React, { useEffect } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  withStyles,
  IconButton,
  FormControl,
  TextField,
  Typography,
  Button
} from '@material-ui/core';
import { Grid, Col } from 'react-flexbox-grid';
import Controls from '../../components/controls/index';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import injectWithObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import './style.css';
import SerialData from 'src/Mobx/Stores/classes/SerialData';

const useStyles = makeStyles((theme) => ({
  productModalContent: {
    padding: 'inherit',
    '& .grid-padding': {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      '& .secondary-images': {
        '& button': {
          marginRight: theme.spacing(2)
        }
      }
    }
  },
  '& .grid-select': {
    selectedOption: {
      color: 'red'
    },
    marginLeft: '15px',
    '& .MuiFormControl-root': {
      width: '100%'
    },
    fullWidth: {
      width: '100%'
    }
  },
  checkboxMarginTop: {
    marginTop: '0.75rem'
  },
  checkboxMarginTopTax: {
    marginTop: '2rem'
  },
  marginTopFormGroup: {
    marginTop: '1.25rem'
  },
  marginBtmSet: {
    marginBottom: '15px'
  },
  primaryImageWrapper: {
    padding: theme.spacing(1),
    display: 'inline-block',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '5px',
    marginRight: theme.spacing(2)
  },
  primaryImageButtonWrapper: {
    '& #product-primary-upload': {
      display: 'none'
    },
    '& #product-secondary-upload': {
      display: 'none'
    },
    '& .uploadImageButton': {
      color: '#fff',
      bottom: '10px',
      backgroundColor: '#4a83fb',
      padding: '7px',
      fontSize: '14px',
      fontFamily: 'Roboto',
      fontWeight: 500,
      lineHeight: 1.75,
      borderRadius: '4px',
      marginRight: theme.spacing(2),
      '&.primaryImage': {
        margin: '5px',
        position: 'relative',
        top: '-20px'
      },
      '& i': {
        marginRight: '8px'
      }
    }
  },
  imageMargin: {
    marginLeft: theme.spacing(2)
  },
  primaryButton: {
    backgroundColor: '#4a83fb',
    bottom: '10px',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#4a83fb'
    }
  },
  errorMsg: {
    fontSize: '14px',
    color: '#EF5350'
  },
  addBatchButton: {
    background: '#9DCB6A',
    width: '86%',
    color: 'white',
    border: '#9DCB6A',
    padding: '5.5px',
    textTransform: 'capitalize',
    '&:hover': {
      background: '#9DCB6A',
      color: 'white'
    }
  },
  createNewBtn: {
    background: '#EF5350',
    color: 'white',
    border: '#EF5350',
    textTransform: 'capitalize',
    '&:hover': {
      background: '#EF5350',
      color: 'white'
    }
  },
  itemTable: {
    width: '100%'
  },
  agGridclass: {
    '& .ag-paging-panel': {
      fontSize: '10px',
      '& .ag-paging-row-summary-panel': {
        width: '52px'
      }
    }
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
  bootstrapFormLabel: {
    fontSize: 16
  },
  input: {
    width: '30%'
  },
  listbox: {
    margin: 5,
    padding: 10,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
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
  stickyElement: {
    position: 'sticky'
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
  }
}));
const DialogTitle = withStyles((theme) => ({
  root: {
    '& h2': {
      fontSize: '22px'
    },
    '& .closeButton': {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.success[500]
    }
  }
}))(MuiDialogTitle);

const DialogActions = withStyles((theme) => ({
  root: {
    marginTop: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const SerialModal = (props) => {
  const classes = useStyles();
  const stores = useStore();

  const { productAddSerialDialogOpen, productDetail } = toJS(
    stores.ProductStore
  );

  const {
    handleAddSerialModalOpen,
    handleSerialModalClose,
    addSerialIMEIList,
    removeSerialIMEIList,
    setSerialIMEIList,
    saveSerialData
  } = stores.ProductStore;

  const [openNoDataAlert, setNoDataAlert] = React.useState(false);
  const [noDataString, setNoDataString] = React.useState('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { getTransactionData } = stores.TransactionStore;

  const handleNoDataAlertClose = () => {
    setNoDataAlert(false);
  };

  const saveDataClick = () => {
    const serialNoValidate = productDetail.serialData?.map((value, index) => {
      if (value.serialImeiNo === '') {
        return false;
      } else {
        return true;
      }
    });

    if (!serialNoValidate.every(Boolean)) {
      setNoDataString('Serial Number cannot be empty');
      setNoDataAlert(true);
    } else {
      saveSerialData(true);
    }
  };
  const addSerialNumber = () => {
    let newSerialData = new SerialData().defaultValues();

    addSerialIMEIList(newSerialData);
  };

  useEffect(() => {
    async function fetchData() {
      getTransactionData();
    }

    fetchData();
  }, []);

  return (
    <div>
      <Controls.Button
        text="Add Serial"
        size="small"
        variant="contained"
        color="secondary"
        className={classes.addBatchButton}
        onClick={() => handleAddSerialModalOpen()}
      />

      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={productAddSerialDialogOpen}
        onClose={handleSerialModalClose}
      >
        <DialogTitle id="product-modal-title">
          Add Serial
          <IconButton
            aria-label="close"
            onClick={handleSerialModalClose}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {productDetail.serialData &&
            productDetail.serialData?.map((d, IMEIIndex) => (
              <Grid fluid className="app-main" index={IMEIIndex}>
                <Col xs={12} sm={6}>
                  <FormControl style={{ width: '90%' }}>
                    <TextField
                      required
                      autoFocus
                      variant="outlined"
                      margin="dense"
                      value={d.serialImeiNo}
                      className="customTextField"
                      onFocus={(e) =>
                        d.serialImeiNo === ''
                          ? setSerialIMEIList('serialImeiNo', IMEIIndex, '')
                          : ''
                      }
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
                  <IconButton
                    aria-label="close"
                    style={{ marginTop: '2px' }}
                    onClick={(e) => {
                      if (d.soldStatus === false) {
                        removeSerialIMEIList(IMEIIndex);
                      } else {
                        setNoDataString('Sold Serial Number cannot be removed');
                        setNoDataAlert(true);
                      }
                    }}
                    className="closeButton"
                  >
                    <CancelRoundedIcon />
                  </IconButton>
                </Col>
              </Grid>
            ))}

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
        </DialogContent>
        <DialogActions>
          <Controls.Button
            text="Save Serial"
            size="small"
            variant="contained"
            color="secondary"
            style={{ color: 'white' }}
            onClick={() => {
              saveDataClick();
            }}
          />
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openNoDataAlert}
        onClose={handleNoDataAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{noDataString}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNoDataAlertClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default injectWithObserver(SerialModal);