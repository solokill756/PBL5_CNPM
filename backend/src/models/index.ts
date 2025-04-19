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
  const { default: QuizModel } = await import("./QuizzModel.js");
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
  db.quizz = QuizModel(sequelize);
  db.quizResult = QuizResultModel(sequelize);
  db.notification = NotificationModel(sequelize);
  db.forumPost = ForumPostModel(sequelize);
  db.forumComment = ForumCommentModel(sequelize);
  db.forumLike = ForumLikeModel(sequelize);
  db.forumReport = ForumReportModel(sequelize);
  db.listFlashcard = ListFlashcard(sequelize);
  db.flashcardStudy = FlashcardStudy(sequelize);

  // Xét quan hệ giữa các bảng
  db.user.belongsToMany(db.role, {
    through: db.userRole,
    foreignKey: "user_id",
  });
  db.role.belongsToMany(db.user, {
    through: db.userRole,
    foreignKey: "role_id",
  });

  db.user.hasMany(db.authentication, { foreignKey: "user_id" });
  db.authentication.belongsTo(db.user, { foreignKey: "user_id" });
  db.user.hasMany(db.class, { foreignKey: "created_by" });
  db.class.belongsTo(db.user, { foreignKey: "created_by" });

  db.class.hasMany(db.classMember, { foreignKey: "class_id" });
  db.classMember.belongsTo(db.class, { foreignKey: "class_id" });

  db.user.hasMany(db.classMember, { foreignKey: "user_id" });
  db.classMember.belongsTo(db.user, { foreignKey: "user_id" });

  db.class.hasMany(db.lesson, { foreignKey: "class_id" });
  db.lesson.belongsTo(db.class, { foreignKey: "class_id" });

  db.vocabulary.hasMany(db.flashcard, { foreignKey: "vocab_id" });
  db.flashcard.belongsTo(db.vocabulary, { foreignKey: "vocab_id" });

  db.lesson.hasMany(db.quizz, { foreignKey: "lesson_id" });
  db.quizz.belongsTo(db.lesson, { foreignKey: "lesson_id" });

  db.user.hasMany(db.quizResult, { foreignKey: "user_id" });
  db.quizResult.belongsTo(db.user, { foreignKey: "user_id" });

  db.quizz.hasMany(db.quizResult, { foreignKey: "quiz_id" });
  db.quizResult.belongsTo(db.quizz, { foreignKey: "quiz_id" });

  db.user.hasMany(db.notification, { foreignKey: "user_id" });
  db.notification.belongsTo(db.user, { foreignKey: "user_id" });

  db.user.hasMany(db.forumPost, { foreignKey: "user_id" });
  db.forumPost.belongsTo(db.user, { foreignKey: "user_id" });

  db.forumPost.hasMany(db.forumComment, { foreignKey: "post_id" });
  db.forumComment.belongsTo(db.forumPost, { foreignKey: "post_id" });

  db.user.hasMany(db.forumComment, { foreignKey: "user_id" });
  db.forumComment.belongsTo(db.user, { foreignKey: "user_id" });

  db.user.hasMany(db.forumLike, { foreignKey: "user_id" });
  db.forumLike.belongsTo(db.user, { foreignKey: "user_id" });

  db.forumPost.hasMany(db.forumLike, { foreignKey: "post_id" });
  db.forumLike.belongsTo(db.forumPost, { foreignKey: "post_id" });

  db.forumComment.hasMany(db.forumLike, { foreignKey: "comment_id" });
  db.forumLike.belongsTo(db.forumComment, { foreignKey: "comment_id" });

  db.user.hasMany(db.forumReport, { foreignKey: "reported_by" });
  db.forumReport.belongsTo(db.user, { foreignKey: "reported_by" });

  db.forumPost.hasMany(db.forumReport, { foreignKey: "post_id" });
  db.forumReport.belongsTo(db.forumPost, { foreignKey: "post_id" });

  db.forumComment.hasMany(db.forumReport, { foreignKey: "comment_id" });
  db.forumReport.belongsTo(db.forumComment, { foreignKey: "comment_id" });

  db.user.hasMany(db.searchHistory, { foreignKey: "user_id" });
  db.searchHistory.belongsTo(db.user, { foreignKey: "user_id" });

  db.vocabulary.hasMany(db.searchHistory, { foreignKey: "vocab_id" });
  db.searchHistory.belongsTo(db.vocabulary, { foreignKey: "vocab_id" });

  db.listFlashcard.hasMany(db.flashcard, {
    foreignKey: "list_id",
    as: "Flashcard",
  });
  db.flashcard.belongsTo(db.listFlashcard, {
    foreignKey: "list_id",
  });
  db.user.hasMany(db.listFlashcard, {
    foreignKey: "user_id",
  });
  db.listFlashcard.belongsTo(db.user, {
    foreignKey: "user_id",
  });
  db.listFlashcard.hasMany(db.flashcardStudy, { foreignKey: "list_id" });
  db.flashcardStudy.belongsTo(db.listFlashcard, { foreignKey: "list_id" });

  db.user.hasMany(db.flashcardStudy, { foreignKey: "user_id" });
  db.flashcardStudy.belongsTo(db.user, { foreignKey: "user_id" });
  db.vocabulary.belongsTo(db.vocabularyTopic, {
    foreignKey: "topic_id",
    as: "Topic",
  });
  db.vocabularyTopic.hasMany(db.vocabulary, {
    foreignKey: "topic_id",
  });

  // Đồng bộ database
  db.sequelize
    .sync({ force: false })
    .then(() => {
      console.log("Database synced successfully");
    })
    .catch((err: Error) => {
      console.error("Error syncing database:", err);
    });
};

initializeModels();

export default db;
