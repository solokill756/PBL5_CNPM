// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.createTable('flashcard', {
//       flashcard_id: {
//         type: Sequelize.UUID,
//         defaultValue: Sequelize.UUIDV4,
//         primaryKey: true,
//       },
//       list_id: {
//         type: Sequelize.UUID,
//         allowNull: false,
//       },
//       front_text: {
//         type: Sequelize.TEXT,
//         allowNull: false,
//       },
//       back_text: {
//         type: Sequelize.TEXT,
//         allowNull: false,
//       },
//       custom_note: {
//         type: Sequelize.TEXT,
//         allowNull: true,
//       },
        
//     });
//     await queryInterface.addIndex('flashcard', ['list_id']);
//     await queryInterface.addColumn('flashcard', 'ai_explanation', {
//       type: Sequelize.TEXT,
//       allowNull: true,
//     });

//   },
//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.dropTable('flashcard');
//     await queryInterface.removeColumn('flashcard', 'ai_explanation');
//     await queryInterface.removeIndex('flashcard', ['list_id']);
//   },
// };
