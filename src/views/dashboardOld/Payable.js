import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

import {
  Avatar,
  Card,
  Typography,
  colors,
  makeStyles,
  Box
} from '@material-ui/core';
import Svg from '../../components/svg';

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
    minWidth: '80%'
  },
  dFlex: {
    display: 'flex'
  },
  justifyContentBetween: {
    justifyContent: 'space-between'
  },
  cardContent: {
    padding: '20px',
    minHeight: '140px'
  },
  select: {
    fontSize: '18px',
    color: '#888'
  },
  icon: {
    width: '50px',
    height: '50px',
    margin: '0 !important',
    objectFit: 'contain'
  }
}));

const Payable = ({ className, ...rest }) => {
  const classes = useStyles();
  const [payable, setPayable] = useState();

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
          setPayable(parseFloat(amount).toFixed(2));
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    };
    initDB();
  }, []);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Box className={classes.cardContent} display="flex" flexGrow={1}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          flexGrow={1}
        >
          <Box>
            <Typography
              variant="h3"
              style={{ color: '#f15050', fontWeight: 'bold', fontSize: '18px' }}
            >
              {payable}
            </Typography>
          </Box>
          <Box>
            <Typography
              color="textPrimary"
              variant="h6"
              style={{ fontWeight: 'bold', fontSize: '16px' }}
            >
              Payable
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Avatar className={classes.avatar}>
            <Svg icon="payable_white" className={classes.icon} />
          </Avatar>
        </Box>
      </Box>
    </Card>
  );
};

Payable.propTypes = {
  className: PropTypes.string
};

export default Payable;
