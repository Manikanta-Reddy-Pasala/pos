import * as ExcelJS from 'exceljs';
import getStateList from 'src/components/StateList';

const download = () => { 
  // Create a workbook and add a worksheet
  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet('Customers');

  // populate master list data worksheet
  let worksheetMasterData = workbook.addWorksheet('States');
  const stateArray = getStateList().map((state) => state.name);
  for (var i = 0; i < stateArray.length; i++) {
    worksheetMasterData.addRow([stateArray[i]]);
  }

  let filteredColumns = [];
  filteredColumns.push({
    header: 'NAME',
    key: 'name',
    width: 15
  });
  filteredColumns.push({
    header: 'TALLY MAPPED NAME',
    key: 'tallyMappedName',
    width: 15
  });
  filteredColumns.push({
    header: 'PHONE NO',
    key: 'phoneNo',
    width: 15
  });
  filteredColumns.push({
    header: 'GSTIN',
    key: 'gstin',
    width: 20
  });
  filteredColumns.push({
    header: 'PAN',
    key: 'pan',
    width: 15
  });
  filteredColumns.push({
    header: 'EMAIL ID',
    key: 'emailId',
    width: 10
  });
  filteredColumns.push({
    header: 'BALANCE',
    key: 'balance',
    width: 10
  });
  filteredColumns.push({
    header: 'AS OF DATE',
    key: 'asOfDate',
    width: 10
  });
  filteredColumns.push({
    header: 'ADDRESS',
    key: 'address',
    width: 20
  });
  filteredColumns.push({
    header: 'PINCODE',
    key: 'pincode',
    width: 10
  });
  filteredColumns.push({
    header: 'CITY',
    key: 'city',
    width: 10
  });
  filteredColumns.push({
    header: 'STATE',
    key: 'state',
    width: 10
  });
  filteredColumns.push({
    header: 'COUNTRY',
    key: 'country',
    width: 10
  });

  worksheet.columns = filteredColumns;

  // Add data to the worksheet
  if (String(localStorage.getItem('isTemple')).toLowerCase() === 'true') {
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

  worksheet.addRow({
    name: '',
    tallyMappedName: '',
    phoneNo: '',
    gstin: '',
    pan: '',
    emailId: '',
    balance: 0,
    asOfDate: '',
    address: '',
    pincode: '',
    city: '',
    state: 'Select State',
    country: 'India'
  });

  worksheet.getCell('L2').dataValidation = {
    type: 'list',
    allowBlank: false,
    formulae: ['States!$A$1:$A$37']
  };

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
    const fileName =
      localStorage.getItem('businessName') + '_Export_Bulk_Customer_Template';
    a.download = fileName + '.xlsx';
    // Append the link to the body
    document.body.appendChild(a);
    // Click the link programmatically to start the download
    a.click();
    // Remove the link from the body
    document.body.removeChild(a);
  });
};

export default () => {
  download();
};