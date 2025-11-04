
const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        enum:["Food","Travel","Bills","Shopping","Health","Other"]
    },
    date:{
        type:Date,
        default:Date.now,
    },
    description:{
        type:String
    },
  isDeleted: { type: Boolean, default: false },
},{timestamps:true})

module.exports = mongoose.model("Expense",expenseSchema)