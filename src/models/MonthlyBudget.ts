import mongoose from "mongoose";

// const weekScheme = new mongoose.Schema({
//   semana: String,
// });
const expenseSchema = new mongoose.Schema({
  title: String, // novo campo
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
  currentMonth: String, // Novo campo
  totalBudget: Number,
  remainingBudget: Number,
  weeks: [weekSchema],
});

const MonthlyBudget = mongoose.model(
  "MonthlyBudget",
  monthlyBudgetSchema,
  "weeks"
);

// const week = mongoose.model("Week", weekScheme, "weeks");

export default MonthlyBudget;
