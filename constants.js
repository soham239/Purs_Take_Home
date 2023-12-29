/**
 * Module containing SQL statements for various database operations.
 *
 * @module constants
 * @exports {Object} - Object with SQL statements for database operations.
 */
module.exports = {
  /**
   * SQL statement for inserting a payment.
   * @type {string}
   */
  insertPaymentSQL: "TestSQL",

  /**
   * SQL statement for inserting a FedNow payment.
   * @type {string}
   */
  insertFedNowPaymentSQL: "TestFedNowPaymentSQL",

  /**
   * SQL statement for inserting a ledger entry.
   * @type {string}
   */
  insertLedgerEntrySQL: "TestLedgerEntrySQL",

  /**
   * SQL statement for inserting a promotional ledger entry.
   * @type {string}
   */
  insertPromoLedgerEntrySQL: "TestInsertPromoLedgerEntrySQL",

  /**
   * SQL statement for inserting a transaction.
   * @type {string}
   */
  insertTransaction: "TestInsertTransaction",
};
