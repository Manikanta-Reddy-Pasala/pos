import React, { useEffect,useState } from 'react';
import {
  Dialog,
  Button,
  DialogContent,
  DialogContentText,
  withStyles,
  makeStyles,
  TextField,
  Checkbox,
  Typography
} from '@material-ui/core';
import injectWithObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import MuiDialogActions from '@material-ui/core/DialogActions';
import styled from 'styled-components';
import axios from 'axios';
import Loader from 'react-js-loader';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { findParty } from 'src/components/Helpers/dbQueries/parties';
import { getCurrentFinancialYear } from 'src/components/Helpers/DateHelper';
import * as dateHelper from 'src/components/Helpers/DateHelper';
import GSTError from './GSTError';

const useStyles = makeStyles((theme) => ({
  batchTable: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: '14px'
  },
  rowstyle: {
    border: '1px solid #ddd',
    padding: '8px'
  },
  headstyle: {
    paddingTop: '12px',
    paddingBottom: '12px',
    textAlign: 'left',
    backgroundColor: 'white',
    color: 'black'
  },
  filterBtn: {
    backgroundColor: '#f44336',
    color: 'white',
    height: '30px',
    fontSize: '12px',
    margin: '10px',
    '&:hover': {
      backgroundColor: '#f443369e',
      color: 'white'
    },
    float: 'right'
  }
}));

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const gray = '#8080804d';
const darkgray = '#808080bf';
const blue = '#FF6666';
const white = '#DBF1FF';

const ProgressBar = styled.ol`
  margin: 0 auto;
  padding: 0em 0 2em;
  list-style: none;
  position: relative;
  display: flex;
  justify-content: space-between;
`;

const ProgressBarStep = styled.li`
  text-align: center;
  position: relative;
  width: 100%;

  &:before,
  &:after {
    content: '';
    height: 0.3em;
    background-color: ${gray};
    position: absolute;
    z-index: 1;
    width: 100%;
    left: -50%;
    top: 43%;
    transform: translateY(-50%);
    transition: all 1s ease-out;
  }

  &:first-child:before,
  &:first-child:after {
    display: none;
  }

  &:after {
    background-color: ${blue};
    width: 0%;
  }

  &.is-complete + &.is-current:after,
  &.is-complete + &.is-complete:after {
    width: 100%;
  }
`;

const ProgressBarIcon = styled.svg`
  width: 1.5em;
  height: 1.5em;
  background-color: ${darkgray};
  fill: ${darkgray};
  border-radius: 50%;
  padding: 0.5em;
  max-width: 100%;
  z-index: 10;
  position: relative;
  transition: all 1.75s ease-out;

  ${ProgressBarStep}.is-current & {
    fill: ${blue};
    background-color: ${blue};
  }

  ${ProgressBarStep}.is-complete & {
    fill: ${white};
    background-color: ${blue};
  }

  .is-complete & {
    fill: ${white};
    background-color: ${blue};
  }
`;

const ProgressBarStepLabel = styled.span`
  display: block;
  font-weight: bold;
  text-transform: uppercase;
  color: ${gray};
  position: absolute;
  padding-top: 0.5em;
  width: 100%;
  font-size: 12px;
  transition: all 1s ease-out;

  ${ProgressBarStep}.is-current > &,
  ${ProgressBarStep}.is-complete > & {
    color: ${blue};
  }
`;

