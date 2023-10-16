import { Request, Response } from "express";
import UserBudget from "../../models/MonthlyBudget";

export async function DeleteWeeklyExpense(req: Request, res: Response) {
  const { userId, weekNumber, currentVigency, expenseId } = req.body;
  console.log("weekNumber", weekNumber);

  try {
    // Localize o UserBudget pelo userId
    let userBudget = await UserBudget.findOne({ userId });
    if (!userBudget) {
      return res
        .status(404)
        .send("Orçamento não encontrado para o usuário especificado.");
    }

    // Localize o budget correto pela vigência atual
    let budget = userBudget.budget.find(
      (b) => b.currentVigency === currentVigency
    );
    if (!budget) {
      return res
        .status(404)
        .send("Orçamento para a vigência atual não encontrado.");
    }

    // Localize a semana pelo weekNumber
    let week: any = budget.weeks.find((w: any) => w.weekNumber === weekNumber);
    if (!week) {
      return res.status(404).send("Semana não encontrada.");
    }

    // Localize e remova a despesa pelo expenseId
    const expenseIndex = week.expenses.findIndex(
      (e: any) => e._id.toString() === expenseId
    );
    if (expenseIndex === -1) {
      return res.status(404).send("Despesa não encontrada.");
    }

    const expense = week.expenses.splice(expenseIndex, 1)[0]; // Remove e retorna a despesa
    week.weekRemainingBudget += expense.value; // Atualize o remainingBudget da semana
    budget.remainingBudget += expense.value; // Atualize o remainingBudget total

    await userBudget.save(); // Salve as alterações no banco de dados

    res
      .status(200)
      .send({ message: "Despesa removida com sucesso", updatedWeek: week });
  } catch (error) {
    console.error("Erro ao remover a despesa:", error);
    res.status(500).send("Erro interno do servidor");
  }
}
