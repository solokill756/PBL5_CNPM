import { Router } from "express";
import classController from "../../controllers/User/classController";
import { authenticateToken } from "../../middleware/authMiddleware";
import { Request, Response, NextFunction } from "express";

const classRoute = Router();
classRoute.all("*", (req: Request, res: Response, next: NextFunction) => {
  authenticateToken(req, res, next);
});

classRoute.get("/get-class/:class_id", classController.getClassById);
classRoute.post("/add-class", classController.addClass);
classRoute.delete("/delete-class/:class_id", classController.deleteClass);
classRoute.post("/update-class/:class_id", classController.updateClass);
classRoute.post("/add-member-to-class", classController.addMemberToClass);
classRoute.delete(
  "/remove-member-from-class",
  classController.removeMenberFromClass
);

classRoute.post(
  "/add-list-flashcard-to-class",
  classController.addListFlashCardToClass
);
classRoute.delete(
  "/remove-list-flashcard-from-class",
  classController.removeListFlashCardFromClass
);

export default classRoute;
