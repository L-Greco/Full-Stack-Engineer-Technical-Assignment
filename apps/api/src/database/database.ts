/**
 * Role: Re-exports the database primitives so feature modules can import them from one stable boundary.
 */
export { closeDatabase, connectToDatabase, database } from "./database-client.js";
export { initializeDatabase } from "./database-init.js";
export type { DatabaseClient } from "./database-transaction.js";
export { withDatabaseTransaction } from "./database-transaction.js";
