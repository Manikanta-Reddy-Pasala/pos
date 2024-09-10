var dateFormat = require('dateformat');

// Get the current financial year in a two-digit format (e.g. "22-23").
export const getCurrentFinancialYearString = () => {
  const year =
    new Date().getMonth() < 3
      ? new Date().getFullYear() - 1
      : new Date().getFullYear();
  return `${year.toString().slice(-2)}-${(year + 1).toString().slice(-2)}`;
};

// Get the financial year for a given date in a two-digit format (e.g. "22-23").
export const getFinancialYearStringByGivenDate = (date) => {
  const year =
    new Date(date).getMonth() < 3
      ? new Date(date).getFullYear() - 1
      : new Date(date).getFullYear();
  return `${year.toString().slice(-2)}-${(year + 1).toString().slice(-2)}`;
};

// Get the start date of the current financial year in ISO string format (e.g. "2023-04-01").
export const getFinancialYearStartDate = () => {
  const today = new Date();
  const year =
    today.getMonth() > 3 || today.getMonth() === 3
      ? today.getFullYear()
      : today.getFullYear() - 1;
  return `${year}-04-01`;
};

export const getDateBeforeMonths = (months) => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based in JavaScript, so add 1 to get 1-based month
  const day = date.getDate();

  // Pad the month and day with a leading zero if they're less than 10
  const monthStr = month < 10 ? '0' + month : month.toString();
  const dayStr = day < 10 ? '0' + day : day.toString();

  return `${year}-${monthStr}-${dayStr}`;
}; // Get the financial year for a given date.
export const getFinancialYearStartDateByGivenDate = (date) => {
  const year =
    new Date(date).getMonth() < 3
      ? new Date(date).getFullYear() - 1
      : new Date(date).getFullYear();
  return `${year}-04-01`;
};

// Get the start date of the current financial year.
export const getCurrentFinancialYearStartDate = () => {
  const today = new Date();
  const year =
    today.getMonth() > 3 || today.getMonth() === 3
      ? today.getFullYear()
      : today.getFullYear() - 1;
  return `${year}-04-01`;
};

// Get the financial year for a given date.
export const getFinancialYearEndDateByGivenDate = (date) => {
  const year =
    new Date(date).getMonth() > 3 || new Date(date).getMonth() === 3
      ? new Date(date).getFullYear() + 1
      : new Date(date).getFullYear();
  return `${year}-03-31`;
};

// Get the start date of the current financial year.
export const getFinancialYearEndDate = () => {
  const today = new Date();
  const year =
    today.getMonth() > 3 || today.getMonth() === 3
      ? today.getFullYear() + 1
      : today.getFullYear();
  return `${year}-03-31`;
};

// Get yesterday's date in ISO string format (e.g. "2023-02-14").
export const getYesterdayDate = (fromDate = new Date()) => {
  const yesterday = new Date(fromDate);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().slice(0, 10);
};

export const getCurrentDateInDDMMYY = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = String(today.getFullYear()).slice(-2); // Extract the last two digits of the year

  return day + month + year;
};

//selectedDate format is YYYY-MM-DD
export const getSelectedDateMonthAndYearMMYYYY = (selectedDate) => {
  // Split the selectedDate string into year, month, and day parts
  const [year, month, day] = selectedDate.split('-').map(Number);

  // Construct the response in "MMYYYY" format
  const response = `${String(month).padStart(2, '0')}${year}`;

  return response;
};

export const getSelectedMonthAndYearMMYYYY = (year, month) => {
  let response = '';
  if (month > '03') {
    response = month + year;
  } else {
    response = month + (parseInt(year) + 1);
  }

  return response;
};

export const getSelectedDayDateMonthAndYearMMYYYY = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = String(today.getFullYear()); // Extract the last two digits of the year

  // Construct the response in "MMYYYY" format
  return `${String(day).padStart(2, '0')}${String(month).padStart(
    2,
    '0'
  )}${year}`;
};

