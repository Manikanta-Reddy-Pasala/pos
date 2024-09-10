import React from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  withStyles,
  Grid,
  IconButton,
  FormControl,
  TextField,
  Typography,
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';

const DialogTitle = withStyles((theme) => ({
  root: {
    '& h2': {
      fontSize: '20px'
    },
    '& .closeButton': {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.success[500]
    }
  }
}))(MuiDialogTitle);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const AddSpecialDayModal = (props) => {

  const { fullWidth, maxWidth } = props;

  const store = useStore();

  const { addSpecialDayDialogOpen, specialDayManagementData , isEdit } = toJS(
    store.SpecialDayManagementStore 
  );
  const { handleAddSpecialDayDialog, saveData, setSpecialDayProperty} = store.SpecialDayManagementStore;




  return (
    <Dialog
      open={addSpecialDayDialogOpen}
      onClose={(e) => handleAddSpecialDayDialog(false)}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle id="product-modal-title">
     <Typography variant={'h2'} >
     {isEdit ? 'Edit Special Day' : 'Add Special Day'}
       </Typography>
        <IconButton
          aria-label="close"
          className="closeButton"
          onClick={(e) => handleAddSpecialDayDialog(false)}
        >
          <CancelRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent >
        <Grid container direction="row" justify="center" alignItems="stretch">
          <Grid item xs={12} >
            <Typography >Day Name</Typography>
            <FormControl fullWidth>
              <TextField
                fullWidth
                autoFocus
                variant="outlined"
                margin="dense"
                type="text"
                className="customTextField"
                value={specialDayManagementData.name}
                  onChange={(event) =>
                    setSpecialDayProperty(
                      'name',
                      event.target.value.toString()
                    )
                  }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} >
              <Grid container style={{marginTop:'12px'}}>
              <Grid item xs={12}><Typography >Choose Date</Typography></Grid>
              <Grid item xs={5}>
              <TextField
                fullWidth
                variant="outlined"
                margin="dense"
                type="date"
                className="customTextField"
                value={specialDayManagementData.startDate}
                  onChange={(event) =>
                    setSpecialDayProperty('startDate', event.target.value)
                  }
              />
             </Grid>
             <Grid item xs={2} style={{marginTop:'auto',marginBottom:'auto',textAlign:'center'}}>-</Grid>
             <Grid item xs={5}>
              <TextField
                fullWidth
                variant="outlined"
                margin="dense"
                type="date"
                className="customTextField"
                value={specialDayManagementData.endDate}
                  onChange={(event) =>
                    setSpecialDayProperty('endDate', event.target.value)
                  }
              />
              </Grid>
              </Grid>
          </Grid>
          <Grid item xs={12} style={{marginTop:'12px'}}>
              <Typography>Timing (Optional)</Typography>
              <FormControl fullWidth>
              <TextField
                fullWidth
                multiline
                rows={5}
                variant="outlined"
                margin="dense"
                type="text"
                className="customTextField"
                value={specialDayManagementData.timings}
                  onChange={(event) =>
                    setSpecialDayProperty('timings', event.target.value)
                  }
              />
            </FormControl>
          </Grid>
        
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => {
            saveData();
          }}
        >
          Save
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default InjectObserver(AddSpecialDayModal);
