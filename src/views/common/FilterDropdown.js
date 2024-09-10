import React, { useState, useEffect } from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  OutlinedInput
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import * as searchSettingsHelper from 'src/components/Helpers/SearchSettingsHelper';

// Custom styled FormControl with reduced height and length
const RoundedFormControl = withStyles({
  root: {
    minWidth: 100, // Sets the minimum width of the dropdown
    margin: '2px', // Adds margin around the dropdown
    '& .MuiOutlinedInput-root': {
      borderRadius: 15, // Adjusts the roundness of the edges
      fontSize: '0.875rem', // Sets a smaller font size for the input text
      padding: '2px 5px', // Reduces padding inside the input box for a smaller appearance
      height: '32px'
    }
  }
})(FormControl);

const RoundedSelect = withStyles({
  root: {
    borderRadius: '15px', // Adjusts the roundness of the edges
    fontSize: '0.875rem', // Sets a smaller font size for the input text
    padding: '2px 5px', // Reduces padding inside the input box for a smaller appearance
    height: '32px',
    display: 'flex',
    alignItems: 'center'
  },
  outlined: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: '100px' // Adjusts the roundness of the edges
    }
  }
})(Select);

const RoundedInputLabel = withStyles({
  root: {
    fontSize: '0.875rem', // Sets a smaller font size for the label
    lineHeight: '1.6', // Adjusts the line height for the label to ensure visibility
    top: '-4px' // Adjusts the vertical position of the label
  }
})(InputLabel);

const FilterDropdown = ({ value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState(value);
  const options = searchSettingsHelper.getSalePeriod();

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <RoundedFormControl variant="outlined">
      <RoundedInputLabel id="filter-label">Filter</RoundedInputLabel>
      <RoundedSelect
        labelId="filter-label"
        id="filter"
        value={selectedValue}
        onChange={handleChange}
        label="Filter"
        input={<OutlinedInput notched label="Filter" />}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </RoundedSelect>
    </RoundedFormControl>
  );
};

export default FilterDropdown;
