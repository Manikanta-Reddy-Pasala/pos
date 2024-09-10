import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 200,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1)

  },
  texthead: {
    textColor: '#86ca94'
  },
  text: { textColor: '#faab53' }
}));

export default function CustomCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root} style={{ backgroundColor: props.color }}>
      <Typography className={classes.texthead} >{props.title}</Typography>
      <Typography className={classes.text}>{props.amount}</Typography>
    </Card>
  );
}
