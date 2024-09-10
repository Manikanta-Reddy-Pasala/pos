import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { toJS } from 'mobx';
import { useStore } from '../../Mobx/Helpers/UseStore';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';

function EmployeeHeader() {
  const store = useStore();
  const { selectedEmployee } = toJS(store.EmployeeStore);

  return (
    <Grid container direction="row" style={{ height: '52px' }}>
      <Typography gutterBottom variant="h4" component="h4">
        {selectedEmployee.name}
      </Typography>

      <Grid container>
        <Grid item xs={6}>
          {selectedEmployee.userName ? (
            <Typography gutterBottom variant="h6" component="h6">
              User Name : {selectedEmployee.userName}{' '}
            </Typography>
          ) : (
            ''
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default InjectObserver(EmployeeHeader);
