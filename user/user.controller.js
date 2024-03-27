const userModel = require("./user.model");
const decodedToken = require("../jwt");

const findMyUser = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Authorization token is missing." });
  }
  const decode = decodedToken(token);

  if (!decode) {
    return res.status(401).json({ error: "Invalid authorization token." });
  }

  const _id = decode._id;

  const user = await userModel.findById(_id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  try {
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const chageMyUserInfo = async (req, res) => {
  const token = req.headers.authorization;
  const info = req.body.formdata;
  console.log(info);
  if (!token) {
    return res.status(401).json({ error: "Authorization token is missing." });
  }
  const decode = decodedToken(token);

  if (!decode) {
    return res.status(401).json({ error: "Invalid authorization token." });
  }

  const _id = decode._id;

  try {
    const user = await userModel.findById(_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user);
    console.log(info.firstName);
    user.firstName = info.firstName;
    user.lastName = info.lastName;
    user.bio = info.bio;
    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { findMyUser, chageMyUserInfo };
