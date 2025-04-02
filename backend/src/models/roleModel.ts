import { Sequelize, DataTypes, Model } from 'sequelize';

class Role extends Model {
 declare role_id: string;
 declare role_name: string;
}

export default (sequelize: Sequelize) => {
  Role.init(
    {
      role_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      role_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: 'roles',
      timestamps: false,
    }
  );

  return Role;
};
