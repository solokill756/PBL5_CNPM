"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the classes table is already seeded
    const classCount = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM class",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (classCount[0].count > 0) {
      console.log("Classes table already seeded. Skipping...");
      return;
    }
    await queryInterface.bulkInsert("class", [
      {
        class_id: "1",
        class_name: "Nihongo Class",
        description: "Classddddddddddd...",
        created_by: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        created_at: new Date("2025-04-02T09:00:00"),
      },
      {
        class_id: "2",
        class_name: "Nihongo Class",
        description: "",
        created_by: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        created_at: new Date("2025-04-02T09:05:00"),
      },
      {
        class_id: "3",
        class_name: "Nihongo Class",
        description: "",
        created_by: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        created_at: new Date("2025-04-02T09:10:00"),
      },
      {
        class_id: "4",
        class_name: "Nihongo Class",
        description: "",
        created_by: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        created_at: new Date("2025-04-02T09:15:00"),
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
    await queryInterface.bulkDelete("class", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
