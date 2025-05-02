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

    await queryInterface.bulkInsert('search_history', [
      {
        history_id: 'hist-0001',
        user_id: '2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7',
        vocab_id: 'vocab-it-001',
        searched_at: new Date('2025-04-20T08:00:00'),
      },
      {
        history_id: 'hist-0002',
        user_id: '2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7',
        vocab_id: 'vocab-it-002',
        searched_at: new Date('2025-04-20T09:15:00'),
      },
      {
        history_id: 'hist-0003',
        user_id: '2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7',
        vocab_id: 'vocab-it-003',
        searched_at: new Date('2025-04-21T10:30:00'),
      },
      {
        history_id: 'hist-0004',
        user_id: '2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7',
        vocab_id: 'vocab-it-004',
        searched_at: new Date('2025-04-22T11:45:00'),
      },
      {
        history_id: 'hist-0005',
        user_id: '2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7',
        vocab_id: 'vocab-it-005',
        searched_at: new Date('2025-04-23T13:00:00'),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('search_history', null, {});
  }
};
