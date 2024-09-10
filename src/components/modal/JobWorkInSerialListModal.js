import React, { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Grid,
  withStyles,
  IconButton,
  Typography,
  Button
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import injectWithObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';

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

const JobWorkInSerialListModal = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const [active, setActive] = useState(0);
  const inputRef = useRef([]);

  const { selectProductFromSerial } = stores.JobWorkInStore;

  const { handleSerialListModalClose, OpenJobWorkInSerialList } = stores.JobWorkInStore;

  useEffect(() => {
    setActive(0);
  }, [props]);

  const handleKeyDownFunction = (e) => {
    let next = '';
    if (props.productDetail.serialData) {
      if (e.keyCode === 40) {
        next =
          inputRef.current[
            active + 1 < props.productDetail.serialData.length
              ? active + 1
              : active
          ];
        setActive(
          active + 1 < props.productDetail.serialData.length
            ? active + 1
            : active
        );
      }
      if (e.keyCode === 38) {
        next = inputRef.current[active - 1 >= 0 ? active - 1 : active];
        setActive(active - 1 >= 0 ? active - 1 : active);
      }

      if (e.key === 'Enter') {
        setActive(active);
        selectProductFromSerial(
          props.productDetail.serialData[active],
          props.selectedIndex,
          props.productDetail
        );
      }
    }
    if (next) {
      next.focus();
    }
  };

  return (
    <Dialog
      open={OpenJobWorkInSerialList}
      fullWidth={true}
      maxWidth={'sm'}
      onKeyDown={(e) => {
        handleKeyDownFunction(e);
      }}
      onClose={function (event) {
        handleSerialListModalClose(
          props.productDetail.serialData
            ? props.productDetail.serialData[0]
            : false
        );
      }}
    >
      <DialogTitle id="product-modal-title" style={{ textAlign: 'center' }}>
        Choose Serial
        <IconButton
          aria-label="close"
          className="closeButton"
          onClick={function (event) {
            handleSerialListModalClose(
              props.productDetail.serialData
                ? props.productDetail.serialData[0]
                : false
            );
          }}
        >
          <CancelRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.productModalContent}>
        <ul className={classes.listHeaderBox}>
          <li className={classes.listli}>
            <Grid container style={{ display: 'flex' }}>
              <Grid item xs={6}>
                <Typography variant="h5">Serial Number</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">Status</Typography>
              </Grid>
            </Grid>
          </li>
        </ul>
        <ul className={classes.listbox}>
          {props.productDetail.serialData
            ? props.productDetail.serialData.map((option, index) => (
                <li
                  style={{ padding: '10px 0 10px 0', cursor: 'pointer' }}
                  onClick={function (event) {
                    if (option.soldStatus === false) {
                      setActive(index);
                      selectProductFromSerial(option, props.selectedIndex, props.productDetail);
                    }
                  }}
                  className={active === index ? classes.activeClass : ''}
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
                        <p>{option.serialImeiNo}</p>
                      </Grid>
                      <Grid item xs={6}>
                        <p>{option.soldStatus === false ? 'UNSOLD' : 'SOLD'}</p>
                      </Grid>
                    </Grid>
                  </Button>
                </li>
              ))
            : null}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default injectWithObserver(JobWorkInSerialListModal);