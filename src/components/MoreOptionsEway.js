import {
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Dialog
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React, { useState } from 'react';
import EwayCompToPrint from 'src/views/Printers/ComponentsToPrint/EwayPrint/EwayCompToPrint';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import axios from 'axios';
import * as Bd from './SelectedBusiness';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Moreoptions(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialogName, setOpenDialog] = React.useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = useState(false);
  const [openEwayPrintSelectionAlert, setEwayPrintSelectionAlert] =
    React.useState(false);

  const store = useStore();
  const {
    handleOpenEWayGenerateModal,
    handleOpenEWayCancelModal,
    handleOpenEWayExtendModal,
    handleOpenEWayUpdatePartBModal,
    handleOpenEWayUpdateTransporterModal
  } = store.EWayStore;
  const { viewOrEditItem } = store.SalesAddStore;

  const handleEwayAlertClose = () => {
    setEwayPrintSelectionAlert(false);
  };

  const handleErrorAlertMessageClose = () => {
    setErrorAlertMessage(false);
    setErrorMessage('');
  };

  const handleOpenEditDetails = () => {
    if ('Invoice' === props.type) {
      viewOrEditItem(props.item);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isEWayGeneratePossible = () => {
    let planName = localStorage.getItem('planName');

    if ('Starter' === planName) {
      setErrorMessage(
        'Please upgrade your plan to proceed with E-Way generation'
      );
      setErrorAlertMessage(true);

      return;
    }

    let invoiceDetails = props.item;

    if (invoiceDetails.customer_id === '') {
      setErrorMessage(
        'Please provide Buyer details to proceed with E-Way generation'
      );
      setErrorAlertMessage(true);
    } else if (invoiceDetails.item_list.length === 0) {
      setErrorMessage(
        'Please add atleast one product to proceed with E-Way generation'
      );
      setErrorAlertMessage(true);
    } else {
      handleOpenEWayGenerateModal(props.type, props.item);
    }
  };

  const downloadEwayPDF = async () => {
    toast.info('Downloading Please Wait...', {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: true
    });

    const API_SERVER = window.REACT_APP_API_SERVER;

    const businessData = await Bd.getBusinessData();
    const businessId = businessData.businessId;
    const businessCity = businessData.businessCity;
    const eWayBillNo = props.item.ewayBillNo;
    let type = '';
    if ('Invoice' === props.type) {
      type = 'INV';
    }

    // console.log(props);
    await axios
      .get(`${API_SERVER}/pos/v1/business/invoice/eway/download`, {
        responseType: 'arraybuffer',
        params: {
          businessId: businessId,
          businessCity: businessCity,
          eWayBillNo: eWayBillNo,
          type: type
        }
      })
      .then((res) => {
        const url = window.URL.createObjectURL(
          new Blob([res.data], { type: 'application/pdf' })
        );
        var link = document.createElement('a');
        link.href = url;
        let fileName = 'Eway_' + props.item.ewayBillNo + '.pdf';
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        toast.error(
          'Something went wrong while Downloading. Please try again!',
          {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: true
          }
        );
        console.log(err.response.data);
        throw err;
      });
  };

  const previewEway = () => {
    setEwayPrintSelectionAlert(true);
    setOpenDialog('preview');
  };

  const printEway = () => {
    /* setEwayPrintSelectionAlert(true); */
    setOpenDialog('print');
    /* alert('Print E-way'); */
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreVert fontSize="inherit" />
      </IconButton>

      <Menu
        id="moremenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {('Not Generated' === props.item.ewayBillStatus ||
          'Cancelled' === props.item.ewayBillStatus) && (
          <>
            <MenuItem key={1} onClick={() => handleOpenEditDetails()}>
              Edit Details{' '}
            </MenuItem>
            <MenuItem key={2} onClick={() => isEWayGeneratePossible()}>
              Generate E-Way{' '}
            </MenuItem>
          </>
        )}

        {'Generated' === props.item.ewayBillStatus && (
          <>
            <MenuItem
              key={3}
              onClick={() => handleOpenEWayCancelModal(props.type, props.item)}
            >
              Cancel E-Way{' '}
            </MenuItem>
            <MenuItem
              key={4}
              onClick={() =>
                handleOpenEWayUpdatePartBModal(props.type, props.item)
              }
            >
              Update Part-B E-Way{' '}
            </MenuItem>
            <MenuItem
              key={5}
              onClick={() =>
                handleOpenEWayUpdateTransporterModal(props.type, props.item)
              }
            >
              Update Transporter{' '}
            </MenuItem>
          </>
        )}

        {'Expired' === props.item.ewayBillStatus && (
          <MenuItem
            key={6}
            onClick={() => handleOpenEWayExtendModal(props.type, props.item)}
          >
            Extend E-Way{' '}
          </MenuItem>
        )}

        {'Generated' === props.item.ewayBillStatus && (
          <>
            <MenuItem key={7} onClick={downloadEwayPDF}>
              Download E-Way PDF{' '}
            </MenuItem>
            <MenuItem key={8} onClick={previewEway}>
              Preview E-Way{' '}
            </MenuItem>
            <MenuItem key={9} onClick={printEway}>
              Print E-Way{' '}
            </MenuItem>
          </>
        )}
      </Menu>

      <Dialog
        fullScreen={fullScreen}
        open={openErrorAlertMessage}
        onClose={handleErrorAlertMessageClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorAlertMessageClose}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openEwayPrintSelectionAlert}
        onClose={handleEwayAlertClose}
        aria-labelledby="responsive-dialog-title"
        /* style={{ display: 'none' }} */
      >
        <DialogContent>
          <DialogContentText>
            <EwayCompToPrint
              data={props.item}
              /* printMe={isStartEwayPrint} 
              isThermal={invoiceThermal.boolDefault} */
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={printEway} color="secondary" variant="outlined">
            PRINT
          </Button>
          <Button
            onClick={handleEwayAlertClose}
            color="secondary"
            variant="outlined"
          >
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>

      {openDialogName === 'print' ? (
        <EwayCompToPrint
          data={props.item}
          printMe={true}
          /*isThermal={invoiceThermal.boolDefault} */
        />
      ) : (
        ''
      )}
    </div>
  );
}

export default injectWithObserver(Moreoptions);