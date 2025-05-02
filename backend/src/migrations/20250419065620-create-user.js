'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user', {
      user_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      full_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      profile_picture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      datetime_joined: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      username: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      tokenVersion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      
      reminder_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      
    });
    await queryInterface.addColumn('user', 'reminder_status', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
   
    await queryInterface.addIndex('user', ['reminder_time'], {
      name: 'idx_reminder_time',
    });

  },
  

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user');
    await queryInterface.removeIndex('user', 'idx_reminder_time');
    await queryInterface.removeColumn('user', 'reminder_status');
   
  },
};
