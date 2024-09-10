import React from 'react';
import {
  Dialog,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  TableContainer,
  Button,
  DialogActions,
  Divider,
  Grid,
  TablePagination,
  TableSortLabel,
  DialogContent,
  DialogTitle as MuiDialogTitle,
  withStyles,
  Input
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import { useStore } from '../Mobx/Helpers/UseStore';
import InjectObsrvable from '../Mobx/Helpers/injectWithObserver';
import style from './style';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  tableHeader: {
    height: '50px'
  },
  linkamount: {
    border: '1px solid #cacaca',
    borderRadius: '7px',
    padding: '9px'
  }
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h4">{children}</Typography>
      {/* {onClose ? ( */}
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
      {/* ) : null} */}
    </MuiDialogTitle>
  );
});

const LinkPaymentSales = ({ open, onClose, isEditAllowed }) => {
  const store = useStore();

  const { openLinkpaymentPage, paymentLinkTransactions, saleDetails } = toJS(
    store.SalesAddStore
  );

  const {
    getBalanceAfterLinkedAmount,
    setLinkedAmount,
    closeLinkPayment,
    selectedPaymentItem,
    unSelectedPaymentItem,
    autoLinkPayment,
    saveLinkPaymentChanges,
    resetLinkPayment
  } = store.SalesAddStore;

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('md');

  const [order, setOrder] = React.useState('asc');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = paymentLinkTransactions.map((n) => n.date);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, row) => {
    if (saleDetails.balance_amoun > 0) {
    }
    const selectedIndex = selected.indexOf(row.receiptNumber);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row.receiptNumber);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const autoLinkClicked = () => {
    const totalAmount = saleDetails.total_amount;
    const recievedAmount = parseFloat(saleDetails.received_amount) || 0;
    let linkedAmount = parseFloat(saleDetails.linked_amount) || 0;
    let amountToLink = totalAmount - recievedAmount - linkedAmount || 0;

    let finalLinkedAmount = 0;
    let loop = 0;
    let newSelected = [];

    for (let txn of paymentLinkTransactions) {
      if (txn.balance > 0) {
        let linked = 0;
        if (finalLinkedAmount < amountToLink) {
          if (txn.balance >= amountToLink - finalLinkedAmount) {
            linked = amountToLink - finalLinkedAmount;
            txn.linkedAmount = linked;
            finalLinkedAmount = finalLinkedAmount + linked;
          } else {
            linked = txn.balance;
            txn.linkedAmount = linked;
            finalLinkedAmount = finalLinkedAmount + linked;
          }
          txn.balance = parseFloat(txn.balance) - parseFloat(linked);
          newSelected = newSelected.concat(selected, txn.receiptNumber);
        }
      }
      loop = loop + 1;
    }
    if (loop === paymentLinkTransactions.length) {
      setSelected(newSelected);
    }
  };

  const resetLinkPaymentClick = () => {
    setSelected([]);
  };

  const selectPayment = (row, e) => {
    if (e.target.checked) {
      selectedPaymentItem(row);
    } else {
      unSelectedPaymentItem(row);
    }
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, paymentLinkTransactions.length - page * rowsPerPage);
  const classes = style.useStyles();

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={openLinkpaymentPage}
    >
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        Link Payment
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={3} style={{ flexDirection: 'row' }}>
            <Typography>customer</Typography>
            <Typography style={{ marginTop: 5 }}>
              {saleDetails.customer_name}
            </Typography>
          </Grid>
          <Grid item xs={2} style={{ flexDirection: 'row' }}>
            <Typography>Received on Sale</Typography>
            <Typography style={{ marginTop: 5 }}>
              {saleDetails.received_amount}
            </Typography>
          </Grid>

          <Grid item xs={2} style={{ flexDirection: 'row' }}>
            <Typography>Balance</Typography>
            <Typography style={{ marginTop: 5 }}>
              {saleDetails.balance_amount}
            </Typography>
          </Grid>

          <Grid item xs={2} style={{ flexDirection: 'row' }}>
            <Typography style={{ color: '#F443368' }}>Linked Amount</Typography>
            <Input
              id="component-simple"
              disableUnderline={true}
              value={saleDetails.linked_amount}
              disabled={true}
              fullWidth
              onChange={(e) => {
                setLinkedAmount(e.target.value);
              }}
              style={{
                border: '1px solid #cacaca',
                borderRadius: '7px',
                paddingLeft: '6px'
              }}
            />
          </Grid>
          {isEditAllowed && (
            <Grid
              item
              xs={3}
              style={{ flexDirection: 'column', marginTop: 'auto' }}
            >
              <Button
                variant="contained"
                color="secondary"
                disabled={saleDetails.balance_amount === 0 ? true : false}
                style={{ color: 'white' }}
                onClick={function (event) {
                  autoLinkPayment();
                  autoLinkClicked();
                }}
              >
                Auto Link
              </Button>
              <Button
                color="secondary"
                onClick={function (event) {
                  resetLinkPayment();
                  resetLinkPaymentClick();
                }}
                style={{ marginLeft: 20 }}
              >
                Reset
              </Button>
              {/* <HelpOutlined size="inherit" />
            <Refresh size="inherit" /> */}
            </Grid>
          )}
        </Grid>

        <Divider style={{ marginTop: 10 }} />
        <br />
        <div className={classes.tblroot}>
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size="small"
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                onSelectAllClick={handleSelectAllClick}
                rowCount={paymentLinkTransactions.length}
              />
              <TableBody className={styles.tablerow}>
                {
                  paymentLinkTransactions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = row
                        ? row.selected
                          ? true
                          : false
                        : false;
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        row && (
                          <TableRow
                            hover
                            onClick={(event) =>
                              isItemSelected
                                ? handleClick(event, row)
                                : saleDetails.balance_amount > 0
                                ? handleClick(event, row)
                                : ''
                            }
                            style={{
                              height: 60,
                              backgroundColor: isItemSelected
                                ? '#CBE7F6'
                                : saleDetails.balance_amount === 0
                                ? '#EEEEEE'
                                : ''
                            }}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={labelId}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                disabled={
                                  saleDetails.balance_amount === 0 &&
                                  !isItemSelected
                                    ? true
                                    : false
                                }
                                inputProps={{ 'aria-labelledby': labelId }}
                                onChange={(e) => {
                                  if (isEditAllowed) {
                                    selectPayment(row, e);
                                  }
                                }}
                                key={index}
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                            >
                              {row.date ? row.date : ''}
                            </TableCell>
                            <TableCell padding="none">
                              {row.paymentType ? row.paymentType : ''}
                            </TableCell>
                            <TableCell padding="none">
                              {row.sequenceNumber ? row.sequenceNumber : ''}
                            </TableCell>
                            <TableCell padding="none">
                              {row.total
                                ? parseFloat(row.total).toFixed(2)
                                : ''}
                            </TableCell>
                            <TableCell padding="none">
                              {row.balance
                                ? parseFloat(row.balance).toFixed(2)
                                : ''}
                            </TableCell>
                            <TableCell padding="none">
                              {row.linkedAmount
                                ? parseFloat(row.linkedAmount).toFixed(2)
                                : ''}
                            </TableCell>
                          </TableRow>
                        )
                      );
                    })
                }
                {emptyRows > 0 && (
                  <TableRow style={{ height: 33 * emptyRows }}>
                    <TableCell colSpan={8} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={paymentLinkTransactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </div>
      </DialogContent>

      {isEditAllowed && (
        <DialogActions>
          <Typography>
            Balance After Linked Amount: {getBalanceAfterLinkedAmount}
          </Typography>
          <Button
            onClick={() => {
              closeLinkPayment();
              onClose();
            }}
            variant="contained"
            style={{ marginLeft: 20, marginRight: 15 }}
          >
            Cancel
          </Button>
          <Button
            disabled={!isEditAllowed}
            onClick={() => saveLinkPaymentChanges()}
            variant="contained"
            color="secondary"
            style={{ color: 'white', marginRight: 15 }}
          >
            Done
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
export default InjectObsrvable(LinkPaymentSales);

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    {
      id: 'date',
      label: 'Date',
      numeric: false
    },
    {
      id: 'paymentType',
      label: 'Type',
      numeric: false
    },
    {
      id: 'sequenceNumber',
      label: 'Ref /Invoice no',
      numeric: false
    },
    {
      id: 'amt',
      label: 'Amount',
      numeric: false
    },
    {
      id: 'available',
      label: 'Available',
      numeric: false
    },
    {
      id: 'linkedamt',
      label: 'Linked Amount',
      numeric: false
    }
  ];

  return (
    <TableHead>
      <TableRow style={{ height: 60 }}>
        <TableCell padding="checkbox">
          {/* <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          /> */}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? 'right' : 'left'}
            padding="none"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};