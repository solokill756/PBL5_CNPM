
import { Router, Request, Response } from "express";
import { login , register , logout, checkEmailSignUp, sendOtp, verifyOtp, resetPassword} from "../controllers/authenticationController.js";
import passport from "../config/passportConfig.js"
const authRoutes = Router();

authRoutes.post("/login", (req: Request, res: Response) => login(req, res));
authRoutes.post("/register", (req: Request, res: Response) => register(req, res));

authRoutes.post("/logout", (req: Request, res: Response) => logout(req, res));
authRoutes.post("/checkEmail" , (req : Request , res : Response) => checkEmailSignUp(req , res));
authRoutes.post('/sendOtp' , (req : Request , res : Response) => sendOtp(req , res));
authRoutes.post("/verifyOtp" , (req : Request , res : Response) => verifyOtp(req , res));
authRoutes.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRoutes.get("/google/callback" , passport.authenticate("google") , (req : Request, res : Response) => {
  try {
     if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
  }
  else {
     res.redirect("http://localhost:3000/auth-success");
  } 
  } catch (error) {
    console.error("Error during Google authentication callback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
authRoutes.post("/resetPassword" , (req : Request , res : Response) => resetPassword(req, res));

authRoutes.get("/user" , (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    res.status(200).json({ user });
  }
});
export default authRoutes;
