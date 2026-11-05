require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const { query } = require('../src/lib/db');

async function migrate() {
  console.log('Running migration 006_home_banners...');

  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS home_banners (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        image_url TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await query(createTableQuery);
    console.log('Table home_banners created or already exists.');
  } catch (error) {
    console.error('Error creating home_banners table:', error);
  }
}

migrate().catch(console.error);
