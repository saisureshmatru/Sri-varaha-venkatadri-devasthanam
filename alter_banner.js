require('dotenv').config({ path: '.env.local' });
const { query } = require('./src/lib/db');

async function alterTable() {
  try {
    await query('ALTER TABLE home_banners ADD COLUMN title TEXT;');
    console.log('Added title column successfully');
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log('Title column already exists');
    } else {
      console.error(err);
    }
  }
}
alterTable();
