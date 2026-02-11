import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { prisma } from "../../lib/prisma.mts";




export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json({count: users.length, users});
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};



export const createUser = async (req: Request, res: Response) => {
  const { first_name, last_name, user_name, email, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        user_name,
        email,
        password: hashedPassword,
        role
      }
    });
    res.status(201).json({message: `user created successfully`, user});
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    
  }
};