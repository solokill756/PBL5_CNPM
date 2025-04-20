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
        name: "IT基礎語彙",
        description:
          "Từ vựng IT cơ bản",
        created_at: new Date(),
        image_url:
          "https://japanlife-guide.com/wp-content/uploads/2020/02/jlgblog-japanese-it1.jpg",
      },
      {
        topic_id: "it-topic-02",
        name: "ソフトウェア開発",
        description:
          "Phát triển phần mềm",
        image_url:
          "https://th.bing.com/th/id/OIP.J_bMnQppSI-a2gHp6SqkTgHaGE?rs=1&pid=ImgDetMain",
        created_at: new Date(),
      },
      {
        topic_id: "it-topic-03",
        name: "ネットワークとセキュリティ",
        description: "Mạng & bảo mật",
        image_url:
          "https://th.bing.com/th/id/OIP.I1TXvCxrlqBhzwDXlLsKOgHaE8?w=675&h=450&rs=1&pid=ImgDetMain",
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("vocabulary_topic", null, {});
  },
};
