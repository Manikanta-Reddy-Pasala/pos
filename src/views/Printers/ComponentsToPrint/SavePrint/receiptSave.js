import React, { useRef, useEffect, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { toJS } from 'mobx';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import '../printerpage.css';
import ReceiptPrint from '../receipt';

const SaveAndPrintReceiptToPrint = (props) => {
  let componentRef = useRef();
  const store = useStore();
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);

  useEffect(() => {
    if (props.printMe) {
      if (document.getElementById('print-button')) {
        document.getElementById('print-button').click();
      }
    }
  }, [props]);

  return (
    <div style={{ breakAfter: 'auto' }}>
      <ReactToPrint
        pageStyle={'@page { size:' + invoiceRegular.ddlPageSize + ' }'}
        trigger={() => (
          <button id="print-button" style={{ display: 'none' }}></button>
        )}
        content={() => componentRef.current}
      />
      {!props.isThermal && (
        <ReceiptPrint
          data={props.data}
          settings={invoiceRegular}
          balanceData={props.balanceData}
          ref={componentRef}
        />
      )}
    </div>
  );
};
export default InjectObserver(SaveAndPrintReceiptToPrint);
