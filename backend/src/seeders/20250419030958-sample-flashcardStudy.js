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
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        id: "1",
        list_id: "1a2b3c4d-0000-0000-0000-000000000001",
        last_accessed: now,
        number_word_forget: 3,
        rate: 0,
      },
      {
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        id: "2",
        list_id: "1a2b3c4d-0000-0000-0000-000000000002",
        last_accessed: new Date(now.getTime() - 86400000), // 1 day ago
        number_word_forget: 5,
        rate: 0,
      },
      {
        user_id: "4",
        id: "3",
        list_id: "1a2b3c4d-0000-0000-0000-000000000001",
        last_accessed: new Date(now.getTime() - 3 * 86400000), // 3 days ago
        number_word_forget: 2,
        rate: 0,
      },
      {
        user_id: "2",
        id: "4",
        list_id: "1a2b3c4d-0000-0000-0000-000000000003",
        last_accessed: new Date(now.getTime() - 4 * 86400000), // 4 days ago
        number_word_forget: 1,
        rate: 1,
      },
      {
        user_id: "3",
        id: "5",
        list_id: "1a2b3c4d-0000-0000-0000-000000000004",
        last_accessed: new Date(now.getTime() - 5 * 86400000), // 5 days ago
        number_word_forget: 4,
        rate: 0,
      },
      {
        user_id: "4",
        id: "6",
        list_id: "1a2b3c4d-0000-0000-0000-000000000005",
        last_accessed: new Date(now.getTime() - 6 * 86400000), // 6 days ago
        number_word_forget: 0,
        rate: 2,
      },
      {
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        id: "7",
        list_id: "1a2b3c4d-0000-0000-0000-000000000006",
        last_accessed: new Date(now.getTime() - 7 * 86400000), // 7 days ago
        number_word_forget: 3,
        rate: 0,
      },
      {
        user_id: "2",
        id: "8",
        list_id: "1a2b3c4d-0000-0000-0000-000000000007",
        last_accessed: new Date(now.getTime() - 8 * 86400000), // 8 days ago
        number_word_forget: 2,
        rate: 1,
      },
      {
        user_id: "3",
        id: "9",
        list_id: "1a2b3c4d-0000-0000-0000-000000000008",
        last_accessed: new Date(now.getTime() - 9 * 86400000), // 9 days ago
        number_word_forget: 6,
        rate: 0,
      },
      {
        user_id: "4",
        id: "10",
        list_id: "1a2b3c4d-0000-0000-0000-000000000009",
        last_accessed: new Date(now.getTime() - 10 * 86400000), // 10 days ago
        number_word_forget: 1,
        rate: 0,
      },
      {
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        id: "11",
        list_id: "1a2b3c4d-0000-0000-0000-000000000010",
        last_accessed: new Date(now.getTime() - 11 * 86400000), // 11 days ago
        number_word_forget: 4,
        rate: 1,
      },
      {
        user_id: "2",
        id: "12",
        list_id: "1a2b3c4d-0000-0000-0000-000000000001",
        last_accessed: new Date(now.getTime() - 12 * 86400000), // 12 days ago
        number_word_forget: 0,
        rate: 0,
      },
      {
        user_id: "3",
        id: "13",
        list_id: "1a2b3c4d-0000-0000-0000-000000000002",
        last_accessed: new Date(now.getTime() - 13 * 86400000), // 13 days ago
        number_word_forget: 3,
        rate: 2,
      },
      {
        user_id: "4",
        id: "14",
        list_id: "1a2b3c4d-0000-0000-0000-000000000003",
        last_accessed: new Date(now.getTime() - 14 * 86400000), // 14 days ago
        number_word_forget: 2,
        rate: 0,
      },
      {
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        id: "15",
        list_id: "1a2b3c4d-0000-0000-0000-000000000004",
        last_accessed: new Date(now.getTime() - 15 * 86400000), // 15 days ago
        number_word_forget: 5,
        rate: 1,
      },
      {
        user_id: "2",
        id: "16",
        list_id: "1a2b3c4d-0000-0000-0000-000000000005",
        last_accessed: new Date(now.getTime() - 16 * 86400000), // 16 days ago
        number_word_forget: 1,
        rate: 0,
      },
      {
        user_id: "3",
        id: "17",
        list_id: "1a2b3c4d-0000-0000-0000-000000000006",
        last_accessed: new Date(now.getTime() - 17 * 86400000), // 17 days ago
        number_word_forget: 4,
        rate: 0,
      },
      {
        user_id: "4",
        id: "18",
        list_id: "1a2b3c4d-0000-0000-0000-000000000007",
        last_accessed: new Date(now.getTime() - 18 * 86400000), // 18 days ago
        number_word_forget: 0,
        rate: 1,
      },
      
      {
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        id: "19",
        list_id: "1a2b3c4d-0000-0000-0000-000000000008",
        last_accessed: new Date(now.getTime() - 19 * 86400000), // 19 days ago
        number_word_forget: 3,
        rate: 0,
      },
      {
        user_id: "2",
        id: "20",
        list_id: "1a2b3c4d-0000-0000-0000-000000000009",
        last_accessed: new Date(now.getTime() - 20 * 86400000), // 20 days ago
        number_word_forget: 2,
        rate: 0,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete("flashcardStudy", null, {});
  },
};