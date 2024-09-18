export function uniqTransactionId(index = '') {
  // Get the first 6 digits of the current timestamp in milliseconds
  const timestampPart = Date.now().toString().slice(0, 6);

  // Generate a random 4-letter alphabet string
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let alphabetPart = '';

  for (let i = 0; i < 4; i++) {
    alphabetPart += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  // Combine both parts
  return timestampPart + alphabetPart + index;
}
export function getCurrentTimestamp() {
  return Math.floor(Date.now() / 1000); // Returns the current timestamp in seconds
}
export function convertTime(timestamp) {
  try {
    // Create a new Date object using the timestamp (in milliseconds)
    const date = new Date(timestamp * 1000);

    // Extract hours, minutes, and seconds
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of year

    // Return formatted string as HH:MM:SS DD:MM:YY
    return `${hours}:${minutes}:${seconds} ${day}:${month}:${year}`;
  } catch (error) {
    return 0;
  }
}

export function formatToTwoDecimals(num) {
  return Math.round(num * 100) / 100;
}

// Example usage:
