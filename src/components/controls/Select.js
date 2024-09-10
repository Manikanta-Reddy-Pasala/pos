import React from 'react';
import
{
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  input: {
    width: '25%'
  }
}));
export default function Select(props)
{
  const classes = useStyles();

  const { name, label, value, error = null, onChange, options } = props;
  return (
    <FormControl
      margin="dense"
      className={classes.input}
      {...(error && { error: true })}
    >
      {label ? <InputLabel>{label}</InputLabel> : null}
      <MuiSelect
        variant="outlined"
        name={name}
        value={value}
        onChange={onChange}
        defaultValue={options[0].label}>
        {options.map(item => (<MenuItem key={item.id} value={item.label}>{item.label}</MenuItem>))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
