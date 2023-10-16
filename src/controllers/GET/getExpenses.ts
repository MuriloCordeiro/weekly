import { Request, Response } from "express";
import Expenses from "../../models/Expenses";
import FormatDateBrazilian from "../../utils/formatDateBrazilian";

//Função para formatar datas para "DD/MM/YYYY"

export async function GetExpenses(req: Request, res: Response) {
  const { userId, parameter, value, startDate, endDate } = req.query;

  if (!userId) {
    return res.status(400).send("O userId é obrigatório.");
  }

  try {
    let matchQuery: Record<string, any> = { userId }; // Objeto de consulta com base no userId

    if (parameter === "type") {
      // Adicione o critério de pesquisa por tipo
      matchQuery["expenses.type"] = value;
    }

    if (startDate && endDate) {
      const startDateFormatted: Date = new Date(
        FormatDateBrazilian(String(startDate))
      );
      const endDateFormatted: Date = new Date(
        FormatDateBrazilian(String(endDate))
      );

      console.log("startDateFormatted", startDateFormatted);
      console.log("endDateFormatted", endDateFormatted);

      console.log("startDate", startDate);
      // Adicione o critério de pesquisa por intervalo de datas
      matchQuery["$and"] = [
        {
          "expenses.createdAt": { $gte: startDateFormatted },
        },
        {
          "expenses.endDate": { $lte: endDateFormatted },
        },
      ];

      console.log("query", matchQuery);
    }

    // Execute a consulta no banco de dados usando o método aggregate
    const result = await Expenses.aggregate([
      { $match: matchQuery }, // Filtre com base no userId, tipo e intervalo de datas
      { $project: { _id: 0, expenses: 1 } }, // Projete apenas o campo "expenses"
    ]);

    if (result.length === 0) {
      return res
        .status(404)
        .send("Nenhuma despesa encontrada com os critérios especificados.");
    }

    const expenses = result[0].expenses; // Acesse o array de despesas

    res.status(200).send(expenses);
  } catch (error) {
    console.error("Erro ao obter despesas:", error);
    res.status(500).send("Erro interno do servidor");
  }
}
