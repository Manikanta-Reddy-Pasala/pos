import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import
{
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function DatePicker(props)
{
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(new Date(props.value));

  const handleDateChange = (date) =>
  {
    setSelectedDate(date);
    props.onChange(date)
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container style={{ position: 'relative' }}>
        <KeyboardDatePicker
          variant='inline'
          format='dd/MM/yyyy'
          margin='normal'
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}
