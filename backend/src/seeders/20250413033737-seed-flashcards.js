"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the authentication table is already seeded
    const authCount = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM flashcard",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    if (authCount[0].count > 0) {
      console.log("Authentication table already seeded. Skipping...");
      return;
    }
    const now = new Date();
    // Insert authentication data
    await queryInterface.bulkInsert("flashcard", [
      {
        flashcard_id: "fc-001",
        vocab_id: "vocab-it-001",
        list_id: "1a2b3c4d-0000-0000-0000-000000000001",
        custom_note: "Ghi chú riêng 1",
        review_count: 5,
        last_review: new Date("2025-04-01T10:00:00"),
        ai_priority: 1,
      },
      {
        flashcard_id: "fc-002",
        vocab_id: "vocab-it-002",
        list_id: "1a2b3c4d-0000-0000-0000-000000000001",
        custom_note: "Ghi chú riêng 2",
        review_count: 2,
        last_review: new Date("2025-04-03T08:30:00"),
        ai_priority: 0,
      },
      {
        flashcard_id: "fc-003",
        vocab_id: "vocab-it-003",
        list_id: "1a2b3c4d-0000-0000-0000-000000000001",
        custom_note: "Đây là ví dụ cho người dùng 2",
        review_count: 1,
        last_review: new Date("2025-04-05T12:00:00"),
        ai_priority: 1,
      },
      {
        flashcard_id: "fc-004",
        vocab_id: "vocab-it-004",
        list_id: "1a2b3c4d-0000-0000-0000-000000000002",
        custom_note: null,
        review_count: 0,
        last_review: new Date("2025-04-06T14:00:00"),
        ai_priority: 0,
      },
      {
        flashcard_id: "fc-005",
        vocab_id: "vocab-it-005",
        list_id: "1a2b3c4d-0000-0000-0000-000000000002",
        custom_note: "Câu ví dụ: The cat is on the roof.",
        review_count: 3,
        last_review: new Date("2025-04-07T16:45:00"),
        ai_priority: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("flashcard", null, {});
  },
};
