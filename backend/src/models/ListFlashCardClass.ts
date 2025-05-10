import { DataTypes, Model } from "sequelize";

import { Sequelize } from "sequelize";

interface ListFlashCardClassAttributes {
  list_id: string;
  class_id: string;
}

class ListFlashCardClass extends Model<ListFlashCardClassAttributes> implements ListFlashCardClassAttributes {
  declare list_id: string;
  declare class_id: string;
}

export default (sequelize: Sequelize) => {
  ListFlashCardClass.init(  
    {
      list_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      class_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "list_flashcard_class",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["list_id", "class_id"]
        }
      ]
    }
  );

  return ListFlashCardClass;
};
