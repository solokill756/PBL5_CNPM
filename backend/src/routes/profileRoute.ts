import { Router } from "express";

import { Request, Response, NextFunction } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { deleteUser, getProfile, getReminder, getReminderClass, setReminder, setReminderClass, updateProfile, updateProfilePicture } from "../controllers/profileController";
import multer from "multer";
import storage from "../config/storageCloud";

const profileRoutes = Router();
const upload = multer({ storage: storage });
profileRoutes.all("*", (req: Request, res: Response, next: NextFunction) => {
    authenticateToken(req, res, next);
});


profileRoutes.get("/getProfile", (req: Request, res: Response) => {
    getProfile(req, res);
});

profileRoutes.post("/updateProfile", (req: Request, res: Response) => {
    updateProfile(req, res);
});

profileRoutes.post("/setReminder", (req: Request, res: Response) => {
    setReminder(req, res);
});

profileRoutes.get("/getReminder", (req: Request, res: Response) => {
    getReminder(req, res);
});

profileRoutes.post("/setReminderClass", (req: Request, res: Response) => {
    setReminderClass(req, res);
});

profileRoutes.get("/getReminderClass", (req: Request, res: Response) => {
    getReminderClass(req, res);
});

profileRoutes.delete("/deleteUser", (req: Request, res: Response) => {
    deleteUser(req, res);
});

profileRoutes.post("/updateProfilePicture", upload.single("image"), (req: Request, res: Response) => {
    updateProfilePicture(req, res);
});


export default profileRoutes;











