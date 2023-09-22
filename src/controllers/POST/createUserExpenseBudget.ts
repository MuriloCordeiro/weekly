import { Request, Response } from "express";
import Expenses from "../../models/Expenses";

export async function CreateUserExpenseBudget(req: Request, res: Response) {
  const { userId, totalBudget } = req.body;

  const budgetExpenses: any = new Expenses({
    userId,
    totalBudget,
    remainingBudget: totalBudget,
    expenses: [],
  });

  try {
    await budgetExpenses.save();
    res.status(201).send(budgetExpenses);
  } catch (error) {
    console.error("Erro ao criar o orçamento das despesas:", error);
    res.status(500).send("Erro interno do servidor");
  }
}
