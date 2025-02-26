import express, { Request, Response } from "express";
import { isValidEmail, isValidPassword, isValidUsername } from "../utils/validationUtils";

const router = express.Router();
const failedResponse = {
  success: false,
  message: "Registration failed.",
};
router.post("/register", (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  if (!isValidEmail(email)) {
    res.status(400).json({
      ...failedResponse,
      error: "Invalid email address.",
    });
  }
  if (!isValidUsername(username)) {
    res.status(400).json({
      ...failedResponse,
      error: "Invalid username. Username must be at least 3 characters long.",
    });
  }
  if (!isValidPassword(password)) {
    res.status(400).json({
      ...failedResponse,
      error: "Invalid password. Password must be at least 6 characters long.",
    });
  }
  // if (username.length < 3) {
  //   res.status(400).json({
  //     success: false,
  //     message: "Registration failed.",
  //     error: "Username must be at least 3 characters long.",
  //   });
  // }
  // const emailRegex = /\S+@\S+\.\S+/;
  // if (!emailRegex.test(email)) {
  //   res.status(400).json({
  //     success: false,
  //     message: "Registration failed.",
  //     error: "Invalid email address.",
  //   });
  // }

  // if (!password) {
  //   res.status(400).json({
  //     success: false,
  //     message: "Registration failed.",
  //     error: "Password is required.",
  //   });
  // }
  // if (password.length < 6) {
  //   res.status(400).json({
  //     success: false,
  //     message: "Registration failed.",
  //     error: "Password must be at least 6 characters long.",
  //   });
  // }
  res.status(201).json({
    success: true,
    message: "Registration successful!",
    userId: "fake-user-id-for-now",
  });
});

export default router;
