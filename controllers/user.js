import { User } from "../db/models/user.js";
import bcrypt from "bcrypt";

//------------CREATE----------//

export const createUser = async (req, res) => {
  const { username, password, role, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role, email });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

//------------READ -----------//

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//------------UPDATE-----------//

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, role, isActive, isBlocked } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.role = role || user.role;
    user.isActive = isActive !== undefined ? isActive : user.isActive;
    user.isBlocked = isBlocked !== undefined ? isBlocked : user.isBlocked;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//------------DELETE USER-----------//

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//------------BLOCK/UNBLOCK-----------//

export const blockuser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isBlocked = true;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const unblockuser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isBlocked = false;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
