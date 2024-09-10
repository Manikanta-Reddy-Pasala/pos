import React from 'react';
import * as JsBarcode from 'jsbarcode';

import { useBarcode } from '@createnextapp/react-barcode';
const classes = {
  flex: "display: 'flex',",
  center: "alignSelf: 'center',textAlign: 'center',",
  alignRight: "textAlign: 'right',",
  paperBox:
    "fontSize: '9px',height: '200px',padding: '6px',width: '200px',wordBreak: 'break-word',",
  p: "fontWeight: 'bold',",
  cardCol1: "width: '5%',",
  cardCol2: "width: '32%',",
  cardColOther: "width: '12%',textAlign: 'right',",
  cardColFlex: "flex: 1,wordBreak: 'keep-all',",
  flexRow: "display: 'flex',flexDirection: 'row',",
  flexColumn: "display: 'flex',flexDirection: 'column',",
  cardCol40percent: "width: '40%',",
  strong: 'fontWeight: 600,',
  separator: "height: '5px',width: '100%',",
  greyBackground: "backgroundColor: '#f5f2f2',"
};

var body = '';
export const BarcodeRegularPrintContent = (BarcodeDataList) => {
    
    // const { inputRef } = useBarcode({
    //     value:'test', 
    //     options: {
    //       background: '#ffffff',
    //       fontSize: 15,
    //       font:'caption',
    //       // displayValue: false,
    //       margin: 5,
    //       fontOptions: "bolder",
    //       width: 1.2,
    //       textAlign: 'center',
    //       height:30
    //     }
    //   });
    // JsBarcode("#barcode", "Hi world!");


     body=
      `
        <div>
          <div style="display:flex;font-family: Verdana, sans-serif;font-size:10">
        <div style="text-align:center;" "class="barcode-container">
        <p style="margin-bottom: 0px;">headerText</p>
            <img class="barCode1"  
        jsbarcode-value="test"
      />
       
        <p>additionalText</p>
        <p style="margin-top: -10px;">footerText</p>
        </div>
       
        </div>
        
      

        </div>`
    


    JsBarcode(`.barCode1`).init();

  return {  __html: body }

};
