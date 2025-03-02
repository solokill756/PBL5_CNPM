import mysql from "mysql2/promise";
import dotenv from "dotenv";
// test conetion
dotenv.config();
// const connection = await mysql.createConnection({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: "root",
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
// });

// const connection = await mysql.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: "root",
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   waitForConnections: true,
//   connectionLimit: 99,
//   queueLimit: 0,
// });

// export default connection;

export default {
  HOST: process.env.HOST,
  USER: "root",
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  dialect: "mysql",
  port: process.env.DB_PORT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
