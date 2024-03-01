import UserModel from "../models/UserModel.js";
import bcrypt, { compare, genSalt, hash } from "bcrypt";
import genAuthToken from "../utils/genAuthToken.js";
import jwt from "jsonwebtoken";

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

export const LoginWithMail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) return res.status(404).json("User not found");
    const person = genAuthToken(user);
    res.status(200).json(person);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const RegisterWithMoile = async (req, res) => {
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
    const token = jwt.sign({ user }, process.env.AUTH_KEY);
    res.status(201).json(user);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const MobileLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email }).select(
      "-notification -accounts -ideas -community -networks -channels -setups"
    );
    if (!user) return res.status(404).json("User not found");
    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(403).json("Invaild Password");
    res.status(200).json(user);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const findSwitchUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    const switchUser = {
      token: genAuthToken(user),
      id: user?._id,
      name: user?.name,
      email: user?.email,
      username: user?.username,
      profile: user?.profile,
    };
    return res.status(200).json(switchUser);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};
