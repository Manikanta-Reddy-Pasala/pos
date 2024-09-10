import React, { useState } from 'react';
import { toJS } from 'mobx';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';

import {
  Grid,
  makeStyles,
  Typography,
  FormControlLabel,
  Checkbox,
  Toolbar,
  TextField,
  Button,
  Radio
} from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import * as Db from '../../../../RxDb/Database/Database';
import * as Bd from '../../../../components/SelectedBusiness';

const useStyles = makeStyles((theme) => ({
  displayFlex: {
    display: 'flex'
  },
  textfieldStyle: {
    marginLeft: 'auto',
    width: '72%',
    marginBottom: '5px'
  },
  fontSizeSmall: {
    fontSize: 'small'
  },
  ToolbarStyle: {
    background: 'white',
    marginTop: '0px',
    boxShadow: '0px 0px 8px #d4d2d2'
  },
  marginTopAuto: {
    marginTop: 'auto'
  },
  billTypeTextField: {
    marginTop: '18%',
    width: '87%',
    marginLeft: '13px'
  },
  specialDayTextField: {
    width: '87%',
    marginLeft: '13px',
    backgroundColor: 'white',
    padding: '5px',
    marginTop: '10px',
    borderRadius: '8px'
  },
  BillTypeListbox: {
    minWidth: '14%',
    marginLeft: '14px',
    margin: 0,
    padding: 5,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    textAlign: 'left',
    border: '1px solid rgba(0,0,0,.25)',
    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    },
    '& li:active': {
      backgroundColor: '#2977f5',
      color: 'white'
    }
  },
  DayTypeListbox: {
    minWidth: '11%',
    marginLeft: '15px',
    margin: 0,
    padding: 5,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    textAlign: 'left',
    border: '1px solid rgba(0,0,0,.25)',
    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    },
    '& li:active': {
      backgroundColor: '#2977f5',
      color: 'white'
    }
  },
  liBtn: {
    width: '100%',
    padding: '7px 8px',
    textTransform: 'none',
    fontWeight: '300',
    fontSize: 'small',
    '&:focus': {
      background: '#ededed',
      outline: 0,
      border: 0,
      fontWeight: 'bold'
    }
  },
  dayTypeStyle: {
    background: '#EFEFEF',
    marginTop: '5px'
  },
  alignCenter: {
    marginTop: 'auto',
    marginBottom: 'auto',
    textAlign: 'center'
  },
  alignStart: {
    textAlign: 'start'
  },
  alignEnd: {
    textAlign: 'end'
  },
  dateFieldStyle: {
    background: 'white',
    padding: '5px',
    borderRadius: '4px'
  },
  commentsField: {
    marginTop: '8%',
    marginLeft: '4%',
    width: '100%'
  }
}));

