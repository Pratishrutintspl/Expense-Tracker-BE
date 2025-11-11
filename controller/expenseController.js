const expenseService = require("../services/expenseService")
const Responses = require("../helpers/response")
const message = require("../constants/constantMessages")
const { errorLog } = require("../middlewares/errorLog");
const commonHelper = require("../helpers/commonHelper");


const addExpense = async (req, res) => {
    try {
        const ip = req.headers.ip ? req.headers.ip : await commonHelper.getIp(req);
        const expense = await expenseService.addExpense(req.userId, req.body, ip)

        return Responses.successResponse(
            req,
            res,
            message.expenseadded,
            expense,
            200
        )

    } catch (error) {
        console.error("ADD EXPENSE ERROR:", error);
        errorLog(error);
        return Responses.errorResponse(req, res, error);
    }
}
const getAllExpense = async (req, res) => {
    try {
        const ip = req.headers.ip ? req.headers.ip : await commonHelper.getIp(req);

        const expenses = await expenseService.getExpenses(req.userId, ip);
        console.log("expensesexpenses", expenses)
        return Responses.successResponse(
            req,
            res,
             expenses,
            message.expenseFetched,
           
            200
        );
    } catch (error) {
        console.error("GET EXPENSE ERROR:", error);
        errorLog(error);
        return Responses.errorResponse(req, res, error);
    }
};

const getExpenseById = async (req, res) => {

    try {
        const ip = req.headers.ip ? req.headers.ip : await commonHelper.getIp(req);
        const expense = await expenseService.getExpenseById(req.userId, ip)
        if (!expense) {
            return Responses.failResponse(req, res, null, message.userNotFound, 400)
        }
        return Responses.successResponse(req, res, expense, message.expenseFetched, 200)
    } catch (error) {
        console.error("GET EXPENSE BY ID ERROR:", error);
        errorLog(error);
        return Responses.errorResponse(req, res, error);
    }
}

const updateExpense = async(req,res)=>{
    try{
         const ip = req.headers.ip ? req.headers.ip : await commonHelper.getIp(req);
          const expense = await expenseService.updateExpense(req.userId, req.params.id, req.body);
    if (!expense)
      return Responses.failResponse(req, res, null, message.notFound, 404);

    return Responses.successResponse(req, res, expense, message.updateSuccess, 200);

    }catch(error)
    {
         console.error("UPDATE EXPENSE ERROR:", error);
        errorLog(error);
        return Responses.errorResponse(req, res, error);
    }
}
const deleteExpense = async (req, res) => {
  try {
    const ip = req.headers.ip ? req.headers.ip : await commonHelper.getIp(req);

    const expense = await expenseService.deleteExpense(req.userId, req.params.id, ip);

    if (!expense) {
      return Responses.failResponse(req, res, null, message.expenseNotFound, 404);
    }

    return Responses.successResponse(req, res, expense, message.expenseDeleted, 200);
  } catch (error) {
    console.error("DELETE EXPENSE ERROR:", error);
    errorLog(error);
    return Responses.errorResponse(req, res, error);
  }
};


module.exports = {
    addExpense,
    getAllExpense,
    getExpenseById,
    updateExpense,
    deleteExpense
}