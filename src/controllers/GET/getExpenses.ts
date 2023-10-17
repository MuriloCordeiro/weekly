import { Request, Response } from "express";
import Expenses from "../../models/Expenses";
import FormatDateBrazilian from "../../utils/formatDateBrazilian";

export async function GetExpenses(req: Request, res: Response) {
  const { userId, typeExpense, startDate, endDate } = req.query;

  if (!userId) {
    return res.status(400).send("O userId é obrigatório.");
  }

  try {
    const startDateFormatted: Date = new Date(
      FormatDateBrazilian(String(startDate))
    );
    const endDateFormatted: Date = new Date(
      FormatDateBrazilian(String(endDate))
    );

    // Define um pipeline de agregação com as etapas de match e project

    let pipeline: any = undefined;

    if (typeExpense !== "undefined") {
      pipeline = [
        {
          $match: {
            userId: userId,
            "expenses.createdAt": {
              $gte: startDateFormatted,
              $lte: endDateFormatted,
            },
            "expenses.type": { $eq: typeExpense },
          },
        },
        {
          $project: {
            expenses: {
              $filter: {
                input: "$expenses",
                as: "expense",
                cond: {
                  $and: [
                    { $gte: ["$$expense.createdAt", startDateFormatted] },
                    { $lte: ["$$expense.createdAt", endDateFormatted] },
                    { $eq: ["$$expense.type", typeExpense] },
                  ],
                },
              },
            },
          },
        },
      ];
    } else {
      pipeline = [
        {
          $match: {
            userId: userId,
            "expenses.createdAt": {
              $gte: startDateFormatted,
              $lte: endDateFormatted,
            },
          },
        },
        {
          $project: {
            expenses: {
              $filter: {
                input: "$expenses",
                as: "expense",
                cond: {
                  $and: [
                    { $gte: ["$$expense.createdAt", startDateFormatted] },
                    { $lte: ["$$expense.createdAt", endDateFormatted] },
                  ],
                },
              },
            },
          },
        },
      ];
    }

    // Execute a agregação e aguarde a conclusão
    const result = await Expenses.aggregate(pipeline).exec();
    if (result.length === 0) {
      res.status(404).send("Não foram encontradas despesas com estes filtros.");
    } else {
      res.status(200).send(result);
    }
  } catch (error) {
    console.error("Erro ao obter despesas:", error);
    res.status(500).send("Erro interno do servidor");
  }
}
