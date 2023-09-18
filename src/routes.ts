import { Router } from "express";

import { CreateUserBudget } from "./controllers/createUserBudget";
import { AddExpenses } from "./controllers/addExpenses";
import { GetBudget } from "./controllers/getUserBudget";

const router = Router();

router.post("/createUserBudget", CreateUserBudget);
router.post("/addExpense", AddExpenses);
router.get("/getBudget", GetBudget);

export default router;
