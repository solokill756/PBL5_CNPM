"use strict";

const { DATE } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const authCount = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM list_flashcard",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    if (authCount[0].count > 0) {
      console.log("Authentication table already seeded. Skipping...");
      return;
    }
    await queryInterface.bulkInsert("list_flashcard", [
      {
        list_id: "1a2b3c4d-0000-0000-0000-000000000001",
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        title: "IT用語 - 基本編",
        description: "Từ vựng IT tiếng Nhật - Phần cơ bản",
        created_at: new Date("2025-04-01T09:00:00"),
        
      },
      {
        list_id: "1a2b3c4d-0000-0000-0000-000000000002",
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        title: "IT用語 - 上級編",
        description: "Từ vựng IT tiếng Nhật - Phần nâng cao",
        created_at: new Date("2025-04-01T10:00:00"),
       
      },
    ]);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("list_flashcard", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
