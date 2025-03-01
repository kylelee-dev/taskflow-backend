import express, { Request, Response } from "express";
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
} from "../utils/validationUtils";
import { supabase } from "../utils/supabaseClient";
import bcrypt from "bcrypt";

const router = express.Router();
const failedResponse = {
  success: false,
  message: "Registration failed.",
};
router.post("/register", async (req: Request, res: Response): Promise<any> => {
  const { email, username, password } = req.body;
  if (!username) {
    return res.status(400).json({
      ...failedResponse,
      error: "Username is required.",
    });
  }
  if (!password) {
    return res
      .status(400)
      .json({ ...failedResponse, error: "Password is required." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({
      ...failedResponse,
      error: "Invalid email format.",
    });
  }
  if (!isValidUsername(username)) {
    return res.status(400).json({
      ...failedResponse,
      error: "Username must be at least 3 characters long.",
    });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({
      ...failedResponse,
      error: "Password must be at least 6 characters long.",
    });
  }
  const { data: existingUser, error: supabaseError } = await supabase
    .from("users")
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
      error: "Username already taken.",
    });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert([{ username, email, password_hash: hashedPassword }])
    .select("id");

  if (insertError) {
    console.log(insertError);
    return res.status(500).json({
      success: false,
      message: "Registration failed.",
      error: "Database error creating user.",
    });
  }
  if (newUser && newUser.length > 0 && newUser[0].id) {
    const userId = newUser[0].id;
    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      userId: userId,
    });
  } else {
    console.error(
      "Unexpected error: User not created or ID not returned by Supabase"
    );
    return res.status(500).json({
      success: false,
      message: "Registration failed.",
      error: "Failed to create user in database.",
    });
  }
});

export default router;
