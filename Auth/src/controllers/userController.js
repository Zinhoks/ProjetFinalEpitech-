const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "NOTESAPI";

const signup = async (req, res) => {
  const { username, email, password, status, address } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await new userModel();
    result.email = email;
    result.password = hashedPassword;
    result.username = username;
    result.token = "";
    result.status = status;
    result.address = address;
    await result.save();

    const token = await jwt.sign(
      { email: result.email, id: result._id },
      SECRET_KEY
    );

    res.status(201).json({ user:  {...result}, token: token });
    result.token = token;
    result.save();
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur dans le code" });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "invalid mdp or email" });
    }
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET_KEY
    );
    res.status(201).json({ user: existingUser, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur dans le code" });
  }
};

module.exports = { signup, signin };
