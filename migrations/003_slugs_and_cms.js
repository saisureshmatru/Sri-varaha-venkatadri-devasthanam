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

    // 1. Add slug to sevas
    await client.query(`
      ALTER TABLE sevas 
      ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
    `);

    // Populate existing sevas with slugs
    await client.query(`
      UPDATE sevas SET slug = LOWER(REPLACE(title, ' ', '-')) WHERE slug IS NULL;
    `);

    // 2. Add is_public to cms_pages
    await client.query(`
      ALTER TABLE cms_pages 
      ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE;
    `);

    // Insert some default CMS pages if not exists
    await client.query(`
      INSERT INTO cms_pages (slug, title, content, is_public) 
      VALUES 
      ('about', 'About the Temple', 'Welcome to the Sri Venkateswara Swamy Temple...', TRUE),
      ('contact', 'Contact Us', 'Reach out to us at info@temple.org', TRUE)
      ON CONFLICT (slug) DO NOTHING;
    `);

    await client.query('COMMIT');
    console.log('Migration 003 up completed successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Migration 003 failed:', e);
    throw e;
  } finally {
    client.release();
  }
}

async function down() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('ALTER TABLE cms_pages DROP COLUMN IF EXISTS is_public');
    await client.query('ALTER TABLE sevas DROP COLUMN IF EXISTS slug');

    await client.query('COMMIT');
    console.log('Migration 003 down completed successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Migration 003 failed:', e);
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
