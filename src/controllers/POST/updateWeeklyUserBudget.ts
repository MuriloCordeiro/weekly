import { Request, Response } from "express";
import MonthlyBudget from "../../models/MonthlyBudget";

export async function UpdateWeeklyBudget(req: Request, res: Response) {
  const { userId, totalBudget, currentVigency } = req.body;

  if (isNaN(totalBudget)) {
    return res
      .status(400)
      .send("O valor do orçamento total deve ser um número.");
  }

  try {
    let userBudget = await MonthlyBudget.findOne({ userId });
    if (!userBudget) {
      return res
        .status(404)
        .send("Orçamento não encontrado para o usuário especificado.");
    }

    const budgetToUpdate: any = userBudget.budget.find(
      (budget) => budget.currentVigency === currentVigency
    );

    if (!budgetToUpdate) {
      return res
        .status(404)
        .send("Orçamento para a vigência atual não encontrado.");
    }

    // Atualizar o totalBudget
    budgetToUpdate.totalBudget = totalBudget;

    // Recalcular o budget para cada semana
    const numberOfWeeks = budgetToUpdate.weeks.length;
    const newWeeklyBudget = totalBudget / numberOfWeeks;

    let newRemainingBudget = totalBudget;

    budgetToUpdate.weeks.forEach((week: any) => {
      const totalExpenses = week.expenses.reduce(
        (total: any, expense: any) => total + expense.value,
        0
      );
      week.weekBudget = newWeeklyBudget;
      week.weekRemainingBudget = newWeeklyBudget - totalExpenses;
      newRemainingBudget -= totalExpenses;
    });

    budgetToUpdate.remainingBudget = newRemainingBudget;

    await userBudget.save();
    return res.status(200).send("Budget atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar o orçamento:", error);
    res.status(500).send("Erro interno do servidor");
  }
}
