import React from 'react';
import Loader from "react-js-loader";

const BubbleModalLoader = () =>
{
  return (
    <div style={{  display: 'flex',
    justifyContent: 'center',
    // position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
   }}>
    <Loader type="bubble-top" bgColor={"#EF524F"} size={50} />
    </div>
  );
};
export default BubbleModalLoader;