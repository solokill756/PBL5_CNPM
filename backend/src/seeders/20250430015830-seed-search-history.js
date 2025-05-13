'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const historyCount = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM search_history",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    if (historyCount[0].count > 0) {
      console.log("search_history đã có dữ liệu. Bỏ qua seed.");
      return;
    }

    // Get existing vocabulary IDs
    const vocabularies = await queryInterface.sequelize.query(
      "SELECT vocab_id FROM vocabulary",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (vocabularies.length === 0) {
      console.log("No vocabularies found. Skipping search history seeding.");
      return;
    }

    console.log('Found vocabularies:', vocabularies);

    // Generate UUIDs for history entries
    const historyIds = await Promise.all(
      Array(5).fill().map(() => 
        queryInterface.sequelize.query('SELECT UUID() as id', { type: queryInterface.sequelize.QueryTypes.SELECT })
      )
    );

    const searchHistory = [
      {
        history_id: historyIds[0][0].id,
        user_id: '2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7',
        vocab_id: vocabularies[0].vocab_id,
        searched_at: new Date('2025-04-20T08:00:00'),
      },
      {
        history_id: historyIds[1][0].id,
        user_id: '2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7',
        vocab_id: vocabularies[1].vocab_id,
        searched_at: new Date('2025-04-20T09:15:00'),
      },
      {
        history_id: historyIds[2][0].id,
        user_id: '2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7',
        vocab_id: vocabularies[2].vocab_id,
        searched_at: new Date('2025-04-21T10:30:00'),
      },
      {
        history_id: historyIds[3][0].id,
        user_id: '2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7',
        vocab_id: vocabularies[3].vocab_id,
        searched_at: new Date('2025-04-22T11:45:00'),
      },
      {
        history_id: historyIds[4][0].id,
        user_id: '2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7',
        vocab_id: vocabularies[4].vocab_id,
        searched_at: new Date('2025-04-23T13:00:00'),
      },
    ];

    try {
      await queryInterface.bulkInsert('search_history', searchHistory);
      console.log("Search history seeded successfully!");
    } catch (error) {
      console.error('Error seeding search history:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('search_history', null, {});
  }
};
