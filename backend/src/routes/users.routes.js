// users.routes.js
import express from "express";
import multer from "multer";
import { 
  getAllUsers, 
  getUserById, 
  uploadAvatar 
} from "../controllers/users.controller.js";
import  authMiddleware  from "../middleware/auth.middleware.js";

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/avatars"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "")),
});

const upload = multer({ storage });

// Apply authentication middleware to all routes
router.use(authMiddleware);

// User routes
router.get("/", getAllUsers); // List all users
router.get("/:id", getUserById); // Get user by ID
router.post("/avatar", upload.single("avatar"), uploadAvatar); // Upload avatar

export default router;
