import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
} from '@material-ui/core';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { toJS } from 'mobx';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import style from 'src/components/Helpers/Classes/commonStyle';
import SessionGroupRegularPrint from '../Printers/ComponentsToPrint/SessionGroupRegularPrint';

const ViewSessions = (props) => {
  const classes = style.useStyles();
  const { DialogTitle } = style;

  const store = useStore();
  const { viewSessionDialogOpen, sessionGroup } = toJS(store.SessionGroupStore);
  const { handleViewSessionDialogClose } =
    store.SessionGroupStore;

    useEffect(() => {

      sessionGroup.sessionList.map((item, index) => {
        item.sessionNo = index + 1;
    })
     
    }, [sessionGroup])

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={'xl'}
        open={viewSessionDialogOpen}
        onClose={handleViewSessionDialogClose}
      >
        <DialogTitle id="product-modal-title" style={{padding: '0px'}}>
        
          <IconButton
            aria-label="close"
            onClick={handleViewSessionDialogClose}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
           <SessionGroupRegularPrint data={sessionGroup} viewHistory={true}></SessionGroupRegularPrint>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InjectObserver(ViewSessions);