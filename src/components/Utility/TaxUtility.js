export const isTaxRateValid = async (taxRate, auditSettings) => {
  let validTaxList = ['0', '0.25', '1.5', '3', '5', '12', '18', '28'];

  let response = {
    isTaxRateValid: false,
    errorMessage: ''
  };

  if (
    auditSettings &&
    auditSettings.taxApplicability &&
    auditSettings.taxApplicability.length > 0
  ) {
    if (auditSettings.taxApplicability.includes(taxRate)) {
      response.isTaxRateValid = true;
    } else {
      response.errorMessage =
        'Tax Rate provided is invalid. The primary GST slabs are presently pegged at ' +
        validTaxList.map((item) => item + '%') +
        '. Please check Audit Settings further to apply correct tax.';
    }
  } else {
    if (
      taxRate === 0 ||
      taxRate === 0.25 ||
      taxRate === 1.5 ||
      taxRate === 3 ||
      taxRate === 5 ||
      taxRate === 12 ||
      taxRate === 18 ||
      taxRate === 28
    ) {
      response.isTaxRateValid = true;
    } else {
      response.errorMessage =
        'Tax Rate provided is invalid. The primary GST slabs are presently pegged at ' +
        validTaxList.map((item) => item + '%') +
        '. Please check Audit Settings further to apply correct tax.';
    }
  }

  return response;
};