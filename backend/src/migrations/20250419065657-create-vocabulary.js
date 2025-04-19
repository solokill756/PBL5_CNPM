'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vocabulary', {
      vocab_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      topic_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      word: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      meaning: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      pronunciation: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      example: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      image_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ai_suggested: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vocabulary');
  },
};
