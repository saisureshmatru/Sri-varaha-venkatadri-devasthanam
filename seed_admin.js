const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedAdmin() {
  const connectionString = process.env.DATABASE_URL;

  const client = new Client(
    connectionString
      ? {
          connectionString,
          ssl: {
            rejectUnauthorized: false, // Required for Neon cloud databases
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

  try {
    await client.connect();
    console.log('Connected to database.');

    const email = 'saiparla070@gmail.com';
    const rawPassword = 'Hippo@2026';
    const role = 'ADMIN';
    const name = 'Admin Sai';

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(rawPassword, salt);

    // Insert or update the user
    const res = await client.query(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email)
      DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role
      RETURNING id, email, role;
    `, [name, email, passwordHash, role]);

    console.log('Successfully created/updated admin user:', res.rows[0]);
  } catch (err) {
    console.error('Failed to seed admin user:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedAdmin();
