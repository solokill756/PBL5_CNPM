import { sendError, sendSuccess } from "../middleware/responseFormatter";
import profileService from "../services/profilePageService";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { saltRounds } from "../helpers/tokenHelper";
import removeNullProperties from "../utils/removeNullProperties";
import cloudinary from "../config/cloudinary";
const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.user_id;
        if (!userId) {
            sendError(res, "Unauthorized", 401);
            return;
        }
        try {
            const profile = await profileService.getProfile(userId);
            sendSuccess(res, profile);
        } catch (error) {
            sendError(res, "Internal server error", 500);
        }
    } catch (error) {
        sendError(res, "Internal server error", 500);
    }
}

const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.user_id;
        if (!userId) {
            sendError(res, "Unauthorized", 401);
            return;
        }
        const updateProfile = {
            full_name: req.body.full_name,
            password: req.body.password ? await bcrypt.hash(req.body.password as string, saltRounds) : undefined,
            profile_picture: req.body.profile_picture,
        }
        const updateProfileFitter = removeNullProperties(updateProfile);
        try {
            const profile = await profileService.updateProfile(userId, updateProfileFitter);
            sendSuccess(res, profile);
        } catch (error) {
            sendError(res, "Internal server error", 500);
        }
    } catch (error) {
        sendError(res, "Internal server error", 500);
    }
}

const setReminder = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.user_id;
        const reminderTime = req.body.reminderTime;
        const reminderStatus = req.body.reminderStatus;
        if (!userId) {
            sendError(res, "Unauthorized", 401);
            return;
        }
        const data = await profileService.setReminder(userId, reminderTime, reminderStatus);
        sendSuccess(res, data);
    } catch (error) {
        sendError(res, "Internal server error", 500);
    }
}

const getReminder = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.user_id;
        const reminder = await profileService.getReminder(userId);
        sendSuccess(res, reminder);
    } catch (error) {
        sendError(res, "Internal server error", 500);
    }
}

const getReminderClass = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.user_id;
        if (!userId) {
            sendError(res, "Unauthorized", 401);
            return;
        }
        try {
            const reminderClass = await profileService.getReminderClass(userId);
            sendSuccess(res, reminderClass);
        } catch (error) {
            sendError(res, "Internal server error", 500);
        }
    } catch (error) {
        sendError(res, "Internal server error", 500);
    }
}

const setReminderClass = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.user_id;
        const classId = req.body.classId;
        const reminderStatus = req.body.reminderStatus;
        if (!userId) {
            sendError(res, "Unauthorized", 401);
            return;
        }
        try {
            const profile = await profileService.setReminderClass(userId, classId, reminderStatus);
            sendSuccess(res, profile);
        } catch (error: unknown) {
            if (error instanceof Error) {
                sendError(res, error.message, 500);
            } else {
                sendError(res, "Internal server error", 500);
            }
        }
    } catch (error) {
        sendError(res, "Internal server error", 500);
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.user_id;
        if (!userId) {
            sendError(res, "Unauthorized", 401);
            return;
        }
        try {
            const profile = await profileService.deleteUser(userId);
            sendSuccess(res, profile);
        } catch (error) {
            sendError(res, "Internal server error", 500);
        }
    } catch (error) {
        sendError(res, "Internal server error", 500);
    }
}

const updateProfilePicture = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.user_id;
        if (!userId) {
            sendError(res, "Unauthorized", 401);
            return;
        }
        const file = req.file;
        if (!file) {
            sendError(res, "No file uploaded", 400);
            return;
        }
        const result = await cloudinary.v2.uploader.upload(file.path);
        const data = await profileService.updateProfilePicture(userId, result.secure_url);
        sendSuccess(res, data);
    } catch (error) {
        sendError(res, "Internal server error", 500);
    }
}



export { getProfile, updateProfile, setReminder, getReminder, getReminderClass, setReminderClass, deleteUser, updateProfilePicture };
