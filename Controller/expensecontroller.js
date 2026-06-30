import Expense from "../model/ExpenseModel.js";

// ➤ ADD EXPENSE
export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, type, description, date } = req.body;

    if (!title || !amount || !type) {
      return res.status(400).json({
        success: false,
        message: "Title, Amount, Type required",
      });
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      type,
      description,
      date,
      image: req.file?.filename || "",
      userId: req.user._id, // auth middleware irukanum
    });
       console.log("=================>>>>>",req.file)
     return res.status(201).json({
      success: true,
      message: "Expense added successfully",
       expense,
    });
  } catch (error) {
    console.log(error)
   return  res.status(500).json({
      success: false,
      message: "something went worng",
    });
  }
};

// ➤ GET ALL EXPENSES (USER WISE)
export const getExpenses = async (req, res) => {
  try {
    
    const { category, date, amount,title } = req.query;
    const {limit =5, page = 1 } = req.query;
    console.log("limit and page", limit, page);
    
    const skip = (page - 1) * limit;
    const query = { userId: req.user._id };
    console.log("User ID from auth middleware:", req.user._id);
if (title) {
      query.title = { $regex: title, $options: "i" }; 
    }
    else if (category) {
      query.category = category;
    }

    else if (date) {
      query.date = date;
    }

    else if (amount) {
      query.amount = amount;
    }
    const count = await Expense.countDocuments(query)
    const chart = await Expense.find(query);
    const expenses = await Expense.find(query).skip(skip).limit(limit).sort({
      date: -1,
    });
    console.log("expenses featched:",expenses)

     return res.status(200).json({
      success: true,
       expenses,
       contents: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      Piechart: chart
    });
  } catch (error) {
     return res.status(500).json({
      success: false,
      message:"something went worng",

    });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
     
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      updateData,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

     return res.status(200).json({
      success: true,
      message: "Expense updated",
      expense,
    });
  } catch (error) {
    console.log(error);
     return res.status(500).json({
      success: false,
      message: "somthing went worng",
    });
  }
};
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

   return res.status(200).json({
      success: true,
      message: "Expense deleted",
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "somthing went worng",
    });
  }
};