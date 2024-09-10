import React from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  Grid,
  IconButton,
  Box,
  TextField,
  Typography,
  DialogContentText
} from '@material-ui/core';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

import { toJS } from 'mobx';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import style from 'src/components/Helpers/Classes/commonStyle';
import { Close as CloseIcon } from '@material-ui/icons';
import { storage } from 'src/firebase/firebase';

const AddSessionNotes = (props) => {
  const classes = style.useStyles();
  const { DialogActions, DialogTitle } = style;

  const store = useStore();
  const { addSessionNotesDialogOpen } = toJS(store.SessionGroupStore);
  const { handleAddSessionDialogClose, updateData } =
    store.SessionGroupStore;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openErrorMesssageDialog, setOpenErrorMesssageDialog] =
    React.useState(false);
  const [notes, setNotes] = React.useState('');
  const [notesImages, setNotesImages] = React.useState([]);

  const handleErrorAlertClose = () => {
    setOpenErrorMesssageDialog(false);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const urls = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        urls.push({url: reader.result, name: file.name, file: file});
        if (urls.length === files.length) {
         await handleFirebaseImageUpload(urls);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFirebaseImageUpload = (imageUrls) => {
    imageUrls.map((imageUrl) => {
      const uploadTask = storage
      .ref(`/session/${imageUrl.name}`)
      .put(imageUrl.file);
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
          .ref('session')
          .child(imageUrl.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            setNotesImages(prevImages => [...prevImages, fireBaseUrl]);
          });
      }
    );
    })

  }

  const handleRemoveImage = (index) => {
    setNotesImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={addSessionNotesDialogOpen}
        onClose={handleAddSessionDialogClose}
      >
        <DialogTitle id="product-modal-title">
          Record Notes
          <IconButton
            aria-label="close"
            onClick={handleAddSessionDialogClose}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid container direction="row" alignItems="stretch">
            <Grid item xs={12} className="grid-padding">
              <Typography variant='h5'>Recording Notes For Session {props.rowNumber + 1} </Typography>
            </Grid>
            <Grid item xs={12} className='grid-padding' style={{ marginTop: '10px'}}>
              <Typography variant='h6'>Notes</Typography>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                {notesImages?.map((imageUrl, index) => (
                    <div alt={`Uploaded ${index}`} style={{ display: 'flex', flexDirection: 'row' }}>
                    <div
                      className={classes.primaryImageWrapper}
                      style={{ marginRight: '0px' }}
                    >
                      <img
                        src={imageUrl}
                        width="60"
                        height="60"
                      />
                    </div>
                    <div style={{ height: '20px', width: '40px' }}>
                      <IconButton style={{ padding: '0px' }}>
                        <CloseIcon
                          style={{ widht: '15px', height: '15px' }}
                          onClick={() => {
                            handleRemoveImage(index);
                          }}
                        />
                      </IconButton>
                    </div>
                    </div>
                    ))}
                    <Box
                      component="span"
                      className={classes.primaryImageButtonWrapper}
                    >
                      <label
                        htmlFor="product-primary-upload"
                        className="uploadImageButton primaryImage"
                        style={{ position: 'static' }}
                      >
                        <i className="fa fa-upload fa-1 " aria-hidden="true" />
                        <span>Upload</span>
                      </label>
                      
                    </Box>
                    <input
                        type="file"
                        onChange={(e) => handleImageUpload(e)}
                        id="product-primary-upload"
                        style={{ display: 'none' }}
                        multiple
                        accept="image/*"
                      />
                  </div>
            
              <TextField 
               multiline
               margin='dense'
               minRows={8}
               variant='outlined'
               fullWidth
               onChange={(e) => setNotes(e.target.value)}
              >

              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              handleAddSessionDialogClose();
            }}
          >
            Cancel
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            disabled={!notes && notesImages.length === 0}
            onClick={() => {
              updateData(props.data.sessionGroupId, notes, props.data.sessionId, false, false, notesImages)
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openErrorMesssageDialog}
        onClose={handleErrorAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorAlertClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InjectObserver(AddSessionNotes);