const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const expenseRoutes = require(".//expenseRouter");

router.use("/auth", userRoutes);
router.use("/expense", expenseRoutes);


module.exports = router;
