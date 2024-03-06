const validator = require("validator");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");

const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, bio, birthYear } = req.body;

    //required fields checking
    if (!email || !name || !password)
      throw new Error(
        "All required field must be filled before moving onto the next step."
      );

    //email validator
    if (!validator.isEmail(email)) throw new Error("Invalid email!");

    //password requirement
    if (!validator.isStrongPassword(password))
      throw new Error(
        "Password must have at least 8 digits containing lowercase,uppercase, numeric and symbol"
      );

    //check if the user exist or not
    const isExist = await userModel.findOne({ email });

    if (isExist) throw new Error("Email already in use.");

    //password encryption
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //create a new user
    const user = await userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      bio,
      birthYear,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //required fields
    if (!email || !password)
      throw new Error(
        "All required field must be filled before moving onto the next step."
      );

    //check user existence
    const user = await userModel.findOne({ email });

    if(!user) throw new Error("User not found.")

    //password decryption
    const match = await bcrypt.compare(password, user.password)

    if (!match) throw new Error("User not found.")

    res.status(200).json(user)
  } catch (error) {}
};

module.exports = { createUser, loginUser };
