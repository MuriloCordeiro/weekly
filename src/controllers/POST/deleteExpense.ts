import { Request, Response } from "express";
import Expenses from "../../models/Expenses";

export async function DeleteExpense(req: Request, res: Response) {
  const { userId, expenseId } = req.body;

  try {
    // Find the user's budget document by userId
    const userBudget = await Expenses.findOne({ userId });

    // CHECK IF THE USER EXISTS IN THE DATABASE
    if (!userBudget) {
      return res.status(404).send("Budget not found for the specified user.");
    }

    // Use Mongoose's update method with $pull to remove the specific object from the array
    const updatedBudget = await Expenses.findByIdAndUpdate(
      userBudget._id,
      { $pull: { expenses: { _id: expenseId } } },
      { new: true }
    );

    // Check if the object was found and deleted
    if (!updatedBudget) {
      return res
        .status(404)
        .send("Expense not found in the database or already deleted.");
    }

    res.status(200).send("Expense deleted successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}
