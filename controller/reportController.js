// controllers/reportController.js
const reportService = require("../services/reportService");
const Responses = require("../helpers/response");
const { errorLog } = require("../middlewares/errorLog");
exports.getSummary = async (req, res) => {
  try {
        //  console.log(req)
    const { month, year } = req.query;
     console.log(month,year)
    const result = await reportService.getSummary(req.userId, month, year);
    return Responses.successResponse(req,res, "Summary fetched successfully", result,200);
  } catch (error) {
    console.error("ADD EXPENSE ERROR:", error);
        errorLog(error);
        return Responses.errorResponse(req, res, error);
  }
};

exports.getByCategory = async (req, res) => {
  try {
    const { month, year } = req.query;
    const result = await reportService.getExpenseByCategory(req.user.id, Number(month), Number(year));
    return Responses.successResponse(res, "Category report fetched successfully", result);
  } catch (error) {
    return Responses.errorResponse(res, res,error);
  }
};

exports.getTrends = async (req, res) => {
  try {
    const { year } = req.query;
    const result = await reportService.getExpenseTrends(req.user.id, Number(year));
    return Responses.successResponse(res, "Expense trends fetched successfully", result);
  } catch (error) {
    return Responses.errorResponse(res, res,error);
  }
};

exports.getBudgetStatus = async (req, res) => {
  try {
    const { month, year } = req.query;
    const result = await reportService.getBudgetStatus(req.user.id, Number(month), Number(year));
    return Responses.successResponse(res, "Budget status fetched successfully", result);
  } catch (error) {
    return Responses.errorResponse(res, res,error);
  }
};
