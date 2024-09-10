import React, { useRef, useEffect } from 'react';
import ReactToPrint from 'react-to-print';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import BarcodeRegularPrinterComponent from './BarcodeRegularPrinterComponent';
import { toJS } from 'mobx';

const BarcodeRegularPrintComponent = (props) => {
  let componentRef = useRef();
  const store = useStore();
  const { BarcodeFinalArrayList } = toJS(store.BarcodeStore);
  
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
      <BarcodeRegularPrinterComponent
        ref={componentRef}
        data={BarcodeFinalArrayList}
        detailData={props.detailData}
      />
    </div>
  );
};
export default InjectObserver(BarcodeRegularPrintComponent);
