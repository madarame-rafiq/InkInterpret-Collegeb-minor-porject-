import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import dotenv from "dotenv";
import pg from "pg";

const { Pool } = pg;
const moduleDirectory = dirname(fileURLToPath(import.meta.url));

// Resolve the server environment relative to this module, rather than the
// caller's working directory. This keeps the shared pool usable by server/
// commands and repository-root standalone scripts alike.
dotenv.config({
  path: resolve(moduleDirectory, "../../.env"),
  quiet: true,
});

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (error) => {
    console.log(`An unexpected postres error has occured ${error}`);
});
