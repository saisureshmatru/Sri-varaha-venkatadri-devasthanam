const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigrationsAndSetup() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to Neon PostgreSQL database successfully.');

    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort(); // Ensures chronological order (001, 002, etc.)

    for (const file of files) {
      console.log(`Running migration: ${file}`);
      const migrationPath = path.join(migrationsDir, file);
      const migration = require(migrationPath);
      
      if (typeof migration.up === 'function') {
        await migration.up(client);
      } else if (typeof migration === 'function') {
        await migration(client);
      }
      console.log(`Completed: ${file}`);
    }

    console.log('All migrations executed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrationsAndSetup();
