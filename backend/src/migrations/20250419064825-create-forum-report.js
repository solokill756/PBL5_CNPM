'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('forum_report', {
      report_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      reported_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'user_id'
        },
        onDelete: 'CASCADE'
      },
      post_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      comment_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "reviewed", "resolved"),
        allowNull: false,
        defaultValue: "pending",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('forum_report');
  },
};
