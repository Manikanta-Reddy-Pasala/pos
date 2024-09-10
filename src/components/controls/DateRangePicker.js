import "date-fns";
import React, { useEffect } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { makeStyles, Typography } from "@material-ui/core";

export default function DateRangePicker(props)
{

    const [fromDate, setFromDate] = React.useState(props.value ? props.value.fromDate : new Date());
    const [toDate, setToDate] = React.useState(props.value ? props.value.toDate : new Date());

    useEffect(() =>
    {
        props.onChange && props.onChange({ fromDate, toDate })
    }, [fromDate, toDate])

    return (
        <div style={{ marginLeft: "10px", marginRight: "10px" }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div style={{ alignItems: "center", backgroundColor: '#fbfbfb', display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
                    <Typography style={{ marginLeft: "10px", marginRight: "10px" }}>From</Typography>
                    <KeyboardDatePicker autoOk={true} margin="dense" variant="inline" format="dd/MM/yyyy" id="fromdate" value={fromDate} onChange={(date) => setFromDate(date)} KeyboardButtonProps={{ "aria-label": "change date" }} />
                    <Typography style={{ marginLeft: "10px", marginRight: "10px" }}>To</Typography>
                    <KeyboardDatePicker autoOk={true} margin="dense" variant="inline" format="dd/MM/yyyy" id="todate" value={toDate} onChange={(date) => setToDate(date)} KeyboardButtonProps={{ "aria-label": "change date" }} style={{ marginRight: "10px" }} />
                </div>
            </MuiPickersUtilsProvider>
        </div>
    );
}
