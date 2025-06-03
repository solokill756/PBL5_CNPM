import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface AchievementAttributes {
  achievement_id: string;
  title: string;
  description: string;
  icon: string;
  required_level: number;
  
  created_at?: Date;
}

interface AchievementCreationAttributes extends Optional<AchievementAttributes, 'achievement_id' | 'created_at'> {}

class Achievement
  extends Model<AchievementAttributes, AchievementCreationAttributes>
  implements AchievementAttributes {
  declare achievement_id: string;
  declare title: string;
  declare description: string;
  declare icon: string;
  declare required_level: number;
  declare created_at?: Date;
}

export default (sequelize: Sequelize) => {
  Achievement.init(
    {
      achievement_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      icon: {
        type: DataTypes.STRING(255), 
        allowNull: false,
      },
      required_level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "achievement",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["achievement_id"]
        }
      ]
    }
  );
  return Achievement;
};
