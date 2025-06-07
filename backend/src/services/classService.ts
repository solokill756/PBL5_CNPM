import db from "../models/index.js";

const getClassById = async (class_id: string) => {
  try {
    const classData = await db.class.findOne({
      where: { class_id },
    });
    classData.dataValues.members = await db.classMember.findAll({
      where: { class_id },
      include: [
        {
          model: db.user,
          attributes: ["user_id", "email", "username", "profile_picture"],
        },
      ],
    });
    classData.dataValues.lists = await db.listFlashCardClass.findAll({
      where: { class_id },
      include: [
        {
          model: db.listFlashcard,
          attributes: ["list_id", "title", "description"],
        },
      ],
    });
    classData.dataValues.createdBy = await db.user.findOne({
      where: { user_id: classData.created_by },
      attributes: ["user_id", "email", "username", "profile_picture"],
    });
    return classData;
  } catch (error) {
    throw new Error("Error getting class by ID");
  }
};

const addClass = async (
  user_id: string,
  className: string,
  decription: string
) => {
  try {
    const newClass = await db.class.create({
      class_name: className,
      created_by: user_id,
      description: decription,
      create_at: new Date(),
    });
    await db.classMenber.create({
      class_id: newClass.class_id,
      user_id,
      create_at: new Date(),
    });
    return newClass;
  } catch (error) {
    throw new Error("Error adding class");
  }
};

const deleteClass = async (class_id: string) => {
  try {
    await db.class.destroy({ where: { class_id } });
    return true;
  } catch (error) {
    throw new Error("Error deleting class");
  }
};

const updateClass = async (
  class_id: string,
  updatePayload: { [key: string]: any }
) => {
  try {
    await db.class.update({ ...updatePayload }, { where: { class_id } });
    return true;
  } catch (error) {
    throw new Error("Error updating class");
  }
};
const addMemberToClass = async (class_id: string, email: string) => {
  try {
    const user = await db.user.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }
    const classMember = await db.classMember.create({
      class_id,
      user_id: user.user_id,
      create_at: new Date(),
    });
    return classMember;
  } catch (error) {
    throw new Error("Error adding member to class");
  }
};

const removeMemberFromClass = async (class_id: string, user_id: string) => {
  try {
    await db.classMember.destroy({
      where: { class_id, user_id },
    });
    return true;
  } catch (error) {
    throw new Error("Error removing member from class");
  }
};

const addListFlashCardToClass = async (class_id: string, list_id: string) => {
  try {
    const listFlashCardClass = await db.listFlashCardClass.create({
      class_id,
      list_id,
    });
    return listFlashCardClass;
  } catch (error) {
    throw new Error("Error adding list flashcard to class");
  }
};
const removeListFlashCardFromClass = async (
  class_id: string,
  list_id: string
) => {
  try {
    await db.listFlashCardClass.destroy({
      where: { class_id, list_id },
    });
    return true;
  } catch (error) {
    throw new Error("Error removing list flashcard from class");
  }
};

export default {
  getClassById,
  addClass,
  deleteClass,
  updateClass,
  addMemberToClass,
  removeMemberFromClass,
  addListFlashCardToClass,
  removeListFlashCardFromClass,
};
