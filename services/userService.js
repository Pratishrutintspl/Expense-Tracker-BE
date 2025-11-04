const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = async (body, ip) => {
  const { name, email, password } = body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { isexistingUser: true };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
    ip,
    isexistingUser: false,
  };
};

const loginUser = async (body, ip) => {
  const { email, password } = body;

  const user = await User.findOne({ email });
  if (!user) return { usernotfound: true };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { passwordNotmatch: true };

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
    ip,
  };
};

const getProfile = async (userId, ip) => {
  const user = await User.findById(userId).select("-password");
  if (!user) return { notRegisterUser: true };
  return { ...user.toObject(), ip };
};

module.exports = { registerUser, loginUser, getProfile };
