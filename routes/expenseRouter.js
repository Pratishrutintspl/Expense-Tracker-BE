const express = require("express");
const router = express.Router();
const expenseController = require("../controller/expenseController");
const { verifyToken } = require("../middlewares/authMiddleware");


router.post("/add", verifyToken, expenseController.addExpense);
// http://localhost:5000/api/expense/add

router.get("/allexpenses", verifyToken, expenseController.getAllExpense);
// http://localhost:5000/api/expense/allexpenses


router.get("/:id",verifyToken,expenseController.getExpenseById)

router.put("/:id",verifyToken,expenseController.updateExpense)

router.patch("/:id", verifyToken, expenseController.deleteExpense);


module.exports = router;
