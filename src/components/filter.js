import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Paper, Grid} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        width:'80%',
        left:8 ,
        display: "flex",
        wrap: "nowrap",
        "& .MuiOutlinedInput-input": {
            padding: "12px 23px"
        },
    },
    pageContent: {
        position:'relative',
        margin: theme.spacing(1),
        width:'100%',
        height:'50%', 
    },
    style:
    {
        position:'relative',
        width:'80%',
        left:'15px',
    },
    newButton: {
        position: 'relative',
        backgroundColor: 'white',
        display:'flex',
        flexDirection:'row',
        color: 'black',
        right: '20px',
        justifyContent: 'space-around',
        textAlign: 'center',
        width: '15%',
        height: '35%',
        fontSize: 13,
        bottom: 20,
    },
    btnGroups : {
      display : 'flex',
      flexDirection : 'row',
      justifyContent : 'center',
      width : '100%',
      marginLeft:'35px',
      paddingTop:'30px',
      fontSize:12,
      justifyItems:'space-around'
    }
  }));

export default function Filter() {
    const classes = useStyles();
  const [data, setdata] = React.useState('');

  const handleChange = (event) => {
    setdata(event.target.value);
  };
    return (
        <Grid container spacing={0}>
        <Grid item xs>
        <FormControl variant="outlined" className={classes.formControl} margin='dense'>
        <InputLabel id="demo-simple-select-outlined-label">Contains</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={data}
          onChange={handleChange}
          label="Data"
        >
          <MenuItem value="">
            <em>Contains</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
        <Grid item className={classes.style}>
        <TextField inputProps={{
       style: {
         padding: 12
       }
    }} id="outlined-basic" variant="outlined" />
        </Grid>
        <Grid>
          <div className={classes.btnGroups}>
        <Button
         text="Clear"
        variant="contained"
        className={classes.newButton}
        style={{position:'relative',color:'red',marginRight:'10px'}}
        onClick={() => {console.log("Add Sale") }}
        >Clear</Button>
        <Button
         text="Apply"
        variant="contained"
        className={classes.newButton}
        style={{position:'relative',backgroundColor:'red',color:'white'}}
        onClick={() => {console.log("Add Sale") }}
        >Apply</Button>
        </div>
        </Grid>
      </Grid>
    </Grid>
    )
}


// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';
// import { Paper, Grid} from '@material-ui/core';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
// import SelectMenu from './Select';
// import { height } from '@material-ui/system';

// const useStyles = makeStyles((theme) => ({
//     formControl: {
//         margin: theme.spacing(1),
//         width:'200%',
//         // minWidth: '120%',
//         left:8 ,
//         display: "flex",
//         wrap: "nowrap",
//         "& .MuiOutlinedInput-input": {
//             padding: "12px 23px"
//         },
//     },
//     pageContent: {
//         position:'relative',
//         margin: theme.spacing(1),
//         width:'15%',
//         justifyContent:'center',
//         textAlign:'center',
//         height:'100%',
//         marginLeft:'20px',
//         paddingLeft:'10px'
//         // padding: theme.spacing(1),        
//     },
//     style:
//     {
//         position:'relative',
//         width:'80%',
//         left:'15px',
//     },
//     newButton: {
//         position: 'absolute',
//         backgroundColor: 'white',
//         color: 'white',
//         right: '20px',
//         // borderTopLeftRadius:30,
//         // borderRadius: 30,
//         justifyContent: 'center',
//         textAlign: 'center',
//         width: '15%',
//         height: '35%',
//         padding: '1px',
//         fontSize: 13,
//         bottom: 20,
//     },
//     selectEmpty: {
//     //   marginTop: theme.spacing(2),
//     },
//   }));

// export default function Filter() {
//     const classes = useStyles();
//   const [data, setdata] = React.useState('');

//   const handleChange = (event) => {
//     setdata(event.target.value);
//   };
//     return (
//         <Grid container spacing={0}>
//                 <Grid item xs={12}>
//                     <Paper className={classes.pageContent}>
//                     <Grid container spacing={1}>
//                 <Grid item>
//                     <SelectMenu name='Contains' label='Contains' value='data' onChange={() => {console.log("Add Sale")}} options={['ten','one','two']}/>
//         {/* <FormControl variant="outlined" className={classes.formControl} margin='dense'>
//         <InputLabel id="demo-simple-select-outlined-label">Contains</InputLabel>
//         <Select
//           labelId="demo-simple-select-outlined-label"
//           id="demo-simple-select-outlined"
//           value={data}
//           onChange={handleChange}
//           label="Data"
//         >
//           <MenuItem value="">
//             <em>Contains</em>
//           </MenuItem>
//           <MenuItem value={10}>Ten</MenuItem>
//           <MenuItem value={20}>Twenty</MenuItem>
//           <MenuItem value={30}>Thirty</MenuItem>
//         </Select>
//       </FormControl> */}
//       </Grid>
//         <Grid item className={classes.style}>
//         <TextField inputProps={{
//        style: {
//          padding: 12
//        }
//     }} id="outlined-basic" variant="outlined" />
//         </Grid>
//         <Grid item >
//         <Button
//          text="Clear"
//         variant="contained"
//         // startIcon={<AddIcon />}
//         className={classes.newButton}
//         style={{position:'relative',left:'1px',width:'15%',height:'45%',top:'5px',color:'red',fontSize:12}}
//         onClick={() => {console.log("Add Sale") }}
//         >Clear</Button>
//         <Button
//          text="Apply"
//         variant="contained"
//         // startIcon={<AddIcon />}
//         className={classes.newButton}
//         style={{position:'relative',left:'70px',width:'52%',height:'45%',bottom:'15px',backgroundColor:'red',color:'white',fontSize:12}}
//         onClick={() => {console.log("Add Sale") }}
//         >Apply</Button>
//         </Grid>
//       </Grid>
//       </Paper>
//     </Grid></Grid>
//     )
// }