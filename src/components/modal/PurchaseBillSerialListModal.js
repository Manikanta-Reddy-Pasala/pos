import React, { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Grid,
  withStyles,
  IconButton,
  Typography,
  Button,
  Checkbox
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import DialogActions from '@material-ui/core/DialogActions';

const useStyles = makeStyles((theme) => ({
  productModalContent: {
    padding: 'inherit',
    '& .grid-padding': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
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
  listli: {
    borderBottom: '1px solid #c5c4c4',
    paddingBottom: 10,
    marginBottom: 12,
    background: 'none'
  },
  listHeaderBox: {
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    padding: '10px 30px 0px 30px'
  },
  listbox: {
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    padding: '10px 30px 30px 30px',

    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    }
  },
  activeClass: {
    backgroundColor: '#2977f5',
    color: 'white'
  },
  content: {
    cursor: 'pointer'
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

const PurchaseBillSerialListModal = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const inputRef = useRef([]);

  const { OpenPurchaseBillSerialList } = toJS(stores.PurchasesAddStore);

  const {
    handleSerialListModalClose,
    selectProductFromSerial,
    modifySelectedSerialNoForPurchase
  } = stores.PurchasesAddStore;

  return (
    <Dialog open={OpenPurchaseBillSerialList} fullWidth={true} maxWidth={'sm'}>
      <DialogTitle id="product-modal-title" style={{ textAlign: 'center' }}>
        Choose Serial
      </DialogTitle>
      <DialogContent className={classes.productModalContent}>
        <ul className={classes.listHeaderBox}>
          <li className={classes.listli}>
            <Grid container style={{ display: 'flex' }}>
              <Grid item xs={6}>
                <Typography variant="h5">Serial Number</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5"></Typography>
              </Grid>
            </Grid>
          </li>
        </ul>
        <ul className={classes.listbox}>
          {props.productDetail.serialData
            ? props.productDetail.serialData.map((option, index) => (
                <li
                  style={{ padding: '10px 0 10px 0', cursor: 'pointer' }}
                  key={index + 'serialno'}
                >
                  <Button
                    key={index + 'btn'}
                    disableRipple
                    style={{
                      width: '100%',
                      textAlign: 'inherit'
                    }}
                    ref={(el) => (inputRef.current[Number(index)] = el)}
                  >
                    <Grid
                      container
                      style={{ display: 'flex' }}
                      className={classes.listitemGroup}
                    >
                      <Grid item xs={6}>
                        <p>{option.serialNo}</p>
                      </Grid>
                      <Grid item xs={6}>
                        <Checkbox
                          checked={option.selected}
                          onChange={(e) => {
                            modifySelectedSerialNoForPurchase(
                              e.target.checked,
                              index
                            );
                          }}
                          key={index}
                        />
                      </Grid>
                    </Grid>
                  </Button>
                </li>
              ))
            : null}
        </ul>
      </DialogContent>
      <DialogActions>
        <div>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              selectProductFromSerial(props.selectedIndex, props.productDetail);
              handleSerialListModalClose();
            }}
            style={{ color: 'white', backgroundColor: '#ef5251' }}
          >
            Save
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default injectWithObserver(PurchaseBillSerialListModal);