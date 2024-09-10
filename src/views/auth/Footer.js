import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';

import axios from 'axios';
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'sticky',
    backgroundColor: '#ffffff !important',
    boxShadow: 'none !important'
  },
  divAlign: {
    float: 'right'
  },
  btnAlign: {
    textTransform: 'inherit',
    padding: '6px 0px 6px 18px',
    color: '#9d9d9d'
  },
  downloadBtn: {
    textTransform: 'inherit',
    padding: '6px 0px 6px 18px',
    color: '#9d9d9d'
  }
}));

function Footer() {
  const classes = useStyles();
  const API_SERVER = window.REACT_APP_API_SERVER;

  const getPosLink = async () => {
    await axios
      .get(`${API_SERVER}/v1/pos/business/getReleaseNotes`)
      .then((response) => {
        if (response && response.data) {
          window.location.href = response.data.downloadUrl;
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  };

  return (
    <div>
      <div className={classes.divAlign}>
        <Button className={classes.downloadBtn} onClick={getPosLink}>
          Download for Desktop
        </Button>
        <Button className={classes.btnAlign}>
          <a style={{ color: '#9d9d9d' }} target="_blank" href="https://oneshellsolutions.com/">
            About Us
          </a>
        </Button>
        <Button className={classes.btnAlign}>
          <RouterLink to="/faq" style={{ color: '#9d9d9d' }}>
            FAQ
          </RouterLink>
        </Button>
      </div>
    </div>
  );
}

export default InjectObserver(Footer);