const CustomVendorPurchases = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { vendorStep, GSTINCollection, GSTINInvoiceCollection,financialYear } = toJS(
    stores.GSTR2BStore
  );
  const { handleErrorAlertOpen,openErrorMesssageDialog } = toJS(stores.GSTR1Store);

  const { openPurchasesImportFrom2B, showInvoice } = toJS(stores.GSTR2BStore);

  const {
    setOpenPurchasesImportFrom2B,
    GSTINPhoneUpdate,
    updateVendorStep,
    purchaseExpenseUpdate,
    GSTINVendorSelectionUpdate,
    GSTINTallyMappedNameUpdate
  } = stores.GSTR2BStore;

  const { addVendorFrom2B } = stores.VendorStore;
  const { raiseExpenseFrom2B, categoryList, getCategoryList } =
    stores.ExpensesStore;
  const { raisePurchasefrom2B } = stores.PurchasesAddStore;

  const [openGSTFetchLoader, setOpenGSTFetchLoader] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getCategoryList();
    // console.log("GSTINInvoiceCollection",getCurrentFinancialYear());
  }, []);

  const handleSubmit = async () => {
    setLoader(true);
    for (const item of GSTINCollection) {
      if (item.selected) {
        await fetchGSTDetails(item.GSTIN, item.phone, item.tallyMappedName);
      }
    }
    updateVendorStep(2);
    setLoader(false);
  };

  const fetchGSTDetails = async (gstNumber, phoneNumber, tallyMappedName) => {
    const API_SERVER = window.REACT_APP_API_SERVER;

    await axios
      .get(`${API_SERVER}/pos/v1/gstIn/get`, {
        params: {
          gstNumber: gstNumber
        }
      })
      .then(async (res) => {
        if (res) {
          if (res.data && res.data.valid === true) {
            let responseData = res.data;
            await addVendorFrom2B(responseData, phoneNumber, tallyMappedName);
          }
        }
      })
      .catch((err) => {
        setOpenGSTFetchLoader(false);
      });
  };

  const importPurchaseExpense = async () => {
    setLoader(true);
    
    for (const item of GSTINInvoiceCollection) {
      if (item.selected) {
        if(item.accountingDate == ''){
          handleErrorAlertOpen('Accounting Data should not be Empty!!!');
          setLoader(false);
          return;
        }
        await fetchVendorAndInjectDetails(item);
      }
    }

    setLoader(false);
    setOpenPurchasesImportFrom2B(false);
  };

  const fetchVendorAndInjectDetails = async (item) => {
    const vendorData = await findParty({
      $and: [{ gstNumber: { $eq: item.GSTIN } }, { isVendor: true }]
    });
    if (item.type === 'Expense') {
      await raiseExpenseFrom2B(vendorData, item);
    } else {
      await raisePurchasefrom2B(vendorData, item);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = GSTINInvoiceCollection.filter((item) =>
    item.GSTIN.includes(searchQuery) || item.inum.includes(searchQuery)
  );

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={openPurchasesImportFrom2B}
        PaperProps={{
          style: {
            minWidth: '1200px'
          }
        }}
        onClose={() => setOpenPurchasesImportFrom2B(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          {/* <DialogContentText></DialogContentText> */}
          <section style={{ marginTop: '0%' }}>
            <ProgressBar>
              <ProgressBarStep className={vendorStep >= 1 && 'is-complete'}>
                <ProgressBarIcon />
                <ProgressBarStepLabel>Vendor</ProgressBarStepLabel>
              </ProgressBarStep>
              <ProgressBarStep className={vendorStep >= 2 && 'is-complete'}>
                <ProgressBarIcon />
                <ProgressBarStepLabel>
                  Purchases / Expenses
                </ProgressBarStepLabel>
              </ProgressBarStep>
            </ProgressBar>
          </section>
          {vendorStep == 1 && (
            <div style={{ margin: '5px' }}>
              <table
                className={`${classes.batchTable}`}
                style={{ fontSize: '12px' }}
              >
                <thead>
                  <tr>
                    <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                      Sl No
                    </th>
                    <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                      Trade/Legal Name
                    </th>
                    <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                      GSTIN
                    </th>
                    <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                      Tally Mapped Name
                    </th>
                    <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                      Phone
                    </th>
                    <th
                      className={`${classes.headstyle} ${classes.rowstyle}`}
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {GSTINCollection.map((item, index) => (
                    <tr>
                      <td className={`${classes.rowstyle}`}>{index + 1}</td>
                      <td className={`${classes.rowstyle}`}>
                        {item.tradeName}
                      </td>
                      <td className={`${classes.rowstyle}`}>{item.GSTIN}</td>
                      <td className={`${classes.rowstyle}`}>
                        <TextField
                          style={{ width: '95%' }}
                          required
                          variant="outlined"
                          margin="dense"
                          type="text"
                          value={item.tallyMappedName}
                          onChange={(e) => {
                            GSTINTallyMappedNameUpdate(e.target.value, index);
                          }}
                          className="customTextField"
                        />
                      </td>
                      <td className={`${classes.rowstyle}`}>
                        <TextField
                          style={{ width: '95%' }}
                          required
                          variant="outlined"
                          margin="dense"
                          type="text"
                          value={item.phone}
                          onChange={(e) => {
                            GSTINPhoneUpdate(e.target.value, index);
                          }}
                          className="customTextField"
                        />
                      </td>
                      <td className={`${classes.rowstyle}`}>
                        {item.vendorExists ? (
                          <Typography>In BOOKS</Typography>
                        ) : (
                          <Checkbox
                            checked={item.selected}
                            onChange={(e) => {
                              GSTINVendorSelectionUpdate(
                                e.target.checked,
                                index
                              );
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={classes.filterSection} style={{ marginBottom: '10px' }}>
                <Button
                  onClick={(e) => {
                    handleSubmit();
                  }}
                  className={classes.filterBtn}
                >
                  SAVE ALL
                </Button>

                <Button
                  onClick={(e) => {
                    setOpenPurchasesImportFrom2B(false);
                  }}
                  className={classes.filterBtn}
                >
                  CANCEL
                </Button>
              </div>
            </div>
          )}

          {vendorStep == 2 && (
            <div style={{ margin: '5px' }}>
              <TextField
                style={{ marginBottom: '10px', padding: '5px',float:'right',width:'25%' }}
                required
                variant="outlined"
                margin="dense"
                placeholder='Search by GSTIN or Invoice No'
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                className="customTextField"
              />
              <table
                className={`${classes.batchTable}`}
                style={{ fontSize: '12px' }}
              >
                <thead>
                  <tr>
                    <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                      Sl No
                    </th>
                    <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                      Trade/Legal Name
                    </th>
                    <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                      GSTIN
                    </th>
                    <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                      Invoice No
                    </th>
                    <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                      Accounting Date
                    </th>
                    <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                      Type
                    </th>
                    {GSTINInvoiceCollection.some(
                      (item) => item.type === 'Expense'
                    ) && (
                        <th
                          className={`${classes.headstyle} ${classes.rowstyle}`}
                        >
                          Category
                        </th>
                      )}
                    <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                      Portal ITC Value
                    </th>
                    <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                      POS ITC Value
                    </th>
                    <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                      Portal RCM
                    </th>
                    <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                      POS RCM
                    </th>
                    <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                      ITC Reversed
                    </th>
                    <th
                      className={`${classes.headstyle} ${classes.rowstyle}`}
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <>
                      <tr>
                        <td className={`${classes.rowstyle}`}>{index + 1}</td>
                        <td className={`${classes.rowstyle}`}>
                          {item.tradeName}
                        </td>
                        <td className={`${classes.rowstyle}`}>{item.GSTIN}</td>
                        <td className={`${classes.rowstyle}`}>{item.inum}</td>
                        <td className={`${classes.rowstyle}`}>
                          <TextField
                            id="date"
                            type="date"
                            value={item.accountingDate}
                            onChange={(e) => {
                              purchaseExpenseUpdate(
                                dateHelper.formatDateToYYYYMMDD(e.target.value),
                                index,
                                'accountingDate'
                              );
                            }}
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </td>
                        <td className={`${classes.rowstyle}`}>
                          <Select
                            value={item.type}
                            onChange={(e) => {
                              purchaseExpenseUpdate(
                                e.target.value,
                                index,
                                'type'
                              );
                            }}
                          >
                            <MenuItem value={'Purchase'}>Purchase</MenuItem>
                            <MenuItem value={'Expense'}>Expense</MenuItem>
                          </Select>
                        </td>
                        {GSTINInvoiceCollection.some(
                          (item) => item.type === 'Expense'
                        ) && (
                            <td className={`${classes.rowstyle}`}>
                              <Select
                                value={item.categoryId}
                                onChange={(e, child) => {
                                  purchaseExpenseUpdate(
                                    e.target.value,
                                    index,
                                    'categoryId'
                                  );
                                  purchaseExpenseUpdate(
                                    child.props.children,
                                    index,
                                    'category'
                                  );
                                }}
                              >
                                {categoryList.map((cat, index) => (
                                  <MenuItem value={cat.categoryId}>
                                    {cat.category}
                                  </MenuItem>
                                ))}
                                {/* <MenuItem value={'Expense'}>Expense</MenuItem> */}
                              </Select>
                            </td>
                          )}
                        <td className={`${classes.rowstyle}`}>{item.itcavl}</td>
                        <td className={`${classes.rowstyle}`}>
                          <Select
                            value={item.posITC}
                            onChange={(e) => {
                              purchaseExpenseUpdate(
                                e.target.value,
                                index,
                                'posITC'
                              );
                            }}
                          >
                            <MenuItem value={'Y'}>Y</MenuItem>
                            <MenuItem value={'N'}>N</MenuItem>
                          </Select>
                        </td>
                        <td className={`${classes.rowstyle}`}>{item.rev}</td>
                        <td className={`${classes.rowstyle}`}>
                          <Select
                            value={item.posRCM}
                            onChange={(e) => {
                              purchaseExpenseUpdate(
                                e.target.value,
                                index,
                                'posRCM'
                              );
                            }}
                          >
                            <MenuItem value={'Y'}>Y</MenuItem>
                            <MenuItem value={'N'}>N</MenuItem>
                          </Select>
                        </td>
                        <td className={`${classes.rowstyle}`}>
                          <Select
                            value={item.itcReversed}
                            onChange={(e) => {
                              purchaseExpenseUpdate(
                                e.target.value,
                                index,
                                'itcReversed'
                              );
                            }}
                          >
                            <MenuItem value={'Y'}>Y</MenuItem>
                            <MenuItem value={'N'}>N</MenuItem>
                          </Select>
                        </td>

                        <td className={`${classes.rowstyle}`}>
                          {item.exists ? (
                            <Typography>In BOOKS</Typography>
                          ) : (
                            <Checkbox
                              checked={item.selected}
                              onChange={(e) => {
                                purchaseExpenseUpdate(
                                  e.target.checked,
                                  index,
                                  'selected'
                                );
                              }}
                            />
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={"12"} className={`${classes.rowstyle}`}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Typography style={{ marginRight: '10px' }}>Remarks: </Typography>
                            <TextField
                              style={{ width: '60%' }}
                              required
                              variant="outlined"
                              margin="dense"
                              type="text"
                              value={item.notes}
                              onChange={(e) => {
                                purchaseExpenseUpdate(
                                  e.target.value,
                                  index,
                                  'notes'
                                );
                              }}
                              className="customTextField"
                            />
                          </div>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
              <div className={classes.filterSection} style={{ marginBottom: '10px' }}>
                {showInvoice === true && (
                  <Button
                    onClick={(e) => {
                      importPurchaseExpense();
                    }}
                    className={classes.filterBtn}
                  >
                    SAVE ALL
                  </Button>
                )}

                <Button
                  onClick={(e) => {
                    setOpenPurchasesImportFrom2B(false);
                  }}
                  className={classes.filterBtn}
                >
                  CANCEL
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
        {/* <DialogActions>
          <Button
            onClick={() => setOpenPurchasesImportFrom2B(false)}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions> */}
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={loader}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>
                <br />
                <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      {openErrorMesssageDialog && <GSTError />}
    </>
  );
};

export default injectWithObserver(CustomVendorPurchases);