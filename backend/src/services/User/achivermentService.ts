import db from "../../models";

const getAllAchievement = async () => {
  try {
    const achievement = await db.achievement.findAll();
    return achievement;
  } catch (error) {
    throw error;
  }
};
const getAchievementByUserId = async (userId: string) => {
  try {
    const data = await db.userAchievement.findAll({
      where: {
        user_id: userId,
      },
    });
    const achievementIds = data.map((item: any) => item.achievement_id);
    const achievement = await db.achievement.findAll({
      where: {
        achievement_id: achievementIds,
      },
    });
    return achievement;
  } catch (error) {
    throw error;
  }
};
const getAchievementByAchievementId = async (achievementId: string) => {
  try {
    const achievement = await db.achievement.findAll({
      where: {
        achievement_id: achievementId,
      },
    });
    return achievement;
  } catch (error) {
    throw error;
  }
};

const getAchivementOfLevel = async (level: number) => {
  try {
    const achievement = await db.achievement.findAll({
      where: {
        required_level: level,
      },
    });
    return achievement;
  } catch (error) {
    throw error;
  }
};

const unlockAchievement = async (userId: string, user_level: number) => {
  try {
    const achievements = await db.achievement.findAll({
      where: {
        required_level: user_level,
      },
    });
    if (achievements.length === 0) {
      throw new Error("Achievement not found");
    }
    for (const achievement of achievements) {
      await db.userAchievement.create({
        user_id: userId,
        achievement_id: achievement.achievement_id,
      });
    }
    return await getAchievementByUserId(userId);
  } catch (error) {
    throw error;
  }
};
export default {
  getAllAchievement,
  getAchievementByUserId,
  getAchievementByAchievementId,
  getAchivementOfLevel,
  unlockAchievement,
};
