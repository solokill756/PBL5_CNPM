import { Sequelize, DataTypes, Model } from 'sequelize';

interface SearchHistoryAttributes {
  history_id: string;
  user_id: string;
  vocab_id: string;
  searched_at: Date;
}

interface SearchHistoryCreationAttributes extends Partial<Pick<SearchHistoryAttributes, 'history_id' | 'searched_at'>> {}

class SearchHistory extends Model<SearchHistoryAttributes, SearchHistoryCreationAttributes> implements SearchHistoryAttributes {
  declare history_id: string;
  declare user_id: string;
  declare vocab_id: string;
  declare searched_at: Date;
}

export default (sequelize: Sequelize) => {
  SearchHistory.init(
    {
      history_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      vocab_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      searched_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'search_history',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["history_id" , "user_id"]
        } 
      ]
    }
  );

  return SearchHistory;
};  