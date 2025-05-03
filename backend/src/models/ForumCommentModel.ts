import { Sequelize, DataTypes, Model } from "sequelize";

interface ForumCommentAttributes {
  comment_id: string;
  post_id: string;
  user_id: string;
  comment_text: string;
  created_at: Date;
}

interface ForumCommentCreationAttributes
  extends Partial<Pick<ForumCommentAttributes, "comment_id" | "created_at">> {}

class ForumComment
  extends Model<ForumCommentAttributes, ForumCommentCreationAttributes>
  implements ForumCommentAttributes
{
  declare comment_id: string;
  declare post_id: string;
  declare user_id: string;
  declare comment_text: string;
  declare created_at: Date;
}

export default (sequelize: Sequelize) => {
  ForumComment.init(
    {
      comment_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      post_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      comment_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "forum_comment",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["comment_id"]
        }
      ]
    }
  );

  return ForumComment;
};
