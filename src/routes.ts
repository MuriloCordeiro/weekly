import { Router } from "express";

import { GetWeeklyBudget } from "./controllers/GET/getWeeklyBudget";
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
import { GetUserBudgetExpenses } from "./controllers/GET/getUserBudgetExpenses";
import { GetExpenseById } from "./controllers/GET/getExpenseById";

const router = Router();
//GET
router.get("/getWeeklyBudget", GetWeeklyBudget);
router.get("/getExpenses", GetExpenses);
router.get("/getExpenseById", GetExpenseById);
router.get("/getBudgetExpense", GetUserBudgetExpenses);

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
router.post("/deleteWeeklyExpense", DeleteWeeklyExpense);

export default router;
