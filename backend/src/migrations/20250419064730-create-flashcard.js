'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('flashcard', {
      flashcard_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      list_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      vocab_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      custom_note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      review_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      last_review: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      ai_priority: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('flashcard');
  },
};
