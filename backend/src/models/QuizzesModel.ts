import { Sequelize, DataTypes, Model } from 'sequelize';

interface QuizAttributes {
  quiz_id: string;
  lesson_id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  ai_suggested: boolean;
  created_at: Date;
}

interface QuizCreationAttributes extends Partial<Pick<QuizAttributes, 'quiz_id' | 'created_at'>> {}

class Quiz extends Model<QuizAttributes, QuizCreationAttributes> implements QuizAttributes {
  declare quiz_id: string;
  declare lesson_id: string;
  declare question: string;
  declare option_a: string;
  declare option_b: string;
  declare option_c: string;
  declare option_d: string;
  declare correct_answer: string;
  declare ai_suggested: boolean;
  declare created_at: Date;
}

export default (sequelize: Sequelize) => {
  Quiz.init(
    {
      quiz_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      lesson_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      option_a: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      option_b: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      option_c: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      option_d: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      correct_answer: {
        type: DataTypes.STRING(1),
        allowNull: false,
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
      tableName: 'quizzes',
      timestamps: false,
    }
  );

  return Quiz;
};