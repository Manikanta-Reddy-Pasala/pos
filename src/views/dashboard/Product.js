import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as Db from '../../RxDb/Database/Database';
import { Card, Typography, colors, makeStyles, Box } from '@material-ui/core';
import { FormControl, MenuItem, Select, Grid } from '@material-ui/core';
import * as Bd from '../../components/SelectedBusiness';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0px 0px 12px -3px #0000004a',
    borderRadius: '10px',
    display: 'flex'
  },
  avatar: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#f15050',
    height: '100px',
    width: '95px',
    borderRadius: '25px 0px 0px 25px',
    position: 'relative',
    right: '-20px'
  },
  differenceIcon: {
    color: colors.red[900]
  },
  differenceValue: {
    color: colors.red[900],
    marginRight: theme.spacing(1)
  },
  formControl: {
    position: 'relative',
    minWidth: '107%'
  },
  dFlex: {
    display: 'flex'
  },
  justifyContentBetween: {
    justifyContent: 'space-between'
  },
  cardContent: {
    padding: '20px',
    minHeight: '156px'
  },
  select: {
    fontSize: '14px',
    color: '#888'
  },
  icon: {
    width: '50px',
    height: '50px',
    margin: '0 !important',
    objectFit: 'contain'
  }
}));

const Product = ({ className, ...rest }) => {
  const classes = useStyles();
  const [payable, setPayable] = useState();

  const handleChange = (event) => {
    console.log(event);
  };

  useEffect(() => {
    const initDB = async () => {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      db.parties
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { balanceType: { $eq: 'Payable' } }
            ]
          }
        })
        .exec()
        .then((data) => {
          let parties = data.map((item) => {
            let output = {};
            output.balance = item.balance;
            return output;
          });

          let amount = 0;
          parties.forEach((element) => {
            amount = amount + parseFloat(element.balance);
          });
          setPayable(amount);
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    };
    initDB();
  });

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Box className={classes.cardContent} display="flex" flexGrow={1}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          flexGrow={1}
        >
          <Grid container>
            <Grid item xs={6}>
              <Box>
                <Typography
                  color="textPrimary"
                  variant="h6"
                  style={{ fontWeight: 'bold', fontSize: '16px' }}
                >
                  Product
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'end' }}>
              <Box>
                <FormControl className={classes.formControl}>
                  <Select
                    disableUnderline={true}
                    onChange={handleChange}
                    defaultValue={1}
                    className={classes.select}
                  >
                    <MenuItem value={1}>Today</MenuItem>
                    <MenuItem value={2}>This Month</MenuItem>
                    <MenuItem value={3}>Last Month</MenuItem>
                    <MenuItem value={4}>This Quarter</MenuItem>
                    <MenuItem value={5}>This Year</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography
                color="textPrimary"
                style={{
                  fontWeight: '500',
                  fontSize: '13px',
                  marginTop: '5px'
                }}
              >
                High Sold :
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                color="textPrimary"
                style={{
                  color: '#9dcb6a',
                  fontWeight: '500',
                  fontSize: '13px',
                  marginTop: '5px'
                }}
              >
                Shakthi Biriyani Mix
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                color="textPrimary"
                style={{
                  color: '#9dcb6a',
                  fontWeight: '500',
                  fontSize: '13px',
                  marginTop: '5px',
                  textAlign: 'end'
                }}
              >
                200
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography
                color="textPrimary"
                style={{
                  fontWeight: '500',
                  fontSize: '13px',
                  marginTop: '5px'
                }}
              >
                Low Sold :
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                color="textPrimary"
                style={{
                  fontWeight: '500',
                  fontSize: '13px',
                  marginTop: '5px',
                  color: '#f15050'
                }}
              >
                Boost Drink
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                color="textPrimary"
                style={{
                  fontWeight: '500',
                  fontSize: '13px',
                  marginTop: '5px',
                  textAlign: 'end',
                  color: '#f15050'
                }}
              >
                20
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Card>
  );
};

Product.propTypes = {
  className: PropTypes.string
};

export default Product;
