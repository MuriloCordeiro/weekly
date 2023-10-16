import { Request, Response } from "express";
import UserBudget from "../../models/MonthlyBudget"; // Atualize o caminho conforme necessário

function getWeeksInMonth(month: number, year: number): number {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDays = firstDayOfMonth + totalDaysInMonth;
  return Math.ceil(totalDays / 7);
}

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export async function CreateUserBudget(req: Request, res: Response) {
  const { userId, totalBudget } = req.body;

  const currentDate = new Date();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const currentVigency = formatDate(currentDate).split("/").slice(1).join("/");

  if (isNaN(totalBudget)) {
    return res
      .status(400)
      .send("O valor do orçamento total deve ser um número.");
  }

  const numberOfWeeks = getWeeksInMonth(month, year);
  const weeklyBudget = totalBudget / numberOfWeeks;

  let weeks: any = [];
  let start = 1;
  let end = 7 - new Date(year, month, 1).getDay();
  let weekNumber = 1;
  let weekRemainingBudget = 0;

  while (start <= new Date(year, month + 1, 0).getDate()) {
    weekRemainingBudget += weeklyBudget;
    const startDate = formatDate(new Date(year, month, start));
    const endDate = formatDate(new Date(year, month, end));

    weeks.push({
      weekNumber,
      weekBudget: weeklyBudget,
      weekRemainingBudget,
      startDate,
      endDate,
      expenses: [],
    });

    start = end + 1;
    end = end + 7;
    if (end > new Date(year, month + 1, 0).getDate()) {
      end = new Date(year, month + 1, 0).getDate();
    }
    weekNumber++;
  }

  const newBudget = {
    totalBudget,
    remainingBudget: totalBudget,
    currentVigency,
    weeks,
  };

  try {
    let userBudget = await UserBudget.findOne({ userId });

    if (!userBudget) {
      userBudget = new UserBudget({ userId, budget: [newBudget] });
    } else {
      // Verificar se já existe um orçamento para a vigência atual
      const existingBudget = userBudget.budget.find(
        (b) => b.currentVigency === currentVigency
      );
      if (existingBudget) {
        return res
          .status(400)
          .send("Um orçamento para essa vigência já existe.");
      } else {
        userBudget.budget.push(newBudget);
      }
    }

    await userBudget.save();
    res.status(201).send({ return: "Orçamento criado com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar o orçamento mensal:", error);
    res.status(500).send("Erro interno do servidor");
  }
}
