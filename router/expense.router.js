import express from "express";
import { authMiddleware } from "../middleware/Authorization.js";
import { addExpense, deleteExpense, getExpenses, updateExpense } from "../Controller/expensecontroller.js";
import { imageUpload } from "../lib/multer.js";

const expenserouter = express.Router();

expenserouter.post("/add", authMiddleware, imageUpload.single("image"), addExpense);
expenserouter.get("/all", authMiddleware, getExpenses);
expenserouter.put("/update/:id", authMiddleware, imageUpload.single("image"), updateExpense);
expenserouter.delete("/delete/:id", authMiddleware, deleteExpense);

export default expenserouter;