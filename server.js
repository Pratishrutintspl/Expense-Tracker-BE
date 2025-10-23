const dotenv = require("dotenv");
const connectDB = require("./dbConnection/connection");
const app = require("./app")
dotenv.config(); 
console.log(process.env.PORT);        // 5000
console.log(process.env.MONGO_URI); 
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
