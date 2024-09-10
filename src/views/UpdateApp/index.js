import React, { useEffect } from 'react';
import { Typography, makeStyles, Paper } from '@material-ui/core';
import { useStore } from '../../Mobx/Helpers/UseStore';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import useWindowDimensions from '../../components/windowDimension';
import axios from 'axios';
import { version } from './../../../package.json';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: '20px 40px',
    margin: '10px'
  },

  paper: {
    padding: 15
  },
  btn: {
    color: 'white',
    borderRadius: '6px',
    textTransform: 'capitalize',
    fontSize: '12px',
    padding: '6px 14px'
  }
}));

const UpdateApp = () => {
  const classes = useStyles();
  const stores = useStore();
  const { height } = useWindowDimensions();
  const API_SERVER = window.REACT_APP_API_SERVER;
  const CURRENT_API_VERSION = version;
  const [versionDetails, setVersionDetails] = React.useState();

  useEffect(() => {
    getVersionDetails();
  }, []);

  const getVersionDetails = async () => {
    await axios
      .get(`${API_SERVER}/v1/pos/business/getReleaseNotes`)
      .then((response) => {
        if (response && response.data) {
          setVersionDetails(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  };

  return (
    <Paper className={classes.root}>
      <div style={{ width: '50%' }}>
        <Typography style={{ fontSize: '17px', fontWeight: 'bold' }}>
          Current Version {CURRENT_API_VERSION}
        </Typography>
        {versionDetails &&
          versionDetails.release &&
          versionDetails.release.length > 0 &&
          versionDetails.release.map((option, index) => (
            <div style={{ marginTop: '30px' }}>
              <Typography
                style={{
                  fontSize: '14px',
                  marginBottom: '15px',
                  fontWeight: 'bold'
                }}
              >
                Release Notes for {option.version ? option.version : ''}
              </Typography>

              {/* <Typography  style={{fontSize:'14px',marginBottom:'20px'}}>{versionDetails.releaseNotes ? versionDetails.releaseNotes : ''}</Typography> */}
              <div style={{ marginLeft: '10%' }}>
                {option.notes.map((note, index) => (
                  <Typography>{note}</Typography>
                ))}
              </div>
            </div>
          ))}
      </div>
    </Paper>
  );
};

export default InjectObserver(UpdateApp);