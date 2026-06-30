import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["food",
"travel",
"shopping",
"bills",
"health",
"education",
"entertainment",
"rent",
"electricity",
"internet",
"medical",
"other"],
      default: "other",
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },
    profile: {
    type: String,
    default: "",
  },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const expense = mongoose.model("Expense", expenseSchema);
export default expense;