import { Request, Response } from "express";
import classService from "../../services/User/classService";
import { sendError, sendSuccess } from "../../middleware/responseFormatter";
const getClassById = async (req: Request, res: Response) => {
  const { class_id } = req.params;
  try {
    const data = await classService.getClassById(class_id);
    sendSuccess(res, data, "Class retrieved successfully");
  } catch (error: any) {
    sendError(res, "Error retrieving class", 500, error?.message || error);
  }
};

const addClass = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const user_id = (req as any).user.user_id;
  if (!user_id) {
    return sendError(res, "User not authenticated", 401);
  }
  try {
    const data = await classService.addClass(user_id, name, description);
    sendSuccess(res, data, "Class created successfully");
  } catch (error: any) {
    sendError(res, "Error creating class", 500, error?.message || error);
  }
};

const deleteClass = async (req: Request, res: Response) => {
  const { class_id } = req.params;
  try {
    const data = await classService.deleteClass(class_id);
    sendSuccess(res, data, "Class deleted successfully");
  } catch (error: any) {
    sendError(res, "Error deleting class", 500, error?.message || error);
  }
};

const updateClass = async (req: Request, res: Response) => {
  const { class_id } = req.params;
  const { name, description } = req.body;
  try {
    const updatePayload: { [key: string]: any } = {};
    if (name !== null && name !== undefined) updatePayload.name = name;
    if (description !== null && description !== undefined)
      updatePayload.description = description;
    const data = await classService.updateClass(class_id, updatePayload);
    sendSuccess(res, data, "Class updated successfully");
  } catch (error: any) {
    sendError(res, "Error updating class", 500, error?.message || error);
  }
};

const addMemberToClass = async (req: Request, res: Response) => {
  const { email, class_id } = req.body;
  const user_id = (req as any).user.user_id;
  if (!user_id) {
    return sendError(res, "User not authenticated", 401);
  }
  try {
    const data = await classService.addMemberToClass(class_id, email);
    sendSuccess(res, data, "Member added to class successfully");
  } catch (error: any) {
    sendError(
      res,
      "Error adding member to class",
      500,
      error?.message || error
    );
  }
};

const removeMenberFromClass = async (req: Request, res: Response) => {
  const { class_id, user_id } = req.body;
  if (!user_id) {
    return sendError(res, "User not authenticated", 401);
  }
  try {
    const data = await classService.removeMemberFromClass(class_id, user_id);
    sendSuccess(res, data, "Member removed from class successfully");
  } catch (error: any) {
    sendError(
      res,
      "Error removing member from class",
      500,
      error?.message || error
    );
  }
};

const addListFlashCardToClass = async (req: Request, res: Response) => {
  const { class_id, list_id } = req.body;
  try {
    const data = await classService.addListFlashCardToClass(class_id, list_id);
    sendSuccess(res, data, "List flashcard added to class successfully");
  } catch (error: any) {
    sendError(
      res,
      "Error adding list flashcard to class",
      500,
      error?.message || error
    );
  }
};

const removeListFlashCardFromClass = async (req: Request, res: Response) => {
  const { class_id, list_id } = req.body;
  try {
    const data = await classService.removeListFlashCardFromClass(
      class_id,
      list_id
    );
    sendSuccess(res, data, "List flashcard removed from class successfully");
  } catch (error: any) {
    sendError(
      res,
      "Error removing list flashcard from class",
      500,
      error?.message || error
    );
  }
};

export default {
  getClassById,
  addClass,
  deleteClass,
  updateClass,
  addMemberToClass,
  removeMenberFromClass,
  addListFlashCardToClass,
  removeListFlashCardFromClass,
};
