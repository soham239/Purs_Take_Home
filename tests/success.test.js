const AWS = require("aws-sdk");
const executeStandardPTOperations = require("../index.js");

// Mock AWS.RDSDataService
jest.mock("aws-sdk", () => ({
  RDSDataService: jest.fn(() => ({
    executeStatement: jest.fn().mockReturnValue({ promise: jest.fn() }),
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

const expectedIDs = {
  primaryPaymentID: "mockedRandomBinary",
  customerLedgerEntryID: "mockedRandomBinary",
  pursTransactionID: "mockedRandomBinary",
};

const sqlTransactionID = "mockedSQLTransactionID";

const zeroPromotionInformation = {
  promoAmount: 0,
};

const nonZeroPromotionInformation = {
  promoAmount: 10,
};

describe("executeStandardPTOperationsZeroPromotions", () => {
  it("should execute standard operations and return IDs for Zero PromoAmount", async () => {
    userPurchaseInformation.paymentMethod = 1;
    const result = await executeStandardPTOperations(
      userPurchaseInformation,
      zeroPromotionInformation,
      sqlTransactionID
    );

    expect(result).toEqual(expectedIDs);
  });
});

describe("executeStandardPTOperationsNonZeroPromotions", () => {
  it("should execute standard operations and return IDs for Nonzero PromoAmount", async () => {
    userPurchaseInformation.paymentMethod = 1;
    expectedIDs.promotionLedgerEntryID = "mockedRandomBinary";

    const result = await executeStandardPTOperations(
      userPurchaseInformation,
      nonZeroPromotionInformation,
      sqlTransactionID
    );

    expect(result).toEqual(expectedIDs);
  });

  describe("executeStandardPTOperationsFedNow", () => {
    it("should execute standard operations and return IDs for FedNow Payment", async () => {
      userPurchaseInformation.paymentMethod = 0;
      expectedIDs.primaryFedNowPaymentID = "mockedRandomBinary";

      const result = await executeStandardPTOperations(
        userPurchaseInformation,
        nonZeroPromotionInformation,
        sqlTransactionID
      );

      expect(result).toEqual(expectedIDs);
    });
  });
});
