import Group from "../models/Group.model.js";
import User from "../models/User.model.js";

// Create new group
export const createGroup = async (req, res, next) => {
  try {
    const { name, description = "" } = req.body;
    const createdBy = req.user.id;

    const group = await Group.create({
      name,
      description,
      createdBy,
      members: [createdBy],
    });

    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
};

// Get all groups for logged-in user
export const getMyGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ members: req.user.id })
      .populate("members", "name email")
      .sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    next(err);
  }
};

// Get single group with members
export const getGroupById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id).populate("members", "name email");
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  } catch (err) {
    next(err);
  }
};

// Add member by email
export const addMemberToGroup = async (req, res, next) => {
  try {
    const { groupId, email } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (group.members.includes(user._id))
      return res.status(400).json({ message: "User already in group" });

    group.members.push(user._id);
    await group.save();

    const populated = await Group.findById(groupId).populate("members", "name email");
    res.json(populated);
  } catch (err) {
    next(err);
  }
};
