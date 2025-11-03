const userService = require("../services/userService")
const Responses = require("../helpers/response")
const messages = require("../constants/constantMessages")
const commonHelper = require("../helpers/commonHelper")
const { errorLog } = require("../middlewares/errorLog");


const registerUser = async (req, res) => {
    try {
        const ip = req.headers.ip ? req.headers.ip : await commonHelper.getIp(req)
        const result = await userService.registerUser(req.body, ip)
        if (result.isexistingUser) {
            return Responses.failResponse(req, res, null, messages.emailAlreadyExists, 409)
        }
        return Responses.successResponse(req, res, result, messages.registerSuccess, 200);

    } catch (error) {
        console.error("REGISTER ERROR:", error);
        errorLog(error);
        return Responses.errorResponse(req, res, error);
    }
}

const loginUser = async (req, res) => {
    try {
        const ip = req.headers.ip ? req.headers.ip : await commonHelper.getIp(req)
        const result = await userService.loginUser(req.body, ip)
        if (!result) {
            return Responses.failResponse(req, res, messages.invalidCredentials, 409)
        }
         return Responses.successResponse(req, res, result, messages.loginSuccess, 200);
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        errorLog(error);
        return Responses.errorResponse(req, res, error);
    }
}



module.exports = {
    registerUser
}