import db from "../models";

const getRecentClassesService = async (userId: string): Promise<any> => {
  try {
    const classMemberships = await db.classMember.findAll({
      where: { user_id: userId },
      attributes: ["class_id"],
      order: [["last_accessed", "DESC"]],
      limit: 10,
    });

    const classIds = classMemberships.map(
      (member: { class_id: string }) => member.class_id
    );

    if (classIds.length === 0) return [];

    const recentClasses = await db.class.findAll({
      where: { class_id: classIds },
      limit: 10,
      include: [
        {
          model: db.classMember,
          attributes: [],
          as: "ClassMembers",
        },
        {
          model: db.user,
          attributes: ["username"],
        },
      ],
      attributes: {
        include: [
          [
            db.sequelize.fn("COUNT", db.sequelize.col("ClassMembers.user_id")),
            "studentCount",
          ],
        ],
      },
      group: ["Class.class_id", "User.username"],
    });

    return recentClasses;
  } catch (error) {
    throw error;
  }
};

const getRecentFlashcardsService = async (userId: string): Promise<any> => {
  try {
    const listFlashcard = await db.flashcardStudy.findAll({
      where: { user_id: userId },
      attributes: ["list_id"],
      order: [["last_accessed", "DESC"]],
      limit: 10,
    });

    const listFlashCardID = await listFlashcard.map(
      (member: { list_id: string }) => member.list_id
    );
    if (listFlashCardID.length == 0) return [];

    const recentFlashcards = await db.listFlashcard.findAll({
      where: {
        list_id: listFlashCardID,
      },
      limit: 10,
      include: [
        {
          model: db.user,
          attributes: ["user_id", "username", "profile_picture"],
        },
        {
          model: db.flashcard,
          as: "Flashcard",
          attributes: [],
          required: false,
        },
      ],
      attributes: {
        include: [
          [
            db.sequelize.fn(
              "COUNT",
              db.sequelize.col("Flashcard.flashcard_id")
            ),
            "FlashcardCount",
          ],
        ],
      },
      group: ["ListFlashcard.list_id"],
      subQuery: false,
    });
    return recentFlashcards;
  } catch (error) {
    console.error("Error fetching recent flashcards:", error);
    throw error;
  }
};
const getTopAuthorService = async (): Promise<any> => {
  try {
    const topAuthors = await db.user.findAll({
      include: [
        {
          model: db.listFlashcard,
          attributes: [],
        },
        {
          model: db.class,
          attributes: [],
        },
      ],
      attributes: [
        "username",
        "profile_picture",
        [
          db.sequelize.fn(
            "COUNT",
            db.sequelize.literal("DISTINCT ListFlashcards.list_id")
          ),
          "ListFlashCardCount",
        ],
        [
          db.sequelize.fn(
            "COUNT",
            db.sequelize.literal("DISTINCT Classes.class_id")
          ),
          "ClassCount",
        ],
      ],
      group: ["User.user_id"],
      subQuery: false,
      order: [
        [db.sequelize.literal("`ListFlashCardCount`"), "DESC"],
        [db.sequelize.literal("ClassCount"), "DESC"],
      ],
      limit: 10,
    });
    return topAuthors;
  } catch (error) {
    throw error;
  }
};

const getTopTopicsByUserService = async (userId: string): Promise<any> => {
  try {
    const result = await db.vocabularyTopic.findAll({
      include: [
        {
          model: db.vocabulary,
          attributes: [],
          include: [
            {
              model: db.flashcard,
              attributes: [],
              include: [
                {
                  model: db.listFlashcard,
                  attributes: [],
                  include: [
                    {
                      model: db.flashcardStudy,
                      attributes: [],
                      where: {
                        user_id: userId,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      attributes: [
        "topic_id",
        "name",
        // [
        // db.sequelize.fn(
        //   "COUNT",
        //   db.sequelize.col(
        //     "Vocabularies.Flashcards.ListFlashcards.FlashcardStudies.id"
        //   )
        // ),
        // "StudiedCount",
        // ],
      ],
      // group: ["vocabulary_topic.topic_id"],
      // order: [[db.sequelize.literal("StudiedCount"), "DESC"]],
      subQuery: false,
      limit: 5,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export {
  getRecentClassesService,
  getTopAuthorService,
  getRecentFlashcardsService,
  getTopTopicsByUserService,
};
