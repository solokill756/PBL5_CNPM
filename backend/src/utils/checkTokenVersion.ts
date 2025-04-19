import db from "../models";

const checktokenVersion = async (
  userId: string,
  tokenVersion: number | undefined
): Promise<boolean> => {
  try {
    if (tokenVersion === undefined) {
      return false;
    }
    const user = await db.user.findOne({
      where: { user_id: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user.tokenVersion === tokenVersion;
  } catch (error) {
    throw error;
  }
};

export default checktokenVersion;
