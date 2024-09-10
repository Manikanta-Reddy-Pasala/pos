import React from 'react';
import { SvgIcon } from '@material-ui/core';

const Forward = (props) =>
{
  return (
    <SvgIcon {...props}>
      <path d='M21,12L14,5V9C7,10 4,15 3,20C5.5,16.5 9,14.9 14,14.9V19L21,12Z' />
    </SvgIcon>);
};

export default Forward;
