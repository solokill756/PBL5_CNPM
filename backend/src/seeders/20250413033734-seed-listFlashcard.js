"use strict";

const { DATE } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const authCount = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM list_flashcard",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    if (authCount[0].count > 0) {
      console.log("Authentication table already seeded. Skipping...");
      return;
    }
    await queryInterface.bulkInsert("list_flashcard", [
      {
        list_id: "1a2b3c4d-0000-0000-0000-000000000001",
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        title: "IT用語 - 基本編",
        description: "Từ vựng IT tiếng Nhật - Phần cơ bản",
        created_at: new Date("2025-04-01T09:00:00"),
      },
      {
        list_id: "1a2b3c4d-0000-0000-0000-000000000002",
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        title: "IT用語 - 上級編",
        description: "Từ vựng IT tiếng Nhật - Phần nâng cao",
        created_at: new Date("2025-04-01T10:00:00"),
      },
      {
        list_id: "1a2b3c4d-0000-0000-0000-000000000003",
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        title: "プログラミング言語",
        description: "Ngôn ngữ lập trình",
        created_at: new Date("2025-04-01T11:00:00"),
      },
      {
        list_id: "1a2b3c4d-0000-0000-0000-000000000004",
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        title: "データベース",
        description: "Cơ sở dữ liệu",
        created_at: new Date("2025-04-01T12:00:00"),
      },
      {
        list_id: "1a2b3c4d-0000-0000-0000-000000000005",
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        title: "フロントエンド開発",
        description: "Phát triển Frontend",
        created_at: new Date("2025-04-01T13:00:00"),
      },
      {
        list_id: "1a2b3c4d-0000-0000-0000-000000000006",
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        title: "バックエンド開発",
        description: "Phát triển Backend",
        created_at: new Date("2025-04-01T14:00:00"),
      },
      {
        list_id: "1a2b3c4d-0000-0000-0000-000000000007",
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        title: "クラウドコンピューティング",
        description: "Điện toán đám mây",
        created_at: new Date("2025-04-01T15:00:00"),
      },
      {
        list_id: "1a2b3c4d-0000-0000-0000-000000000008",
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        title: "セキュリティ",
        description: "Bảo mật",
        created_at: new Date("2025-04-01T16:00:00"),
      },
      {
        list_id: "1a2b3c4d-0000-0000-0000-000000000009",
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        title: "デバッグ",
        description: "Gỡ lỗi",
        created_at: new Date("2025-04-01T17:00:00"),
      },
      {
        list_id: "1a2b3c4d-0000-0000-0000-000000000010",
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        title: "テスト",
        description: "Kiểm thử",
        created_at: new Date("2025-04-01T18:00:00"),
      }
    ]);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("list_flashcard", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
