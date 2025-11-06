const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const expenseRoutes = require("./expenseRouter");
const categoryRoutes =  require("./categoryRouter")
const budgetRoutes =  require("./budgetRouter")
const reportsRoutes =  require("./reportRoutes")

router.use("/auth", userRoutes);
router.use("/expense", expenseRoutes);
router.use("/categories", categoryRoutes);
router.use("/budget", budgetRoutes);
router.use("/reports", reportsRoutes);


module.exports = router;
 