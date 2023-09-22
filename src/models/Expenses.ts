import mongoose from "mongoose";

const listExpense = new mongoose.Schema({
  title: String,
  description: String,
  value: Number,
  installments: Number,
  isCurrent: Boolean, //true, false
  createdAt: String, //data de criação
  endDate: String, //criado automaticamente com base no installments
  type: String,
});

const ExpensesSchema = new mongoose.Schema({
  userId: String, //id do usuario
  totalBudget: String, //orcamento total, que vira do weekly
  remainingBudget: String, //orçamento restante
  expenses: [listExpense],
});

const Expenses = mongoose.model("Expenses", ExpensesSchema, "expenses");

export default Expenses;
