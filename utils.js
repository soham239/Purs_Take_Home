const generateRandomBinary = (length) => {
  const binaryDigits = [];
  for (let i = 0; i < length; i++) {
    const digit = Math.floor(Math.random() * 2);
    binaryDigits.push(digit);
  }
  return binaryDigits.join("");
};
