const Category = require("../models/Category")

const addCategory = async (userId, ReportBody, ip) => {
    const { name } = body;
    const existing = await Category.findOne(
        {
            name,
            userId,
            isDeleted: false
        }
    )
    if (existing) {
        return { isExisting: true }
    }
    const category = await Category.create(
        {
            userId,
            name
        }
    )
    return category;
}

module.exports ={
    addCategory
}