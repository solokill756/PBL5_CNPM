import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface UserAttributes {
  user_id: string;
  full_name: string;
  email: string;
  password: string;
  profile_picture?: string;
  datetime_joined: Date;
  username: string;
  reminder_time?: string;
  reminder_status?: boolean;
  tokenVersion?: number;
  total_points?: number;
  current_level?: number;
  is_active?: boolean;
  levelThreshold?: number;
  is_blocked?: boolean;
  role: string;
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    "user_id" | "profile_picture" | "datetime_joined"
  > {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare user_id: string;
  declare full_name: string;
  declare email: string;
  declare password: string;
  declare profile_picture?: string;
  declare datetime_joined: Date;
  declare username: string;
  declare reminder_time?: string;
  declare reminder_status?: boolean;
  declare tokenVersion?: number;
  declare total_points?: number;
  declare current_level?: number;
  declare is_active?: boolean;
  declare levelThreshold?: number;
  declare is_blocked?: boolean;
  declare role: string;
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      full_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      profile_picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      datetime_joined: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: false,
      },
      reminder_time: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reminder_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      tokenVersion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      current_level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      levelThreshold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_blocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
      },
    },
    {
      sequelize,
      tableName: "user",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
        {
          unique: true,
          fields: ["user_id"],
        },
        {
          unique: false,
          fields: ["username"],
        },
      ],
    }
  );
  return User;
};
