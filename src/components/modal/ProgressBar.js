import * as React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));



function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress style={{height:'10px',backgroundColor:'#ef535038'}}  variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" style={{color:'#000'}}>{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function ProgressBar(props) {
  const classes = useStyles();
  const [progress, setProgress] = React.useState(0);
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    // const timer = setInterval(() => {
    //   setProgress((prevProgress) => (prevProgress >= 100 ? 1 : prevProgress + 1));
    // },100);
    // return () => {
    //   clearInterval(timer);
    // };
    setProgress(props.perc);
  }, [props]);

  return (
    <div>
      <style>{`
      .MuiLinearProgress-barColorPrimary {
          background-color: #EF5350 !important;
      }
      .bg_white{
        padding: 50px;
        background-color: #fff;
        border-radius: 5px;
      }
      `}
      </style>
      <Backdrop className={classes.backdrop} open={open}>
        <Box className='bg_white' sx={{ width: '40%' }}>
          <LinearProgressWithLabel value={progress} />
          <Typography variant="body2" style={{color:'#000',textAlign:'center',fontSize:'18px',marginTop:'14px'}}>Please hold on as we retrieve your data.</Typography>
        </Box>
      </Backdrop>
    </div>
  );
}