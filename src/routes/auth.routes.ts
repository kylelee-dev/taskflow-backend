import express, { Request, Response } from "express";
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
} from "../utils/validationUtils";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();
const failedResponse = {
  success: false,
  message: "Registration failed.",
};
router.post("/register", async (req: Request, res: Response): Promise<any> => {
  const { email, username, password } = req.body;
  if (!isValidEmail(email)) {
    return res.status(400).json({
      ...failedResponse,
      error: "Invalid email address.",
    });
  }
  if (!isValidUsername(username)) {
    return res.status(400).json({
      ...failedResponse,
      error: "Invalid username. Username must be at least 3 characters long.",
    });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({
      ...failedResponse,
      error: "Invalid password. Password must be at least 6 characters long.",
    });
  }
  const { data: existingUser, error: supabaseError } = await supabase
    .from("user")
    .select("*")
    .eq("username", username);
  if (supabaseError) {
    // Handle potential Supabase errors
    console.error("Supabase error checking username:", supabaseError);
    return res.status(500).json({
      success: false,
      message: "Registration failed.",
      error: "Database error checking username.",
    });
  }

  if (existingUser && existingUser.length > 0) {
    return res.status(409).json({
      success: false,
      message: "Registration failed.",
      error: "Username already exists.",
    });
  }
  return res.status(201).json({
    success: true,
    message: "Registration successful!",
    userId: "fake-user-id-for-now",
  });
});

export default router;
