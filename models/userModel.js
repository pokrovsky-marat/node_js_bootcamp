const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    trim: true,
    maxLength: [50, "A name must have a name less or equal than 50 characters"],
    // minLength: [2, "A tour must have a name more or equal than 5 characters"],
  },
  email: {
    type: String,
    required: [true, "A user must have a email"],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
    maxLength: [
      50,
      "A email must have a name less or equal than 50 characters",
    ],
  },
  photo: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    required: [true, "A user must have a password"],
  },
  passwordConfirm: {
    type: String,
    trim: true,
    required: [true, "A user must have a password"],
  },
});

const User = new mongoose.model("User", userSchema);
module.exports = User;
