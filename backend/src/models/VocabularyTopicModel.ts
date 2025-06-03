import { Sequelize, DataTypes, Model } from "sequelize";

interface VocabularyTopicAttributes {
  topic_id: string;
  name: string;
  image_url?: string;
  description?: string;
  created_at: Date;
  require_level: number;
  total_words : number;
  points : number;
}

interface VocabularyTopicCreationAttributes
  extends Partial<
    Pick<VocabularyTopicAttributes, "description" | "created_at" | "image_url">
  > {}

class VocabularyTopic
  extends Model<VocabularyTopicAttributes, VocabularyTopicCreationAttributes>
  implements VocabularyTopicAttributes
{
  declare topic_id: string;
  declare name: string;
  declare description?: string;
  declare created_at: Date;
  declare image_url?: string | undefined;
  declare require_level: number;
  declare total_words: number;
  declare points: number;
}

export default (sequelize: Sequelize) => {
  VocabularyTopic.init(
    {
      topic_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image_url: {
        type: DataTypes.STRING(1024),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      require_level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_words: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },


    },
    {
      sequelize,
      tableName: "vocabulary_topic",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["topic_id"]
        }
      ]
    }
  );

  return VocabularyTopic;
};
