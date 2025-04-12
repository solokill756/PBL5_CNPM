import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface UserAttributes {
  user_id: string;
  full_name: string;
  email: string;
  password: string;
  profile_picture?: string;
  datetime_joined: Date;
  username: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'user_id' | 'profile_picture' | 'datetime_joined'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare user_id: string;
  declare full_name: string;
  declare email: string;
  declare password: string;
  declare profile_picture?: string;
  declare datetime_joined: Date;
  declare username: string;
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      full_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      profile_picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      datetime_joined: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: false,
      },
      
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: false,
    }
  );

  return User;
};
