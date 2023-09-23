import { Request, Response } from "express";
import Expenses from "../../models/Expenses";
import calculateEndDate from "../../utils/calculateEndDate";
import formatDate from "../../utils/formatDate";

export async function UpdateExpense(req: Request, res: Response) {
  const {
    userId,
    expenseId,
    title,
    value,
    type,
    description,
    installments,
    isCurrent,
    endDate,
  } = req.body;

  // CHECK IF REQUIRED VALUES EXIST
  if (!title || !value || !type) {
    return res.status(400).send("All fields are mandatory.");
  }

  try {
    // Find the user's budget document by userId
    const userBudget: any = await Expenses.findOne({ userId });

    // CHECK IF THE USER EXISTS IN THE DATABASE
    if (!userBudget) {
      return res.status(404).send("Budget not found for the specified user.");
    }

    // Create a new expense object
    const newExpense: any = {
      title,
      description: description || title,
      value,
      installments: installments !== undefined ? installments : 1,
      isCurrent: isCurrent || false,
      createdAt: formatDate(new Date()) || new Date(),
      endDate:
        endDate || formatDate(calculateEndDate(new Date(), installments)),
      type,
    };

    // Find the index of the expense within the expenses array
    const expenseIndex = userBudget.expenses.findIndex(
      (expense: any) => expense._id.toString() === expenseId
    );

    // Check if the expense was found in the user's budget
    if (expenseIndex === -1) {
      return res.status(404).send("Expense not found in the user's budget.");
    }

    // Update the specific expense within the expenses array
    userBudget.expenses[expenseIndex] = newExpense;

    // Save the changes to the user's budget
    await userBudget.save();

    res.status(200).send("Expense updated successfully.");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
}
