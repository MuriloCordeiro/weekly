import { Request, Response } from "express";
import MonthlyBudget from "../../models/MonthlyBudget";

export async function UpdateWeeklyBudget(req: Request, res: Response) {
  const { userId, newBudget } = req.body;

  // Validar os campos
  if (!userId || !newBudget) {
    return res.status(400).send("UserId e newBudget são campos obrigatórios.");
  }

  if (isNaN(newBudget)) {
    return res.status(400).send("newBudget deve ser um número.");
  }

  try {
    const userBudget = await MonthlyBudget.findOne({ userId });

    if (!userBudget) {
      return res
        .status(404)
        .send("Orçamento não encontrado para o usuário especificado.");
    }

    // Armazenar o valor antigo do totalBudget antes da atualização
    const oldTotalBudget = userBudget.totalBudget;

    // Atualizar o totalBudget
    userBudget.totalBudget = newBudget;

    // Reajustar o remainingBudget global com base no novo totalBudget
    userBudget.remainingBudget = newBudget;

    // Reajustar o remainingBudget para cada semana
    userBudget.weeks.forEach((week: any, index: number) => {
      week.remainingBudget =
        newBudget -
        week.expenses.reduce(
          (acc: number, expense: any) => acc + expense.value,
          0
        );
      if (index > 0) {
        week.remainingBudget += userBudget.weeks[index - 1].remainingBudget;
      }
    });

    // Salvar as alterações
    await userBudget.save();

    res.status(200).send(userBudget);
  } catch (error) {
    console.error("Erro ao atualizar o orçamento:", error);
    res.status(500).send("Erro interno do servidor");
  }
}
