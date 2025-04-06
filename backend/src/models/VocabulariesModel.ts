import { Sequelize, DataTypes, Model } from 'sequelize';

interface VocabularyAttributes {
  vocab_id: string;
  word: string;
  meaning?: string;
  pronunciation?: string;
  example?: string;
  topic?: string;
  image_url?: string;
  ai_suggested: boolean;
  created_at: Date;
}

interface VocabularyCreationAttributes extends Partial<Pick<VocabularyAttributes, 'vocab_id' | 'meaning' | 'pronunciation' | 'example' | 'topic' | 'image_url' | 'created_at'>> {}

class Vocabulary extends Model<VocabularyAttributes, VocabularyCreationAttributes> implements VocabularyAttributes {
  declare vocab_id: string;
  declare word: string;
  declare meaning?: string;
  declare pronunciation?: string;
  declare example?: string;
  declare topic?: string;
  declare image_url?: string;
  declare ai_suggested: boolean;
  declare created_at: Date;
}

export default (sequelize: Sequelize) => {
  Vocabulary.init(
    {
      vocab_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      word: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      meaning: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      pronunciation: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      example: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      topic: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      image_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ai_suggested: {
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
      tableName: 'vocabularies',
      timestamps: false,
    }
  );

  return Vocabulary;
};