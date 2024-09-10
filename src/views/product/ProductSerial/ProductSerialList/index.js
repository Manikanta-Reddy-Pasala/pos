import React, { useState, useEffect } from 'react';
import Page from 'src/components/Page';
import {
  Paper,
  makeStyles,
  InputAdornment,
  Grid,
  Typography
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from 'src/components/controls/index';
import moreoption from 'src/components/Options';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import { Add } from '@material-ui/icons';
import { AgGridReact } from 'ag-grid-react';
import './ProductSerialList.css';
import useWindowDimensions from 'src/components/windowDimension';
import left_arrow from 'src/icons/svg/left_arrow.svg';
import right_arrow from 'src/icons/svg/right_arrow.svg';
import first_page_arrow from 'src/icons/svg/first_page_arrow.svg';
import last_page_arrow from 'src/icons/svg/last_page_arrow.svg';
import ProductModal from 'src/components/modal/ProductModal';
import MoreOptionsSerialItem from 'src/components/MoreOptionsSerialItem';
import {
  getAllProductsDataWithSerial,
  getAllProductsDataWithSerialBySearch
} from 'src/components/Helpers/dbQueries/businessproduct';
import { toJS } from 'mobx';

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: 6
  },
  newButton: {
    position: 'relative',
    borderRadius: 25
  },
  searchInputRoot: {
    borderRadius: 50
  },
  sectionHeader: {
    marginBottom: 30
  },
  tableRow: {
    '&.Mui-selected': {
      backgroundColor: '#CEE6F3 !important'
    }
  },

  storebtn: {
    borderTop: '1px solid #d8d8d8',
    borderRadius: 'initial',
    borderBottom: '1px solid #d8d8d8',
    paddingLeft: '12px',
    paddingRight: '12px',
    position: 'relative',
    fontSize: 12,
    color: '#b5b3b3',
    padding: '9px 5px 7px 5px'
  },
  onlinebtn: {
    // paddingRight: '14px',
    // paddingLeft: '12px',
    border: '1px solid #d8d8d8',
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 'initial',
    borderTopLeftRadius: 'initial',
    position: 'relative',
    fontSize: 12,
    color: '#b5b3b3',
    padding: '9px 14px 7px 12px'
  },
  allbtn: {
    border: '1px solid #d8d8d8',
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 'initial',
    borderTopRightRadius: 'initial',
    position: 'relative',
    fontSize: 12,
    color: '#b5b3b3',
    padding: '9px 5px 7px 5px'
  }
}));

const useHeaderStyles = makeStyles((theme) => ({
  paperRoot: {
    margin: theme.spacing(1),
    borderRadius: 6
  },
  pageHeader: {
    padding: theme.spacing(2)
  },
  pageIcon: {
    display: 'inline-block',
    padding: theme.spacing(2),
    color: '#3c44b1'
  },
  pageTitle: {
    paddingLeft: theme.spacing(4),
    '& .MuiTypography-subtitle2': {
      opacity: '0.6'
    }
  },
  mySvgStyle: {
    fillColor: theme.palette.primary.main
  },
  card: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    alignItems: 'center',
    flexDirection: 'row'
  },

  label: {
    flexDirection: 'column'
  },
  iconLabel: {
    fontSize: 'x-small'
  },
  root: {
    minWidth: 200,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    padding: '3px 0px 0px 8px'
  },
  texthead: {
    textColor: '#86ca94',
    marginLeft: theme.spacing(2)
  },
  text: { textColor: '#faab53' },
  plus: {
    margin: 6,
    paddingTop: 23,
    fontSize: '20px'
  }
}));

