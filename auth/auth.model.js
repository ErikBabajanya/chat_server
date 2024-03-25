const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  phone: {
    type: String,
    minlength: 3,
    maxlength: 30,
  },
  code: {
    type: String,
    minlength: 3,
    maxlength: 30,
  },
});

const authModel = mongoose.model("sms", authSchema);

module.exports = authModel;
