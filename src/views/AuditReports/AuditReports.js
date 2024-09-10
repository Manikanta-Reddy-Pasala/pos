import React, { useState, useEffect } from 'react';
import { Grid, Col } from 'react-flexbox-grid';
import './style.css';
import useWindowDimensions from '../../components/windowDimension';
import { toJS } from 'mobx';
import { useStore } from '../../Mobx/Helpers/UseStore';
import AuditReportsList from './AuditReportsList';
import Tax from '../Reports/TaxReport/Tax/Tax';
import GSTR1 from '../Reports/TaxReport/GSTR-1';
import NoPermission from 'src/views/noPermission';
import * as Bd from 'src/components/SelectedBusiness';
import BubbleLoader from 'src/components/loader';
import AuditorSalesReport from '../Reports/ExhaustiveReport/Sales/AuditorSalesReport';
import AuditorSalesReturnReport from '../Reports/ExhaustiveReport/SalesReturn/AuditorSalesReturnReport';
import AuditorPurchasesReport from '../Reports/ExhaustiveReport/Purchases/AuditorPurchasesReport';
import AuditorPurchasesReturnReport from '../Reports/ExhaustiveReport/PurchasesReturn/AuditorPurchasesReturnReport';
import Auditor43Bh from '../Reports/ExhaustiveReport/43BhReport/Auditor43Bh';

const AuditReports = () => {
  const store = useStore();

  const { auditReportRouterData } = toJS(store.ReportsStore);
  const { height } = useWindowDimensions();
  let [returnData, setReturnData] = useState(auditReportRouterData);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Accounting & Audit')) {
        setFeatureAvailable(false);
      }
    }
  };

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div>
          {isFeatureAvailable ? (
            <Grid fluid className="app-main" style={{ height: height - 50 }}>
              <Col className="nav-column" xs={12} sm={2}>
                <AuditReportsList returnData={setReturnData} />
              </Col>

              <Col className="content-column" xs>
                {returnData === 'taxcredits' && (
                  <div>
                    <Tax />
                  </div>
                )}
                {returnData === 'gstrreports' && (
                  <div>
                    <GSTR1 />
                  </div>
                )}
                {returnData === 'sale' && (
                  <div>
                    <AuditorSalesReport />
                  </div>
                )}
                {returnData === 'salereturn' && (
                  <div>
                    <AuditorSalesReturnReport />
                  </div>
                )}
                {returnData === 'purchase' && (
                  <div>
                    <AuditorPurchasesReport />
                  </div>
                )}
                {returnData === 'purchasereturn' && (
                  <div>
                    <AuditorPurchasesReturnReport />
                  </div>
                )}
                {returnData === '43bh' && (
                  <div>
                    <Auditor43Bh />
                  </div>
                )}
              </Col>
            </Grid>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
    </div>
  );
};

export default AuditReports;