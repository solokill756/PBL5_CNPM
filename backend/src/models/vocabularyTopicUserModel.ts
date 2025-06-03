import { Sequelize, DataTypes, Model } from "sequelize";

interface VocabularyTopicUserAttributes {
  user_id: string;
  topic_id: string;
  mastered_words: number;

}

class VocabularyTopicUser extends Model<VocabularyTopicUserAttributes> implements VocabularyTopicUserAttributes {
  declare user_id: string;
  declare topic_id: string;
  declare mastered_words: number;
}


export default (sequelize: Sequelize) => {
  VocabularyTopicUser.init({
    user_id: {  
      type: DataTypes.UUID,
      allowNull: false,
    },
    topic_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    mastered_words: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    sequelize,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'topic_id']
      }
    ],
    tableName: 'vocabulary_topic_user',
    timestamps: false,
  });

  return VocabularyTopicUser;
};