//date string from the format "yyyy-MM-dd" to "dd-MM-yyyy"
export const formatDate = (inputDate) => {
  if (inputDate) {
    // Split the input date string by the '-' character
    const parts = inputDate.split('-');

    // Ensure there are three parts (year, month, day)
    if (parts.length === 3) {
      // Rearrange the parts and join them with '-' to form the new date string
      return parts[2] + '-' + parts[1] + '-' + parts[0];
    } else {
      // Handle invalid input date string
      return 'Invalid Date';
    }
  } else {
    // Handle invalid input date string
    return 'Invalid Date';
  }
};

export const get30DaysBeforeDate = () => {
  // Get the current date
  const currentDate = new Date();

  // Calculate the date from 30 days ago
  currentDate.setDate(currentDate.getDate() - 30);

  // Format the date as a string (e.g., "YYYY-MM-DD")
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};

// This function returns today's date in the format 'yy-mm-dd'
export const getTodayDate = () => {
  // Get the current date
  const today = new Date();

  // Get the day, pad it with leading zeros if necessary
  const day = String(today.getDate()).padStart(2, '0');

  // Get the month, add 1 because months are zero-based in JavaScript, pad it with leading zeros if necessary
  const month = String(today.getMonth() + 1).padStart(2, '0');

  // Get the year, slice the last two digits because we only want the 'yy' part for this format
  const year = String(today.getFullYear()).slice(-2);

  // Format the date in 'yy-mm-dd' format
  const formattedDate = `${year}-${month}-${day}`;

  // Return the formatted date
  return formattedDate;
};

// This function returns today's date in the format 'yyyy-mm-dd'
export const getTodayDateInYYYYMMDD = () => {
  // Get the current date
  const today = new Date();

  // Get the day, pad it with leading zeros if necessary
  const day = String(today.getDate()).padStart(2, '0');

  // Get the month, add 1 because months are zero-based in JavaScript, pad it with leading zeros if necessary
  const month = String(today.getMonth() + 1).padStart(2, '0');

  // Get the year
  const year = String(today.getFullYear());

  // Format the date in 'yyyy-mm-dd' format
  const formattedDate = `${year}-${month}-${day}`;

  // Return the formatted date
  return formattedDate;
};

export const getTomorrowDate = () => {
  const tomorrow = new Date(new Date());
  tomorrow.setDate(tomorrow.getDate() + 1);
  return dateFormat(tomorrow, 'yyyy-mm-dd');
};

export const getCurrentFinancialYear = () => {
  const today = new Date();
  const year =
    today.getMonth() > 3 || today.getMonth() === 3
      ? today.getFullYear()
      : today.getFullYear() - 1;
  return year;
};

// This function takes a date and formats it to the 'YYYY-MM-DD' format.
export const formatDateToYYYYMMDD = (date) => {
  // Create a new Date object from the input date
  var d = new Date(date),
    // Extract the month, day, and year from the Date object
    month = '' + (d.getMonth() + 1), // Months are 0-based in JavaScript
    day = '' + d.getDate(),
    year = d.getFullYear();

  // If the month or day is a single digit, prepend it with '0'
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  // Join the year, month, and day with '-' to get the final formatted date
  return [year, month, day].join('-');
};

export const convertDateToYYYYMMDD = (dateString) => {
  const [day, month, year] = dateString.split('-');
  return [year, month, day].join('-');
};

// get one day before date from the given date in 'YYYY-MM-DD' format. date is in 'YYYY-MM-DD' format
export const getOneDayBeforeGivenDate = (date) => {
  // Create a new Date object from the input date
  var d = new Date(date);
  // Subtract one day from the date
  d.setDate(d.getDate() - 1);
  // Format the date as 'YYYY-MM-DD' and return it
  return formatDateToYYYYMMDD(d);
};

export const isCurrentOrFutureYearMonth = (year, month) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Months are zero-based

  if (year > currentYear) {
    return true;
  } else if (
    year === currentYear &&
    (month >= currentMonth || month === currentMonth - 1)
  ) {
    return true;
  } else {
    return false;
  }
  // return true;
};

