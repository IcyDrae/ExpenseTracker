import type { Request, Response, NextFunction } from 'express';
import { Category, User } from '../models';
import database from '../database/database';

const categoryRepository = database.AppDataSource.getRepository(Category);

export const getCategories = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const categories = await categoryRepository.find();
    response.json(categories);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (request: Request, response: Response, next: NextFunction) => {
  try {
    if (!request.params.id) {
      response.status(400).json({ message: 'Item ID is required' });
      return;
    }
    const id = parseInt(request.params.id);

    const category = await categoryRepository.findOneBy({ id });
    if (!category) {
      response.status(404).json({ message: 'Expense not found' });
      return;
    }

    response.json(category);
  } catch (error) {
    next(error);
  }
};
