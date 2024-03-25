const jwt = require("jsonwebtoken");
const decodedToken = require("../jwt");
const { findUserByPhoneNumber } = require("../user/user.service");
const authModel = require("./auth.model");
const userModel = require("../user/user.model");

const generateTokenForUser = (_id, phone) => {
  const jwtkey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id, phone }, jwtkey, { expiresIn: "3h" });
};

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

    if (!phone) return res.status(400).json("Phone number is required.");

    if (!armenianPhoneNumberRegex.test(phone))
      return res.status(400).json("Invalid Armenian phone number");

    const smsSentSuccessfully = await generateRandomCode(6);

    if (!smsSentSuccessfully)
      return res.status(400).json("Invalid Armenian phone number");
    console.log(smsSentSuccessfully);
    const sms = new authModel({
      phone: phone,
      code: smsSentSuccessfully,
    });
    console.log(sms._id, sms.phone);
    const token = generateTokenForUser(sms._id, sms.phone);
    await sms.save();
    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const verify = async (req, res) => {
  const token = req.headers.authorization;
  const code = req.body.code;
  console.log(code);
  const decode = decodedToken(token);
  const _id = decode._id;
  const phone = decode.phone;

  try {
    let findSms = await authModel.findById({ _id });
    console.log(findSms);
    if (!findSms) return res.status(400).json("Invalid request");

    if (phone !== findSms.phone) return res.status(401).json("Invalid Token");
    if (code !== findSms.code) return res.status(400).json("invalid sms code");
    let user = await findUserByPhoneNumber({ phone });
    console.log(user);
    if (user) {
      console.log(user);
      console.log("User exists:", user._id, user.phone);
      const token = generateTokenForUser(user._id, user.phone);
      console.log("Generated Token:", token);
      return res.status(200).json({ token });
    }

    let newUser = await new userModel({ phone: phone });
    newUser.save();
    console.log(newUser);
    const newtoken = generateTokenForUser(newUser._id, newUser.phone);

    res.status(200).json({ message: "Login successful", token: newtoken });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { login, verify };
