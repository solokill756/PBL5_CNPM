export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
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
        allowNull: false  ,
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
    },
    { timestamps: false }
  );

  return User;
};
