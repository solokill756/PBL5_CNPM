import { Sequelize, DataTypes, Model } from "sequelize";

interface ClassMemberAttributes {
  class_id: string;
  user_id: string;
  joined_at: Date;
  last_accessed: Date;
  id: String;
  reminder_status: boolean;
}

interface ClassMemberCreationAttributes
  extends Partial<Pick<ClassMemberAttributes, "joined_at" | "id" | "reminder_status">> { }

class ClassMember
  extends Model<ClassMemberAttributes, ClassMemberCreationAttributes>
  implements ClassMemberAttributes {
  declare id: string;
  declare class_id: string;
  declare user_id: string;
  declare joined_at: Date;
  declare last_accessed: Date;
  declare reminder_status: boolean;
}

export default (sequelize: Sequelize) => {
  ClassMember.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      last_accessed: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      class_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      joined_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      reminder_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: "class_member",
      timestamps: false,

    }
  );
  return ClassMember;
};
