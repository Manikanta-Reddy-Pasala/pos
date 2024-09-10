import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    // margin: theme.spacing(1),
      minWidth: 150,
      "& .MuiOutlinedInput-input": {
        padding: "2px 3px"
      },
  },
  selectEmpty: {
    //   marginTop: theme.spacing(2),

  },
}));

export default function DropDown(props) {
  const classes = useStyles();
  const { data,id, onchange, label, list,variant, ...others } = props;
  return (
    <FormControl variant={variant||'outlined'} className={classes.formControl}
       margin='dense'>
      <InputLabel id="demo-simple-select-outlined-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id={id}
        value={data}
        onChange={onchange}
        label={label}
        {...others}
      >
        {list.map((e,index) => {
          return (<MenuItem key={index} value={e.value}>{e.item}</MenuItem>)
        })}
      </Select>
    </FormControl>
  )
}
