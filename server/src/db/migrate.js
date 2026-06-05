import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import fs from "fs";
import path from "path";

async function runMigrations() {
  console.log("⏳ Running migrations...");

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  const migrationsFolder = path.resolve(process.cwd(), "drizzle");

  // Ensure migrations folder exists and contains the meta journal file expected
  // by the Drizzle migrator. If it doesn't exist, create the minimal structure
  // so the migrator can run (it will be a no-op if there are no migration files).
  const metaDir = path.join(migrationsFolder, "meta");
  const journalFile = path.join(metaDir, "_journal.json");

  try {
    if (!fs.existsSync(migrationsFolder)) {
      fs.mkdirSync(migrationsFolder, { recursive: true });
      console.log(`Created migrations folder at ${migrationsFolder}`);
    }

    if (!fs.existsSync(metaDir)) {
      fs.mkdirSync(metaDir, { recursive: true });
      console.log(`Created meta folder at ${metaDir}`);
    }

    if (!fs.existsSync(journalFile)) {
      // Initialize an empty journal so Drizzle migrator can read it.
      fs.writeFileSync(journalFile, "[]", "utf8");
      console.log(`Initialized migration journal at ${journalFile}`);
    }
  } catch (e) {
    console.warn("Warning: failed to prepare migrations folder:", e?.message ?? e);
  }

  await migrate(db, { migrationsFolder: migrationsFolder });

  console.log("✅ Migrations completed successfully!");
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
