import React, { useState } from 'react';
import { Dialog, DialogContent, Grid, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import style from 'src/components/Helpers/Classes/commonStyle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

const styles = (theme) => ({
  flex: {
    display: 'flex',
  },
  center: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  alignRight: {
    textAlign: 'right',
  },
  p: {
    fontWeight: 'bold',
  },
  cardCol1: {
    width: '5%',
  },
  cardCol2: {
    width: '25%',
  },
  cardColOther: {
    width: '15%',
    textAlign: 'right',
  },
  cardColSale: {
    width: '9%',
    textAlign: 'right',
  },
  cardColFlex: {
    flex: 1,
    wordBreak: 'keep-all',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardCol40percent: {
    width: '40%',
  },
  cardCol30percent: {
    width: '30%',
  },
  strong: {
    fontWeight: 600,
  },
  separator: {
    height: '5px',
    width: '100%',
  },
  greyBackground: {
    backgroundColor: '#f5f2f2',
  },
  taxDiv: {
    width: '100%',
    textAlign: 'start',
  },
  w_100: {
    width: '100%',
  },
  multilineStyle: {
    whiteSpace: 'break-spaces',
    backgroundColor: '#f5f2f2',
  },
  zoomControls: {
    display: 'flex',
    justifyContent: 'center', // Center align the buttons horizontally
    marginTop: '17px',
  },
  zoomButton: {
    margin: '0 5px',
    width: '35px',
    height: '35px',
    backgroundColor: 'rgb(239, 83, 80)',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomImage: {
    display: 'block',
    margin: '0 auto',
    transition: 'transform 0.2s ease',
  },
});

const SessionGroupRegularPrint = React.forwardRef(({ classes, data, viewHistory }, ref) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const { DialogTitle } = style;

  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage('');
    setZoomLevel(1);
  };

  const zoomIn = () => {
    setZoomLevel((prevZoomLevel) => Math.min(prevZoomLevel + 0.1, 3));
  };

  const zoomOut = () => {
    setZoomLevel((prevZoomLevel) => Math.max(prevZoomLevel - 0.1, 1));
  };

  const getSeparator = (rows, separator) => {
    const separators = [];
    for (let i = 0; i <= rows; i++) {
      separators.push(<div key={i} className={separator}></div>);
    }
    return separators;
  };

  let _data = data || {};

  return (
    <div ref={ref} className="printable-content">
      <div
        style={{
          pageBreakAfter: 'always',
          width: '100%',
          padding: '5px',
          fontFamily: 'Roboto',
          wordBreak: 'break-word',
        }}
      >
        {getSeparator(1, classes.separator)}

        <Grid>
          <h2>
            <center>Sessions</center>
          </h2>
        </Grid>

        {getSeparator(2, classes.separator)}

        <Grid>
          <p style={{ textAlign: 'left' }}>
            <b>Date: </b> {_data.date}
          </p>
          <p style={{ textAlign: 'left' }}>
            <b>Client Name: </b> {_data.customerName}
          </p>
          <p style={{ textAlign: 'left' }}>
            <b>Total Sessions: </b> {_data.noOfSession}
          </p>
        </Grid>
        {getSeparator(2, classes.separator)}
        <table style={{ width: '100%' }}>
          <tbody>
            {Array.isArray(_data.sessionList) &&
              _data.sessionList.map((session, index) => (
                <React.Fragment key={index}>
                  <tr style={{ marginBottom: '10px' }}>
                    <th style={{ textAlign: 'left' }}>Session No</th>
                    <th style={{ textAlign: 'left' }}>Date</th>
                    <th style={{ textAlign: 'left' }}>Start Time</th>
                    <th style={{ textAlign: 'left' }}>End Time</th>
                    <th style={{ textAlign: 'left' }}>Doctor</th>
                  </tr>
                  <tr style={{ height: '45px', fontSize: '14px' }}>
                    <td>{session.sessionNo}</td>
                    <td>{session.sessionDate}</td>
                    <td>{session.sessionStartTime}</td>
                    <td>{session.sessionEndTime}</td>
                    <td>{session.doctorName}</td>
                  </tr>
                  <tr>
                    <td style={{ height: '45px' }} colSpan="5">
                      <b>Session Status: </b> {session.status}
                    </td>
                  </tr>
                  {(session.sessionNotes.message ||
                    (session.sessionNotes.imageUrl?.length > 0 && viewHistory)) && (
                    <tr style={{ marginBottom: '10px' }}>
                      <td colSpan="5">
                        <b>Notes: </b>
                        <br />
                        <div>
                          {viewHistory && session.sessionNotes.imageUrl &&
                            session.sessionNotes.imageUrl.map((image) => (
                              <img
                                key={image}
                                src={image}
                                alt="Session note"
                                style={{
                                  width: '10%',
                                  marginRight: '10px',
                                  cursor: 'pointer',
                                }}
                                onClick={() => openModal(image)}
                              />
                            ))}
                        </div>
                        <span style={{ fontSize: '13px', lineHeight: '27px' }}>
                          {session.sessionNotes.message}
                        </span>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="5">
                      <hr
                        style={{
                          marginBottom: '10px',
                          borderColor: '#ffffff',
                        }}
                      ></hr>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
          </tbody>
        </table>

        <Dialog
          fullWidth={true}
          maxWidth={'md'}
          open={modalIsOpen}
          onClose={closeModal}
        >
          <DialogTitle id="product-modal-title" style={{ padding: '0px' }}>
            <IconButton
              aria-label="close"
              onClick={closeModal}
              className="closeButton"
            >
              <CancelRoundedIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <>
              {selectedImage && (
                <div style={{ overflow: 'auto' }}>
                  <img
                    src={selectedImage}
                    alt="Zoomed session note"
                    style={{
                      width: `${(zoomLevel * 100) - 10}%`,
                      transform: `scale(${zoomLevel})`,
                      transition: 'transform 0.2s ease',
                      margin: '0 auto',
                      display: 'block',
                    }}
                  />
                </div>
              )}
              <div className={classes.zoomControls}>
                <button onClick={zoomOut} className={classes.zoomButton}>
                  -
                </button>
                <button onClick={zoomIn} className={classes.zoomButton}>
                  +
                </button>
              </div>
            </>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
});

export default withStyles(styles)(SessionGroupRegularPrint);
