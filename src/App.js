import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import theme from '../src/theme';
import routes from '../src/routes';
import GlobalStyles from './components/GlobalStyles';
import UpdateHandler from './UpdateHandler';
import MissingInvoicesImportHandler from './MissingInvoicesImportHandler';

import Stores from './Mobx/Stores';
import { Provider as MobxProvider } from 'mobx-react';

import Scheduler from './components/scheduler/Scheduler';

const App = () => {
  const isSignedIn = localStorage.getItem('signedIn');
  const routing = useRoutes(routes(isSignedIn));
  const missingInvoicesImportHandler = new MissingInvoicesImportHandler();
  const updateHandler = new UpdateHandler();

  useEffect(() => {
    updateHandler.callUpdateAPI().then((r) => {});
    missingInvoicesImportHandler
      .compareAuditDataAndImportToSales()
      .then((r) => {});
  }, []);

  return (
    <MobxProvider stores={Stores}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {/*<Scheduler /> /!* Include the Scheduler component here *!/*/}
        {routing}
      </ThemeProvider>
    </MobxProvider>
  );
};

export default App;
