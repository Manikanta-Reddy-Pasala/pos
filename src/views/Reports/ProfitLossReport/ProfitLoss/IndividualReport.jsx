import React from 'react';
import { Box } from '@material-ui/core';
import { SecondaryButton } from '../../../sales/SalesInvoices/AddInvoice/MFGDetails/MEGDetails.styles';

import SalesInfoGrid from '../../SalesReport/SalesInfoGrid/SalesInfo';
import SalesReturn from '../../ReturnReport/SalesReturnReport';
import PurchaseReport from '../../PurchaseReport/Purchase/Purchase';
import PurchaseReturn from '../../ReturnReport/PurchaseReturn';
import ExpenseTableReport from '../../ExpensesReport/ExpenseTableReport';
import ManufactureList from '../../../Manufacture/ManufactureList';
import StockSummary from '../../../StockManagement/StockDetails/index';

const IndividualReport = ({ date, plType, clear, expenseCategory }) => {
  const salesReportProps = {
    salesReport: {
      reportStartDate: date?.fromDate,
      reportEndDate: date?.toDate
    },
    cleearReport: () => {},
    isPL: true
  };

  const Headers = {
    purchase: 'Purchase',
    purchaseReturn: 'Purchase Return',
    sale: 'Sales',
    saleReturn: 'Sales Return',
    expense: 'Expense',
    directmanufacture: 'Manufacture',
    openningStock: 'Opening Stock Summary',
    closingStock: 'Closing Stock Summary'
  };
  const plHeader = (
    <Box display="flex" p={2} alignItems="center" flexGrow={1} width={'100%'}>
      <SecondaryButton color="secondary" variant="contained" onClick={clear}>
        Back
      </SecondaryButton>
      <Box fontSize={'1.25rem'} fontWeight={600}>
        {Headers[plType]}
      </Box>
      <Box display="flex" px={2} ml={'auto'}>
        <Box fontWeight={600} pr={2}>
          Start Date:
        </Box>{' '}
        {date?.fromDate}
      </Box>
      <Box display="flex" px={2}>
        <Box fontWeight={600} pr={2}>
          End Date:
        </Box>
        {date?.toDate}
      </Box>
    </Box>
  );

  const renderComponent = {
    purchase: <PurchaseReport {...date} isPL={true} plHeader={plHeader} />,
    purchaseReturn: (
      <PurchaseReturn {...date} isPL={true} plHeader={plHeader} />
    ),
    sale: <SalesInfoGrid {...salesReportProps} plHeader={plHeader} />,
    saleReturn: <SalesReturn {...date} isPL={true} plHeader={plHeader} />,
    openningStock: (
      <StockSummary openingStock {...date} isPL={true} plHeader={plHeader} />
    ),
    closingStock: (
      <StockSummary closingStock {...date} isPL={true} plHeader={plHeader} />
    ),
    expense: (
      <ExpenseTableReport
        {...date}
        isPL={true}
        plHeader={plHeader}
        category={{ categoryId: expenseCategory }}
      />
    ),
    directmanufacture: (
      <ManufactureList
        {...date}
        isPL={true}
        plHeader={plHeader}
        category={expenseCategory}
      />
    )
  };
  return (
    <Box fontFamily={['Nunito Sans, Roboto, sans-serif'].join(',')}>
      {renderComponent[plType] || ''}
    </Box>
  );
};

export default IndividualReport;
