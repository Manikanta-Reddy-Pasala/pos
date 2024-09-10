import React from 'react';
import { SvgIcon } from '@material-ui/core';

const Arrowbottomleft = (props) =>
{
  return (
    <SvgIcon {...props} style={{ backgroundColor: '#43A047', borderRadius: '5px' }}>
      <path d='M19,6.41L17.59,5L7,15.59V9H5V19H15V17H8.41L19,6.41Z' fill='#ffffff' />  </SvgIcon>
  );
};

export default Arrowbottomleft;
