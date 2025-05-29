'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const achievement = await queryInterface.sequelize.query(
      "SELECT * FROM achievement",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    if(achievement.length > 0){
      console.log("achievement table already seeded. Skipping...");
      return;
    }
    const achievements = [
      // 🎯 Theo chủ đề (7)
      {
        achievement_id: uuidv4(),
        title: "IT基礎の探検家",
        description: "Hoàn thành toàn bộ từ vựng chủ đề 'IT cơ bản' (IT基礎語彙)",
        icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
        required_level: 1,
        points_reward: 100,
        created_at: new Date(),
      },
      {
        achievement_id: uuidv4(),
        title: "ソフトウェア開発者入門",
        description: "Nắm vững các từ vựng về phát triển phần mềm (ソフトウェア開発)",
        icon: "https://cdn-icons-png.flaticon.com/512/1087/1087815.png",
        required_level: 2,
        points_reward: 150,
        created_at: new Date(),
      },
      {
        achievement_id: uuidv4(),
        title: "ネットワークとセキュリティ守護者",
        description: "Hoàn thành chủ đề 'Mạng và bảo mật' (ネットワークとセキュリティ)",
        icon: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png",
        required_level: 3,
        points_reward: 120,
        created_at: new Date(),
      },
      {
        achievement_id: uuidv4(),
        title: "データベース熟練者",
        description: "Nắm chắc từ vựng về cơ sở dữ liệu (データベース)",
        icon: "https://cdn-icons-png.flaticon.com/512/3074/3074481.png",
        required_level: 4,
        points_reward: 200,
        created_at: new Date(),
      },
      {
        achievement_id: uuidv4(),
        title: "クラウドの探究者",
        description: "Thành thạo các khái niệm về điện toán đám mây (クラウドコンピューティング)",
        icon: "https://cdn-icons-png.flaticon.com/512/4144/4144337.png",
        required_level: 3,
        points_reward: 130,
        created_at: new Date(),
      },
      {
        achievement_id: uuidv4(),
        title: "人工知能の挑戦者",
        description: "Hoàn thành bộ từ vựng về trí tuệ nhân tạo (人工知能)",
        icon: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png",
        required_level: 4,
        points_reward: 180,
        created_at: new Date(),
      },
      {
        achievement_id: uuidv4(),
        title: "プログラミング基礎マスター",
        description: "Nắm chắc kiến thức lập trình cơ bản (プログラミング基礎)",
        icon: "https://cdn-icons-png.flaticon.com/512/2721/2721294.png",
        required_level: 1,
        points_reward: 90,
        created_at: new Date(),
      },

      // 🧠 Theo Level milestone (7)
      {
        achievement_id: uuidv4(),
        title: "Level 1 _ Khởi đầu hành trình",
        description: "Đạt cấp độ 1 trong hành trình học IT.",
        icon: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
        required_level: 1,
        points_reward: 50,
        created_at: new Date(),
      },
      {
        achievement_id: uuidv4(),
        title: "Level 2 _ Người học nghiêm túc",
        description: "Đạt cấp độ 2 và đã duy trì học đều đặn.",
        icon: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
        required_level: 2,
        points_reward: 70,
        created_at: new Date(),
      },
      {
        achievement_id: uuidv4(),
        title: "Level 3 _ Học viên chuyên ngành",
        description: "Chạm mốc cấp độ 3 – sẵn sàng cho các chủ đề nâng cao.",
        icon: "https://cdn-icons-png.flaticon.com/512/190/190406.png",
        required_level: 3,
        points_reward: 90,
        created_at: new Date(),
      },
      {
        achievement_id: uuidv4(),
        title: "Level 5 _ Người bảo vệ tri thức",
        description: "Đạt cấp độ 5 và hoàn thành nhiều thử thách.",
        icon: "https://cdn-icons-png.flaticon.com/512/1077/1077092.png",
        required_level: 5,
        points_reward: 150,
        created_at: new Date(),
      },
      {
        achievement_id: uuidv4(),
        title: "Level 6 _ Nhà khám phá đám mây",
        description: "Level 6 – đã mở khóa và hoàn thành chủ đề cloud.",
        icon: "https://cdn-icons-png.flaticon.com/512/861/861088.png",
        required_level: 6,
        points_reward: 170,
        created_at: new Date(),
      },
      {
        achievement_id: uuidv4(),
        title: "Level 8 _ Chuyên gia thuật ngữ",
        description: "Đạt đến level 8 – học rộng, hiểu sâu các lĩnh vực IT.",
        icon: "https://cdn-icons-png.flaticon.com/512/1358/1358648.png",
        required_level: 8,
        points_reward: 200,
        created_at: new Date(),
      },
      {
        achievement_id: uuidv4(),
        title: "Level 10 _ IT言葉王者",
        description: "Vượt qua cấp độ 10 và trở thành bậc thầy từ vựng IT tiếng Nhật.",
        icon: "https://cdn-icons-png.flaticon.com/512/3304/3304568.png",
        required_level: 10,
        points_reward: 300,
        created_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('achievement', achievements);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('achievement', null, {});
  }
};
