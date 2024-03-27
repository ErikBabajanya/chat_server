const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      maxlength: 16,
    },
    firstName: {
      type: String,
      maxlength: 16,
    },
    lastName: {
      type: String,
      maxlength: 16,
    },
    phone: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      unique: true,
    },
    bio: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
