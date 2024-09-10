import {
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Dialog
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React, { useState } from 'react';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import * as Db from '../RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';

function Moreoptions(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const store = useStore();
  const { viewOrEditSaleTxnItem } = store.SalesAddStore;
  const { viewOrEditSaleReturnTxnItem } = store.ReturnsAddStore;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleErrorAlertMessageClose = () => {
    setErrorMessage('');
    setErrorAlertMessage(false);
  };

  const showErrorAlertMessage = () => {
    let data = props.item.errorReason;
    setErrorMessage(data);
    setErrorAlertMessage(true);
  };

  const getSaleData = async () => {
    console.log('getSaleData: ' + props.item.sequenceNumber);
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    var query;

    if (props.item.type === 'Sales') {
      query = db.sales.findOne({
        selector: {
          $and: [
            { invoice_number: props.item.invoiceNumber },
            { businessId: { $eq: businessData.businessId } }
          ]
        }
      });
    } else {
      query = db.salesreturn.findOne({
        selector: {
          $and: [
            { sales_return_number: props.item.invoiceNumber },
            { businessId: { $eq: businessData.businessId } }
          ]
        }
      });
    }

    query.exec().then(async (data) => {
      if (!data) {
        // No  data is found so cannot update any information
        return;
      }

      if (props.item.type === 'Sales') {
        viewOrEditSaleTxnItem(data);
      } else {
        viewOrEditSaleReturnTxnItem(data);
      }
    });
  };

  return (
    <div>
      <div>
        <IconButton onClick={handleClick}>
          <MoreVert fontSize="inherit" />
        </IconButton>

        <Menu
          id="moremenu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem key={1} onClick={() => showErrorAlertMessage()}>
            View Error{' '}
          </MenuItem>
          <MenuItem key={2} onClick={(e) => getSaleData()}>
            View/Edit{' '}
          </MenuItem>
        </Menu>
      </div>

      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={openErrorAlertMessage}
        onClose={handleErrorAlertMessageClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            {' '}
            <div
              dangerouslySetInnerHTML={{
                __html: errorMessage ? errorMessage : 'No error found'
              }}
            ></div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorAlertMessageClose}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default injectWithObserver(Moreoptions);