import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface UserAchievementAttributes {
  user_achievement_id: string;
  user_id: string;
  achievement_id: string;
  date_earned: Date;
}

interface UserAchievementCreationAttributes extends Optional<UserAchievementAttributes, 'user_achievement_id' | 'date_earned'> {}

class UserAchievement
  extends Model<UserAchievementAttributes, UserAchievementCreationAttributes>
  implements UserAchievementAttributes {
  declare user_achievement_id: string;
  declare user_id: string;
  declare achievement_id: string;
  declare date_earned: Date;
}

export default (sequelize: Sequelize) => {
  UserAchievement.init(
    {
      user_achievement_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      achievement_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      date_earned: {  
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "user_achievement",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["user_achievement_id"]
        }
      ]
    }
  );

  return UserAchievement;
};
