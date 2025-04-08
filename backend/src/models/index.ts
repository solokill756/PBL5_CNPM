import { Sequelize, Dialect } from "sequelize";
import database from "../config/database.js";
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
const { default: UserModel } = await import("./userModel.js");
const { default: RoleModel } = await import("./roleModel.js");
const { default: UserRoleModel } = await import("./userRoleModel.js");
const { default: AuthenticationModel } = await import("./authenticationModel.js");
const { default: ClassModel } = await import("./classModel.js");
const { default: ClassMemberModel } = await import("./ClassMemberModel.js");
const { default: LessonModel } = await import("./LessonsModel.js");
const { default: VocabularyModel } = await import("./VocabulariesModel.js");
const { default: SearchHistoryModel } = await import("./SearchHistoryModel.js");
const { default: FlashcardModel } = await import("./FlashcardsModel.js");
const { default: QuizModel } = await import("./QuizzesModel.js");
const { default: QuizResultModel } = await import("./QuizResultstModel.js");
const { default: NotificationModel } = await import("./NotificationsModel.js");
const { default: ForumPostModel } = await import("./ForumPostsModel.js");
const { default: ForumCommentModel } = await import("./ForumCommentsModel.js");
const { default: ForumLikeModel } = await import("./ForumLikesModel.js");
const { default: ForumReportModel } = await import("./ForumReportsModel.js");

// Khởi tạo các model
db.users = UserModel(sequelize);
db.roles = RoleModel(sequelize);
db.userRoles = UserRoleModel(sequelize);
db.authentication = AuthenticationModel(sequelize);
db.classes = ClassModel(sequelize);
db.classMembers = ClassMemberModel(sequelize); 
db.lessons = LessonModel(sequelize); 
db.vocabularies = VocabularyModel(sequelize);
db.searchHistory = SearchHistoryModel(sequelize);
db.flashcards = FlashcardModel(sequelize);
db.quizzes = QuizModel(sequelize); 
db.quizResults = QuizResultModel(sequelize);
db.notifications = NotificationModel(sequelize); 
db.forumPosts = ForumPostModel(sequelize); 
db.forumComments = ForumCommentModel(sequelize); 
db.forumLikes = ForumLikeModel(sequelize); 
db.forumReports = ForumReportModel(sequelize); 

// Xét quan hệ giữa các bảng
// 1. User - Role (Many-to-Many qua UserRoles)
db.users.belongsToMany(db.roles, { through: db.userRoles, foreignKey: "user_id" });
db.roles.belongsToMany(db.users, { through: db.userRoles, foreignKey: "role_id" });

// 2. User - Authentication (One-to-Many)
db.users.hasMany(db.authentication, { foreignKey: "user_id" });
db.authentication.belongsTo(db.users, { foreignKey: "user_id" });

// 3. User - Classes (One-to-Many)
db.users.hasMany(db.classes, { foreignKey: "created_by" });
db.classes.belongsTo(db.users, { foreignKey: "created_by" });

// 4. Class - ClassMembers (One-to-Many)
db.classes.hasMany(db.classMembers, { foreignKey: "class_id" });
db.classMembers.belongsTo(db.classes, { foreignKey: "class_id" });

// 5. User - ClassMembers (One-to-Many)
db.users.hasMany(db.classMembers, { foreignKey: "user_id" });
db.classMembers.belongsTo(db.users, { foreignKey: "user_id" });

// 6. Class - Lessons (One-to-Many)
db.classes.hasMany(db.lessons, { foreignKey: "class_id" });
db.lessons.belongsTo(db.classes, { foreignKey: "class_id" });

// 7. User - Flashcards (One-to-Many)
db.users.hasMany(db.flashcards, { foreignKey: "user_id" });
db.flashcards.belongsTo(db.users, { foreignKey: "user_id" });

// 8. Vocabulary - Flashcards (One-to-Many)
db.vocabularies.hasMany(db.flashcards, { foreignKey: "vocab_id" });
db.flashcards.belongsTo(db.vocabularies, { foreignKey: "vocab_id" });

// 9. Lesson - Quizzes (One-to-Many)
db.lessons.hasMany(db.quizzes, { foreignKey: "lesson_id" });
db.quizzes.belongsTo(db.lessons, { foreignKey: "lesson_id" });

// 10. User - QuizResults (One-to-Many)
db.users.hasMany(db.quizResults, { foreignKey: "user_id" });
db.quizResults.belongsTo(db.users, { foreignKey: "user_id" });

// 11. Quiz - QuizResults (One-to-Many)
db.quizzes.hasMany(db.quizResults, { foreignKey: "quiz_id" });
db.quizResults.belongsTo(db.quizzes, { foreignKey: "quiz_id" });

// 12. User - Notifications (One-to-Many)
db.users.hasMany(db.notifications, { foreignKey: "user_id" });
db.notifications.belongsTo(db.users, { foreignKey: "user_id" });

// 13. User - ForumPosts (One-to-Many)
db.users.hasMany(db.forumPosts, { foreignKey: "user_id" });
db.forumPosts.belongsTo(db.users, { foreignKey: "user_id" });

// 14. ForumPost - ForumComments (One-to-Many)
db.forumPosts.hasMany(db.forumComments, { foreignKey: "post_id" });
db.forumComments.belongsTo(db.forumPosts, { foreignKey: "post_id" });

// 15. User - ForumComments (One-to-Many)
db.users.hasMany(db.forumComments, { foreignKey: "user_id" });
db.forumComments.belongsTo(db.users, { foreignKey: "user_id" });

// 16. User - ForumLikes (One-to-Many)
db.users.hasMany(db.forumLikes, { foreignKey: "user_id" });
db.forumLikes.belongsTo(db.users, { foreignKey: "user_id" });

// 17. ForumPost - ForumLikes (One-to-Many)
db.forumPosts.hasMany(db.forumLikes, { foreignKey: "post_id" });
db.forumLikes.belongsTo(db.forumPosts, { foreignKey: "post_id" });

// 18. ForumComment - ForumLikes (One-to-Many)
db.forumComments.hasMany(db.forumLikes, { foreignKey: "comment_id" });
db.forumLikes.belongsTo(db.forumComments, { foreignKey: "comment_id" });

// 19. User - ForumReports (One-to-Many)
db.users.hasMany(db.forumReports, { foreignKey: "reported_by" });
db.forumReports.belongsTo(db.users, { foreignKey: "reported_by" });

// 20. ForumPost - ForumReports (One-to-Many)
db.forumPosts.hasMany(db.forumReports, { foreignKey: "post_id" });
db.forumReports.belongsTo(db.forumPosts, { foreignKey: "post_id" });

// 21. ForumComment - ForumReports (One-to-Many)
db.forumComments.hasMany(db.forumReports, { foreignKey: "comment_id" });
db.forumReports.belongsTo(db.forumComments, { foreignKey: "comment_id" });

// 22. User - SearchHistory (One-to-Many)
db.users.hasMany(db.searchHistory, { foreignKey: "user_id" });
db.searchHistory.belongsTo(db.users, { foreignKey: "user_id" });

// 23. Vocabulary - SearchHistory (One-to-Many)
db.vocabularies.hasMany(db.searchHistory, { foreignKey: "vocab_id" });
db.searchHistory.belongsTo(db.vocabularies, { foreignKey: "vocab_id" });

// Đồng bộ database
db.sequelize.sync({ force: false }).then(() => {
  console.log("Database synced successfully");
}).catch((err: Error) => {
  console.error("Error syncing database:", err);
});

export default db;