import React, { useEffect } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Button,
  Input,
  withStyles,
  Grid,
  IconButton,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';

import { toJS } from 'mobx';

const useStyles = makeStyles((theme) => ({
  productModalContent: {
    '& .grid-padding': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      paddingTop: theme.spacing(1)
    }
  },
  fullWidth: {
    width: '100%'
  },
  marginSet: {
    marginTop: 'auto'
  },
  datecol: {
    width: '90%',
    marginLeft: '14px'
  }
}));

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

const EditDataXls = (props) => {
  const classes = useStyles();
  let [level2Category, setLevel2Category] = React.useState([]);

  const { openModal, closeModal, onDownload } = props;

  const stores = useStore();
  var { level2CategoriesList, level3CategoriesList } = toJS(
    stores.ProductStore
  );

  const {
    getBusinessLevel2Categorieslist,
    getBusinessLevel3Categorieslist,
    setLevel2SelectedCategory,
    handleCategoryLevel3Change
  } = stores.ProductStore;

  useEffect(() => {
    console.log('use Effect called');
    const str = { name: '', displayName: '' };
    setLevel2Category(str);
    getBusinessLevel2Categorieslist();
  }, []);

  const handleCategoryChange = (event) => {
    console.log(event);
    setLevel2Category(event);
    setLevel2SelectedCategory(event);
    getBusinessLevel3Categorieslist(event.name);
  };

  return (
    <Dialog open={openModal} fullWidth={'xs'} maxWidth={'xs'}>
      <DialogTitle id="product-modal-title">
        Choose Category
        <IconButton
          aria-label="close"
          className="closeButton"
          onClick={closeModal}
        >
          <CancelRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.productModalContent}>
        <Grid container direction="row" alignItems="stretch">
          <Grid item xs={12} className="grid-padding">
            <FormControl fullWidth className={classes.fullWidth}>
              <Select
                displayEmpty
                value={level2Category.displayName}
                input={<Input />}
                disableUnderline
                className={classes.selectFont}
              >
                <MenuItem disabled value="">
                  Choose Category
                </MenuItem>
                {level2CategoriesList.map((c) => (
                  <MenuItem
                    key={c.name}
                    value={c.displayName}
                    onClick={() => handleCategoryChange(c)}
                  >
                    {c.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container direction="row" alignItems="stretch">
          <Grid item xs={12} className="grid-padding">
            {level3CategoriesList.map((c) => (
              <FormGroup row className={classes.checkboxMarginTop}>
                <FormControlLabel
                  control={<Checkbox name={c.name} />}
                  label={c.displayName}
                  checked={c.isChecked}
                  onChange={() => {
                    handleCategoryLevel3Change(c);
                  }}
                />
              </FormGroup>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onDownload}
          style={{
            backgroundColor: 'green',
            color: 'white',
            fontWeight: 'normal'
          }}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default InjectObserver(EditDataXls);
