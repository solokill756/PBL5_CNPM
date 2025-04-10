import { Sequelize, DataTypes, Model } from 'sequelize';

interface FlashcardAttributes {
  flashcard_id: string;
  user_id: string;
  vocab_id: string;
  custom_note?: string;
  review_count: number;
  last_review: Date;
  ai_priority: boolean;
}

interface FlashcardCreationAttributes extends Partial<Pick<FlashcardAttributes, 'flashcard_id' | 'custom_note' | 'review_count' | 'last_review'>> {}

class Flashcard extends Model<FlashcardAttributes, FlashcardCreationAttributes> implements FlashcardAttributes {
  declare flashcard_id: string;
  declare user_id: string;
  declare vocab_id: string;
  declare custom_note?: string;
  declare review_count: number;
  declare last_review: Date;
  declare ai_priority: boolean;
}

export default (sequelize: Sequelize) => {
  Flashcard.init(
    {
      flashcard_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      vocab_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      custom_note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      review_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      last_review: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      ai_priority: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'flashcards',
      timestamps: false,
    }
  );

  return Flashcard;
};