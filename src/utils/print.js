// import { ipcRenderer } from 'electron';
// The Unit type can be either a (float) number or a string with a special suffix.

// Supported unit suffixes are in for inches, mm for millimeters, cm for centimeters and pt for points
// "2in" are two inches whereas 2.0 or "2.0pt" are identical for two points
// One inch are 72.0 points

let options = {
  font: {
    size: 22,
    italic: true,
    align: 'center'
  },
  header: {
    height: '6cm',
    label: {
      text: '\n\nDie Freuden',
      font: {
        bold: true,
        size: 37,
        align: 'center'
      }
    }
  },
  footer: {
    height: '4cm',
    label: {
      text:
        'Johann Wolfgang von Goethe, 1749-1832, deutscher Dichter, Naturforscher',
      font: { align: 'center' }
    }
  }
};

export function usingCordova() {
  if (window.hasOwnProperty('cordova')) {
    return true;
  }
  return false;
}

export function printNormalMobileApp(contents, options, callback) {
  //
  if (usingCordova()) {
    return window.cordova.plugins.printer.print(contents, options, callback);
  }
}

// Thermal Printer Section

export function getthermalPrinterList(data, success, error) {
  if (usingCordova()) {
    window.ThermalPrinter.listPrinters(data, success, error);
  }
}

/*

data	Array.<Object>	Data object
data.type	"bluetooth" | "tcp" | "usb"	List all bluetooth or usb printers
[data.id]	string | number	ID of printer to find (Bluetooth: address, TCP: Use address + port instead, USB: deviceId)
[data.address]	string	If type is "tcp" then the IP Address of the printer
[data.port]	number	If type is "tcp" then the Port of the printer
[data.mmFeedPaper]	number	Millimeter distance feed paper at the end
[data.dotsFeedPaper]	number	Distance feed paper at the end
data.text	string	Formatted text to be printed
successCallback	function	Result on success
errorCallback	function	Result on failure

*/

export function printFormattedText(data, success, error) {
  if (usingCordova()) {
    window.ThermalPrinter.listPrinters(
      { type: 'bluetooth' },
      function (printerData) {
        if (printerData && printerData.length > 0) {
          for (let i = 0; i < printerData.length; i++) {
            data.id = printerData[i].address;
            window.ThermalPrinter.printFormattedText(
              data,
              (success) => {},
              (error) => {}
            );
            window.ThermalPrinter.disconnectPrinter(
              data,
              (success) => {},
              (error) => {}
            );
          }
        }
      },
      function (error) {}
    );

    window.ThermalPrinter.listPrinters(
      { type: 'usb' },
      function (printerData) {
        if (printerData && printerData.length > 0) {
          for (let i = 0; i < printerData.length; i++) {
            data.id = printerData[i].deviceId;
            data.type = 'usb';
            window.ThermalPrinter.requestPermissions(
              { type: 'usb', id: data.id },
              function (success) {
                window.ThermalPrinter.printFormattedText(
                  data,
                  (success) => {
                    console.log('Success');
                  },
                  (error) => {}
                );
                window.ThermalPrinter.disconnectPrinter(
                  data,
                  (success) => {},
                  (error) => {}
                );
              },
              function (error) {
                console.log('error', error);
              }
            );
          }
        }
      },
      function (error) {}
    );
  }
}

export function requestPermission(data, success, error) {
  if (usingCordova()) {
    window.ThermalPrinter.requestPermissions(data, success, error);
  }
}

export const printThermalMobileApp = () => {
  // Write logic for print
};

// Electron App Printer Setup and Print

export function printThermalElectron() {
  const PosPrinter = window.ipcRenderer.PosPrinter;
  console.log('Srinija printerName: printThermalElectron');
  const options = {
    preview: true, // Preview in window or print
    width: '300px', //  width of content body
    margin: '0 0 0 0', // margin of content body
    copies: 1, // Number of copies to print
    printerName: 'XP-80C', // printerName: string, check with webContent.getPrinters()
    timeOutPerLine: 1000,
    pageSize: { height: 301000, width: 71000 } // page size
  };

  const data = [
    {
      type: 'text', // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: 'SAMPLE HEADING',
      style: `text-align:center;`,
      css: { 'font-weight': '700', 'font-size': '18px' }
    }
  ];
  PosPrinter(data, options);
}
