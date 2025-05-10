'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Kiểm tra xem bảng flashcard_user đã có dữ liệu hay chưa
    const likeCount = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM flashcard_user',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (parseInt(likeCount[0].count) > 0) {
          console.log('Flashcard_user table already seeded. Skipping...');
      return;
    }

    // Lấy danh sách flashcard_id từ bảng flashcard
    const flashcards = await queryInterface.sequelize.query(
      'SELECT flashcard_id FROM flashcard WHERE list_id = :listId',
      {
        replacements: { listId: '1a2b3c4d-0000-0000-0000-000000000001' },
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    if (flashcards.length === 0) {
      console.log('No flashcards found. Skipping flashcard_user seeding...');
      return;
    }

    // Giả định hai người dùng
    const users = [
      '2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7',
    ];

    const now = new Date();
    const flashcardUsers = [];

    // Tạo dữ liệu mẫu: mỗi người dùng "like" ngẫu nhiên 10-15 flashcard
    users.forEach((user_id) => {
      // Chọn ngẫu nhiên 10-15 flashcard để like
      const numLikes = Math.floor(Math.random() * 6) + 10; // 10 đến 15
      const selectedFlashcards = flashcards
        .sort(() => 0.5 - Math.random()) // Xáo trộn ngẫu nhiên
        .slice(0, numLikes); // Lấy số lượng flashcard cần

      selectedFlashcards.forEach((flashcard, idx) => {
        flashcardUsers.push({
          flashcard_id: flashcard.flashcard_id,
          user_id: user_id,
          created_at: new Date(now.getTime() - idx * 3600000), 
          review_count: 0,
          last_review: new Date(),
        });
      });
    });

    // Thêm dữ liệu vào bảng flashcard_user
    await queryInterface.bulkInsert('flashcard_user', flashcardUsers, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('flashcard_like', null, {});
  },
};