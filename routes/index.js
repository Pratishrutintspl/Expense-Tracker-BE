const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const expenseRoutes = require("./expenseRouter");
const categoryRoutes =  require("./categoryRouter")
router.use("/auth", userRoutes);
router.use("/expense", expenseRoutes);
router.use("/categories", categoryRoutes);


module.exports = router;
 