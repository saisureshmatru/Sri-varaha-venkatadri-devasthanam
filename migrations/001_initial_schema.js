	const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
      }
);

async function up() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'USER',
          phone VARCHAR(20),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
          key VARCHAR(255) PRIMARY KEY,
          value JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create donations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS donations (
          id SERIAL PRIMARY KEY,
          donor_name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(20),
          pan_number VARCHAR(20),
          amount DECIMAL(10, 2) NOT NULL,
          donation_type VARCHAR(100) NOT NULL,
          payment_status VARCHAR(50) DEFAULT 'PENDING',
          payment_provider VARCHAR(50),
          transaction_id VARCHAR(255),
          receipt_url VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_public BOOLEAN DEFAULT TRUE
      );
    `);

    // Create sevas table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sevas (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          amount DECIMAL(10, 2) NOT NULL,
          image_url VARCHAR(500),
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          event_date TIMESTAMP,
          image_url VARCHAR(500),
          type VARCHAR(50) DEFAULT 'EVENT', -- FESTIVAL, ANNOUNCEMENT
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create gallery_albums table
    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery_albums (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create gallery_items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery_items (
          id SERIAL PRIMARY KEY,
          album_id INTEGER REFERENCES gallery_albums(id) ON DELETE CASCADE,
          media_url VARCHAR(500) NOT NULL,
          media_type VARCHAR(50) DEFAULT 'IMAGE', -- IMAGE, VIDEO
          title VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create cms_pages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cms_pages (
          id SERIAL PRIMARY KEY,
          slug VARCHAR(255) UNIQUE NOT NULL,
          title VARCHAR(255) NOT NULL,
          content TEXT,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create audit_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          action VARCHAR(255) NOT NULL,
          details JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query('COMMIT');
    console.log('Migration up completed successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', e);
    throw e;
  } finally {
    client.release();
  }
}

async function down() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('DROP TABLE IF EXISTS audit_logs');
    await client.query('DROP TABLE IF EXISTS cms_pages');
    await client.query('DROP TABLE IF EXISTS gallery_items');
    await client.query('DROP TABLE IF EXISTS gallery_albums');
    await client.query('DROP TABLE IF EXISTS events');
    await client.query('DROP TABLE IF EXISTS sevas');
    await client.query('DROP TABLE IF EXISTS donations');
    await client.query('DROP TABLE IF EXISTS settings');
    await client.query('DROP TABLE IF EXISTS users');

    await client.query('COMMIT');
    console.log('Migration down completed successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', e);
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
