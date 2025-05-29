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
    const topic5Id = await queryInterface.sequelize.query('SELECT UUID() as id', { type: queryInterface.sequelize.QueryTypes.SELECT });
    const topic6Id = await queryInterface.sequelize.query('SELECT UUID() as id', { type: queryInterface.sequelize.QueryTypes.SELECT });
    const topic7Id = await queryInterface.sequelize.query('SELECT UUID() as id', { type: queryInterface.sequelize.QueryTypes.SELECT });

    console.log('Generated topic IDs:', {
      topic1: topic1Id[0].id,
      topic2: topic2Id[0].id,
      topic3: topic3Id[0].id,
      topic4: topic4Id[0].id,
      topic5: topic5Id[0].id,
      topic6: topic6Id[0].id,
      topic7: topic7Id[0].id
    });

    // Insert topics with all required fields
    await queryInterface.bulkInsert("vocabulary_topic", [
      {
        topic_id: topic1Id[0].id,
        name: "IT基礎語彙",
        description: "Từ vựng IT cơ bản",
        image_url: "https://example.com/it-basic.jpg",
        created_at: new Date(),
        require_level: 1,
        total_words: 50,
        points: 100
      },
      {
        topic_id: topic2Id[0].id,
        name: "ソフトウェア開発",
        description: "Phát triển phần mềm",
        image_url: "https://example.com/software-dev.jpg",
        created_at: new Date(),
        require_level: 2,
        total_words: 75,
        points: 150
      },
      {
        topic_id: topic3Id[0].id,
        name: "ネットワークとセキュリティ",
        description: "Mạng & bảo mật",
        image_url: "https://example.com/network-security.jpg",
        created_at: new Date(),
        require_level: 3,
        total_words: 60,
        points: 120
      },
      {
        topic_id: topic4Id[0].id,
        name: "データベース",
        description: "Cơ sở dữ liệu",
        image_url: "https://example.com/database.jpg",
        created_at: new Date(),
        require_level: 4,
        total_words: 80,
        points: 200
      },
      {
        topic_id: topic5Id[0].id,
        name: "クラウドコンピューティング",
        description: "Điện toán đám mây",
        image_url: "https://example.com/cloud-computing.jpg",
        created_at: new Date(),
        require_level: 3,
        total_words: 65,
        points: 130
      },
      {
        topic_id: topic6Id[0].id,
        name: "人工知能",
        description: "Trí tuệ nhân tạo",
        image_url: "https://example.com/ai.jpg",
        created_at: new Date(),
        require_level: 4,
        total_words: 70,
        points: 180
      },
      {
        topic_id: topic7Id[0].id,
        name: "プログラミング基礎",
        description: "Kiến thức cơ bản về lập trình",
        image_url: "https://example.com/programming-basics.jpg",
        created_at: new Date(),
        require_level: 1,
        total_words: 45,
        points: 90
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
      ('it-topic-04', '${topic4Id[0].id}'),
      ('it-topic-05', '${topic5Id[0].id}'),
      ('it-topic-06', '${topic6Id[0].id}'),
      ('it-topic-07', '${topic7Id[0].id}')
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