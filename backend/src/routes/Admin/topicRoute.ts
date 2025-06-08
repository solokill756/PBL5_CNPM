import { Router } from "express";
import { authenticateToken } from "../../middleware/authMiddleware";
import { Request, Response, NextFunction } from "express";
import topicController from "../../controllers/Admin/topicController";
const AdminTopicRoutes = Router();
AdminTopicRoutes.all("*", (req: Request, res: Response, next: NextFunction) => {
  authenticateToken(req, res, next);
});

AdminTopicRoutes.post("/add", topicController.addTopic);
AdminTopicRoutes.post("/update/:topicId", topicController.updateTopic);
AdminTopicRoutes.delete("/delete/:topicId", topicController.deleteTopic);
AdminTopicRoutes.get("/all", topicController.getAllTopics);
AdminTopicRoutes.get("/:topicId", topicController.getTopicById);

export default AdminTopicRoutes;
