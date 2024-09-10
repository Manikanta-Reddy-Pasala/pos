import React, { useEffect } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Button,
  withStyles,
  Grid,
  IconButton,
  FormControl,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

import { toJS } from 'mobx';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  productModalContent: {
    '& .grid-padding': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  marginSet: {
    marginTop: 'auto'
  },
  inputNumber: {
    '& input[type=number]': {
      '-moz-appearance': 'textfield'
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
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

const EmployeeModal = (props) => {
  const classes = useStyles();

  const store = useStore();
  const { employee, employeeDialogOpen, isEdit, phoneNoAlreadyExistDialog } = toJS(store.EmployeeStore);
  const { employeeTypesList } = toJS(store.EmployeeTypesStore);
  const { handleCloseDialogEmployee, setEmployeeProperty, saveData, handlePhoneNumberAlreadyExsitDialog } =
    store.EmployeeStore;
  const { getAllEmployeeTypes } = store.EmployeeTypesStore
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [maxWidth] = React.useState('sm');
  const [updatePassword, setUpdatePassword] = React.useState(false);
  const [openMobileNumAlert, setMobileNumAlert] = React.useState(false);

  const handleMobileNumAlertClose = () => {
    setMobileNumAlert(false);
  }
  
  const mobileNumCheck = () => {
    console.log(employee.userName.length);
    if (employee.userName.length === 10)
    {
      saveData();
    }else
    {
      setMobileNumAlert(true);
    }
  }

  useEffect(() => {
    async function fetchData() {
      await getAllEmployeeTypes();
    }

    fetchData();
  }, []);

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={employeeDialogOpen}
        onClose={handleCloseDialogEmployee}
        maxWidth={maxWidth}
      >
        <DialogTitle id="product-modal-title">
          {isEdit ? 'Edit Employee' : 'Add Employee'}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialogEmployee}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid container direction="row" alignItems="stretch">
            <Grid item xs={12} className="grid-padding">
              <FormControl fullWidth>
                <Typography variant="subtitle1">Name </Typography>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Name"
                  value={employee.name}
                  onChange={(event) =>
                    setEmployeeProperty('name', event.target.value.toString())
                  }
                />
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              className="grid-padding"
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth>
                <Typography variant="subtitle1">
                  User Name (Employee Mobile no)
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="number"
                  className="customTextField"
                  placeholder="Enter Mobile No"
                  error={employee.userName.length > 10 }
                  helperText={
                    employee.userName.length > 10
                      ? 'Please enter valid phone number'
                      : ''
                  }
                  value={employee.userName}
                  onChange={(event) => {
                    setEmployeeProperty('userName', event.target.value);
                  }}
                  InputProps={{
                    className: classes.inputNumber
                  }}
                />
              </FormControl>
            </Grid>

            {!employee.passwordSet ? (
              <Grid
                item
                xs={12}
                className="grid-padding"
                style={{ marginTop: '16px' }}
              >
                <FormControl fullWidth>
                  <Typography variant="subtitle1">Password</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    placeholder="Enter Password"
                    type="text"
                    className="customTextField"
                    value={employee.password}
                    onChange={(event) =>
                      setEmployeeProperty('password', event.target.value)
                    }
                  />
                </FormControl>
              </Grid>
            ) : null}

            {employee.passwordSet ? (
              <div style={{ marginTop: '16px' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={updatePassword}
                      onChange={(e) => {
                        setUpdatePassword(e.target.checked);
                      }}
                      name="updatePassword"
                    />
                  }
                  label="Update Password"
                />
              </div>
            ) : null}
            
            {updatePassword ? (
              <Grid
                item
                xs={12}
                className="grid-padding"
                style={{ marginTop: '16px' }}
              >
                <FormControl fullWidth>
                  <Typography variant="subtitle1">Change Password</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    placeholder="Enter Change Password"
                    type="text"
                    className="customTextField"
                    value={employee.changePassword}
                    onChange={(event) =>
                      setEmployeeProperty('changePassword', event.target.value)
                    }
                  />
                </FormControl>
              </Grid>
            ) : null}

            <Grid item xs={12} className="grid-padding"  style={{ marginTop: '16px' }}>
              <FormControl fullWidth>
                <Typography variant="subtitle1">Type </Typography>
                <Select
                  value={employee.type}
                  onChange={(event) => setEmployeeProperty('type', event.target.value)}
                  variant='outlined'
                  className="customTextField"
                  displayEmpty
                  margin='dense'
                  style={{ marginTop: '8px',
                    marginBottom: '4px' }}
                >
                    <MenuItem value="" disabled>
                    Select type
                    </MenuItem>
                    {employeeTypesList.map((employee) => (
                       <MenuItem value={employee.name}>{employee.name}</MenuItem>
                    ))}
                   
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {/* <Button color="secondary" variant="outlined">
            Save & New
          </Button> */}
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => mobileNumCheck()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openMobileNumAlert}
        onClose={handleMobileNumAlertClose}
      >
        <DialogTitle style={{paddingBottom:'5px'}}>
          <span style={{ color: 'red', fontSize: 18 }}>Alert</span>
          <IconButton
            aria-label="close"
            className="closeButton"
            onClick={handleMobileNumAlertClose}
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography style={{ fontSize: 13 }}>
             Please provide a valid Mobile Number 
          </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              handleMobileNumAlertClose();
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={phoneNoAlreadyExistDialog}
        onClose={handlePhoneNumberAlreadyExsitDialog}
      >
        <DialogTitle style={{paddingBottom:'5px'}}>
          <span style={{ color: 'red', fontSize: 18 }}>Alert</span>
          <IconButton
            aria-label="close"
            className="closeButton"
            onClick={handlePhoneNumberAlreadyExsitDialog}
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography style={{ fontSize: 13 }}>
            The mobile number provided already exists. Please choose a different mobile number.
          </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              handlePhoneNumberAlreadyExsitDialog();
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InjectObserver(EmployeeModal);
