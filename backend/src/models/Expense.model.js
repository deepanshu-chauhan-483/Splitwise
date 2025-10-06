import mongoose from "mongoose";

const splitDetailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },

});

const expenseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    splitType: {
      type: String,
      enum: ["equal", "unequal", "percentage"],
      default: "equal",
    },
    splitDetails: [splitDetailSchema],
    
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
