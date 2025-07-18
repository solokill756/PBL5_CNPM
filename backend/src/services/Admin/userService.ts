import db from "../../models";
import { filterUserData } from "../../utils/fillData";

const getAllUsers = async (): Promise<any> => {
  try {
    let users = await db.user.findAll({
      include: [
        {
          model: db.authentication,
          attributes: ["verified"],
          required: true,
        },
      ],
      where: {
        role: "user",
      },
    });
    users = users.map((user: any) => {
      return {
        verified: user.Authentications[0].verified, // Fixed object syntax
        ...filterUserData(user),
      };
    });
    return users;
  } catch (error) {
    throw new Error("Error fetching all users");
  }
};

const blockUser = async (userId: string): Promise<boolean> => {
  try {
    await db.user.update({ is_blocked: true }, { where: { user_id: userId } });
    return true;
  } catch (error) {
    throw new Error("Error blocking user");
  }
};

const unblockUser = async (userId: string): Promise<boolean> => {
  try {
    await db.user.update({ is_blocked: false }, { where: { user_id: userId } });
    return true;
  } catch (error) {
    throw new Error("Error unblocking user");
  }
};

const getUserById = async (userId: string): Promise<any> => {
  try {
    const user = await db.user.findOne({
      where: { user_id: userId },
      include: [
        {
          model: db.authentication,
          attributes: ["verified"],
          required: true,
        },
      ],
    });
    return {
      verified: user.Authentications[0].verified,
      ...filterUserData(user),
    };
  } catch (error) {
    throw new Error("Error fetching user by ID");
  }
};

export default {
  getAllUsers,
  blockUser,
  unblockUser,
  getUserById,
};
