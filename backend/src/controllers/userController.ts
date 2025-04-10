import { Request, Response } from "express";
import db from "../models/index.js";

const User = db.users;

const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  let users = await User.findAll({});
  console.log(users);
  res.status(200).send(users);
};

const getUser = async (req: Request, res: Response): Promise<void> => {
  let id = req.params.id;
  let user = await User.findOne({ where: { user_id: id } });
  res.status(200).send(user);
};

export { getAllUsers, getUser };
