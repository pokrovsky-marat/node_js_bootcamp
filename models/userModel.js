const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
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
    minLength: [8, "A password must have  more or equal than 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    trim: true,
    required: [true, "A user must have a password"],
    validate: {
      //!!!This only works for save, not for update
      validator: function (value) {
        return value === this.password;
      },
      message: "Confirmed password must be the same as password",
    },
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ["user", "guide", "lead", "admin"],
    default: 'user',
  },
});
userSchema.pre("save", function (next) {
  // if we can't changed password field, quit from function
  if (!this.isModified("password")) {
    return next();
  }
  bcrypt.hash(this.password, 12, (err, hash) => {
    this.password = hash;
    this.passwordConfirm = undefined;
    next();
  });
  //Dont store passwordConfirm field in Database, it only was nedeed for validation
});
userSchema.methods.checkPassword = (myPlaintextPassword, hash) => {
  return bcrypt.compare(myPlaintextPassword, hash).then((res) => res);
};
userSchema.methods.changedPassword = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimestamp;
  }
  return false;
};

const User = new mongoose.model("User", userSchema);
module.exports = User;
