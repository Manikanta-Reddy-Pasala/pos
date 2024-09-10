import React, { useEffect } from 'react';

import './style.css';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { Typography, Grid } from '@material-ui/core';
import { toJS } from 'mobx';
import AddOrder from './Order/index';
import AddOrderV2 from './Order/indexV2';
import {getLevel3Categorieslist} from 'src/components/Helpers/BusinessCategoriesQueryHelper';
import * as Bd from '../../components/SelectedBusiness';
import {isProductAvailable} from 'src/components/Helpers/dbQueries/businessproduct';

const FloorDetails = () => {
  const store = useStore();

  const {
    openForNewSale,
    setLastSelectedTableNo,
    getTableDataFromKotData,
    loadKotDetails,
    setLevel3CategoriesList
  } = store.KotStore;

  const { kotDetails, openAddSaleDialog, openTouchAddSaleDialog } = toJS(store.KotStore);

  useEffect(() => {
    async function fetchData() {
      await loadKotDetails();
      handleChange();
    }

    fetchData();
  }, []);

  const handleChange = async () => {
    let name ="restaurant_level2";
    const businessData = await Bd.getBusinessData();
    let level3List = await getLevel3Categorieslist(name);
    let newList = [];
    for (let l3 of level3List) {
      const isAvail = await isProductAvailable({
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { 'categoryLevel3.name': { $eq: l3.name } }
        ]
      });
      if (isAvail === true) {
        newList.push(l3);
      }
    }
    setLevel3CategoriesList(newList);
  };

  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {kotDetails && kotDetails.length > 0
          ? kotDetails.map((ele, index) => (
              <Grid
                item
                xs={12}
                className="floor_card"
                key={index + 'floor'}
                style={{ background: ele.background, marginBottom: '10px' }}
              >
                <Typography variant="h3" className="headerTxt">
                  {ele.categoryName}
                </Typography>
                <Grid
                  container
                  justifyContent={ele.tableData.length > 6 ? '' : 'center'}
                >
                  {ele.tableData
                    ? ele.tableData.map((subEle, subIndex) => (
                        <Grid
                          item
                          xs={2}
                          className="table_card"
                          onClick={async (e) => {
                            await setLastSelectedTableNo(subEle.tableId);
                            if (
                              subEle.ordersData &&
                              subEle.ordersData !== undefined &&
                              subEle.ordersData.length > 0
                            ) {
                              // console.log('orders available ');
                              await getTableDataFromKotData(
                                ele,
                                subEle,
                                subIndex
                              );
                            } else {
                              // console.log('new sales');
                              await openForNewSale(ele, subEle, subIndex);
                            }
                          }}
                          key={subIndex + index + 'tables'}
                          style={{
                            background: subEle.background,
                            boxShadow: 'rgb(228 225 225) 0px 0px 12px 0px'
                          }}
                        >
                          <div>
                            <div style={{ padding: '6px 8px' }}>
                              <Typography
                                variant="h6"
                                style={{
                                  color: subEle.textColor
                                }}
                              >
                                {subEle.tableNumber}
                              </Typography>

                              <Typography
                                style={{
                                  color: subEle.textColor2,
                                  fontSize: 'small',
                                  fontWeight: '500'
                                }}
                              >
                                To Serve: {subEle.toServe}
                              </Typography>
                            </div>
                            {subEle.chairsAvailableInString &&
                              subEle.chairsUsedInString && (
                                <div className="aval_chair">
                                  <Typography
                                    style={{
                                      fontWeight: '900',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      fontSize: '0.8rem'
                                    }}
                                  >
                                    {subEle.chairsAvailableInString} Avai
                                  </Typography>
                                </div>
                              )}
                          </div>
                        </Grid>
                      ))
                    : null}
                </Grid>
              </Grid>
            ))
          : null}
      </Grid>
          {openTouchAddSaleDialog ? <AddOrderV2 /> : null}  
          {openAddSaleDialog ? <AddOrder /> : null}
    </div>
  );
};

export default InjectObserver(FloorDetails);
