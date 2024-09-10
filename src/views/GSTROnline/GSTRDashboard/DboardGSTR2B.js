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
	get2BData,
	resp2BTotal
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


const DboardGSTR2B = (props) => {
	const { classes } = props;
	const stores = useStore();
	const { getTaxSettingsDetails } = stores.TaxSettingsStore;
	const { retPeriod } = stores.GSTRDashboardStore;
	const [totalData, setTotalData] = useState({});
	const [purchaseData, setPurchaseData] = useState(new Map());
	const [loading, setLoading] = useState(false);
	const [initialRun, setInitialRun] = useState(true);
	const { setRetPeriod } = stores.GSTRDashboardStore;

	useEffect(() => {

		const checkAllRetPeriods = async () => {
			setLoading(true);
			const data = await getDataByMonth('01-04-2024', '31-08-2024', ['Purchases']);
			setPurchaseData(data);

			setLoading(true);
			const updatedPeriods = [];

			for (const period of retPeriod) {
				if (period.enabled) {
					const total = await fetchData(period.retPeriod);
					if(Object.keys(total).length !== 0){
						updatedPeriods.push({
							...period,
							GSTR2B: total,
						});
					}
					
					await new Promise(resolve => setTimeout(resolve, 1000));
				} else {
					updatedPeriods.push({
						...period
					});
				}
			}
			setRetPeriod(updatedPeriods);
			setLoading(false);
			console.log("joe",updatedPeriods);
		};
		
		if (initialRun && retPeriod.length > 0) {
			checkAllRetPeriods();
			setInitialRun(false);
		}
	}, [retPeriod, initialRun]);

	const fetchData = async (data) => {
		setLoading(true);
		const tData = await getTaxSettingsDetails();
		let reqData = {};
		reqData = {
			gstin: tData?.gstin,
			ret_period: data
		};
		const apiResponse = await get2BData(reqData);
		if (apiResponse && apiResponse.status && apiResponse.status === 1) {
			const respData = apiResponse.message;
			const total = resp2BTotal(respData?.data?.docdata);
			return total;
		}
		return {}; 
	};

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
									const invoiceData = purchaseData.size > 0 ? purchaseData.get(monthKey) || {} : {};
									return (
										<TableRow key={row.id}>
											<TableCell component="th" scope="row" style={{ borderRight: '2px solid' }}>
												{row.label}
											</TableCell>
											<TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
												{row.GSTR2B ? row.GSTR2B.totalInvoices : '-'}
											</TableCell>
											<TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
												{row.GSTR2B ? row.GSTR2B.totalTaxableAmount : '-'}
											</TableCell>
											<TableCell component="th" scope="row" style={{ borderRight: '2px solid' }}>
												{row.GSTR2B ? row.GSTR2B.totalTax : '-'}
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
												{row.GSTR2B && invoiceData.invoiceCount
													? row.GSTR2B.totalInvoices - invoiceData.invoiceCount
													: '-'}
											</TableCell>
											<TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
												{row.GSTR2B && invoiceData.taxableValue
													? row.GSTR2B.totalTaxableAmount - invoiceData.taxableValue
													: '-'}
											</TableCell>
											<TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
												{row.GSTR2B && typeof invoiceData.taxAmount === 'number' && !isNaN(invoiceData.taxAmount)
													? row.GSTR2B.totalTax - invoiceData.taxAmount
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
										{retPeriod.reduce((acc, row) => acc + (row.GSTR2B ? row.GSTR2B.totalInvoices : 0), 0)}
									</TableCell>
									<TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
										{retPeriod.reduce((acc, row) => acc + (row.GSTR2B ? row.GSTR2B.totalTaxableAmount : 0), 0)}
									</TableCell>
									<TableCell component="th" scope="row" style={{ borderRight: '2px solid' }}>
										{retPeriod.reduce((acc, row) => acc + (row.GSTR2B ? row.GSTR2B.totalTax : 0), 0)}
									</TableCell>
									<TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
										{retPeriod.reduce((acc, row) => acc + (purchaseData.get(row.label.slice(0, 3).toUpperCase())?.invoiceCount || 0), 0)}
									</TableCell>
									<TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
										{retPeriod.reduce((acc, row) => acc + (purchaseData.get(row.label.slice(0, 3).toUpperCase())?.taxableValue || 0), 0)}
									</TableCell>
									<TableCell component="th" scope="row" style={{ borderRight: '2px solid' }}>
										{retPeriod.reduce((acc, row) => acc + (purchaseData.get(row.label.slice(0, 3).toUpperCase())?.taxAmount || 0), 0)}
									</TableCell>
									<TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
										{retPeriod.reduce((acc, row) => acc + (row.GSTR2B && purchaseData.get(row.label.slice(0, 3).toUpperCase())?.invoiceCount
											? row.GSTR2B.totalInvoices - purchaseData.get(row.label.slice(0, 3).toUpperCase())?.invoiceCount
											: 0), 0)}
									</TableCell>
									<TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
										{retPeriod.reduce((acc, row) => acc + (row.GSTR2B && purchaseData.get(row.label.slice(0, 3).toUpperCase())?.taxableValue
											? row.GSTR2B.totalTaxableAmount - purchaseData.get(row.label.slice(0, 3).toUpperCase())?.taxableValue
											: 0), 0)}
									</TableCell>
									<TableCell component="th" scope="row" style={{ borderRight: '1px outset' }}>
										{retPeriod.reduce((acc, row) => acc + (row.GSTR2B && purchaseData.get(row.label.slice(0, 3).toUpperCase())?.taxAmount
											? row.GSTR2B.totalTax - purchaseData.get(row.label.slice(0, 3).toUpperCase())?.taxAmount
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

DboardGSTR2B.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DboardGSTR2B);