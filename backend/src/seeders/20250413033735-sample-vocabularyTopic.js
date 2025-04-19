"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const valueCount = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM vocabulary_topic",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    if (valueCount[0].count > 0) {
      console.log("Authentication table already seeded. Skipping...");
      return;
    }
    await queryInterface.bulkInsert("vocabulary_topic", [
      {
        topic_id: "it-topic-01",
        name: "IT基礎語彙 (Từ vựng IT cơ bản)",
        description:
          "Từ vựng liên quan đến kiến thức cơ bản trong công nghệ thông tin.",
        created_at: new Date(),
      },
      {
        topic_id: "it-topic-02",
        name: "ソフトウェア開発 (Phát triển phần mềm)",
        description:
          "Từ vựng liên quan đến quy trình và công cụ phát triển phần mềm.",
        created_at: new Date(),
      },
      {
        topic_id: "it-topic-03",
        name: "ネットワークとセキュリティ (Mạng & bảo mật)",
        description: "Từ vựng chuyên ngành về mạng máy tính và bảo mật.",
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("vocabulary_topic", null, {});
  },
};
