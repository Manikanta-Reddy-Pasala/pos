import React, { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Grid,
  Button,
  withStyles,
  IconButton,
  Typography
} from '@material-ui/core';
import { toJS } from 'mobx';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import injectWithObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { Optional } from 'ag-grid-community';

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
  },
  batchTable: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    borderCollapse: 'collapse',
    width: '100%'
  },
  rowstyle: {
    border: '1px solid #ddd',
    padding: '8px'
  },
  headstyle: {
    paddingTop: '12px',
    paddingBottom: '12px',
    textAlign: 'left',
    backgroundColor: '#EF5350',
    color: 'white'
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

const PurchaseBatchListModal = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const [active, setActive] = useState(0);
  const inputRef = useRef([]);

  const { selectProductFromBatch } = stores.PurchasesAddStore;

  const { handleBatchListModalClose, OpenBatchList } = stores.PurchasesAddStore;

  useEffect(() => {
    setActive(0);
  }, [props]);

  const handleKeyDownFunction = (e) => {
    let next = '';
    if (props.productDetail.batchData) {
      if (e.keyCode === 40) {
        next =
          inputRef.current[
            active + 1 < props.productDetail.batchData.length
              ? active + 1
              : active
          ];
        setActive(
          active + 1 < props.productDetail.batchData.length
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
        selectProductFromBatch(
          props.productDetail.batchData[active],
          props.selectedIndex
        );
      }
    }
    if (next) {
      next.focus();
    }
  };

  return (
    <Dialog
      open={OpenBatchList}
      fullWidth={true}
      maxWidth={'md'}
      onKeyDown={(e) => {
        handleKeyDownFunction(e);
      }}
      onClose={function (event) {
        handleBatchListModalClose(
          props.productDetail.batchData
            ? props.productDetail.batchData[0]
            : false
        );
      }}
    >
      <DialogTitle id="product-modal-title" style={{ textAlign: 'center' }}>
        Choose Batches
        <IconButton
          aria-label="close"
          className="closeButton"
          onClick={function (event) {
            handleBatchListModalClose(
              props.productDetail.batchData
                ? props.productDetail.batchData[0]
                : false
            );
          }}
        >
          <CancelRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.productModalContent}>
        {/* <ul className={classes.listHeaderBox}>
          <li className={classes.listli}>
            <Grid container style={{ display: 'flex' }}>
              <Grid item xs={4}>
                <Typography variant="h5">Batch Number</Typography>
              </Grid>

              <Grid item xs={2}>
                <Typography variant="h5">Purchase Price</Typography>
              </Grid>

              <Grid item xs={2}>
                <Typography variant="h5">Sale Price</Typography>
              </Grid>

              <Grid item xs={2}>
                <Typography variant="h5">Expiry Date</Typography>
              </Grid>

              <Grid item xs={2}>
                <Typography variant="h5">Quantity</Typography>
              </Grid>
            </Grid>
          </li>
        </ul>
        <ul className={classes.listbox}>
          {props.productDetail.batchData
            ? props.productDetail.batchData.map((option, index) => (
                <li
                  style={{ padding: '10px 0 10px 0', cursor: 'pointer' }}
                  onClick={function (event) {
                    setActive(index);
                    selectProductFromBatch(option, props.selectedIndex);
                  }}
                  className={active === index ? classes.activeClass : ''}
                  key={index + 'batchno'}
                >
                  <Button
                    key={index + 'btn'}
                    disableRipple
                    style={{
                      width: '100%',
                      textAlign: 'inherit'
                    }}
                    buttonRef={(el) => (inputRef.current[Number(index)] = el)}
                  >
                    <Grid
                      container
                      // justify="space-between"
                      style={{ display: 'flex' }}
                      className={classes.listitemGroup}
                    >
                      <Grid item xs={4} key={index}>
                        <p>{option.batchNumber}</p>
                      </Grid>
                      <Grid item xs={2} key={index}>
                        <p>{option.purchasedPrice}</p>
                      </Grid>
                      <Grid item xs={2}>
                        <p>{option.salePrice}</p>
                      </Grid>
                      <Grid item xs={2} key={index}>
                        <p>{option.expiryDate}</p>
                      </Grid>
                      <Grid item xs={2} key={index}>
                        <p>{option.qty}</p>
                      </Grid>
                    </Grid>
                  </Button>
                </li>
              ))
            : null}
        </ul> */}

        <table className={`${classes.batchTable}`}>
          <thead>
            <tr>
              {props.productDetail.batchData && props.productDetail.batchData[0].properties
                ? props.productDetail.batchData[0].properties.map(
                    (property, index) => (
                      <th
                        className={`${classes.headstyle} ${classes.rowstyle}`}
                      >
                        <p>{property.title}</p>
                      </th>
                    )
                  )
                : ''}

              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                <Typography variant="h5">Vendor Name</Typography>
              </th>

              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                <Typography variant="h5">Batch Number</Typography>
              </th>

              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                <Typography variant="h5">Purchase Price</Typography>
              </th>

              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                <Typography variant="h5">Sale Price</Typography>
              </th>

              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                <Typography variant="h5">Expiry Date</Typography>
              </th>

              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                <Typography variant="h5">Quantity</Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {props.productDetail.batchData
              ? props.productDetail.batchData.map((option, index) => (
                  <tr
                    style={{ cursor: 'pointer' }}
                    onClick={function (event) {
                      setActive(index);
                      selectProductFromBatch(option, props.selectedIndex);
                    }}
                  >
                    {option.properties.map((data) => (
                      <td className={`${classes.rowstyle}`}>
                        <p>{data.value}</p>
                      </td>
                    ))}
                    <td className={`${classes.rowstyle}`}>
                      <p>{option.vendorName}</p>
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      <p>{option.batchNumber}</p>
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      <p>{option.purchasedPrice}</p>
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      <p>{option.salePrice}</p>
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      <p>{option.expiryDate}</p>
                    </td>
                    <td className={`${classes.rowstyle}`}>
                      <p>{option.qty}</p>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
};

export default injectWithObserver(PurchaseBatchListModal);