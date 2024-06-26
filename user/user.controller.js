const { decodedToken } = require("../jwt/jwt");
const {
  findUserById,
  changeUserInfo,
  findUserByPhoneNumber,
} = require("./user.service");

const findMyUser = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Authorization token is missing." });
  }

  const decode = decodedToken(token);

  console.log(decode);
  if (!decode) {
    return res.status(401).json({ error: "Invalid authorization token." });
  }

  const _id = decode._id;
  console.log(_id);
  const user = await findUserById(_id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

const chageMyUserInfo = async (req, res) => {
  const token = req.headers.authorization;
  const info = req.body;
  const file = req.file;

  const firstName = info.firstName;
  const lastName = info.lastName;
  const bio = info.bio;

  if (!token) {
    return res.status(401).json({ error: "Authorization token is missing." });
  }
  const decode = decodedToken(token);

  if (!decode) {
    return res.status(401).json({ error: "Invalid authorization token." });
  }

  const _id = decode._id;
  try {
    const user = await findUserById(_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const newUser = await changeUserInfo(_id, firstName, lastName, bio, file);
    if (!newUser) return (404).json({ error: "info dose note changed" });
    return res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

const searchUser = async (req, res) => {
  const token = req.headers.authorization;
  const value = req.body.value;
  console.log(value, "__________");
  if (!token) {
    return res.status(401).json({ error: "Authorization token is missing." });
  }

  const decode = decodedToken(token);

  if (!decode) {
    return res.status(401).json({ error: "Invalid authorization token." });
  }

  const user = await findUserByPhoneNumber(value);

  if (!user) {
    return res.status(400).json({ message: "user note found" });
  }
  return res.status(200).json(user);
};

module.exports = { findMyUser, chageMyUserInfo, searchUser };
