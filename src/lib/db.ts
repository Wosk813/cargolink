'use server'

import { Pool } from "pg";

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: 5432,
  database: process.env.POSTGRES_DB,
});

export async function query(text: string, params?: any[]) {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
}

export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("Successfully connected to PostgreSQL");
    client.release();
    return true;
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
    return false;
  }
}
