import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface UserAttributes {
  user_id: string;
  username: string;
  email: string;
  password: string;
  bio?: string;
  profile_picture?: string;
  is_verified: boolean;
  full_name: string;
  datetime_joined: Date;
  role: number;
  tokenVersion?: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'user_id' | 'bio' | 'profile_picture' | 'is_verified' | 'datetime_joined' | 'tokenVersion'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public bio?: string;
  public profile_picture?: string;
  public is_verified!: boolean;
  public full_name!: string;
  public datetime_joined!: Date;
  public role!: number;
  public tokenVersion?: number;
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      bio: { type: DataTypes.STRING, allowNull: true },
      profile_picture: { type: DataTypes.STRING, allowNull: true },
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      datetime_joined: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      tokenVersion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
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
