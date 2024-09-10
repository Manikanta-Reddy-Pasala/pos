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
import exportTemplateToExcelAdvanced from './exportTemplateToExcelAdvanced';
import exportDataToExcelAdvanced from './exportDataToExcelAdvanced';
import { DropzoneArea } from 'material-ui-dropzone';
import './ExcelUpload.css';
import DownloadXlsTemplate from './downloadXLXSTemplateModal';
import EditDataXls from './EditDataXlsModal.js';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import * as Db from '../../../RxDb/Database/Database';
import { toJS } from 'mobx';
import MuiDialogActions from '@material-ui/core/DialogActions';
import * as Bd from '../../../components/SelectedBusiness';
import BubbleLoader from 'src/components/loader';
import NoPermission from 'src/views/noPermission';
import * as ExcelJS from 'exceljs';
import { isProductAvailable } from 'src/components/Helpers/dbQueries/businessproduct';
import Loader from 'react-js-loader';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import MuiDialogContent from '@material-ui/core/DialogContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { getLevel3Categorieslist } from 'src/components/Helpers/BusinessCategoriesQueryHelper';
import { MAX_EXCEL_FILE_SIZE } from 'src/components/common/common';

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

const categories = {
  level2Category: {},
  level3Categories: []
};
const ExcelUpload = () => {
  const classes = useStyles();
  const stores = useStore();
  const { level2CategoriesList, level3CategoriesList, productsNotProcessed } =
    toJS(stores.ProductStore);
  const { resetProductsNotProcessed, addProductsNotProcessed } =
    stores.ProductStore;
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openLoadingAlert, setOpenLoadingAlert] = useState(false);
  const [loadingAlertText, setLoadingAlertText] = useState('');

  async function getLevel2Category(name) {
    // console.log('getLevel2Category:::', name);
    const db = await Db.get();
    let result = {};
    const businessData = await Bd.getBusinessData();

    await db.businesscategories
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { 'level2Category.displayName': { $eq: name } }
          ]
        }
      })
      .exec()
      .then((data) => {
        result = data.level2Category;
        // console.log('level2 data:::', data);
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
    return result;
  }

  const {
    resetLevel2AndLevel3Categories,
    updateExcelProductRowData,
    saveExcelProductRowData
  } = stores.ProductStore;

  const [openTemplate, setOpenTemplate] = useState(false);
  const [openEditData, setOpenEditData] = useState(false);

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

    await resetProductsNotProcessed();

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
        if (worksheet.name !== 'Units' && worksheet.name !== 'Categories') {
          // Get the first row of the worksheet
          const firstRow = worksheet.getRow(1);

          let isEdit = false;
          // Iterate over each cell in the first row
          firstRow.eachCell((cell, colNumber) => {
            if (cell.value === 'Id' && colNumber === 1) {
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
                await updateExcelProductRowData(row, cellValue);
              } else {
                // Get the value of the specified cell in the worksheet
                const productNameCell = worksheet.getCell('A' + rowNumber); // Product name cell address
                const productNameCellValue = productNameCell
                  ? productNameCell.value
                  : '';

                const salePriceCell = worksheet.getCell('K' + rowNumber); // Product name cell address
                const salePriceCellValue = salePriceCell
                  ? parseFloat(salePriceCell.value || 0)
                  : 0;

                const level3Cell = worksheet.getCell('C' + rowNumber); // Product name cell address
                const level3CellValue = level3Cell ? level3Cell.value : '';

                if (productNameCellValue !== '') {
                  const isProdExists = await isProductAvailable({
                    $and: [
                      { name: { $eq: productNameCellValue } },
                      { salePrice: { $eq: salePriceCellValue } },
                      { 'categoryLevel3.displayName': { $eq: level3CellValue } }
                    ]
                  });

                  if (isProdExists === true) {
                    // dont process the product with same no and show error
                    const pnp = {
                      name: productNameCellValue,
                      reason:
                        'Product already exists with same name or sale price'
                    };
                    addProductsNotProcessed(pnp);
                  } else {
                    const level2 = await getLevel2Category(worksheet.name);
                    await saveExcelProductRowData(row, level2);
                  }
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

  const openEditDataPopup = () => {
    setOpenEditData(true);
  };

  const closeDownloadTemplatePopup = () => {
    setOpenTemplate(false);
  };

  const closeDownloadEditDataPopup = () => {
    setOpenEditData(false);
  };

  const openDownloadTemplatePopup = () => {
    setOpenTemplate(true);
  };

  const downloadTemplate = async () => {
    categories.level2Categories = [];
    for (const level2 of level2CategoriesList) {
      if (level2.isChecked) {
        const level3Categories = await getLevel3Categorieslist(level2.name);
        level2.level3DisplaynameList = [];
        level3Categories.forEach((level3) => {
          level2.level3DisplaynameList.push(level3.displayName);
        });
        categories.level2Categories.push(level2);
      }
    }

    exportTemplateToExcelAdvanced(categories);

    resetLevel2AndLevel3Categories();
    closeDownloadTemplatePopup();
  };

  const downloadDataForEdit = async () => {
    const db = await Db.get();

    console.log('level2CategoriesList::', level2CategoriesList);
    for (const level2 of level2CategoriesList) {
      if (level2.isChecked) {
        categories.level2Category.name = level2.name;
        categories.level2Category.displayName = level2.displayName;
      }
    }

    categories.level3Categories = [];
    for (const level3 of level3CategoriesList) {
      if (level3.isChecked) {
        categories.level3Categories.push(level3);
      }
    }

    exportDataToExcelAdvanced(categories, db);

    resetLevel2AndLevel3Categories();
    closeDownloadEditDataPopup();
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
      await resetProductsNotProcessed();
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
      if (!businessData.posFeatures.includes('Product')) {
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
      <Page className={classes.root} title="Import Product Excel">
        {isLoading && <BubbleLoader></BubbleLoader>}
        {!isLoading && (
          <div>
            {isFeatureAvailable ? (
              <div>
                <Container maxWidth={true}>
                  <Paper style={{ width: '100%', height: '200vh' }}>
                    <Grid className={classes.headerContain}>
                      <div>
                        <Typography
                          className={classes.header}
                          variant="inherit"
                        >
                          Import Product Excel
                        </Typography>
                      </div>
                    </Grid>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
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
                              onClick={() => openDownloadTemplatePopup()}
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
                              onClick={() => openEditDataPopup()}
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
                          <Typography
                            className={classes.textCenter}
                            variant="h6"
                          >
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
                    {productsNotProcessed &&
                      productsNotProcessed.length > 0 && (
                        <div style={{ margin: '20px' }}>
                          <Typography
                            className={classes.header}
                            variant="inherit"
                          >
                            List of Products not processed with errors
                          </Typography>
                          {productsNotProcessed.map((option, index) => (
                            <Typography>
                              {option.name} - {option.reason}
                            </Typography>
                          ))}
                        </div>
                      )}
                  </Paper>
                </Container>
                <DownloadXlsTemplate
                  openModal={openTemplate}
                  closeModal={() => closeDownloadTemplatePopup()}
                  onDownload={() => downloadTemplate()}
                ></DownloadXlsTemplate>

                <EditDataXls
                  openModal={openEditData}
                  closeModal={() => closeDownloadEditDataPopup()}
                  onDownload={() => downloadDataForEdit()}
                ></EditDataXls>
              </div>
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

export default InjectObserver(ExcelUpload);