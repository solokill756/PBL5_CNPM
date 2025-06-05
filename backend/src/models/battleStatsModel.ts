import { Model, Optional, DataTypes, Sequelize } from "sequelize";

interface BattleStatsAttributes {
  id: string;
  user_id: string;
  games_played: number;
  games_won: number;
  total_battle_points: number;
  win_rate: number;
  created_at?: Date;
  updated_at?: Date;
}

interface BattleStatsCreationAttributes
  extends Optional<
    BattleStatsAttributes,
    "id" | "win_rate" | "created_at" | "updated_at"
  > {}

class BattleStats
  extends Model<BattleStatsAttributes, BattleStatsCreationAttributes>
  implements BattleStats
{
  declare id: string;
  declare user_id: string;
  declare games_played: number;
  declare games_won: number;
  declare total_battle_points: number;
  declare win_rate: number;
  declare created_at: Date;
  declare updated_at: Date;
}

export default (sequelize: Sequelize) => {
  BattleStats.init(
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
      games_played: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      games_won: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_battle_points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      win_rate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "battle_stats",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["user_id"],
        },
      ],
    }
  );
  return BattleStats;
};
