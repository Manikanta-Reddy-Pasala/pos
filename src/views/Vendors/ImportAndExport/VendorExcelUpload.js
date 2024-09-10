import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Page from '../../../components/Page';
import {
  Grid,
  Typography,
  Container,
  makeStyles,
  withStyles,
  Button
} from '@material-ui/core';

import { DropzoneArea } from 'material-ui-dropzone';
import './VendorExcelUpload.css';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import MuiDialogActions from '@material-ui/core/DialogActions';
import exportVendorDataToExcelAdvanced from './exportVendorDataToExcelAdvanced';
import exportVendorTemplateToExcelAdvanced from './exportVendorTemplateToExcelAdvanced';
import { Link } from 'react-router-dom';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import NoPermission from 'src/views/noPermission';
import BubbleLoader from 'src/components/loader';
import * as Bd from 'src/components/SelectedBusiness';
import { MAX_EXCEL_FILE_SIZE } from 'src/components/common/common';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Loader from 'react-js-loader';
import * as ExcelJS from 'exceljs';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { findParty } from 'src/components/Helpers/dbQueries/parties';
import { toJS } from 'mobx';

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    paddingTop: 10
  },

  paper: {
    padding: 2
  },
  dropzoneStyle: {
    '& .MuiDropzoneArea-icon': {
      color: '#95C75D'
    },
    '& .MuiDropzoneArea-root': {
      border: '2px dashed #95C75D !important',
      borderRadius: '50% !important',
      display: 'block !important',
      textAlign: 'center !important',
      width: '400px !important',
      height: '370px !important',
      marginTop: '-3px !important'
    }
  },
  uploadContainer: {
    border: ' 2px dashed green',
    padding: '100px',
    borderRadius: '50%',
    display: 'block',
    textAlign: 'center',
    width: '400px'
  },
  uploadText: {
    display: 'grid',
    marginTop: '60px'
  },
  textCenter: {
    textAlign: 'center',
    color: 'grey'
  },
  marginSpace: {
    margin: '0px 0 20px 0px'
  },
  excelContainer: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    height: '70%'
  },
  exceltempContainer: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center'
  },
  addDownload: {
    borderRadius: 5,
    color: '#FFFFFF',
    marginTop: '65PX',
    backgroundColor: '#9dcb6a',
    marginLeft: 12,
    '&:hover': {
      backgroundColor: '#9dcb6a'
    }
  },
  headerContain: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 10px 40px 20px'
  },
  flexGrid: {
    display: 'grid'
  },
  flexCenter: {
    display: 'flex',
    justifyContent: 'center'
  },
  header: {
    fontWeight: 'bold',
    fontFamily: 'Roboto'
  },
  clickBtn: {
    color: 'green',
    marginTop: '5px',
    cursor: 'pointer'
  },
  previewChip: {
    minWidth: 160,
    maxWidth: 210
  }
});

