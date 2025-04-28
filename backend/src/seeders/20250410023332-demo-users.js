"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const userCount = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM user",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    if (userCount[0].count > 0) {
      console.log("Users table already seeded. Skipping...");
      return;
    }
    await queryInterface.bulkInsert("user", [
      {
        user_id: "2",
        full_name: "Thanh Huyền",
        email: "thanh.huyen@example.com",
        password: "$2b$10$examplehash1...",
        profile_picture: null,
        datetime_joined: new Date("2025-04-01T08:00:00"),
        username: "thanh_huyen",
        tokenVersion: 0,
      },
      {
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        full_name: "HoSyThao",
        email: "hosithao1622004@gmail.com",
        password:
          "$2b$10$gFzIkh5tdcHpULa82HUDreZGUEc7jzbiIIi7dfWqJdFecf4go4e/S",
        profile_picture: null,
        datetime_joined: new Date("2025-04-06T15:53:07"),
        username: "cuthaoddd",
        tokenVersion: 0,
      },
      {
        user_id: "3",
        full_name: "Minh Anh",
        email: "minh.anh@example.com",
        password: "$2b$10$examplehash2...",
        profile_picture: null,
        datetime_joined: new Date("2025-04-01T08:05:00"),
        username: "minh_anh",
        tokenVersion: 0,
      },
      {
        user_id: "4",
        full_name: "Quốc Bảo",
        email: "quoc.bao@example.com",
        password: "$2b$10$examplehash3...",
        profile_picture: null,
        datetime_joined: new Date("2025-04-01T08:10:00"),
        username: "quoc_bao",
        tokenVersion: 0,
      },
      {
        user_id: "5",
        full_name: "Ngọc Linh",
        email: "ngoc.linh@example.com",
        password: "$2b$10$examplehash4...",
        profile_picture: null,
        datetime_joined: new Date("2025-04-01T08:15:00"),
        username: "ngoc_linh",
        tokenVersion: 0,
      },
      {
        user_id: "6",
        full_name: "Hoàng Nam",
        email: "hoang.nam@example.com",
        password: "$2b$10$examplehash5...",
        profile_picture: null,
        datetime_joined: new Date("2025-04-01T08:20:00"),
        username: "hoang_nam",
        tokenVersion: 0,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
