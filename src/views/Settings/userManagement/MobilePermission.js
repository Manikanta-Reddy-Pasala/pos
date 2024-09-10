import React, { useState, useEffect } from 'react';

import {
  Grid,
  makeStyles,
  Dialog,
  DialogTitle,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import useWindowDimensions from '../../../components/windowDimension';
import * as Db from '../../../RxDb/Database/Database';
import * as Bd from '../../../components/SelectedBusiness';
import { toJS } from 'mobx';

const useStyles = makeStyles({
  flex: {
    display: 'flex'
  },
  itemBox: {
    background: 'white',
    padding: '20px 32px 20px 15px',
    boxShadow: '0 0 0 1px rgb(63 63 68 / 5%), 0 1px 2px 0 rgb(63 63 68 / 15%)',
    borderRadius: '5px',
    fontSize: 'small',
    margin: '20px'
  },
  features: {
    marginTop: '10px',
    marginBottom: '-10px',
    width: 'fit-content',
    color: '#EF5350',
    cursor: 'pointer',
    '&:hover': {
      background: '#ffedec'
    }
  }
});

function MobilePermissions() {
  const store = useStore();
  const classes = useStyles();
  const [openEditFeatures, setEditFeatureOpen] = React.useState(false);
  const [mainIndex, setMainIndex] = React.useState();
  const { height } = useWindowDimensions();
  const [rowData, setRowData] = useState([]);

  const { selectedEmployee, selectedFeatureList } = toJS(
    store.MobileUserPermissionStore
  );
  const {
    updateData,
    setEmployeeSelected,
    setFeaturesSelected,
    updateFeatureSelection
  } = store.MobileUserPermissionStore;

  useEffect(() => {
    const loadPaginationData = async () => {
      await getEmployees();
    };

    loadPaginationData();
  }, []);

  const getEmployees = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let query = db.mobileuserpermissions.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.$.subscribe((data) => {
      if (!data) {
        return;
      }

      let employeeList = data.map((item) => {
        let employee = {};
        employee.id = item.id;
        employee.name = item.name;
        employee.userName = item.userName;
        employee.businessFeaturesList = item.businessFeatures;
        return employee;
      });

      setRowData(employeeList);
    });
  };

  const handleEditFeaturesClose = () => {
    setEditFeatureOpen(false);
  };

  const saveData = () => {
    updateData();
    setEditFeatureOpen(false);
  };

  return (
    <div style={{ margin: '2%', height: height - 167 + 'px' }}>
      <Grid container spacing={8}>
        {rowData &&
          rowData.map((ele, index) => (
            <Grid className={classes.itemBox}>
              <div key={index}>
                <p>Name : {ele.name}</p>
                <p>User Name : {ele.userName}</p>
                <p
                  className={classes.features}
                  onClick={(e) => {
                    setEmployeeSelected(rowData[index]);
                    setFeaturesSelected(rowData[index].businessFeaturesList);
                    setEditFeatureOpen(true);
                    setMainIndex(index);
                  }}
                >
                  Edit Features
                </p>
              </div>
            </Grid>
          ))}
      </Grid>
      <Dialog
        open={openEditFeatures}
        onClose={handleEditFeaturesClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>
          <h3>Edit Features</h3>
        </DialogTitle>
        <DialogContent>
          <FormGroup>
            <Grid container>
              {selectedFeatureList &&
                selectedFeatureList.map((ele, index) => (
                  <Grid item xs={6} key={index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={ele.permission}
                          onChange={(e) => {
                            updateFeatureSelection(index, e.target.checked);
                          }}
                          value="feature"
                        />
                      }
                      label={ele.displayName}
                    />
                  </Grid>
                ))}
            </Grid>
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditFeaturesClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={saveData} color="secondary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default InjectObserver(MobilePermissions);
