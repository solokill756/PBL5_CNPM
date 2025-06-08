import { Router } from "express";
import { NextFunction, Request, Response } from "express";
import { authenticateToken } from "../../middleware/authMiddleware";
import vocabularyController from "../../controllers/Admin/vocabularyController";
const AdminVocabularyRoutes = Router();

AdminVocabularyRoutes.all(
  "*",
  (req: Request, res: Response, next: NextFunction) => {
    authenticateToken(req, res, next);
  }
);

AdminVocabularyRoutes.post("/add", vocabularyController.addVocabulary);
AdminVocabularyRoutes.post(
  "/update/:vocabularyId",
  vocabularyController.updateVocabulary
);
AdminVocabularyRoutes.delete(
  "/delete/:vocabularyId",
  vocabularyController.deleteVocabulary
);
AdminVocabularyRoutes.get("/all", vocabularyController.getAllVocabulary);
AdminVocabularyRoutes.get(
  "/:vocabularyId",
  vocabularyController.getVocabularyById
);

export default AdminVocabularyRoutes;
