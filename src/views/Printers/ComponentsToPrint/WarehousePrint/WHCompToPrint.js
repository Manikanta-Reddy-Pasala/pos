import React, { useRef, useEffect, useState } from 'react';
import ReactToPrint from 'react-to-print';
import WareHousePrint from './warehousePrint';
import { toJS } from 'mobx';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import '../printerpage.css';

const WHCompToPrint = (props) => {
  let componentRef = useRef();
  const store = useStore();
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  
  useEffect(() => {
    // if (props.data && (props.data.invoice_number || props.data.receiptNumber)) {
    //   getInvoiceSettings(localStorage.getItem('businessId'));
    // }

    console.log(
      'Data rendered Component To Print: ' + props.data.sequenceNumber
    );

    if (props.printMe) {
      // setTimeout(() => {
      if (document.getElementById('print-button')) {
        document.getElementById('print-button').click();
      }
      //  }, 500);
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
            <WareHousePrint 
            data={props.data}
            settings={invoiceRegular}
            ref={componentRef}
            />
        }
    </div>
  );
};
export default InjectObserver(WHCompToPrint);
