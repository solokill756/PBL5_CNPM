import express from "express";
import { Router } from "express";
import { getAllUsers, getUser } from "../controllers/userController.js";
// import all controllers
// import SessionController from './app/controllers/SessionController';

const userRoutes = new Router();

userRoutes.get("/allUsers", getAllUsers);
userRoutes.get("/:id", getUser);
export default userRoutes;
