import { Sequelize, DataTypes, Model } from "sequelize";

interface ClassMemberAttributes {
  class_id: string;
  user_id: string;
  joined_at: Date;
  last_accessed: Date;
  id: String;
}

interface ClassMemberCreationAttributes
  extends Partial<Pick<ClassMemberAttributes, "joined_at" | "id">> {}

class ClassMember
  extends Model<ClassMemberAttributes, ClassMemberCreationAttributes>
  implements ClassMemberAttributes
{
  declare id: string;
  declare class_id: string;
  declare user_id: string;
  declare joined_at: Date;
  declare last_accessed: Date;
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
    },
    {
      sequelize,
      tableName: "class_member",
      timestamps: false,
     
    }
  );
  return ClassMember;
};
