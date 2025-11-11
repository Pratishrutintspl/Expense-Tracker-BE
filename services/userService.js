const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
// };
const generateToken = (user) => {
  console.log(user)
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
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
    token: generateToken(user),
    ip,
    isexistingUser: false,
  };
};

// const loginUser = async (body, ip) => {
//   const { email, password } = body;

//   const user = await User.findOne({ email });
//   if (!user) return { usernotfound: true };

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return { passwordNotmatch: true };

//   return {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     token: generateToken(user._id),
//     ip,
//   };
// };
const checkEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return { exists: false };
  }

  return {
    exists: true,
    userId: user._id,
    name: user.name,
    email: user.email,
  };
};



const SECRET_KEY = "EXPENSE_TRACKER_SECRET"; // same as frontend key

const loginUser = async (body, ip) => {
  const { email, password } = body;

  // 🔹 1. Decrypt the password received from frontend
  let decryptedPassword;
  try {
    const bytes = CryptoJS.AES.decrypt(password, SECRET_KEY);
    decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedPassword) {
      return { passwordDecryptionFailed: true };
    }
  } catch (err) {
    console.error("Password decryption failed:", err);
    return { passwordDecryptionFailed: true };
  }

  // 🔹 2. Check if email exists
  const user = await User.findOne({ email });
  if (!user) {
    return { usernotfound: true };
  }

  // 🔹 3. Compare decrypted password with stored hashed password
  const isMatch = await bcrypt.compare(decryptedPassword, user.password);
  if (!isMatch) {
    return { passwordNotmatch: true };
  }

  // 🔹 4. Return success data with token
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user),
    ip,
  };
};

const getProfile = async (userId, ip) => {
  const user = await User.findById(userId).select("-password");
  if (!user) return { notRegisterUser: true };
  return { ...user.toObject(), ip };
};

module.exports = { registerUser, loginUser, getProfile,checkEmail };
