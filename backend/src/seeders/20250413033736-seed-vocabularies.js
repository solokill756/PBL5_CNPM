"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const vocabularyCount = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM vocabulary",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (vocabularyCount[0].count > 0) {
      console.log("Vocabularies table already seeded. Skipping...");
      return;
    }

    // Get topic IDs from temp table
    const topicIds = await queryInterface.sequelize.query(
      "SELECT topic_name, topic_id FROM temp_topic_ids",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    console.log('Retrieved topic IDs:', topicIds);

    const topicMap = {};
    topicIds.forEach(topic => {
      topicMap[topic.topic_name] = topic.topic_id;
    });

    console.log('Topic mapping:', topicMap);

    // Verify topics exist in vocabulary_topic table
    const existingTopics = await queryInterface.sequelize.query(
      "SELECT topic_id FROM vocabulary_topic",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    console.log('Existing topics in vocabulary_topic:', existingTopics);

    const vocabularies = [
      // it-topic-01: IT cơ bản (20 terms)
      {
        word: "プログラミング",
        meaning: "Lập trình",
        pronunciation: "ぷろぐらみんぐ",
        example: "プログラミングを学び始めたばかりです。||プログラミングでゲームを作りました。||プログラミングコンテストに参加しました。",
        usage: "Dùng để chỉ việc viết mã lệnh để tạo phần mềm hoặc ứng dụng, thường trong các ngôn ngữ như Python, Java.",
        example_meaning: "Tôi vừa bắt đầu học lập trình.||Tôi đã tạo một trò chơi bằng lập trình.||Tham gia cuộc thi lập trình.",
        ai_suggested: false,
        created_at: new Date("2025-04-01T10:00:00"),
        language: "ja",
        topic_id: topicMap['it-topic-01']
      }
    ];

    // Generate UUIDs for all vocabularies
    for (let vocab of vocabularies) {
      const result = await queryInterface.sequelize.query('SELECT UUID() as id', { type: queryInterface.sequelize.QueryTypes.SELECT });
      vocab.vocab_id = result[0].id;
    }

    // Log first vocabulary entry for debugging
    console.log('First vocabulary entry:', vocabularies[0]);

    try {
      await queryInterface.bulkInsert("vocabulary", vocabularies);
      console.log("Vocabularies seeded successfully!");
    } catch (error) {
      console.error('Error seeding vocabularies:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("vocabulary", null, {});
  }
};
