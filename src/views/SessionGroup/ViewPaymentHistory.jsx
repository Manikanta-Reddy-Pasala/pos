import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Grid,
  makeStyles,
  Button
} from '@material-ui/core';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { toJS } from 'mobx';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import style from 'src/components/Helpers/Classes/commonStyle';

export const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex'
  },
  center: {
    alignSelf: 'center',
    textAlign: 'center'
  },
  alignRight: {
    textAlign: 'right'
  },
  p: {
    fontWeight: 'bold'
  },
  cardCol1: {
    width: '5%'
  },
  cardCol2: {
    width: '25%'
  },
  cardColOther: {
    width: '15%',
    textAlign: 'right'
  },
  cardColSale: {
    width: '9%',
    textAlign: 'right'
  },
  cardColFlex: {
    flex: 1,
    wordBreak: 'keep-all'
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  cardCol40percent: {
    width: '40%'
  },
  cardCol30percent: {
    width: '30%'
  },
  strong: {
    fontWeight: 600
  },
  separator: {
    height: '5px',
    width: '100%'
  },
  greyBackground: {
    backgroundColor: '#f5f2f2'
  },
  taxDiv: {
    width: '100%',
    textAlign: 'start'
  },
  w_100: {
    width: '100%'
  },
  multilineStyle: {
    whiteSpace: 'break-spaces',
    backgroundColor: '#f5f2f2'
  },
  zoomControls: {
    display: 'flex',
    justifyContent: 'center', // Center align the buttons horizontally
    marginTop: '17px'
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
    justifyContent: 'center'
  },
  zoomImage: {
    display: 'block',
    margin: '0 auto',
    transition: 'transform 0.2s ease'
  }
}));

const ViewPaymentHistory = (props) => {
  const classes = useStyles();
  const { DialogTitle } = style;

  const store = useStore();
  const { openPaymentHistory, sessionGroup } = toJS(store.SessionGroupStore);
  const { handlePaymentHistoryDialogClose } = store.SessionGroupStore;
  const { convertSessionToSale } = store.SalesAddStore;

  useEffect(() => {
    sessionGroup.sessionList.map((item, index) => {
      item.sessionNo = index + 1;
    });
  }, [sessionGroup]);

  const getSeparator = (rows, separator) => {
    const separators = [];
    for (let i = 0; i <= rows; i++) {
      separators.push(<div key={i} className={separator}></div>);
    }
    return separators;
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={'lg'}
        open={openPaymentHistory}
        onClose={handlePaymentHistoryDialogClose}
      >
        <DialogTitle id="product-modal-title" style={{ padding: '0px' }}>
          <IconButton
            aria-label="close"
            onClick={handlePaymentHistoryDialogClose}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <div
            style={{
              pageBreakAfter: 'always',
              width: '100%',
              padding: '5px',
              fontFamily: 'Roboto',
              wordBreak: 'break-word'
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
                <b>Date: </b> {sessionGroup.date}
              </p>
              <p style={{ textAlign: 'left' }}>
                <b>Client Name: </b> {sessionGroup.customerName}
              </p>
              <p style={{ textAlign: 'left' }}>
                <b>Total Sessions: </b> {sessionGroup.noOfSession}
              </p>
            </Grid>
            {getSeparator(2, classes.separator)}
            <table style={{ width: '100%' }}>
              <tbody>
                {Array.isArray(sessionGroup.sessionList) &&
                  sessionGroup.sessionList.map((session, index) => (
                    <React.Fragment key={index}>
                      <tr style={{ marginBottom: '10px' }}>
                        <th style={{ textAlign: 'left' }}>Session No</th>
                        <th style={{ textAlign: 'left' }}>Date</th>
                        <th style={{ textAlign: 'left' }}>Start Time</th>
                        <th style={{ textAlign: 'left' }}>End Time</th>
                        <th style={{ textAlign: 'center' }}>Doctor Name</th>
                        <th style={{ textAlign: 'center' }}>Status</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                      </tr>
                      <tr style={{ height: '45px', fontSize: '14px' }}>
                        <td>{index + 1}</td>
                        <td>{session.sessionDate}</td>
                        <td>{session.sessionStartTime}</td>
                        <td>{session.sessionEndTime}</td>
                        <td style={{ textAlign: 'center' }}>{session.doctorName}</td>
                        <td style={{ textAlign: 'center' }}>{session.status}</td>
                        <td style={{ textAlign: 'right' }}>{session.amount}</td>
                      </tr>
                      <tr>
                      <td colSpan="7" style={{ textAlign: 'right' }}>
                          {session.saleDetail && session.saleDetail.saleId ? (
                            <div style={{ height: '45px', textAlign: 'right' }}>
                              <b>Payment Details: </b> INV{' '}
                              {session.saleDetail.sequenceNumber} dated{' '}
                              {session.saleDetail.saleDate}
                            </div>
                          ) : (
                            <div
                              style={{
                                height: '34px',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginBottom: '10px'
                              }}
                            >
                              <Button
                                variant="contained"
                                color="secondary"
                                style={{ color: 'white' }}
                                onClick={(e) => {
                                  convertSessionToSale(sessionGroup, session);
                                  handlePaymentHistoryDialogClose();
                                }}
                              >
                                Raise Payment
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="7">
                          <hr
                            style={{
                              marginBottom: '10px',
                              borderColor: '#ffffff'
                            }}
                          ></hr>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InjectObserver(ViewPaymentHistory);