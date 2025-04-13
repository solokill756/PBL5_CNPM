"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the class_members table is already seeded
    const classMemberCount = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM class_members",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (classMemberCount[0].count > 0) {
      console.log("Class members table already seeded. Skipping...");
      return;
    }
    // Insert class members data
    await queryInterface.bulkInsert("class_members", [
      {
        id: "1",
        class_id: "1",
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        joined_at: new Date("2025-04-03T10:00:00"),
        last_accessed: new Date("2025-04-09T10:00:00"),
      },
      {
        id: "2",
        class_id: "1",
        user_id: "2",
        joined_at: new Date("2025-04-03T10:05:00"),
        last_accessed: new Date("2025-04-09T09:55:00"),
      },
      {
        id: "3",
        class_id: "1",
        user_id: "3",
        joined_at: new Date("2025-04-03T10:10:00"),
        last_accessed: new Date("2025-04-09T09:50:00"),
      },
      {
        id: "4",
        class_id: "1",
        user_id: "4",
        joined_at: new Date("2025-04-03T10:15:00"),
        last_accessed: new Date("2025-04-09T09:45:00"),
      },
      {
        id: "5",
        class_id: "1",
        user_id: "5",
        joined_at: new Date("2025-04-03T10:20:00"),
        last_accessed: new Date("2025-04-09T09:40:00"),
      },
      {
        id: "6",
        class_id: "2",
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        joined_at: new Date("2025-04-03T10:25:00"),
        last_accessed: new Date("2025-04-09T09:35:00"),
      },
      {
        id: "7",
        class_id: "2",
        user_id: "2",
        joined_at: new Date("2025-04-03T10:30:00"),
        last_accessed: new Date("2025-04-09T09:30:00"),
      },
      {
        id: "8",
        class_id: "2",
        user_id: "3",
        joined_at: new Date("2025-04-03T10:35:00"),
        last_accessed: new Date("2025-04-09T09:25:00"),
      },
      {
        id: "9",
        class_id: "2",
        user_id: "4",
        joined_at: new Date("2025-04-03T10:40:00"),
        last_accessed: new Date("2025-04-09T09:20:00"),
      },
      {
        id: "10",
        class_id: "2",
        user_id: "5",
        joined_at: new Date("2025-04-03T10:45:00"),
        last_accessed: new Date("2025-04-09T09:15:00"),
      },
      {
        id: "11",
        class_id: "3",
        user_id: "2",
        joined_at: new Date("2025-04-03T10:55:00"),
        last_accessed: new Date("2025-04-09T09:05:00"),
      },
      {
        id: "12",
        class_id: "3",
        user_id: "3",
        joined_at: new Date("2025-04-03T11:00:00"),
        last_accessed: new Date("2025-04-09T09:00:00"),
      },
      {
        id: "13",
        class_id: "3",
        user_id: "4",
        joined_at: new Date("2025-04-03T11:05:00"),
        last_accessed: new Date("2025-04-09T08:55:00"),
      },
      {
        id: "14",
        class_id: "3",
        user_id: "5",
        joined_at: new Date("2025-04-03T11:10:00"),
        last_accessed: new Date("2025-04-09T08:50:00"),
      },
      {
        id: "15",
        class_id: "4",
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        joined_at: new Date("2025-04-03T11:15:00"),
        last_accessed: new Date("2025-04-09T08:45:00"),
      },
      {
        id: "16",
        class_id: "4",
        user_id: "2",
        joined_at: new Date("2025-04-03T11:20:00"),
        last_accessed: new Date("2025-04-09T08:40:00"),
      },
      {
        id: "17",
        class_id: "4",
        user_id: "3",
        joined_at: new Date("2025-04-03T11:25:00"),
        last_accessed: new Date("2025-04-09T08:35:00"),
      },
      {
        id: "18",
        class_id: "4",
        user_id: "4",
        joined_at: new Date("2025-04-03T11:30:00"),
        last_accessed: new Date("2025-04-09T08:30:00"),
      },
      {
        id: "19",
        class_id: "4",
        user_id: "5",
        joined_at: new Date("2025-04-03T11:35:00"),
        last_accessed: new Date("2025-04-09T08:25:00"),
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
    await queryInterface.bulkDelete("class_members", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
