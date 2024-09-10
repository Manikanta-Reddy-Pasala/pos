import React from "react";
// import * as printUtil from '../../../utils/print';

import { printNormalMobileApp, printFormattedText, getthermalPrinterList } from '../../../utils/print';

export const printersList = () => {
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
    const data = {
        type:'bluetooth'   // type can be  'bluetooth' | 'usb' | 'tcp'
    };
    getthermalPrinterList(data, (success) => { console.log('printers list: success - ', success) }, (err) => { console.log('printers list: error - ', err) })
    
    

}
export const printNormal = (contents) => {
    let options = {
        font: {
            size: 22,
            italic: true,
            align: 'center'
        },
        paper: {
                height: 0,
                width: 0,
                length: 0,
                name: 'A4'
        },
        header: {
            height: '6cm',
            label: {
                text: "\n\nDie Freuden",
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
                text: 'Johann Wolfgang von Goethe, 1749-1832, deutscher Dichter, Naturforscher',
                font: { align: 'center' }
            }
        }
    };

    //    printUtil.printNormalMobileApp(contents, options, ()=>{});
    printNormalMobileApp(contents, options, (res) => { console.log('regular print: callback - ', res) });
    return '';
}

export const printThermal1 = (content) => {

    // const data ={};	        // Array.<Object>	Data object
    // data.type='';           // "bluetooth" | "tcp" | "usb"	List all bluetooth or usb printers
    // data.id	='';            // string | number	ID of printer to find (Bluetooth: address, TCP: Use address + port instead, USB: deviceId)
    // data.address = '';      // string	If type is "tcp" then the IP Address of the printer
    // data.port = 0;          // number	If type is "tcp" then the Port of the printer
    // data.mmFeedPaper = 0;   // number	Millimeter distance feed paper at the end
    // data.dotsFeedPaper = 0; // number	Distance feed paper at the end
    // data.text = content;    // string	Formatted text to be printed
    // // successCallback = {};   // function	Result on success
    // // errorCallback = {};     // function	Result on failure

    // Content Data  Need to e formatted 
    // example 
    /* 
       {type:'bluetooth',id:"66:22:02:BA:09:D8",text:"[L]\n" +
        "[C]<u><font size='big'>ORDER N°045</font></u>\n" +
        "[L]\n" +
        "[C]================================\n" +
        "[L]\n" +
        "[L]<b>BEAUTIFUL SHIRT</b>[R]9.99e\n" +
        "[L]  + Size : S\n" +
        "[L]\n" +
        "[L]<b>AWESOME HAT</b>[R]24.99e\n" +
        "[L]  + Size : 57/58\n" +
        "[L]\n" +
        "[C]--------------------------------\n" +
        "[R]TOTAL PRICE :[R]34.98e\n" +
        "[R]TAX :[R]4.23e\n" +
        "[L]\n" +
        "[C]================================\n" +
        "[L]\n" +
        "[L]<font size='tall'>Customer :</font>\n" +
        "[L]Raymond DUPONT\n" +
        "[L]5 rue des girafes\n" +
        "[L]31547 PERPETES\n" +
        "[L]Tel : +33801201456\n" +
        "[L]\n" +
        "[C]<barcode type='ean13' height='10'>831254784551</barcode>\n" +
        "[C]<qrcode size='20'>http://www.developpeur-web.dantsu.com/</qrcode>"},function(success){ console.log('success',success)},function(error){console.log('error',error)})


    */

    const data = {    // Array.<Object>	Data object
        type: 'bluetooth',           // "bluetooth" | "tcp" | "usb"	List all bluetooth or usb printers
        id: '66:22:02:BA:09:D8',            // string | number	ID of printer to find (Bluetooth: address, TCP: Use address + port instead, USB: deviceId)
        address: '',      // string	If type is "tcp" then the IP Address of the printer
        port: 0,          // number	If type is "tcp" then the Port of the printer
        mmFeedPaper: 0,   // number	Millimeter distance feed paper at the end
        dotsFeedPaper: 0, // number	Distance feed paper at the end
        text: "[L]\n" +
        "[C]<u><font size='big'>ORDER N°045</font></u>\n" +
        "[L]\n" +
        "[C]================================\n" +
        "[L]\n" +
        "[L]<b>BEAUTIFUL SHIRT</b>[R]9.99e\n" +
        "[L]  + Size : S\n" +
        "[L]\n" +
        "[L]<b>AWESOME HAT</b>[R]24.99e\n" +
        "[L]  + Size : 57/58\n" +
        "[L]\n" +
        "[C]--------------------------------\n" +
        "[R]TOTAL PRICE :[R]34.98e\n" +
        "[R]TAX :[R]4.23e\n" +
        "[L]\n" +
        "[C]================================\n" +
        "[L]\n" +
        "[L]<font size='tall'>Customer :</font>\n" +
        "[L]Raymond DUPONT\n" +
        "[L]5 rue des girafes\n" +
        "[L]31547 PERPETES\n" +
        "[L]Tel : +33801201456\n" +
        "[L]\n" +
        "[C]<barcode type='ean13' height='10'>831254784551</barcode>\n" +
        "[C]<qrcode size='20'>http://www.developpeur-web.dantsu.com/</qrcode>"    // string	Formatted text to be printed
    }

    //    printUtil.printFormattedText(data, () => { }, () => { });
    printFormattedText(data, (success) => { console.log('thermal print: success - ', success) }, (err) => { console.log('thermal print: error - ', err) })
    return '';
}