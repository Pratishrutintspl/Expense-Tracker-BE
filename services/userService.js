const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET), { expiresIn: "1d" }
}

const registerUser = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return { isexistingUser: true };
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const user = await User.create({
        name,
        email,
        password:hashedPassword
    });
    return {
        _id:user._id,
        name:user.name,
        email:user.email,
        token:generateToken(user._id),
        isexistingUser:false,
    }
}

module.exports={registerUser }