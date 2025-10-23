const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        console.log("heeere")
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("heeere1")
        console.log(`mongoDB Connected, ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection error", error);
        process.exit(1)
    }
}

module.exports = connectDB;
