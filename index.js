const { createRDSDbService, getDBParams } = require("./dbService");
const {
  getParamsFromUserPurchaseInfo,
  getParamsForFedNowPayment,
  getParamsForLedgerPromoEntry,
} = require("./params");
const { generateRandomBinary } = require("./utils");
const constants = require("./constants");

const RDS = createRDSDbService().getInstance();

/**
 * creates everything necessary to record a transaction bundle in RDS database
 *
 * A PTB (Purs Transaction Bundle) is a bundle of database records that are created as part of a Purs Transaction.
 * A single Transaction may include a promotion, it may include a Payment, it may include a fedNowPayment, but it always includes at least one LedgerEntry
 * @param {Object} userPurchaseInformation
 * @param {string} userPurchaseInformation.payor the id of the entity paying
 * @param {string} userPurchaseInformation.payee the id of the entity getting paid
 * @param {string} userPurchaseInformation.payorBankAccountID the bank account id of the entity paying
 * @param {string} userPurchaseInformation.payeeBankAccountID the bank account id of the entity getting paid
 * @param {string} userPurchaseInformation.dev the id of the developer
 * @param {integer} userPurchaseInformation.amount the amount being paid
 * @param {integer} userPurchaseInformation.interactionType 0 is mobile
 * @param {integer} userPurchaseInformation.paymentMethod 0 is fedNow 1 is card
 *
 * @param {Object}  promotionInformation
 * @param {integer} promotionInformation.promoAmount if there is a promotion put an amount here
 * @param {string} sqlTransactionID the id of the sql transaction
 * @returns an array with the ledger entry id and the payment id
 */
const executeStandardPTOperations = async (
  userPurchaseInformation,
  promotionInformation,
  sqlTransactionID
) => {
  try {
    const ledgeEntries = [];
    const paymentID = generateRandomBinary(32);
    let ledgerEntryID = generateRandomBinary(32);
    const idObj = {
      primaryPaymentID: paymentID,
      customerLedgerEntryID: ledgerEntryID,
    };
    ledgeEntries.push(ledgerEntryID);

    const params = getDBParams(sqlTransactionID);
    const parameters = getParamsFromUserPurchaseInfo(
      userPurchaseInformation,
      paymentID,
      ledgerEntryID
    );
    params.parameters = parameters;
    params.sql = constants.insertPaymentSQL;
    await RDS.executeStatement({ ...params }).promise();

    // this is an additional step for processing fedNow payments
    if (
      userPurchaseInformation.paymentMethod === 0 &&
      userPurchaseInformation.amount > 0
    ) {
      const fedNowPaymentID = generateRandomBinary(32);

      params.parameters.push(
        getParamsForFedNowPayment(userPurchaseInformation, fedNowPaymentID)
      );
      params.sql = constants.insertFedNowPaymentSQL;
      await RDS.executeStatement({ ...params }).promise();

      idObj.primaryFedNowPaymentID = fedNowPaymentID;
    }

    params.sql = constants.insertLedgerEntrySQL;
    await RDS.executeStatement({ ...params }).promise();

    if (promotionInformation.promoAmount > 0) {
      ledgerEntryID = generateRandomBinary(32);
      ledgeEntries.push(ledgerEntryID);
      params.parameters = getParamsForLedgerPromoEntry(
        userPurchaseInformation,
        ledgerEntryID
      );
      params.sql = constants.insertPromoLedgerEntrySQL;
      await RDS.executeStatement({ ...params }).promise();

      idObj.promotionLedgerEntryID = ledgerEntryID;
    }

    const pursTransactionID = generateRandomBinary(32);

    params.parameterSets = ledgeEntries.map((pursPayment) => [
      {
        name: "transactionId",
        value: {
          blobValue: Buffer.from(pursTransactionID, "hex"),
        },
      },
      {
        name: "ledgerId",
        value: {
          blobValue: Buffer.from(pursPayment, "hex"),
        },
      },
    ]);

    delete params.parameters;
    params.sql = constants.insertTransaction;

    await RDS.batchExecuteStatement({ ...params }).promise();

    idObj.pursTransactionID = pursTransactionID;

    return idObj;

  } catch (error) {
    // Handle errors
    console.error("Error occured during operation: ", error.message);
    throw error;
  }
};

module.exports = executeStandardPTOperations;
