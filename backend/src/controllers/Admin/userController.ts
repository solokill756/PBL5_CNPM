import { Request, Response } from "express";
import userService from "../../services/Admin/userService";
import { sendError, sendSuccess } from "../../middleware/responseFormatter";

const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    sendSuccess(res, users, "Users retrieved successfully");
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      sendError(res, error.message, 500);
    } else {
      sendError(res, "Server error", 500);
    }
  }
};

const blockUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      sendError(res, "User ID is required", 400);
      return;
    }
    const result = await userService.blockUser(userId);
    sendSuccess(res, result, "User blocked successfully");
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      sendError(res, error.message, 500);
    } else {
      sendError(res, "Server error", 500);
    }
  }
};

const unblockUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      sendError(res, "User ID is required", 400);
      return;
    }
    const result = await userService.unblockUser(userId);
    sendSuccess(res, result, "User unblocked successfully");
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      sendError(res, error.message, 500);
    } else {
      sendError(res, "Server error", 500);
    }
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      sendError(res, "User ID is required", 400);
      return;
    }
    const user = await userService.getUserById(userId);
    sendSuccess(res, user, "User retrieved successfully");
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      sendError(res, error.message, 500);
    } else {
      sendError(res, "Server error", 500);
    }
  }
};

export default {
  getAllUsers,
  blockUser,
  unblockUser,
  getUserById,
};
