import React, { useRef, useEffect } from 'react';
import ReactToPrint from 'react-to-print';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import LabelRegularPrinterComponent from './LabelRegularPrinterComponent';
import { toJS } from 'mobx';

const LabelRegularPrintComponent = (props) => {
  let componentRef = useRef();
  const store = useStore();
  const { withoutBarcodeFinalArray } = toJS(store.BarcodeStore);
  
  useEffect(() => {
    if (props.printMe) {
      setTimeout(() => {
        if (document.getElementById('print-button')) {
          document.getElementById('print-button').click();
        }
      }, 500);
    }
  }, [props]);

  return (
    <div>
      <ReactToPrint
         pageStyle= {'@page { size: A4; margin-top: 40px }'}
        trigger={() => (
          <button id="print-button" style={{ display: 'none' }}></button>
        )}
        content={() => componentRef.current}
      />
      <LabelRegularPrinterComponent
        ref={componentRef}
        data={withoutBarcodeFinalArray}
      />
    </div>
  );
};
export default InjectObserver(LabelRegularPrintComponent);
