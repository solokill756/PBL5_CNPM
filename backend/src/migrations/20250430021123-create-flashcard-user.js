'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('flashcard_user', {
      flashcard_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
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
      like_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
    await queryInterface.addIndex('flashcard_user', ['flashcard_id', 'user_id'], {
      unique: true,
      name: 'flashcard_user_unique_index',
    });
  },


  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('flashcard_user');
  },
};