import { Request, Response } from "express";
import UserBudget from "../../models/MonthlyBudget";

export async function DeleteWeeklyExpense(req: Request, res: Response) {
  const { userId, weekNumber, currentVigency, expenseId } = req.body;

  try {
    let userBudget = await UserBudget.findOne({ userId });
    if (!userBudget) {
      return res
        .status(404)
        .send("Orçamento não encontrado para o usuário especificado.");
    }

    let budget = userBudget.budget.find(
      (b) => b.currentVigency === currentVigency
    );
    if (!budget) {
      return res
        .status(404)
        .send("Orçamento para a vigência atual não encontrado.");
    }

    let week: any = budget.weeks.find((w: any) => w.weekNumber === weekNumber);
    if (!week) {
      return res.status(404).send("Semana não encontrada.");
    }

    const expenseIndex = week.expenses.findIndex(
      (e: any) => e._id.toString() === expenseId
    );
    if (expenseIndex === -1) {
      return res.status(404).send("Despesa não encontrada.");
    }

    const expense = week.expenses.splice(expenseIndex, 1)[0];

    budget.remainingBudget += expense.value;

    week.weekRemainingBudget += expense.value;

    // Atualizando orçamento remanescente das semanas subsequentes
    // for (let i = week.weekNumber; i < budget.weeks.length; i++) {
    //   if (i === week.weekNumber) {
    //     budget.weeks[i].weekRemainingBudget += expense.value;
    //   } else {
    //     budget.weeks[i].weekRemainingBudget += week.weekBudget; // Adicionando o orçamento da semana anterior de volta
    //   }
    // }

    for (let i = week.weekNumber; i < budget.weeks.length; i++) {
      let currentWeek = budget.weeks[i];
      currentWeek.weekRemainingBudget += expense.value;

      // Caso você ainda queira descontar despesas da semana, pode descomentar e ajustar este loop
      // for (let expense of currentWeek.expenses) {
      //   currentWeek.weekRemainingBudget -= expense.value;
      // }
    }

    await userBudget.save();

    res
      .status(200)
      .send({ message: "Despesa removida com sucesso", updatedWeek: week });
  } catch (error) {
    console.error("Erro ao remover a despesa:", error);
    res.status(500).send("Erro interno do servidor");
  }
}
