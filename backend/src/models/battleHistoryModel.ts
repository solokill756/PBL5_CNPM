import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface BattleHistoryAttributes {
  id: string;
  user_id: string;
  opponent_id: string;
  points_earned: number;
  is_winner: boolean;
  topic?: string | null;
  questions_answered: number;
  correct_answers: number;
  battle_duration?: number | null;
  created_at?: Date;
}

interface BattleHistoryCreationAttributes
  extends Optional<BattleHistoryAttributes, "id" | "created_at"> {}

class BattleHistory
  extends Model<BattleHistoryAttributes, BattleHistoryCreationAttributes>
  implements BattleHistoryAttributes
{
  declare id: string;
  declare user_id: string;
  declare opponent_id: string;
  declare points_earned: number;
  declare is_winner: boolean;
  declare topic: string | null;
  declare questions_answered: number;
  declare correct_answers: number;
  declare battle_duration: number | null;
  declare created_at: Date;
}

export default (sequelize: Sequelize) => {
  BattleHistory.init(
    {
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      opponent_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      points_earned: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_winner: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      topic: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      questions_answered: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      correct_answers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      battle_duration: {
        type: DataTypes.INTEGER,
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
      tableName: "battle_history",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["user_id", "opponent_id"],
        },
      ],
    }
  );
  return BattleHistory;
};
