const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
const { verifyToken } = require("../middlewares/authMiddleware");


router.post("/", verifyToken, categoryController.addCategory);
router.get("/", verifyToken, categoryController.getCategories);
router.patch("/:id", verifyToken, categoryController.updateCategory);
router.patch("/:id/delete", verifyToken, categoryController.deleteCategory);

module.exports = router;
