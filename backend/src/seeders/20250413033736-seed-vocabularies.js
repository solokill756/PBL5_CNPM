"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the vocabularies table is already seeded
    const vocabularyCount = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM vocabulary",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    if (vocabularyCount[0].count > 0) {
      console.log("Vocabularies table already seeded. Skipping...");
      return;
    }
    // Insert vocabulary data
    await queryInterface.bulkInsert("vocabulary", [
      {
        vocab_id: "vocab-it-001",
        topic_id: "it-topic-02",
        word: "要件定義",
        meaning: "Định nghĩa yêu cầu",
        pronunciation: "ようけんていぎ",
        example: "要件定義は開発の最初のステップです。",

        image_url: "https://example.com/images/yoken_teigi.jpg",
        ai_suggested: false,
        created_at: new Date("2025-04-01T10:00:00"),
      },
      {
        vocab_id: "vocab-it-002",
        topic_id: "it-topic-02",
        word: "単体テスト",
        meaning: "Kiểm thử đơn vị (Unit test)",
        pronunciation: "たんたいてすと",
        example: "単体テストを行って、バグを早期に発見します。",

        image_url: "https://example.com/images/unit_test.jpg",
        ai_suggested: true,
        created_at: new Date("2025-04-01T10:05:00"),
      },
      {
        vocab_id: "vocab-it-003",
        topic_id: "it-topic-02",
        word: "設計書",
        meaning: "Tài liệu thiết kế",
        pronunciation: "せっけいしょ",
        example: "設計書に従ってプログラムを作成します。",

        image_url: "https://example.com/images/design_doc.jpg",
        ai_suggested: false,
        created_at: new Date("2025-04-01T10:10:00"),
      },
      {
        vocab_id: "vocab-it-004",
        topic_id: "it-topic-02",
        word: "保守",
        meaning: "Bảo trì",
        pronunciation: "ほしゅ",
        example: "リリース後も保守作業が必要です。",
        image_url: "https://example.com/images/maintenance.jpg",
        ai_suggested: false,
        created_at: new Date("2025-04-01T10:15:00"),
      },
      {
        vocab_id: "vocab-it-005",
        topic_id: "it-topic-02",
        word: "互換性",
        meaning: "Tính tương thích",
        pronunciation: "ごかんせい",
        example: "このアプリは古いOSとも互換性があります。",
        image_url: "https://example.com/images/compatibility.jpg",
        ai_suggested: true,
        created_at: new Date("2025-04-01T10:20:00"),
      },
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
    await queryInterface.bulkDelete("vocabulary", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
