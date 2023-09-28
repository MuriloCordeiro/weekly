import { Request, Response } from "express";
import Expenses from "../../models/Expenses";
import calculateEndDate from "../../utils/calculateEndDate";
import formatDate from "../../utils/formatDate";

export async function AddExpenses(req: Request, res: Response) {
  let {
    userId,
    title,
    description,
    value,
    installments,
    isCurrent,
    endDate,
    type,
  } = req.body;

  // CHECK IF REQUIRED VALUES EXIST
  if (!title || !value || !type) {
    return res.status(400).send("All fields are mandatory.");
  }

  try {
    // CREATE AN INSTANCE OF THE EXPENSES COLLECTION AND CHECK IF userId EXISTS
    const userBudget: any = await Expenses.findOne({ userId });

    // CHECK IF THE USER EXISTS IN THE DATABASE
    if (!userBudget) {
      return res.status(404).send("Budget not found for the specified user.");
    } else {
      // IF IT EXISTS, CREATE A DATE INSTANCE TO ASSIGN TO THE startDate VARIABLE
      const startDate = new Date();

      //VERIFY TYPE EXPENSE TO SET DEFAULT DATA
      if (type !== "fixed") {
        installments = 1;
        isCurrent = false;
        userBudget.remainingBudget -= value;
      } else {
        userBudget.remainingBudget -= value * installments;
        isCurrent = true;
      }

      // CREATE AN EXPENSES OBJECT TO ADD TO THE LIST IN THE COLLECTION
      const expenses: any = {
        title,
        description: description || title, // If not received, set it equal to the title
        value,
        installments: installments !== undefined ? installments : 1, // If not received, default to 1
        isCurrent: isCurrent || false, // If not received, default to false
        createdAt: formatDate(startDate) || new Date(), // If not received, default to the current date
        endDate:
          endDate || formatDate(calculateEndDate(startDate, installments)),
        type,
      };

      // ADD THE EXPENSES OBJECT TO THE EXPENSES LIST WITHIN THE userBudget OBJECT
      userBudget.expenses.push(expenses);

      // SAVE THE CHANGES
      await userBudget.save(expenses);

      res.status(200).send(userBudget);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
}
