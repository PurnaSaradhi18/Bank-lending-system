import express from "express";
import {
  getAllCustomers,
  getCustomerOverview,
} from "../controllers/customers.controller.js";

const router = express.Router();

router.get("/customers", getAllCustomers);
router.get("/customers/:customer_id/overview", getCustomerOverview);

export default router;
