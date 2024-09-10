import React, { useRef, useEffect, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { toJS } from 'mobx';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import '../printerpage.css';
import InvoiceRegular from '../invoiceRegular';

const SaveAndPrintCompToPrint = (props) => {
  let componentRef = useRef();
  const store = useStore();
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  
  useEffect(() => {

    if (props.printMe) {
      console.log("Print Me called");
      if (document.getElementById('print-button')) {
        document.getElementById('print-button').click();
      }
    }
  }, [props]);

  return (
    <div style={{ breakAfter: 'auto' }}>
      <ReactToPrint
        pageStyle= { "@page { size:"+ invoiceRegular.ddlPageSize +" }"}
        trigger={() => (
          <button id="print-button" style={{ display: 'none' }}></button>
        )}
        content={() => componentRef.current}
      />
        {!props.isThermal &&  
            <InvoiceRegular 
            data={props.data}
            settings={invoiceRegular}
            TxnSettings={props.TxnSettings}
            balanceData={props.balanceData}
            ref={componentRef}
            />
        }
    </div>
  );
};
export default InjectObserver(SaveAndPrintCompToPrint);
