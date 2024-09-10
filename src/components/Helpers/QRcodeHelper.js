import QRCode from "qrcode";

export const generateQRcode = async (invoiceRegular) => {
    let QRcodestr = '';
    if (invoiceRegular.strqrcode && invoiceRegular.boolQrCode) {
      let QRCode = '';
      if (
        invoiceRegular.qrCodeValueOptn === 'upi' &&
        invoiceRegular.paymentUpi !== null &&
        invoiceRegular.paymentUpi !== ''
      ) {
        let beforeAt = invoiceRegular.paymentUpi.split('@');
        QRCode =
          'upi://pay?pa=' +
          invoiceRegular.paymentUpi +
          '&pn=' +
          beforeAt[0] +
          '&am=' +
          1000 +
          '&tn=' +
          invoiceRegular.strCompanyName;
          QRcodestr = QRCode;
      } else {
        QRCode =
          'upi://pay?pa=' +
          invoiceRegular.paymentbankNumber +
          '@' +
          invoiceRegular.paymentifsc +
          '.ifsc.npci' +
          '&pn=' +
          invoiceRegular.paymentPayeeName +
          '&am=' +
          1000 +
          '&tn=' +
          invoiceRegular.strCompanyName;
          QRcodestr = QRCode;
      }
    }

    try {
      // Generate QR code data URL
      const dataUrl = await QRCode.toDataURL(QRcodestr);
      return dataUrl; // Return the generated data URL
    } catch (error) {
      console.error("Error generating QR code:", error);
      return null; // Return null if there's an error
    }

    // return QRcodestr;
};
