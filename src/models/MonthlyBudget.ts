import mongoose from "mongoose";

// const weekScheme = new mongoose.Schema({
//   semana: String,
// });
const expenseSchema = new mongoose.Schema({
  description: String,
  value: Number,
  expenseDate: String,
});

const weekSchema = new mongoose.Schema({
  weekNumber: Number,
  budget: Number,
  remainingBudget: Number, // Novo campo
  startDate: String,
  endDate: String,
  expenses: [expenseSchema],
});

const monthlyBudgetSchema = new mongoose.Schema({
  userId: String,
  totalBudget: Number,
  remainingBudget: Number, // Novo campo
  weeks: [weekSchema],
});

const MonthlyBudget = mongoose.model(
  "MonthlyBudget",
  monthlyBudgetSchema,
  "weeks"
);

// const week = mongoose.model("Week", weekScheme, "weeks");

export default MonthlyBudget;

// {
//   "_id": "6139c4c5f4f065001fbb10d7",  // ID gerado automaticamente pelo MongoDB
//   "userId": "6123abc4567890123456defg", // Exemplo de ID de usuário
//   "totalBudget": 4000, // Orçamento mensal do usuário
//   "weeks": [
//     {
//       "weekNumber": 1,
//       "startWeek": ''
//       "endWeek": ''
//       "budget": 1000, // Orçamento para a semana 1 (4000 / 4)
//       "expenses": [
//         {
//           "description": "Alimentação",
//           "amount": 200
//         },
//         {
//           "description": "Transporte",
//           "amount": 100
//         }
//       ]
//     },
//     {
//       "weekNumber": 2,
//       "budget": 1000, // Orçamento para a semana 2 (4000 / 4)
//       "expenses": [
//         {
//           "description": "Aluguel",
//           "amount": 500
//         }
//       ]
//     },
//     // ... semanas 3 e 4
//   ]
// }
