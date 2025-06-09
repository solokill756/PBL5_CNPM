import { Sequelize, DataTypes, Model } from "sequelize";

interface VocabularyAttributes {
  vocab_id: string;
  word: string;
  meaning: string;
  pronunciation: string;
  example?: string;
  topic_id: string;
  usage?: string;
  example_meaning?: string;
  ai_suggested?: string;
  created_at: Date;
  language: string;
  level: string;
  type: string;
  is_show: boolean;
}

interface VocabularyCreationAttributes
  extends Partial<
    Pick<
      VocabularyAttributes,
      | "vocab_id"
      | "created_at"
      | "usage"
      | "example_meaning"
      | "ai_suggested"
      | "word"
      | "meaning"
      | "pronunciation"
      | "example"
    >
  > {}

class Vocabulary
  extends Model<VocabularyAttributes, VocabularyCreationAttributes>
  implements VocabularyAttributes
{
  declare vocab_id: string;
  declare word: string;
  declare meaning: string;
  declare pronunciation: string;
  declare example?: string;
  declare topic_id: string;
  declare usage: string;
  declare example_meaning: string;
  declare ai_suggested: string;
  declare created_at: Date;
  declare language: string;
  declare level: string;
  declare type: string;
  declare is_show: boolean;
}

export default (sequelize: Sequelize) => {
  Vocabulary.init(
    {
      vocab_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      topic_id: {
        type: DataTypes.UUID,
        allowNull: false,
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
      usage: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      example_meaning: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      language: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      level: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      is_show: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: "vocabulary",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["vocab_id"],
        },
        {
          unique: true,
          fields: ["word"],
        },
      ],
    }
  );

  return Vocabulary;
};
