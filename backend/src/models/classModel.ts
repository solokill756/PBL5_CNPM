import { Sequelize, DataTypes, Model } from "sequelize";

interface ClassAttributes {
  class_id: string;
  class_name: string;
  description?: string;
  created_by: string;
  created_at: Date;
}

interface ClassCreationAttributes
  extends Partial<
    Pick<ClassAttributes, "class_id" | "description" | "created_at">
  > {}

class Class
  extends Model<ClassAttributes, ClassCreationAttributes>
  implements ClassAttributes
{
  declare class_id: string;
  declare class_name: string;
  declare description?: string;
  declare created_by: string;
  declare created_at: Date;
}

export default (sequelize: Sequelize) => {
  Class.init(
    {
      class_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      class_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "class",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["class_id"],
        },
        {
          unique: false,
          fields: ["class_name"],
        },
      ],
    }
  );

  return Class;
};
