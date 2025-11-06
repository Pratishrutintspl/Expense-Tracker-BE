const Expense = require("../models/Expense")

const addExpense = async (userId, data, ip) => {
    const { title, amount,  date, description , isDeleted,categoryId} = data;
    const expense = await Expense.create({
        userId,
        title,
        amount,
        categoryId,
        date,
        description,
        isDeleted,
        ip,

    });
    return expense;
};


const getExpenses = async (userId, ip) => {
    console.log("Fetching expenses for user:", userId, "from IP:", ip);

     const expenses = await Expense.find({ userId, isDeleted: false })
    .populate("categoryId", "name") // 🔹 show category details
    .sort({ createdAt: -1 });

    return expenses;
};


const getExpenseById = async (userId, ip) => {
  const expenseData = await Expense.findOne({  userId, isDeleted: false })
    .populate("categoryId", "name");

  return expenseData;
};

const updateExpense = async (userId, id, body, ip) => {
  return await Expense.findOneAndUpdate(
    { _id: id, userId, isDeleted: false },
    { $set: body },
    { new: true }
  ).populate("categoryId", "name");
};

const deleteExpense = async (userId, id, ip) => {
  const deletedExpense = await Expense.findOneAndUpdate(
    { _id: id, userId },
    { $set: { isDeleted: true, deletedIp: ip } },
    { new: true }
  );

  return deletedExpense;
};


module.exports = {
    addExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
}