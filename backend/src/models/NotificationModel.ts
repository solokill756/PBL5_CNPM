import { Sequelize, DataTypes, Model } from "sequelize";

interface NotificationAttributes {
  notification_id: string;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: Date;
}

interface NotificationCreationAttributes
  extends Partial<
    Pick<NotificationAttributes, "notification_id" | "created_at">
  > {}

class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  declare notification_id: string;
  declare user_id: string;
  declare message: string;
  declare is_read: boolean;
  declare created_at: Date;
}

export default (sequelize: Sequelize) => {
  Notification.init(
    {
      notification_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "notification",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["notification_id"]
        }
      ]
    }

  );

  return Notification;
};
