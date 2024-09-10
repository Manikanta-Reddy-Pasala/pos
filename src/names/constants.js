export const getSaleName = () => {
  if (String(localStorage.getItem('isTemple')).toLowerCase() === 'true') {
    return 'Receipts';
  } else {
    return 'Sales';
  }
};

export const getProductName = () => {
  if (String(localStorage.getItem('isTemple')).toLowerCase() === 'true') {
    return 'Seva/Products';
  } else {
    return 'Products/Services';
  }
};

export const getCustomerName = () => {
  if (String(localStorage.getItem('isTemple')).toLowerCase() === 'true') {
    return 'Devotee/Trustee';
  } else if (String(localStorage.getItem('isClinic')).toLowerCase() === 'true') {
    return 'Client';
  } else {
    return 'Customer';
  }
};

export const CONSTANTS = {
  
};