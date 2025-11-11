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

// const loginUser = async (req, res) => {
//     try {
//         const ip = req.headers.ip ? req.headers.ip : await commonHelper.getIp(req)
//         const result = await userService.loginUser(req.body, ip)
//         if (!result) {
//             return Responses.failResponse(req, res, messages.invalidCredentials, 409)
//         }
//         return Responses.successResponse(req, res, result, messages.loginSuccess, 200);
//     } catch (error) {
//         console.error("REGISTER ERROR:", error);
//         errorLog(error);
//         return Responses.errorResponse(req, res, error);
//     }
// }
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // validate email
    if (!email) {
      return Responses.failResponse(req, res, "Email is required", 400);
    }

    const result = await userService.checkEmail(email);

    if (result.exists) {
      return Responses.successResponse(req, res, result, "Email verified successfully", 200);
    } else {
      return Responses.successResponse(req, res, result, "Email not registered", 200);
    }

  } catch (error) {
    console.error("CHECK EMAIL ERROR:", error);
    errorLog(error);
    return Responses.errorResponse(req, res, error);
  }
};
const loginUser = async (req, res) => {
  try {
    const ip = req.headers.ip ? req.headers.ip : await commonHelper.getIp(req);
    const result = await userService.loginUser(req.body, ip);

    // If user not found
    if (result?.usernotfound) {
      return Responses.failResponse(req, res, "Email ID not registered", 404);
    }

    // If password invalid
    if (result?.passwordNotmatch) {
      return Responses.failResponse(req, res, messages.invalidCredentials, 401);
    }

    // Success
    return Responses.successResponse(req, res, result, messages.loginSuccess, 200);
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    errorLog(error);
    return Responses.errorResponse(req, res, error);
  }
};

const getProfile = async (req, res) => {
    try {

        const ip = req.headers.ip ? req.headers.ip : await commonHelper.getIp(req);
        const result = await userService.getProfile(req.userId, ip)

        if (!result) {
            return Responses.failResponse(req, res, null, messages.userNotFound, 404);

        }
        return Responses.successResponse(req, res, result, messages.profileFetched, 200);
    }
    catch (error) {
        console.error("Profile Error", error)
        errorLog(error)
        return Responses.errorResponse(req, res, error)
    }
}


module.exports = {
    registerUser,
    loginUser,
    getProfile,
    checkEmail
}