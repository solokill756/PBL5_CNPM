"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if vocabulary_topic_user table is already seeded
    const userTopicCount = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM vocabulary_topic_user",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (userTopicCount[0].count > 0) {
      console.log("Vocabulary topic user table already seeded. Skipping...");
      return;
    }

    // Sample user IDs (you can replace with actual user IDs from your users table)
    const userIds = [
      '2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7',
      '5fd50a0b-6314-4d5e-ac68-3850eec3d405',
      '5209ae31-60d4-4cc3-8062-541aa1e89963'
    ];

    // Sample topic IDs from previous vocabulary_topic seed
    const topicIds = [
      '925abf41-3c3d-11f0-b6d1-002248bb7bd1', // IT基礎語彙
      '9285571c-3c3d-11f0-b6d1-002248bb7bd1', // ソフトウェア開発
      '92ad4598-3c3d-11f0-b6d1-002248bb7bd1', // データベース
      
    ];

    // Generate sample data for vocabulary_topic_user
    const sampleData = [
      {
        user_id: userIds[0],
        topic_id: topicIds[0],
        mastered_words: 20
      },
      {
        user_id: userIds[0],
        topic_id: topicIds[1],
        mastered_words: 30
      },
      {
        user_id: userIds[1],
        topic_id: topicIds[0],
        mastered_words: 15
      },
      {
        user_id: userIds[1],
        topic_id: topicIds[2],
        mastered_words: 25
      },
      {
        user_id: userIds[2],
        topic_id: topicIds[1],
        mastered_words: 40
      },
    
    ];

    // Insert sample data
    await queryInterface.bulkInsert("vocabulary_topic_user", sampleData);

    console.log("Vocabulary topic user seeded successfully!");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("vocabulary_topic_user", null, {});
  }
};