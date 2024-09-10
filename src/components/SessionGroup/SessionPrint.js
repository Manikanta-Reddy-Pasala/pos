import React, { useRef, useEffect } from 'react';
import ReactToPrint from 'react-to-print';
import { toJS } from 'mobx';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import 'src/views/Printers/ComponentsToPrint/printerpage.css';
import SessionGroupRegularPrint from 'src/views/Printers/ComponentsToPrint/SessionGroupRegularPrint';

const SessionPrint = (props) => {
  let componentRef = useRef();
  const store = useStore();
  const { invoiceRegular } = toJS(store.PrinterSettingsStore);
  
  useEffect(() => {
    if (props.printMe) {
      if (document.getElementById('print-button')) {
        document.getElementById('print-button').click();
      }
    }
  }, [props]);

  const handleAfterPrint = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  useEffect(() => {
    handleAfterPrint();
  }, [props])

  return (
    <div style={{ breakAfter: 'auto' }}>
      <ReactToPrint
        pageStyle={`@page { size: ${invoiceRegular.ddlPageSize} }`}
        trigger={() => (
          <button id="print-button" style={{ display: 'none' }}></button>
        )}
        content={() => componentRef.current}
        onAfterPrint={handleAfterPrint}
      />
      {!props.isThermal &&  
        <SessionGroupRegularPrint
          data={props.data}
          viewHistory={props.viewHistory}
          ref={componentRef}
        />
      }
    </div>
  );
};

export default InjectObserver(SessionPrint);
