import { User } from "../db/models/user.js";
import bcrypt from "bcrypt";
import createError from "../middleware/error.js";
import jwt from "jsonwebtoken";

//------------LOGIN-----------//

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(createError(400, "Wrong Email or Password!"));
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT,
      { expiresIn: "1d" }
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.send("Logged in successfully");
  } catch (err) {
    console.log(err)
    next(err);
  }
};

//------------LOGOUT-----------//
0;

export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.send("Logged out successfully");
};
