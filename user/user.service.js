const userModel = require("./user.model");

const createUser = async (phone) => {
  console.log(phone, "00000000");
  const newUser = new userModel({ phone: phone });
  await newUser.save();

  const user = await findUserByPhoneNumber(phone);
  return user;
};

async function findUserByPhoneNumber(phoneNumber) {
  console.log(phoneNumber);
  return await userModel.find({ phone: phoneNumber });
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

const findUser = async (value) => {
  try {
    const users = await userModel.findOne(value);
    return users;
  } catch (error) {
    console.error("Error finding users:", error);
    throw error; // Optionally rethrow the error for the calling function to handle
  }
};

module.exports = {
  createUser,
  findUserByPhoneNumber,
  findUserById,
  changeUserInfo,
  findUser,
};
