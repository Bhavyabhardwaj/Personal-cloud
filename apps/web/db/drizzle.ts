import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Create a new PostgreSQL pool
const pool = new Pool({
  connectionString: "postgres://user:password@localhost:5432/postgres",
});


// Initialize Drizzle ORM
export const db = drizzle(pool);
