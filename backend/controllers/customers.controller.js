import { db } from "../db.js";

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await db.all(`SELECT * FROM customers`);
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const getCustomerOverview = async (req, res) => {
  try {
    const { customer_id } = req.params;

    const loans = await db.all(`SELECT * FROM loans WHERE customer_id = ?`, [
      customer_id,
    ]);

    if (!loans || loans.length === 0) {
      return res.status(404).json({ error: "No loans found for this customer" });
    }

    const loanSummaries = await Promise.all(
      loans.map(async (loan) => {
        const totalPaidRow = await db.get(
          `SELECT SUM(amount) as total_paid FROM payments WHERE loan_id = ?`,
          [loan.loan_id]
        );
        const total_paid = totalPaidRow.total_paid || 0;

        return {
          loan_id: loan.loan_id,
          principal: loan.principal_amount,
          total_amount: loan.total_amount,
          total_interest: loan.total_amount - loan.principal_amount,
          emi_amount: loan.monthly_emi,
          amount_paid: total_paid,
          emis_left: Math.ceil((loan.total_amount - total_paid) / loan.monthly_emi),
        };
      })
    );

    res.json({
      customer_id,
      total_loans: loans.length,
      loans: loanSummaries,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch customer overview" });
  }
};
