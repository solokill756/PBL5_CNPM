import { sendError, sendSuccess } from "../../middleware/responseFormatter";
import { GenerateQuiz, saveResultQuiz } from "../../services/User/quizSevice";
import { Request, Response } from "express";
const generateQuizController = async (req: Request, res: Response) => {
  try {
    const { list_id, type_quiz, number_of_questions, topic_id } = req.body;
    const quiz = await GenerateQuiz(
      list_id,
      Number(type_quiz),
      Number(number_of_questions),
      topic_id
    );
    sendSuccess(res, quiz);
  } catch (error) {
    sendError(res, "Internal server error", 500);
  }
};

const saveResultQuizController = async (req: Request, res: Response) => {
  const io = req.app.locals.io;
  const { score, number_of_questions, topic_id } = req.body;
  const user_id = (req as any).user.user_id;
  if (!user_id) {
    res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const result = await saveResultQuiz(
      Number(score),
      user_id,
      Number(number_of_questions),
      topic_id,
      io
    );
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, "Internal server error", 500);
  }
};

export { generateQuizController, saveResultQuizController };
