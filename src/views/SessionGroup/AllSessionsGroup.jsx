import React, { useEffect, useState } from 'react';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import * as moment from 'moment';
import useWindowDimensions from 'src/components/windowDimension';
import { AgGridReact } from 'ag-grid-react';
import MoreOptionsSessionGroup from 'src/components/MoreOptionsSessionGroup';
import { useStyles } from './SessionGroup';

const AllSessionGroupList = (props) => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const { doctorSessionList } = props;
  const [rowData, setRowData] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [clickedRowData, setClickedRowData] = useState();

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 100);

    window.addEventListener('resize', function () {
      setTimeout(function () {
        params.api.sizeColumnsToFit();
      });
    });
  };

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
      field: 'sessionDate',
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
        }
      },
      filter: 'agDateColumnFilter',
    },
    {
        headerName: 'DOCTOR',
        field: 'doctorName',
        width: 200,
        filterParams: {
          buttons: ['reset', 'apply'],
          closeOnApply: true
        },
    },
    {
      headerName: 'CLIENT',
      field: 'patientName',
      width: 200,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
    },
    {
      headerName: 'START TIME',
      field: 'sessionStartTime',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
    },
    {
      headerName: 'END TIME',
      field: 'sessionEndTime',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
    },
    {
      headerName: 'STATUS',
      field: 'status',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: '',
      field: '',
      suppressMenu: true,
      width: 100,
      sortable: false,
      cellRenderer: 'templateActionRenderer'
    }
  ]);
  
  const rowClassRules = {
    rowHighlight: function (params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  const TemplateActionRenderer = (props) => {
    return (
      <MoreOptionsSessionGroup
        item={props['data']}
        id={props.node.rowIndex}
        component="doctorSessionList"
        index={props.node.rowIndex}
        allSession={true}
      />
    );
  };

  useEffect(() => {
    if (gridApi) {
      if (doctorSessionList) {
        gridApi.setRowData(doctorSessionList);
      }
    }
  }, [doctorSessionList]);

  useEffect(() => {
    if (gridApi) {
      if (rowData) {
        gridApi.setRowData(rowData);
      }
    }
  }, [rowData]);


  const handleRowClicked = (e) => {
   setClickedRowData(e.data);
  }

  return (
    <div>
         <div style={{ width: '100%', height: height - 220 + 'px' }}>
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
                  onRowClicked={handleRowClicked}
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
export default InjectObserver(AllSessionGroupList);