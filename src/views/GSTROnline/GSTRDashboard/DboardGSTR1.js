import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from "src/theme/typography";
import { useStore } from 'src/Mobx/Helpers/UseStore';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import {
    downloadGSTR1API,
    filedSummaryTotal
} from 'src/components/Helpers/GstrOnlineHelper';
import { getDataByMonth } from 'src/components/Helpers/GSTHelper/SalesPurchaseMonthlyDataHelper';
import DataLoader from './DataLoader';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 1,
        overflowX: 'auto',
    },
});

let id = 0;
function createData(month) {
    id += 1;
    return { month };
}

const rows = [
    createData('Jul 2024'),
    createData('Jun 2024'),
    createData('May 2024'),
    createData('Apr 2024'),
];

const retSumTitles = {
    B2B_4A:
        '4A - Taxable outward supplies made to registered persons (other than reverse charge supplies) including supplies made through e-commerce operator attracting TCS - B2B Regular',
    B2B_4B:
        '4B - Taxable outward supplies made to registered persons attracting tax on reverse charge - B2B Reverse charge',
    B2CL: '5 - Taxable outward inter-state supplies made to unregistered persons (where invoice value is more than Rs.2.5 lakh) including supplies made through e-commerce operator, rate wise - B2CL (Large)',
    EXP: '6A - Exports',
    B2B_SEZWOP: '6B - Supplies made to SEZ unit or SEZ developer - SEZWOP',
    B2B_SEZWP: '6B - Supplies made to SEZ unit or SEZ developer - SEZWP',
    B2B_6C: '6C - Deemed Exports - DE',
    B2CS: '7- Taxable supplies (Net of debit and credit notes) to unregistered persons (other than the supplies covered in Table 5) including supplies made through e-commerce operator attracting TCS - B2CS (Others)',
    NIL: '8 - Nil rated, exempted and non GST outward supplies',
    B2BA_4A:
        '9A - Amendment to taxable outward supplies made to registered person in returns of earlier tax periods in table 4 - B2B Regular',
    B2BA_4B:
        '9A - Amendment to taxableoutward supplies made to registered person in returns of earlier tax periods in table 4 - B2B Reverse charge',
    EXPA: '9A - Amendment to Export supplies in returns of earlier tax periods in table 6A (EXPWP/EXPWOP)',
    B2BA_SEZWP:
        '9A - Amendment to supplies made to SEZ unit or SEZ developer in returns of earlier tax periods in table 6B (SEZWP)',
    B2BA_SEZWOP:
        '9A - Amendment to supplies made to SEZ unit or SEZ developer in returns of earlier tax periods in table 6B (SEZWOP)',
    CDNR: '9B - Credit/Debit Notes (Registered) - CDNR',
    CDNUR: '9B - Credit/Debit Notes (Unregistered) - CDNUR',
    CDNRA: '9C - Amended Credit/Debit Notes (Registered) - CDNRA',
    CDNURA: '9C - Amended Credit/Debit Notes (Unregistered) - CDNURA',
    B2CSA:
        '10 - Amendment to taxable outward supplies made to unregistered person in returns for earlier tax periods in table 7 including supplies made through e-commerce operator attracting TCS - B2C (Others)',
    AT: '11A(1), 11A(2) - Advances received for which invoice has not been issued (tax amount to be added to the output tax liability) (Net of refund vouchers, if any)',
    TXPD: '11B(1), 11B(2) - Advance amount received in earlier tax period and adjusted against the supplies being shown in this tax period in Table Nos. 4, 5, 6 and 7 (Net of refund vouchers, if any)',
    ATA: '11A - Amendment to advances received in returns for earlier tax periods in table 11A(1), 11A(2) (Net of refund vouchers, if any)',
    TXPDA:
        '11B - Amendment to advances adjusted in returns for earlier tax periods in table 11B(1), 11B(2) (Net of refund vouchers, if any)',
    HSN: '12 - HSN-wise summary of outward supplies',
    DOC_ISSUE: '13 - Documents issued'
};

