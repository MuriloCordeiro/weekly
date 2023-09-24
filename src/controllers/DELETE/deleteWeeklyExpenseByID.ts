import { Request, Response } from "express";
import MonthlyBudget from "../../models/MonthlyBudget"; // Ajuste o caminho conforme necessário

export async function DeleteWeeklyExpense(req: Request, res: Response) {
  const { userId, weekNumber, expenseId } = req.body;

  if (!userId || !weekNumber || !expenseId) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  try {
    // Encontrar o orçamento mensal do usuário pelo userId
    const userBudget = await MonthlyBudget.findOne({ userId });

    if (!userBudget) {
      return res
        .status(404)
        .send("Orçamento não encontrado para o usuário especificado.");
    }

    // Encontrar a semana específica
    const week: any = userBudget.weeks.find((w) => w.weekNumber === weekNumber);

    if (!week) {
      return res.status(404).send("Semana não encontrada.");
    }

    // Encontrar e remover a despesa
    const expenseIndex = week.expenses.findIndex(
      (e: any) => e._id.toString() === expenseId
    );

    if (expenseIndex === -1) {
      return res.status(404).send("Despesa não encontrada.");
    }

    const [removedExpense] = week.expenses.splice(expenseIndex, 1);

    // Atualizar o remainingBudget para a semana e para o orçamento mensal
    week.remainingBudget += removedExpense.value;
    userBudget.remainingBudget += removedExpense.value;

    // Salvar as alterações no banco de dados
    await userBudget.save();

    res
      .status(200)
      .send({ message: "Despesa removida com sucesso.", userBudget });
  } catch (error) {
    console.error("Erro ao deletar a despesa:", error);
    res.status(500).send("Erro interno do servidor");
  }
}
