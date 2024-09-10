export const containsLettersAndNumbers = (str) => {
  return /[a-zA-Z]/.test(str) && /[\W_]/.test(str) && /\d/.test(str);
};

export const extractLastNumber = (str) => {
  // Use regular expression to match numbers in the string
  const numbers = str.match(/\d+/g);
  // Check if numbers are found
  if (numbers) {
    // Return the last number from the array
    return Number(numbers[numbers.length - 1]);
  } else {
    // Return null if no numbers found
    return 0;
  }
};