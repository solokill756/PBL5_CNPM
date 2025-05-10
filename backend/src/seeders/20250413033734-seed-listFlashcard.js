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
        number_rate: 0,
        created_at: new Date('2025-04-01T09:00:00')
      },
      {
        list_id: '1a2b3c4d-0000-0000-0000-000000000002',
        user_id: '2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7',
        title: 'ネットワーク用語',
        description: 'Từ vựng về mạng: IP, DNS, LAN, router,...',
        number_rate: 0,
        created_at: new Date('2025-04-02T10:30:00')
      },
      {
        list_id: '1a2b3c4d-0000-0000-0000-000000000003',
        user_id: '2',
        title: 'データベース用語',
        description: 'Từ vựng về cơ sở dữ liệu: SQL, index, transaction,...',
        number_rate: 0,
        created_at: new Date('2025-04-03T11:15:00')
      },
      {
        list_id: '1a2b3c4d-0000-0000-0000-000000000004',
        user_id: '3',
        title: 'セキュリティ用語',
        description: 'Từ vựng về bảo mật: firewall, encryption, VPN,...',
        number_rate: 0,
        created_at: new Date('2025-04-04T12:00:00')
      },
      {
        list_id: '1a2b3c4d-0000-0000-0000-000000000005',
        user_id: '4',
        title: 'クラウドコンピューティング',
        description: 'Từ vựng về điện toán đám mây: AWS, Azure, container,...',
        number_rate: 0,
        created_at: new Date('2025-04-05T13:45:00')
      },
      {
        list_id: '1a2b3c4d-0000-0000-0000-000000000006',
        user_id: '4',
        title: 'プログラミング基礎',
        description: 'Từ vựng về lập trình: variable, loop, function,...',
        number_rate: 0,
        created_at: new Date('2025-04-06T15:20:00')
      },
      {
        list_id: '1a2b3c4d-0000-0000-0000-000000000007',
        user_id: '2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7',
        title: 'テスト技法',
        description: 'Từ vựng về kỹ thuật kiểm thử: unit test, integration test, UAT,...',
        number_rate: 0,
        created_at: new Date('2025-04-07T08:30:00')
      },
      {
        list_id: '1a2b3c4d-0000-0000-0000-000000000008',
        user_id: '2',
        title: 'AI・機械学習',
        description: 'Từ vựng về trí tuệ nhân tạo và học máy: neural network, dataset, model,...',
        number_rate: 0,
        created_at: new Date('2025-04-08T10:00:00')
      },
      {
        list_id: '1a2b3c4d-0000-0000-0000-000000000009',
        user_id: '3',
        title: 'DevOps基礎',
        description: 'Từ vựng về DevOps: CI/CD, pipeline, Docker,...',
        number_rate: 0,
        created_at: new Date('2025-04-09T11:45:00')
      },
      {
        list_id: '1a2b3c4d-0000-0000-0000-000000000010',
        user_id: '4',
        title: 'アジャイル開発',
        description: 'Từ vựng về phát triển linh hoạt: Scrum, Kanban, sprint,...',
        number_rate: 0,
        created_at: new Date('2025-04-10T14:15:00')
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('list_flashcard', null, {});
  }
};