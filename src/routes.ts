import { Router } from "express";

import { CreateUserBudget } from "./controllers/createUserBudget";
import { AddExpenses } from "./controllers/addExpenses";

const router = Router();

router.post("/createUserBudget", CreateUserBudget);
router.post("/addExpense", AddExpenses);

export default router;
