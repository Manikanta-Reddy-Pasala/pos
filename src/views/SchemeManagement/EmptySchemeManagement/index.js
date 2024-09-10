import React from 'react';
import { makeStyles } from '@material-ui/core';
import Controls from '../../../components/controls/index';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import './Style.css';
import scheme from 'src/icons/svg/scheme_image_add.svg';
import { toJS } from 'mobx';
import AddSchemeManagement from '../AddSchemeManagement';

const useStyles = makeStyles((theme) => ({
  newButton: {
    position: 'relative',
    borderRadius: 25
  },
  Applogo: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing(3),
    width: '35%'
  },
  divalign: {
    width: '500px',
    height: '500px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto'
  }
}));

const EmptyScheme = () => {
  const classes = useStyles();
  const store = useStore();
  const { handleSchemeManagementModalOpen } = store.SchemeManagementStore;
  const { schemeManagementDialogOpen } = toJS(store.SchemeManagementStore);

  return (
    <div className={classes.divalign}>
      <img src={scheme} className={classes.Applogo} alt="logo" />
      <p>
        <Controls.Button
          text="+ Add your first Scheme"
          size="small"
          variant="contained"
          color="primary"
          className={classes.newButton}
          onClick={() => handleSchemeManagementModalOpen()}
        />
      </p>
      {schemeManagementDialogOpen ? <AddSchemeManagement /> : null}
    </div>
  );
};

export default InjectObserver(EmptyScheme);