import { Box } from '@material-ui/core';
import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Grid } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import {
  SliderComponent,
  PackageInfo,
  PackageDetailsTable
} from './components';
import { SecondaryButton } from '../AddInvoice/MFGDetails/MEGDetails.styles';
import { useStyles } from './styles';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import injectWithObserver from '../../../../Mobx/Helpers/injectWithObserver';

const PackageDetails = ({ handlePackageClose }) => {
  const classes = useStyles();
  const stores = useStore();

  const { saleDetails, items } = toJS(stores.SalesAddStore);

  const { saveData } = stores.SalesAddStore;

  const { invoice_date, sequenceNumber } = saleDetails || {};

  const [config, setConfig] = useState('ctn');

  const ITEM_CNONFIG = {
    ctn: 'CTN'
  };

  const handleChange = (event) => {
    setConfig(event.target.value);
  };

  const getTotals = (key) =>
    items.reduce((total, data) => {
      total = total + Number(data[key]);
      return total;
    }, 0);

  const savePackageDetails = () => {
    saveData(false);
    handlePackageClose();
  };

  return (
    <Dialog fullScreen open TransitionComponent={SliderComponent}>
      <Box pb={8}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems={'center'}
              flexGrow={1}
            >
              <Box
                color="#222"
                display={'flex'}
                flexGrow={1}
                alignItems={'center'}
              >
                <Box fontWeight="bold" fontSize="1.5rem" mr={2}>
                  Add Packaging
                </Box>

                <Box
                  fontWeight="bold"
                  fontSize="1.25rem"
                  mb={2}
                  color="secondary.light"
                >
                  <Box width={'300px'} pt={2}>
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true
                      }}
                      size="small"
                      select={true}
                      label={'Item Config'}
                      value={config || ''}
                      variant="outlined"
                      onChange={handleChange}
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="">{'Select'}</MenuItem>
                      <MenuItem value={'ctn'}>CTN</MenuItem>
                    </TextField>
                  </Box>
                </Box>

                <Box
                  mr={2}
                  display="flex"
                  alignItems="center"
                  ml="auto"
                  fontSize="1.25rem"
                >
                  <Box fontWeight="bold" component={'span'}>
                    Invoice No:
                  </Box>{' '}
                  <Box component={'span'} ml={2} color="secondary.main">
                    {sequenceNumber}
                  </Box>
                </Box>
                <Box
                  fontSize="1.25rem"
                  mr="auto"
                  display="flex"
                  alignItems="center"
                >
                  <Box fontWeight="bold" component={'span'}>
                    Invoice Date:
                  </Box>
                  <Box component={'span'} ml={2} color="secondary.main">
                    {invoice_date}
                  </Box>
                </Box>
              </Box>
              <IconButton
                color="primary"
                edge="end"
                aria-label="close"
                onClick={handlePackageClose}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Box p={2}>
          <PackageInfo
            details={saleDetails}
            totalPackage={getTotals('totalPackingNos')}
          />
          <Box py={2}>
            <PackageDetailsTable itemConfig={ITEM_CNONFIG} config={config} />
          </Box>
        </Box>
      </Box>

      <AppBar className={classes.appBarBottom}>
        <Toolbar>
          <Box
            display="flex"
            justifyContent="end"
            alignItems={'center'}
            flexGrow={1}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems={'center'}
              flexGrow={1}
              color={'#000'}
              px={2}
            >
              <Box fontWeight={600} textAlign={'right'}>
                Totals
              </Box>
              <Box fontWeight={600} display={'flex'} px={3}>
                Qty:{' '}
                <Box fontWeight={400} ml={2}>
                  {getTotals('qty')}
                </Box>
              </Box>
              <Box fontWeight={600} display={'flex'} px={3}>
                Amount:{' '}
                <Box fontWeight={400} ml={2}>
                  {getTotals('amount')}
                </Box>
              </Box>
              <Box fontWeight={600} display={'flex'} px={3}>
                No Of CTN:{' '}
                <Box fontWeight={400} ml={2}>
                  {getTotals('totalPackingNos')}
                </Box>
              </Box>
              <Box fontWeight={600} display={'flex'} px={3}>
                Total Net Weight :{' '}
                <Box fontWeight={400} ml={2}>
                  {getTotals('totalPackageNetWeight')}
                </Box>
              </Box>
              <Box fontWeight={600} display={'flex'} px={3}>
                Total Gross Weight:{' '}
                <Box fontWeight={400} ml={2}>
                  {getTotals('totalPackageGrossWeight')}
                </Box>
              </Box>
            </Box>
            <SecondaryButton
              color="secondary"
              variant="contained"
              onClick={savePackageDetails}
            >
              Proceed
            </SecondaryButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Dialog>
  );
};

export default injectWithObserver(PackageDetails);
