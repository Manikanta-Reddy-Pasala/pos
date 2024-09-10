import React, { useEffect, useState } from 'react';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { CssBaseline, ThemeProvider, makeStyles } from '@material-ui/core';
import theme from '../../theme';
import { toJS } from 'mobx';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import BubbleLoader from '../../components/loader';
import { Grid, Col } from 'react-flexbox-grid';
import './style.css';
import useWindowDimensions from '../../components/windowDimension';
import FloorDetails from './FloorDetails';
import TableDetails from './TableDetails';
import Controls from 'src/components/controls/index';
import { Add } from '@material-ui/icons';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice/index';
import AddOrder from './Order/index';
import AddOrderV2 from './Order/indexV2';

const useStyles = makeStyles((theme) => ({
  newButton: {
    position: 'relative',
    borderRadius: 25,
    marginTop: '10px'
  }
}));

const KOT = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const store = useStore();
  const [isLoading, setLoadingShown] = useState(true);
  const { tablePropertiesData, openAddSaleDialog, openTouchAddSaleDialog } = toJS(store.KotStore);

  const { initializeSettings } = store.KotStore;

  const { openForNewSale } = store.SalesAddStore;

  const { openAddSalesInvoice } = toJS(store.SalesAddStore);

  useEffect(() => {
    async function fetchData() {
      await initializeSettings();
    }

    fetchData();
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <div>
          {isLoading && <BubbleLoader></BubbleLoader>}
          {!isLoading && (
            <div>
              <Grid item xs={4} align="right">
                <Controls.Button
                  text="Add Self Order"
                  size="medium"
                  variant="contained"
                  color="primary"
                  autoFocus={true}
                  startIcon={<Add />}
                  className={classes.newButton}
                  onClick={() => openForNewSale()}
                />
              </Grid>
              <Grid fluid className="app-main" style={{ height: height - 50 }}>
                <Col
                  className="nav-column"
                  xs={tablePropertiesData.floorNoDataStatus ? 12 : 8}
                >
                  <FloorDetails />
                  {tablePropertiesData.floorNoDataStatus && (
                    <div className="no_data">
                      <p>
                        No Tables Found.Kindly Add Tables from Partner App to
                        Display
                      </p>
                    </div>
                  )}
                </Col>
                {!tablePropertiesData.floorNoDataStatus && (
                  <Col className="content-column tableDetailDiv" xs>
                    <TableDetails />
                  </Col>
                )}
              </Grid>
            </div>
          )}
        </div>
        <CssBaseline />
      </ThemeProvider>
      {openAddSalesInvoice ? <AddSalesInvoice /> : null}
      {openTouchAddSaleDialog ? <AddOrderV2 /> : null}  
          {openAddSaleDialog ? <AddOrder /> : null}
    </div>
  );
};

export default InjectObserver(KOT);