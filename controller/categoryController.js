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

const getCategories = async (req, res) => {
  try {
    const result = await categoryService.getCategories(req.userId);
    return Responses.successResponse(req, res, result, "Categories fetched successfully", 200);
  } catch (error) {
    console.error("GET CATEGORY ERROR:", error);
    errorLog(error);
    return Responses.errorResponse(req, res, error);
  }
};

const updateCategory = async (req, res) => {
  try {
    const updated = await categoryService.updateCategory(req.userId, req.params.id, req.body);
    return Responses.successResponse(req, res, updated, "Category updated successfully", 200);
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);
    errorLog(error);
    return Responses.errorResponse(req, res, error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const ip = req.headers.ip ? req.headers.ip : await commonHelper.getIp(req);
    const deleted = await categoryService.deleteCategory(req.userId, req.params.id, ip);
    return Responses.successResponse(req, res, deleted, "Category deleted successfully", 200);
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);
    errorLog(error);
    return Responses.errorResponse(req, res, error);
  }
};

module.exports = { addCategory, getCategories, updateCategory, deleteCategory };
