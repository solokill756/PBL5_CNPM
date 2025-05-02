'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const listCount = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM list_flashcard",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    if (listCount[0].count > 0) {
      console.log("list_flashcard đã có dữ liệu. Bỏ qua seed.");
      return;
    }

    await queryInterface.bulkInsert('list_flashcard', [
      {
        list_id: '1a2b3c4d-0000-0000-0000-000000000001',
        user_id: '2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7',
        title: 'インフラ基礎用語',
        description: 'Từ vựng cơ bản về hạ tầng IT: server, OS, command,...',
        created_at: new Date('2025-04-01T09:00:00')
      },
      {
        list_id: '1a2b3c4d-0000-0000-0000-000000000002',
        user_id: '2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7',
        title: 'ネットワーク用語',
        description: 'Từ vựng về mạng: IP, DNS, LAN, router,...',
        created_at: new Date('2025-04-02T10:30:00')
      },
      {
        list_id: '1a2b3c4d-0000-0000-0000-000000000003',
        user_id: '2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7',
        title: 'データベース用語',
        description: 'Từ vựng về cơ sở dữ liệu: SQL, index, transaction,...',
        created_at: new Date('2025-04-03T11:15:00')
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('list_flashcard', null, {});
  }
};
