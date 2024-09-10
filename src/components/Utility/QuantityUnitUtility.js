export const getQuantityByUnit = (product) => {
    let qty = 0;
    if (
      product.primaryUnit &&
      product.qtyUnit === product.primaryUnit.fullName
    ) {
      qty = product.qty;
    }

    if (
      product.secondaryUnit &&
      product.qtyUnit === product.secondaryUnit.fullName
    ) {
      qty = product.qty / product.unitConversionQty;
    }

    return qty;
  };

  export const getFreeQuantityByUnit = (product) => {
    let qty = 0;
    if (
      product.primaryUnit &&
      product.qtyUnit === product.primaryUnit.fullName
    ) {
      qty = product.freeQty;
    }

    if (
      product.secondaryUnit &&
      product.qtyUnit === product.secondaryUnit.fullName
    ) {
      qty = product.freeQty / product.unitConversionQty;
    }

    return qty;
  };