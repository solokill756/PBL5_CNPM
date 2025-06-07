import db from "../../models";

const getAllUsers = async (): Promise<any> => {
  try {
    const users = db.users.findAll();
    return users;
  } catch (error) {}
};

const blockUser = async (userId: string): Promise<boolean> => {
  try {
    await db.users.update({ is_blocked: true }, { where: { user_id: userId } });
    return true;
  } catch (error) {
    throw new Error("Error blocking user");
  }
};

const unblockUser = async (userId: string): Promise<boolean> => {
  try {
    await db.users.update(
      { is_blocked: false },
      { where: { user_id: userId } }
    );
    return true;
  } catch (error) {
    throw new Error("Error unblocking user");
  }
};

const getUserById = async (userId: string): Promise<any> => {
  try {
    const user = await db.users.findOne({
      where: { user_id: userId },
    });
    return user;
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
