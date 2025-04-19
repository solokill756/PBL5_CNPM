import { Sequelize, DataTypes, Model } from "sequelize";

interface ListFlashcardAttributes {
  list_id: string;
  user_id: string;
  title: string;
  description?: string;
  created_at: Date;
}

interface ListFlashcardCreationAttributes
  extends Partial<
    Pick<ListFlashcardAttributes, "list_id" | "description" | "created_at">
  > {}

class ListFlashcard
  extends Model<ListFlashcardAttributes, ListFlashcardCreationAttributes>
  implements ListFlashcardAttributes
{
  declare list_id: string;
  declare user_id: string;
  declare title: string;
  declare description?: string;
  declare created_at: Date;
}

export default (sequelize: Sequelize) => {
  ListFlashcard.init(
    {
      list_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "list_flashcard",
      timestamps: false,
    }
  );

  return ListFlashcard;
};
