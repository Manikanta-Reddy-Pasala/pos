import React from 'react';
import Card from '@material-ui/core/Card';
import Page from '../../components/Page';

import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import { useTheme } from '@material-ui/core/styles';
import './printer.css';

import { Container, Grid, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    paddingTop: 10
    // backgroundColor: theme.palette.background.paper,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  paper: {
    padding: 2
    // textAlign: 'center',
  },
  Table: {
    paddingTop: 10
  },
  containerLeft: {
    width: '12%',
    minHeight: '580px'
  },
  containerRight: {
    width: '88%'
  },
  cardList: {
    display: 'block',
    textAlign: 'center',
    paddingTop: '10px',
    color: 'grey'
  },
  containerInput: {
    flexGrow: 1
  },
  inputLabel: {
    alignSelf: 'center',
    textAlign: 'center'
  },
  selectEmpty: {
    width: '160px'
  },
  inputField: {
    paddingBottom: '15px'
  },
  flex: {
    display: 'flex'
  },

  checkboxRoot: {
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  icon: {
    borderRadius: 4,
    width: 26,
    height: 26,
    boxShadow:
      'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5'
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)'
    }
  },
  checkedIcon: {
    backgroundColor: '#ef5350',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      content: '""'
    },
    'input:hover ~ &': {
      backgroundColor: '#ef5350'
    }
  },
  center: {
    alignSelf: 'center',
    textAlign: 'center'
  },
  paperBox: {
    height: '200px',
    width: '200px'
  },
  paperContainer: {
    background: '#8080801a',
    padding: '30px'
  },
  MuiOutlinedInputInput: {
    padding: '0px'
  },
  checkBoxContainer: {
    paddingTop: '30px',
    paddingBottom: '30px'
  },
  headerContainer: {
    paddingTop: '30px',
    padding: '20px'
  },

  barcodeContainer: {
    textAlign: 'center',
    justifyContent: 'center',
    background: '#8080801a',
    display: 'grid',
    padding: '30px'
  },

  p: {
    fontWeight: 'bold'
  },
  card: {
    height: '100%'
  },
  cardLists: {
    paddingBottom: '10px',
    '&:hover': {
      cursor: 'pointer',
      color: '#ef5350'
    }
  },
  previrewBarcode: {
    paddingBottom: '20px',
    fontWeight: 'bold'
  }
});

const ColoredLine = ({ color }) => (
  <hr
    style={{
      color: 'grey',
      width: '100%'
    }}
  />
);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={'div'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  };
}

export default function Printers() {
  const classes = useStyles();
  const theme = useTheme();

  const bull = <span className={classes.bullet}>•</span>;
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Page className={classes.root} title="Expenses">
      <Container maxWidth={false} style={{ margin: 0, padding: 10 }}>
        <Grid container spacing={1}>
          <Grid item className={classes.containerLeft}>
            <Card className={classes.card}>
              <Grid container className={classes.cardList}>
                <Typography
                  gutterBottom
                  color="grey"
                  className={classes.cardLists}
                  variant="h6"
                  component="h6"
                >
                  Transaction
                </Typography>

                {/* <Typography className={classes.cardLists} gutterBottom color='grey' variant="h6" component="h6">
            Barcode Print
    </Typography>*/}

                <Typography
                  className={classes.cardLists}
                  gutterBottom
                  color="grey"
                  variant="h6"
                  component="h6"
                >
                  Invoice Print
                </Typography>
              </Grid>
            </Card>
          </Grid>
          {/* <Grid item className={classes.containerRight}>
               <Paper className={classes.paper}>

               <AppBar position="static">
                  <Tabs value={value} onChange={handleChange} aria-label="">
                    <Tab label="REGULAR PRINTER" {...a11yProps(0)} />
                    <Tab label="THERMAL PRINTER" {...a11yProps(1)} />
                  </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                <RegularPrinters/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <ThermalPrinters/>
                </TabPanel>
  

               </Paper>
             </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
