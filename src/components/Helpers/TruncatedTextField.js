import { TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';

const TruncatedTextField = ({ value, maxWords, isEdit, handleOnChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [onTextBoxFocus, setTextBoxFocus] = useState(false);
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const truncateText = (text) => {
    const words = text?.split(' ');
    if (words?.length <= maxWords) {
      return text;
    } else {
      return words ? (words.slice(0, maxWords).join(' ') + '...') : '';
    }
  };

  const shouldShowMoreButton = value?.split(' ')?.length > maxWords;

  return (
    <>
      <TextField
        value={onTextBoxFocus ? value : (expanded ? value : truncateText(value))}
        fullWidth
        disabled={!isEdit}
        margin="dense"
        variant='outlined'
        multiline
        InputProps={{
          disableUnderline: true,
          style: { padding: '0 5px 0 5px', fontSize: 'small' }
        }}
        InputLabelProps={{
          shrink: true
        }}
        onClick={() => shouldShowMoreButton && toggleExpanded()}
        onChange={handleOnChange}
        onFocus={() => setTextBoxFocus(true)}
      />
      {shouldShowMoreButton && !onTextBoxFocus && (
        <Typography variant="caption" onClick={toggleExpanded} style={{ cursor: 'pointer', marginTop: 5, color: 'red' }}>
          {!expanded ? 'More' : 'Less'}
        </Typography>
      )}
    </>
  );
};

export default TruncatedTextField;
