const DateHelper = require('./DateHelper.js');

describe('DateHelper', () => {
  it('getCurrentFinancialYearString should return the current financial year in a two-digit format', () => {
    const result = DateHelper.getCurrentFinancialYearString();

    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    const expected = `${currentYear.toString().slice(-2)}-${nextYear
      .toString()
      .slice(-2)}`;
    expect(result).toBe(expected);
  });

  it('getFinancialYearStringByGivenDate should return the financial year for a given date in a two-digit format', () => {
    const date = '2024-04-18';
    const result = DateHelper.getFinancialYearStringByGivenDate(date);
    expect(result).toBe('24-25');
  });

  it('getFinancialYearStartDate should return the start date of the current financial year', () => {
    const result = DateHelper.getFinancialYearStartDate();

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const startYear =
      currentDate.getMonth() < 3 ? currentYear - 1 : currentYear;

    const expected = `${startYear}-04-01`;

    expect(result).toBe(expected);
  });

  it('getFinancialYearStartDateByGivenDate should return the start date of the financial year for a given date', () => {
    const date = '2024-04-18';
    const result = DateHelper.getFinancialYearStartDateByGivenDate(date);
    expect(result).toBe('2024-04-01');
  });

  it('getFinancialYearEndDateByGivenDate should return the end date of the financial year for a given date', () => {
    const date = '2024-04-18';
    const result = DateHelper.getFinancialYearEndDateByGivenDate(date);
    expect(result).toBe('2025-03-31');
  });

  it('getFinancialYearEndDate should return the end date of the current financial year', () => {
    const result = DateHelper.getFinancialYearEndDate();

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const endYear = currentDate.getMonth() < 3 ? currentYear : currentYear + 1;

    const expected = `${endYear}-03-31`;

    expect(result).toBe(expected);
  });

  it("getYesterdayDate should return yesterday's date in ISO string format", () => {
    const result = DateHelper.getYesterdayDate();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(result).toBe(yesterday.toISOString().slice(0, 10));
  });

  it("getCurrentDateInDDMMYY should return today's date in DDMMYY format", () => {
    const result = DateHelper.getCurrentDateInDDMMYY();
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2);
    expect(result).toBe(day + month + year);
  });

  it('getSelectedDateMonthAndYearMMYYYY should return the month and year of a given date in MMYYYY format', () => {
    const date = '2024-04-18';
    const result = DateHelper.getSelectedDateMonthAndYearMMYYYY(date);
    expect(result).toBe('042024');
  });

  it("getSelectedDayDateMonthAndYearMMYYYY should return today's date in DDMMYYYY format", () => {
    const result = DateHelper.getSelectedDayDateMonthAndYearMMYYYY();
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear());
    expect(result).toBe(day + month + year);
  });

  it('formatDate should convert a date string from the format "yyyy-MM-dd" to "dd-MM-yyyy"', () => {
    const date = '2024-04-18';
    const result = DateHelper.formatDate(date);
    expect(result).toBe('18-04-2024');
  });

  it('get30DaysBeforeDate should return the date from 30 days ago in "YYYY-MM-DD" format', () => {
    const result = DateHelper.get30DaysBeforeDate();
    const date = new Date();
    date.setDate(date.getDate() - 30);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    expect(result).toBe(`${year}-${month}-${day}`);
  });

  it("getTodayDate should return today's date in the format 'yy-mm-dd'", () => {
    const result = DateHelper.getTodayDate();
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2);
    expect(result).toBe(`${year}-${month}-${day}`);
  });

  it("getTodayDateInYYYYMMDD should return today's date in the format 'yyyy-mm-dd'", () => {
    const result = DateHelper.getTodayDateInYYYYMMDD();
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear());
    expect(result).toBe(`${year}-${month}-${day}`);
  });

  it('getCurrentFinancialYear should return the current financial year', () => {
    const result = DateHelper.getCurrentFinancialYear();
    const today = new Date();
    const year =
      today.getMonth() > 3 || today.getMonth() === 3
        ? today.getFullYear()
        : today.getFullYear() - 1;
    expect(result).toBe(year);
  });

  it("formatDateToYYYYMMDD should format a date to the 'YYYY-MM-DD' format", () => {
    const date = new Date('2024-04-18');
    const result = DateHelper.formatDateToYYYYMMDD(date);
    expect(result).toBe('2024-04-18');
  });

  it("getOneDayBeforeGivenDate should return one day before a given date in 'YYYY-MM-DD' format", () => {
    const date = '2024-04-18';
    const result = DateHelper.getOneDayBeforeGivenDate(date);
    expect(result).toBe('2024-04-17');
  });
});
