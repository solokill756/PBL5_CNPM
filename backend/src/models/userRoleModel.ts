import { Sequelize, DataTypes, Model } from "sequelize";

class UserRole extends Model {
  declare user_id: string;
  declare role_id: string;
  declare assigned_at: Date;
}

export default (sequelize: Sequelize) => {
  UserRole.init(
    {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      assigned_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "user_role",
      timestamps: false,
      indexes: [{ unique: true, fields: ["user_id", "role_id"] }],
    }
  );

  return UserRole;
};
