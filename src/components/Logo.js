import React from 'react';
import logo from '../icons/OneShell_Logo.svg'
const Logo = (props) =>
{
  return (
    <img
      alt='Logo'
      src={logo}
      width='4%'
      height='4%'
      {...props}
    />
  );
};
export default Logo;