import db from "../models/index.js";

const User = db.users;
const saltRounds = 10;
const regiterService = async (user) => {
  try {
    const newUser = await User.create(user);
    return newUser;
  } catch (error) {
    throw error;
  }
};

export { regiterService };
