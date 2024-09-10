import React from 'react';
import Loader from "react-js-loader";

const BubbleLoader = () =>
{
  return (
    <div style={{  display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '14%',
    right: 0,
   }}>
    <Loader type="bubble-top" bgColor={"#EF524F"} size={50} />
    </div>
  );
};
export default BubbleLoader;