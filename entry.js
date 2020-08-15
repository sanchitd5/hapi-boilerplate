import { startMyServer } from "./server/server";
// Read .env file.
import 'dotenv/config';


process.env.NODE_ENV = process.env.NODE_ENV || 'DEVELOPMENT'

/**
 * This is required in all environments since this is what mongoose uses to establish connection to a MongoDB instance.
 */
startMyServer();