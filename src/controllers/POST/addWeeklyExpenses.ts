import { Request, Response } from "express";
import UserBudget from "../../models/MonthlyBudget"; // Atualize o caminho conforme necessário

export async function AddWeeklyExpenses(req: Request, res: Response) {
  const {
    userId,
    weekNumber,
    currentVigency,
    title,
    description,
    value,
    expenseDate,
  } = req.body;

  if (
    !userId ||
    !weekNumber ||
    !currentVigency ||
    !title ||
    !value ||
    !expenseDate
  ) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  try {
    let userBudget = await UserBudget.findOne({ userId });

    if (!userBudget) {
      return res
        .status(404)
        .send("Orçamento não encontrado para o usuário especificado.");
    }

    let budget: any = userBudget.budget.find(
      (b) => b.currentVigency === currentVigency
    );

    if (!budget) {
      return res
        .status(404)
        .send("Orçamento para a vigência especificada não encontrado.");
    }

    let week: any = budget.weeks.find((w: any) => w.weekNumber === weekNumber);

    if (!week) {
      return res.status(404).send("Semana não encontrada.");
    }

    if (week.weekRemainingBudget < value) {
      return res.status(400).send("Orçamento da semana insuficiente.");
    }

    // Adicionando despesa
    week.expenses.push({ title, description, value, expenseDate });
    week.weekRemainingBudget -= value;

    // Atualizando orçamento remanescente no budget geral
    budget.remainingBudget -= value;

    await userBudget.save();

    res.status(200).send({ message: "Despesa adicionada com sucesso." });
  } catch (error) {
    console.error("Erro ao adicionar despesa:", error);
    res.status(500).send("Erro interno do servidor.");
  }
}
