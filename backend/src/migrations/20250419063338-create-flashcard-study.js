'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('flashcardStudy', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      last_accessed: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      list_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'user_id'
        },
        onDelete: 'CASCADE'
      },
      number_word_forget: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });

    await queryInterface.addIndex('flashcardStudy', ['list_id', 'user_id'], {
      unique: true,
      name: 'flashcardStudy_list_id_user_id_unique',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('flashcardStudy');
  },
};
