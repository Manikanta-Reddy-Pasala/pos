/* eslint-disable no-use-before-define */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import { Button, Grid, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  label: {
    display: 'inline'
  },
  input: {
    width: '25%'
  },
  listbox: {
    width: '15%',
    margin: 5,
    padding: 10,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
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
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: theme.spacing(3)
  },

  bootstrapRoot: {
    padding: 5,
    'label + &': {
      marginTop: theme.spacing(3)
    }
  },
  bootstrapInput: {
    borderRadius: 2,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    width: 'calc(100% - 30px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: ['Nunito Sans, Roboto, sans-serif'].join(','),
    '&:focus': {
      borderColor: '#ff7961'
      // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  bootstrapFormLabel: {
    fontSize: 16
  },
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}));

function CategoriesSearch(props) {
  const store = useStore();
  const [category, setCategory] = React.useState(props.expenses.category);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [filteredList, setFilteredList] = React.useState(props.list);
  const {
    handleCategoryModalOpen,
    setSelectedCategoryId,
    setSelectedCategoryName,
    setExpenseType
  } = store.ExpensesStore;

  const classes = useStyles();

  const updateState = (e, value, reason) => {
    if (value) {
      setSelectedCategoryId(value.categoryId);
      setSelectedCategoryName(value.category);
      setExpenseType(value.expenseType);
      setCategory(value.category);
      setMenuOpen(false);
    }
  };

  const handleAddCategory = () => {
    handleCategoryModalOpen();
  };

  const handleClickEvent = () => {
    if (props.list.length === 0) {
      handleCategoryModalOpen();
    } else {
      setMenuOpen(true);
    }
  };

  const handleOnchangeCategory = (e) => {
    setCategory(e.target.value);
    let filteredData = props.list.filter((ele) => {
      return ele.category.toLocaleLowerCase().includes(e.target.value);
    });
    setFilteredList(filteredData);
  };

  return (
    <div>
      <div>
        <TextField
          fullWidth
          placeholder="Category *"
          required
          value={category}
          onClick={handleClickEvent}
          className={classes.input}
          onChange={handleOnchangeCategory}
          InputProps={{
            disableUnderline: true,
            classes: {
              root: classes.bootstrapRoot,
              input: classes.bootstrapInput
            }
          }}
          InputLabelProps={{
            shrink: true,
            className: classes.bootstrapFormLabel
          }}
        />
      </div>
      {menuOpen ? (
        <>
          <ul className={classes.listbox}>
            {filteredList.map((option, index) => (
              <li
                key={`${index}`}
                style={{ padding: 10 }}
                onClick={(e) => updateState(e, option)}
              >
                <Grid container justifyContent="space-between">
                  <Grid item>{option.category}</Grid>
                </Grid>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

export default injectWithObserver(CategoriesSearch);