// get current time in milliseconds
export const getCurrentTimeInMilliseconds = () => {
  return new Date().getTime();
};

export const excelDateToJSDate = (date) => {
  // Convert Excel date to JavaScript date
  let converted_date = new Date(Math.round((date - 25569) * 864e5));

  // Convert the date to a string and slice it to get the date part
  converted_date = String(converted_date).slice(4, 15);

  // Split the date string into an array [ 'month', 'day', 'year' ]
  let dateParts = converted_date.split(' ');

  // Extract the day, month, and year
  let day = dateParts[1];
  let month = dateParts[0];
  let year = dateParts[2];

  // Convert the month from a string to a number (e.g., 'Jan' to 1)
  month = 'JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(month) / 3 + 1;

  // Pad the month with a leading zero if it's a single digit
  if (month.toString().length <= 1) month = '0' + month;

  // Construct the date string in 'YYYY-MM-DD' format
  let strDate = `${year}-${month}-${day}`;

  // Return the formatted date
  return strDate;
};

export const getMonthStartEndDates = (month, year) => {
  // Create a Date object for the first day of the month
  const startDate = new Date(year, month - 1, 1);

  // Create a Date object for the last day of the month
  const endDate = new Date(year, month, 0);

  return {
    startDate,
    endDate
  };
};

export const getLast15DaysDate = () => {
  const today = new Date();
  const last15Days = new Date(today.setDate(today.getDate() - 15));
  const year = last15Days.getFullYear();
  const month = last15Days.getMonth() + 1;
  const day = last15Days.getDate();
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

//get last 15 days updatedAt from the today date  in milliseconds
export const getLast15DaysUpdatedAt = () => {
  const today = new Date();
  const last15Days = new Date(today.setDate(today.getDate() - 15));
  return last15Days.getTime();
};

export const convertDaysToYearsMonthsDays = (days) => {
  const daysInYear = 365.25;
  const daysInMonth = 30.44;

  const years = Math.floor(days / daysInYear);
  let remainingDays = days % daysInYear;
  let months = Math.floor(remainingDays / daysInMonth);
  remainingDays = Math.floor(remainingDays % daysInMonth);

  let result = '';
  if (years > 0) {
    result += `${years} year${years > 1 ? 's' : ''} `;
  }
  if (remainingDays >= 28) {
    months = months + 1;
    remainingDays = 0;
  }

  if (months > 0) {
    result += `${months} month${months > 1 ? 's' : ''} `;
  }
  if (remainingDays > 0 || (years === 0 && months === 0)) {
    result += `${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
  }

  return result.trim();
};

export const calculateNewDateForProvidedDateAndDays = (
  inputDate,
  daysToAdd
) => {
  const currentDate = new Date(inputDate);
  const newDate = new Date(currentDate);
  newDate.setDate(currentDate.getDate() + parseInt(daysToAdd, 10));

  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(newDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const checkDateRange = (startDate, endDate, checkDaysRange) => {
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = end - start;

    // Convert milliseconds to days
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    // Check if the difference exceeds 30 days
    return differenceInDays > checkDaysRange ? true : false;
  }
};

export const getMonthBeginningDate = () => {
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  var d = new Date(firstThisMonth),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

export const getMonthDates = (today) => {
  const currentYear = today.getFullYear();

  // Determine the financial year start based on today's date
  const financialYearStartYear = today.getMonth() + 1 < 4 ? currentYear - 1 : currentYear;
  
  const dates = [];

  // Generate dates for each month from April to March
  for (let i = 0; i < 12; i++) {
    const startMonth = new Date(financialYearStartYear, 3 + i, 1); // April = 3 (index), May = 4, etc.

    dates.push({
      month: startMonth.toLocaleString('default', { month: 'long' }),
      start: dateFormat(new Date(startMonth.getFullYear(), startMonth.getMonth(), 1), 'yyyy-mm-dd'),
      end: dateFormat(new Date(startMonth.getFullYear(), startMonth.getMonth() + 1, 0), 'yyyy-mm-dd')
    });
  }

  return dates;
};