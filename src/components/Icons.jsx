import React from 'react';
const Icons = (props) =>
{
  return (
    <img
      alt='icon'
      src={props.icon}
      width='20px'
      height='20px'
      style={{ marginRight: '18px' }}
      {...props}
    />
  );
};
export default Icons;