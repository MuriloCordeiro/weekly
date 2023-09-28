import { Router } from "express";

import { GetBudget } from "./controllers/GET/getUserBudget";
import { AddWeeklyExpenses } from "./controllers/POST/addWeeklyExpenses";
import { AddExpenses } from "./controllers/POST/addExpenses";
import { CreateUserBudget } from "./controllers/POST/createUserBudget";
import { CreateUserExpenseBudget } from "./controllers/POST/createUserExpenseBudget";
import { UpdateExpense } from "./controllers/POST/updateExpense";
import { DeleteExpense } from "./controllers/POST/deleteExpense";
import { UpdateWeeklyBudget } from "./controllers/POST/updateWeeklyUserBudget";
import { UpdateWeeklyExpense } from "./controllers/POST/updateWeeklyExpense";
import { DeleteWeeklyExpense } from "./controllers/DELETE/deleteWeeklyExpenseByID";
import { GetExpenses } from "./controllers/GET/getExpenses";

const router = Router();
//GET
router.get("/getBudget", GetBudget);
router.get("/getExpenses", GetExpenses);

//POST
router.post("/createUserBudget", CreateUserBudget);
// router.post("/createUserExpenseBudget", CreateUserExpenseBudget);
router.post("/createUserExpenseBudget", CreateUserExpenseBudget);
router.post("/addWeeklyExpenses", AddWeeklyExpenses);
router.post("/addExpenses", AddExpenses);
router.post("/updateExpense", UpdateExpense);
router.post("/updateWeeklyBudget", UpdateWeeklyBudget);
router.post("/updateWeeklyExpense", UpdateWeeklyExpense);
//DELETE
router.delete("/deleteExpense", DeleteExpense);
router.delete("/deleteWeeklyExpense", DeleteWeeklyExpense);

export default router;
