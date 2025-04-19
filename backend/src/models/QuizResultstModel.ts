import { Sequelize, DataTypes, Model } from "sequelize";

interface QuizResultAttributes {
  result_id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  completed_at: Date;
}

interface QuizResultCreationAttributes
  extends Partial<Pick<QuizResultAttributes, "result_id" | "completed_at">> {}

class QuizResult
  extends Model<QuizResultAttributes, QuizResultCreationAttributes>
  implements QuizResultAttributes
{
  declare result_id: string;
  declare user_id: string;
  declare quiz_id: string;
  declare score: number;
  declare completed_at: Date;
}

export default (sequelize: Sequelize) => {
  QuizResult.init(
    {
      result_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quiz_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      score: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "quiz_result",
      timestamps: false,
    }
  );

  return QuizResult;
};
