const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function up() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Add Soft Deletes (deleted_at)
    await client.query(`ALTER TABLE sevas ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;`);
    await client.query(`ALTER TABLE gallery_albums ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;`);
    await client.query(`ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;`);
    await client.query(`ALTER TABLE cms_pages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;`);

    // 2. Add Telugu (_te) columns for bilingual content
    await client.query(`ALTER TABLE sevas ADD COLUMN IF NOT EXISTS title_te VARCHAR(255);`);
    await client.query(`ALTER TABLE sevas ADD COLUMN IF NOT EXISTS description_te TEXT;`);

    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS title_te VARCHAR(255);`);
    await client.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS description_te TEXT;`);

    await client.query(`ALTER TABLE gallery_albums ADD COLUMN IF NOT EXISTS title_te VARCHAR(255);`);
    await client.query(`ALTER TABLE gallery_albums ADD COLUMN IF NOT EXISTS description_te TEXT;`);

    await client.query(`ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS title_te VARCHAR(255);`);

    await client.query(`ALTER TABLE cms_pages ADD COLUMN IF NOT EXISTS title_te VARCHAR(255);`);
    await client.query(`ALTER TABLE cms_pages ADD COLUMN IF NOT EXISTS content_te TEXT;`);

    await client.query('COMMIT');
    console.log('Migration 004 up completed successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Migration 004 failed:', e);
    throw e;
  } finally {
    client.release();
  }
}

async function down() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`ALTER TABLE cms_pages DROP COLUMN IF EXISTS title_te, DROP COLUMN IF EXISTS content_te, DROP COLUMN IF EXISTS deleted_at;`);
    await client.query(`ALTER TABLE gallery_items DROP COLUMN IF EXISTS title_te, DROP COLUMN IF EXISTS deleted_at;`);
    await client.query(`ALTER TABLE gallery_albums DROP COLUMN IF EXISTS title_te, DROP COLUMN IF EXISTS description_te, DROP COLUMN IF EXISTS deleted_at;`);
    await client.query(`ALTER TABLE events DROP COLUMN IF EXISTS title_te, DROP COLUMN IF EXISTS description_te, DROP COLUMN IF EXISTS deleted_at;`);
    await client.query(`ALTER TABLE sevas DROP COLUMN IF EXISTS title_te, DROP COLUMN IF EXISTS description_te, DROP COLUMN IF EXISTS deleted_at;`);

    await client.query('COMMIT');
    console.log('Migration 004 down completed successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Migration 004 failed:', e);
    throw e;
  } finally {
    client.release();
  }
}

module.exports = { up, down };

if (require.main === module) {
  const action = process.argv[2];
  if (action === 'up') {
    up().then(() => process.exit(0)).catch(() => process.exit(1));
  } else if (action === 'down') {
    down().then(() => process.exit(0)).catch(() => process.exit(1));
  } else {
    console.log('Please provide an action: up or down');
    process.exit(1);
  }
}
