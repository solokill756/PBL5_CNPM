import { Sequelize, Dialect } from "sequelize";
import database from "../config/database.js";
import dotenv from "dotenv";
import roleModel from "./roleModel.js";
import userRoleModel from "./userRoleModel.js";
import authenticationModel from "./authenticationModel.js";
dotenv.config();

const sequelize = new Sequelize(database.DB, database.USER, database.PASSWORD, {
  port: database.port,
  host: database.HOST,
  dialect: database.dialect as Dialect,
  pool: {
    max: database.pool.max,
    min: database.pool.min,
    acquire: database.pool.acquire,
    idle: database.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected successfully");
  })
  .catch((err: Error) => {
    console.log(err);
  });

const db: { [key: string]: any } = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// import model
const { default: userModel } = await import("./userModel.js");
db.users = userModel(sequelize);
db.roles = roleModel(sequelize);
db.userRoles = userRoleModel(sequelize);
db.authentication = authenticationModel(sequelize);

// Xét quan hệ giữa các bảng
db.users.belongsToMany(db.roles, { through: db.userRoles, foreignKey: "user_id" });
db.roles.belongsToMany(db.users, { through: db.userRoles, foreignKey: "role_id" });
db.users.hasOne(db.authentication , { foreignKey: "user_id" });
db.authentication.belongsTo(db.users , { foreignKey: "user_id" });
db.sequelize.sync({ force: false }).then(() => {
  console.log("Success to sync");
});

export default db;
