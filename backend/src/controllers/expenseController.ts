import type { Request, Response, NextFunction } from 'express';
import { Expense, User } from '../models';
import database from '../database';

const expenseRepository = database.AppDataSource.getRepository(Expense);

export const createExpense = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { name, price } = request.body;

    if (!name || !price) {
      response.status(400).json({ message: 'Name and price are required' });
      return;
    }

    const userId = request.session.userId;
    if (!userId) {
      return response.status(401).json({ message: "Not logged in" });
    }

    const userRepository = database.AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({
      id: userId
    });

    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    const today: string = new Date().toISOString().substring(0, 10);
    const expense = expenseRepository.create({
      name,
      price,
      date: today,
      user_id: user,
      categories: [],
    });
    await expenseRepository.save(expense);

    response.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

export const getExpenses = async (request: Request, response: Response, next: NextFunction) => {
  try {
    // make database call to get expenses
    const expenses = await expenseRepository.find();
    response.json(expenses);
  } catch (error) {
    next(error);
  }
};

export const getExpenseById = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ message: 'Item ID is required' });
      return;
    }
    const id = parseInt(req.params.id, 10);
    // const item = items.find((i) => i.id === id);
    // if (!item) {
    //   res.status(404).json({ message: 'Item not found' });
    //   return;
    // }
    // res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateExpense = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ message: 'Item ID is required' });
      return;
    }
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: 'Item name is required' });
      return;
    }
    // const itemIndex = items.findIndex((i) => i.id === id);
    // if (itemIndex === -1) {
    //   res.status(404).json({ message: 'Item not found' });
    //   return;
    // }
    // if (items[itemIndex]) {
    //   items[itemIndex].name = name;
    // }
    // res.json(items[itemIndex]);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ message: 'Item ID is required' });
      return;
    }
    const id = parseInt(req.params.id, 10);
    // const itemIndex = items.findIndex((i) => i.id === id);
    // if (itemIndex === -1) {
    //   res.status(404).json({ message: 'Item not found' });
    //   return;
    // }
    // const deletedItem = items.splice(itemIndex, 1)[0];
    // res.json(deletedItem);
  } catch (error) {
    next(error);
  }
};
