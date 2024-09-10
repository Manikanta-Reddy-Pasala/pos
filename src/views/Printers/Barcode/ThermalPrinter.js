import React from 'react';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import '../printer.css';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import clsx from 'clsx';


import {
    Container,
    Grid,
    makeStyles,Typography,TextField,Checkbox,RadioGroup,Radio,FormLabel 
  } from '@material-ui/core';
  const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        paddingTop: 10,
        // backgroundColor: theme.palette.background.paper,
      },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    paper: {
        padding: 2,
        // textAlign: 'center',
      },
      Table:{
        paddingTop:10
      },
      containerLeft:{
        width:'12%'
      },
      containerRight:{
        width:'88%'

      },
      cardList:{
        display: 'block',
       textAlign: 'center',
       paddingTop:'10px',
       color:'grey'
      },
      containerInput:{
        flexGrow: 1,
        padding:'12px'
      },
      inputLabel:{
        alignSelf: 'center',
        textAlign: 'center'
      },
      selectEmpty:{
        width: '160px'
      },
      inputField:{
        paddingBottom: '15px'
      },
      flex:{
        display:'flex'
      },

      checkboxRoot: {
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
      icon: {
        borderRadius: 4,
        width: 26,
        height: 26,
        boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: '#f5f8fa',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '$root.Mui-focusVisible &': {
          outline: '2px auto rgba(19,124,189,.6)',
          outlineOffset: 2,
        },
        'input:hover ~ &': {
          backgroundColor: '#ebf1f5',
        },
        'input:disabled ~ &': {
          boxShadow: 'none',
          background: 'rgba(206,217,224,.5)',
        },
      },
      checkedIcon: {
        backgroundColor: '#ef5350',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
          display: 'block',
          width: 16,
          height: 16,
          content: '""',
        },
        'input:hover ~ &': {
          backgroundColor: '#ef5350',
        },
      },
      center:{
        alignSelf: 'center',
        textAlign: 'center'
      },
      paperBox:{
        height: '200px',
        width: '200px',
      },
      paperContainer:{
        background: "#8080801a",
        padding: '30px'
      },
      MuiOutlinedInputInput:{
        padding: '0px'
      },
      checkBoxContainer:{
        paddingTop: '30px',
        paddingBottom: '30px'
    
      },
      headerContainer:{
        paddingTop: '30px',
        padding:'20px'
      },

          barcodeContainer:{
            textAlign: 'center',
            justifyContent: 'center',
            background: "#8080801a",
            display: 'grid',
            padding:'30px',
          },

        p:{
          fontWeight:'bold'
        },
        card:{
          height: '100%'
        },
        cardLists:{
          paddingBottom:'10px',
          '&:hover': {
            cursor: 'pointer',
            color:'#ef5350',
          },
        },
        previrewBarcode:{
          paddingBottom: '20px',
          fontWeight: 'bold'
        }

  });

  const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: 'grey',
            width: '100%',
        }}
    />
);


  export default function  ThermalPrinters() {

    const classes = useStyles();
    const theme = useTheme();

    const bull = <span className={classes.bullet}>•</span>;
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    const handleChangeIndex = (index) => {
      setValue(index);
    };

    return (
        <Grid>

<Grid  className={classes.containerInput}>
                  <Grid container spacing={5}>

                    {/* -----------------col 1---------------------- */}
                  
                  <Grid style={{display:'flex'}} xs={4}>
                  <Grid style={{alignSelf:'center'}}  item sm={6}>
                       <p>Measuremnt Unit</p>
                  </Grid>
                 <Grid item sm={6}>    
                  <FormControl className={classes.inputField}>
                      <Select
                        labelId="demo-simple-select-placeholder-label-label"
                        id="demo-simple-select-placeholder-label"
                        className={classes.selectEmpty}
                      >
                        <MenuItem value={'cm'}>Centimeters(cm)</MenuItem>
                        <MenuItem value={'m'}>Meter(m)</MenuItem>
                      </Select>
                    </FormControl>
                    </Grid>
                  </Grid>
                    {/* -----------------col 2---------------------- */}

                  <Grid style={{display:'flex'}} xs={4}>
                  <Grid  className={classes.inputLabel} item sm={6}>
                       <p >Barcode Height</p>
                  </Grid>
                 <Grid item sm={3}>    
                 <div  className={classes.inputField}>
                 <TextField
                    id="outlined-size-normal"
                    defaultValue=""
                    variant="outlined"
                  />
                  </div>
                    </Grid>
                  </Grid>
                    {/* -----------------col 3---------------------- */}

                    <Grid style={{display:'flex'}} xs={4}>
                  <Grid className={classes.inputLabel} item sm={6}>
                       <p >Barcode Width</p>
                  </Grid>
                 <Grid item sm={3}>    
                 <TextField
                    id="outlined-size-normal"
                    defaultValue=""
                    variant="outlined"
                  />
                  
                    </Grid>
                  </Grid>

{/* ----------------------------col 4-------------------------------- */}

            <Grid style={{display:'flex',paddingTop:'20px'}} xs={4}>
                  <Grid style={{alignSelf:'center'}}  item sm={6}>
                       <p> No. of Barcodes per row</p>
                  </Grid>
                 <Grid item sm={3}>    
                 <TextField
                    id="outlined-size-normal"
                    defaultValue=""
                    variant="outlined"
                  />
                  
                    </Grid>
                  </Grid>


                  <Grid style={{display:'flex',paddingTop:'20px'}} xs={4}>
                  <Grid style={{alignSelf:'center'}}  item sm={7}>
                       <p> No. of Barcodes per column</p>
                  </Grid>
                 <Grid item sm={3}>    
                 <TextField
                    id="outlined-size-normal"
                    defaultValue=""
                    variant="outlined"
                  />
                  
                    </Grid>
                  </Grid>


{/* =========================================================== */}
<Grid style={{display:'flex', paddingTop:'20px'}} xs={4}>
                  <Grid className={classes.inputLabel}  item sm={6}>
                       <p >Paper Height</p>
                  </Grid>
                 <Grid item sm={3}>    
                 <TextField
                    id="outlined-size-normal"
                    defaultValue=""
                    variant="outlined"
                  />
                  
                    </Grid>
                  </Grid>


{/* ------------------------------------------------------ */}

          <Grid style={{display:'flex',paddingTop:'20px'}} xs={4}>
                  <Grid style={{alignSelf:'center'}} item sm={6}>
                       <p >Paper Width</p>
                  </Grid>
                 <Grid item sm={3}>    
                 <TextField
                    id="outlined-size-normal"
                    defaultValue=""
                    variant="outlined"
                  />
                  
                    </Grid>
                  </Grid>
{/* ------------------------------------------------- */}
                  </Grid>
                  </Grid>

        {/* --------------Input fields end----------------- */}

            <div style={{paddingTop: '40px'}}>
            <Grid container className={classes.regularPrinter} >
          <Grid item xs={12}>
              <div className={classes.selectOption}>
            <FormControlLabel control={<Checkbox name="checkedC" />} label="Default Thermal Printer" />
            </div>
          </Grid>
          </Grid>
          </div>


          <div style={{paddingTop: '30px'}}>
            <Grid container className={classes.regularPrinter} >
          <Grid item xs={12}>
              <div className={classes.selectOption}>
            <FormControlLabel control={<Checkbox name="checkedC" />} label="Auto Cut after Print" />
            </div>
          </Grid>
          </Grid>
          </div>
{/* ------------------------------------------------------------------------------------ */}


<Grid  style={{display: 'flex'}}>
<Grid container spacing={3}>
<Grid  xs={7} >
<div className={classes.checkBoxContainer}>

<ColoredLine color="red" />
<Grid xs={12} style={{display: 'flex', paddingTop: '20px'}}>
<Grid style={{alignSelf: 'center'}} xs={5}>
<p >Print Product Name as</p>
</Grid>

<Grid xs={5}>
        <FormControl component="fieldset">
      {/* <FormLabel component="legend">labelPlacement</FormLabel> */}
      <RadioGroup row aria-label="position" name="position" defaultValue="top">
  
        <FormControlLabel
          value="header"
          control={<Radio color="primary" />}
          label="Header"
          labelPlacement="end"
        />
        <FormControlLabel
          value="footer"
          control={<Radio color="primary" />}
          label="Footer"
          labelPlacement="end"
        />
      </RadioGroup>
    </FormControl>
</Grid>

<Grid xs={2} style={{alignSelf: 'center'}}>
<p style={{fontWeight: 'bold'}}>(or)</p>
</Grid>
</Grid>
</div>

<div  className={classes.headerContainer}>
<Grid  xs={8}>
<Grid container spacing={3}>
        <Grid xs={6} style={{display:'block'}}>
        <Grid item xs={8}>
             <p >Header</p>
        </Grid>
       <Grid item xs={8}>    
       <TextField
          id="outlined-size-normal"
          defaultValue=""
          variant="outlined"
        />
      </Grid>
      </Grid>


      <Grid xs={6} style={{display:'block'}}>
        <Grid item xs={12}>
             <p >Footer</p>
        </Grid>
       <Grid item xs={12}>    
       <TextField
          id="outlined-size-normal"
          defaultValue=""
          variant="outlined"
        />
      </Grid>
      </Grid>
      </Grid>
</Grid>

</div>

</Grid>

<Grid contain xs={12} style={{padding:'10px'}} >
<Grid >
<Paper  className={classes.barcodeContainer}>
<p className={classes.previrewBarcode}>Barcode Preview</p>
<Card className={classes.paperBox}>

  </Card>

</Paper>
</Grid>
</Grid>

</Grid>
</Grid>
</Grid>
    );
  };
  
 