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

    console.log("Token generated:", token);

    
    res.json({ message: "Logged in successfully", token });

    res.send("Logged in successfully");
  } catch (err) {
    console.log(err)
    next(err);
  }
};

//------------LOGOUT-----------//

