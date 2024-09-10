import React, { useEffect, useState, useRef } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  FormControlLabel,
  Radio,
  Button,
  withStyles,
  Grid,
  IconButton,
  FormControl,
  TextField,
  Typography,
  RadioGroup,
  Box,
  DialogContentText
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { storage } from '../../firebase/firebase';

import { toJS } from 'mobx';
import { useStore } from '../../Mobx/Helpers/UseStore';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import axios from 'axios';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  datecol: {
    width: '90%',
    marginLeft: '14px'
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
  },
  primaryImageWrapper: {
    padding: theme.spacing(1),
    display: 'inline-block',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '5px',
    marginRight: theme.spacing(2)
  },
  primaryImageButtonWrapper: {
    '& #product-primary-upload': {
      display: 'none'
    },
    '& #product-secondary-upload': {
      display: 'none'
    },
    '& .uploadImageButton': {
      color: '#fff',
      bottom: '10px',
      backgroundColor: '#4a83fb',
      padding: '7px',
      fontSize: '14px',
      fontFamily: 'Roboto',
      fontWeight: 500,
      lineHeight: 1.75,
      borderRadius: '4px',
      marginRight: theme.spacing(2),
      '&.primaryImage': {
        margin: '5px',
        position: 'relative',
        top: '-20px'
      },
      '& i': {
        marginRight: '8px'
      }
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

const WhatsAppCustomMessageModal = (props) => {
  const classes = useStyles();
  const store = useStore();
  const { singleCustomerData, messageOpen, partyType } = toJS(
    store.WhatsAppSettingsStore
  );
  const { handleWhatsAppCustomMessageCloseDialog } =
    store.WhatsAppSettingsStore;

  const API_SERVER = window.REACT_APP_API_SERVER;
  const [message, setMessage] = React.useState('');
  const [caption, setCaption] = React.useState('');
  const [type, setType] = React.useState('text');
  const [openNoImageAlert, setNoImageAlert] = useState(false);
  const [openNoMessageAlert, setNoMessageAlert] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const allInputs = { imgUrl: '' };
  const [imageAsFile, setImageAsFile] = useState('');
  let [imageAsUrl, setImageAsUrl] = useState(allInputs);
  const inputRef = useRef([]);
  let [whatsAppImage, setWhatsAppImage] = useState('');
  const [fireBaseImageUrl, setFireBaseUrl] = useState('');

  useEffect(() => {
    if (messageOpen === true) {
      setMessage('');
      setCaption('');
      setType('text');
      setImageAsUrl({ imgUrl: '' });
    }
  }, [messageOpen]);

  useEffect(() => {
    whatsAppImage = imageAsUrl;
  }, [imageAsUrl]);

  useEffect(() => {
    if (fireBaseImageUrl !== '') {
      submitQuery();
    }
  }, [fireBaseImageUrl]);

  useEffect(() => {
    setImageAsUrl((prevObject) => ({
      ...prevObject,
      imgUrl:
        whatsAppImage.imgUrl === '' || whatsAppImage.imgUrl
          ? whatsAppImage.imgUrl
          : whatsAppImage
    }));
  }, [whatsAppImage]);

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile((imageFile) => image);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageAsUrl((prevObject) => ({
        ...prevObject,
        imgUrl: reader.result
      }));
    });
    reader.readAsDataURL(e.target.files[0]);
    e.target.value = '';
  };

  const handleFireBaseUpload = (params) => {
    const status = params;

    if (type === 'text') {
      if (message === '') {
        // Show Message not provided Dialog
        return;
      } else {
        submitQuery();
      }
      return;
    }

    if (type === 'image' && imageAsFile === '') {
      // Show Image not upload Dialog
      return;
    }

    //   setOpenLoader(true);
    const uploadTask = storage.ref(`/pos/${imageAsFile.name}`).put(imageAsFile);
    uploadTask.on(
      'state_changed',
      (snapShot) => {
        console.log(snapShot);
      },
      (err) => {
        console.log(err);
      },
      () => {
        storage
          .ref('pos')
          .child(imageAsFile.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            setImageAsUrl((prevObject) => ({
              ...prevObject,
              imgUrl: fireBaseUrl
            }));

            setFireBaseUrl(fireBaseUrl);
          });
      }
    );
  };

  const handleNoImageAlertClose = () => {
    setNoImageAlert(false);
  };

  const handleNoMessageAlertClose = () => {
    setNoMessageAlert(false);
  };

  const submitQuery = async () => {
    let businessCity = localStorage.getItem('businessCity')
      ? localStorage.getItem('businessCity')
      : '';
    let businessId = localStorage.getItem('businessId')
      ? localStorage.getItem('businessId')
      : '';
    let partnerCity = localStorage.getItem('partnerCity')
      ? localStorage.getItem('partnerCity')
      : '';
    let partnerProfileId = localStorage.getItem('partnerProfileId')
      ? localStorage.getItem('partnerProfileId')
      : '';

    let sendMessage = {};

    if (singleCustomerData) {
      sendMessage.partyId = singleCustomerData.id;
    }

    if (type === 'text') {
      sendMessage.message = message;
    } else if (type === 'image') {
      sendMessage.imageEnabled = true;
      sendMessage.caption = caption;
      sendMessage.imageUrl = fireBaseImageUrl;
    }

    if (singleCustomerData) {
      axios.post(`${API_SERVER}/pos/v1/whatsApp/sendToParty`, {
        businessCity,
        businessId,
        partnerCity,
        partnerProfileId,
        sendMessage
      });
    } else {
      axios.post(`${API_SERVER}/pos/v1/whatsApp/sendToBulkParties`, {
        businessCity,
        businessId,
        partnerCity,
        partnerProfileId,
        sendMessage,
        partyType
      });
    }
    setTimeout(() => {
      handleWhatsAppCustomMessageCloseDialog();
      setMessage('');
      setCaption('');
      setType('text');
      setImageAsUrl({ imgUrl: '' });
      toast.info('Message sent successfully', {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: true
      });
    }, 100);
  };

  const handleComment = (e) => {
    setMessage(e.target.value);
  };

  const handleCaption = (e) => {
    setCaption(e.target.value);
  };

  return (
    <div>
      <Dialog
        open={messageOpen}
        onClose={handleWhatsAppCustomMessageCloseDialog}
        fullWidth
      >
        <DialogTitle id="product-modal-title">
          Send Custom WhatsApp Message
          <IconButton
            aria-label="close"
            onClick={handleWhatsAppCustomMessageCloseDialog}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid item md={12} sm={12} className="grid-padding">
            <FormControl fullWidth>
              <Typography component="subtitle1">Message Type</Typography>

              <RadioGroup
                aria-label="quiz"
                name="quiz"
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                <div>
                  <FormControlLabel
                    value="text"
                    control={<Radio />}
                    label="Message"
                  />
                  <FormControlLabel
                    value="image"
                    control={<Radio />}
                    label="Image"
                  />
                </div>
              </RadioGroup>
            </FormControl>

            {type === 'text' ? (
              <FormControl fullWidth>
                <Typography component="subtitle1">Message</Typography>
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  margin="dense"
                  type="text"
                  rows="8"
                  className="customTextField"
                  placeholder="Comments"
                  value={message}
                  onChange={handleComment}
                />
              </FormControl>
            ) : (
              <Grid>
                <Box component="div">
                  <Box component="div" className={classes.primaryImageWrapper}>
                    <Box
                      component="img"
                      sx={{
                        height: 100,
                        width: 100,
                        maxHeight: { xs: 100, md: 100 },
                        maxWidth: { xs: 100, md: 100 }
                      }}
                      src={
                        imageAsUrl.imgUrl
                          ? imageAsUrl.imgUrl
                          : '/static/images/upload_image.png'
                      }
                    />
                  </Box>
                  <Box
                    component="span"
                    className={classes.primaryImageButtonWrapper}
                  >
                    <label
                      htmlFor="product-primary-upload"
                      className="uploadImageButton primaryImage"
                    >
                      <i className="fa fa-upload fa-1 " aria-hidden="true" />
                      <span>Upload Image</span>
                    </label>
                    <input
                      type="file"
                      ref={(el) => (inputRef.current[31] = el)}
                      onChange={handleImageAsFile}
                      id="product-primary-upload"
                    />
                  </Box>
                </Box>
                {/* <FormControl fullWidth style={{ marginTop: '16px' }}>
                  <Typography component="subtitle1">Caption</Typography>
                  <TextField
                    fullWidth
                    multiline
                    variant="outlined"
                    margin="dense"
                    type="text"
                    rows="4"
                    className="customTextField"
                    placeholder="Caption"
                    value={caption}
                    onChange={handleCaption}
                  />
                </FormControl> */}
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <div>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => {
                handleFireBaseUpload();
              }}
            >
              SEND
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openNoMessageAlert}
        onClose={handleNoMessageAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Please add Message to share it on WhatsApp
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNoMessageAlertClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openNoImageAlert}
        onClose={handleNoImageAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Please add Image to share it on WhatsApp
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNoImageAlertClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InjectObserver(WhatsAppCustomMessageModal);