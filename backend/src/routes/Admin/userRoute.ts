import { Router, Request, Response, NextFunction } from "express";
import { authenticateToken } from "../../middleware/authMiddleware";
import userController from "../../controllers/Admin/userController";

const AdminUserRoutes = Router();
AdminUserRoutes.all("*", (req: Request, res: Response, next: NextFunction) => {
  authenticateToken(req, res, next);
});

AdminUserRoutes.get("/all", userController.getAllUsers);
AdminUserRoutes.post("/block/:userId", userController.blockUser);
AdminUserRoutes.post("/unblock/:userId", userController.unblockUser);
AdminUserRoutes.get("/:userId", userController.getUserById);

export default AdminUserRoutes;
