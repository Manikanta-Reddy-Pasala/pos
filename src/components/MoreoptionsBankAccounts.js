import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React, { useEffect } from 'react';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';

function MoreoptionsBankAccounts(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const store = useStore();
  const { viewOrEditBankAccount, deleteBankAccount } = store.BankAccountsStore;
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { bankTransactionList } = toJS(store.BankAccountsStore);
  const { getBankAccountTransactions } = store.BankAccountsStore;
  const [bankAccountNoDeleteAlert, setBankAccountNoDeleteAlert] =
    React.useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialogueClose = () => {
    setDialogOpen(false);
    handleClose();
  };

  const onDeleteClicked = () => {
    if (bankTransactionList.length > 0) {
      setBankAccountNoDeleteAlert(true);
    } else {
      setDialogOpen(true);
    }
  };

  const handleBankAccountNoDeleteDialogClose = () => {
    setBankAccountNoDeleteAlert(false);
  };

  return (
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
        <MenuItem
          key={1}
          onClick={(e) => {
            viewOrEditBankAccount(props.item);
            handleClose();
          }}
        >
          View/Edit{' '}
        </MenuItem>

        {localStorage.getItem('isAdmin') === 'true' && (
          <MenuItem
            key={2}
            onClick={(e) => {
              onDeleteClicked();
            }}
          >
            Delete{' '}
          </MenuItem>
        )}
      </Menu>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogueClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" onClose={handleClose}>
          <Typography variant="h4"> Alert! </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to delete ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={(e) => {
              deleteBankAccount(props.item);
              handleDialogueClose();
            }}
          >
            Yes
          </Button>

          <Button variant="contained" onClick={handleDialogueClose}>
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={bankAccountNoDeleteAlert}
        onClose={handleBankAccountNoDeleteDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" onClose={handleClose}>
          <Typography variant="h4"> Alert! </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography gutterBottom>
            The Bank account can't be deleted as it has Transactions. Please
            delete transactions to delete the bank account
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleBankAccountNoDeleteDialogClose}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default injectWithObserver(MoreoptionsBankAccounts);
