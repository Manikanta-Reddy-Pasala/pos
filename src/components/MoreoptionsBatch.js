import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React, { useState } from 'react';
import OpenPreview from './OpenPreview';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import ConfirmModal from './modal/ConfirmModal';

function Moreoptions(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialogName, setOpenDialog] = React.useState(null);
  const [isStartPrint, setIsStartPrint] = React.useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const store = useStore();
  const { viewOrEditBatchItem, deleteBatchItem, copyBatchItem } =
    store.ProductStore;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const deleteItem = () => {
    setIsOpenConfirmModal(true);
  };

  const confirmDeleteItem = (confirm) => {
    if (confirm) {
      deleteBatchItem(props.item);
      setIsOpenConfirmModal(false);
      setAnchorEl(null);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const closeDialog = () => {
    setOpenDialog(null);
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
        <MenuItem key={1} onClick={() => viewOrEditBatchItem(props.item)}>
          View/Edit{' '}
        </MenuItem>

        <MenuItem key={2} onClick={() => copyBatchItem(props.item)}>
          Copy{' '}
        </MenuItem>

        <MenuItem key={3} onClick={() => deleteItem()}>
          Delete{' '}
        </MenuItem>
      </Menu>
      {openDialogName === 'preview' ? (
        <OpenPreview
          open={true}
          onClose={closeDialog}
          id={props.id}
          startPrint={isStartPrint}
        />
      ) : (
        ''
      )}
    </div>
  );
}

export default injectWithObserver(Moreoptions);