const VendorExcelUpload = () => {
  const classes = useStyles();
  const stores = useStore();

  const {
    saveExcelVendorRowData,
    updateExcelVendorRowData,
    addVendorsNotProcessed,
    resetVendorsNotProcessed
  } = stores.VendorStore;
  const { vendorsNotProcessed } = toJS(stores.VendorStore);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openLoadingAlert, setOpenLoadingAlert] = useState(false);
  const [loadingAlertText, setLoadingAlertText] = useState('');

  const readExcelFile = async (uploadedFiles) => {
    var files = uploadedFiles;
    var f = files[0];

    let fileName = f.name.split('.')[0];

    /**
     * this is to avoid if file name contains (1) some thing like this
     */
    if (fileName.includes(' (')) {
      fileName = f.name.split(' (')[0];
    } else if (fileName.includes('(')) {
      fileName = f.name.split('(')[0];
    }

    /**
     * few categories has / in name but windows saving it as -
     * to handle this below logic
     */
    if (fileName.includes('-')) {
      fileName = fileName.replace('-', '/');
    }

    await resetVendorsNotProcessed();

    var reader = new FileReader();
    reader.onload = async (e) => {
      // to show loader
      setLoadingAlertText('Please wait while we are processing data!!');
      setOpenLoadingAlert(true);

      var data = e.target.result;
      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.load(data);
      // Iterate over each worksheet in the workbook
      await workbook.eachSheet(async (worksheet, sheetId) => {
        if (worksheet.name !== 'States') {
          // Get the first row of the worksheet
          const firstRow = worksheet.getRow(1);

          let isEdit = false;
          // Iterate over each cell in the first row
          firstRow.eachCell((cell, colNumber) => {
            if (cell.value === 'ID' && colNumber === 1) {
              isEdit = true;
            }
          });

          // Iterate over each row in the worksheet
          await worksheet.eachRow(async (row, rowNumber) => {
            if (rowNumber !== 1) {
              if (isEdit) {
                /**
                 * update product
                 */
                const cell = worksheet.getCell('A' + rowNumber); // Product name cell address
                const cellValue = cell ? cell.value : null;
                await updateExcelVendorRowData(row, cellValue);
              } else {
                // Get the value of the specified cell in the worksheet
                const vendorGSTNCell = worksheet.getCell('D' + rowNumber); // Product name cell address
                const vendorGSTNCellValue = vendorGSTNCell
                  ? vendorGSTNCell.value
                  : '';

                if (
                  vendorGSTNCellValue !== '' &&
                  vendorGSTNCellValue !== null
                ) {
                  const vendorData = await findParty({
                    $and: [
                      { gstNumber: { $eq: vendorGSTNCellValue } },
                      { isVendor: true }
                    ]
                  });

                  if (vendorData) {
                    // dont process the product with same no and show error
                    const pnp = {
                      name: vendorGSTNCellValue,
                      reason: 'Vendor with same GSTIN already exists'
                    };
                    addVendorsNotProcessed(pnp);
                  } else {
                    await saveExcelVendorRowData(row);
                  }
                } else {
                  await saveExcelVendorRowData(row);
                }
              }
            }
          });
        }
      });

      //remove loader and show errors
      setLoadingAlertText('');
      setOpenLoadingAlert(false);
    };
    reader.readAsBinaryString(f);
  };

  const downloadTemplate = async () => {
    exportVendorTemplateToExcelAdvanced();
  };

  const downloadDataForEdit = async () => {
    exportVendorDataToExcelAdvanced();
  };

  const onFileChange = (files) => {
    if (files && files.length > 0) {
      readExcelFile(files);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Vendors')) {
        setFeatureAvailable(false);
      }
    }
  };

  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2)
    }
  }))(MuiDialogContent);

  return (
    <div>
      <Page className={classes.root} title="Import Vendors Excel">
        {isLoading && <BubbleLoader></BubbleLoader>}
        {!isLoading && (
          <div>
            {isFeatureAvailable ? (
              <Container maxWidth={true}>
                <Paper style={{ width: '100%', height: '85vh' }}>
                  <Grid className={classes.headerContain}>
                    <div>
                      <Typography className={classes.header} variant="inherit">
                        Import Vendors Excel
                      </Typography>
                    </div>

                    <div>
                      <Link to="/app/Vendor">
                        <CancelRoundedIcon style={{ color: 'grey' }} />
                      </Link>
                    </div>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="stretch"
                  >
                    <Grid item md={6} sm={12} className="grid-padding">
                      <Typography className={classes.textCenter} variant="h6">
                        Download Excel Template to Upload/Edit Data
                      </Typography>

                      <div className={classes.excelContainer}>
                        <div className={classes.flexGrid}>
                          <img
                            src={require('../../../icons/excelicon.png')}
                            width="70px"
                            height="70px"
                            className={classes.Applogo}
                            alt="file"
                          />
                        </div>
                      </div>
                      <div className={classes.exceltempContainer}>
                        <DialogActions>
                          <Button
                            onClick={() => downloadTemplate()}
                            style={{
                              backgroundColor: 'rgb(149 199 93)',
                              color: 'white',
                              fontWeight: 'normal',
                              width: '180px'
                            }}
                          >
                            Download Template
                          </Button>
                          <Button
                            onClick={() => downloadDataForEdit()}
                            variant="outlined"
                            style={{
                              borderColor: 'rgb(149 199 93)',
                              color: 'rgb(149 199 93)',
                              fontWeight: 'normal',
                              width: '180px'
                            }}
                          >
                            Edit Data
                          </Button>
                        </DialogActions>
                      </div>
                    </Grid>

                    <Grid item md={6} sm={12}>
                      <div className={classes.marginSpace}>
                        <Typography className={classes.textCenter} variant="h6">
                          Upload your Excel
                        </Typography>
                      </div>

                      <div className={classes.flexCenter}>
                        <div className={classes.dropzoneStyle}>
                          <DropzoneArea
                            onChange={(e) => onFileChange(e)}
                            showPreviews={true}
                            showPreviewsInDropzone={false}
                            maxFileSize={MAX_EXCEL_FILE_SIZE}
                            useChipsForPreview
                            previewGridProps={{
                              container: { spacing: 1, direction: 'row' }
                            }}
                            previewChipProps={{
                              classes: { root: classes.previewChip }
                            }}
                            previewText="Selected files"
                          />
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                  {vendorsNotProcessed && vendorsNotProcessed.length > 0 && (
                    <div style={{ margin: '20px' }}>
                      <Typography className={classes.header} variant="inherit">
                        List of Vendors not processed with errors
                      </Typography>
                      {vendorsNotProcessed.map((option, index) => (
                        <Typography>
                          {option.name} - {option.reason}
                        </Typography>
                      ))}
                    </div>
                  )}
                </Paper>
              </Container>
            ) : (
              <NoPermission />
            )}
          </div>
        )}
      </Page>
      <Dialog
        fullScreen={fullScreen}
        open={openLoadingAlert}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>{loadingAlertText}</p>
              </div>
              <div>
                <br />
                <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InjectObserver(VendorExcelUpload);