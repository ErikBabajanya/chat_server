const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
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
      maxlength: 16,
      unique: true,
    },
    bio: {
      type: String,
    },
    picture: {
      type: String,
    },
    online: {
      type: Boolean,
    },
    unReadeMessage: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
