'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('quizz', {
      quiz_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      lesson_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      question: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      option_a: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      option_b: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      option_c: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      option_d: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      correct_answer: {
        type: Sequelize.STRING(1),
        allowNull: false,
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
    await queryInterface.dropTable('quizz');
  },
};
