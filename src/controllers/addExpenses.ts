import { Request, Response } from "express";
import MonthlyBudget from "../models/MonthlyBudget";

export async function AddExpenses(req: Request, res: Response) {
  const { userId, weekNumber, expense } = req.body;

  if (!userId || !weekNumber || !expense) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  try {
    const userBudget: any = await MonthlyBudget.findOne({ userId });

    if (!userBudget) {
      return res
        .status(404)
        .send("Orçamento não encontrado para o usuário especificado.");
    }

    const week = userBudget.weeks.find((w: any) => w.weekNumber === weekNumber);

    if (!week) {
      return res.status(404).send("Semana não encontrada.");
    }

    week.expenses.push(...expense);

    const totalExpenseValue = expense.reduce(
      (acc: any, curr: any) => acc + curr.value,
      0
    );
    week.remainingBudget -= totalExpenseValue;

    const currentWeekIndex = userBudget.weeks.findIndex(
      (w: any) => w.weekNumber === weekNumber
    );

    // Atualizar o remainingBudget para as semanas subsequentes
    for (let i = currentWeekIndex + 1; i < userBudget.weeks.length; i++) {
      userBudget.weeks[i].remainingBudget =
        userBudget.weeks[i - 1].remainingBudget + week.budget;
    }

    userBudget.remainingBudget =
      userBudget.weeks[userBudget.weeks.length - 1].remainingBudget;

    await userBudget.save();
    res.status(200).send(userBudget);
  } catch (error) {
    console.error("Erro ao adicionar despesas:", error);
    res.status(500).send("Erro interno do servidor");
  }
}
