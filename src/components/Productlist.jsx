/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import styles from './style';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import * as Db from '../RxDb/Database/Database';
import * as Bd from '../components/SelectedBusiness';
import { getProductName } from 'src/names/constants';


const Productlist = (props) => {
  const store = useStore();
  const classes = styles.useStyles();
  const [productlist, setproductlist] = useState([]);

  const { handleAddProductModalOpen } = store.ProductStore;

  const getProductList = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.businessproduct.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query
      .exec()
      .then((data) => {
        setproductlist(data.map((item) => item.toJSON()));
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  useEffect(() => {
    getProductList();
  }, [props]);

  return (
    <div>
      <div>
        <TextField
          variant="outlined"
          fullWidth
          InputProps={{
            classes: {
              input: classes.outlineinputProps
            }
          }}
        />{' '}
      </div>
      {productlist.length > 0 ? (
        <>
          <ul className={classes.listbox}>
            <li>
              <Grid container style={{ display: 'flex' }}>
                <Grid item xs={4}>
                  <Button
                    size="small"
                    style={{ position: 'relative', fontSize: 12 }}
                    color="secondary"
                    onClick={() => {
                      handleAddProductModalOpen();
                    }}
                  >
                    + Add {getProductName()}
                  </Button>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    size="small"
                    disableRipple
                    style={{ position: 'relative', fontSize: 12 }}
                  >
                    Sale price
                  </Button>
                </Grid>

                <Grid item xs={3}>
                  <Button
                    size="small"
                    disableRipple
                    style={{ position: 'relative', fontSize: 12 }}
                  >
                    Offer price
                  </Button>
                </Grid>

                <Grid item xs={2}>
                  <Button
                    size="small"
                    disableRipple
                    style={{ position: 'relative', fontSize: 12 }}
                  >
                    Stock
                  </Button>
                </Grid>
              </Grid>
            </li>
            {productlist.map((option, index) => (
              <li style={{ padding: 10 }}>
                <Grid
                  container
                  // justify="space-between"
                  style={{ display: 'flex' }}
                  className={classes.listitemGroup}
                >
                  <Grid item xs={4}>
                    <p>{option.name}</p>
                  </Grid>
                  <Grid item xs={3}>
                    {''}
                    <p className={classes.listitem}>{option.salePrice}</p>
                  </Grid>
                  <Grid item xs={3}>
                    {''}
                    <p className={classes.listitem}>
                      {option.offerPrice ? option.offerPrice : option.salePrice}
                    </p>
                  </Grid>

                  <Grid item xs={2}>
                    {/* {option.stockQty >= 0 ? ( */}
                    <p className={classes.credit}>{option.stockQty}</p>
                    {/* ) : ( */}
                    {/* <p className={classes.debit}>10</p> */}
                    {/* )} */}
                  </Grid>
                </Grid>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
};

export default injectWithObserver(Productlist);
