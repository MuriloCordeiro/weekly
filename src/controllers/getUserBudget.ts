import { Request, Response } from "express";
import MonthlyBudget from "../models/MonthlyBudget"; // Ajuste o caminho conforme necessário
import { CreateUserBudget } from "./createUserBudget";
export async function GetBudget(req: Request, res: Response) {
  const { userId } = req.params; // Supondo que o userId seja passado como um parâmetro de rota

  if (!userId) {
    return res.status(400).send("O userId é obrigatório.");
  }

  try {
    // Encontrar o orçamento mensal do usuário pelo userId
    const userBudget = await MonthlyBudget.findOne({ userId });

    if (!userBudget) {
      return res
        .status(404)
        .send("Orçamento não encontrado para o usuário especificado.");
    }

    // Se tudo estiver bem, envie o orçamento mensal como resposta
    res.status(200).send(userBudget);
  } catch (error) {
    console.error("Erro ao obter o orçamento:", error);
    res.status(500).send("Erro interno do servidor");
  }
}
