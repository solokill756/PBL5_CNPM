import db from "../models/index.js";
import { filterUserData, UserClientData } from "../utils/fillData.js";

const getProfile = async (userId: string): Promise<UserClientData> => {
    try {
        const user = await db.users.findByPk(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const userData = user.toJSON();
        const profile = filterUserData(userData);
        return profile;
    } catch (error) {
        throw new Error("User not found");
    }
}

const updateProfile = async (userId: string, updateProfile: any): Promise<UserClientData> => {
    try {
        const user = await db.users.findByPk(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const userData = user.toJSON();
        const profile = filterUserData(userData);
        const updatedProfile = { ...profile, ...updateProfile };
        await db.users.update(updatedProfile, { where: { id: userId } });
        return updatedProfile;
    } catch (error) {
        throw new Error("User not found");
    }
}

export default getProfile;

