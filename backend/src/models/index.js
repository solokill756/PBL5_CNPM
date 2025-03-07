import { Sequelize, DataTypes } from "sequelize";
import database from "../configs/database.js";

const sequelize = new Sequelize(database.DB, database.USER, database.PASSWORD, {
  port: database.port,
  host: database.HOST,
  dialect: database.dialect,
  pool: {
    max: database.pool.max,
    min: database.pool.min,
    acquire: database.pool.acquire,
    idle: database.pool.idle,
    charset: "utf9mb4",
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// import model
const { default: userModel } = await import("./userModel.js");
db.users = userModel(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("Success to sync");
});

export default db;
