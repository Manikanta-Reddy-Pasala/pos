import * as Bd from '../../../components/SelectedBusiness';
import * as ExcelJS from 'exceljs';
import * as unitHelper from 'src/components/Helpers/ProductUnitHelper';
import { getProductData } from 'src/components/Helpers/dbQueries/businessproduct';

const download = (db, cData) => {
  // Create a workbook and add a worksheet
  const workbook = new ExcelJS.Workbook();
  const unitsArray = unitHelper.getUnitNames();
  let size = cData.level3Categories.length;
  let categoriesMap = new Map();
  cData.level3Categories.forEach((element, index) => {
    const worksheet = workbook.addWorksheet(element.displayName);
  });
  // populate master list data worksheet
  let worksheetMasterData = workbook.addWorksheet('Units');
  for (var i = 0; i < unitsArray.length; i++) {
    worksheetMasterData.addRow([unitsArray[i]]);
  }
  cData.level3Categories.forEach(async (element, index) => {
    const name = element.displayName;

    const worksheet = workbook.getWorksheet(name);

    // Add data to the worksheet
    if (String(localStorage.getItem('isJewellery')).toLowerCase() === 'true') {
      worksheet.columns = [
        { header: 'Id', key: 'id', width: 20 },
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Type', key: 'productType', width: 10 },
        { header: 'Part Number', key: 'partNumber', width: 15 },
        { header: 'Model No', key: 'modelNo', width: 15 },
        { header: 'Type', key: 'productType', width: 10 },
        { header: 'Hsn', key: 'hsn', width: 10 },
        { header: 'Mrp', key: 'mrp', width: 10 },
        {
          header: 'Purchase Price',
          key: 'purchaseprice',
          width: 15
        },
        {
          header: 'Purchase Disc(%)',
          key: 'purchasepricedisc',
          width: 15
        },
        {
          header: 'Purchase TAX TYPE',
          key: 'purchasetaxtype',
          width: 15
        },
        {
          header: 'Purchase TAX',
          key: 'purchasetax',
          width: 15
        },
        {
          header: 'Purchase Tax Included(Y/N)',
          key: 'purchasestaxincluded',
          width: 20
        },
        {
          header: 'Sale Price',
          key: 'sellingprice',
          width: 15
        },
        {
          header: 'Sale Disc(%)',
          key: 'sellingpricedisc',
          width: 15
        },
        {
          header: 'Sale TAX TYPE',
          key: 'saletaxtype',
          width: 15
        },
        { header: 'Sale TAX', key: 'saletax', width: 15 },
        {
          header: 'Sale Tax Included(Y/N)',
          key: 'saletaxincluded',
          width: 20
        },
        { header: 'POS(Y/N)', key: 'pos', width: 10 },
        { header: 'Online(Y/N)', key: 'online', width: 10 },
        {
          header: 'Opening Stock',
          key: 'openingstock',
          width: 15
        },
        {
          header: 'Stock Reorder Qty',
          key: 'stockreorder',
          width: 15
        },
        {
          header: 'Primary Unit',
          key: 'primaryunit',
          width: 15
        },
        {
          header: 'Secondary Unit',
          key: 'secondaryunit',
          width: 15
        },
        { header: 'Unit Qty', key: 'unitqty', width: 15 },
        { header: 'Brand', key: 'brand', width: 10 },
        {
          header: 'Short Cut Product Code',
          key: 'shortcut',
          width: 15
        },
        { header: 'SKU', key: 'sku', width: 15 },
        { header: 'Barcode', key: 'barcode', width: 15 },
        {
          header: 'Warehouse',
          key: 'warehouse',
          width: 15
        },
        { header: 'Rack Number', key: 'rackno', width: 15 },
        {
          header: 'Product Description',
          key: 'proddesc',
          width: 20
        },
        { header: 'Gross Weight/g', key: 'grossweight', width: 15 },
        { header: 'Stone Weight/g', key: 'stoneweight', width: 15 },
        { header: 'Net Weight/g', key: 'netweight', width: 15 },
        { header: 'Stone Charge', key: 'stonecharge', width: 15 },
        { header: 'Making Charge/g', key: 'makingcharge', width: 15 },
        { header: 'Purity', key: 'purity', width: 15 },
        { header: 'Wastage(%)', key: 'wastagepercent', width: 15 },
        { header: 'Wastage(g)', key: 'wastagegram', width: 15 },
        { header: 'HUID', key: 'huid', width: 15 }
      ];
    } else {
      worksheet.columns = [
        { header: 'Id', key: 'id', width: 20 },
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Type', key: 'productType', width: 10 },
        { header: 'Part Number', key: 'partNumber', width: 15 },
        { header: 'Model No', key: 'modelNo', width: 15 },
        { header: 'Hsn', key: 'hsn', width: 10 },
        { header: 'Mrp', key: 'mrp', width: 10 },
        {
          header: 'Purchase Price',
          key: 'purchaseprice',
          width: 15
        },
        {
          header: 'Purchase Disc(%)',
          key: 'purchasepricedisc',
          width: 15
        },
        {
          header: 'Purchase TAX TYPE',
          key: 'purchasetaxtype',
          width: 15
        },
        {
          header: 'Purchase TAX',
          key: 'purchasetax',
          width: 15
        },
        {
          header: 'Purchase Tax Included(Y/N)',
          key: 'purchasestaxincluded',
          width: 20
        },
        {
          header: 'Sale Price',
          key: 'sellingprice',
          width: 15
        },
        {
          header: 'Sale Disc(%)',
          key: 'sellingpricedisc',
          width: 15
        },
        {
          header: 'Sale TAX TYPE',
          key: 'saletaxtype',
          width: 15
        },
        { header: 'Sale TAX', key: 'saletax', width: 15 },
        {
          header: 'Sale Tax Included(Y/N)',
          key: 'saletaxincluded',
          width: 20
        },
        { header: 'POS(Y/N)', key: 'pos', width: 10 },
        { header: 'Online(Y/N)', key: 'online', width: 10 },
        {
          header: 'Opening Stock',
          key: 'openingstock',
          width: 15
        },
        {
          header: 'Stock Reorder Qty',
          key: 'stockreorder',
          width: 15
        },
        {
          header: 'Primary Unit',
          key: 'primaryunit',
          width: 15
        },
        {
          header: 'Secondary Unit',
          key: 'secondaryunit',
          width: 15
        },
        { header: 'Unit Qty', key: 'unitqty', width: 15 },
        { header: 'Brand', key: 'brand', width: 10 },
        {
          header: 'Short Cut Product Code',
          key: 'shortcut',
          width: 15
        },
        { header: 'SKU', key: 'sku', width: 15 },
        { header: 'Barcode', key: 'barcode', width: 15 },
        {
          header: 'Warehouse',
          key: 'warehouse',
          width: 15
        },
        { header: 'Rack Number', key: 'rackno', width: 15 },
        {
          header: 'Product Description',
          key: 'proddesc',
          width: 20
        }
      ];
    }

    // Make header row bold and color header cells
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'd8f3fc' } // Yellow color
      };
      cell.font = { bold: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    let result = await getProductData({
      $and: [{ 'categoryLevel3.name': { $eq: element.name } }]
    });

    categoriesMap.set(element.displayName, result.length);

    result.map((finalData) => {
      let record = {};
      if (
        String(localStorage.getItem('isJewellery')).toLowerCase() === 'true'
      ) {
        record = {
          id: finalData.productId,
          name: finalData.name,
          productType: finalData.productType,
          partNumber: finalData.partNumber,
          modelNo: finalData.modelNo,
          hsn: finalData.hsn,
          mrp: finalData.finalMRPPrice,
          purchaseprice: finalData.purchasedPrice,
          purchasepricedisc: finalData.purchaseDiscountPercent,
          purchasetaxtype: finalData.purchaseTaxType,
          purchasetax:
            parseFloat(finalData.purchaseCgst || 0) +
            parseFloat(finalData.purchaseSgst || 0),
          purchasestaxincluded:
            finalData.purchaseTaxIncluded === true ? 'Y' : 'N',
          sellingprice: finalData.salePrice,
          sellingpricedisc: finalData.saleDiscountPercent,
          saletaxtype: finalData.taxType,
          saletax:
            parseFloat(finalData.cgst || 0) + parseFloat(finalData.sgst || 0),
          saletaxincluded: finalData.taxIncluded === true ? 'Y' : 'N',
          pos: finalData.isOffLine === true ? 'Y' : 'N',
          online: finalData.isOnLine === true ? 'Y' : 'N',
          openingstock: finalData.openingStockQty,
          stockreorder: finalData.stockReOrderQty,
          primaryunit:
            finalData.primaryUnit !== null &&
            finalData.primaryUnit !== undefined
              ? finalData.primaryUnit.fullName
              : 'SELECT',
          secondaryunit:
            finalData.secondaryUnit !== null &&
            finalData.secondaryUnit !== undefined
              ? finalData.secondaryUnit.fullName
              : 'SELECT',
          unitqty: finalData.unitConversionQty,
          brand: finalData.brandName,
          sku: finalData.sku,
          barcode: finalData.barcode ? finalData.barcode.toString() : '',
          warehouse: finalData.warehouseData,
          rackno: finalData.rack,
          proddesc: finalData.description,
          grossweight: finalData.grossWeight,
          stoneweight: finalData.stoneWeight,
          netweight: finalData.netWeight,
          stonecharge: finalData.stoneCharge,
          makingcharge: finalData.makingChargePerGram,
          purity: finalData.purity,
          wastagepercent: finalData.wastagePercentage,
          wastagegram: finalData.wastageGrams,
          huid: finalData.hallmarkUniqueId
        };
      } else {
        record = {
          id: finalData.productId,
          name: finalData.name,
          productType: finalData.productType,
          partNumber: finalData.partNumber,
          modelNo: finalData.modelNo,
          hsn: finalData.hsn,
          mrp: finalData.finalMRPPrice,
          purchaseprice: finalData.purchasedPrice,
          purchasepricedisc:
            finalData.purchaseDiscountPercent > 0
              ? parseFloat(finalData.purchaseDiscountPercent)
              : '',
          purchasetaxtype: finalData.purchaseTaxType,
          purchasetax:
            parseFloat(finalData.purchaseCgst || 0) +
            parseFloat(finalData.purchaseSgst || 0),
          purchasestaxincluded:
            finalData.purchaseTaxIncluded === true ? 'Y' : 'N',
          sellingprice: finalData.salePrice,
          sellingpricedisc:
            finalData.saleDiscountPercent > 0
              ? parseFloat(finalData.saleDiscountPercent)
              : '',
          saletaxtype: finalData.taxType,
          saletax:
            parseFloat(finalData.cgst || 0) + parseFloat(finalData.sgst || 0),
          saletaxincluded: finalData.taxIncluded === true ? 'Y' : 'N',
          pos: finalData.isOffLine === true ? 'Y' : 'N',
          online: finalData.isOnLine === true ? 'Y' : 'N',
          openingstock: finalData.openingStockQty,
          stockreorder: finalData.stockReOrderQty,
          primaryunit:
            finalData.primaryUnit !== null &&
            finalData.primaryUnit !== undefined
              ? finalData.primaryUnit.fullName
              : 'SELECT',
          secondaryunit:
            finalData.secondaryUnit !== null &&
            finalData.secondaryUnit !== undefined
              ? finalData.secondaryUnit.fullName
              : 'SELECT',
          unitqty: finalData.unitConversionQty,
          brand: finalData.brandName,
          sku: finalData.sku,
          barcode: finalData.barcode ? finalData.barcode.toString() : '',
          warehouse: finalData.warehouseData,
          rackno: finalData.rack,
          proddesc: finalData.description
        };
      }
      worksheet.addRow(record);
    });

    for (let i = 0; i < result.length; i++) {
      // Add a dropdown list for the 'primaryunit' column
      worksheet.getCell('V' + (i + 2)).dataValidation = {
        type: 'list',
        allowBlank: false,
        formulae: ['Units!$A$1:$A$' + unitsArray.length]
      };
      // Add a dropdown list for the 'secondaryunit' column
      worksheet.getCell('W' + (i + 2)).dataValidation = {
        type: 'list',
        allowBlank: false,
        formulae: ['Units!$A$1:$A$' + unitsArray.length]
      };
    }

    const taxTypeList = [
      'CGST - SGST',
      'IGST',
      'Nil-Rated',
      'Non-GST',
      'Zero-Rated',
      'Exempted'
    ];

    const typeList = ['Product', 'Service'];

    // Add a dropdown list for the 'type' column
    const typeColumn = worksheet.getColumn('productType');
    typeColumn.eachCell((cell) => {
      cell.dataValidation = {
        type: 'list',
        formulae: [`"${typeList.join(',')}"`],
        operator: 'between'
      };
    });

    // Add a dropdown list for the 'purchasetaxtype' column
    const purchaseTaxTypeColumn = worksheet.getColumn('purchasetaxtype');
    purchaseTaxTypeColumn.eachCell((cell) => {
      cell.dataValidation = {
        type: 'list',
        formulae: [`"${taxTypeList.join(',')}"`],
        operator: 'between'
      };
    });

    // Add a dropdown list for the 'saletaxtype' column
    const saleTaxTypeColumn = worksheet.getColumn('saletaxtype');
    saleTaxTypeColumn.eachCell((cell) => {
      cell.dataValidation = {
        type: 'list',
        formulae: [`"${taxTypeList.join(',')}"`],
        operator: 'between'
      };
    });

    const taxArray = [0, 0.25, 1.5, 3, 5, 12, 18, 28];

    // Add a dropdown list for the 'purchasetax' column
    const purchaseTaxColumn = worksheet.getColumn('purchasetax');
    purchaseTaxColumn.eachCell((cell) => {
      cell.dataValidation = {
        type: 'list',
        formulae: [`"${taxArray.join(',')}"`],
        operator: 'between'
      };
    });

    // Add a dropdown list for the 'saletax' column
    const saleTaxColumn = worksheet.getColumn('saletax');
    saleTaxColumn.eachCell((cell) => {
      cell.dataValidation = {
        type: 'list',
        formulae: [`"${taxArray.join(',')}"`],
        operator: 'between'
      };
    });

    if (size === index + 1) {
      // Generate Excel file buffer
      workbook.xlsx.writeBuffer().then((buffer) => {
        // Create a Blob from the buffer
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);
        // Create a link element
        const a = document.createElement('a');
        // Set the link's href attribute to the URL of the Blob
        a.href = url;
        // Set the download attribute to specify the filename
        const fileName = cData.level2Category.displayName;
        a.download = fileName + '.xlsx';
        // Append the link to the body
        document.body.appendChild(a);
        // Click the link programmatically to start the download
        a.click();
        // Remove the link from the body
        document.body.removeChild(a);
      });
    }
  });
};

export default async (cData, db) => {
  download(db, cData);
};