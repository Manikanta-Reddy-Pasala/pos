import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { toJS } from 'mobx';
import OpenPreview from './OpenPreview';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import ConfirmModal from './modal/ConfirmModal';

function Moreoptions(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [isOpenConfirmModal, setIsOpenConfirmModal] = React.useState(false);

  const store = useStore();
  const { viewOrSpecialDayManagment, deleteSpecialDay } = store.SpecialDayManagementStore;


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const deleteItem = () => {
    setIsOpenConfirmModal(true);
  };

  const confirmDeleteItem = async (confirm) => {
    if (confirm) {
      deleteSpecialDay(props.item);
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
        <MenuItem key={1} 
        onClick={(e) => {
          viewOrSpecialDayManagment(props.item);
          handleClose();
        }}
        >
          View/Edit{' '}
        </MenuItem>

        <MenuItem key={2} onClick={() => deleteItem()}>
          Delete{' '}
        </MenuItem>
      </Menu>

    </div>
  );
}

export default injectWithObserver(Moreoptions);
