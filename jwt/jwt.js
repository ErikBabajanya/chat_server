const jwt = require("jsonwebtoken");

const decodedToken = (token) => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  try {
    const decoded = jwt.verify(token, jwtkey);
    const { _id, phone } = decoded;
    return { _id, phone };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const generateTokenForUser = (_id, phone) => {
  console.log(_id, phone);
  const jwtkey = process.env.JWT_SECRET_KEY;
  const expiresIn = process.env.EXPIRES_IN;

  return jwt.sign({ _id, phone }, jwtkey, { expiresIn: expiresIn });
};

module.exports = { decodedToken, generateTokenForUser };
