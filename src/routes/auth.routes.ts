import express, { Request, Response } from "express";

const router = express.Router();

router.post("/register", (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  if (!username) {
    res.status(400).json({
      success: false,
      message: "Registration failed.",
      error: "Username is required.",
    });
  }
  if (username.length < 3) {
    res.status(400).json({
      success: false,
      message: "Registration failed.",
      error: "Username must be at least 3 characters long.",
    });
  }
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      success: false,
      message: "Registration failed.",
      error: "Invalid email address.",
    });
  }
  if (!password) {
    res.status(400).json({
      success: false,
      message: "Registration failed.",
      error: "Password is required.",
    });
  }
  if (password.length < 6) {
    res.status(400).json({
      success: false,
      message: "Registration failed.",
      error: "Password must be at least 6 characters long.",
    });
  }
  res.status(201).json({
    success: true,
    message: "Registration successful!",
    userId: "fake-user-id-for-now",
  });
});

export default router;
