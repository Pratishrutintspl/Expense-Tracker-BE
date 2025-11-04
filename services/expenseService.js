const Expense = require("../models/Expense")

const addExpense = async (userId, data, ip) => {
    const { title, amount, category, date, description , isDeleted} = data;
    const expense = await Expense.create({
        userId,
        title,
        amount,
        category,
        date,
        description,
                isDeleted,
        ip,

    });
    return expense;
};


const getExpenses = async (userId, ip) => {
    console.log("Fetching expenses for user:", userId, "from IP:", ip);

    // Just find by user, not by IP
    const expenses = await Expense.find({ userId: userId }).sort({ createdAt: -1 });
    return expenses;
};

const getExpenseById = async(userId,ip)=>{
 const expenseData = await Expense.findOne({ userId:userId})
 return expenseData;
}

const updateExpense = async(userId,id,body,ip)=>{
    return await Expense.findByIdAndUpdate(
        {_id:id,userId:userId},
        {$set:body},
        {new:true},
        ip
    )
}

const deleteExpense = async (userId, id, ip) => {
  const deletedExpense = await Expense.findOneAndUpdate(
    { _id: id, },
    { $set: { isDeleted: true, deletedIp: ip } }, // 👈 soft delete + store IP (optional)
    { new: true } // return the updated document
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