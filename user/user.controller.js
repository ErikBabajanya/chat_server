const userModel = require("./user.model");
const decodedToken = require("../jwt");

const findMyUser = async (req, res) => {
  const token = req.headers.authorization;
  const decode = decodedToken(token);
  const userId = decode._id;

  try {
    const user = await userModel.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { findMyUser };