const ProductSerialList = (props) => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const headerClasses = useHeaderStyles();
  const stores = useStore();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const { productDialogOpen, isManufactureListRefreshed } = toJS(
    stores.ProductStore
  );
  const { handleOpenSerialModel, resetMfgRefreshFlag } = stores.ProductStore;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [limit] = useState(10);

  const [rowData, setRowData] = useState(null);
  let [serialData, setserialData] = useState([]);
  let [onChange, setOnChange] = useState(true);
  const [searchText, setSearchText] = useState('');

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    filter: true,
    rowHeight: 10,
    headerHeight: 30,
    suppressMenuHide: true,
    suppressHorizontalScroll: false,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  const getserialData = async () => {
    let skip = 0;
    setRowData([]);
    setserialData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllserialData();
    }

    let data = await getAllProductsDataWithSerial(skip, limit);
    setserialData(data);
  };

  const getAllserialData = async () => {
    let data = await getAllProductsDataWithSerial();
    setserialData(data);

    if (!data) {
      return;
    }

    const count = data.length;
    const numberOfPages = Math.ceil(count / limit);

    setTotalPages(numberOfPages);
  };

  const getserialDataBySearch = async (value) => {
    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    let skip = 0;
    setRowData([]);
    setserialData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllserialDataBySearch(value);
    }

    let data = await getAllProductsDataWithSerialBySearch(regexp, skip, limit);
    setserialData(data);
  };

  const getAllserialDataBySearch = async (value) => {
    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    let data = await getAllProductsDataWithSerialBySearch(regexp);
    if (!data) {
      return;
    }

    let count = 0;
    data.map((item) => {
      let output = {};

      ++count;
      return output;
    });

    let numberOfPages = 1;

    if (count % limit === 0) {
      numberOfPages = parseInt(count / limit);
    } else {
      numberOfPages = parseInt(count / limit + 1);
    }
    setTotalPages(numberOfPages);
  };

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

  const onFirstPageClicked = () => {
    if (gridApi) {
      setCurrentPage(1);
      setOnChange(true);
    }
  };

  const onLastPageClicked = () => {
    if (gridApi) {
      setCurrentPage(totalPages);
      setOnChange(true);
    }
  };

  const onPreviousPageClicked = () => {
    if (gridApi) {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        setOnChange(true);
      }
    }
  };

  const onNextPageClicked = () => {
    if (gridApi) {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        setOnChange(true);
      }
    }
  };

  const [columnDefs] = useState([
    {
      headerName: 'PRODUCT NAME',
      field: 'name',
      width: 200,
      filter: false
    },
    {
      filter: false,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>SERIAL</p>
            <p>COUNT</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];

        let count = 0;
        //soldStatus
        if (data && data.serialData) {
          count = data.serialData.length;
        }

        return count;
      }
    },
    {
      filter: false,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PURCHASED</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];

        let count = 0;

        if (data && data.serialData) {
          data.serialData.forEach((element) => {
            if (element.purchased) {
              count += 1;
            }
          });
        }

        return count;
      }
    },
    {
      filter: false,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>SOLD</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];

        let count = 0;

        if (data && data.serialData) {
          data.serialData.forEach((element) => {
            if (element.soldStatus) {
              count += 1;
            }
          });
        }

        return count;
      }
    },
    {
      filter: false,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PURCHASE</p>
            <p>RETURNED</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];

        let count = 0;

        if (data && data.serialData) {
          data.serialData.forEach((element) => {
            if (element.purchaseReturn) {
              count += 1;
            }
          });
        }

        return count;
      }
    },
    {
      filter: false,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>REPLACED</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];

        let count = 0;

        if (data && data.serialData) {
          data.serialData.forEach((element) => {
            if (element.replacement) {
              count += 1;
            }
          });
        }

        return count;
      }
    },
    {
      filter: false,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PENDING</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];

        let count = 0;

        if (data && data.serialData) {
          data.serialData.forEach((element) => {
            if (!element.purchased) {
              count += 1;
            }
          });
        }

        return count;
      }
    },
    {
      headerName: '',
      field: '',
      suppressMenu: true,
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
      <MoreOptionsSerialItem
        menu={moreoption.moreoptionsdata}
        item={props['data']}
        component="productList"
      />
    );
  };

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      setSearchText(target);
      if (target) {
        getserialDataBySearch(target);
      } else {
        getserialData();
      }
    }
  };

  useEffect(() => {
    if (gridApi) {
      if (serialData) {
        gridApi.setRowData(serialData);
      }
    }
  }, [gridApi, serialData]);

  useEffect(() => {
    if (gridApi) {
      if (rowData) {
        gridApi.setRowData(rowData);
      }
    }
  }, [gridApi, rowData]);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setOnChange(false);
        setRowData([]);
        //check whether search is clicked or not
        if (searchText.length > 0) {
          let searchTextConverted = { target: { value: searchText } };
          handleSearch(searchTextConverted);
        } else {
          await getserialData();
        }
      }
    };

    loadPaginationData();
  }, [onChange]);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (isManufactureListRefreshed === true) {
        setOnChange(false);
        setRowData([]);
        await getserialData();
        resetMfgRefreshFlag();
      }
    };

    loadPaginationData();
  }, [isManufactureListRefreshed]);

  return (
    <div>
      <Page className={classes.root} title="Serial Items">
        {/* -------------------------------------------- BODY ------------------------------------------------- */}

        <Paper className={classes.paperRoot}>
          <Grid
            container
            direction="row"
            spacing={2}
            alignItems="center"
            className={classes.sectionHeader}
          >
            <Grid item xs={12} sm={4}>
              <Typography variant="h4">Serial Item</Typography>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            alignItems="center"
            className={classes.sectionHeader}
          >
            <Grid item xs={12} sm={4}></Grid>
            <Grid item xs={12} sm={2}></Grid>
            <Grid item xs={12} sm={6} align="right">
              <Grid container direction="row" spacing={2} alignItems="center">
                <Grid item xs={6} align="right">
                  <Controls.Input
                    placeholder="Search Product"
                    size="small"
                    fullWidth
                    InputProps={{
                      classes: {
                        root: classes.searchInputRoot,
                        input: classes.searchInputInput
                      },
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      )
                    }}
                    onChange={handleSearch}
                  />
                </Grid>
                <Grid item xs={6} align="right">
                  <Controls.Button
                    text="Add Serial Data"
                    size="medium"
                    variant="contained"
                    color="primary"
                    autoFocus={true}
                    startIcon={<Add />}
                    className={classes.newButton}
                    onClick={() => handleOpenSerialModel(false)}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <div style={{ width: '100%', height: height - 200 + 'px' }}>
            <div
              id="sales-invoice-grid"
              style={{ height: '95%', width: '100%' }}
              className="ag-theme-material"
            >
              <AgGridReact
                onGridReady={onGridReady}
                paginationPageSize={10}
                suppressMenuHide={true}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                headerHeight={40}
                suppressPaginationPanel={true}
                suppressScrollOnNewData={true}
                rowClassRules={rowClassRules}
                overlayLoadingTemplate={
                  '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                }
                overlayNoRowsTemplate={
                  '<span className="ag-overlay-loading-center">No Rows to Show!</span>'
                }
                frameworkComponents={{
                  templateActionRenderer: TemplateActionRenderer
                }}
              ></AgGridReact>
              <div
                style={{
                  display: 'flex',
                  float: 'right',
                  marginTop: '5px',
                  marginBottom: '5px'
                }}
              >
                <img
                  alt="Logo"
                  src={first_page_arrow}
                  width="20px"
                  height="20px"
                  style={{ marginRight: '10px' }}
                  onClick={() => onFirstPageClicked()}
                />
                <img
                  alt="Logo"
                  src={right_arrow}
                  width="20px"
                  height="20px"
                  onClick={() => onPreviousPageClicked()}
                />
                <p
                  style={{
                    marginLeft: '10px',
                    marginRight: '10px',
                    marginTop: '2px'
                  }}
                >
                  Page {currentPage} of {totalPages}
                </p>
                <img
                  alt="Logo"
                  src={left_arrow}
                  width="20px"
                  height="20px"
                  style={{ marginRight: '10px' }}
                  onClick={() => onNextPageClicked()}
                />
                <img
                  alt="Logo"
                  src={last_page_arrow}
                  width="20px"
                  height="20px"
                  onClick={() => onLastPageClicked()}
                />
              </div>
            </div>
          </div>

          {productDialogOpen ? <ProductModal /> : null}
        </Paper>
      </Page>
    </div>
  );
};
export default InjectObserver(ProductSerialList);