const userModel = require("./user.model");

async function findUserByPhoneNumber(phoneNumber) {
  return await userModel.findOne(phoneNumber);
}
async function findUserById(_id) {
  return await userModel.findById(_id);
}
module.exports = {
  findUserByPhoneNumber,
  findUserById,
};
