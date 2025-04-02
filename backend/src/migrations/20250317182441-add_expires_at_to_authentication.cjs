"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     *
     */

    // await queryInterface.addColumn("authentication", "otp_expiry", {
    //   type: Sequelize.DATE,
    //   allowNull: true,
    // });
    await queryInterface.changeColumn("authentication", "provider", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("authentication", "otp_expiry");
  },
};
