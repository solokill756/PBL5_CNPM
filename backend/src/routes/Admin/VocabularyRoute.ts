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
AdminVocabularyRoutes.post("/update/:vocabularyId");
AdminVocabularyRoutes.delete("/delete/:vocabularyId");
AdminVocabularyRoutes.get("/all", vocabularyController.getAllVocabulary);
AdminVocabularyRoutes.get(
  "/:vocabularyId",
  vocabularyController.getVocabularyById
);

export default AdminVocabularyRoutes;
