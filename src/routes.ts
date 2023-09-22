import { Router } from "express";

import { GetBudget } from "./controllers/GET/getUserBudget";
import { AddWeeklyExpenses } from "./controllers/PUT/addWeeklyExpenses";
import { AddExpenses } from "./controllers/PUT/addExpenses";
import { CreateUserBudget } from "./controllers/POST/createUserBudget";
import { CreateUserExpenseBudget } from "./controllers/POST/createUserExpenseBudget";

const router = Router();
//GET
router.get("/getBudget", GetBudget);
//PUT
router.put("/addWeeklyExpenses", AddWeeklyExpenses);
router.post("/addExpenses", AddExpenses);
//POST
router.post("/createUserBudget", CreateUserBudget);
router.post("/createUserExpenseBudget", CreateUserExpenseBudget);

export default router;
