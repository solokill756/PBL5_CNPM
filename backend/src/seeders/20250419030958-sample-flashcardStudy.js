"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const valueCount = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM flashcardStudy",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    if (valueCount[0].count > 0) {
      console.log("Authentication table already seeded. Skipping...");
      return;
    }
    const now = new Date();
    await queryInterface.bulkInsert("flashcardStudy", [
      {
        user_id: "2",
        id: "1",
        list_id: "1a2b3c4d-0000-0000-0000-000000000001",
        last_accessed: now,
        number_word_forget: 3,
      },
      {
        user_id: "3",
        id: "2",
        list_id: "1a2b3c4d-0000-0000-0000-000000000002",
        last_accessed: new Date(now.getTime() - 86400000), // 1 day ago
        number_word_forget: 5,
      },
      {
        user_id: "4",
        id: "3",
        list_id: "1a2b3c4d-0000-0000-0000-000000000001",
        last_accessed: new Date(now.getTime() - 3 * 86400000), // 3 days ago
        number_word_forget: 2,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete("flashcardStudy", null, {});
  },
};
