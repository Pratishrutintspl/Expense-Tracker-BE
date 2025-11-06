const Category = require("../models/Category");

const addCategory = async (userId, body, ip) => {
  const { name } = body;
  const existing = await Category.findOne({ name, user: userId, isDeleted: false });
  if (existing) return { isExisting: true };

  const category = await Category.create({ user: userId, name });
  return category;
};

const getCategories = async (userId) => {
  const categories = await Category.find({ user: userId, isDeleted: false }).sort({ createdAt: -1 });
  return categories;
};

const updateCategory = async (userId, id, body) => {
  const updated = await Category.findOneAndUpdate(
    { _id: id, user: userId },
    { $set: { name: body.name } },
    { new: true }
  );
  return updated;
};

const deleteCategory = async (userId, id, ip) => {
  const deleted = await Category.findOneAndUpdate(
    { _id: id, user: userId },
    { $set: { isDeleted: true } },
    { new: true }
  );
  return deleted;
};

module.exports = { addCategory, getCategories, updateCategory, deleteCategory };
