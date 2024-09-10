
const getThermalPrinterName = () => {
  return localStorage.getItem('thermalPrinterName');
}

export const printThermal = (data) => {
  const customData = data.customData ? data.customData : {
    pageSize : false,
    width : '250',
    pageWidth : '',
    pageHeight: '',
    margin : 0,
  } 
  const width = customData && customData.pageWidth ? customData.pageWidth : 250
  const height = customData && customData.pageHeight ? customData.pageHeight : 301000

  // printer data
  var printerData = {
    printerName: getThermalPrinterName(),
    data: data,
    customData : customData,
    pageSize : customData.pageSize ? { height: Number(height) , width: Number(width) } : null
  };

  // sending data to ipcmain (index.js to render to pos-printer)
  window.ipcRenderer.send("print", JSON.stringify(printerData));
}