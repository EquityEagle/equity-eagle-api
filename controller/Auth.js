import UserModel from "../models/UserModel.js";
import bcrypt, { compare, genSalt, hash } from "bcrypt";
import genAuthToken from "../utils/genAuthToken.js";

export const RegisterUser = async (req, res) => {
  try {
    const { email, password, name, username } = req.body;
    const User = await UserModel.findOne({ email: email });
    if (User)
      return res
        .status(403)
        .json("The provided email address is already registered");
    const isUsername = await UserModel.findOne({ username: username });
    if (isUsername) return res.status(403).json("Username taken");
    const salt = await genSalt(12);
    const hashedPassword = await hash(password, salt);

    const auth = new UserModel({
      email: email,
      username: username,
      name: name,
      password: hashedPassword,
    });
    const user = await auth.save();
    const token = genAuthToken(user);
    res.status(201).json(token);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) return res.status(404).json("User not found");
    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(403).json("Invaild Password");
    const token = genAuthToken(user);
    res.status(200).json(token);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};
