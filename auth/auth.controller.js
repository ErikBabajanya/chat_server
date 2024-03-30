const jwt = require("jsonwebtoken");
const { decodedToken, generateTokenForUser } = require("../jwt/jwt");
const {
  createLoginUserModel,
  findSmsCode,
  deleteSmsCode,
} = require("./auth.service");
const { findUserByPhoneNumber } = require("../user/user.service");
const authModel = require("./auth.model");
const userModel = require("../user/user.model");

const generateRandomCode = (length) => {
  const digits = "0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    code += digits.charAt(randomIndex);
  }

  return code;
};

const login = async (req, res) => {
  try {
    const phone = req.body.phone;
    const armenianPhoneNumberRegex =
      /^(374|\+374|0)(94|91|55|77|93|98|96|99|41|43|45|47|60|61|62|63|64|65|66|67|68|69|94|95|97|41|43|44|46|47|49|94|96|97|98|99)(\d{6}|\d{5})$/;
    console.log(phone);
    if (!phone) return res.status(400).json("Phone number is required.");

    if (!armenianPhoneNumberRegex.test(phone))
      return res.status(400).json("Invalid Armenian phone number");

    const smsSentSuccessfully = await generateRandomCode(6);

    if (!smsSentSuccessfully)
      return res.status(400).json("Invalid Armenian phone number");

    const token = await createLoginUserModel(phone, smsSentSuccessfully);
    if (!token) return res.status(404).json("Authtentication feild");

    return res.status(200).json({ token });
  } catch (error) {
    res.status(500).json(error);
  }
};

const verify = async (req, res) => {
  const token = req.headers.authorization;
  const code = req.body.code;

  try {
    const decode = await decodedToken(token);
    if (!decode) return res.status(401).json("invalid token");
    const _id = decode._id;
    const phone = decode.phone;
    const findSms = await findSmsCode(_id);
    if (!findSms) return res.status(400).json("Invalid request");

    if (phone !== findSms.phone) return res.status(401).json("Invalid Token");
    if (code !== findSms.code) return res.status(400).json("invalid sms code");
    let user = await findUserByPhoneNumber({ phone });

    if (user) {
      const token = generateTokenForUser(user._id, user.phone);
      await deleteSmsCode(_id);
      return res.status(200).json({ token });
    }

    const newUser = createUser(phone);

    const newtoken = generateTokenForUser(newUser._id, newUser.phone);
    await deleteSmsCode(_id);
    res.status(200).json({ message: "Login successful", token: newtoken });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { login, verify };
