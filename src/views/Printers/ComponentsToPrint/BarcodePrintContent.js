let contentBuilder = [];

const appendDoubleBarcode = (
  type,
  value1,
  value2,
  headerText,
  additionalText,
  footerText,
  headerText2,
  additionalText2,
  footerText2,
  height,
  width,
  style,
  css,
  headerStyle1,
  headerStyle2,
  footerStyle1,
  footerStyle2,
  lineStyle1,
  lineStyle2,
  itemStyle1 = {},
  description,
  descriptionTextStyle,
  offerPrice,
  description2,
  offerPrice2,
  grossWeight,
  wastage,
  netWeight,
  purity,
  huid,
  grossWeight2,
  wastage2,
  netWeight2,
  purity2,
  huid2
) => {
  contentBuilder.push({
    type: type, // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
    value1: value1,
    value2: value2,
    style: style,
    css: css,
    height: height, // height of barcode, applicable only to bar and QR codes
    width: width,
    displayValue: false, // Display value below barcode
    headerText1: headerText,
    additionalText1: additionalText,
    itemCode1: value1,
    footerText1: footerText,
    headerText2: headerText2,
    additionalText2: additionalText2,
    itemCode2: value2,
    footerText2: footerText2,
    headerStyle1: headerStyle1,
    footerStyle1: footerStyle1,
    lineStyle1: lineStyle1,
    headerStyle2: headerStyle2,
    footerStyle2: footerStyle2,
    lineStyle2: lineStyle2,
    itemStyle1: itemStyle1,
    description: description,
    descriptionTextStyle: descriptionTextStyle,
    offerPrice: offerPrice,
    description2: description2,
    offerPrice2: offerPrice2,
    grossWeight: grossWeight,
    wastage: wastage,
    netWeight: netWeight,
    purity: purity,
    huid: huid,
    grossWeight2: grossWeight2,
    wastage2: wastage2,
    netWeight2: netWeight2,
    purity2: purity2,
    huid2: huid2
  });
};

const appendTable = (tableBody, style) => {
  contentBuilder.push({
    type: 'table',
    style: style,
    tableBody: tableBody,
    tableBodyStyle: 'border: none'
  });
};

