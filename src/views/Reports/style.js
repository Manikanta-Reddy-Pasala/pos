export const themeStyle = (theme) => {
  return {
    content: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: 10,
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 10,
      borderRadius: '12px'
    },
    root: {
      // padding: 2,
      borderRadius: '12px'
    },
    label: {
      flexDirection: 'column'
    },
    iconLabel: {
      fontSize: 'x-small'
    },
    footer: {
      borderTop: '1px solid #d8d8d8'
    },
    amount: {
      textAlign: 'center',
      color: '#EF5350'
    },
    blockLine: {
      display: 'inline-block',
      marginLeft: '13px'
    },
    greenText: {
      color: '#339900'
    },
    redText: {
      color: '#EF5350'
    },
    csh: {
      marginTop: '30px',
      textAlign: 'center'
    },
    categoryActionWrapper: {
      paddingRight: '10px',
      '& .category-actions-left': {
        '& > *': {
          backgroundColor: '#fff',
          border: '1px solid lightgrey'
        }
      },
      '& .category-actions-right': {
        '& > *': {
          marginLeft: theme.spacing(1),
          backgroundColor: '#fff',
          border: '1px solid lightgrey'
        }
      }
    }
  };
};

export const formatHeaderRow = (headerRow) => {
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'd8f3fc' } // Yellow color
      };
      cell.font = { bold: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  };