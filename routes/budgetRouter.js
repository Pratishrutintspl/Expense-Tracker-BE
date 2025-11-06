const express =require("express")
const router= express.Router();
const budgetController = require("../controller/budgetController")
const {verifyToken} = require("../middlewares/authMiddleware")


router.post("/",verifyToken,budgetController.createBudget)
router.get("/",verifyToken,budgetController.getAllBudget)

module.exports=router