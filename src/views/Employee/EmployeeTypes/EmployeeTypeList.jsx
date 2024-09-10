import React, { useEffect, useState } from 'react';
import {
  Typography,
  makeStyles,
  Paper,
  Button,
  Grid,
  withStyles
} from '@material-ui/core';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import BubbleLoader from 'src/components/loader';
import { toJS } from 'mobx';
import DeleteIcon from '@material-ui/icons/Delete';
import AddEmployeeType from './AddEmployeeType';

import { getEmployeeTypes } from 'src/components/Helpers/dbQueries/employeetypes';

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
    margin: '10px',
    height: '97%'
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
  subHeader: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    paddingLeft: '20px'
  },
  resetContain: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: '20px'
  }
});

const EmployeeTypeList = () => {
  const classes = useStyles();
  const store = useStore();
  const [isLoading, setLoadingShown] = useState(true);
  const { handleEmployeeTypesModalOpen, deleteEmployeeTypesData, getAllEmployeeTypes } =
    store.EmployeeTypesStore;
  const { employeeTypesDialogOpen, employeeTypesList } = toJS(store.EmployeeTypesStore);

  useEffect(() => {
    async function fetchData() {
      await getAllEmployeeTypes(); 
    }

    fetchData();
  }, []);

  useEffect(() => {
    setTimeout(() => setLoadingShown(false), 200);
  }, []);


  return (
    <Paper className={classes.root} title="Scheme Types">
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div>
            <div>
              <Grid className={classes.headerContain}>
                <div>
                  <Typography className={classes.header} variant="inherit">
                  Employee Types
                  </Typography>
                </div>
              </Grid>

              <Button
                onClick={handleEmployeeTypesModalOpen}
                style={{
                  backgroundColor: 'rgb(0, 0, 255)',
                  color: 'white',
                  fontWeight: 'bold',
                  width: '180px',
                  marginLeft: '20px',
                  marginTop: '20px'
                }}
              >
                ADD EMPLOYEE TYPE
              </Button>
              <div style={{marginLeft:'20px', marginTop:'20px', width:'40%'}} >
                <div style={{ display:'flex', flexDirection:'row'}}>
                </div>
                {(employeeTypesList && employeeTypesList.length > 0)
                  ? employeeTypesList.map((option, index) => (
                     
                      <div style={{display:'flex', flexDirection:'row' }}>
                        {/* <div style={{width:'10%', textAlign:'center', borderRight :'1px solid'}}>
                          {index + 1}
                        </div> */}  
                        <div style={{width:'50%', paddingLeft:'5px'}}>
                          {option.name}
                        </div>
                        <div style={{width:'25%', textAlign:'left'}}>
                          <DeleteIcon
                            onClick={(e) => {
                              deleteEmployeeTypesData(option);
                            }}
                            className={classes.icon}
                          />
                        </div>
                      </div>
                    ))
                  : 
                    <div style={{display:'flex', flexDirection:'row', marginTop: '16px' }}>                  
                      {/* <div style={{width:'50%', paddingLeft:'5px', textAlign:'center'}}>
                        No Scheme types available to display
                      </div>             */}
                    </div>
                  }
              </div>
            </div>
        </div>
      )}
      {employeeTypesDialogOpen ? <AddEmployeeType /> : null}
    </Paper>
  );
};

export default InjectObserver(EmployeeTypeList);
