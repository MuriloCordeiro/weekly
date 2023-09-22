import { Request, Response } from "express";
import Expenses from "../../models/Expenses";
import calculateEndDate from "../../utils/calculateEndDate";
import formatDate from "../../utils/formatDate";

export async function AddExpenses(req: Request, res: Response) {
  const {
    userId,
    title,
    description,
    value,
    installments,
    isCurrent,
    endDate,
    type,
  } = req.body;

  if (!title || !value || !type) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  try {
    const userBudget: any = await Expenses.findOne({ userId });

    if (!userBudget) {
      return res
        .status(404)
        .send("Orçamento não encontrado para o usuário especificado.");
    } else {
      const startDate = new Date();
      const expenses: any = {
        title,
        description: description || "", // Se não for recebido, deixa vazio
        value,
        installments: installments != undefined ? installments : 1, // Se não for recebido, 0 por padrão
        isCurrent: isCurrent || false, // Se não for recebido, false por padrão
        createdAt: formatDate(startDate), // Se não for recebido, data atual por padrão
        endDate:
          endDate || formatDate(calculateEndDate(startDate, installments)),
        type,
      };
      userBudget.expenses.push(expenses);
      await userBudget.save(expenses);
      res.status(200).send(userBudget);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro interno do servidor");
  }
}
