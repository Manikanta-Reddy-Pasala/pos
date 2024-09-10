import React from 'react';
const numberToText = require('number-to-text');
require('number-to-text/converters/en-us'); // load converter

//const ThermalPrinter = require("node-thermal-printer").printer;
//const PrinterTypes = require("node-thermal-printer").types;

class InvoiceThermalPrint extends React.PureComponent {
  render() {
    let _data = {};
    const data = {
      customerName: '',
      customerAddress: '',
      customerPhoneNo: '',
      cusstomerPincode: '',
      customerCity: '',
      customerEmailId: '',
      invoiceNumber: '',
      date: '',
      subTotal: 0,
      totalAmount: '',
      totalDiscount: 0,
      strTotal: '',
      receivedAmount: '',
      balanceAmount: '',
      paymentMode: ''
    };
    let settings = {};
    let totalqty = 0;
    let totaltax_gst = 0;
    const gstMap = new Map();

    const getFloatWithTwoDecimal = (val) => {
      return parseFloat(val).toFixed(2);
    };

    const mapPrintableData = () => {
      data.customerName = _data.customer_name;
      data.customerAddress = _data.customer_address;
      data.customerPhoneNo = _data.customer_phoneNo;
      data.cusstomerPincode = _data.cusstomer_pincode;
      data.customerCity = _data.customer_city;
      data.customerEmailId = _data.customer_emailId;
      data.invoiceNumber = _data.invoice_number;
      data.date = _data.invoice_date || _data.date;
      data.totalAmount = _data.total_amount;
      data.strTotal = numberToText.convertToText(_data.total_amount);
      data.receivedAmount = _data.received_amount;
      data.balanceAmount = _data.balance_amount;
      data.paymentMode = _data.payment_type;
    };

    const getInvoiceRows = () => {
      return _data.item_list.forEach((item, index) => {
        const mrp = parseFloat(item.mrp).toFixed(2);
        let offerPrice = parseFloat(item.offer_price).toFixed(2);
        if (isNaN(offerPrice)) {
          offerPrice = mrp;
        } //offer price is coming wrong
        
        let itemDiscount = 0;

        if (item.discount_amount > 0) {
          itemDiscount = parseFloat(item.discount_amount);
        }

        const cgstPercent = parseFloat(item.cgst);
        const sgstPercent = parseFloat(item.sgst);
        const igstPercent = parseFloat(item.igst);
        const cessPercent = parseFloat(item.cess);

        const qty = parseFloat(item.qty);
        let tempMrp = mrp;
        let totalGST = 0;
        if (offerPrice < mrp && offerPrice !== 0) {
          tempMrp = offerPrice;
          data.subTotal += offerPrice * qty;
        } else if (qty > 0) {
          data.subTotal += mrp * qty;
        }
        if (cgstPercent) {
          totalGST += parseFloat(item.cgst_amount);
        }
        if (sgstPercent) {
          totalGST += parseFloat(item.sgst_amount);
        }

        if (igstPercent) {
          totalGST += parseFloat(item.igst_amount);
        }
        if (cessPercent) {
          totalGST += parseFloat(item.cess);
        }

        totalqty += parseFloat(item.qty);
        totaltax_gst += totalGST;
        const offer_price =
          item.offer_price === '' || isNaN(item.offer_price)
            ? item.mrp
            : item.offer_price;
        var finalMRP =
          offer_price !== 0
            ? item.mrp > offer_price
              ? offer_price
              : item.mrp
            : item.mrp;
        const discount = qty * (item.mrp - offer_price);
        
        data.totalDiscount += discount;
        const itemTotal = finalMRP * item.qty;

        // printer.tableCustom([
        //   { text: (index + 1), align: "LEFT", width: 0.15 },
        //   { text: item.item_name, align: "LEFT", width: 0.25 },
        //   { text: item.qty, align: "LEFT", width: 0.15 },
        //   { text: ('₹ ' + mrp), align: "LEFT", width: 0.20 },
        //   { text: ('₹ ' + getFloatWithTwoDecimal(itemTotal)), align: "RIGHT", width: 0.25 }
        // ]);
      });
    };

    const getGSTRows = () => {
      if (_data.item_list) {
        _data.item_list.forEach((item) => {
          if (!item) {
            return;
          }
          const mrp = parseFloat(item.mrp).toFixed(2);
          const offerPrice = parseFloat(item.offer_price).toFixed(2);
          const qty = parseFloat(item.qty);
          let tempMRP = mrp;
          if (offerPrice < mrp && offerPrice !== 0) {
            tempMRP = offerPrice;
          }
          if (item.cgst && item.cgst > 0) {
            const cgstKey = `CGST@${item.cgst}%`;
            if (gstMap.has(cgstKey)) {
              gstMap.set(
                cgstKey,
                gstMap.get(cgstKey) + (item.cgst * tempMRP * qty) / 100
              );
            } else {
              gstMap.set(cgstKey, (item.cgst * tempMRP * qty) / 100);
            }
          }
          if (item.sgst && item.sgst > 0) {
            const sgstKey = `SGST@${item.sgst}%`;
            if (gstMap.has(sgstKey)) {
              gstMap.set(
                sgstKey,
                gstMap.get(sgstKey) + (item.sgst * tempMRP * qty) / 100
              );
            } else {
              gstMap.set(sgstKey, (item.sgst * tempMRP * qty) / 100);
            }
          }
        });
      }
    };

    if (this.props && this.props.data) {
      _data = this.props.data;
      settings = this.props.settings;
      mapPrintableData();
      getGSTRows();
    }

    // let printer = new ThermalPrinter({
    //   type: PrinterTypes.STAR,                                  // Printer type: 'star' or 'epson'
    //   // interface: 'tcp://xxx.xxx.xxx.xxx',                       // Printer interface
    //   interface: '/dev/usb/lp1',
    //   characterSet: 'SLOVENIA',                                 // Printer character set
    //   removeSpecialCharacters: false,                           // Removes special characters - default: false
    //   replaceSpecialCharacters: true,                           // Replaces special characters listed in config files - default: true
    //   extraSpecialCharacters: { '£': 163 },                     // Adds additional special characters to those listed in the config files
    //   lineCharacter: "-",                                       // Set character for lines - default: "-"
    //   options: {                                                // Additional options
    //     timeout: 5000                                           // Connection timeout (ms) [applicable only for network printers] - default: 3000
    //   }
    // });
    // const printContent = () => {
    //   printer.setTextSize(7, 7);
    //   printer.alignCenter();
    //   printer.bold(true);
    //   if (settings.boolCompanyName) { printer.println(settings.strCompanyName); }
    //   printer.bold(false);
    //   if (settings.boolAddress) { printer.println(settings.strAddress); }
    //   if (settings.boolEmail) { printer.println('Email: ' + settings.strEmail); }
    //   if (settings.boolPhone) { printer.println('Ph. no: ' + settings.strPhone); }
    //   if (settings.boolGSTIN) { printer.println(settings.strGSTIN); }

    //   printer.setTextSize(9, 9);
    //   printer.bold(true);
    //   printer.println(_data.date ? 'Credit Note' : 'Invoice');
    //   printer.bold(false);

    //   printer.setTextSize(7, 7);
    //   printer.alignLeft();

    //   printer.println('');//empty line
    //   printer.bold(true);
    //   printer.println(data.customer_name);
    //   printer.bold(false);
    //   if (settings.customer_address) { printer.println(data.customer_address); }
    //   if (settings.customer_phoneNo) { printer.println(data.customer_phoneNo); }
    //   if (settings.cusstomer_pincode) { printer.println(data.cusstomer_pincode); }
    //   if (settings.customer_city) { printer.println(data.customer_city); }
    //   if (settings.customer_emailId) { printer.println(data.customer_emailId); }

    //   printer.println('');//empty line
    //   printer.alignRight();
    //   printer.println((_data.date ? 'Return No.: ' : 'Invoice No.: ') + data.invoiceNumber);
    //   printer.println('Date: ' + data.date);

    //   printer.println('');//empty line
    //   printer.tableCustom([
    //     { text: "SR", align: "LEFT", width: 0.15, bold: true },
    //     { text: "Name", align: "LEFT", width: 0.25, bold: true },
    //     { text: "Qty", align: "LEFT", width: 0.15, bold: true },
    //     { text: "Price", align: "LEFT", width: 0.20, bold: true },
    //     { text: "Amount", align: "RIGHT", width: 0.25, bold: true }
    //   ]);
    //   printer.drawLine();
    //   getInvoiceRows(); // printing items

    //   printer.tableCustom([
    //     { text: "", align: "LEFT", width: 0.40 },
    //     { text: "Discount:", align: "LEFT", width: 0.30 },
    //     { text: ('₹ ' + getFloatWithTwoDecimal(data.subTotal)), align: "RIGHT", width: 0.30 }
    //   ]);
    //   printer.tableCustom([
    //     { text: "", align: "LEFT", width: 0.40 },
    //     { text: "GST:", align: "LEFT", width: 0.30 },
    //     { text: ('₹ ' + getFloatWithTwoDecimal(data.subTotal)), align: "RIGHT", width: 0.30 }
    //   ]);
    //   printer.drawLine();
    //   printer.tableCustom([
    //     { text: "Total", align: "LEFT", width: 0.40, bold: true },
    //     { text: totalqty, align: "LEFT", width: 0.15, bold: true },
    //     { text: ('₹ ' + getFloatWithTwoDecimal(data.subTotal)), align: "RIGHT", width: 0.45, bold: true }
    //   ]);

    //   printer.tableCustom([
    //     { text: "", align: "LEFT", width: 0.40 },
    //     { text: "Discount", align: "LEFT", width: 0.30 },
    //     { text: ('₹ ' + getFloatWithTwoDecimal(data.totalDiscount)), align: "RIGHT", width: 0.30 }
    //   ]);
    //   if (settings.boolTaxDetails) {
    //     Array.from(gstMap.keys()).forEach((key) => {
    //       printer.tableCustom([
    //         { text: "", align: "LEFT", width: 0.40 },
    //         { text: key, align: "LEFT", width: 0.30 },
    //         { text: ('₹ ' + getFloatWithTwoDecimal(gstMap.get(key))), align: "RIGHT", width: 0.30 }
    //       ]);
    //     })
    //   }
    //   printer.tableCustom([
    //     { text: "", align: "LEFT", width: 0.40 },
    //     { text: "Total", align: "LEFT", width: 0.30, bold: true },
    //     { text: ('₹ ' + getFloatWithTwoDecimal(data.totalAmount)), align: "RIGHT", width: 0.30, bold: true }
    //   ]);
    //   printer.tableCustom([
    //     { text: "", align: "LEFT", width: 0.40 },
    //     { text: "Received", align: "LEFT", width: 0.30 },
    //     { text: ('₹ ' + getFloatWithTwoDecimal(data.receivedAmount)), align: "RIGHT", width: 0.30 }
    //   ]);
    //   printer.tableCustom([
    //     { text: "", align: "LEFT", width: 0.40 },
    //     { text: "Balance", align: "LEFT", width: 0.30 },
    //     { text: ('₹ ' + getFloatWithTwoDecimal(data.balanceAmount)), align: "RIGHT", width: 0.30 }
    //   ]);
    //   if (settings.boolPaymentMode) {
    //     printer.tableCustom([
    //       { text: "", align: "LEFT", width: 0.40 },
    //       { text: "Payment Mode", align: "LEFT", width: 0.30 },
    //       { text: ('₹ ' + getFloatWithTwoDecimal(data.paymentMode)), align: "RIGHT", width: 0.30 }
    //     ]);
    //   }
    //   if (settings.boolTerms) {
    //     printer.println("Thanks for doing business with us!");
    //   }
    //   // printer.openCashDrawer();                              // Kick the cash drawer
    //   if (settings.boolCutPaperSize) {
    //     printer.cut();                                            // Cuts the paper (if printer only supports one mode use this)
    //     // printer.partialCut();                                  // Cuts the paper leaving a small bridge in middle (if printer supports multiple cut modes)
    //   }
    //   // printer.beep();                                        // Sound internal beeper/buzzer (if available)
    //}

    const startPrint = async () => {
      // let isConnected = await printer.isPrinterConnected();       // Check if printer is connected, return bool of status
      // if (isConnected) {
      //   try {
      //     printContent();
      //     let execute = await printer.execute();                  // Executes all the commands. Returns success or throws error
      //     console.log('Printing is done!')
      //   } catch (err) {
      //     console.log('Print failed: ' + err);
      //   }
      // }
    };

    startPrint();
    return '';
  }
}
export default InvoiceThermalPrint;
