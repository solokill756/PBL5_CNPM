import vocabularyController from "../../controllers/User/vocabularyController";
import { NextFunction, Router } from "express";
import { authenticateToken } from "../../middleware/authMiddleware";
import { Request, Response } from "express";
const vocabularyRouter = Router();

vocabularyRouter.all("*", (req: Request, res: Response, next: NextFunction) => {
  authenticateToken(req, res, next);
});
vocabularyRouter.post("/similar", vocabularyController.getSimilarVocabulary);
vocabularyRouter.get(
  "/topic/:topic_id",
  vocabularyController.getVocabularyByTopic
);
vocabularyRouter.post("/al", vocabularyController.getAlToFindVocabulary);
vocabularyRouter.post(
  "/requestNewVocabulary",
  vocabularyController.requestNewVocabulary
);
vocabularyRouter.get("/allTopic", vocabularyController.getAllTopic);
vocabularyRouter.get("/historySearch", vocabularyController.getHistorySearch);
vocabularyRouter.post(
  "/addHistorySearch",
  vocabularyController.addHistorySearch
);
vocabularyRouter.post("/checkLevelUser", vocabularyController.checkLevelUser);
vocabularyRouter.post(
  "/updateVocabularyUser",
  vocabularyController.updateVocabularyUser
);
vocabularyRouter.get(
  "/topicDetails/:topic_id",
  vocabularyController.getTopicVocabularyByID
);
export default vocabularyRouter;
