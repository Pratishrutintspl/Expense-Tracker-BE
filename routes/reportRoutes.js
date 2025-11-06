// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const reportController = require("../controller/reportController");
const {verifyToken} = require("../middlewares/authMiddleware");

router.get("/summary", verifyToken, reportController.getSummary);
router.get("/category", verifyToken, reportController.getByCategory);
router.get("/trends", verifyToken, reportController.getTrends);
router.get("/budget-status", verifyToken, reportController.getBudgetStatus);

module.exports = router;
