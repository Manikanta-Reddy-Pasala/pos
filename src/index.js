import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as ReactRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Root from '../src/RxDb/Database/Root';

//enable/disable console logs in installer
if (process.env.NODE_ENV === 'production') {
  // console.log = () => {};
  console.debug = () => {};
}

const usingCordova = () => {
  if (window.hasOwnProperty('cordova')) {
    return true;
  } else {
    return false;
  }
};

const initApp = () => {
  ReactDOM.render(
    <ReactRouter>
      <Root />
    </ReactRouter>,
    document.getElementById('root')
  );
};

if (usingCordova()) {
  document.addEventListener(
    'deviceready',
    () => {
      initApp();
    },
    false
  );
} else {
  initApp();
}

serviceWorker.register();
