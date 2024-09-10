import React, { useEffect } from 'react';
import Page from 'src/components/Page';
import {
  Typography,
  makeStyles,
  Paper,
  Button,
  Grid,
  withStyles
} from '@material-ui/core';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import * as Db from '../../RxDb/Database/Database';
import { DropzoneArea } from 'material-ui-dropzone';
import './BackupAndRestore.css';
import MuiDialogActions from '@material-ui/core/DialogActions';

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 10
  },

  paper: {
    padding: 2
  },

  uploadContainer: {
    border: '2px dashed blue',
    padding: '100px',
    borderRadius: '50%',
    display: 'block',
    textAlign: 'center',
    width: '400px'
  },

  dropzoneStyle: {
    '& .MuiDropzoneArea-icon': {
      color: 'blue'
    },
    '& .MuiDropzoneArea-root': {
      border: '2px dashed rgb(0, 0, 255) !important',
      borderRadius: '50% !important',
      display: 'block !important',
      textAlign: 'center !important',
      width: '400px !important',
      height: '370px !important',
      marginTop: '-3px !important'
    }
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
  jsonContainer: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    height: '70%'
  },
  jsontempContainer: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center'
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
    color: 'blue',
    marginTop: '5px',
    cursor: 'pointer'
  },
  previewChip: {
    minWidth: 160,
    maxWidth: 210
  },
  pageContent: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: 6
  }
}));

const removeBackUpFromDb = async () => {
  const dbDump = await Db.getDataDumpDb();

  const query = await dbDump.datadump.findOne({
    selector: {
      $and: [{ id: { $eq: '1' } }]
    }
  });

  await query
    .remove()
    .then(async (data) => {
      console.log('datadump removed' + data);
    })
    .catch((error) => {
      console.log('datadump remove Failed ' + error);
    });
};

const BackupAndRestore = () => {
  const classes = useStyles();

  useEffect(() => {
    async function loadDump() {
      const isDataDump = localStorage.getItem('dataDump');

      if (isDataDump && isDataDump !== undefined) {
        const db = await Db.get();

        let dataDump = await getDataDumpFromTable();

        if (dataDump && dataDump.data) {
          await db.importDump(JSON.parse(dataDump.data));
        }
        localStorage.removeItem('dataDump');
        //remove backup from DB
        await removeBackUpFromDb();
      }
    }
    loadDump();
  }, []);

  const getDataDumpFromTable = async () => {
    const db = await Db.getDataDumpDb();

    let response = {};

    const query = db.datadump.findOne({
      selector: {
        id: { $eq: '1' }
      }
    });

    await query
      .exec()
      .then((data) => {
        response = data.toJSON();
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    return response;
  };

  const uploadDataDump = async (dataDump) => {
    const db = await Db.getDataDumpDb();

    localStorage.setItem('dataDump', 'true');

    //remove if any backup exists
    await removeBackUpFromDb();

    let InsertDoc = {
      id: '1',
      data: dataDump
    };

    await db.datadump
      .insert(InsertDoc)
      .then(() => {
        console.log('data dump Inserted');
      })
      .catch((err) => {
        console.log('data dump insertion Failed::', err);
      });

    await Db.deleteAndRecreateDb();
  };

  const downloadDataDump = async () => {
    const db = await Db.get();
    let dataDump = await db.dump();
    const fileName = 'oneshell-dump';
    const json = JSON.stringify(dataDump);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + '.json';
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <Page className={classes.root} title="Backup And Restore">
      <Paper className={classes.pageContent} style={{ height: '90vh' }}>
        <Grid className={classes.headerContain}>
          <div>
            <Typography className={classes.header} variant="inherit">
              Backup And Restore
            </Typography>
          </div>
        </Grid>
        <Grid container direction="row" justify="center" alignItems="stretch">
          <Grid item md={6} sm={12} className="grid-padding">
            <Typography className={classes.textCenter} variant="h6">
              Download JSON
            </Typography>

            <div className={classes.jsonContainer}>
              <div className={classes.flexGrid}>
                <img
                  src={require('src/icons/svg/json.svg')}
                  width="70px"
                  height="70px"
                  className={classes.Applogo}
                  alt="file"
                />
              </div>
            </div>
            <div className={classes.jsontempContainer}>
              <DialogActions>
                <Button
                  onClick={() => downloadDataDump()}
                  style={{
                    backgroundColor: 'rgb(0, 0, 255)',
                    color: 'white',
                    fontWeight: 'normal',
                    width: '180px'
                  }}
                >
                  Download JSON
                </Button>
              </DialogActions>
            </div>
          </Grid>

          <Grid item md={6} sm={12}>
            <div className={classes.marginSpace}>
              <Typography className={classes.textCenter} variant="h6">
                Upload JSON
              </Typography>
            </div>

            <div className={classes.flexCenter}>
              <div className={classes.dropzoneStyle}>
                <DropzoneArea
                  onDrop={async ([file]) => {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                      var contents = e.target.result;
                      uploadDataDump(contents);
                    };
                    reader.readAsText(file);
                  }}
                  showPreviews={true}
                  maxFileSize={209715200}
                  showPreviewsInDropzone={false}
                  useChipsForPreview
                  previewGridProps={{
                    container: { spacing: 1, direction: 'row' }
                  }}
                  previewChipProps={{
                    classes: { root: classes.previewChip }
                  }}
                  previewText="Selected files"
                  /* style={dropzonestyle} */
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Page>
  );
};

export default InjectObserver(BackupAndRestore);