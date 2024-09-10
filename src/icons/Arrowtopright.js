import React from 'react';
import { SvgIcon } from '@material-ui/core';

const Arrowtopright = (props) =>
{
  return (
    <SvgIcon {...props} style={{ backgroundColor: '#f44336', borderRadius: '5px' }}>
      <path d='M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z' fill='#ffffff' />  </SvgIcon>
  );
};

export default Arrowtopright;
