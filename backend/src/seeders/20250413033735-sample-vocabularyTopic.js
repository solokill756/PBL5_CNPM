"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if vocabulary_topic table is already seeded
    const topicCount = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM vocabulary_topic",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (topicCount[0].count > 0) {
      console.log("Vocabulary topics table already seeded. Skipping...");
      return;
    }

    // Generate UUIDs for topics
    const topic1Id = await queryInterface.sequelize.query('SELECT UUID() as id', { type: queryInterface.sequelize.QueryTypes.SELECT });
    const topic2Id = await queryInterface.sequelize.query('SELECT UUID() as id', { type: queryInterface.sequelize.QueryTypes.SELECT });
    const topic3Id = await queryInterface.sequelize.query('SELECT UUID() as id', { type: queryInterface.sequelize.QueryTypes.SELECT });
    const topic4Id = await queryInterface.sequelize.query('SELECT UUID() as id', { type: queryInterface.sequelize.QueryTypes.SELECT });

    console.log('Generated topic IDs:', {
      topic1: topic1Id[0].id,
      topic2: topic2Id[0].id,
      topic3: topic3Id[0].id,
      topic4: topic4Id[0].id
    });

    // Insert topics
    await queryInterface.bulkInsert("vocabulary_topic", [
      {
        topic_id: topic1Id[0].id,
        name: "IT基礎語彙",
        description: "Từ vựng IT cơ bản",
        image_url: "https://example.com/it-basic.jpg",
        created_at: new Date()
      },
      {
        topic_id: topic2Id[0].id,
        name: "ソフトウェア開発",
        description: "Phát triển phần mềm",
        image_url: "https://example.com/software-dev.jpg",
        created_at: new Date()
      },
      {
        topic_id: topic3Id[0].id,
        name: "ネットワークとセキュリティ",
        description: "Mạng & bảo mật",
        image_url: "https://example.com/network-security.jpg",
        created_at: new Date()
      },
      {
        topic_id: topic4Id[0].id,
        name: "データベース",
        description: "Cơ sở dữ liệu",
        image_url: "https://example.com/database.jpg",
        created_at: new Date()
      }
    ]);

    // Create temp table to store topic IDs
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS temp_topic_ids (
        topic_name VARCHAR(50) PRIMARY KEY,
        topic_id VARCHAR(36) NOT NULL
      )
    `);

    // Insert topic IDs into temp table
    await queryInterface.sequelize.query(`
      INSERT INTO temp_topic_ids (topic_name, topic_id) VALUES
      ('it-topic-01', '${topic1Id[0].id}'),
      ('it-topic-02', '${topic2Id[0].id}'),
      ('it-topic-03', '${topic3Id[0].id}'),
      ('it-topic-04', '${topic4Id[0].id}')
    `);

    // Verify temp table contents
    const tempTopics = await queryInterface.sequelize.query(
      "SELECT * FROM temp_topic_ids",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    console.log('Temp table contents:', tempTopics);

    console.log("Vocabulary topics seeded successfully!");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query("DROP TABLE IF EXISTS temp_topic_ids");
    await queryInterface.bulkDelete("vocabulary_topic", null, {});
  }
};
