// services/reportService.js
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const mongoose = require("mongoose");

const getMonthFilter = (month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { $gte: start, $lte: end };
};


// 📊 Summary Report
const getSummary = async (userId, month, year) => {
  console.log("Fetching Summary for:", { userId, month, year });

  // Date filter for expenses
  const dateFilter = getMonthFilter(month, year);

  // Match conditions for expense aggregation
  const expenseMatch = {
    userId: new mongoose.Types.ObjectId(userId),
    isDeleted: false,
    date: dateFilter,
  };

  console.log("Expense Match Filter:", expenseMatch);

  // Total Expenses for month
  const totalExpenseAgg = await Expense.aggregate([
    { $match: expenseMatch },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  console.log("Total Expense Aggregate:", totalExpenseAgg);

  // Match conditions for budgets
  // Include both monthly and yearly budgets
const budgetMatch = {
  user: new mongoose.Types.ObjectId(userId),
  isDeleted: false,
  $or: [
    { period: "monthly", month: Number(month), year: Number(year) },
    { period: "yearly", year: Number(year) }
  ]
};

  console.log("Budget Match Filter:", budgetMatch);

  // Total Budgets for the month/year
  const totalBudgetAgg = await Budget.aggregate([
    { $match: budgetMatch },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  console.log("Total Budget Aggregate:", totalBudgetAgg);

  const totalExpense = totalExpenseAgg[0]?.total || 0;
  const totalBudget = totalBudgetAgg[0]?.total || 0;

  return {
    totalExpense,
    totalBudget,
    balance: totalBudget - totalExpense,
  };
};


// Expense by category
const getExpenseByCategory = async (userId, month, year) => {
  console.log("Fetching Summary for:", { userId, month, year });

  // ✅ Use helper for month filtering
  const dateFilter = getMonthFilter(month, year);

  // ✅ Define match correctly
  const match = {
    userId: new mongoose.Types.ObjectId(userId),
    isDeleted: false,
    date: dateFilter,
  };

  console.log("Expense Match Filter:", match);

  // ✅ Aggregate expenses grouped by categoryId
  const categoryAgg = await Expense.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$categoryId",
        totalSpent: { $sum: "$amount" },
      },
    },
    {
      $lookup: {
        from: "categories", // 👈 collection name (should be plural)
        localField: "_id",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      $unwind: "$categoryDetails",
    },
    {
      $project: {
        _id: 0,
        categoryId: "$_id",
        categoryName: "$categoryDetails.name",
        totalSpent: 1,
      },
    },
  ]);

  console.log("categoryAgg:", categoryAgg);
  return categoryAgg;
};

// Monthly trend (Jan–Dec)
const getExpenseTrends = async (userId, year) => {
  console.log("Fetching expense trends for:", { userId, year });

  const startOfYear = new Date(year, 0, 1);  // Jan 1
  const endOfYear = new Date(year, 11, 31, 23, 59, 59);  // Dec 31

  const trends = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
        date: { $gte: startOfYear, $lte: endOfYear },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$date" } },
        totalSpent: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        totalSpent: 1,
      },
    },
    { $sort: { month: 1 } },
  ]);

  // 🧮 Make sure months with 0 expenses are included (Jan–Dec)
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthData = trends.find((t) => t.month === i + 1);
    return {
      month: i + 1,
      totalSpent: monthData ? monthData.totalSpent : 0,
    };
  });

  return monthlyData;
};


// Budget vs Expense
const getBudgetStatus = async (userId, month, year) => {
  const dateFilter = getMonthFilter(month, year);

  // Get all expenses for that month
  const expenseAgg = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
        date: dateFilter,
      },
    },
    {
      $group: {
        _id: "$categoryId",
        totalSpent: { $sum: "$amount" },
      },
    },
  ]);

  // Get all budgets for that user (and month/year)
  const budgetAgg = await Budget.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
        month: Number(month),
        year: Number(year),
      },
    },
    {
      $group: {
        _id: "$category",
        totalBudget: { $sum: "$amount" },
      },
    },
  ]);

  // Combine data by category
  const combined = budgetAgg.map((budget) => {
    const expense = expenseAgg.find((e) => e._id.toString() === budget._id.toString());
    const totalSpent = expense ? expense.totalSpent : 0;
    const balance = budget.totalBudget - totalSpent;
    return {
      categoryId: budget._id,
      totalBudget: budget.totalBudget,
      totalSpent,
      balance,
    };
  });

  return combined;
};


module.exports = {
  getSummary,
  getExpenseByCategory,
  getExpenseTrends,
  getBudgetStatus,
};
