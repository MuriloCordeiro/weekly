import { Router } from "express";

import { GetBudget } from "./controllers/GET/getUserBudget";
import { AddWeeklyExpenses } from "./controllers/POST/addWeeklyExpenses";
import { AddExpenses } from "./controllers/POST/addExpenses";
import { CreateUserBudget } from "./controllers/POST/createUserBudget";
import { CreateUserExpenseBudget } from "./controllers/POST/createUserExpenseBudget";
import { UpdateExpense } from "./controllers/POST/updateExpense";

const router = Router();
//GET
router.get("/getBudget", GetBudget);

//POST
router.post("/createUserBudget", CreateUserBudget);
router.post("/createUserExpenseBudget", CreateUserExpenseBudget);
router.post("/createUserExpenseBudget", CreateUserExpenseBudget);
router.post("/addWeeklyExpenses", AddWeeklyExpenses);
router.post("/addExpenses", AddExpenses);
router.post("/updateExpense", UpdateExpense);

export default router;
