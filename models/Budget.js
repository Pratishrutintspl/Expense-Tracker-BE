const mongoose = require("mongoose")

const budgetSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    period:{
        type:String,
        enum:["monthly","yearly"],
        default:["monthly"]
    },
    month:{
        type:Number
    },
    year:{
        type:Number
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

module.exports = new mongoose.model("Budget",budgetSchema)