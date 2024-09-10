import React from 'react';
import { Typography, makeStyles, Grid } from '@material-ui/core';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    margin: '10px',
    height: '97%'
  },

  paper: {
    padding: 2
  },

  uploadContainer: {
    border: '2px dashed blue',
    padding: '100px',
    borderRadius: '50%',
    display: 'block',
    textAlign: 'center',
    width: '400px'
  },

  dropzoneStyle: {
    '& .MuiDropzoneArea-icon': {
      color: 'blue'
    },
    '& .MuiDropzoneArea-root': {
      border: '2px dashed rgb(0, 0, 255) !important',
      borderRadius: '50% !important',
      display: 'block !important',
      textAlign: 'center !important',
      width: '400px !important',
      height: '370px !important',
      marginTop: '-3px !important'
    }
  },

  uploadText: {
    display: 'grid',
    marginTop: '60px'
  },
  textCenter: {
    textAlign: 'center',
    color: 'grey'
  },
  marginSpace: {
    margin: '0px 0 20px 0px'
  },
  jsonContainer: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    height: '70%'
  },
  jsontempContainer: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center'
  },

  headerContain: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 10px 40px 20px'
  },
  flexGrid: {
    display: 'grid'
  },
  flexCenter: {
    display: 'flex',
    justifyContent: 'center'
  },
  header: {
    fontWeight: 'bold',
    fontFamily: 'Roboto'
  },
  clickBtn: {
    color: 'blue',
    marginTop: '5px',
    cursor: 'pointer'
  },
  previewChip: {
    minWidth: 160,
    maxWidth: 210
  },
  subHeader: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    paddingLeft: '20px'
  },
  resetContain: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: '20px'
  }
});

const TallyInstructions = () => {
  const classes = useStyles();

  return (
    <div>
      <Grid className={classes.headerContain}>
        <div>
          <Typography className={classes.header} variant="inherit">
            Tally Import Instructions
          </Typography>
        </div>
      </Grid>

      <Grid item md={12} sm={12} className="grid-padding">
        <Typography
          variant="h6"
          style={{ paddingLeft: '20px' }}
        >
          1. Tally Parent Gropus cannot be edited while importing Masters to Tally.<br />
          2. Party Ledgers will be created under mentioned Tally Group heads under Parties section.<br />
          3. XML can be imported to Tally manually by using DOWNLOAD XML option or can be pushed to Tally using Tally Auto Push option.<br />
          NOTE: OneShell should be running in the same system where Tally application is running to auto push data.<br />
          4. Merchant to follow guidelines as instructed by their Auditor in case of Voucher alterations.<br />
          5. Vouchers data once pushed to Tally should not be altered.<br />
        </Typography>
      </Grid>
    </div>
  );
};

export default InjectObserver(TallyInstructions);