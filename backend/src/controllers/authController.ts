import type { Request, Response, NextFunction } from 'express';
import database from "../database";
import { User } from "../models/User";
import bcrypt from "bcrypt";

export const signUp = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, password } = request.body;

    if (!firstName || !lastName || !password) {
      return response
              .status(400)
              .json({ message: "All fields are required" });
    }

    const userRepository = database.AppDataSource.getRepository(User);

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: {
        first_name: firstName,
        last_name: lastName
      },
    });

    if (existingUser) {
      return response.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = userRepository.create({
      first_name: firstName,
      last_name: lastName,
      password: hashedPassword,
      created_at: new Date(),
      last_login: new Date()
    });

    // Save to database
    await userRepository.save(newUser);

    response.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

export const logIn = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, password } = request.body;

    if (!firstName || !lastName || !password) {
      return response
              .status(400)
              .json({ message: "All fields are required" });
    }

    const userRepository = database.AppDataSource.getRepository(User);

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: {
        first_name: firstName,
        last_name: lastName
      },
    });

    if (!existingUser) {
      return response.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return response.status(401).json({ message: "Invalid credentials" });
    }

    request.session.userId = existingUser.id;

    existingUser.last_login = new Date();
    await userRepository.save(existingUser);

    return response.status(200).json({ 
      message: "Logged in successfully"
    });
  } catch (error) {
    next(error);
  }
};

export const getState = (req: Request, res: Response) => {
  if (req.session.userId) {
    res.json({ loggedIn: true, userId: req.session.userId });
  } else {
    res.json({ loggedIn: false });
  }
};

// Read single item
export const logOut = (request: Request, response: Response, next: NextFunction) => {
  try {
    // Destroy the session using the user id from the cookie
    request.session.destroy((error) => {
      if (error) {
        console.error("Failed to destroy session:", error);
        return response.status(500).json({ message: "Failed to log out" });
      }

      response.clearCookie("connect.sid");
      return response.status(200).json({ message: "Logged out successfully" });
    });
  } catch (error) {
    next(error);
  }
};
