import db from "../models/index.js";

const User = db.users;
const getAllUsers = async (req, res) => {
  let users = await User.findAll({});
  console.log(users);
  res.status(200).send(users);
};

const getUser = async (req, res) => {
  let id = req.params.id;
  let user = await User.findOne({ where: { user_id: id } });
  res.status(200).send(user);
};
export { getAllUsers, getUser };
