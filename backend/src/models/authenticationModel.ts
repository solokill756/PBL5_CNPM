import { Sequelize, DataTypes, Model } from 'sequelize';

class Authentication extends Model {
  declare auth_id: string;
  declare user_id: string;
  declare provider: string;
  declare verified: boolean;
  declare otp_code?: string;
  declare created_at: Date;
  declare otp_expiry : Date;
  
}

export default (sequelize: Sequelize) => {
  Authentication.init(
    {
      auth_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      provider: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      otp_code: {
        type: DataTypes.STRING(6),
        allowNull: true,
      },
      otp_expiry: {
        type : DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'authentication',
      timestamps: false,
    }
  );

  return Authentication;
};
