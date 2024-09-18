function uniqTransactionId() {
  // Get the first 6 digits of the current timestamp in milliseconds
  const timestampPart = Date.now().toString().slice(0, 6);

  // Generate a random 4-letter alphabet string
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let alphabetPart = '';

  for (let i = 0; i < 4; i++) {
    alphabetPart += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  // Combine both parts
  return timestampPart + alphabetPart;
}

console.log(uniqTransactionId());
