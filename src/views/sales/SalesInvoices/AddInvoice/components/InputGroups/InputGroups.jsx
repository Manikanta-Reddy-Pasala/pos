import React from 'react';
import CustomInput from '../CustomInput';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import * as currencyHelper from 'src/components/Utility/CurrencyUtility';
import InputAdornment from '@material-ui/core/InputAdornment';

const InputGroups = (props) => {
  const { data, handleInputChange, name, inputValues } = props;

  const conversionRateProps = (input) => {
    const { name } = input || {};

    if (name !== 'exportConversionRate') return {};

    const country = inputValues['exportCurrency']?.split(' - ')?.[0];

    if (!country) return {};

    const symbol = currencyHelper.currencySymbol[country];
    return {
      InputProps: {
        startAdornment: (
          <InputAdornment position="start">1 {symbol} =</InputAdornment>
        )
      }
    };
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography color="secondary">{name}</Typography>
        <Grid container spacing={5} component={Box} pt={2}>
          {data.map((input) => (
            <Grid item xs={12} md={6} lg={3} key={input.name}>
              <CustomInput
                {...input}
                value={inputValues[input?.name || '']}
                callback={handleInputChange}
                {...conversionRateProps(input)}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default InputGroups;
