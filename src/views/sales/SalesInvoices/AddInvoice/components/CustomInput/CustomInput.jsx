import React from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const CustomInput = (props) => {
  const {
    name,
    label,
    options,
    type,
    callback,
    value,
    placeholderText,
    ...rest
  } = props;

  const isSelectInput = type === 'select';

  const isNumberInput = type === 'number';

  let MenuItems = [];

  if (isSelectInput && options?.length) {
    let placeholder = (
      <MenuItem value="">{placeholderText || 'Select'}</MenuItem>
    );
    let Menus = options.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ));
    MenuItems = [placeholder, ...Menus];
  }

  const handleInputChange = (event) => {
    const { name, value } = event?.target;
    callback(name, value);
  };

  const validateInput = (event) => {
    const regex = /^[`abcdefghin0-9\b\t]+$/;
    const input = String.fromCharCode(event.keyCode);
    if (isNumberInput && !regex.test(input) && event.keyCode !== 190)
      event.preventDefault();
    return;
  };

  return (
    <TextField
      fullWidth
      id="outlined-basic"
      inputProps={{ name, type: type === 'date' ? 'date' : 'text' }}
      InputLabelProps={{
        shrink: true
      }}
      {...(isSelectInput && { select: true })}
      label={label}
      value={value || ''}
      variant="outlined"
      onChange={handleInputChange}
      onKeyDown={validateInput}
      {...(isSelectInput && { SelectProps: { displayEmpty: true } })}
      {...rest}
    >
      {isSelectInput && MenuItems}
    </TextField>
  );
};

export default CustomInput;
