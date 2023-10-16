import { Request, Response } from "express";
import UserBudget from "../../models/MonthlyBudget"; // Ajuste o caminho conforme necessário

export async function GetWeeklyBudget(req: Request, res: Response) {
  const { userId, currentVigency } = req.query; // Incluindo currentVigency como parâmetro de consulta

  if (!userId) {
    return res.status(400).send("O userId é obrigatório.");
  }

  if (!currentVigency) {
    return res.status(400).send("O currentVigency é obrigatório.");
  }

  try {
    const userBudget = await UserBudget.findOne({ userId });

    if (!userBudget) {
      return res
        .status(404)
        .send("Orçamento não encontrado para o usuário especificado.");
    }

    // Filtrar os orçamentos pela vigência atual
    const filteredBudget = userBudget.budget.find(
      (budget) => budget.currentVigency === currentVigency
    );

    if (!filteredBudget) {
      return res
        .status(404)
        .send("Orçamento não encontrado para a vigência especificada.");
    }

    res.status(200).send(filteredBudget);
  } catch (error) {
    console.error("Erro ao obter o orçamento:", error);
    res.status(500).send("Erro interno do servidor");
  }
}
