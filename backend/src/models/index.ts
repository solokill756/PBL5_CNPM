import { Sequelize, Dialect } from "sequelize";
import database from "../configs/database.js";
import dotenv from "dotenv";
dotenv.config();
// import mysql from "mysql2/promise";

// (async () => {
//   try {
//     const connection = await mysql.createConnection({
//       host: database.HOST,
//       user: database.USER,
//       password: database.PASSWORD,
//     });

//     await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database.DB}\`;`);
//     console.log(`Database '${database.DB}' đã được tạo hoặc đã tồn tại.`);
//     await connection.end();
//   } catch (error) {
//     console.error("Lỗi khi tạo database:", error);
//   }
// })();
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

db.sequelize.sync({ force: false }).then(() => {
  console.log("Success to sync");
});

export default db;
