export const headerConfig = (isBorderedCells) => [
  {
    name: '#',
    key: 'id',
    style: {
      ...baseCellStyle({
        borderLeft: isBorderedCells,
        width: 5,
        borderRight: isBorderedCells,
        textAlign: 'left',
        borderLeftColor: isBorderedCells ? 'transparent' : 'none'
      })
    }
  },
  {
    name: 'Name',
    key: 'item_name',
    style: {
      ...baseCellStyle({
        borderRight: isBorderedCells,
        textAlign: 'left'
      })
    }
  },
  {
    name: 'Number',
    key: 'numbers',
    style: { ...baseCellStyle({ borderRight: isBorderedCells }) }
  },
  {
    name: 'No. of CTN',
    key: 'totalPackingNos',
    style: { ...baseCellStyle({ borderRight: isBorderedCells }) },
    total: true
  },
  {
    name: 'N. Wt./CTN',
    key: 'netWeightPerPackage',
    style: { ...baseCellStyle({ borderRight: isBorderedCells }) }
  },

  {
    name: 'Gr. Wt./CTN',
    key: 'grossWeightPerPackage',
    style: { ...baseCellStyle({ borderRight: isBorderedCells }) }
  },
  {
    name: 'Total N. Wt.',
    key: 'totalPackageNetWeight',
    style: { ...baseCellStyle({ borderRight: isBorderedCells, width: 20 }) },
    total: true
  },
  {
    name: 'Total Gr. Wt.',
    key: 'totalPackageGrossWeight',
    style: {
      ...baseCellStyle({
        borderRight: isBorderedCells,
        borderRightColor: isBorderedCells ? 'transparent' : 'none'
      })
    },
    total: true
  }
];

export const baseCellStyle = (params) => {
  const { width, borderLeft, borderRight, textAlign, ...rest } = params || {};
  return {
    borderLeft: borderLeft ? '1px solid' : 'none',
    borderRight: borderRight ? '1px solid' : 'none',
    padding: '2px',
    width: width ? `${width}%` : '15%',
    textAlign: textAlign || 'right',
    ...rest
  };
};
