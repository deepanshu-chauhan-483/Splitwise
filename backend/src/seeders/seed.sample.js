import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.model.js";
import Group from "../models/Group.model.js";
import Expense from "../models/Expense.model.js";
import bcrypt from "bcryptjs";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/splitwise_dev";

async function runSeed() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB for seeding");

  await User.deleteMany({});
  await Group.deleteMany({});
  await Expense.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const hash = (p) => bcrypt.hashSync(p, salt);

  const users = await User.insertMany([
    { name: "Alice", email: "alice@mail.com", password: hash("123456") },
    { name: "Bob", email: "bob@mail.com", password: hash("123456") },
    { name: "Charlie", email: "charlie@mail.com", password: hash("123456") },
  ]);

  const group = await Group.create({
    name: "Weekend Trip",
    members: users.map((u) => u._id),
    createdBy: users[0]._id,
  });

  // Example expenses
  await Expense.insertMany([
    {
      description: "Lunch",
      amount: 1200,
      paidBy: users[0]._id,
      participants: users.map((u) => u._id),
      groupId: group._id,
      splitType: "equal",
      splitDetails: users.map((u) => ({ userId: u._id, amount: 400 })),
    },
    {
      description: "Cab Ride",
      amount: 900,
      paidBy: users[1]._id,
      participants: users.map((u) => u._id),
      groupId: group._id,
      splitType: "equal",
      splitDetails: users.map((u) => ({ userId: u._id, amount: 300 })),
    },
  ]);

  console.log("🌱 Seeded sample data:");
  console.table(users.map((u) => ({ name: u.name, email: u.email })));
  console.log("Group:", group.name);
  console.log("Expenses created!");

  await mongoose.disconnect();
  console.log("✅ Disconnected");
}

runSeed().catch((err) => {
  console.error("❌ Seeding error:", err);
  mongoose.disconnect();
});
