const authModel = require("./auth.model");
const { decodedToken, generateTokenForUser } = require("../jwt/jwt");

const createLoginUserModel = async (phone, code) => {
  const sms = new authModel({
    phone: phone,
    code: code,
  });

  const token = generateTokenForUser(sms._id, sms.phone);
  await sms.save();
  return token;
};

const findSmsCode = async (_id) => {
  const code = await authModel.findById(_id);
  return code;
};

const deleteSmsCode = async (_id) => {
  const deleteModel = await authModel.findByIdAndDelete({ _id });
  return deleteModel;
};

module.exports = {
  createLoginUserModel,
  findSmsCode,
  deleteSmsCode,
};
