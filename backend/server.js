import express from "express";
import cors from "cors";
import loansRouter from "./routes/loans.routes.js";
import customersRouter from "./routes/customers.routes.js";
import "./db.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/vi/loan", loansRouter);
app.use("/api/vi", customersRouter);

app.get("/", (req, res) => {
  res.send("Bank Lending System API is running");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
