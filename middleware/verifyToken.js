import jwt from "jsonwebtoken";
import createError from "./error.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req?.headers?.authorization;
  console.log(authHeader, `s`)
  const token = authHeader?.startsWith('Bearer') ? authHeader.split(' ')[1] : null;
  console.log(token, 'token');
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      return next(createError(403, "Token is not valid!"));
    }
    req.user = user;
    next();
  });
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

export const verifyAdmin = authorizeRoles("admin");
