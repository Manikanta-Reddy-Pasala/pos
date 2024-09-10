import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React from 'react';
import { toJS } from 'mobx';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';

function MoreoptionsBankTransaction(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);


  const store = useStore();


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        <MenuItem key={1} >
          View/Edit{' '}
        </MenuItem>

        <MenuItem key={2}>
          Delete{' '}
        </MenuItem>
      </Menu>
 
    </div>
  );
}

export default injectWithObserver(MoreoptionsBankTransaction);
