import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import CustomTextfield from '../../../../components/controls/CustomTextfield';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'grid'
    // gridTemplateColumns: 'repeat(12, 1fr)',
    // gridGap: theme.spacing(3)
  },
  gridcontainer: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3)
  }
}));

export default function Footer(props) {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="row"
      justify="flex-end"
      alignItems="center"
      className={classes.gridcontainer}
      spacing={3}
    >
      <FormControlLabel
        control={<Checkbox checked="true" name="roundoff" color="primary" />}
        label="Round Off"
      />
      <CustomTextfield
        id="roundoff"
        width="60px"
        defaultValue="0"
        style={{ textAlign: 'right', display: 'flex' }}
      />
      <Typography
        variant="h6"
        component="h6"
        style={{ marginLeft: '10px', marginRight: '10px' }}
      >
        Total
      </Typography>
      <CustomTextfield id="total" />
    </Grid>
  );
}
