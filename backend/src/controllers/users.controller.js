// users.controller.js
import  User  from "../models/User.model.js";

/**
 * GET /api/users
 * Return basic list of users (id, name, email) — protected
 */
export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("name email createdAt");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/:id
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
