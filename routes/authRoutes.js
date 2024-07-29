import express from "express";
import { login } from "../controllers/auth.js";
import { getUser } from "../controllers/user.js";

const router = express.Router();

router.post("/login", login);


router.get("/getUser/:id", getUser);


export default router;
