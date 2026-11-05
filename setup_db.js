const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  // Connect to the default 'postgres' database first
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres', // Connect to default DB to create the new one
    password: process.env.DB_PASSWORD || 'sai',
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL server.');
    
    // Check if temple_db exists
    const res = await client.query("SELECT datname FROM pg_catalog.pg_database WHERE datname = 'temple_db'");
    if (res.rows.length === 0) {
      console.log('Database temple_db not found. Creating it...');
      await client.query('CREATE DATABASE temple_db');
      console.log('Database temple_db created successfully.');
    } else {
      console.log('Database temple_db already exists.');
    }
  } catch (err) {
    console.error('Failed to create database:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabase();
