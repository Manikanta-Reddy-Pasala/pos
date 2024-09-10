import React, { useState } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  DialogContentText,
  Button,
  withStyles,
  Grid,
  IconButton,
  FormControl,
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

const CategoryModal = (props) => {
  const classes = useStyles();
  const { fullWidth, maxWidth } = props;
  const [rxdbSub, setRxdbSub] = useState([]);

  const store = useStore();
  const { category, categoryDialogOpen } = toJS(store.ExpensesStore);
  const { saveCategory, setCategoryProperty, handleCategoryModalClose } =
    store.ExpensesStore;

  const [isEdited, setIsEdited] = React.useState(false);

  const [openCloseDialog, setCloseDialogAlert] = React.useState(false);

  const handleCloseDialogClose = () => {
    setCloseDialogAlert(false);
  };
  const checkCloseDialog = () => {
    if (!isEdited) {
      handleCategoryModalClose();
    } else {
      setCloseDialogAlert(true);
    }
  };

  return (
    <Dialog
      open={categoryDialogOpen}
      onClose={checkCloseDialog}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle id="product-modal-title">
        Add Category
        <IconButton
          aria-label="close"
          className="closeButton"
          onClick={checkCloseDialog}
        >
          <CancelRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.productModalContent}>
        <Grid container justifyContent="center" alignItems="stretch">
          <Grid item md={12} sm={12} className="grid-padding">
            <FormControl fullWidth>
              <TextField
                fullWidth
                autoFocus
                variant="outlined"
                margin="dense"
                type="text"
                className="customTextField"
                placeholder="Category Name"
                value={category.category}
                onChange={(event) => {
                  if (event.target.value) {
                    setIsEdited(true);
                  } else {
                    setIsEdited(false);
                  }
                  setCategoryProperty('category', event.target.value);
                }}
              />
            </FormControl>
          </Grid>
          <Grid item md={12} sm={12} className="grid-padding">
            <Typography style={{ color: 'black', marginTop: '20px' }}>Expense Type</Typography>
            <RadioGroup
              aria-label="quiz"
              name="quiz"
              value={category.expenseType}
              onChange={(event) =>
                setCategoryProperty('expenseType', event.target.value)
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
          disabled={category.category === '' ? true : false}
          onClick={() => {
            saveCategory();
          }}
        >
          Save
        </Button>
      </DialogActions>

      <Dialog
        open={openCloseDialog}
        onClose={handleCloseDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Category will not be saved, Do you want to close?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={(e) => {
              handleCloseDialogClose();
              handleCategoryModalClose();
            }}
            color="primary"
          >
            Yes
          </Button>
          <Button onClick={handleCloseDialogClose} color="primary" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default InjectObserver(CategoryModal);