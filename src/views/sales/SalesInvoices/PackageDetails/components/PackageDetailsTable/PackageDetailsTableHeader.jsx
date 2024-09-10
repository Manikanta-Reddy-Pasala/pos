import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useStyles } from '../../styles';

const PackageDetailsTableHeader = ({ itemConfig, config }) => {
  const classes = useStyles();

  return (
    <TableHead>
      <TableRow>
        <TableCell className={classes.cell}>Item</TableCell>
        <TableCell className={classes.cell}>HSN</TableCell>
        <TableCell className={classes.cell}>Qty</TableCell>
        <TableCell className={classes.cell}>Amount</TableCell>
        <TableCell className={`${classes.cell} ${classes.minWidthCell}`}>
          Number
        </TableCell>
        <TableCell className={classes.cell}>
          No Of {itemConfig[config]}
        </TableCell>
        <TableCell className={classes.cell}>
          N. Weight/per {itemConfig[config]}
        </TableCell>
        <TableCell className={classes.cell}>
          Gr. Weight/per {itemConfig[config]}
        </TableCell>
        <TableCell className={classes.cell}>
          Total N. Weight
        </TableCell>
        <TableCell>Total Gr. Weight</TableCell>
      </TableRow>
    </TableHead>
  );
};
export default PackageDetailsTableHeader;