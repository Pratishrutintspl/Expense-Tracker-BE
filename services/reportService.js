// services/reportService.js
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const mongoose = require("mongoose");


// 🧮 Helper: get date range for given month and year
const getMonthFilter = (month, year) => {
  const startDate = new Date(year, month - 1, 1); // first day of month
  const endDate = new Date(year, month, 0, 23, 59, 59); // last day of month
  return { $gte: startDate, $lte: endDate };
};

// 📊 Summary Report
const getSummary = async (userId, month, year) => {
  console.log("Fetching Summary for:", { userId, month, year });

  // date filter for given month
  const dateFilter = getMonthFilter(month, year);

  // Match conditions for expense aggregation
  const match = {
    userId: new mongoose.Types.ObjectId(userId),
    isDeleted: false,
    date: dateFilter,
  };

  console.log("Expense Match Filter:", match);

  // 🧾 Total Expenses for month
  const totalExpenseAgg = await Expense.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  console.log("Total Expense Aggregate:", totalExpenseAgg);

  // 💰 Total Budgets for user
  const totalBudgetAgg = await Budget.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
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
  const match = { userId, isDeleted: false, date: getMonthFilter(month, year) };

  const categoryAgg = await Expense.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$category",
        totalSpent: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        totalSpent: 1,
      },
    },
  ]);

  return categoryAgg;
};

// Monthly trend (Jan–Dec)
const getExpenseTrends = async (userId, year) => {
  const trends = await Expense.aggregate([
    {
      $match: {
        userId,
        isDeleted: false,
        date: {
          $gte: new Date(year, 0, 1),
          $lte: new Date(year, 11, 31, 23, 59, 59),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$date" },
        totalSpent: { $sum: "$amount" },
      },
    },
    { $sort: { "_id": 1 } },
  ]);

  return trends.map((t) => ({
    month: t._id,
    totalSpent: t.totalSpent,
  }));
};

// Budget vs Expense
const getBudgetStatus = async (userId, month, year) => {
  const match = { userId, isDeleted: false, date: getMonthFilter(month, year) };

  const expenseByCategory = await Expense.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$category",
        totalSpent: { $sum: "$amount" },
      },
    },
  ]);

  const budgets = await Budget.find({ userId }).populate("category", "name");

  return budgets.map((b) => {
    const exp = expenseByCategory.find((e) => e._id == b.category?._id?.toString());
    const spent = exp ? exp.totalSpent : 0;
    return {
      category: b.category?.name || "Unknown",
      budget: b.amount,
      spent,
      remaining: b.amount - spent,
    };
  });
};

module.exports = {
  getSummary,
  getExpenseByCategory,
  getExpenseTrends,
  getBudgetStatus,
};
