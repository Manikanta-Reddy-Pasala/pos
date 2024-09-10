import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Button,
  withStyles,
  Grid,
  IconButton,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { toJS } from 'mobx';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';

const useStyles = makeStyles((theme) => ({
  productModalContent: {
    '& .grid-padding': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  }
}));

const DialogTitle = withStyles((theme) => ({
  root: {
    '& h2': {
      fontSize: '24px'
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

const CategoryViewModal = (props) => {
  const classes = useStyles();
  const { fullWidth, maxWidth } = props;

  const store = useStore();
  const { category, viewCategoryDialogOpen } = toJS(store.ExpensesStore);
  const { handleViewCategoryModalClose, updateCategory, updateCategoryName, updateCategoryExpenseType } =
    store.ExpensesStore;

  return (
    <Dialog
      open={viewCategoryDialogOpen}
      onClose={handleViewCategoryModalClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle id="product-modal-title">
        Edit Category
        <IconButton
          aria-label="close"
          className="closeButton"
          onClick={handleViewCategoryModalClose}
        >
          <CancelRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.productModalContent}>
        <Grid container direction="row" justify="center" alignItems="stretch">
          <Grid item md={12} sm={12} className="grid-padding">
            <TextField
              fullWidth
              autoFocus
              variant="outlined"
              margin="dense"
              type="text"
              value={category.category}
              onChange={(event) => updateCategoryName(event.target.value)}
            />
          </Grid>
          <Grid item md={12} sm={12} className="grid-padding">
            <Typography style={{ color: 'black', marginTop: '20px' }}>Expense Type</Typography>
            <RadioGroup
              aria-label="quiz"
              name="quiz"
              value={category.expenseType}
              onChange={(event) =>
                updateCategoryExpenseType(event.target.value)
              }
            >
              <div>
                <FormControlLabel
                  value="Direct"
                  control={<Radio />}
                  label="Direct"
                />
                <FormControlLabel
                  value="Indirect"
                  control={<Radio />}
                  label="Indirect"
                />
              </div>
            </RadioGroup>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => {
            updateCategory();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InjectObserver(CategoryViewModal);
