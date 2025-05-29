import { Sequelize, DataTypes, Model } from "sequelize";

interface VocabularyUserAttributes {
  user_id: string;
  vocabulary_id: string;
  is_saved: boolean;
  had_learned: boolean;
}

class VocabularyUser extends Model<VocabularyUserAttributes> implements VocabularyUserAttributes {
  declare user_id: string;
  declare vocabulary_id: string;
  declare is_saved: boolean;
  declare had_learned: boolean;
}   

export default (sequelize: Sequelize) => {
  VocabularyUser.init({
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    vocabulary_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    is_saved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    had_learned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    tableName: 'vocabulary_user',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'vocabulary_id']
      }
    ],
  });
  return VocabularyUser;
};
