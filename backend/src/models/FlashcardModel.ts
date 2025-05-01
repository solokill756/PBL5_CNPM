import { Sequelize, DataTypes, Model } from "sequelize";

interface FlashcardAttributes {
  flashcard_id: string;
  front_text: string;
  back_text: string;
  custom_note?: string;
  ai_explanation: string;
  list_id: string;
}

interface FlashcardCreationAttributes
  extends Partial<
    Pick<
      FlashcardAttributes,
      "flashcard_id" | "custom_note"
    >
  > { }

class Flashcard
  extends Model<FlashcardAttributes, FlashcardCreationAttributes>
  implements FlashcardAttributes {
  declare front_text: string;
  declare back_text: string;
  declare list_id: string;
  declare flashcard_id: string;
  declare custom_note?: string;
  declare ai_explanation: string;
}

export default (sequelize: Sequelize) => {
  Flashcard.init(
    {
      flashcard_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      front_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      back_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      list_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      custom_note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      ai_explanation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "flashcard",
      timestamps: false,
    }
  );

  return Flashcard;
};
