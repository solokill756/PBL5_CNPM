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
        image_url:
          "https://www.bing.com/images/search?view=detailV2&ccid=0X7Pj6Ty&id=7444FEBBFECD2C282FB00553ADB3E7D59F3F4E32&thid=OIP.0X7Pj6TyeEC1Jdj9n2QyXQHaEz&mediaurl=https%3a%2f%2fjapanlife-guide.com%2fwp-content%2fuploads%2f2020%2f02%2fjlgblog-japanese-it1.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.d17ecf8fa4f27840b525d8fd9f64325d%3frik%3dMk4%252fn9Xns61TBQ%26pid%3dImgRaw%26r%3d0&exph=491&expw=756&q=d%e1%bb%af+li%e1%bb%87u+v%e1%bb%81+c%c3%a1ch+chuy%e1%bb%83n+%c4%91%e1%bb%81+v%e1%bb%81+it+ti%e1%ba%bfng+nh%e1%ba%adt&simid=608040526906681399&FORM=IRPRST&ck=3B1A8B31F8D69DA7270E537B5DF8D69F&selectedIndex=3&itb=0",
      },
      {
        topic_id: "it-topic-02",
        name: "ソフトウェア開発 (Phát triển phần mềm)",
        description:
          "Từ vựng liên quan đến quy trình và công cụ phát triển phần mềm.",
        image_url:
          "https://www.bing.com/images/search?view=detailV2&ccid=0X7Pj6Ty&id=7444FEBBFECD2C282FB00553ADB3E7D59F3F4E32&thid=OIP.0X7Pj6TyeEC1Jdj9n2QyXQHaEz&mediaurl=https%3a%2f%2fjapanlife-guide.com%2fwp-content%2fuploads%2f2020%2f02%2fjlgblog-japanese-it1.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.d17ecf8fa4f27840b525d8fd9f64325d%3frik%3dMk4%252fn9Xns61TBQ%26pid%3dImgRaw%26r%3d0&exph=491&expw=756&q=d%e1%bb%af+li%e1%bb%87u+v%e1%bb%81+c%c3%a1ch+chuy%e1%bb%83n+%c4%91%e1%bb%81+v%e1%bb%81+it+ti%e1%ba%bfng+nh%e1%ba%adt&simid=608040526906681399&FORM=IRPRST&ck=3B1A8B31F8D69DA7270E537B5DF8D69F&selectedIndex=3&itb=0",
        created_at: new Date(),
      },
      {
        topic_id: "it-topic-03",
        name: "ネットワークとセキュリティ (Mạng & bảo mật)",
        description: "Từ vựng chuyên ngành về mạng máy tính và bảo mật.",
        image_url:
          "https://www.bing.com/images/search?view=detailV2&ccid=0X7Pj6Ty&id=7444FEBBFECD2C282FB00553ADB3E7D59F3F4E32&thid=OIP.0X7Pj6TyeEC1Jdj9n2QyXQHaEz&mediaurl=https%3a%2f%2fjapanlife-guide.com%2fwp-content%2fuploads%2f2020%2f02%2fjlgblog-japanese-it1.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.d17ecf8fa4f27840b525d8fd9f64325d%3frik%3dMk4%252fn9Xns61TBQ%26pid%3dImgRaw%26r%3d0&exph=491&expw=756&q=d%e1%bb%af+li%e1%bb%87u+v%e1%bb%81+c%c3%a1ch+chuy%e1%bb%83n+%c4%91%e1%bb%81+v%e1%bb%81+it+ti%e1%ba%bfng+nh%e1%ba%adt&simid=608040526906681399&FORM=IRPRST&ck=3B1A8B31F8D69DA7270E537B5DF8D69F&selectedIndex=3&itb=0",
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("vocabulary_topic", null, {});
  },
};
