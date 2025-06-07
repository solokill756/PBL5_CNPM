import { Request, Response } from "express";

import { sendError, sendSuccess } from "../middleware/responseFormatter";
import listFlashCardService from "../services/listFlashCardService.";
const addListFlashCard = async (req: Request, res: Response) => {
  const { title, description, flashcards } = req.body;
  const user_id = (req as any).user.user_id;
  if (!user_id) {
    sendError(res, "User not authenticated", 401);
    return;
  }
  try {
    const data = await listFlashCardService.addListFlashCard(
      user_id,
      title,
      description,
      flashcards
    );
    sendSuccess(res, data, "List flashcard created successfully");
  } catch (error: any) {
    sendError(
      res,
      "Error creating list flashcard",
      500,
      error?.message || error
    );
  }
};
const deleteListFlashCard = async (req: Request, res: Response) => {
  const { list_id } = req.params;
  try {
    const data = await listFlashCardService.deleteListFlashCard(list_id);
    sendSuccess(res, data, "List flashcard deleted successfully");
  } catch (error: any) {
    sendError(
      res,
      "Error deleting list flashcard",
      500,
      error?.message || error
    );
  }
};

const updateListFlashCard = async (req: Request, res: Response) => {
  const { list_id } = req.params;
  const { title, description, flashcards } = req.body;

  // Build update object with only non-null/undefined fields
  const updateFields: Record<string, any> = {};
  if (title !== undefined && title !== null) updateFields.title = title;
  if (description !== undefined && description !== null)
    updateFields.description = description;
  if (flashcards !== undefined && flashcards !== null)
    updateFields.flashcards = flashcards;

  // If no fields provided, do not update
  if (Object.keys(updateFields).length === 0) {
    return sendError(res, "No valid fields provided for update", 400);
  }

  try {
    await listFlashCardService.updateListFlashCard(list_id, updateFields);
    sendSuccess(res, {}, "List flashcard updated successfully");
  } catch (error: any) {
    sendError(
      res,
      "Error updating list flashcard",
      500,
      error?.message || error
    );
  }
};

export default {
  addListFlashCard,
  deleteListFlashCard,
  updateListFlashCard,
};
