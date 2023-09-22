import { Request, Response } from "express";
import MonthlyBudget from "../../models/MonthlyBudget"; // Ajuste o caminho conforme necessário

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

  // Validação do totalBudget
  if (isNaN(totalBudget)) {
    return res
      .status(400)
      .send("O valor do orçamento total deve ser um número.");
  }

  // Cálculo do número de semanas e datas
  const currentDate = new Date();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const numberOfWeeks = getWeeksInMonth(month, year); // Pega o número de semanas dinamicamente
  const weeklyBudget = totalBudget / numberOfWeeks; // Dividir igualmente entre o número real de semanas

  let weeks: {
    weekNumber: number;
    startDate: string;
    endDate: string;
    remainingBudget: number;
    budget: number;
    expenses: any[];
  }[] = [];
  let firstDate = new Date(year, month, 1);
  let lastDate = new Date(year, month + 1, 0);
  let numDays = lastDate.getDate();
  let start = 1;
  let end = 7 - firstDate.getDay();
  let weekNumber = 1;
  let accumulatedBudget = 0;

  while (start <= numDays) {
    const startDate = new Date(year, month, start);
    const endDate = new Date(year, month, end);
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    accumulatedBudget += weeklyBudget;
    weeks.push({
      weekNumber,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      budget: weeklyBudget,
      remainingBudget: accumulatedBudget, // Novo campo
      expenses: [],
    });

    start = end + 1;
    end = end + 7;
    if (end > numDays) end = numDays;
    weekNumber++;
  }

  // Criar documento MongoDB
  const newMonthlyBudget = new MonthlyBudget({
    userId,
    totalBudget,
    remainingBudget: totalBudget, // Novo campo
    weeks,
  });

  try {
    await newMonthlyBudget.save();
    res.status(201).send(newMonthlyBudget);
  } catch (error) {
    console.error("Erro ao criar o orçamento mensal:", error);
    res.status(500).send("Erro interno do servidor");
  }
}
