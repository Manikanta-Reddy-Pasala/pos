import React from 'react';
import { headerConfig } from './utils';
const PackageDetailsHeader = ({ theme }) => {
  const isBorderedCells = !['Theme 1', 'Theme 4', 'Theme 6'].includes(theme);

  const wrapperStyles = {
    display: 'flex',
    width: '100%',
    borderTop: isBorderedCells ? 'none' : '1px solid',
    borderBottom: isBorderedCells ? 'none' : '1px solid',
    fontWeight: 600,
    borderLeft: `1px solid ${isBorderedCells ? 'black' : 'transparent'}`,
    borderRight: `1px solid ${isBorderedCells ? 'black' : 'transparent'}`
  };

  const HEADER_CONFIG = headerConfig(isBorderedCells, true);
  return (
    <div
      style={{
        ...wrapperStyles
      }}
    >
      {HEADER_CONFIG.map((item) => (
        <div key={item.name} style={item.style}>
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default PackageDetailsHeader;
