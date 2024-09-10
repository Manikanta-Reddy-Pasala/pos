/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import { Button, Grid, TextField } from '@material-ui/core';
import styles from './style';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import * as Db from '../RxDb/Database/Database';
import * as Bd from '../components/SelectedBusiness';

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

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions
  } = useAutocomplete({
    id: 'product',
    options: productlist,
    onChange: props.onChange,
    getOptionLabel: (option) => option.name
  });
  useEffect(() => {
    getProductList();
  }, []);
  return (
    <div>
      <div {...getRootProps()}>
        <TextField
          variant="outlined"
          fullWidth
          InputProps={{
            classes: {
              input: classes.outlineinputProps
            }
          }}
          {...getInputProps()}
        />{' '}
      </div>
      {groupedOptions.length > 0 ? (
        <>
          <ul className={classes.listbox} {...getListboxProps()}>
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
                    + Add Product
                  </Button>
                </Grid>

                <Grid item xs={3}>
                  <Button
                    size="small"
                    disableRipple
                    style={{ position: 'relative', fontSize: 12 }}
                  >
                    Purchased price
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
            {groupedOptions.map((option, index) => (
              <li
                {...getOptionProps({ option, index })}
                style={{ padding: 10 }}
              >
                <Grid
                  container
                  // justify="space-between"
                  style={{ display: 'flex' }}
                  className={classes.listitemGroup}
                >
                  <Grid item xs={4} {...getOptionProps({ option, index })}>
                    <p>{option.name}</p>
                  </Grid>

                  <Grid item xs={3} {...getOptionProps({ option, index })}>
                    {''}
                    <p className={classes.listitem}>{option.purchasedPrice}</p>
                  </Grid>

                  <Grid item xs={2} {...getOptionProps({ option, index })}>
                    <p className={classes.credit}>{option.stockQty}</p>
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
