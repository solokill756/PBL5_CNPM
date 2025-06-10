import { Request, Response } from "express";
import topicService from "../../services/Admin/topicService";
import { sendError, sendSuccess } from "../../middleware/responseFormatter";

const addTopic = async (req: Request, res: Response) => {
  try {
    const topicData = req.body;
    if (!topicData.name || !topicData.description) {
      sendError(res, "Missing required fields: name and description", 400);
      return;
    }
    const newTopic = await topicService.addTopic(topicData);
    sendSuccess(res, newTopic, "Topic created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteTopic = async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;
    if (!topicId) {
      sendError(res, "Topic ID is required", 400);
      return;
    }
    await topicService.deleteTopic(topicId);
    // Send deletion notification

    sendSuccess(res, {}, "Topic deleted successfully");
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      sendError(res, error.message, 500);
    } else {
      sendError(res, "Server error", 500);
    }
  }
};

const updateTopic = async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;
    const updateData = req.body;
   
    if (!topicId || !updateData) {
      sendError(res, "Topic ID and update data are required", 400);
      return;
    }
    const updatedTopic = await topicService.updateTopic(topicId, updateData);
    // Send update notification
   
    sendSuccess(res, updatedTopic, "Topic updated successfully");
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, error.message, 500);
    } else {
      sendError(res, "Server error", 500);
    }
  }
};

const getAllTopics = async (_req: Request, res: Response) => {
  try {
    const topics = await topicService.getAllTopic();
    sendSuccess(res, topics, "Topics retrieved successfully");
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, error.message, 500);
    } else {
      sendError(res, "Server error", 500);
    }
  }
};

const getTopicById = async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;
    if (!topicId) {
      sendError(res, "Topic ID is required", 400);
      return;
    }
    const topic = await topicService.getTopicById(topicId);
    sendSuccess(res, topic, "Topic retrieved successfully");
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, error.message, 500);
    } else {
      sendError(res, "Server error", 500);
    }
  }
};

export default {
  addTopic,
  deleteTopic,
  updateTopic,
  getAllTopics,
  getTopicById,
};