export const BarcodePrinter = (data, size, type, customData) => {
  contentBuilder = [];

  const printDefaultContent = () => {
    var divStyle =
      size === 1
        ? 'width:377px;height:188.9px;text-align:center;font-family:Helvetica, sans-serif;margin:2px;'
        : size === 2
        ? 'width:188.9px;text-align:center;font-family:Helvetica, sans-serif;'
        : size === 2.2
        ? 'width:188.9px;font-family:Helvetica, sans-serif;text-align:center;'
        : size === 2.3
        ? 'width:196px;height:56px;font-family:Helvetica, sans-serif;text-align:center;margin:1px;'
        : size === 2.4
        ? 'width:321px;height:151px;font-family:Helvetica, sans-serif;text-align:center;margin:1px;'
        : 'width:94px;heigth:56.6px;text-align:center;font-family:Helvetica, sans-serif;margin:2px;';
    var width = size === 1 ? 2 : 1;
    var height = size === 1.1 || size === 2.1 ? 23 : size === 1 ? 65 : 30;

    // barcode
    data.forEach((option, dataIndex) => {
      var value1 = '';
      var header1 = '';
      var addition1 = '';
      var footer1 = '';
      var value2 = '';
      var header2 = '';
      var addition2 = '';
      var footer2 = '';
      var headerStyle1 = '';
      var headerStyle2 = '';
      var footerStyle1 = '';
      var footerStyle2 = '';
      var lineStyle1 = '';
      var lineStyle2 = '';
      var itemStyle1 = '';
      var description = '';
      var descriptionTextStyle = '';
      var offerPrice = '';
      var description2 = '';
      var offerPrice2 = '';
      var grossWeight = '';
      var netWeight = '';
      var wastage = '';
      var purity = '';
      var huid = '';
      var grossWeight2 = '';
      var netWeight2 = '';
      var wastage2 = '';
      var purity2 = '';
      var huid2 = '';
      option.forEach((ele, index) => {
        if (size !== 1) {
          // ele.header = ele.header;
          // ele.header.length > 12 && ele.headerVal === 'business_name'
          //   ? `${ele.header.substring(0, 12)}...`
          //   : ele.header;
          ele.line =
            ele.line.length > 12 && ele.lineVal === 'business_name'
              ? `${ele.line.substring(0, 12)}...`
              : ele.line;
          ele.footer =
            ele.footer.length > 12 && ele.footerVal === 'business_name'
              ? `${ele.footer.substring(0, 12)}...`
              : ele.footer;
        }
        if (size === 2) {
          headerStyle1 = `margin-bottom: 1px;font-size:${
            ele.headerVal === 'sale_price' ? 12 : 11
          }px;`;
          headerStyle2 = `margin-bottom: 1px;font-size:${
            ele.headerVal === 'sale_price' ? 12 : 11
          }px;`;
          lineStyle1 = `margin-top: -8px;font-size:${
            ele.lineVal === 'sale_price' ? 12 : 10
          }px;`;
          lineStyle2 = `margin-top: -8px;font-size:${
            ele.lineVal === 'sale_price' ? 12 : 10
          }px;`;
          footerStyle1 = `margin-top: -10px;font-size:${
            ele.footerVal === 'sale_price' ? 12 : 10
          }px;`;
          footerStyle2 = `margin-top: -10px;font-size:${
            ele.footerVal === 'sale_price' ? 12 : 10
          }px;`;
          itemStyle1 = `margin-top: -3px;font-size:12px`;
          if (ele.headerVal && !ele.lineVal && !ele.footerVal) {
            headerStyle1 = `margin-bottom: 1px;font-size:${
              ele.headerVal === 'sale_price'
                ? ele.headerVal.length > 18
                  ? 11
                  : 12
                : 11
            }px;
                      font-weight:bold;`;
            headerStyle2 = `margin-bottom: 1px;font-size:${
              ele.headerVal === 'sale_price'
                ? ele.headerVal.length > 18
                  ? 11
                  : 12
                : 11
            }px;
                      font-weight:bold;`;
          }
          if (!ele.headerVal && ele.lineVal && !ele.footerVal) {
            lineStyle1 = `margin-top: -8px;font-size:${
              ele.lineVal === 'sale_price'
                ? ele.headerVal.length > 18
                  ? 11
                  : 12
                : 11
            }px;
                      font-weight:bold;`;
            lineStyle2 = `margin-top: -8px;font-size:${
              ele.lineVal === 'sale_price'
                ? ele.headerVal.length > 18
                  ? 11
                  : 12
                : 11
            }px;
                      font-weight:bold;`;
          }
          if (!ele.headerVal && !ele.lineVal && ele.footerVal) {
            footerStyle1 = `margin-top: -10px;font-size:${
              ele.footerVal === 'sale_price'
                ? ele.headerVal.length > 18
                  ? 11
                  : 12
                : 11
            }px;
                      font-weight:bold;`;
            footerStyle2 = `margin-top: -10px;font-size:${
              ele.footerVal === 'sale_price'
                ? ele.headerVal.length > 18
                  ? 11
                  : 12
                : 11
            }px;
                      font-weight:bold;`;
          }
        }

        if (size === 2.2 || size === 2) {
          headerStyle1 = `margin-bottom: 1px;font-weight:bold;font-size:${
            ele.headerVal === 'sale_price' ? 12 : 11
          }px;`;
          headerStyle2 = `margin-bottom: 1px;font-weight:bold;font-size:${
            ele.headerVal === 'sale_price' ? 12 : 11
          }px;`;
          lineStyle1 = `margin-top: -8px;font-size:${
            ele.lineVal === 'sale_price' ? 12 : 12
          }px;`;
          lineStyle2 = `margin-top: -8px;font-size:${
            ele.lineVal === 'sale_price' ? 12 : 12
          }px;`;
          footerStyle1 = `margin-top: -10px;font-weight:bold;font-size:${
            ele.footerVal === 'sale_price' ? 12 : 10
          }px;`;
          footerStyle2 = `margin-top: -10px;font-weight:bold;font-size:${
            ele.footerVal === 'sale_price' ? 12 : 10
          }px;`;
          itemStyle1 = `margin-top: -3px;font-size:12px`;     
          descriptionTextStyle = `margin-top:-4px;margin-bottom:-1px;font-size:12px`;
        }

        if (size === 2.3) {
          headerStyle1 = `margin-bottom: 1px;font-weight:bold;font-size:12px;`;
          itemStyle1 = `margin-top: -3px;font-size:12px`;    
        }

        if (size === 2.4) {
          headerStyle1 = `margin-bottom: 1px;font-weight:bold;font-size:12px;`;
          headerStyle2 = `margin-bottom: 1px;font-weight:bold;font-size:12px;`;
          itemStyle1 = `margin-top: -3px;font-size:12px`;    
        }

        if (size === 1) {
          headerStyle1 = `margin-bottom: 1px;font-size:${
            ele.headerVal === 'sale_price'
              ? ele.headerVal.length > 18
                ? 18
                : 19
              : 18
          }px;`;
          headerStyle2 = `margin-bottom: 1px;font-size:${
            ele.headerVal === 'sale_price'
              ? ele.headerVal.length > 18
                ? 18
                : 19
              : 18
          }px;`;
          itemStyle1 = `margin-top: -3px;font-size:17px`;
          lineStyle1 = `margin-top: -10px;font-size:${
            ele.lineVal === 'sale_price'
              ? ele.headerVal.length > 18
                ? 18
                : 19
              : 18
          }px;`;
          lineStyle2 = `margin-top: -10px;font-size:${
            ele.lineVal === 'sale_price'
              ? ele.headerVal.length > 18
                ? 18
                : 19
              : 18
          }px;`;
          footerStyle1 = `margin-top: -12px;font-size:${
            ele.footerVal === 'sale_price'
              ? ele.headerVal.length > 18
                ? 18
                : 19
              : 18
          }px;`;
          footerStyle2 = `margin-top: -12px;font-size:${
            ele.footerVal === 'sale_price'
              ? ele.headerVal.length > 18
                ? 18
                : 19
              : 18
          }px;`;
          if (ele.headerVal && !ele.lineVal && !ele.footerVal) {
            headerStyle1 = `margin-bottom: 1px;font-size:${
              ele.headerVal === 'sale_price'
                ? ele.headerVal.length > 18
                  ? 18
                  : 19
                : 18
            }px;font-weight:bold;`;
            headerStyle2 = `margin-bottom: 1px;font-size:${
              ele.headerVal === 'sale_price'
                ? ele.headerVal.length > 18
                  ? 18
                  : 19
                : 18
            }px;font-weight:bold;`;
          }
          if (!ele.headerVal && ele.lineVal && !ele.footerVal) {
            lineStyle1 = `margin-top: -10px;font-size:${
              ele.lineVal === 'sale_price'
                ? ele.headerVal.length > 18
                  ? 18
                  : 19
                : 18
            }px;font-weight:bold;`;
            lineStyle2 = `margin-top: -10px;font-size:${
              ele.lineVal === 'sale_price'
                ? ele.headerVal.length > 18
                  ? 18
                  : 19
                : 18
            }px;font-weight:bold;`;
          }
          if (!ele.headerVal && !ele.lineVal && ele.footerVal) {
            footerStyle1 = `margin-top: -12px;font-size:${
              ele.footerVal === 'sale_price'
                ? ele.headerVal.length > 18
                  ? 18
                  : 19
                : 18
            }px;font-weight:bold;`;
            footerStyle2 = `margin-top: -12px;font-size:${
              ele.footerVal === 'sale_price'
                ? ele.headerVal.length > 18
                  ? 18
                  : 19
                : 18
            }px;font-weight:bold;`;
          }
        }
        if (size === 2.1) {
          headerStyle1 = `margin-bottom: 1px;font-size:${
            ele.headerVal === 'sale_price' ? 'x-small' : 'x-small'
          };font-weight:600;`;
          headerStyle2 = `margin-bottom: 1px;font-size:${
            ele.headerVal === 'sale_price' ? 'x-small' : 'x-small'
          };font-weight:600;`;
          itemStyle1 = `margin-top: -3px;font-size:6px`;
          lineStyle1 = `margin-top: -7px;font-size:${
            ele.lineVal === 'sale_price' ? 'x-small' : 'x-small'
          };font-weight:600;`;
          lineStyle2 = `margin-top: -7px;font-size:${
            ele.lineVal === 'sale_price' ? 'x-small' : 'x-small'
          };font-weight:600;`;
          footerStyle1 = `margin-top: -8px;font-size:${
            ele.footerVal === 'sale_price' ? 'x-small' : 'x-small'
          };font-weight:600;`;
          footerStyle2 = `margin-top: -8px;font-size:${
            ele.footerVal === 'sale_price' ? 'x-small' : 'x-small'
          };font-weight:600;`;

          if (ele.headerVal && !ele.lineVal && !ele.footerVal) {
            headerStyle1 = `margin-bottom: 1px;font-size:${
              ele.headerVal === 'sale_price' ? 7 : 6
            }px;font-weight:600;`;
            headerStyle2 = `margin-bottom: 1px;font-size:${
              ele.headerVal === 'sale_price' ? 7 : 6
            }px;font-weight:600;`;
          }
          if (!ele.headerVal && ele.lineVal && !ele.footerVal) {
            lineStyle1 = `margin-top: -7px;font-size:${
              ele.lineVal === 'sale_price' ? 7 : 6
            }px;font-weight:600;`;
            lineStyle2 = `margin-top: -7px;font-size:${
              ele.lineVal === 'sale_price' ? 7 : 6
            }px;font-weight:600;`;
          }
          if (!ele.headerVal && !ele.lineVal && ele.footerVal) {
            footerStyle1 = `margin-top: -8px;font-size:${
              ele.footerVal === 'sale_price' ? 7 : 6
            }px;font-weight:600;`;
            footerStyle2 = `margin-top: -8px;font-size:${
              ele.footerVal === 'sale_price' ? 7 : 6
            }px;font-weight:600;`;
          }
        }
        if (size === 1.1) {
          headerStyle1 = `margin-bottom: 1px;font-size:${
            ele.headerVal === 'sale_price' ? 7 : 6
          }px;font-weight:bold;`;
          headerStyle2 = `margin-bottom: 1px;font-size:${
            ele.headerVal === 'sale_price' ? 7 : 6
          }px;font-weight:bold;`;
          lineStyle1 = `margin-top: -7px;font-size:${
            ele.lineVal === 'sale_price' ? 7 : 6
          }px;font-weight:bold;`;
          lineStyle2 = `margin-top: -7px;font-size:${
            ele.lineVal === 'sale_price' ? 7 : 6
          }px;font-weight:bold;`;
          footerStyle1 = `margin-top: -7px;font-size:${
            ele.footerVal === 'sale_price' ? 7 : 6
          }px;font-weight:bold;`;
          footerStyle2 = `margin-top: -7px;font-size:${
            ele.footerVal === 'sale_price' ? 7 : 6
          }px;font-weight:bold;`;
          if (ele.headerVal && !ele.lineVal && !ele.footerVal) {
            headerStyle1 = `margin-bottom: 1px;font-size:${
              ele.headerVal === 'sale_price'
                ? ele.headerVal.length > 18
                  ? 7
                  : 8
                : 7
            }px;font-weight:bold;`;
            headerStyle2 = `margin-bottom: 1px;font-size:${
              ele.headerVal === 'sale_price'
                ? ele.headerVal.length > 18
                  ? 7
                  : 8
                : 7
            }px;font-weight:bold;`;
          }
          if (!ele.headerVal && ele.lineVal && !ele.footerVal) {
            lineStyle1 = `margin-top: -7px;font-size:${
              ele.lineVal === 'sale_price'
                ? ele.headerVal.length > 18
                  ? 7
                  : 8
                : 7
            }px;font-weight:bold;`;
            lineStyle2 = `margin-top: -7px;font-size:${
              ele.lineVal === 'sale_price'
                ? ele.headerVal.length > 18
                  ? 7
                  : 8
                : 7
            }px;font-weight:bold;`;
          }
          if (!ele.headerVal && !ele.lineVal && ele.footerVal) {
            footerStyle1 = `margin-top: -8px;font-size:${
              ele.footerVal === 'sale_price'
                ? ele.headerVal.length > 18
                  ? 7
                  : 8
                : 7
            }px;font-weight:bold;`;
            footerStyle2 = `margin-top: -8px;font-size:${
              ele.footerVal === 'sale_price'
                ? ele.headerVal.length > 18
                  ? 7
                  : 8
                : 7
            }px;font-weight:bold;`;
          }
        }
        if (index === 0) {
          value1 = ele.barcode;
          header1 = ele.header;
          addition1 = ele.line;

          const inputString = ele.footer;
          const numbers = inputString.match(/\d+/g);

          if (numbers) {
            if (numbers.length > 1) {
              footer1 = numbers[0];
              offerPrice = numbers[1];
            } else {
              footer1 = numbers[0];
            }
          }

          description = ele.description;
          grossWeight = 'G.WT: ' + parseFloat(ele.grossWeight).toFixed(3);
          wastage = 'L.WT: ' + parseFloat(ele.stoneWeight).toFixed(3);
          netWeight = 'N.WT: ' + parseFloat(ele.netWeight).toFixed(3);
          purity = 'Purity: ' + ele.purity;
          huid = 'HUID: ' + ele.hallmarkUniqueId;
        }

        if (index === 1) {
          value2 = ele.barcode;
          header2 = ele.header;
          addition2 = ele.line;

          const inputString = ele.footer;
          const numbers = inputString.match(/\d+/g);

          if (numbers) {
            if (numbers.length > 1) {
              footer2 = numbers[0];
              offerPrice2 = numbers[1];
            } else {
              footer2 = numbers[0];
            }
          }
          description2 = ele.description;
          grossWeight2 = 'G.WT: ' + parseFloat(ele.grossWeight).toFixed(3);
          wastage2 = 'L.WT: ' + parseFloat(ele.stoneWeight).toFixed(3);
          netWeight2 = 'N.WT: ' + parseFloat(ele.netWeight).toFixed(3);
          purity2 = 'Purity: ' + ele.purity;
          huid2 = 'HUID: ' + ele.hallmarkUniqueId;
        }

        if (index === option.length - 1) {
          if (option.length === 1 && size === 1.1) {
            appendDoubleBarcode(
              'oneInchBarCode',
              value1,
              value2,
              header1,
              addition1,
              footer1,
              header2,
              addition2,
              footer2,
              height,
              width,
              divStyle,
              {
                'font-kerning': 'normal',
                'font-weight': '400',
                'font-style': 'normal',
                'font-size': '16px',
                'font-family': 'sans-serif'
              },
              headerStyle1,
              headerStyle2,
              footerStyle1,
              footerStyle2,
              lineStyle1,
              lineStyle2,
              itemStyle1
            );
          }

          if (option.length === 1 && (size === 1)) {
            appendDoubleBarcode(
              'SingleBarCode',
              value1,
              value2,
              header1,
              addition1,
              footer1,
              header2,
              addition2,
              footer2,
              height,
              width,
              divStyle,
              {
                'font-kerning': 'normal',
                'font-weight': '400',
                'font-style': 'normal',
                'font-size': '16px',
                'font-family': 'sans-serif'
              },
              headerStyle1,
              headerStyle2,
              footerStyle1,
              footerStyle2,
              lineStyle1,
              lineStyle2,
              itemStyle1
            );
          }
          if (option.length === 1 && size === 2.2) {
            appendDoubleBarcode(
              'SingleBarCodeSize50By50',
              value1,
              value2,
              header1,
              addition1,
              footer1,
              header2,
              addition2,
              footer2,
              height,
              width,
              divStyle,
              {
                'font-kerning': 'normal',
                'font-weight': '400',
                'font-style': 'normal',
                'font-size': '16px',
                'font-family': 'sans-serif'
              },
              headerStyle1,
              headerStyle2,
              footerStyle1,
              footerStyle2,
              lineStyle1,
              lineStyle2,
              itemStyle1,
              description,
              descriptionTextStyle
            );
          }

          if (option.length === 2 && size === 2) {
            appendDoubleBarcode(
              'DoubleBarCodeSize50By25',
              value1,
              value2,
              header1,
              addition1,
              footer1,
              header2,
              addition2,
              footer2,
              height,
              width,
              divStyle,
              {
                'font-kerning': 'normal',
                'font-weight': '400',
                'font-style': 'normal',
                'font-size': '16px',
                'font-family': 'sans-serif'
              },
              headerStyle1,
              headerStyle2,
              footerStyle1,
              footerStyle2,
              lineStyle1,
              lineStyle2,
              itemStyle1,
              description,
              descriptionTextStyle,
              offerPrice,
              description2,
              offerPrice2
            );
          }

          if (option.length === 2 && size === 2.2) {
            appendDoubleBarcode(
              'DoubleBarCodeSize50By50',
              value1,
              value2,
              header1,
              addition1,
              footer1,
              header2,
              addition2,
              footer2,
              height,
              width,
              divStyle,
              {
                'font-kerning': 'normal',
                'font-weight': '400',
                'font-style': 'normal',
                'font-size': '16px',
                'font-family': 'sans-serif'
              },
              headerStyle1,
              headerStyle2,
              footerStyle1,
              footerStyle2,
              lineStyle1,
              lineStyle2,
              itemStyle1,
              description,
              descriptionTextStyle,
              offerPrice,
              description2,
              offerPrice2
            );
          }

          if (option.length === 1 && size === 2.3) {
            appendDoubleBarcode(
              'JQRSize50By15',
              value1,
              value2,
              header1,
              addition1,
              footer1,
              header2,
              addition2,
              footer2,
              height,
              width,
              divStyle,
              {
                'font-kerning': 'normal',
                'font-weight': '400',
                'font-style': 'normal',
                'font-size': '16px',
                'font-family': 'sans-serif'
              },
              headerStyle1,
              headerStyle2,
              footerStyle1,
              footerStyle2,
              lineStyle1,
              lineStyle2,
              itemStyle1,
              description,
              descriptionTextStyle,
              offerPrice,
              description2,
              offerPrice2,
              grossWeight,
              wastage,
              netWeight,
              purity,
              huid
            );
          }

          if (option.length === 2 && size === 2.4) {
            appendDoubleBarcode(
              'JQRSize85By40',
              value1,
              value2,
              header1,
              addition1,
              footer1,
              header2,
              addition2,
              footer2,
              height,
              width,
              divStyle,
              {
                'font-kerning': 'normal',
                'font-weight': '400',
                'font-style': 'normal',
                'font-size': '16px',
                'font-family': 'sans-serif'
              },
              headerStyle1,
              headerStyle2,
              footerStyle1,
              footerStyle2,
              lineStyle1,
              lineStyle2,
              itemStyle1,
              description,
              descriptionTextStyle,
              offerPrice,
              description2,
              offerPrice2,
              grossWeight,
              wastage,
              netWeight,
              purity,
              huid,
              grossWeight2,
              wastage2,
              netWeight2,
              purity2,
              huid2
            );
          }

          if (option.length === 1 && size === 2.1) {
            appendDoubleBarcode(
              'oneInchDoubleSingleBarCode',
              value1,
              value2,
              header1,
              addition1,
              footer1,
              header2,
              addition2,
              footer2,
              height,
              width,
              divStyle,
              {
                'font-kerning': 'normal',
                'font-weight': '400',
                'font-style': 'normal',
                'font-size': '16px',
                'font-family': 'sans-serif'
              },
              headerStyle1,
              headerStyle2,
              footerStyle1,
              footerStyle2,
              lineStyle1,
              lineStyle2,
              itemStyle1
            );
          }
          if (option.length === 2 && size === 2.1) {
            appendDoubleBarcode(
              'oneInchDoubleBarCode',
              value1,
              value2,
              header1,
              addition1,
              footer1,
              header2,
              addition2,
              footer2,
              height,
              width,
              divStyle,
              {
                'font-kerning': 'normal',
                'font-weight': '400',
                'font-style': 'normal',
                'font-size': '16px',
                'font-family': 'sans-serif'
              },
              headerStyle1,
              headerStyle2,
              footerStyle1,
              footerStyle2,
              lineStyle1,
              lineStyle2,
              itemStyle1
            );
          }
        }
      });
    });
  };

  const printCustomContent = () => {
    var mainDivStyle = `font-family: Helvetica, sans-serif;
                        width: ${
                          customData.paperWidth > 0
                            ? `${Number(customData.paperWidth) + 60}px`
                            : '100%'
                        };`;

    // var divStyle = `width:${customData.customWidth}px;
    //                 display:inline-block;
    //                 heigth:${customData.customHeight}px;
    //                 position:relative;
    //                 overflow:hidden;
    //                 margin:5px;
    //                 text-align:center;`;

    var divStyle = `width:${customData.customWidth}px;
                    height:${customData.customHeight}px;
                    overflow:hidden;
                    position:relative;
                    display:inline-block;
                    margin:16px;
                    text-align:center;
                    font-family: Helvetica, sans-serif;`;

    var css = `text-align:center;width:${
      customData.customWidth <= 300 ? '80%' : '80%'
    };`;

    var innerDivStyle = `margin: ${customData.marginTop}px ${customData.marginRight}px ${customData.marginBottom}px ${customData.marginLeft}px;text-align:center;`;
    // var innerDivStyle = `text-align:center;`
    var width =
      customData.customWidth <= 100
        ? 1
        : customData.customWidth > 100 && customData.customWidth <= 200
        ? 1
        : customData.customWidth > 200 && customData.customWidth <= 300
        ? 2
        : customData.customWidth > 300 && customData.customWidth <= 400
        ? 3
        : customData.customWidth > 400 && customData.customWidth <= 500
        ? 4
        : customData.customWidth > 500 && customData.customWidth <= 800
        ? 5
        : customData.customWidth > 800 && customData.customWidth <= 1000
        ? 6
        : 7;

    var height =
      customData.customHeight <= 70
        ? 15
        : customData.customHeight > 70 && customData.customHeight <= 100
        ? 24
        : customData.customHeight > 100 && customData.customHeight <= 200
        ? 33
        : customData.customHeight > 200 && customData.customHeight <= 300
        ? 43
        : 60;

    var subArray = [];
    var arrayIndex = 0;
    let arrayLength = 2;
    var arrayList = [];

    data.forEach((res, index) => {
      if (subArray.length <= arrayLength) {
        subArray = subArray.concat(res);
        arrayList[arrayIndex] = subArray;
      }
      if (subArray.length === arrayLength) {
        subArray = [];
        arrayIndex = arrayIndex + 1;
      }

      if (index === data.length - 1) {
        arrayList.forEach((ele) => {
          var value1 = '';
          var header1 = '';
          var addition1 = '';
          var footer1 = '';
          var value2 = '';
          var header2 = '';
          var addition2 = '';
          var footer2 = '';
          var headerStyle1 = '';
          var headerStyle2 = '';
          var footerStyle1 = '';
          var footerStyle2 = '';
          var lineStyle1 = '';
          var lineStyle2 = '';
          var itemStyle1 = '';

          value1 = ele[0].barcode;
          header1 = ele[0].header;
          footer1 = ele[0].footer;
          addition1 = ele[0].line;

          if (ele.length === 2) {
            headerStyle1 = `margin-bottom: 1px;font-size:${
              customData.headerFont
            }px;font-weight:${
              customData.headerWeight ? 'bold' : 500
            };font-family: Helvetica, sans-serif;`;
            headerStyle2 = `margin-bottom: 1px;font-size:${
              customData.headerFont
            }px;font-weight:${
              customData.headerWeight ? 'bold' : 500
            };font-family: Helvetica, sans-serif;`;
            lineStyle1 = `margin-top: ${
              customData.customHeight < 100 ? -8 : -13
            }px;font-size:${customData.additionalFont}px;font-weight:${
              customData.additionalWeight ? 'bold' : 500
            };font-family: Helvetica, sans-serif;`;
            lineStyle2 = `margin-top: ${
              customData.customHeight < 100 ? -8 : -13
            }px;font-size:${customData.additionalFont}px;font-weight:${
              customData.additionalWeight ? 'bold' : 500
            };font-family: Helvetica, sans-serif;`;
            footerStyle1 = `margin-top: ${
              customData.customHeight < 100 ? -7 : -17
            }px;font-size:${customData.footerFont}px;font-weight:${
              customData.footerWeight ? 'bold' : 500
            };font-family: Helvetica, sans-serif;`;
            footerStyle2 = `margin-top: ${
              customData.customHeight < 100 ? -7 : -17
            }px;font-size:${customData.footerFont}px;font-weight:${
              customData.footerWeight ? 'bold' : 500
            };font-family: Helvetica, sans-serif;`;
            itemStyle1 = `margin-top: -3px;margin-bottom:6px;font-size:${
              customData.itemCode
            }px;font-weight:${
              customData.itemcodeWeight ? 'bold' : 500
            };font-family: Helvetica, sans-serif;`;

            value2 = ele[1].barcode;
            header2 = ele[1].header;
            footer2 = ele[1].footer;
            addition2 = ele[1].line;

            headerStyle1 =
              header1 && footer1 && addition1 ? headerStyle1 : 'display:none';
            headerStyle2 =
              header2 && footer2 && addition2 ? headerStyle2 : 'display:none';

            appendDoubleBarcode(
              'customDoubleBarcode',
              value1,
              value2,
              header1,
              addition1,
              footer1,
              header2,
              addition2,
              footer2,
              height,
              width,
              {
                divStyle: divStyle,
                mainDivStyle: mainDivStyle,
                innerDivStyle: innerDivStyle
              },
              css,
              headerStyle1,
              headerStyle2,
              footerStyle1,
              footerStyle2,
              lineStyle1,
              lineStyle2,
              itemStyle1
            );
          }
          if (ele.length === 1) {
            headerStyle1 = `margin-bottom: 1px;font-size:${
              customData.headerFont
            }px;font-weight:${
              customData.headerWeight ? 'bold' : 500
            };font-family: Helvetica, sans-serif;`;
            lineStyle1 = `margin-top: ${
              customData.customHeight < 100 ? -8 : -13
            }px;font-size:${customData.additionalFont}px;font-weight:${
              customData.additionalWeight ? 'bold' : 500
            };font-family: Helvetica, sans-serif;`;
            footerStyle1 = `margin-top: ${
              customData.customHeight < 100 ? -7 : -17
            }px;font-size:${customData.footerFont}px;font-weight:${
              customData.footerWeight ? 'bold' : 500
            };font-family: Helvetica, sans-serif;`;
            itemStyle1 = `margin-top: -3px;margin-bottom:6px;font-size:${
              customData.itemCode
            }px;font-weight:${
              customData.itemcodeWeight ? 'bold' : 500
            };font-family: Helvetica, sans-serif;`;
            headerStyle1 =
              header1 && footer1 && addition1 ? headerStyle1 : 'display:none';

            appendDoubleBarcode(
              'customSingleBarcode',
              value1,
              value2,
              header1,
              addition1,
              footer1,
              header2,
              addition2,
              footer2,
              height,
              width,
              {
                divStyle: divStyle,
                mainDivStyle: mainDivStyle,
                innerDivStyle: innerDivStyle
              },
              css,
              headerStyle1,
              headerStyle2,
              footerStyle1,
              footerStyle2,
              lineStyle1,
              lineStyle2,
              itemStyle1
            );
          }
        });
      }
    });
    console.log(contentBuilder);
  };

  const printDefaultContent3 = () => {
    var mainDivStyle = `font-family: Helvetica, sans-serif;
                        width: 100%'};`;

    var divStyle = `width:64mm;
                    height:34mm;
                    overflow:hidden;
                    position:relative;
                    display:inline-block;
                    margin:16px;
                    font-family: Helvetica, sans-serif;`;

    var css = `width:80%;`;

    var innerDivStyle = `margin: 5px;`;
    // var innerDivStyle = `text-align:center;`
    /* var width = customData.customWidth <= 100 
              ? 1
              : customData.customWidth > 100 && customData.customWidth <= 200 
              ? 1
              : customData.customWidth > 200 && customData.customWidth <= 300 
              ? 2 
              : customData.customWidth > 300 && customData.customWidth <= 400
              ? 3
              : customData.customWidth > 400 && customData.customWidth <= 500
              ? 4
              : customData.customWidth > 500 && customData.customWidth <= 800
              ? 5
              : customData.customWidth > 800 && customData.customWidth <= 1000
              ? 6
              : 7; */
    var width = 2;

    var height = 15;

    /* var height = customData.customHeight <= 70 
                ? 15
                : customData.customHeight > 70 && customData.customHeight <= 100
                ? 24
                : customData.customHeight > 100 && customData.customHeight <= 200 
                ? 33
                : customData.customHeight > 200 && customData.customHeight <= 300 
                ? 43               
                : 60; */

    var subArray = [];
    var arrayIndex = 0;
    let arrayLength = size;
    var arrayList = [];

    data.forEach((res, index) => {
      if (subArray.length <= arrayLength) {
        subArray = subArray.concat(res);
        arrayList[arrayIndex] = subArray;
      }
      if (subArray.length === arrayLength) {
        subArray = [];
        arrayIndex = arrayIndex + 1;
      }
      if (index === data.length - 1) {
        arrayList.forEach((ele) => {
          var value1 = '';
          var header1 = '';
          var addition1 = '';
          var footer1 = '';
          var value2 = '';
          var header2 = '';
          var addition2 = '';
          var footer2 = '';
          var headerStyle1 = '';
          var headerStyle2 = '';
          var footerStyle1 = '';
          var footerStyle2 = '';
          var lineStyle1 = '';
          var lineStyle2 = '';
          var itemStyle1 = '';

          value1 = ele[0].barcode;
          header1 = ele[0].header;
          footer1 = ele[0].footer;
          addition1 = ele[0].line;

          /* if(ele.length === 2){
            headerStyle1 = `margin-bottom: 1px;font-size:12px;font-weight:'bold'};font-family: Helvetica, sans-serif;`;
            headerStyle2 = `margin-bottom: 1px;font-size:10px;font-weight:'bold'};font-family: Helvetica, sans-serif;`;
            lineStyle1   = `margin-top: -8px;font-size:10px;font-weight:'bold'};font-family: Helvetica, sans-serif;`;
            lineStyle2   = `margin-top: -8px;font-size:10px;font-weight:'bold'};font-family: Helvetica, sans-serif;`;
            footerStyle1 = `margin-top: -7px;font-size:10px;font-weight:'bold'};font-family: Helvetica, sans-serif;`;
            footerStyle2 = `margin-top: -7px;font-size:10px;font-weight:'bold'};font-family: Helvetica, sans-serif;`;
            itemStyle1   = `margin-top: -3px;margin-bottom:6px;font-size:10px;font-weight:'bold'};font-family: Helvetica, sans-serif;`;
           
            value2 = ele[1].barcode;
            header2 = ele[1].header;
            footer2 = ele[1].footer;
            addition2 = ele[1].line;

            headerStyle1 = header1 && footer1 && addition1 ? headerStyle1 : 'display:none';
            headerStyle2 = header2 && footer2 && addition2 ? headerStyle2 : 'display:none'; 
           
            appendDoubleBarcode( 'customDoubleBarcode',
            value1,
            value2,
            header1,
            addition1,
            footer1,
            header2,
            addition2,
            footer2,
            height,
            width,
            {divStyle:divStyle,mainDivStyle:mainDivStyle,innerDivStyle:innerDivStyle},
            css,
           headerStyle1,
           headerStyle2,
           footerStyle1,
           footerStyle2,
           lineStyle1,
           lineStyle2,
           itemStyle1,
           )

          } */
          //if(ele.length === 1){

          headerStyle1 = `margin-bottom: 1px;font-size:12px;font-weight:'bold'};font-family: Helvetica, sans-serif;`;
          lineStyle1 = `margin-top: -8px;font-size:10px;font-weight:'bold'};font-family: Helvetica, sans-serif;`;
          footerStyle1 = `margin-top: -7px;font-size:10px;font-weight:'bold'};font-family: Helvetica, sans-serif;`;
          itemStyle1 = `margin-top: -3px;margin-bottom:6px;font-size:10px;font-weight:'bold'};font-family: Helvetica, sans-serif;`;
          headerStyle1 =
            header1 && footer1 && addition1 ? headerStyle1 : 'display:none';

          appendDoubleBarcode(
            'customSingleBarcode',
            value1,
            value2,
            header1,
            addition1,
            footer1,
            header2,
            addition2,
            footer2,
            height,
            width,
            {
              divStyle: divStyle,
              mainDivStyle: mainDivStyle,
              innerDivStyle: innerDivStyle
            },
            css,
            headerStyle1,
            headerStyle2,
            footerStyle1,
            footerStyle2,
            lineStyle1,
            lineStyle2,
            itemStyle1
          );
          //}
        });
      }
    });
    console.log(contentBuilder);
  };

  if (type === 'default') {
    printDefaultContent();
  } else {
    printCustomContent();
  }

  return contentBuilder;
};