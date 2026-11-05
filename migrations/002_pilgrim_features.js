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

    // 1. Alter donations table to link to users
    await client.query(`
      ALTER TABLE donations 
      ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
    `);

    // 2. Alter sevas table to add public visibility toggle
    await client.query(`
      ALTER TABLE sevas 
      ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE;
    `);

    // 3. Create seva_slots table
    await client.query(`
      CREATE TABLE IF NOT EXISTS seva_slots (
          id SERIAL PRIMARY KEY,
          seva_id INTEGER REFERENCES sevas(id) ON DELETE CASCADE,
          slot_time VARCHAR(100) NOT NULL,
          capacity INTEGER DEFAULT 10,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Create seva_bookings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS seva_bookings (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          seva_id INTEGER REFERENCES sevas(id) ON DELETE CASCADE,
          slot_id INTEGER REFERENCES seva_slots(id) ON DELETE SET NULL,
          booking_date DATE NOT NULL,
          amount DECIMAL(10, 2) NOT NULL,
          payment_status VARCHAR(50) DEFAULT 'PENDING',
          payment_provider VARCHAR(50),
          transaction_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query('COMMIT');
    console.log('Migration 002 up completed successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Migration 002 failed:', e);
    throw e;
  } finally {
    client.release();
  }
}

async function down() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('DROP TABLE IF EXISTS seva_bookings');
    await client.query('DROP TABLE IF EXISTS seva_slots');
    await client.query('ALTER TABLE sevas DROP COLUMN IF EXISTS is_public');
    await client.query('ALTER TABLE donations DROP COLUMN IF EXISTS user_id');

    await client.query('COMMIT');
    console.log('Migration 002 down completed successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Migration 002 failed:', e);
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
