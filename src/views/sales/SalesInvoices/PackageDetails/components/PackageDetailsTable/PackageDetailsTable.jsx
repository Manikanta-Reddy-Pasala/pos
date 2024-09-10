import { Box, Paper } from '@material-ui/core';
import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import CustomInput from '../CustomInput';
import { useStyles } from '../../styles';
import PackageDetailsTableHeader from './PackageDetailsTableHeader';
import { toJS } from 'mobx';
import { useStore } from 'src/Mobx/Helpers/UseStore';

const PackageRow = ({ row, index }) => {
  const classes = useStyles();

  const stores = useStore();

  const { updateSaleItem } = stores.SalesAddStore;

  const formatNumber = (number) => {
    // If number is an integer, return it as is
    if (Number.isInteger(number)) return number;

    // If number has one or two decimals, use toFixed(2) and remove trailing zeros
    return parseFloat(number.toFixed(2));
  };

  const handleInputChange = (key, value) => {
    updateSaleItem(row.product_id, key, value, index);

    if (
      ['netWeightPerPackage', 'grossWeightPerPackage'].includes(key) &&
      row?.totalPackingNos
    ) {
      const totalKey =
        key === 'netWeightPerPackage'
          ? 'totalPackageNetWeight'
          : 'totalPackageGrossWeight';
      let newTotal = formatNumber(value * row?.totalPackingNos);
      updateSaleItem(row.product_id, totalKey, newTotal, index);
    }
  };

  return (
    <TableRow key={row.name}>
      <TableCell component="th" scope="row" className={classes.cell}>
        {row.item_name}
      </TableCell>
      <TableCell className={classes.cell}>{row.hsn}</TableCell>
      <TableCell className={classes.cell}>{row.qty}</TableCell>
      <TableCell className={classes.cell}>{row.amount}</TableCell>
      <TableCell className={classes.cell}>
        <Box
          display={'flex'}
          alignItems="center"
          justifyContent={'space-between'}
          margin={'auto'}
          maxWidth={'25rem'}
        >
          <Box width="10rem">
            <CustomInput
              name={'startPackingNo'}
              type="number"
              value={row?.startPackingNo || ''}
              callback={handleInputChange}
              variant="standard"
              styles={{ textAlign: 'center', padding: '0 5px' }}
            />
          </Box>
          to
          <Box width="10rem">
            <CustomInput
              name={'endPackingNo'}
              type="number"
              value={row?.endPackingNo}
              callback={handleInputChange}
              variant="standard"
              styles={{ textAlign: 'center', padding: '0 5px' }}
            />
          </Box>
        </Box>
      </TableCell>
      <TableCell className={classes.cell}>
        <CustomInput
          name={'totalPackingNos'}
          type="number"
          value={row?.totalPackingNos}
          callback={handleInputChange}
        />
      </TableCell>

      <TableCell className={`${classes.minWidthCell} ${classes.cell}`}>
        <CustomInput
          name={'netWeightPerPackage'}
          type="number"
          value={row?.netWeightPerPackage || ''}
          callback={handleInputChange}
        />
      </TableCell>
      <TableCell className={`${classes.minWidthCell} ${classes.cell}`}>
        <CustomInput
          name={'grossWeightPerPackage'}
          type="number"
          value={row?.grossWeightPerPackage || ''}
          callback={handleInputChange}
        />
      </TableCell>
      <TableCell className={`${classes.minWidthCell} ${classes.cell}`}>
        <CustomInput
          name={'totalPackageNetWeight'}
          type="number"
          value={row?.totalPackageNetWeight || ''}
          callback={handleInputChange}
        />
      </TableCell>
      <TableCell className={`${classes.minWidthCell}`}>
        <CustomInput
          name={'totalPackageGrossWeight'}
          type="number"
          value={row?.totalPackageGrossWeight || ''}
          callback={handleInputChange}
        />
      </TableCell>
    </TableRow>
  );
};

const PackageFooter = () => {
  const classes = useStyles();

  const stores = useStore();
  const { items } = toJS(stores.SalesAddStore);

  const getTotals = (key) =>
    items.reduce((total, data) => {
      total = total + Number(data[key]);
      return total;
    }, 0);

  return (
    <TableRow>
      <TableCell
        component="th"
        scope="row"
        className={classes.cell}
        colSpan={2}
      >
        <Box fontWeight={600} textAlign={'right'}>
          Totals:
        </Box>
      </TableCell>
      <TableCell className={classes.cell}>
        {' '}
        <Box fontWeight={'bold'}>{getTotals('qty')}</Box>
      </TableCell>
      <TableCell className={classes.cell}>
        <Box fontWeight={'bold'}>{getTotals('amount')}</Box>
      </TableCell>
      <TableCell className={classes.cell}></TableCell>
      <TableCell className={classes.cell}>
        <Box fontWeight={'bold'}>{getTotals('totalPackingNos')}</Box>
      </TableCell>

      <TableCell
        className={`${classes.minWidthCell} ${classes.cell}`}
      ></TableCell>
      <TableCell
        className={`${classes.minWidthCell} ${classes.cell}`}
      ></TableCell>
      <TableCell className={`${classes.minWidthCell} ${classes.cell}`}>
        <Box fontWeight={'bold'}>{getTotals('totalPackageNetWeight')}</Box>
      </TableCell>
      <TableCell className={`${classes.minWidthCell}`}>
        <Box fontWeight={'bold'}>{getTotals('totalPackageGrossWeight')}</Box>
      </TableCell>
    </TableRow>
  );
};

const PackageDetailsTable = ({ itemConfig, config }) => {
  const stores = useStore();

  const { items } = toJS(stores.SalesAddStore);
  const classes = useStyles();

  const generateRows = () => {
    return items.map((row, index) => {
      return <PackageRow row={row} key={row.product_id} index={index} />;
    });
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table className={classes.tableWrapper} size="small">
        <PackageDetailsTableHeader config={config} itemConfig={itemConfig} />
        <TableBody>{generateRows()}</TableBody>
        {/* <PackageFooter /> */}
      </Table>
    </TableContainer>
  );
};

export default PackageDetailsTable;
