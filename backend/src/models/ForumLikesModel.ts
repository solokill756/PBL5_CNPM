import { Sequelize, DataTypes, Model } from 'sequelize';

interface ForumLikeAttributes {
  like_id: string;
  user_id: string;
  post_id?: string;
  comment_id?: string;
  created_at: Date;
}

interface ForumLikeCreationAttributes extends Partial<Pick<ForumLikeAttributes, 'like_id' | 'post_id' | 'comment_id' | 'created_at'>> {}

class ForumLike extends Model<ForumLikeAttributes, ForumLikeCreationAttributes> implements ForumLikeAttributes {
  declare like_id: string;
  declare user_id: string;
  declare post_id?: string;
  declare comment_id?: string;
  declare created_at: Date;
}

export default (sequelize: Sequelize) => {
  ForumLike.init(
    {
      like_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      post_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      comment_id: {
        type: DataTypes.UUID,
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
      tableName: 'forum_likes',
      timestamps: false,
    }
  );

  return ForumLike;
};