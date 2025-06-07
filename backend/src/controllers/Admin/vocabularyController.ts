import { Request, Response } from "express";
import vocabularyService from "../../services/Admin/vocabularyService";
import { sendError, sendSuccess } from "../../middleware/responseFormatter";
import removeNullProperties from "../../utils/removeNullProperties";

const addVocabulary = async (req: Request, res: Response) => {
  try {
    const vocabulary = req.body;
    if (!vocabulary || Object.keys(vocabulary).length === 0) {
      return sendError(res, "Vocabulary data is required", 400);
    }
    const response = await vocabularyService.addVocabulary(vocabulary);
    sendSuccess(res, response, "Vocabulary added successfully");
  } catch (error) {
    sendError(res, "Error adding vocabulary", 500, error);
  }
};

const updateVocabulary = async (req: Request, res: Response) => {
  try {
    const vocabulary_id = req.params.vocabularyId;
    const updateFields = req.body;
    const dataClearNull = removeNullProperties(updateFields); // Remove null properties from updateFields
    const response = await vocabularyService.updateVocabulary(
      vocabulary_id,
      dataClearNull
    );
    sendSuccess(res, response, "Vocabulary updated successfully");
  } catch (error) {
    sendError(res, "Error updating vocabulary", 500, error);
  }
};

const deleteVocabulary = async (req: Request, res: Response) => {
  try {
    const vocabulary_id = req.params.vocabularyId;
    const response = await vocabularyService.deleteVocabulary(vocabulary_id);
    sendSuccess(res, response, "Vocabulary deleted successfully");
  } catch (error) {
    sendError(res, "Error deleting vocabulary", 500, error);
  }
};

const getAllVocabulary = async (_req: Request, res: Response) => {
  try {
    const response = await vocabularyService.getAllVocabulary();
    sendSuccess(res, response, "All vocabulary retrieved successfully");
  } catch (error) {
    sendError(res, "Error fetching all vocabulary", 500, error);
  }
};

const getVocabularyById = async (req: Request, res: Response) => {
  try {
    const vocabulary_id = req.params.vocabularyId;
    const response = await vocabularyService.getVocabularyById(vocabulary_id);
    sendSuccess(res, response, "Vocabulary retrieved successfully");
  } catch (error) {
    sendError(res, "Error fetching vocabulary by ID", 500, error);
  }
};

export default {
  addVocabulary,
  updateVocabulary,
  deleteVocabulary,
  getAllVocabulary,
  getVocabularyById,
};
