const AWS = require('aws-sdk');

let dbInstance;

// The singleton instance
const createRDSDbService = () => {
  // Private methods or configuration
  const initialize = () => {
    console.log('Initializing RDS DB service...');
  };

  // Public methods or properties
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

const getDBParams = (sqlTransactionID) => {
    return {
      database: process.env.DATABASE,
      secretArn: process.env.SECRET_ARN,
      resourceArn: process.env.CLUSTER_ARN,
      transactionId: sqlTransactionID,
    };
  };

module.exports = { createRDSDbService, getDBParams };
