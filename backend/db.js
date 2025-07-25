import sqlite3 from "sqlite3";
import { open } from "sqlite";

export let db;

const init = async () => {
  db = await open({
    filename: "./bank.db", 
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      customer_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS loans (
      loan_id TEXT PRIMARY KEY,
      customer_id TEXT,
      principal_amount REAL,
      total_amount REAL,
      interest_rate REAL,
      loan_period_years INTEGER,
      monthly_emi REAL,
      status TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(customer_id) REFERENCES customers(customer_id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      payment_id TEXT PRIMARY KEY,
      loan_id TEXT,
      amount REAL,
      payment_type TEXT,
      payment_date TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(loan_id) REFERENCES loans(loan_id)
    );
  `);

  console.log("Database initialized (bank.db)");
};

init();
