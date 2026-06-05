import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Please create a .env file with your Neon connection string."
  );
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });

// Quick runtime check to verify the database is reachable. Use Drizzle to
// perform a lightweight select from the `exams` table (safe if the table
// exists) — this provides a clear success/failure message on startup.
db.select()
  .from(schema.exams)
  .limit(1)
  .then(() => {
    console.log("✅ Database connection successful (queried exams table)");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err?.message ?? err);
  });
