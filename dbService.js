const AWS = require("aws-sdk");

let dbInstance;

/**
 * Create and manage a singleton instance of the AWS RDS DB service.
 *
 * @returns {Object} - Object with a method to get the singleton instance.
 */
const createRDSDbService = () => {
  const initialize = () => {
    console.log("Initializing RDS DB service...");
  };

  return {
    getInstance: () => {
      if (!dbInstance) {
        dbInstance = new AWS.RDSDataService();
        initialize();
      }
      return dbInstance;
    },
  };
};

/**
 * Get the parameters required for interacting with the RDS database.
 *
 * @param {string} sqlTransactionID - The ID of the SQL transaction.
 * @returns {Object} - Object with the necessary parameters for database interaction.
 */
const getDBParams = (sqlTransactionID) => {
  return {
    database: process.env.DATABASE,
    secretArn: process.env.SECRET_ARN,
    resourceArn: process.env.CLUSTER_ARN,
    transactionId: sqlTransactionID,
  };
};

/**
 * Module for creating and managing the AWS RDS DB service instance and retrieving database parameters.
 *
 * @module dbService
 * @exports {Object} - Object with functions related to the RDS DB service and database parameters.
 */
module.exports = { createRDSDbService, getDBParams };
