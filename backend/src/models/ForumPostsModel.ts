import { Sequelize, DataTypes, Model } from 'sequelize';

interface ForumPostAttributes {
  post_id: string;
  user_id: string;
  title: string;
  content: string;
  ai_generated_answer?: string;
  created_at: Date;
}

interface ForumPostCreationAttributes extends Partial<Pick<ForumPostAttributes, 'post_id' | 'ai_generated_answer' | 'created_at'>> {}

class ForumPost extends Model<ForumPostAttributes, ForumPostCreationAttributes> implements ForumPostAttributes {
  declare post_id: string;
  declare user_id: string;
  declare title: string;
  declare content: string;
  declare ai_generated_answer?: string;
  declare created_at: Date;
}

export default (sequelize: Sequelize) => {
  ForumPost.init(
    {
      post_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      ai_generated_answer: {
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
      tableName: 'forum_posts',
      timestamps: false,
    }
  );
  return ForumPost;
};