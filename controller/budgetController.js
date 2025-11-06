const budgetService = require("../services/BudgetService")
const messages = require("../constants/constantMessages")
const Responses = require("../helpers/response")
const { errorLog } = require("../middlewares/errorLog")
const commonHelper = require("../helpers/commonHelper")


const createBudget = async (req, res) => {
    try {
        const ip = req.headers.ip ? req.headers.ip : await commonHelper.getIp(req);
        const budget = await budgetService.createBudget(req.userId, req.body, ip)
        return Responses.successResponse(req, res, budget, messages.budgetCreated, 200)

    } catch (error) {
        console.log("Create Budget API  Error", error)
        errorLog(error)
        return Responses.errorResponse(req, res, error)
    }
}


const getAllBudget = async (req, res) => {
    try {
        const ip = req.headers.ip ? req.headers.ip : await commonHelper.getIp(req);
        const getAllBudget = await budgetService.getAllBudget(req.userId);
        return Responses.successResponse(req,res,getAllBudget,messages.budgetFetch,200)
    } catch (error) {
        console.log("Get All Budget API  Error", error)
        errorLog(error)
        return Responses.errorResponse(req, res, error)
    }
}

module.exports = {

    createBudget,
    getAllBudget
}