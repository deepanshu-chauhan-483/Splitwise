// users.controller.js
import  User  from "../models/User.model.js";
import path from "path";

/**
 * GET /api/users
 * Return basic list of users (id, name, email, avatarUrl) — protected
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "name email avatarUrl createdAt");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/:id
 * Return a single user by ID — protected
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/users/avatar
 * Upload or update authenticated user's avatar — protected
 */
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarUrl: filePath },
      { new: true }
    ).select("name email avatarUrl");

    res.json({ message: "Avatar updated successfully", user });
  } catch (err) {
    next(err);
  }
};
