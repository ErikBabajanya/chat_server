const authModel = require("./auth.model");
const { decodedToken, generateTokenForUser } = require("../jwt/jwt");

const generateRandomCode = (length) => {
  const code = Math.floor(Math.random() * length);
  return code;
};

const createLoginUserModel = async (phone, code) => {
  const sms = new authModel({
    phone: phone,
    code: code,
  });
  await sms.save();
  console.log(sms);
  const token = generateTokenForUser(sms._id, sms.phone);

  return token;
};

const findSmsCode = async (_id) => {
  const code = await authModel.findById(_id);
  return code;
};

const deleteSmsCode = async (_id) => {
  return await authModel.findByIdAndDelete({ _id });
};

module.exports = {
  createLoginUserModel,
  findSmsCode,
  deleteSmsCode,
  generateRandomCode,
};
