import React, { forwardRef } from 'react';
import Slide from '@material-ui/core/Slide';

const SliderComponent = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export default SliderComponent;
