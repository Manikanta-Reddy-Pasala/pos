import React from 'react';
import { headerConfig } from './utils';

const PackageDetailsRow = ({ theme, data }) => {
  const isBorderedCells = !['Theme 1', 'Theme 4', 'Theme 6'].includes(theme);

  const wrapperStyles = {
    display: 'flex',
    width: '100%'
  };

  const HEADER_CONFIG = headerConfig(isBorderedCells);

  const getTotals = (key) => {
    const total = data.reduce((total, item) => {
      total = total + Number(item[key]);
      return total;
    }, 0);
    return isNaN(total) ? '' : total?.toFixed(2);
  };

  const getCellData = (data, key, index) => {
    if (key === 'id') return index + 1;
    if (key === 'numbers')
      return data?.startPackingNo || data?.endPackingNo
        ? `${data?.startPackingNo || ''} to ${data?.endPackingNo || ''}`
        : '';
    return data[key];
  };

  const totalsRow = (
    <div
      style={{
        ...wrapperStyles,
        borderTop: '1px solid',
        borderBottom: !isBorderedCells ? '1px solid' : 'none',
        fontWeight: 600
      }}
    >
      {HEADER_CONFIG.map((item) => (
        <div key={item.name} style={item.style}>
          {item.key === 'numbers'
            ? 'Total'
            : item.total
            ? getTotals(item.key)
            : ''}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div style={{ minHeight: '260px' }}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              ...wrapperStyles,
              borderBottom:
                isBorderedCells && index === data.length - 1
                  ? '1px solid'
                  : 'none'
            }}
          >
            {HEADER_CONFIG.map((config, i) => (
              <div
                key={`row-${index}-column${i}`}
                style={{
                  ...config.style,
                  borderLeft: i === 0 ? 'none' : config.style.borderLeft,
                  borderRight:
                    i === HEADER_CONFIG.length - 1
                      ? 'none'
                      : config.style.borderRight
                }}
              >
                {getCellData(item, config.key, index)}
              </div>
            ))}
          </div>
        ))}
      </div>
      {totalsRow}
    </>
  );
};

export default PackageDetailsRow;
