const userModel = require("./user.model");

const createUser = async (phone) => {
  const newUser = new userModel({ phone: phone });
  await newUser.save();

  const user = await findUserByPhoneNumber(phone);
  return user;
};

async function findUserByPhoneNumber(phoneNumber) {
  return await userModel.findOne(phoneNumber);
}
async function findUserById(_id) {
  return await userModel.findById(_id);
}

const changeUserInfo = async (_id, firstName, lastName, bio, file) => {
  const user = await findUserById(_id);
  user.firstName = firstName;
  user.lastName = lastName;
  user.bio = bio;

  if (file) {
    user.picture = file.buffer.toString("base64");
  }
  await user.save();

  const newUser = await userModel.findById(_id);
  return newUser;
};

module.exports = {
  createUser,
  findUserByPhoneNumber,
  findUserById,
  changeUserInfo,
};
