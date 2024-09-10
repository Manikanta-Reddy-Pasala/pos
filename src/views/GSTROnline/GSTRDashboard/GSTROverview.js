import React from "react";
import { Grid } from "@material-ui/core";
import ReturnFilling from './GSTROverview/ReturnFillingTracker';
import EligibleVsClaimedITC from './GSTROverview/EligibleVsClaimedITC';
import TaxLedger from './GSTROverview/GSTRTaxLedger';
import GSTRAnnouncement from './GSTROverview/GSTRAnnouncement';

const GSTROverview = () => {
    return (
        <div>
            <Grid
                container
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
            >
                <Grid item xs={12} sm={12}>
                    <ReturnFilling />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <EligibleVsClaimedITC />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TaxLedger />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <GSTRAnnouncement />
                </Grid>
            </Grid>
        </div>
)
};
export default (GSTROverview);