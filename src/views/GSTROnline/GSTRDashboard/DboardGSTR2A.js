import React,{useEffect,useState}from "react";
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
import { useStore } from '../../../Mobx/Helpers/UseStore';
import { get2AData,resp2ATotal } from 'src/components/Helpers/GstrOnlineHelper';

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

const DboardGSTR2A = (props) => {
	const { classes } = props;
	const stores = useStore();
	const [loader, setLoader] = useState(false);
	const { getTaxSettingsDetails } = stores.TaxSettingsStore;
	const {

		updateB2BData,
		updateB2BAData,
		updateCDNRData,
		updateCDNRAData,
		updateISDData,
		updateIMPGData,
		updateIMPGSEZData,
		resetAllData
	} = stores.GSTR2AStore;
	const { retPeriod } = stores.GSTRDashboardStore;
	const [totalData, setTotalData] = useState({});
	const [saleData, setSaleData] = useState(new Map());
	const [initialRun, setInitialRun] = useState(true);
	const { setRetPeriod } = stores.GSTRDashboardStore;

	useEffect(() => {
		const checkAllRetPeriods = async () => {
			setLoader(true);
			// const data = await getDataByMonth('01-04-2024', '31-08-2024', ['Sales', 'Sales Return']);
			// setSaleData(data);

			// setLoading(true);
			const updatedPeriods = [];

			for (const period of retPeriod) {
				if (period.enabled) {
					const total = await fetchData(period.retPeriod);
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
			setLoader(false);
		};
		if (initialRun && retPeriod.length > 0) {
			checkAllRetPeriods();
			setInitialRun(false);
		}
	}, [retPeriod, initialRun]);

	const fetchData = async (data) => {
		setLoader(true);
		const tData = await getTaxSettingsDetails();
		let reqData = {};
		reqData = {
			gstin: tData?.gstin,
			ret_period: data
		};

		const apiResponse = await get2AData(reqData, 'b2b');
		if (apiResponse && apiResponse.status === 1) {
			updateB2BData(apiResponse.message?.b2b);
		}
		resp2ATotal(apiResponse.message);
		const apiResponseb2ba = await get2AData(reqData, 'b2ba');
		if (
			apiResponseb2ba &&
			apiResponseb2ba.status === 1 &&
			apiResponseb2ba.message.b2ba
		) {
			updateB2BAData(apiResponseb2ba.message?.b2ba);
		}
		const apiResponsecdn = await get2AData(reqData, 'cdn');
		if (apiResponsecdn && apiResponsecdn.status === 1) {
			updateCDNRData(apiResponsecdn.message?.cdn);
		}
		const apiResponsecdna = await get2AData(reqData, 'cdna');
		if (apiResponsecdna && apiResponsecdna.status === 1) {
			updateCDNRAData(apiResponsecdna.message?.cdna);
		}
		const apiResponseisd = await get2AData(reqData, 'isdCredit');
		if (apiResponseisd && apiResponseisd.status === 1) {
			updateISDData(apiResponseisd.message?.isd);
		}
		const apiResponseimpg = await get2AData(reqData, 'impg');
		if (apiResponseimpg && apiResponseimpg.status === 1) {
			updateIMPGData(apiResponseimpg.message?.impg);
		}
		const apiResponseimpgsez = await get2AData(reqData, 'impgsez');
		if (apiResponseimpgsez && apiResponseimpgsez.status === 1) {
			updateIMPGSEZData(apiResponseimpgsez.message?.impgsez);
		}

		setLoader(false);
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
										GSTR 2A
									</TableCell>
									<TableCell
										variant="head"
										colSpan="3"
										align="center"
										style={{ borderRight: '2px solid' }}
									>
										Purchase Register
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
								{rows.map(row => (
									<TableRow key={row.id}>
										<TableCell component="th" scope="row" style={{ borderRight: '2px solid' }}>
											{row.month}
										</TableCell>
										<TableCell component="th" scope="row"
											style={{ borderRight: '1px outset' }}
										>
											25
										</TableCell>
										<TableCell component="th" scope="row"
											style={{ borderRight: '1px outset' }}
										>
											35
										</TableCell>
										<TableCell component="th" scope="row"
											style={{ borderRight: '2px solid' }}
										>
											10
										</TableCell>
										<TableCell component="th" scope="row"
											style={{ borderRight: '1px outset' }}
										>
											5
										</TableCell>
										<TableCell component="th" scope="row"
											style={{ borderRight: '1px outset' }}
										>
											5500
										</TableCell>
										<TableCell component="th" scope="row"
											style={{ borderRight: '2px solid' }}
										>
											500
										</TableCell>
										<TableCell component="th" scope="row"
											style={{ borderRight: '1px outset' }}
										>
											-5
										</TableCell>
										<TableCell component="th" scope="row"
											style={{ borderRight: '1px outset' }}
										>
											-4500
										</TableCell>
										<TableCell component="th" scope="row"
											style={{ borderRight: '1px outset' }}
										>
											-600
										</TableCell>
									</TableRow>
								))}
								<TableRow style={{ backgroundColor: 'lightgrey' }}>
									<TableCell component="th" scope="row" style={{ borderRight: '2px solid' }}>
										<h5>Total</h5>
									</TableCell>
									<TableCell component="th" scope="row"
										style={{ borderRight: '1px outset' }}
									>
										25
									</TableCell>
									<TableCell component="th" scope="row"
										style={{ borderRight: '1px outset' }}
									>
										35
									</TableCell>
									<TableCell component="th" scope="row"
										style={{ borderRight: '2px solid' }}
									>
										10
									</TableCell>
									<TableCell component="th" scope="row"
										style={{ borderRight: '1px outset' }}
									>
										5
									</TableCell>
									<TableCell component="th" scope="row"
										style={{ borderRight: '1px outset' }}
									>
										5500
									</TableCell>
									<TableCell component="th" scope="row"
										style={{ borderRight: '2px solid' }}
									>
										500
									</TableCell>
									<TableCell component="th" scope="row"
										style={{ borderRight: '1px outset' }}
									>
										-5
									</TableCell>
									<TableCell component="th" scope="row"
										style={{ borderRight: '1px outset' }}
									>
										-4500
									</TableCell>
									<TableCell component="th" scope="row"
										style={{ borderRight: '1px outset' }}
									>
										-600
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</Paper>
				</Grid>
			</Grid>
		</div>
	)
};

DboardGSTR2A.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DboardGSTR2A);