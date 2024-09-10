import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import { IconButton } from '@material-ui/core';
import FilterIcon from '../../../../icons/FilterIcon';
import Filter from '../../../../components/filter';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2)
  },
  icon: {
    position: 'absolute',
    marginLeft: '5px',
    padding: '0px',
    fontSize: 15
  },
  filter: {
    position: 'absolute',
    marginLeft: '50px',
    bottom: '30px'
  }
}));

export default function SimplePopover() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <IconButton>
        <FilterIcon className={classes.icon} onClick={handleClick} />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Filter />
      </Popover>
    </div>
  );
}
