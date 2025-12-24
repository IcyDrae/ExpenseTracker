import type { Request, Response, NextFunction } from 'express';
import { Expense, User, Category } from '../models';
import database from '../database/database';
import { In } from "typeorm";

const expenseRepository = database.AppDataSource.getRepository(Expense);

export const createExpense = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { name, price, date } = request.body;

    if (!name || !price || !date) {
      response.status(400).json({ message: 'Name, price and date are required' });
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
      date: date,
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
    const expenses = await expenseRepository.find({
      relations: ["categories"],
    });
    response.json(expenses);
  } catch (error) {
    next(error);
  }
};

export const getExpenseById = async (request: Request, response: Response, next: NextFunction) => {
  try {
    if (!request.params.id) {
      response.status(400).json({ message: 'Item ID is required' });
      return;
    }
    const id = parseInt(request.params.id);

    const expense = await expenseRepository.findOne({
      where: { id },
      relations: ["categories"],
    });
    if (!expense) {
      response.status(404).json({ message: 'Expense not found' });
      return;
    }

    response.json(expense);
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (request: Request, response: Response, next: NextFunction) => {
  try {
    // make sure the user is logged in
    const userId = request.session.userId;
    if (!userId) {
      return response.status(401).json({ message: "Not logged in" });
    }

    // verify expense belongs to user
    if (!request.params.id) {
      response.status(400).json({ message: 'Item ID is required' });
      return;
    }
    const id = parseInt(request.params.id);

    const expenseToEdit = await expenseRepository.findOne({
      where: { id },
      relations: ["user_id", "categories"],
    });
    if (!expenseToEdit || expenseToEdit.user_id.id !== userId) {
      return response.status(403).json({ message: "Forbidden" });
    }

    // get the params from the request body
    const { name, price, date, categoryId } = request.body;

    // update the expense
    expenseToEdit.name = name ?? expenseToEdit.name;
    expenseToEdit.price = price ?? expenseToEdit.price;
    expenseToEdit.date = date ?? expenseToEdit.date;

    const categoryRepository = database.AppDataSource.getRepository(Category);
    if (categoryId) {
      const category = await categoryRepository.findOne({
        where: { id: Number(categoryId) },
      });

      if (!category) {
        return response.status(404).json({ message: "Category not found" });
      }

      expenseToEdit.categories = [category];
    }

    await expenseRepository.save(expenseToEdit);

    response.json(expenseToEdit);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (request: Request, response: Response, next: NextFunction) => {
  try {
    if (!request.params.id) {
      response.status(400).json({ message: 'Item ID is required' });
      return;
    }
    const id = parseInt(request.params.id);

    // get user from session
    const userId = request.session.userId;
    if (!userId) {
      return response.status(401).json({ message: "Not logged in" });
    }

    // verify expense belongs to user
    const expenseToDelete = await expenseRepository.findOne({
      where: { id },
      relations: ["user_id"],
    });
    if (!expenseToDelete || expenseToDelete.user_id.id !== userId) {
      return response.status(403).json({ message: "Forbidden" });
    }

    // get expense to delete
    if (!expenseToDelete) {
      response.status(404).json({ message: 'Expense not found' });
      return;
    }

    await expenseRepository.remove(expenseToDelete);

    response.status(204).send();
  } catch (error) {
    next(error);
  }
};
