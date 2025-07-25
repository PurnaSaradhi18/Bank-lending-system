import { db } from "../db.js";
import { v4 as uuidv4 } from "uuid";

export const createLoan = async (req, res) => {
  try {
    const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = req.body;

    if (!customer_id || !loan_amount || !loan_period_years || !interest_rate_yearly) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const principal = parseFloat(loan_amount);
    const interest = principal * loan_period_years * (interest_rate_yearly / 100);
    const total_amount = principal + interest;
    const monthly_emi = total_amount / (loan_period_years * 12);
    const loan_id = uuidv4();

    await db.run(
      `INSERT INTO loans (loan_id, customer_id, principal_amount, total_amount, interest_rate, loan_period_years, monthly_emi, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [loan_id, customer_id, principal, total_amount, interest_rate_yearly, loan_period_years, monthly_emi, "ACTIVE"]
    );

    res.status(201).json({
      loan_id,
      customer_id,
      total_amount_payable: total_amount,
      monthly_emi,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error creating loan" });
  }
};

export const recordPayment = async (req, res) => {
  try {
    const { loan_id } = req.params;
    const { amount, payment_type } = req.body;

    if (!loan_id || !amount || !payment_type) {
      return res.status(400).json({ error: "Missing payment details" });
    }

    const loan = await db.get(`SELECT * FROM loans WHERE loan_id = ?`, [loan_id]);
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    const payment_id = uuidv4();

    await db.run(
      `INSERT INTO payments (payment_id, loan_id, amount, payment_type) VALUES (?, ?, ?, ?)`,
      [payment_id, loan_id, amount, payment_type]
    );

    const totalPaidRow = await db.get(
      `SELECT SUM(amount) as total_paid FROM payments WHERE loan_id = ?`,
      [loan_id]
    );
    const total_paid = totalPaidRow.total_paid || 0;

    const remaining_balance = loan.total_amount - total_paid;
    const emis_left = Math.ceil(remaining_balance / loan.monthly_emi);

    if (remaining_balance <= 0) {
      await db.run(`UPDATE loans SET status = 'PAID_OFF' WHERE loan_id = ?`, [loan_id]);
    }

    res.json({
      payment_id,
      loan_id,
      message: "Payment recorded successfully",
      remaining_balance,
      emis_left,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error recording payment" });
  }
};

export const getLoanLedger = async (req, res) => {
  try {
    const { loan_id } = req.params;

    const loan = await db.get(`SELECT * FROM loans WHERE loan_id = ?`, [loan_id]);
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    const totalPaidRow = await db.get(
      `SELECT SUM(amount) as total_paid FROM payments WHERE loan_id = ?`,
      [loan_id]
    );
    const total_paid = totalPaidRow.total_paid || 0;
    const balance_amount = loan.total_amount - total_paid;
    const emis_left = Math.ceil(balance_amount / loan.monthly_emi);

    const transactions = await db.all(
      `SELECT payment_id as transaction_id, payment_date as date, amount, payment_type as type
       FROM payments WHERE loan_id = ? ORDER BY payment_date`,
      [loan_id]
    );

    res.json({
      loan_id: loan.loan_id,
      customer_id: loan.customer_id,
      principal: loan.principal_amount,
      total_amount: loan.total_amount,
      monthly_emi: loan.monthly_emi,
      amount_paid: total_paid,
      balance_amount,
      emis_left,
      transactions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching ledger" });
  }
};

export const getAllLoans = async (req, res) => {
  try {
    const loans = await db.all(`SELECT * FROM loans`);
    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch loans" });
  }
};
