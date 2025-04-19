import { Sequelize, DataTypes, Model } from "sequelize";

interface FlashcardStudyAttributes {
  user_id: string;
  list_id: string;
  last_accessed: Date;
  number_word_forget: number;
}

interface FlashcardStudyCreationAttributes
  extends Partial<Pick<FlashcardStudyAttributes, "last_accessed">> {}

class FlashcardStudy
  extends Model<FlashcardStudyAttributes, FlashcardStudyCreationAttributes>
  implements FlashcardStudyAttributes
{
  declare last_accessed: Date;
  declare user_id: string;
  declare list_id: string;
  declare number_word_forget: number;
}

export default (sequelize: Sequelize) => {
  FlashcardStudy.init(
    {
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
    },
    {
      sequelize,
      tableName: "flashcardStudy",
      timestamps: false,
      indexes: [{ unique: true, fields: ["list_id", "user_id"] }],
    }
  );

  return FlashcardStudy;
};
