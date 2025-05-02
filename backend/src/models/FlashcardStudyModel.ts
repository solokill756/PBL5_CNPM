import { Sequelize, DataTypes, Model } from "sequelize";

interface FlashcardStudyAttributes {
  user_id: string;
  list_id: string;
  last_accessed: Date;
  number_word_forget: number;
  id: string;
  rate: number;
}

interface FlashcardStudyCreationAttributes
  extends Partial<Pick<FlashcardStudyAttributes, "last_accessed" | "id">> { }

class FlashcardStudy
  extends Model<FlashcardStudyAttributes, FlashcardStudyCreationAttributes>
  implements FlashcardStudyAttributes {
  declare last_accessed: Date;
  declare id: string;
  declare user_id: string;
  declare list_id: string;
  declare number_word_forget: number;
  declare rate: number;
}

export default (sequelize: Sequelize) => {
  FlashcardStudy.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      last_accessed: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      list_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      number_word_forget: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: DataTypes.INTEGER,
      },
      rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "flashcardStudy",
      timestamps: false,
    }
  );

  return FlashcardStudy;
};
