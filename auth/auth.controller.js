const jwt = require("jsonwebtoken");
const { decodedToken, generateTokenForUser } = require("../jwt/jwt");
const {
  createLoginUserModel,
  findSmsCode,
  deleteSmsCode,
  generateRandomCode,
} = require("./auth.service");
const { findUserByPhoneNumber, createUser } = require("../user/user.service");

const login = async (req, res) => {
  try {
    const phone = req.body.phone;
    const armenianPhoneNumberRegex =
      /^(374|\+374|0)(94|91|55|77|93|98|96|99|41|43|45|47|60|61|62|63|64|65|66|67|68|69|94|95|97|41|43|44|46|47|49|94|96|97|98|99)(\d{6}|\d{5})$/;
    if (!phone) return res.status(400).json("Phone number is required.");

    if (!armenianPhoneNumberRegex.test(phone))
      return res.status(400).json("Invalid Armenian phone number");

    const smsSentSuccessfully = generateRandomCode(100000);

    if (!smsSentSuccessfully)
      return res.status(400).json("Invalid Armenian phone number");
    console.log(smsSentSuccessfully);
    const token = await createLoginUserModel(phone, smsSentSuccessfully);
    console.log(token);
    return res.status(200).json({ token });
  } catch (error) {
    res.status(500).json(error);
  }
};

const verify = async (req, res) => {
  const token = req.headers.authorization;
  const code = req.body.code;

  try {
    const decode = decodedToken(token);
    if (!decode) return res.status(401).json("invalid token");
    console.log(decode);
    const _id = decode._id;
    const phone = decode.phone;
    const findSms = await findSmsCode(_id);
    console.log(findSms);
    if (!findSms) return res.status(400).json("Invalid request");

    if (phone !== findSms.phone) return res.status(401).json("Invalid Token");
    console.log(code);
    if (code !== findSms.code) return res.status(400).json("invalid sms code");

    let user = await findUserByPhoneNumber(phone);
    if (user.length > 0) {
      const token = generateTokenForUser(user[0]._id, user[0].phone);
      console.log(token);
      await deleteSmsCode(_id);
      return res.status(200).json({ token });
    }

    const newUser = await createUser(phone);
    console.log(newUser);
    const newtoken = generateTokenForUser(newUser[0]._id, newUser[0].phone);
    await deleteSmsCode(_id);
    res.status(200).json({ message: "Login successful", token: newtoken });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { login, verify };
