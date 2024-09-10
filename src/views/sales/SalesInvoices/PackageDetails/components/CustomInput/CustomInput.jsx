import React from 'react';
import TextField from '@material-ui/core/TextField';

const CustomInput = (props) => {
  const { name, label, type, callback, value, variant, styles } = props;

  const isNumberInput = type === 'number';

  const validateInput = (event) => {
    const regex = /^[`abcdefghin0-9\b\t]+$/;
    const input = String.fromCharCode(event.keyCode);
    if (isNumberInput && !regex.test(input) && event.keyCode !== 190)
      event.preventDefault();
    return;
  };

  const handleInputChange = (event) => {
    let { name, value } = event?.target;
    callback(name, value);
  };

  const handleInputBlur = (event) => {
    let { name, value } = event?.target;
    value = isNumberInput ? parseFloat(value) : value;
    callback(name, value);
  };

  return (
    <TextField
      fullWidth
      InputLabelProps={{
        shrink: true
      }}
      variant={variant || 'outlined'}
      size="small"
      onKeyDown={validateInput}
      label={label}
      value={value || ''}
      inputProps={{ name, style: styles || { padding: '6px 8px !important' } }}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
    ></TextField>
  );
};

export default CustomInput;
