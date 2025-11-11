const express = require("express")
const router = express.Router();
const userController = require("../controller/userController")
const {verifyToken} = require("../middlewares/authMiddleware")
router.post("/register", userController.registerUser);  
// http://localhost:5000/api/auth/register ----  register User
router.post("/check-email", userController.checkEmail);

router.post("/login", userController.loginUser);


router.get("/profile", verifyToken, userController.getProfile);
module.exports = router;