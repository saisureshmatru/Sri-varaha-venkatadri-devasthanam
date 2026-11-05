const { Client } = require('pg');
require('dotenv').config();

async function checkDb() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();
    const cms = await client.query('SELECT slug, is_public FROM cms_pages');
    console.log('CMS Pages:', cms.rows);

    const sevas = await client.query('SELECT id, slug, is_public FROM sevas');
    console.log('Sevas:', sevas.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

checkDb();
