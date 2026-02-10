import { Request, Response } from "express";

export const getUsers = (req: Request, res: Response) => {
    res.json({message: 'Get all users'});
};



export const createUser = (req: Request, res: Response) => {
    const { first_name, last_name, user_name, email, password } = req.body;
    res.json({message: `Create user with name ${name} and email ${email}`});
};