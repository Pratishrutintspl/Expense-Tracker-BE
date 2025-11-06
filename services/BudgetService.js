const Budget= require("../models/Budget")

const createBudget = async(userId,data,ip)=>{
    const budget = new Budget({...data,user:userId,ip})
    return await budget.save();

}

const getAllBudget = async(userId,ip)=>{
    const budgetData = Budget.find({user:userId,isDeleted:false,ip})
    .populate("category","name")
    .sort({createdAt:-1})

    return budgetData;
}

module.exports={
    createBudget,
    getAllBudget
}