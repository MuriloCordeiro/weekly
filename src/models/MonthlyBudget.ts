import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  title: String,
  description: String,
  value: Number,
  expenseDate: String,
});

const weekSchema = new mongoose.Schema({
  weekNumber: Number,
  weekBudget: Number,
  weekRemainingBudget: Number,
  startDate: String,
  endDate: String,
  expenses: [expenseSchema],
});

const budgetSchema = new mongoose.Schema({
  totalBudget: Number,
  remainingBudget: Number,
  budgetId: String, // Gerado automaticamente pelo MongoDB se _id for usado
  currentVigency: String,
  weeks: [weekSchema],
});

const userBudgetSchema = new mongoose.Schema({
  userId: String,
  budget: [budgetSchema],
});

const UserBudget = mongoose.model("UserBudget", userBudgetSchema, "Budgets");

export default UserBudget;
