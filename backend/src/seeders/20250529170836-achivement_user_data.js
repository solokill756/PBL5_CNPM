'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const achievementUser = await queryInterface.sequelize.query(
      "SELECT * FROM user_achievement ",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    if(achievementUser.length > 0){
      console.log("achievement_user table already seeded. Skipping...");
      return;
    }
    const achievementUserData = [ 
      {
        user_achievement_id: uuidv4(),
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        achievement_id: "eafdee91-ba90-4c62-932d-46504671b5df",
        date_earned: new Date(),
      },
      {
        user_achievement_id: uuidv4(),
        user_id: "2e05b974-f0d3-4bb2-9625-bb8bc9c0c5c7",
        achievement_id: "211e9e74-bbcd-449c-84b5-a5ef9b56740f",
        date_earned: new Date(),
      },
      
    ];
    await queryInterface.bulkInsert('user_achievement', achievementUserData);
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_achievement', null, {});
  }
};
