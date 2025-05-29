import { Sequelize, Dialect } from "sequelize";
import database from "../config/database.js"; // Giữ import như cũ vì cấu hình này đang ở file .js
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(database.DB, database.USER, database.PASSWORD, {
  port: database.port,
  host: database.HOST,
  
  dialect: database.dialect as Dialect,
  pool: {
    max: database.pool.max,
    min: database.pool.min,
    acquire: database.pool.acquire,
    idle: database.pool.idle,
  },
  dialectOptions: {
    ssl: {
      require: true,            
      
    }
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected successfully");
  })
  .catch((err: Error) => {
    console.log("Connection error:", err);
  });

const db: { [key: string]: any } = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import các model
const initializeModels = async () => {
  const { default: UserModel } = await import("./userModel.js");
  const { default: RoleModel } = await import("./roleModel.js");
  const { default: UserRoleModel } = await import("./userRoleModel.js");
  const { default: AuthenticationModel } = await import(
    "./authenticationModel.js"
  );
  const { default: ClassModel } = await import("./classModel.js");
  const { default: ClassMemberModel } = await import("./ClassMemberModel.js");
  const { default: LessonModel } = await import("./LessonModel.js");
  const { default: VocabularyModel } = await import("./VocabularyModel.js");
  const { default: SearchHistoryModel } = await import(
    "./SearchHistoryModel.js"
  );
  const { default: FlashcardModel } = await import("./FlashcardModel.js");
  const { default: QuizResultModel } = await import("./QuizResultstModel.js");
  const { default: NotificationModel } = await import("./NotificationModel.js");
  const { default: ForumPostModel } = await import("./ForumPostModel.js");
  const { default: ForumCommentModel } = await import("./ForumCommentModel.js");
  const { default: ForumLikeModel } = await import("./ForumLikeModel.js");
  const { default: ForumReportModel } = await import("./ForumReportModel.js");
  const { default: ListFlashcard } = await import("./ListFlashCardModel.js");
  const { default: FlashcardStudy } = await import("./FlashcardStudyModel.js");
  const { default: VocabularyTopic } = await import(
    "./VocabularyTopicModel.js"
  );
  const { default: FlashcardUser } = await import("./FlashcardUserModel.js");
  const { default: ListFlashCardClass } = await import("./ListFlashCardClass.js");
  const { default: VocabularyTopicUser } = await import("./vocabularyTopicUserModel.js");
  const { default: VocabularyUser } = await import("./vocabularyUserModel.js");
  const { default: Achievement } = await import("./achievementModel.js");
  const { default: UserAchievement } = await import("./userAchievementModel.js"); 
  // Khởi tạo các model
  db.vocabularyTopic = VocabularyTopic(sequelize);
  db.user = UserModel(sequelize);
  db.role = RoleModel(sequelize);
  db.userRole = UserRoleModel(sequelize);
  db.authentication = AuthenticationModel(sequelize);
  db.class = ClassModel(sequelize);
  db.classMember = ClassMemberModel(sequelize);
  db.lesson = LessonModel(sequelize);
  db.vocabulary = VocabularyModel(sequelize);
  db.searchHistory = SearchHistoryModel(sequelize);
  db.flashcard = FlashcardModel(sequelize);
   
  db.quizResult = QuizResultModel(sequelize);
  db.notification = NotificationModel(sequelize);
  db.forumPost = ForumPostModel(sequelize);
  db.forumComment = ForumCommentModel(sequelize);
  db.forumLike = ForumLikeModel(sequelize);
  db.forumReport = ForumReportModel(sequelize);
  db.listFlashcard = ListFlashcard(sequelize);
  db.flashcardStudy = FlashcardStudy(sequelize);
  db.flashcardUser = FlashcardUser(sequelize);
  db.listFlashCardClass = ListFlashCardClass(sequelize);
  db.vocabularyTopicUser = VocabularyTopicUser(sequelize);
  db.vocabularyUser = VocabularyUser(sequelize);
  db.achievement = Achievement(sequelize);
  db.userAchievement = UserAchievement(sequelize);
  // Xét quan hệ giữa các bảng
  db.user.belongsToMany(db.role, {
    through: db.userRole,
    foreignKey: "user_id",
  });
  db.role.belongsToMany(db.user, {
    through: db.userRole,
    foreignKey: "role_id",
  });
  db.flashcard.hasMany(db.flashcardUser, { foreignKey: "flashcard_id", onDelete: 'CASCADE' });
  db.flashcardUser.belongsTo(db.flashcard, { foreignKey: "flashcard_id" });
  db.user.hasMany(db.flashcardUser, { foreignKey: "user_id", onDelete: 'CASCADE' });
  db.flashcardUser.belongsTo(db.user, { foreignKey: "user_id" });
  db.user.hasMany(db.authentication, { foreignKey: "user_id", onDelete: 'CASCADE' });
  db.authentication.belongsTo(db.user, { foreignKey: "user_id" });
  db.user.hasMany(db.class, { foreignKey: "created_by", onDelete: 'CASCADE' });
  db.class.belongsTo(db.user, { foreignKey: "created_by" });

  db.class.hasMany(db.classMember, { foreignKey: "class_id", onDelete: 'CASCADE' });
  db.classMember.belongsTo(db.class, { foreignKey: "class_id" });

  db.user.hasMany(db.classMember, { foreignKey: "user_id", onDelete: 'CASCADE' });
  db.classMember.belongsTo(db.user, { foreignKey: "user_id" });

  db.class.hasMany(db.lesson, { foreignKey: "class_id", onDelete: 'CASCADE' });
  db.lesson.belongsTo(db.class, { foreignKey: "class_id" });


  db.user.hasMany(db.quizResult, { foreignKey: "user_id", onDelete: 'CASCADE' });
  db.quizResult.belongsTo(db.user, { foreignKey: "user_id" });



  db.user.hasMany(db.notification, { foreignKey: "user_id", onDelete: 'CASCADE' });
  db.notification.belongsTo(db.user, { foreignKey: "user_id" });

  db.user.hasMany(db.forumPost, { foreignKey: "user_id", onDelete: 'CASCADE' });
  db.forumPost.belongsTo(db.user, { foreignKey: "user_id" });

  db.forumPost.hasMany(db.forumComment, { foreignKey: "post_id", onDelete: 'CASCADE' });
  db.forumComment.belongsTo(db.forumPost, { foreignKey: "post_id" });

  db.user.hasMany(db.forumComment, { foreignKey: "user_id", onDelete: 'CASCADE' });
  db.forumComment.belongsTo(db.user, { foreignKey: "user_id" });

  db.user.hasMany(db.forumLike, { foreignKey: "user_id", onDelete: 'CASCADE' });
  db.forumLike.belongsTo(db.user, { foreignKey: "user_id" });

  db.forumPost.hasMany(db.forumLike, { foreignKey: "post_id", onDelete: 'CASCADE' });
  db.forumLike.belongsTo(db.forumPost, { foreignKey: "post_id" });

  db.forumComment.hasMany(db.forumLike, { foreignKey: "comment_id", onDelete: 'CASCADE' });
  db.forumLike.belongsTo(db.forumComment, { foreignKey: "comment_id" });

  db.user.hasMany(db.forumReport, { foreignKey: "reported_by", onDelete: 'CASCADE' });
  db.forumReport.belongsTo(db.user, { foreignKey: "reported_by" });

  db.forumPost.hasMany(db.forumReport, { foreignKey: "post_id", onDelete: 'CASCADE' });
  db.forumReport.belongsTo(db.forumPost, { foreignKey: "post_id" });

  db.forumComment.hasMany(db.forumReport, { foreignKey: "comment_id", onDelete: 'CASCADE' });
  db.forumReport.belongsTo(db.forumComment, { foreignKey: "comment_id" });

  db.user.hasMany(db.searchHistory, { foreignKey: "user_id", onDelete: 'CASCADE' });
  db.searchHistory.belongsTo(db.user, { foreignKey: "user_id" });

  db.vocabulary.hasMany(db.searchHistory, { foreignKey: "vocab_id", onDelete: 'CASCADE' });
  db.searchHistory.belongsTo(db.vocabulary, { foreignKey: "vocab_id" });

  db.listFlashcard.hasMany(db.flashcard, {
    foreignKey: "list_id",
    as: "Flashcard",
    onDelete: 'CASCADE'
  });
  db.flashcard.belongsTo(db.listFlashcard, {
    foreignKey: "list_id",
  });
  db.user.hasMany(db.listFlashcard, {
    foreignKey: "user_id",
    onDelete: 'CASCADE'
  });
  db.listFlashcard.belongsTo(db.user, {
    foreignKey: "user_id",
  });
  db.listFlashcard.hasMany(db.flashcardStudy, { foreignKey: "list_id", onDelete: 'CASCADE' });
  db.flashcardStudy.belongsTo(db.listFlashcard, { foreignKey: "list_id" });

  db.user.hasMany(db.flashcardStudy, { foreignKey: "user_id", onDelete: 'CASCADE' });
  db.flashcardStudy.belongsTo(db.user, { foreignKey: "user_id" });
  db.vocabulary.belongsTo(db.vocabularyTopic, {
    foreignKey: "topic_id",
    as: "Topic",
  });
  db.vocabularyTopic.hasMany(db.vocabulary, {
    foreignKey: "topic_id",
    onDelete: 'CASCADE'
  });
  db.listFlashcard.hasMany(db.listFlashCardClass, { foreignKey: "list_id", onDelete: 'CASCADE' });
  db.listFlashCardClass.belongsTo(db.listFlashcard, { foreignKey: "list_id" });
  db.class.hasMany(db.listFlashCardClass, { foreignKey: "class_id", onDelete: 'CASCADE' });
  db.listFlashCardClass.belongsTo(db.class, { foreignKey: "class_id" });
  db.user.hasMany(db.vocabularyTopicUser, { foreignKey: "user_id", onDelete: 'CASCADE' });
  db.vocabularyTopicUser.belongsTo(db.user, { foreignKey: "user_id" });
  db.vocabularyTopic.hasMany(db.vocabularyTopicUser, { foreignKey: "topic_id", onDelete: 'CASCADE' });
  db.vocabularyTopicUser.belongsTo(db.vocabularyTopic, { foreignKey: "topic_id" });
  db.user.hasMany(db.vocabularyUser, { foreignKey: "user_id", onDelete: 'CASCADE' });
  db.vocabularyUser.belongsTo(db.user, { foreignKey: "user_id" });
  db.vocabulary.hasMany(db.vocabularyUser, { foreignKey: "vocabulary_id", onDelete: 'CASCADE' });
  db.vocabularyUser.belongsTo(db.vocabulary, { foreignKey: "vocabulary_id" });
  db.user.hasMany(db.userAchievement, { foreignKey: "user_id", onDelete: 'CASCADE' });
  db.userAchievement.belongsTo(db.user, { foreignKey: "user_id" });
  db.achievement.hasMany(db.userAchievement, { foreignKey: "achievement_id", onDelete: 'CASCADE' });
  db.userAchievement.belongsTo(db.achievement, { foreignKey: "achievement_id" });
  // Đồng bộ database
  db.sequelize
    .sync({ force: false})
    .then(() => {
      console.log("Database synced successfully");
    })
    .catch((err: Error) => {
      console.error("Error syncing database:", err);
    });
};

initializeModels();

export default db;
