import React, { useState, useEffect } from 'react';
import injectWithObserver from '../../Mobx/Helpers/injectWithObserver';
import {
    makeStyles,
    Grid,
  } from '@material-ui/core';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';

const useStyles = makeStyles((theme) => ({
    a4sheet : {
      width : '210mm',
      height : '272mm',
      boxShadow: 'rgb(204 204 204) 0px 0px 10px',
    },
    labelStyle: {
      width: '64mm',
      height: '34mm',
    },
    labelDivStyle: {
      boxShadow: 'rgb(204 204 204) 0px 0px 10px',
      margin: '5px',
      padding: '10px',
      height: '29mm',
      textAlign: 'Left',
    },
    address: {
      whiteSpace: 'break-spaces',
      maxHeight: '60px',
      /* overflow: 'hidden', */
      
    }
   
  }));

  const RegularWithoutBarcodePreview = (props) => {

    const classes = useStyles();
    const stores = useStore();

    const { withoutBarcodeFinalArray } = toJS(stores.BarcodeStore);

    return (
      <>
         {withoutBarcodeFinalArray.map((subArray,index) => (
           <>
            <div className={classes.a4sheet}>       
              <Grid container>
                {subArray.map((ele,index) => (
                  <>
                    {index <= 2 ? ( 
                      <Grid item xs={4} key={index} className={classes.labelStyle} style={{marginTop:'5px'}}>
                        <div className={classes.labelDivStyle} >
                          <div>{ele.name}</div>
                          <div className={classes.address} style={{fontSize:'small'}}>{ele.line}</div>
                          <div style={{fontSize:'small'}}>{ele.footer}</div>
                          <div style={{fontSize:'small'}}>{ele.addtionalTextTwo}</div>
                        </div>
                      </Grid>
                     ) : (
                      <Grid item xs={4} key={index} className={classes.labelStyle}>
                        <div className={classes.labelDivStyle} >
                          <div>{ele.name}</div>
                          <div className={classes.address} style={{fontSize:'small'}}>{ele.line}</div>
                          <div style={{fontSize:'small'}}>{ele.footer}</div>
                          <div style={{fontSize:'small'}}>{ele.addtionalTextTwo}</div>
                        </div>
                      </Grid>
                    )}
                  </>
                ))} 
                        
              </Grid>
            </div>    
          </>
        ))}
        </>
    );

  }

  export default injectWithObserver(RegularWithoutBarcodePreview);