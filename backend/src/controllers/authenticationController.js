import dotenv from "dotenv";
import { loginService, regiterService } from "../services/authService.js";
import bcrypt from "bcrypt";
dotenv.config();
const saltRounds = 10;
// Đăng nhập, tạo token
// API lấy thông tin user
// const getUserID = async (req, res) => {
//   try {
//     const user = await User.findOne({ where: { username: req.user.username } });

//     if (!user) {
//       return res.status(404).json({ error: "Không tìm thấy user" });
//     }

//     res.status(200).json({ id: user.id, username: user.username });
//   } catch (error) {
//     res.status(500).json({ error: "Lỗi server" });
//   }
// };

// Register
const regiter = async (req, res) => {
  try {
    const user = {
      username: req.body.username,
      password: req.body.password,
      full_name: req.body.fullname,
      email: req.body.email,
      datetime_joined: Date.now(),
    };
    const hashPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashPassword;
    regiterService(user).then((response) => {
      res.status(200).json(response);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

const login = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    if (!username && !password) {
      return res.status(400).json({ error: "Thiếu username or email" });
    }
    const user = { username: username, password: password, email: email };

    const data = await loginService(user);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

export { login, regiter };
