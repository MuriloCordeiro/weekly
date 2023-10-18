import { Request, Response } from "express";
import Expenses from "../../models/Expenses";
import { ObjectId } from "mongodb";

export async function GetExpenseById(req: Request, res: Response) {
  const { userId, expenseId } = req.query;

  if (!userId) {
    return res.status(400).send("O userId é obrigatório.");
  }

  try {
    // Define um pipeline de agregação com as etapas de match e project
    console.log("expense", expenseId);
    const pipeline = [
      {
        $match: {
          userId: userId,
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
                  {
                    $eq: ["$$expense._id", new ObjectId(expenseId as string)],
                  },
                ],
              },
            },
          },
        },
      },
    ];

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
