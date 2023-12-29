/**
 * Generates a random binary string of the specified length.
 *
 * @param {number} length - The length of the binary string to generate.
 * @returns {string} - The generated random binary string.
 */
const generateRandomBinary = (length) => {
  const binaryDigits = [];
  for (let i = 0; i < length; i++) {
    const digit = Math.floor(Math.random() * 2);
    binaryDigits.push(digit);
  }
  return binaryDigits.join("");
};
