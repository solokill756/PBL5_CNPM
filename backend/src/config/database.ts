
import dotenv from "dotenv";
dotenv.config();
// const connection = await mysql.createConnection({
//   host: process.env.DB_HOST as string,
//   port: parseInt(process.env.DB_PORT as string, 10),
//   user: "root",
//   database: process.env.DB_NAME as string,
//   password: process.env.DB_PASSWORD as string,
// });

// const connection = await mysql.createPool({
//   host: process.env.DB_HOST as string,
//   port: parseInt(process.env.DB_PORT as string, 10),
//   user: "root",
//   database: process.env.DB_NAME as string,
//   password: process.env.DB_PASSWORD as string,
//   waitForConnections: true,
//   connectionLimit: 99,
//   queueLimit: 0,
// });

// export default connection;
console.log("process.env.DB_NAME : " + process.env.DB_HOST);
export default {
  HOST: process.env.DB_HOST as string,
  USER: process.env.DB_USER as string,
  PASSWORD: process.env.DB_PASSWORD as string,
  DB: process.env.DB_NAME as string,
  dialect: "mysql",
  port: parseInt(process.env.DB_PORT as string, 10),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  
};
