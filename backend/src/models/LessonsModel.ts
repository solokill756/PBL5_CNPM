import { Sequelize, DataTypes, Model } from 'sequelize';

interface LessonAttributes {
  lesson_id: string;
  class_id: string;
  title: string;
  content?: string;
  video_url?: string;
  ai_difficulty_level: 'easy' | 'medium' | 'hard';
  created_at: Date;
}

interface LessonCreationAttributes extends Partial<Pick<LessonAttributes, 'lesson_id' | 'content' | 'video_url' | 'created_at'>> {}

class Lesson extends Model<LessonAttributes, LessonCreationAttributes> implements LessonAttributes {
  declare lesson_id: string;
  declare class_id: string;
  declare title: string;
  declare content?: string;
  declare video_url?: string;
  declare ai_difficulty_level: 'easy' | 'medium' | 'hard';
  declare created_at: Date;
}

export default (sequelize: Sequelize) => {
  Lesson.init(
    {
      lesson_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      class_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      video_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ai_difficulty_level: {
        type: DataTypes.ENUM('easy', 'medium', 'hard'),
        allowNull: false,
        defaultValue: 'medium',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'lessons',
      timestamps: false,
    }
  );

  return Lesson;
};