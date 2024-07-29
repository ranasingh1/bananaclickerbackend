import express from "express";
import { login, logout } from "../controllers/auth.js";
import { getUser } from "../controllers/user.js";

const router = express.Router();

router.post("/login", login);

router.post("/logout", logout);

router.get("/getUser/:id", getUser);


export default router;
