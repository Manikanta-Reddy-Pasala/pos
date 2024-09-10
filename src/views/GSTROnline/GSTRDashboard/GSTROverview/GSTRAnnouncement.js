import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { Card, CardContent, CardHeader, TextField, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import SubjectRoundedIcon from '@material-ui/icons/SubjectRounded';
import { blue, deepPurple, green } from "@material-ui/core/colors";
import InputAdornment from '@material-ui/core/InputAdornment';
import { flowRight } from 'lodash';

const styles = theme => ({
    root: {
      width: '100%', 
      padding: '10px',
      marginTop: theme.spacing.unit * 1,
      overflowX: 'auto',
    }
  });

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  }));

function GSTRAnnouncement(props) {
    const { classes } = props;
    
  return (
    <Paper className={classes.root} elevation={4}>
            <div style={{marginLeft:"10px", marginBottom:"20px"}}>
                <Typography variant="h5">
                    Announcements
                </Typography>
            </div>
            
            <div style={{marginLeft:"5px", marginBottom:"12px"}}>
                <TextField
                    disabled
                    id="filled-disabled"
                    label="Notification"
                    defaultValue="Information"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <SubjectRoundedIcon color="secondary" />
                        </InputAdornment>
                        ),
                    }}
                    InputLabelProps={{
                        color: 'primary',
                    }}
                />
            </div>
            <div style={{marginLeft:"5px", marginBottom:"12px"}}>
                <TextField
                    disabled
                    id="filled-disabled"
                    label="Notification"
                    defaultValue="Information"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <SubjectRoundedIcon color="secondary" />
                        </InputAdornment>
                        ),
                    }}
                    InputLabelProps={{ 
                        color: 'primary',
                    }}
                />
            </div>
            <div style={{marginLeft:"5px", marginBottom:"12px"}}>
                <TextField
                    disabled
                    id="filled-disabled"
                    label="Notification"
                    defaultValue="Information"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <SubjectRoundedIcon color="secondary" />
                        </InputAdornment>
                        ),
                    }}
                    InputLabelProps={{ 
                        color: 'primary',
                    }}
                />
            </div>
            <div style={{marginLeft:"5px", marginBottom:"12px"}}>
                <TextField
                    disabled
                    id="filled-disabled"
                    label="Notification"
                    defaultValue="Information"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <SubjectRoundedIcon color="secondary" />
                        </InputAdornment>
                        ),
                    }}
                    InputLabelProps={{
                        color: 'primary', 
                    }}
                />
            </div>
            <div style={{marginLeft:"5px", marginBottom:"12px"}}>
                <TextField
                    disabled
                    id="filled-disabled"
                    label="Notification"
                    defaultValue="Information"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <SubjectRoundedIcon color="secondary" />
                        </InputAdornment>
                        ),
                    }}
                    InputLabelProps={{ 
                        color: 'primary',
                    }}
                />
            </div>
    </Paper>
  );
}

GSTRAnnouncement.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(GSTRAnnouncement);