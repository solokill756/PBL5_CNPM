"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("class_member", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      last_accessed: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      class_id: {
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
      joined_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      reminder_status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    });
    
      await queryInterface.addIndex("class_member", ["class_id", "user_id"], {
        name: "idx_class_member",
        unique: true,
      });
    await queryInterface.addIndex("class_member", ["reminder_status"], {
      name: "idx_reminder_status",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("class_member");
    await queryInterface.removeIndex("class_member", ["class_id", "user_id"]);
    await queryInterface.removeIndex("class_member", ["reminder_status"]);
  
  },
};
