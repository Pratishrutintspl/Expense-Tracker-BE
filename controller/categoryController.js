const categoryService = require("../services/categoryService");
const Responses = require("../helpers/response");
const messages = require("../constants/constantMessages");
const { errorLog } = require("../middlewares/errorLog");
const commonHelper = require("../helpers/commonHelper");


const addCategory = async (req, res) => {
  try {
    const ip = req.headers.ip ? req.headers.ip : await commonHelper.getIp(req);
    const result = await categoryService.addCategory(req.userId, req.body, ip);

    if (result.isExisting)
      return Responses.failResponse(req, res, null, "Category already exists", 409);

    return Responses.successResponse(req, res, result, "Category added successfully", 201);
  } catch (error) {
    console.error("ADD CATEGORY ERROR:", error);
    errorLog(error);
    return Responses.errorResponse(req, res, error);
  }
};

module.exports ={
    addCategory
}