const TempleComponent = () => {
  const classes = useStyles();
  const stores = useStore();

  const {
    setGothra,
    setRashi,
    setStar,
    setTempleSpecialDayName,
    setTempleCustomComments,
    setTempleSpecialDayStartDate,
    setTempleSpecialDayEndDate,
    setTempleSpecialDayTimings,
    setTempleOccursEveryYear,
    setTempleSpecialDayEnabled
  } = stores.SalesAddStore;

  const { saleDetails } = toJS(stores.SalesAddStore);

  const [specialDayList, setspecialDayList] = React.useState([]);
  const customDayList = ['Birthday', 'Ceremony', 'Pooja', 'Tithi', 'Other'];
  const [specialDayMenuOpen, handleSpecialDayMenuOpen] = React.useState(false);
  const [customDayMenuOpen, handleCustomDayMenuOpen] = React.useState(false);
  const [specialDayType, setSpecialDayType] = React.useState(
    saleDetails.specialDayEnabled ? 'specialDay' : 'customDay'
  );
  const [specialDayNameWhileEditing, setSpecialDayNameWhileEditing] =
    useState('');

  const handleSpecialDay = (val) => {
    handleSpecialDayMenuOpen(false);
  };

  const handleCustomDay = (val) => {
    handleCustomDayMenuOpen(false);
  };

  const getSpecialDaysData = async (value) => {
    if (value) {
      console.log('value::', value);
      const db = await Db.get();

      var regexp = new RegExp('^.*' + value + '.*$', 'i');
      const businessData = await Bd.getBusinessData();

      await db.specialdays
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                $or: [{ name: { $regex: regexp } }, { date: { $eq: value } }]
              }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            // No customer is available
            return;
          }
          if (data && data.length > 0) {
            let results = data.map((item) => item.toJSON());
            console.log('results::', results);

            setspecialDayList(results);
          }
        })
        .catch((err) => {
          setspecialDayList([]);
        });
    } else {
      setspecialDayList([]);
    }
  };

  return (
    <Toolbar className={classes.ToolbarStyle}>
      <Grid container style={{ marginTop: '-6px' }}>
        <Grid item xs={3} style={{ marginBottom: '12px', marginRight: '25px' }}>
          <div className={classes.displayFlex}>
            <Typography
              className={[classes.fontSizeSmall, classes.marginTopAuto]}
            >
              Gothra
            </Typography>
            <TextField
              variant="standard"
              className={classes.textfieldStyle}
              onChange={(e) => {
                setGothra(e.target.value);
              }}
              value={saleDetails.gothra}
            ></TextField>
          </div>
          <div className={classes.displayFlex}>
            <Typography
              className={[classes.fontSizeSmall, classes.marginTopAuto]}
            >
              Rashi
            </Typography>
            <TextField
              variant="standard"
              className={classes.textfieldStyle}
              onChange={(e) => {
                setRashi(e.target.value);
              }}
              value={saleDetails.rashi}
            ></TextField>
          </div>
          <div className={classes.displayFlex}>
            <Typography
              className={[classes.fontSizeSmall, classes.marginTopAuto]}
            >
              Star
            </Typography>
            <TextField
              variant="standard"
              className={classes.textfieldStyle}
              onChange={(e) => {
                setStar(e.target.value);
              }}
              value={saleDetails.star}
            ></TextField>
          </div>
        </Grid>

        <Grid item xs={6} className={classes.dayTypeStyle}>
          <Grid container>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={4} className={classes.displayFlex}>
                  <Radio
                    onChange={(e) => {
                      setSpecialDayType('specialDay');
                      setTempleSpecialDayName('');
                      setTempleSpecialDayStartDate('');
                      setTempleSpecialDayEndDate('');
                      setTempleSpecialDayTimings('');
                      setTempleSpecialDayEnabled(true);
                    }}
                    value={specialDayType}
                    checked={specialDayType === 'specialDay' ? true : false}
                    name="radio-button"
                    aria-label="SpecialDay"
                  />
                  <div>
                    <TextField
                      className={classes.specialDayTextField}
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                        readOnly: specialDayType === 'specialDay' ? false : true
                      }}
                      placeholder="Choose Special Day"
                      value={
                        saleDetails.specialDayEnabled
                          ? saleDetails.templeSpecialDayName === ''
                            ? specialDayNameWhileEditing
                            : saleDetails.templeSpecialDayName
                          : ''
                      }
                      onChange={(e) => {
                        if (e.target.value !== specialDayNameWhileEditing) {
                          setTempleSpecialDayName('');
                          setTempleSpecialDayStartDate('');
                          setTempleSpecialDayEndDate('');
                          setTempleSpecialDayTimings('');
                        }
                        getSpecialDaysData(e.target.value);
                        setSpecialDayNameWhileEditing(e.target.value);
                      }}
                      onClick={(e) => {
                        handleSpecialDayMenuOpen(true);
                      }}
                    ></TextField>
                    <>
                      {specialDayMenuOpen &&
                        specialDayList &&
                        specialDayList.length > 0 && (
                          <ul className={classes.DayTypeListbox}>
                            <div>
                              {specialDayList.map((option, index) => (
                                <li
                                  style={{ cursor: 'pointer' }}
                                  key={`${index}customer`}
                                >
                                  <Button
                                    className={classes.liBtn}
                                    disableRipple
                                    onClick={(e) => {
                                      if (e.target.value !== '') {
                                        setTempleSpecialDayName(option.name);
                                        setTempleSpecialDayStartDate(
                                          option.startDate
                                        );
                                        setTempleSpecialDayEndDate(
                                          option.endDate
                                        );
                                        setTempleSpecialDayTimings(
                                          option.timings
                                        );
                                      } else {
                                        setTempleSpecialDayName('');
                                        setTempleSpecialDayStartDate('');
                                        setTempleSpecialDayEndDate('');
                                        setTempleSpecialDayTimings('');
                                      }
                                      handleSpecialDay(option);
                                    }}
                                  >
                                    {option.name}
                                  </Button>
                                </li>
                              ))}
                            </div>
                          </ul>
                        )}
                    </>
                  </div>
                </Grid>
                <Grid item xs={8} className={classes.displayFlex}>
                  <Radio
                    onChange={(e) => {
                      setSpecialDayType('customDay');
                      setTempleSpecialDayName('');
                      setTempleSpecialDayStartDate('');
                      setTempleSpecialDayEndDate('');
                      setTempleSpecialDayTimings('');
                      setTempleSpecialDayEnabled(false);
                    }}
                    checked={specialDayType === 'customDay' ? true : false}
                    name="radio-button"
                    aria-label="CustomDay"
                  />
                  <div>
                    <TextField
                      className={classes.specialDayTextField}
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                        readOnly: specialDayType === 'customDay' ? false : true
                      }}
                      placeholder="Custom Day"
                      value={
                        saleDetails.specialDayEnabled
                          ? ''
                          : saleDetails.templeSpecialDayName
                      }
                      onClick={(e) => {
                        if (specialDayType === 'customDay') {
                          handleCustomDayMenuOpen(true);
                        }
                      }}
                    ></TextField>
                    <>
                      {customDayMenuOpen && (
                        <ul className={classes.DayTypeListbox}>
                          <div>
                            {customDayList.map((option, index) => (
                              <li
                                style={{ cursor: 'pointer' }}
                                key={`${index}customer`}
                              >
                                <Button
                                  className={classes.liBtn}
                                  disableRipple
                                  onClick={(e) => {
                                    setTempleSpecialDayName(option);
                                    handleCustomDay(option);
                                  }}
                                >
                                  {option}
                                </Button>
                              </li>
                            ))}
                          </div>
                        </ul>
                      )}
                    </>
                  </div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={saleDetails.templeOccursEveryYear}
                        onChange={(e) =>
                          setTempleOccursEveryYear(e.target.checked)
                        }
                        color="Secondary"
                      />
                    }
                    label={
                      <Typography style={{ fontSize: 'small' }}>
                        Occurs Every Year
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container style={{ marginTop: '2%' }}>
                <Grid item xs={1} />
                <Grid item xs={3} className={classes.alignEnd}>
                  <TextField
                    placeholder="Start Date"
                    disabled={saleDetails.specialDayEnabled ? true : false}
                    InputProps={{
                      disableUnderline: true
                    }}
                    className={classes.dateFieldStyle}
                    type={'date'}
                    onChange={(e) => {
                      setTempleSpecialDayStartDate(e.target.value);
                    }}
                    value={saleDetails.templeSpecialDayStartDate}
                  ></TextField>
                </Grid>
                <Grid item xs={1} className={classes.alignCenter}>
                  -
                </Grid>
                <Grid item xs={3} className={classes.alignStart}>
                  <TextField
                    placeholder="End Date"
                    disabled={saleDetails.specialDayEnabled ? true : false}
                    type={'date'}
                    className={classes.dateFieldStyle}
                    InputProps={{
                      disableUnderline: true
                    }}
                    onChange={(e) => {
                      setTempleSpecialDayEndDate(e.target.value);
                    }}
                    value={saleDetails.templeSpecialDayEndDate}
                  ></TextField>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    placeholder="Timings (Optional)"
                    disabled={saleDetails.specialDayEnabled ? true : false}
                    className={classes.dateFieldStyle}
                    InputProps={{
                      disableUnderline: true
                    }}
                    onChange={(e) => {
                      setTempleSpecialDayTimings(e.target.value);
                    }}
                    value={saleDetails.templeSpecialDayTimings}
                  ></TextField>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <TextField
            multiline
            rows="3"
            className={classes.commentsField}
            variant="outlined"
            label="Custom Comments"
            onChange={(e) => {
              setTempleCustomComments(e.target.value);
            }}
            value={saleDetails.templeCustomTypeComments}
          ></TextField>
        </Grid>
      </Grid>
    </Toolbar>
  );
};

export default injectWithObserver(TempleComponent);
