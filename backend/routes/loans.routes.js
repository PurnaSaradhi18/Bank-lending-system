// routes/loans.routes.js
import express from 'express';
import {
  createLoan,
  recordPayment,
  getLoanLedger,
  getAllLoans
} from '../controllers/loans.controller.js';

const router = express.Router();

router.post('/loans', createLoan);
router.post('/loans/:loan_id/payments', recordPayment);
router.get('/loans/:loan_id/ledger', getLoanLedger);
router.get('/loans', getAllLoans); 

export default router;