const DboardGSTR1 = (props) => {
    const { classes } = props;
    const stores = useStore();
    const { getTaxSettingsDetails } = stores.TaxSettingsStore;
    const { retPeriod } = stores.GSTRDashboardStore;
    const [totalData, setTotalData] = useState({});
    const [saleData, setSaleData] = useState(new Map());
    const [loading, setLoading] = useState(false);
    const [initialRun, setInitialRun] = useState(true);
    const { setRetPeriod } = stores.GSTRDashboardStore;

    useEffect(() => {

        const checkAllRetPeriods = async () => {
            setLoading(true);
            const data = await getDataByMonth('01-04-2024', '31-08-2024', ['Sales', 'Sales Return']);
            setSaleData(data);

            setLoading(true);
            const updatedPeriods = [];

            for (const period of retPeriod) {
                if (period.enabled) {
                    const total = await downloadGSTRData(period.retPeriod);
                    updatedPeriods.push({
                        ...period,
                        GSTR1: total,
                    });
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else {
                    updatedPeriods.push({
                        ...period
                    });
                }
            }
            setRetPeriod(updatedPeriods);
            setLoading(false);
        };
        if (initialRun && retPeriod.length > 0) {
            checkAllRetPeriods();
            setInitialRun(false);
        }
    }, [retPeriod, initialRun]);

    const downloadGSTRData = async (data) => {
        try {
            let taxData = await getTaxSettingsDetails();
            let reqData = {
                gstin: taxData.gstin,
                ret_period: data,
                api_name: 'retsum'
            };

            const apiResponse = await downloadGSTR1API(reqData);

            if (apiResponse && apiResponse.status === 1 && apiResponse.message) {
                let response = JSON.parse(apiResponse.message.data_json_string);
                const sortedData = sortDataByRetSumTitles(response.sec_sum);
                const totalVal = await filedSummaryTotal(sortedData);
                return totalVal
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error downloading GSTR data:', error);
            return false;
        }
    };

    const sortDataByRetSumTitles = (data) => {
        const orderedKeys = Object.keys(retSumTitles);
        return data.sort((a, b) => {
            return orderedKeys.indexOf(a.sec_nm) - orderedKeys.indexOf(b.sec_nm);
        });
    };

    const calculateTaxTotals = (data) => {

        const { cgstTotal, sgstTotal, igstTotal } = data;

        if (igstTotal === 0) {
            return cgstTotal + sgstTotal;
        } else {
            return sgstTotal;
        }
    }


    return (
        <div>
            <Grid
                container
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
            >
                <Grid item xs={12} sm={12}>
                    <Paper className={classes.root} elevation={4}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow style={{ backgroundColor: 'lightgrey' }}>
                                    <TableCell
                                        variant="head"
                                        rowSpan="2"
                                        align="center"
                                        style={{ borderRight: '2px solid' }}
                                    >
                                        Month
                                    </TableCell>
                                    <TableCell
                                        variant="head"
                                        colSpan="3"
                                        align="center"
                                        style={{ borderRight: '2px solid' }}
                                    >
                                        GSTR1
                                    </TableCell>
                                    <TableCell
                                        variant="head"
                                        colSpan="3"
                                        align="center"
                                        style={{ borderRight: '2px solid' }}
                                    >
                                        Sales Register
                                    </TableCell>
                                    <TableCell
                                        variant="head"
                                        colSpan="3"
                                        align="center"
                                    >
                                        Difference
                                    </TableCell>
                                </TableRow>
                                <TableRow style={{ backgroundColor: 'lightgrey' }}>
                                    <TableCell variant="head"
                                        style={{ borderRight: '1px outset' }}
                                    >
                                        <h5>Total Invoice</h5>
                                    </TableCell>
                                    <TableCell variant="head"
                                        style={{ borderRight: '1px outset' }}>
                                        <h5>Taxable Amount</h5>
                                    </TableCell>
                                    <TableCell variant="head"
                                        style={{ borderRight: '2px solid' }}>
                                        <h5>Tax Amount</h5>
                                    </TableCell>
                                    <TableCell variant="head"
                                        style={{ borderRight: '1px outset' }}
                                    >
                                        <h5>Total Invoice</h5>
                                    </TableCell>
                                    <TableCell variant="head"
                                        style={{ borderRight: '1px outset' }}>
                                        <h5>Taxable Amount</h5>
                                    </TableCell>
                                    <TableCell variant="head"
                                        style={{ borderRight: '2px solid' }}>
                                        <h5>Tax Amount</h5>
                                    </TableCell>
                                    <TableCell variant="head"
                                        style={{ borderRight: '1px outset' }}
                                    >
                                        <h5>Total Invoice</h5>
                                    </TableCell>
                                    <TableCell variant="head"
                                        style={{ borderRight: '1px outset' }}>
                                        <h5>Taxable Amount</h5>
                                    </TableCell>
                                    <TableCell variant="head"
                                        style={{ borderRight: '1px outset' }}>
                                        <h5>Tax Amount</h5>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {retPeriod.map(row => {
                                    const monthKey = row.label.slice(0, 3).toUpperCase();
                                    const invoiceData = saleData.size > 0 ? saleData.get(monthKey) || {} : {};
                                    console.log("joe", monthKey);
                                    return (
                                        <TableRow key={row.id}>
                                            <TableCell component="th" scope="row" style={{ borderRight: '2px solid' }}>
                                                {row.label}
                                            </TableCell>
                                            <TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
                                                {row.GSTR1 ? row.GSTR1.vouchersTotal : '-'}
                                            </TableCell>
                                            <TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
                                                {row.GSTR1 ? row.GSTR1.taxableTotal : '-'}
                                            </TableCell>
                                            <TableCell component="th" scope="row" style={{ borderRight: '2px solid' }}>
                                                {row.GSTR1 ? calculateTaxTotals(row.GSTR1) : '-'}
                                            </TableCell>
                                            <TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
                                                {invoiceData.invoiceCount || '-'}
                                            </TableCell>
                                            <TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
                                                {invoiceData.taxableValue || '-'}
                                            </TableCell>
                                            <TableCell component="th" scope="row" style={{ borderRight: '2px solid' }}>
                                                {typeof invoiceData.taxAmount === 'number' && !isNaN(invoiceData.taxAmount)
                                                    ? invoiceData.taxAmount
                                                    : '-'}
                                            </TableCell>
                                            <TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
                                                {row.GSTR1 && invoiceData.invoiceCount
                                                    ? row.GSTR1.vouchersTotal - invoiceData.invoiceCount
                                                    : '-'}
                                            </TableCell>
                                            <TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
                                                {row.GSTR1 && invoiceData.taxableValue
                                                    ? row.GSTR1.taxableTotal - invoiceData.taxableValue
                                                    : '-'}
                                            </TableCell>
                                            <TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
                                                {row.GSTR1 && typeof invoiceData.taxAmount === 'number' && !isNaN(invoiceData.taxAmount)
                                                    ? calculateTaxTotals(row.GSTR1) - invoiceData.taxAmount
                                                    : '-'}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                <TableRow style={{ backgroundColor: 'lightgrey' }}>
                                    <TableCell component="th" scope="row" style={{ borderRight: '2px solid' }}>
                                        <h5>Total</h5>
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
                                        {retPeriod.reduce((acc, row) => acc + (row.GSTR1 ? row.GSTR1.vouchersTotal : 0), 0)}
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
                                        {retPeriod.reduce((acc, row) => acc + (row.GSTR1 ? row.GSTR1.taxableTotal : 0), 0)}
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ borderRight: '2px solid' }}>
                                        {retPeriod.reduce((acc, row) => acc + (row.GSTR1 ? calculateTaxTotals(row.GSTR1) : 0), 0)}
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
                                        {retPeriod.reduce((acc, row) => acc + (saleData.get(row.label.slice(0, 3).toUpperCase())?.invoiceCount || 0), 0)}
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
                                        {retPeriod.reduce((acc, row) => acc + (saleData.get(row.label.slice(0, 3).toUpperCase())?.taxableValue || 0), 0)}
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ borderRight: '2px solid' }}>
                                        {retPeriod.reduce((acc, row) => acc + (saleData.get(row.label.slice(0, 3).toUpperCase())?.taxAmount || 0), 0)}
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
                                        {retPeriod.reduce((acc, row) => acc + (row.GSTR1 && saleData.get(row.label.slice(0, 3).toUpperCase())?.invoiceCount
                                            ? row.GSTR1.vouchersTotal - saleData.get(row.label.slice(0, 3).toUpperCase())?.invoiceCount
                                            : 0), 0)}
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
                                        {retPeriod.reduce((acc, row) => acc + (row.GSTR1 && saleData.get(row.label.slice(0, 3).toUpperCase())?.taxableValue
                                            ? row.GSTR1.taxableTotal - saleData.get(row.label.slice(0, 3).toUpperCase())?.taxableValue
                                            : 0), 0)}
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
                                        {retPeriod.reduce((acc, row) => acc + (row.GSTR1 && saleData.get(row.label.slice(0, 3).toUpperCase())?.taxAmount
                                            ? calculateTaxTotals(row.GSTR1) - saleData.get(row.label.slice(0, 3).toUpperCase())?.taxAmount
                                            : 0), 0)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
            {loading && <DataLoader />}
        </div>
    )
};

DboardGSTR1.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DboardGSTR1);