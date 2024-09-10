import React, { useEffect, useState } from 'react';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import * as moment from 'moment';
import useWindowDimensions from 'src/components/windowDimension';
import { AgGridReact } from 'ag-grid-react';
import MoreOptionsSessionGroup from 'src/components/MoreOptionsSessionGroup';
import { useStyles } from './SessionGroup';


const AdminSessionGroupList = (props) => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [rowData, setRowData] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    // setTimeout(() => {
    //   params.api.sizeColumnsToFit();
    // }, 100);

    window.addEventListener('resize', function () {
      setTimeout(function () {
        params.api.sizeColumnsToFit();
      });
    });
  };

  function dateFormatter(params) {
    var dateAsString = params.data.date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    filter: true,
    rowHeight: 10,
    headerHeight: 30,
    suppressMenuHide: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    },
    flex: 1
  });

  const [columnDefs] = useState([
    {
      headerName: 'DATE',
      field: 'date',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = moment(cellValue).startOf('day').toDate();
  
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
  
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
  
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
        },
      },
      filter: 'agDateColumnFilter',
      valueFormatter: dateFormatter,
    },
    {
      headerName: 'CLIENT',
      field: 'customerName',
      width: 200,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
      },
    },
    {
      headerName: 'TOTAL SESSIONS',
      field: 'noOfSession',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
      },
    },
    {
      headerName: 'PENDING',
      field: 'pendingCount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
      },
    },
    {
      headerName: 'COMPLETED',
      field: 'completedCount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
      },
    },
    {
      headerName: 'CANCELLED',
      field: 'cancelledCount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
      },
    },
    {
      headerName: '',
      field: '',
      suppressMenu: true,
      width: 100,
      sortable: false,
      cellRenderer: 'templateActionRenderer',
    },
  ]);
  
  const rowClassRules = {
    rowHighlight: function (params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  const TemplateActionRenderer = (props) => {
    return (
      <MoreOptionsSessionGroup
        // menu={moreoption.moreoptionsdata}
        index={props['data']['sequenceNumber']}
        item={props['data']}
        id={props['data']['sequenceNumber']}
        component="sessionGroupList"
      />
    );
  };

  useEffect(() => {
    if (gridApi) {
      if (props.sessionGroupList) {
        gridApi.setRowData(props.sessionGroupList);
      }
    }
  }, [props.sessionGroupList]);

  useEffect(() => {
    if (gridApi) {
      if (rowData) {
        gridApi.setRowData(rowData);
      }
    }
  }, [rowData]);


  return (
    <div>
         <div style={{ width: '100%', height: height - 185 + 'px' }}>
            <div
              id="sales-invoice-grid"
              style={{ height: '95%', width: '100%' }}
              className="ag-theme-material"
            >
            <AgGridReact
                  onGridReady={onGridReady}
                  enableRangeSelection
                  paginationPageSize={10}
                  suppressMenuHide
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  pagination
                  headerHeight={40}
                  rowClassRules={rowClassRules}
                  className={classes.agGridclass}
                  style={{ width: '100%', height: '95%;' }}
                  overlayLoadingTemplate={
                    '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                  }
                  overlayNoRowsTemplate={
                    '<span className="ag-overlay-loading-center">No Rows to Show!</span>'
                  }
                  frameworkComponents={{
                      templateActionRenderer: TemplateActionRenderer
                    }}
                />
                <div
                  style={{
                    display: 'flex',
                    float: 'right',
                    marginTop: '5px',
                    marginBottom: '5px'
                  }}
                ></div>
                </div>
                </div>
    </div>
  );
};
export default InjectObserver(AdminSessionGroupList);