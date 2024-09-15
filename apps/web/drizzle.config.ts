import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./db/schema.ts",
    out: "./drizzle/migrations",  // Correct path for migrations
    dbCredentials: {
        url: "postgresql://postgres:mysecretpassword@localhost:5432/postgres"
    }
});