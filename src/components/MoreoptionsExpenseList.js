import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React from 'react';
import OpenPreview from './OpenPreview';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import ConfirmModal from './modal/ConfirmModal';

function Moreoptions(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialogName, setOpenDialog] = React.useState(null);
  const [isStartPrint, setIsStartPrint] = React.useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = React.useState(false);

  const store = useStore();
  const { viewOrEditItem, deleteExpense } = store.ExpensesStore;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openpdf = () => {
    setOpenDialog('pdf');
    handleClose();
  };
  const openpreview = () => {
    setOpenDialog('preview');
    handleClose();
  };
  const openprint = () => {
    setIsStartPrint(true);
    openpreview();
  };

  const closeDialog = () => {
    setOpenDialog(null);
  };

  const deleteItem = () => {
    setIsOpenConfirmModal(true);
  };

  const confirmDeleteItem = (confirm) => {
    if (confirm) {
      deleteExpense(props.item);
      setIsOpenConfirmModal(false);
      setAnchorEl(null);
    }
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreVert fontSize="inherit" />
      </IconButton>

      {isOpenConfirmModal ? (
        <ConfirmModal
          open={isOpenConfirmModal}
          onConfirm={(isConfirm) => confirmDeleteItem(isConfirm)}
          onClose={() => setIsOpenConfirmModal(false)}
        />
      ) : (
        ''
      )}

      <Menu
        id="moremenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem key={1} onClick={() => viewOrEditItem(props.item)}>
          View/Edit{' '}
        </MenuItem>
        {localStorage.getItem('isAdmin') === 'true' && (
          <MenuItem key={2} onClick={() => deleteItem()}>
            Delete{' '}
          </MenuItem>
        )}
      </Menu>
      {openDialogName === 'preview' ? (
        <OpenPreview
          open={openDialogName === 'preview'}
          onClose={closeDialog}
          id={props.id}
          SalesData={props.item}
          startPrint={isStartPrint}
        />
      ) : (
        ''
      )}
    </div>
  );
}

export default injectWithObserver(Moreoptions);
