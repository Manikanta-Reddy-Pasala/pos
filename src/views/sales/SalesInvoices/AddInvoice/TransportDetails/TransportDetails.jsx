import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import { groups } from './utils';
import { SliderComponent, InputGroups } from '../components';
import { SecondaryButton } from './Transportdetails.styled';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { toJS } from 'mobx';

const Transportdetails = () => {
  const stores = useStore();

  const { saleDetails } = toJS(stores.SalesAddStore);

  const { handleCloseTransportDetails, setSalesDetails } = stores.SalesAddStore;

  const dataInputs = groups;

  const handleClose = () => {
    handleCloseTransportDetails();
  };

  const handleInputChange = (key, value) => {
    setSalesDetails(key, value);
  };

  return (
    <Dialog
      fullWidth
      open
      onClose={handleClose}
      TransitionComponent={SliderComponent}
      maxWidth={'lg'}
    >
      <DialogTitle color="transparent">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bgcolor="white"
          elevation={4}
        >
          <Box fontSize={'1.5rem'} fontWeight={'bold'}>
            Transport Details
          </Box>
          <IconButton onClick={handleClose}>
            <CancelIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Box
        p={2}
        height="100%"
        overflow="auto"
        borderTop="1px solid rgba(0, 0, 0, 0.12)"
        borderBottom="1px solid rgba(0, 0, 0, 0.12)"
      >
        {dataInputs.map(({ name, data }) => (
          <Box key={name} mb={2}>
            <InputGroups
              data={data}
              handleInputChange={handleInputChange}
              inputValues={saleDetails}
              name={name}
            />
          </Box>
        ))}
      </Box>
      <DialogActions>
        <SecondaryButton
          color="secondary"
          variant="contained"
          onClick={handleClose}
        >
          Done
        </SecondaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default Transportdetails;
