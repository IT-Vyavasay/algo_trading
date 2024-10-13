function getCurrentTimeWithTimestamp() {
  const currentDate = new Date();

  // Formatting the date in the required format
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString('en-US', { month: 'short' });
  const year = currentDate.getFullYear();
  const time = currentDate.toLocaleTimeString('en-US', { hour12: false });

  const formattedDate = `${day}, ${month} ${year} ${time}`;

  // Getting the current timestamp in milliseconds
  const timestamp = Math.floor(currentDate.getTime());

  return {
    formattedDate: formattedDate,
    timestamp: timestamp,
  };
}

const result = getCurrentTimeWithTimestamp();
console.log('Formatted Date:', result.formattedDate);
console.log('Timestamp:', result.timestamp);
