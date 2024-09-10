import { Box, Paper } from '@material-ui/core';
import React from 'react';
import { Grid } from '@material-ui/core';
import { useStyles } from '../../styles';

const PackageInfo = ({ details, totalPackage }) => {
  const classes = useStyles();
  const packageDetails = JSON.parse(JSON.stringify(details));

  console.log(packageDetails);

  const {
    portOfLoading,
    portOfDischarge,
    exportCountry,
    exportCountryOrigin,
    customer_name,
    customerGSTNo,
    buyerOtherBillTo
  } = packageDetails;

  const { name, address, country, state, pincode } = buyerOtherBillTo || {};

  return (
    <Box>
      <Grid
        container
        m={0}
        textAlign="center"
        component={Paper}
        elevation={4}
        className={classes.wrapper}
      >
        <Grid item xs={2} component={Box} mb={'1rem !important'}>
          <Grid item fontWeight="bold" component={Box}>
            Pre Carriage By:
          </Grid>
          <Grid item component={Box}>
            Road
          </Grid>
        </Grid>
        <Grid item xs={2} component={Box} mb={'1rem !important'}>
          <Grid item fontWeight="bold" component={Box}>
            Port of Loading:
          </Grid>
          <Grid item component={Box}>
            {portOfLoading}
          </Grid>
        </Grid>
        <Grid item xs={2} component={Box} mb={'1rem !important'}>
          <Grid item fontWeight="bold" component={Box}>
            Port of Disc:
          </Grid>
          <Grid item component={Box}>
            {portOfDischarge}
          </Grid>
        </Grid>
        <Grid item xs={2} component={Box} mb={'1rem !important'}>
          <Grid item fontWeight="bold" component={Box}>
            Final Destination:
          </Grid>
          <Grid item component={Box}>
            {exportCountry}
          </Grid>
        </Grid>
        <Grid item xs={2} component={Box} mb={'1rem !important'}>
          <Grid item fontWeight="bold" component={Box}>
            Marks and Nos:
          </Grid>
          <Grid item component={Box}>
            -
          </Grid>
        </Grid>
        <Grid item xs={2} component={Box} mb={'1rem !important'}>
          <Grid item fontWeight="bold" component={Box}>
            No and Kind of package:
          </Grid>
          <Grid item component={Box}>
            {totalPackage}
          </Grid>
        </Grid>
        <Grid item xs={2} component={Box} mb={'1rem !important'}>
          <Grid item fontWeight="bold" component={Box}>
            Country of origin:
          </Grid>
          <Grid item component={Box}>
            {exportCountryOrigin}
          </Grid>
        </Grid>
        <Grid item xs={2} component={Box} mb={'1rem !important'}>
          <Grid item fontWeight="bold" component={Box}>
            Country of final:
          </Grid>
          <Grid item component={Box}>
            {exportCountry}
          </Grid>
        </Grid>
        <Grid item xs={2} component={Box} mb={'1rem !important'}>
          <Grid item fontWeight="bold" component={Box}>
            Consignees:
          </Grid>
          <Grid item component={Box}>
            {customer_name} {customerGSTNo}
          </Grid>
        </Grid>
        <Grid item xs={2} component={Box} mb={'1rem !important'}>
          <Grid item fontWeight="bold" component={Box}>
            Buyers:
          </Grid>
          <Grid item component={Box}>
            {[name, address, country, state, pincode]
              ?.filter(Boolean)
              ?.join(',')}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PackageInfo;
