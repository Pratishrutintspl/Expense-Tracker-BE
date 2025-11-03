const dotenv = require("dotenv");
const express = require("express")
const connectDB = require("./dbConnection/connection");
const routes = require("./routes/index")
const app = require("./app")
dotenv.config(); 
console.log(process.env.PORT);        
console.log(process.env.MONGO_URI); 
connectDB();
app.use(express.json());


app.use("/api", routes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
