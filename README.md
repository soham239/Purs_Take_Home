# Purs_Take_Home


### Major changes I made to the code

1. Restructuring the code (For maintainability and readability)

- Instead of one big chunk of code, I have separated constants (SQL queries) to a different file - constants.js
- The params needed by different types of queries are moved to params.js
- The database connection object is moved to separate dbService.js which creates it only once and can be reused by any other files in future (Singleton Pattern)
- Utility function like generateRandomBinary has been moved to utils.js

2. Unit Testing

- DB connection creation and usage in a singleton manner is tested separately
- The different success scenarios are tested by changing parameters like promoAmount, paymentMethod, etc.
- Failure to execute any of the queries is handled in try-catch block and is tested in the failure unit test by simulating an executeStatement failure

### Open Issue:

Currently, multiple calls are happening to the RDS dataservice for one request to executePTOperations method. I feel that in this case maintaining a transaction and doing necessary rollback in case of failures is challenging.

Also, I need more domain specific info to understand how these queries are related to each other, or how the database tables are structured so that a decision can be made about how a failure for any of them should be handled.

Ideally, all query executions for a given operation should happen in a single transaction block so that rollbacks are automatic in RDS.