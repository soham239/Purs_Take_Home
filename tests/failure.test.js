const AWS = require('aws-sdk');
const executeStandardPTOperations = require("../index.js");

// Mock AWS.RDSDataService
jest.mock('aws-sdk', () => ({
    RDSDataService: jest.fn(() => ({
      executeStatement: jest.fn().mockImplementation(() => ({
        promise: jest.fn(() => Promise.reject(new Error('Simulated executeStatement error'))),
      })),
      batchExecuteStatement: jest.fn().mockReturnValue({ promise: jest.fn() }),
    })),
  }));

  jest.mock("../utils", () => ({
    generateRandomBinary: jest.fn((length) =>
      "mockedRandomBinary".slice(0, length)
    ),
  }));

  const userPurchaseInformation = {
    payor: "payor123",
    payee: "payee456",
    payorBankAccountID: "bankAcc123",
    payeeBankAccountID: "bankAcc456",
    dev: "dev789",
    amount: 100,
    interactionType: 0,
  };
 
const sqlTransactionID = "mockedSQLTransactionID";

const promotionInformation = {
promoAmount: 0,
};

describe('executeStandardPTOperations Error Test', () => {

  it('should handle executeStatement failure for a specific test', async () => {
    // Call the function and expect it to throw an error
    await expect(
      executeStandardPTOperations(userPurchaseInformation, promotionInformation, sqlTransactionID)
    ).rejects.toThrow('Simulated executeStatement error');
  });
});
