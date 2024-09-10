import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React from 'react';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';

function Moreoptions(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const store = useStore();
  const { revertSaleAmendmentStatus } = store.SalesAddStore;
  const { revertSaleReturnAmendmentStatus } = store.ReturnsAddStore;

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
        <MenuItem
          key={1}
          onClick={() => {
            if (props.item.sales_return_number) {
              revertSaleReturnAmendmentStatus(props.item.sales_return_number);        
            } else {
              revertSaleAmendmentStatus(props.item.invoice_number);
            }
          }}
        >
          Restore{' '}
        </MenuItem>
      </Menu>
    </div>
  );
}

export default injectWithObserver(Moreoptions);