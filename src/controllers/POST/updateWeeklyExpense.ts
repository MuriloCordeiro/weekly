import { Request, Response } from "express";
import MonthlyBudget from "../../models/MonthlyBudget"; // Ajuste o caminho conforme necessário

export async function UpdateWeeklyExpense(req: Request, res: Response) {
  const { userId, weekNumber, expenseId, newExpense } = req.body;

  // Validação dos campos
  if (!userId || !weekNumber || !expenseId || !newExpense) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  try {
    const userBudget: any = await MonthlyBudget.findOne({ userId });

    if (!userBudget) {
      return res
        .status(404)
        .send("Orçamento não encontrado para o usuário especificado.");
    }

    const week: any = userBudget.weeks.find((w) => w.weekNumber === weekNumber);

    if (!week) {
      return res.status(404).send("Semana não encontrada.");
    }

    const expenseIndex = week.expenses.findIndex(
      (e) => e._id.toString() === expenseId
    );

    if (expenseIndex === -1) {
      return res.status(404).send("Despesa não encontrada.");
    }

    // Atualizar os campos da despesa
    const oldExpenseValue = week.expenses[expenseIndex].value;
    week.expenses[expenseIndex] = newExpense;

    // Atualizar o remainingBudget
    week.remainingBudget += oldExpenseValue - newExpense.value;
    userBudget.remainingBudget += oldExpenseValue - newExpense.value;

    // Salvar as alterações
    await userBudget.save();

    res.status(200).send(userBudget);
  } catch (error) {
    console.error("Erro ao editar a despesa:", error);
    res.status(500).send("Erro interno do servidor");
  }
}
