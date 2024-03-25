const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: 3,
      maxlength: 30,
    },
    fisrtName: {
      type: String,
      minlength: 3,
      maxlength: 30,
    },
    lastName: {
      type: String,
      minlength: 3,
      maxlength: 30,
    },
    phone: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
