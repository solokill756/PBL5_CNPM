import db from "../../models";
import { filterUserData, UserClientData } from "../../utils/fillData";

const getProfile = async (userId: string): Promise<UserClientData> => {
  try {
    const user = await db.user.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const userData = user.toJSON();
    const profile = filterUserData(userData);
    return profile;
  } catch (error) {
    throw new Error("User not found");
  }
};

const updateProfile = async (
  userId: string,
  updateProfile: any
): Promise<boolean> => {
  try {
    const user = await db.user.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const userData = user.toJSON();
    const profile = filterUserData(userData);
    const updatedProfile = { ...profile, ...updateProfile };
    await db.user.update(updatedProfile, { where: { user_id: userId } });
    return true;
  } catch (error) {
    throw new Error("User not found");
  }
};

const setReminder = async (
  userId: string,
  reminderTime: Date,
  reminderStatus: boolean
): Promise<any> => {
  try {
    const user = await db.user.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    await db.user.update(
      { reminder_time: reminderTime, reminder_status: reminderStatus },
      { where: { user_id: userId } }
    );
    return { reminder_time: reminderTime, reminder_status: reminderStatus };
  } catch (error) {
    throw new Error("User not found");
  }
};

const getReminder = async (userId: string): Promise<any> => {
  try {
    const user = await db.user.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return {
      reminder_time: user.reminder_time,
      reminder_status: user.reminder_status,
    };
  } catch (error) {
    throw new Error("User not found");
  }
};

const getReminderClass = async (userId: string): Promise<any> => {
  try {
    const findClass = await db.classMember.findAll({
      where: {
        user_id: userId,
      },
      attributes: ["reminder_status"],
      include: [
        {
          model: db.class,
          attributes: ["class_name", "class_id"],
        },
      ],
    });
    if (!findClass) {
      throw new Error("Class not found");
    }
    return findClass;
  } catch (error) {
    throw new Error("Class not found");
  }
};

const setReminderClass = async (
  userId: string,
  classId: string,
  reminderStatus: boolean
): Promise<any> => {
  try {
    await db.classMember.update(
      { reminder_status: reminderStatus },
      { where: { class_id: classId, user_id: userId } }
    );
    return { reminder_status: reminderStatus };
  } catch (error) {
    throw new Error("Class not found");
  }
};

const deleteUser = async (userId: string): Promise<any> => {
  try {
    await db.user.destroy({ where: { user_id: userId } });
    return { message: "User deleted" };
  } catch (error) {
    throw new Error("User not found");
  }
};

const updateProfilePicture = async (
  userId: string,
  profilePicture: string
): Promise<any> => {
  try {
    await db.user.update(
      { profile_picture: profilePicture },
      { where: { user_id: userId } }
    );
    return { profile_picture: profilePicture };
  } catch (error) {
    throw new Error("User not found");
  }
};

export default {
  getProfile,
  updateProfile,
  setReminder,
  getReminder,
  getReminderClass,
  setReminderClass,
  deleteUser,
  updateProfilePicture,
};
