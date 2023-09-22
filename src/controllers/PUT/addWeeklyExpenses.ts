import { Request, Response } from "express";
import MonthlyBudget from "../../models/MonthlyBudget";

export async function AddWeeklyExpenses(req: Request, res: Response) {
  const { userId, weekNumber, expense } = req.body;

  if (!userId || !weekNumber || !expense) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  try {
    const userBudget: any = await MonthlyBudget.findOne({ userId });

    if (!userBudget) {
      return res
        .status(404)
        .send("Orçamento não encontrado para o usuário especificado.");
    } else {
      const week: any = userBudget.weeks.find(
        (w: any) => w.weekNumber === weekNumber
      );

      if (!week) {
        return res.status(404).send("Semana não encontrada.");
      } else {
        week.expenses.push(...expense);

        const totalExpenseValue = expense.reduce(
          (acc: any, curr: any) => acc + curr.value,
          0
        );
        const diff = week.remainingBudget - totalExpenseValue;
        week.remainingBudget = diff;

        // Adicione o valor não utilizado ao remainingBudget das semanas subsequentes
        const currentWeekIndex = userBudget.weeks.findIndex(
          (w: any) => w.weekNumber === weekNumber
        );
        for (let i = currentWeekIndex + 1; i < userBudget.weeks.length; i++) {
          userBudget.weeks[i].remainingBudget += diff;
        }

        userBudget.remainingBudget -= totalExpenseValue;

        await userBudget.save();
        res.status(200).send(userBudget);
      }
    }
  } catch (error) {
    console.error("Erro ao adicionar despesas:", error);
    res.status(500).send("Erro interno do servidor");
  }
}
