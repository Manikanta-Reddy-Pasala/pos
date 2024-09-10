import { styled } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { Button } from '@material-ui/core';

export const BottomBar = styled(AppBar)({
  bottom: 0,
  top: 'auto',
  boxShadow: '0 0 4px 2px rgba(0,0,0,0.11)'
});

export const SecondaryButton = styled(Button)({
  color: 'white',
  marginRight: '1rem'
});
