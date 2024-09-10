import React from 'react';

import { useBarcode } from '@createnextapp/react-barcode';

const BarcodeGenerator = (props) => {

  var width    = 1;
  var fontSize = 3;
  var height   = 18;
  var fontOptions = '';

  if(props.type === 'default'){
 
         width  = (props.size === 65 || props.size === 48) 
                ? props.barcode.length < 10 
                ? 0.7 
                : 0.5 
                : props.size === 24 
                ? 0.9 
                : props.size === 12 
                ? 1.2 
                : props.size === 1 
                ? 1.8 
                : props.size === 2 || props.size === 2.2 || props.size === 2.4
                ? 0.9 
                : props.size === 2.1 || props.size === 1.1 
                ? 0.5 
                :  0;

      fontSize  = (props.size === 65 || props.size === 48  || props.size === 2) 
                ? 9 
                : props.size === 24 
                ? 5 
                : props.size === 12 
                ? 16 
                : props.size === 1 
                ? 18 
                : props.size === 2.1 || props.size === 1.1 
                ? 9 
                : 3;

      height    = props.size === 12  
                ? 34 
                : props.size === 1 
                ? 56 
                : props.size === 2.1 || props.size === 1.1 || props.size === 2.4
                ? 12 
                : 18;


   }
   else {
      
        width    = props.customData.customWidth <= 100 
                  ? 0.4
                  : props.customData.customWidth > 100 && props.customData.customWidth <= 200 
                  ? 1
                  : props.customData.customWidth > 200 && props.customData.customWidth <= 300 
                  ? 2 
                  : props.customData.customWidth > 300 && props.customData.customWidth <= 400
                  ? 3
                  : props.customData.customWidth > 400 && props.customData.customWidth <= 500
                  ? 4
                  : props.customData.customWidth > 500 && props.customData.customWidth <= 800
                  ? 5
                  : props.customData.customWidth > 800 && props.customData.customWidth <= 1000
                  ? 6
                  : 7;
          
        //fontSize = props.customData.itemCode ? props.customData.itemCode : 15;
        fontSize = 10;
        height   = props.customData.customHeight <= 70 
                  ? 15
                  : props.customData.customHeight > 70 && props.customData.customHeight <= 100
                  ? 23
                  : props.customData.customHeight > 100 && props.customData.customHeight <= 200 
                  ? 35
                  : props.customData.customHeight > 200 && props.customData.customHeight <= 300 
                  ? 45               
                  : 100;
      fontOptions= props.customData.itemcodeWeight ? 'bold' : '';

   }

   

  const { inputRef } = useBarcode({
    value:props.barcode, 
    options: {
      background: '#ffffff',
      fontSize: fontSize,
      font:'caption',
      margin: 0,
      width: width,
      height: height,
      fontOptions : fontOptions,
      marginBottom : props.customData.marginBottom ? props.customData.marginBottom : undefined,
      marginTop    : props.customData.marginTop ? props.customData.marginTop : undefined,
      marginLeft   : props.customData.marginLeft ? props.customData.marginLeft : undefined,
      marginRight  : props.customData.marginRight ? props.customData.marginRight : undefined,
    }
  });
 



  return (
   
        <div 
         style={{
          width:'100%',
          textAlign:'center',
          display:'inline-table'
          }}>
         <svg ref={inputRef} />
        </div>
                    

  );
};

export default BarcodeGenerator;
