import React, { useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import { defaultColumnConfig } from './utils';

const data = [
  { make: 'Toyota', model: 'Celica', price: 35000 },
  { make: 'Ford', model: 'Mondeo', price: 32000 },
  { make: 'Porsche', model: 'Boxter', price: 72000 }
];

const column = [
  { headerName: 'Make', field: 'make' },
  { headerName: 'Model', field: 'model', filter: 'agNumberColumnFilter' },
  { headerName: 'Price', field: 'price', filter: 'agNumberColumnFilter' }
];

/**
 * disableDefaultConfig - to disable the default configs which we defined for AGGrid
 * rowSelection - to enable row selection
 */

const SalesInfoGrid = (props) => {
  const { disableDefaultConfig, rowSelection } = props;

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  // to get the api to access manipulate the grid data

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  // to get access to selected rows

  const onSelectionChanged = () => {
    const selectedRows = gridApi.getSelectedRows();
    console.log(selectedRows);
  };

  const defaultProps = disableDefaultConfig
    ? {}
    : { ...defaultColumnConfig, rowSelection: 'single' };

  const rowSelectProps = rowSelection
    ? { rowSelection: 'single', onSelectionChanged: onSelectionChanged }
    : {};

  const gridProps = {
    ...defaultProps,
    ...rowSelectProps,
    filter: true,
    suppressMenuHide: true,
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true
    },
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '500px'
      }}
      className="ag-theme-material blue-theme"
    >
      <AgGridReact
        rowData={data}
        {...gridProps}
        onGridReady={onGridReady}
        columnDefs={column}
      />
    </div>
  );
};

export default SalesInfoGrid;
