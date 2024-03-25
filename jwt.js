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

module.exports = decodedToken;
