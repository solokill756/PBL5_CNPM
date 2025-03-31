"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the authentication table is already seeded
    const authCount = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM authentication",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    if (authCount[0].count > 0) {
      console.log("Authentication table already seeded. Skipping...");
      return;
    }
    // Insert authentication data
    await queryInterface.bulkInsert("authentication", [
      {
        auth_id: "423adf86-7c8f-4134-afbf-e233e2387318",
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        email_send: "hosithao1622004@gmail.com",
        verified: true,
        otp_code: "411163",
        otp_expiry: new Date("2025-04-06T15:58:29"),
        created_at: new Date("2025-04-06T15:58:29"),
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
    await queryInterface.bulkDelete("authentication", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
